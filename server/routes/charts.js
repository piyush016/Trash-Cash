const express = require("express");
const { authMiddleWare } = require("../middleware/auth");
const { Account } = require("../models/account");

const router = express.Router();

router.get("/credeb", authMiddleWare, async (req, res) => {
  try {
    const { timeFrame } = req.query;
    const account = await Account.findOne({
      userId: req.userId,
    });

    // Check if account exists
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const allTransactions = account.transactions;

    let chartData;
    switch (timeFrame) {
      case "day":
        chartData = generateDayChartData(allTransactions);
        break;
      case "week":
        chartData = generateWeekChartData(allTransactions);
        break;
      case "month":
        chartData = generateMonthChartData(allTransactions);
        break;
      case "year":
        chartData = generateYearChartData(allTransactions);
        break;
      default:
        return res.status(400).json({ error: "Invalid time frame" });
    }

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to generate chart data for the past 30 days
function generateDayChartData(transactions) {
  const chartData = [];
  const currentDate = new Date();

  for (let i = 14; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    const credit = transactions
      .filter(
        (transaction) =>
          isSameDay(new Date(transaction.date), date) && transaction.isCredit
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    const debit = transactions
      .filter(
        (transaction) =>
          isSameDay(new Date(transaction.date), date) && !transaction.isCredit
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    chartData.push({ date: formatDate(date, "YYYY-MM-DD"), credit, debit });
  }

  return chartData;
}

// Function to generate chart data for the past 12 weeks
function generateWeekChartData(transactions) {
  const chartData = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - i * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    const credit = transactions
      .filter(
        (transaction) =>
          isWithinWeek(new Date(transaction.date), startDate, endDate) &&
          transaction.isCredit
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    const debit = transactions
      .filter(
        (transaction) =>
          isWithinWeek(new Date(transaction.date), startDate, endDate) &&
          !transaction.isCredit
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    chartData.push({
      date: formatDate(startDate, "YYYY-MM-DD"),
      credit,
      debit,
    });
  }

  return chartData;
}

// Function to generate chart data for the past 12 months
function generateMonthChartData(transactions) {
  const chartData = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    );
    const credit = transactions
      .filter(
        (transaction) =>
          isWithinMonth(new Date(transaction.date), startDate, endDate) &&
          transaction.isCredit
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    const debit = transactions
      .filter(
        (transaction) =>
          isWithinMonth(new Date(transaction.date), startDate, endDate) &&
          !transaction.isCredit
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    chartData.push({ date: formatDate(startDate, "YYYY-MM"), credit, debit });
  }

  return chartData;
}

// Function to generate chart data for the past 3 years
function generateYearChartData(transactions) {
  const chartData = [];
  const currentDate = new Date();

  for (let i = 2; i >= 0; i--) {
    const startDate = new Date(currentDate.getFullYear() - i, 0, 1);
    const endDate = new Date(currentDate.getFullYear() - i + 1, 0, 0);
    const credit = transactions
      .filter(
        (transaction) =>
          isWithinYear(new Date(transaction.date), startDate, endDate) &&
          transaction.isCredit
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    const debit = transactions
      .filter(
        (transaction) =>
          isWithinYear(new Date(transaction.date), startDate, endDate) &&
          !transaction.isCredit
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    chartData.push({ date: startDate.getFullYear(), credit, debit });
  }

  return chartData;
}

// Function to check if two dates are within the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Function to check if a date is within a week
function isWithinWeek(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

// Function to check if a date is within a month
function isWithinMonth(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

// Function to check if a date is within a year
function isWithinYear(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

// Function to format date in YYYY-MM-DD or YYYY-MM format
function formatDate(date, format) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  format = format.replace("YYYY", year);
  format = format.replace("MM", month);
  format = format.replace("DD", day);

  return format;
}

module.exports = router;
