const express = require("express");
const { Account } = require("../models/account");
const { authMiddleWare } = require("../middleware/auth");
const router = express.Router();

router.get("/all", authMiddleWare, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const account = await Account.findOne({ userId: req.userId });

    account.notifications = account.notifications.filter(
      (notification) => new Date(notification.createdAt) >= today
    );
    await account.save();

    res.json({ notifications: account.notifications });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
