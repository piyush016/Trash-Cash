const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { authMiddleWare } = require("../middleware/auth");
const { User } = require("../models/user");
const { Account } = require("../models/account");
require("dotenv").config();

const router = express.Router();

const signupSchema = zod.object({
  username: zod.string().email(),
  lastName: zod.string(),
  firstName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      code: "0000"
    });

    const userId = newUser._id;
    await Account.create({
      userId,
      balance: 1 + Math.random() * 100000,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token: token,
      email: newUser.username,
      _id: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ message: "Incorrect inputs" });
  }
  let user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );
    res.json({
      token: token,
      email: user.username,
      _id: user._id,
    });
    return;
  }
  res.status(411).json({ message: "Wrong email or password!" });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  username: zod.string().optional(),
  code: zod.string().optional(),
});
router.put("/update-profile", authMiddleWare, async (req, res) => {
  const { success, data } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Error while updating profile!" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      { $set: data }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", authMiddleWare, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    if (user) {
      return res.status(200).json({
        ...user._doc,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
router.get("/search-user", authMiddleWare, async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        username: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });

  res.json({
    users: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

router.post("/security-check", authMiddleWare, async (req, res) => {
  const code = req.body.code;

  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });

    if (user) {
      if (user.code === code)
        return res.status(200).json({ success: true, message: "Successful" });
      else
        return res
          .status(401)
          .json({ success: false, message: "Wrong security code" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/me", authMiddleWare, async (req, res) => {
  const user = await User.findOne({
    _id: req.userId,
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
  }
  res.json({
    name: user.firstName,
    email: user.username,
  });
});

module.exports = router;
