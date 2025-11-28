const mongoose = require("mongoose");

const wishSchema = new mongoose.Schema({
  name: String,
  wish: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Wish", wishSchema);
