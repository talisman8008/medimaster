import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 👈 IMPORT AXIOS (Iske bina backend call nahi hoga)

const LoginPage = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showProfileSelector, setshowProfileSelector] = useState(false);
    const [linkedProfiles, setlinkedProfiles] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // --- 🔥 NEW BACKEND CONNECTED LOGIN LOGIC ---
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // 1. Backend ko Mobile aur Password bhejo
            const res = await axios.post('http://localhost:5000/api/login', {
                mobile: mobile,
                password: password
            });

            // 2. Agar Backend ne bola "Success" (True)
            if (res.data.success) {
                const profiles = res.data.profiles; // Backend se aayi hui profiles list

                // 3. Wahi purana logic: Agar 1 se zyada profile hai toh selector dikhao
                if (profiles.length > 1) {
                    setlinkedProfiles(profiles);
                    setshowProfileSelector(true);
                } else {
                    // Agar ek hi profile hai toh direct ghus jao
                    navigateBasedOnRole(profiles[0].role);
                }
            }

        } catch (err) {
            // 4. Agar Backend ne bola "Fail" (False)
            console.error("Login Error:", err);
            const errorMsg = err.response?.data?.message || "Server connect nahi ho raha!";
            showError(errorMsg);
        }
    };

    // --- Helper Functions (Same as before) ---
    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    };

    const navigateBasedOnRole = (role) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("Role", role);

        if (role === 'receptionist') {
            navigate('/receptionist');
        } else if (role === 'receptionist-v1') {
            navigate('/receptionist2');
        } else {
            navigate('/patient-dashboard');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 ">
                <div className="w-full max-w-md space-y-8 md:p-12 md:border-transparent border-2 p-6 border-hovbor rounded-xl">

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-[#112025] tracking-tight">
                            {showProfileSelector ? "Who is checking in?" : "Welcome back"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {showProfileSelector ? "Select the patient to continue" :
                                <span>Access your <span className="text-[#396d7c] font-bold">MedFlow</span> workspace.</span>}
                        </p>
                    </div>

                    {/* Profile Selector OR Login Form */}
                    {showProfileSelector ? (
                        <div className="w-full animate-fade-in-up">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-[#396d7c] mb-4">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-[#112025]">Who is checking in?</h2>
                                <p className="text-gray-500 text-sm mt-1">Select the patient profile to continue</p>
                            </div>

                            <div className="grid gap-4">
                                {linkedProfiles.map((profile, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigateBasedOnRole(profile.role)}
                                        className="group relative flex items-center p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-[#396d7c] hover:shadow-md transition-all duration-200 text-left w-full"
                                    >
                                        <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-[#396d7c] to-[#2c5461] text-white flex items-center justify-center text-xl font-bold shadow-sm group-hover:scale-110 transition-transform duration-200">
                                            {profile.name.charAt(0)}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#396d7c] transition-colors">
                                                {profile.name}
                                            </h3>
                                            <div className="flex items-center mt-1 space-x-2">
                                                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                                    {profile.relation || 'Staff'}
                                                </span>
                                                {profile.age && <span className="text-xs text-gray-500">• {profile.age} Years</span>}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => setshowProfileSelector(false)}
                                    className="text-sm font-medium text-gray-500 hover:text-[#396d7c] transition-colors flex items-center justify-center mx-auto space-x-1"
                                >
                                    <span>← Use a different mobile number</span>
                                </button>
                            </div>
                        </div>

                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-4">
                                {/* Number Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        maxLength="10"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#396d7c] focus:border-transparent outline-none transition-all"
                                        placeholder="Mobile Number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#396d7c] focus:border-transparent outline-none transition-all"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#396d7c] hover:bg-[#2c5461] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#396d7c] transition duration-200 transform hover:scale-[1.02]"
                            >
                                Sign in to Dashboard
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-4">
                        <p className="text-xs text-gray-500">
                            © 2026 MedFlow Systems. All rights reserved. <br />
                            Protected by Prayers and Hopes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side (Image) */}
            <div className="hidden md:block md:w-1/2 relative">
                <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1953&q=80"
                    alt="Hospital Background"
                />
                <div className="absolute inset-0 bg-[#396d7c] opacity-40 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
                    <h3 className="text-4xl font-bold mb-2">Streamlining care with responsibility.</h3>
                    <p className="text-lg text-gray-100 opacity-90">
                        "The art of medicine consists of amusing the patient while nature cures the disease."
                    </p>
                </div>
            </div>

            {/* Error Popup */}
            {error && (
                <div className="fixed top-5 left-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 animate-bounce">
                    <div className="flex items-center">
                        <div className="py-1">
                            <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;