const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/users'); // Tera User schema

// 🚨 YAHAN APNI MONGODB KI LINK DAALNA MAT BHOOLNA!
// (Jo tere index.js ya .env file mein hai)
const MONGO_URI = "mongodb://deveshhegde04_db_user:aloonobatata@ac-ebwc1rz-shard-00-00.yzk94jv.mongodb.net:27017,ac-ebwc1rz-shard-00-01.yzk94jv.mongodb.net:27017,ac-ebwc1rz-shard-00-02.yzk94jv.mongodb.net:27017/?ssl=true&replicaSet=atlas-4zngg5-shard-0&authSource=admin&appName=Cluster0";

const createTestReceptionist = async () => {
    try {
        // 1. Database se connect karo
        console.log("⏳ Connecting to Database...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected!");

        // 2. Check karo agar pehle se account hai toh
        const existingUser = await User.findOne({ username: "recep1" });
        if (existingUser) {
            console.log("⚠️ Account pehle se bana hua hai bhai!");
            process.exit();
        }

        // 3. Password Encrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("mediflow420", salt);

        // 4. Receptionist ka Data banao
        const testReceptionist = new User({
            username: "admin1",
            password: hashedPassword,
            name: "Devesh (tech developer)",
            mobile: "9082240521",
            age: 69,
            role: "receptionist",
            status: "Active"
        });

        // 5. Database mein Save karo
        await testReceptionist.save();

        console.log("🎉 SUCCESS! Test Receptionist Account Created.");
        console.log("-----------------------------------------");
        console.log("👉 Login ID: admin1");
        console.log("👉 Password: mediflow123");
        console.log("-----------------------------------------");

        process.exit();

    } catch (error) {
        console.error("❌ Gadbad ho gayi:", error);
        process.exit(1);
    }
};

// Function ko chalu karo
createTestReceptionist();