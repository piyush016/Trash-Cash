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
  const account = await Account.findOne({
    userId: req.userId,
  });
  res.json({
    transactions: account.transactions,
  });
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

module.exports = router;
