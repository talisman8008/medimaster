const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //  Unique ID (e.g:rah3210) first three letters of name and last four number of phone
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    // 2. Encrypted Password
    password: {
        type: String,
        required: true
    },
    //Flat User Details
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: 'patient',
        enum: ['patient', 'receptionist', 'doctor', 'admin']
    },
    status: {
        type: String,
        default: 'Waiting'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);