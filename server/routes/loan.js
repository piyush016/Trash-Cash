const express = require("express");
const mongoose = require("mongoose");
const { authMiddleWare } = require("../middleware/auth");
const { Account } = require("../models/account");

const router = express.Router();

router.post("/apply", authMiddleWare, async (req, res) => {
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

    if (amount > userAccount.balance * 0.5) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Loan amount exceeds 50% of the available balance.",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: amount } }
    ).session(session);

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

    await Account.updateOne(
      { userId: req.userId },
      { $push: { loans: loan } }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

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

router.get("/active", authMiddleWare, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });
    if (!account) {
      return res.status(404).json({ message: "User account not found" });
    }

    const activeLoan = account.loans;

    res.status(200).json(activeLoan);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
