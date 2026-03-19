/* eslint-env node */
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
// Force Google DNS to bypass ISP blocking MongoDB SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- MONGO_DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ CONNECT HOGYA!, NACCHOOO NACCCHOOOO"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// --- API ROUTES ---
app.use('/api', authRoutes);             // POST /api/login, POST /api/register
app.use('/api/patients', patientRoutes); // GET/POST/PATCH/DELETE /api/patients

// ROOT ROUTE (Health Check)
app.get('/', (req, res) => {
    res.send("MediMaster Backend is Running! 🏥");
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});