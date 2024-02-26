const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
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

module.exports = router;
