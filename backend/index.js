/* eslint-env node */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User=require('./models/users');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors()); // Allows Frontend to talk to Backend
app.use(express.json()); // Parses incoming JSON data


// --- MONGODB CONNECTION  ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ CONNECT HOGYA!,NACCHOOO NACCCHOOOO"))
    .catch(err => console.log("❌ DB Connection Error:", err));

app.post('/api/registration', async(req,res)=>{
    try {
        const { mobile,password,name }=req.body;
        let user = await User.findOne({mobile});
        if(user) return res.status(400).json({message:"user already exists!"});

    } catch (err){
        res.status(500).json({message:"server error"})
    }
}
// --- 1. HARDCODED USER DATABASE (The "Judgxe's Book") ---
const USERS_DB = {
    '9082240521': {
        password: 'aloo',
        profiles: [
            { id: 1, name: 'Aloo no batata', role: 'patient', age: 34, relation: 'Self' },
            { id: 2, name: 'Tamata with tomato', role: 'patient', age: 6, relation: 'Son' }
        ]
    },
    '8369930634': {
        password: '1234',
        profiles: [{ id: 69, name: 'Jalahua Anada', role: 'receptionist' }]
    },
    '8104503411': {
        password: '4321',
        profiles: [{ id: 69, name: 'Jalahua Anada', role: 'receptionist-v1' }]
    }
};

// --- 2. HARDCODED PATIENTS LIST (For Dashboard) ---
const MOCK_PATIENTS = [
    { id: 101, token: 101, name: "Rohan Sharma", age: 24, doctor: "Dr. A. Gupta", time: "10:30 AM", status: "waiting", phone: "9876543210", gender: "Male" },
    { id: 102, token: 102, name: "Anjali Verma", age: 34, doctor: "Dr. S. Khan", time: "10:45 AM", status: "in-progress", phone: "8369930634", gender: "Female" },
    { id: 103, token: 103, name: "Vikram Singh", age: 56, doctor: "Dr. A. Gupta", time: "10:00 AM", status: "done", phone: "8104503411", gender: "Male" }
];


// --- 3. ROUTES ---

// LOGIN ROUTE (The True/False Logic)
app.post('/api/login', (req, res) => {
    const { mobile, password } = req.body;

    console.log(`Login Attempt: Mobile: ${mobile}, Pass: ${password}`);

    // Check if user exists in our hardcoded DB
    const user = USERS_DB[mobile];

    // LOGIC: If User Exists AND Password Matches
    if (user && user.password === password) {
        console.log("✅ Access Granted");
        res.json({
            success: true,
            message: "Login Successful",
            profiles: user.profiles // Send profiles for the selector screen
        });
    } else {
        console.log("❌ Access Denied");
        res.status(401).json({
            success: false,
            message: "Invalid Credentials! Please check your number or password."
        });
    }
});

// GET PATIENTS ROUTE (For Receptionist Dashboard)
app.get('/api/patients', (req, res) => {
    res.json(MOCK_PATIENTS);
});

// ROOT ROUTE (To check if server is alive)
app.get('/', (req, res) => {
    res.send("MediFlow Backend is Running! 🏥");
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});