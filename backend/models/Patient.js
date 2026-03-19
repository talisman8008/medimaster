/* eslint-env node */
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    token: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Male',
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    doctor: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['waiting', 'in-progress', 'done'],
        default: 'waiting',
    },
    notes: {
        type: String,
        default: '',
    },
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

PatientSchema.index({ createdAt: -1 });
PatientSchema.index({ status: 1 });

module.exports = mongoose.model('Patient', PatientSchema);
