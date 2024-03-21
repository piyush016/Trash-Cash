const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  isCredit: {
    type: Boolean,
    required: true,
  },
  otherPartyUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const loanSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  timePeriod: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  totalInterest: {
    type: Number,
    required: true,
  },
  calculatedLoanAmount: {
    type: Number,
    required: true,
  },
  bankCharges: {
    type: Number,
    default: 100,
  },
  monthlyPayment: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  transactions: [transactionSchema],
  loans: [loanSchema],
  notifications: [notificationSchema],
});

const Account = mongoose.model("Account", accountSchema);

module.exports = { Account };
