require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Render MongoDB");

    const hash = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      password: hash
    });

    console.log("✨ Admin created successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
})();
