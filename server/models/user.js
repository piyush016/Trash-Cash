const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 25,
  },
  password: { type: String, required: true, minLength: 6, maxLength: 25 },
  firstName: { type: String, required: true, trim: true, maxLength: 50 },
  lastName: { type: String, required: true, trim: true, maxLength: 50 },
  dateOfBirth: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
