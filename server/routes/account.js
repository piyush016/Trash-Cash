const express = require("express");
const mongoose = require("mongoose");
const { authMiddleWare } = require("../middleware/auth");
const { Account } = require("../models/account");

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

  await session.commitTransaction();
  res.json({
    message: "Transfer Successful",
  });
});

router.post("/loan", authMiddleWare, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      amount,
      timePeriod,
      reason,
      rate,
      totalInterest,
      calculatedLoanAmount,
      bankCharges,
      monthlyPayment,
    } = req.body;

    // Check if the user has taken any loan in the last 1 week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const userLoans = await Account.findOne({
      userId: req.userId,
      "loans.createdAt": { $gte: oneWeekAgo },
    }).session(session);

    if (userLoans) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "You have already taken a loan in the last 1 week.",
      });
    }

    // Check if the user has reached the maximum limit of 3 loans
    const userAccount = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!userAccount || userAccount.loans.length >= 3) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "You have reached the maximum limit of 3 loans.",
      });
    }

    // Check if the loan amount exceeds 50% of the available balance
    if (amount > userAccount.balance * 0.5) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Loan amount exceeds 50% of the available balance.",
      });
    }

    // Update user's balance with the loan amount
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: amount } }
    ).session(session);

    // Create a new loan object
    const loan = {
      amount,
      timePeriod,
      reason,
      rate,
      totalInterest,
      calculatedLoanAmount,
      bankCharges,
      monthlyPayment,
    };

    // Save the loan in the user's account
    await Account.updateOne(
      { userId: req.userId },
      { $push: { loans: loan } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Loan application submitted successfully!",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Failed to submit loan application. Please try again later.",
    });
  }
});

module.exports = router;
