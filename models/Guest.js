const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  attending: Boolean,
  guestsCount: Number,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Guest", guestSchema);
