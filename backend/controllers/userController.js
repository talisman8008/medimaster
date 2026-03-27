const User = require('../models/users'); // Path check kar lena agar alag ho
const PatientProfile = require('../models/PatientProfile');
const bcrypt = require('bcryptjs');

// ==========================================
// 1. LOGIN LOGIC (For Receptionist/Doctor)
// ==========================================
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username aur Password dono chahiye!" });
        }

        // 1. User dhoondo (Case insensitive)
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials (User hi nahi mila)" });
        }

        // 2. Password match karo (Bcrypt ke through)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Credentials (Password galat hai)" });
        }

        // 3. Success! Bouncer ne entry de di
        res.status(200).json({
            success: true,
            message: "Login Successful!",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server crash ho gaya!" });
    }
};

// ==========================================
// 2. REGISTER NEW PATIENT LOGIC
// ==========================================
exports.registerPatient = async (req, res) => {
    try {
        const { name, surname, mobile, birthYear } = req.body;

        if (!name || !surname || !mobile || !birthYear) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // 1. Auto-Generate Credentials (Jo pop-up mein dikhenge)
        const generatedUsername = name.substring(0, 3).toLowerCase() + mobile.toString().slice(-4);
        const rawPassword = name.substring(0, 3).toLowerCase() + surname.substring(surname.length - 3).toLowerCase() + birthYear;

        // Check if username already exists (Rare, but possible)
        const existingUser = await User.findOne({ username: generatedUsername });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User ID already exists! Try modifying the name slightly." });
        }

        // 2. Password ko Encrypt karo database mein save karne se pehle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        // 3. Naya User (Patient) Banao
        const newUser = new User({
            username: generatedUsername,
            password: hashedPassword,
            name: `${name} ${surname}`,
            mobile: mobile,
            role: 'patient',
            status: 'Active'
        });

        const savedUser = await newUser.save();

        // 4. Uska khali Patient Profile Database bhi bana do (Relational DB magic)
        const newProfile = new PatientProfile({
            userId: savedUser._id,
            name: `${name} ${surname}`,
            mobileNumber: mobile,
            birthdate: new Date(birthYear, 0, 1), // Default to Jan 1st of that year
            weight: 0 // Default
        });
        await newProfile.save();

        // 5. Frontend ko Success aur auto-generated credentials bhej do
        res.status(201).json({
            success: true,
            message: "Patient registered successfully!",
            credentials: { username: generatedUsername, password: rawPassword }
        });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};