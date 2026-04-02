const express = require('express');
const router = express.Router();

// Apne Chef (Controller) ko import karo
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');

router.post('/login', userController.login);
router.post('/register-patient', userController.registerPatient);
router.get('/patients', userController.getAllPatients);
// POST: To book a new appointment
router.post('/appointments', appointmentController.createAppointment);

// GET: To fetch a specific patient's past appointments
router.get('/appointments/history/:patientId', appointmentController.getPatientHistory);
module.exports = router;