const express = require("express");
const mongoose = require("mongoose");
const { authMiddleWare } = require("../middleware/auth");
const { Account } = require("../models/account");
const { getSession } = require("../config/sessionManager");
const router = express.Router();

router.get("/balance", authMiddleWare, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

router.get("/transactions", authMiddleWare, async (req, res) => {
  const { date } = req.query;
  let transactions = [];

  const account = await Account.findOne({
    userId: req.userId,
  });

  if (!date) {
    transactions = account.transactions;
  } else if (date === "today") {
    const today = new Date();
    const todayTransactions = account.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getFullYear() === today.getFullYear() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getDate() === today.getDate()
      );
    });
    transactions = todayTransactions;
  }

  res.json({
    transactions,
  });
});

router.get("/passbook", authMiddleWare, async (req, res) => {
  const { from, to } = req.query;
  let transactions = [];

  try {
    const account = await Account.findOne({
      userId: req.userId,
    });

    if (!from || !to) {
      transactions = account.transactions;
    } else {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const filteredTransactions = account.transactions.filter(
        (transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= fromDate && transactionDate <= toDate;
        }
      );
      transactions = filteredTransactions;
    }

    res.json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transfer", authMiddleWare, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;

  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient Balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid sender account",
    });
  }

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  await Account.updateOne(
    { userId: req.userId },
    {
      $push: {
        transactions: {
          $each: [{ amount, isCredit: false, otherPartyUserId: to }],
          $position: 0,
        },
      },
    }
  ).session(session);

  await Account.updateOne(
    { userId: to },
    {
      $push: {
        transactions: {
          $each: [{ amount, isCredit: true, otherPartyUserId: req.userId }],
          $position: 0,
        },
      },
    }
  ).session(session);

  const socket = getSession(to);
  if (socket) {
    socket.emit(
      "notification",
      `Account has been credited with amount ₹${amount}.`
    );
    await Account.updateOne(
      { userId: to },
      {
        $push: {
          notifications: {
            message: `Account has been credited with amount ₹${amount}.`,
            createdAt: new Date(),
          },
        },
      }
    ).session(session);
  } else {
    await Account.updateOne(
      { userId: to },
      {
        $push: {
          notifications: {
            message: `Account has been credited with amount ₹${amount}.`,
            createdAt: new Date(),
          },
        },
      }
    ).session(session);
  }

  await session.commitTransaction();
  res.json({
    message: "Transfer Successful",
  });
});

module.exports = router;
