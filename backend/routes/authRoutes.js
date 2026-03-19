/* eslint-env node */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/**
 * Generate JWT token
 */
const generateToken = (user, profile) => {
    return jwt.sign(
        {
            userId: user._id,
            role: profile.role,
            name: profile.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

/**
 * POST /api/login
 * Staff login — receptionist, doctor, nurse, admin
 */
router.post('/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ success: false, message: 'Mobile and password are required.' });
        }

        console.log(`🔑 Login Attempt: ${mobile}`);

        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('❌ Access Denied');
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const profile = user.profiles[0];

        console.log(`✅ Access Granted — ${profile.name} (${profile.role})`);

        const token = generateToken(user, profile);

        res.json({
            success: true,
            message: 'Login Successful',
            token,
            profiles: user.profiles,
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
});

/**
 * POST /api/admin/create-staff
 * Admin-only — create staff accounts (receptionist, doctor, nurse)
 */
router.post('/admin/create-staff', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const { mobile, password, name, role } = req.body;

        // Validate
        const allowedRoles = ['receptionist', 'doctor', 'nurse'];
        if (!mobile || !password || !name || !role) {
            return res.status(400).json({ success: false, message: 'Mobile, password, name, and role are required.' });
        }
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: `Role must be one of: ${allowedRoles.join(', ')}` });
        }

        // Check existing
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Mobile already registered!' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            mobile,
            password: hashedPassword,
            profiles: [{
                name,
                role,
                age: 0,
                relation: 'Self',
                status: false,
            }],
        });

        await newUser.save();

        console.log(`👤 Staff created: ${name} (${role}) by Admin ${req.user.name}`);

        res.status(201).json({
            success: true,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created for ${name}!`,
            staff: { name, role, mobile },
        });
    } catch (err) {
        console.error('Create Staff Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
});

/**
 * GET /api/admin/staff
 * Admin-only — list all staff accounts
 */
router.get('/admin/staff', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const staff = await User.find({ 'profiles.role': { $in: ['receptionist', 'doctor', 'nurse', 'admin', 'patient'] } })
            .select('-password')
            .sort({ 'profiles.role': 1 });

        res.json({ success: true, staff });
    } catch (err) {
        console.error('List Staff Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
});

/**
 * GET /api/staff/doctors
 * Accessible to all staff — lists users with role 'doctor'
 */
router.get('/staff/doctors', authMiddleware, async (req, res) => {
    try {
        const doctors = await User.find({ 'profiles.role': 'doctor' })
            .select('-password -__v');
        
        // Map to a clean array of just the doctor profiles + mobile
        const doctorList = doctors.map(doc => {
            const profile = doc.profiles.find(p => p.role === 'doctor');
            return {
                id: doc._id,
                name: profile.name,
                mobile: doc.mobile
            };
        });

        res.json({ success: true, doctors: doctorList });
    } catch (err) {
        console.error('Fetch Doctors Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch doctors.', error: err.message });
    }
});

/**
 * POST /api/receptionist/create-patient
 * Receptionist-only — create patient login accounts
 */
router.post('/receptionist/create-patient', authMiddleware, requireRole('receptionist', 'admin'), async (req, res) => {
    try {
        const { mobile, password, name, age } = req.body;

        if (!mobile || !password || !name) {
            return res.status(400).json({ success: false, message: 'Mobile, password, and name are required.' });
        }

        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Mobile already registered!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            mobile,
            password: hashedPassword,
            profiles: [{
                name,
                role: 'patient',
                age: age || 0,
                relation: 'Self',
                status: false,
            }],
        });

        await newUser.save();

        console.log(`🏥 Patient account created: ${name} by ${req.user.name} (${req.user.role})`);

        res.status(201).json({
            success: true,
            message: `Patient account created for ${name}!`,
            patient: { name, mobile },
        });
    } catch (err) {
        console.error('Create Patient Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
});

module.exports = router;
