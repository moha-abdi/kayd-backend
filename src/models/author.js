const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    penName: { type: String },
  },
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("authors", authorSchema);
