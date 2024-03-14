const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { authMiddleWare } = require("../middleware/auth");
const { User } = require("../models/user");
const { Account } = require("../models/account");
require("dotenv").config();

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
  const user = User.findOne({
    username: req.body.username,
  });

  if (user) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  const dbUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = dbUser._id;
  await Account.create({
    userId,
    balance: 1 + Math.random() * 100000,
  });

  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    process.env.JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
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
    });
    return;
  }
  res.status(411).json({ message: "Error while logging in!" });
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
    console.error("Error updating profile:", error);
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
        password: undefined,
      });
    }
  } catch (err) {
    console.error(err);
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
    console.error("Error finding user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
