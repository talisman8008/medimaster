/* eslint-env node */
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
/**
 * Seed script — creates a default admin account if one doesn't exist
 * Run once: node seedAdmin.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/users');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ 'profiles.role': 'admin' });
        if (existingAdmin) {
            console.log('⚠️  Admin already exists:', existingAdmin.mobile);
            process.exit(0);
        }

        // Create admin account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            mobile: '9999999999',
            password: hashedPassword,
            profiles: [{
                name: 'Admin',
                role: 'admin',
                age: 0,
                relation: 'Self',
                status: true,
            }],
        });

        await admin.save();
        console.log('✅ Admin account created!');
        console.log('   Mobile: 9999999999');
        console.log('   Password: admin123');
        console.log('   ⚠️  Change the password after first login!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed Error:', err.message);
        process.exit(1);
    }
};

seedAdmin();
