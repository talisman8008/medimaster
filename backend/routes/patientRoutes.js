/* eslint-env node */
const express = require('express');
const Patient = require('../models/Patient');
const User = require('../models/users');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// All patient routes require authentication
router.use(authMiddleware);

/**
 * GET /api/patients
 * Fetch today's patients, sorted by token number
 */
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const filter = {
            createdAt: { $gte: todayStart, $lte: todayEnd },
        };

        if (status) filter.status = status;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search } },
            ];
        }

        const patients = await Patient.find(filter).sort({ token: 1 });

        res.json({ success: true, patients });
    } catch (err) {
        console.error('Fetch Patients Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch patients.', error: err.message });
    }
});

/**
 * GET /api/patients/stats
 * Dashboard stats for today
 */
router.get('/stats', async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayFilter = { createdAt: { $gte: todayStart, $lte: todayEnd } };

        const [total, waiting, inProgress, done] = await Promise.all([
            Patient.countDocuments(todayFilter),
            Patient.countDocuments({ ...todayFilter, status: 'waiting' }),
            Patient.countDocuments({ ...todayFilter, status: 'in-progress' }),
            Patient.countDocuments({ ...todayFilter, status: 'done' }),
        ]);

        res.json({
            success: true,
            stats: { total, waiting, inProgress, done },
        });
    } catch (err) {
        console.error('Stats Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch stats.', error: err.message });
    }
});

/**
 * GET /api/patients/my-token
 * Fetch the logged-in patient's current active token
 */
router.get('/my-token', requireRole('patient'), async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Find patient with matching phone number created today
        const patient = await Patient.findOne({
            phone: user.mobile,
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        if (!patient) {
            return res.status(404).json({ success: false, message: 'No active token found for today. Please visit the reception to register.' });
        }

        // Calculate queue position (how many waiting/in-progress patients are ahead of them)
        const aheadCount = await Patient.countDocuments({
            createdAt: { $gte: todayStart, $lte: todayEnd },
            status: { $in: ['waiting', 'in-progress'] },
            token: { $lt: patient.token }
        });

        res.json({
            success: true,
            patient,
            aheadCount,
            estimatedWaitMinutes: aheadCount * 10 // rough estimate: 10 mins per patient
        });
    } catch (err) {
        console.error('Fetch My Token Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch token status.', error: err.message });
    }
});

/**
 * GET /api/patients/search-user
 * Search for a registered patient in the Users table by name or mobile number
 */
router.get('/search-user', requireRole('receptionist', 'admin'), async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: 'Search query (q) parameter is required.' });
        }

        const filter = {
            'profiles.role': 'patient',
            $or: [
                { mobile: { $regex: q, $options: 'i' } },
                { 'profiles.name': { $regex: q, $options: 'i' } }
            ]
        };

        const users = await User.find(filter).limit(10);
        
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No registered patients found.' });
        }

        const formattedUsers = users.map(user => {
            const profile = user.profiles.find(p => p.role === 'patient');
            return {
                id: user._id,
                mobile: user.mobile,
                name: profile.name,
                age: profile.age,
                gender: profile.gender || 'Male',
            };
        });

        res.json({ success: true, users: formattedUsers });
    } catch (err) {
        console.error('Search User Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to search patients.', error: err.message });
    }
});

/**
 * GET /api/patients/directory
 * Get all registered patients
 */
router.get('/directory', requireRole('receptionist', 'admin'), async (req, res) => {
    try {
        const users = await User.find({ 'profiles.role': 'patient' }).sort({ createdAt: -1 });
        const patients = users.map(user => {
            const profile = user.profiles.find(p => p.role === 'patient');
            return {
                id: user._id,
                mobile: user.mobile,
                name: profile.name,
                age: profile.age,
                gender: profile.gender || 'Male',
                registeredAt: user.createdAt
            };
        });
        res.json({ success: true, patients });
    } catch (err) {
        console.error('Fetch Directory Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch directory.', error: err.message });
    }
});

/**
 * POST /api/patients
 * Register a new patient — auto-generates today's token number
 */
router.post('/', requireRole('receptionist', 'admin'), async (req, res) => {
    try {
        const { name, age, gender, phone, doctor, notes } = req.body;

        if (!name || !age || !phone || !doctor) {
            return res.status(400).json({ success: false, message: 'Name, age, phone, and doctor are required.' });
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const lastPatient = await Patient.findOne({ createdAt: { $gte: todayStart } })
            .sort({ token: -1 });

        const nextToken = lastPatient ? lastPatient.token + 1 : 101;

        const patient = new Patient({
            token: nextToken,
            name,
            age,
            gender: gender || 'Male',
            phone,
            doctor,
            notes: notes || '',
            status: 'waiting',
            registeredBy: req.user.userId,
        });

        await patient.save();

        res.status(201).json({
            success: true,
            message: `Patient registered with Token #${nextToken}`,
            patient,
        });
    } catch (err) {
        console.error('Add Patient Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to register patient.', error: err.message });
    }
});

/**
 * PATCH /api/patients/:id/status
 */
router.patch('/:id/status', requireRole('receptionist', 'admin', 'doctor'), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['waiting', 'in-progress', 'done'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found.' });
        }

        res.json({ success: true, message: `Status updated to ${status}`, patient });
    } catch (err) {
        console.error('Status Update Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to update status.', error: err.message });
    }
});

/**
 * PATCH /api/patients/:id/notes
 */
router.patch('/:id/notes', requireRole('receptionist', 'admin', 'doctor'), async (req, res) => {
    try {
        const { notes } = req.body;

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { notes },
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found.' });
        }

        res.json({ success: true, message: 'Notes updated.', patient });
    } catch (err) {
        console.error('Notes Update Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to update notes.', error: err.message });
    }
});

/**
 * DELETE /api/patients/:id
 */
router.delete('/:id', requireRole('receptionist', 'admin'), async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found.' });
        }

        res.json({ success: true, message: 'Patient removed from queue.' });
    } catch (err) {
        console.error('Delete Patient Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to delete patient.', error: err.message });
    }
});

module.exports = router;
