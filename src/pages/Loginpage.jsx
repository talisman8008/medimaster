import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    // STATE
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // API CALL
            const res = await axios.post('http://localhost:5000/api/login', {
                username: username,
                password: password
            });

            if (res.data.success) {
                // SUCCESS LOGIC
                const user = res.data.user;
                navigateBasedOnRole(user);
            }
        } catch (err) {
            console.error("Login Error:", err);
            const errorMsg = err.response?.data?.message || "Server connect nahi ho raha!";
            showError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    };

    const navigateBasedOnRole = (user) => {
        // LocalStorage mein user ki details save
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("Role", user.role);
        localStorage.setItem("UserName", user.name);
        localStorage.setItem("UserId", user.id);

            if (user.role === 'receptionist' || user.role === 'recep') {
            navigate('/receptionist');
        } else {
            navigate('/patient-dashboard');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 ">
                <div className="w-full max-w-md space-y-8 md:p-12 md:border-transparent border-2 p-6 border-gray-100 rounded-xl">

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-[#112025] tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Access your <span className="text-[#396d7c] font-bold">MediFlow</span> workspace.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">

                            {/* Username Input*/}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 text-lg">👤</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#396d7c] focus:border-transparent outline-none transition-all"
                                    placeholder="Login ID (e.g., recep1)"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 text-lg">🔒</span>
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
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#396d7c] hover:bg-[#2c5461] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#396d7c] transition duration-200 transform hover:scale-[1.02] disabled:bg-gray-400"
                        >
                            {isLoading ? "Authenticating..." : "Sign in to Dashboard"}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-xs text-gray-500">
                            © 2026 MediFlow Systems. All rights reserved. <br />
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
                            <span className="text-2xl mr-4">⚠️</span>
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