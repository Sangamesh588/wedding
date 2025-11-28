const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Admin = require("./models/Admin");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function createAdmin() {
  const username = "admin";      // CHANGE if you want
  const password = "admin123";   // CHANGE if you want

  const hashed = await bcrypt.hash(password, 10);

  const admin = new Admin({ username, password: hashed });

  await admin.save();

  console.log("Admin created successfully:");
  console.log("Username:", username);
  console.log("Password:", password);

  mongoose.connection.close();
}

createAdmin();
