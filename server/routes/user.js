const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
import { authMiddleWare } from "../middleware/auth";
import { User } from "../models/user";
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  password: zod.string(),
});
router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid request" });
  }
  const user = User.findOne({
    usrename: body.username,
  });

  if (user._id) {
    return res.json({
      message: "User already exists",
    });
  }
  const dbUser = await User.create(body);
  const token = jwt.sign({
    userId: jwt.sign(
      {
        userId: dbUser._id,
      },
      JWT_SECRET
    ),
  });
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
      JWT_SECRET
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
});
router.put("/update-profile", authMiddleWare, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(401).json({ message: "Error while updating profile!" });
  }
  await User.updateOne(req.body, {
    id: req.userId,
  });

  res.json({
    message: "Profile updated successfully",
  });
});

router.get("/search-user", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
