const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.info(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, phone, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = new User({ username, phone, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error("user is there:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    console.log("user is:", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
