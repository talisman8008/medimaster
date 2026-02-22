/* eslint-env node */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');//pass hashing
const User = require('./models/users'); //user schema
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- MONGO_DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ CONNECT HOGYA!, NACCHOOO NACCCHOOOO"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// ---  ROUTES ---

// A. REGISTRATION ROUTE (Save to Atlas)
app.post('/api/register', async (req, res) => {
    try {
        const { mobile, password, name, role, age, relation } = req.body;

        // Check if user already exists
        let user = await User.findOne({ mobile });
        if (user) return res.status(400).json({ message: "Mobile already registered!" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user using your schema
        const newUser = new User({
            mobile,
            password: hashedPassword,
            profiles: [{
                name,
                role: role || 'patient',
                age: age || 0,
                relation: relation || 'Self',
                status: false
            }]
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Registered Successfully! 🚀" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// B. LOGIN ROUTE (Verify from Atlas)
app.post('/api/login', async (req, res) => {
    const { mobile, password } = req.body;
    console.log(`Login Attempt: Mobile: ${mobile}`);

    try {
        // Find user in MongoDB
        const user = await User.findOne({ mobile });

        if (user && await bcrypt.compare(password, user.password)) {
            console.log("✅ Access Granted via Atlas");
            res.json({
                success: true,
                message: "Login Successful",
                profiles: user.profiles
            });
        } else {
            console.log("❌ Access Denied");
            res.status(401).json({
                success: false,
                message: "Invalid Credentials! Register first if you haven't."
            });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// ROOT ROUTE (Health Check)
app.get('/', (req, res) => {
    res.send("MediFlow Backend is Running! 🏥");
});

// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});