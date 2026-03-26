const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    appointmentDate:{
        type:Date,
        required:true
    },
    timeSlot:{
        type:String //6:09 AM
    },
    purpose: {
        type: String
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Waiting', 'Consulting', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
},{ timestamps: true });

module.exports = mongoose.model('Appointment',appointmentSchema);