/* eslint-env node */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes'); // Tera naya Waiter

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Ye hamesha routes se upar hona chahiye

// --- MONGO_DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ CONNECT HOGYA!, NACCHOOO NACCCHOOOO"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// --- ROUTES ---
app.use('/api', userRoutes);

// ROOT ROUTE (Health Check)
app.get('/', (req, res) => {
    res.send("MediFlow Backend is Running! 🏥");
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});