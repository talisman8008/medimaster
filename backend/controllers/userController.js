const User = require('../models/users'); 
const PatientProfile = require('../models/PatientProfile');
const bcrypt = require('bcryptjs');

// ==========================================
// 1. LOGIN LOGIC (Diagnostic Version)
// ==========================================
exports.login = async (req, res) => {
    try {
        console.log("▶️ 1. LOGIN API HIT! Received body:", req.body);

        const { username, password } = req.body;

        if (!username || !password) {
            console.log("❌ 2. Missing data!");
            return res.status(400).json({ success: false, message: "Username aur Password dono chahiye!" });
        }

        console.log(`🔍 3. Searching database for: ${username}`);
        // Safe search: Ignores uppercase/lowercase issues just in case
        const user = await User.findOne({ 
            username: { $regex: new RegExp("^" + username + "$", "i") } 
        });

        if (!user) {
            console.log("❌ 4. User not found in DB!");
            return res.status(401).json({ success: false, message: "Invalid Credentials (User hi nahi mila)" });
        }

        console.log("🔐 5. User found! Here is their DB password:", user.password);

        // Crucial fix: Wrap password in String() to prevent bcrypt number crashes
        const isMatch = await bcrypt.compare(String(password), user.password);
        
        if (!isMatch) {
            console.log("❌ 6. Password wrong!");
            return res.status(401).json({ success: false, message: "Invalid Credentials (Password galat hai)" });
        }

        console.log("✅ 7. Success! Logging in...");
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
        // THIS IS THE MAGIC LINE: It will print the exact reason for the 500 crash!
        console.error("🔥 CRITICAL CRASH:", error); 
        res.status(500).json({ success: false, message: "Crash Reason: " + error.message });
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
exports.getAllPatients = async (req, res) => {
    try {
        // Go to the database and find ALL patient profiles
        const patients = await PatientProfile.find({});
        
        res.status(200).json({
            success: true,
            count: patients.length,
            patients: patients
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ success: false, message: "Could not fetch patients" });
    }
};