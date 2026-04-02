const express = require('express');
const router = express.Router();

// Apne Chef (Controller) ko import karo
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/register-patient', userController.registerPatient);
router.get('/patients', userController.getAllPatients);
module.exports = router;