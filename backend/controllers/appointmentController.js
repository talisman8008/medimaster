const Appointment = require('../models/appointment'); // Check this path/name!

// ==========================================
// 1. CREATE NEW APPOINTMENT (The POST Request)
// ==========================================
exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, timeSlot, purpose } = req.body;

        // Validation: Make sure frontend sent the minimum required data
        if (!patientId || !appointmentDate) {
            return res.status(400).json({ success: false, message: "Patient aur Date zaroori hai!" });
        }

        // Create the new appointment object
        const newAppointment = new Appointment({
            patientId: patientId,
            doctorId: doctorId,
            appointmentDate: appointmentDate,
            timeSlot: timeSlot,
            purpose: purpose,
            status: 'Scheduled' // Matches the default in your schema
        });

        // Save it to the database
        await newAppointment.save();

        res.status(201).json({ 
            success: true, 
            message: "Appointment booked successfully!", 
            appointment: newAppointment 
        });

    } catch (error) {
        console.error("🔥 Create Appointment Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ==========================================
// 2. GET PATIENT HISTORY (The GET Request)
// ==========================================
exports.getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params; // Grabs the ID from the URL

        // Find every appointment where patientId matches, and sort by newest first
        const history = await Appointment.find({ patientId: patientId })
            .populate('doctorId', 'name') // Pulls the doctor's real name from the User DB
            .sort({ appointmentDate: -1 });

        res.status(200).json({ 
            success: true, 
            message: "History fetched successfully!", 
            history: history 
        });

    } catch (error) {
        console.error("🔥 Patient History Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};