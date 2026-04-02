const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/users'); //  User schema
require('dotenv').config();


const MONGO_URI = process.env.MONGO_URI;
const createTestReceptionist = async () => {
    try {
        console.log("⏳ Connecting to Database...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected!");

        const existingUser = await User.findOne({ username: "admin" });
        if (existingUser) {
            console.log("⚠️ Account pehle se bana hua hai bhai!");
            process.exit();
        }

        // 3. Password Encrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("4321", salt);

        // 4. Receptionist ka Data
        const testReceptionist = new User({
            username: "admin",
            password: hashedPassword,
            name: "dev (tech developer)",
            mobile: "9967844854",
            age: 69,
            role: "receptionist",
            status: "Active"
        });

        // 5. Database mein Save karo
        await testReceptionist.save();

        console.log("🎉 SUCCESS! Test Receptionist Account Created.");
        console.log("-----------------------------------------");
        console.log("👉 Login ID: admin");
        console.log("👉 Password: 4321");
        console.log("-----------------------------------------");

        process.exit();

    } catch (error) {
        console.error("❌ Gadbad ho gayi:", error);
        process.exit(1);
    }
};

// Function ko chalu karo
createTestReceptionist();