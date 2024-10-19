const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  title: String,
  description: String,
  wordCount: Number,
  timestamp: Date,
});

module.exports = mongoose.model("Data", dataSchema);
