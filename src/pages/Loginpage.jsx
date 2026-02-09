
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if(email.includes('reception')) {
            navigate('/receptionist');
        } else {
            alert("Use 'reception@medflow.com' to login");
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* leftside:*/}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 ">
                <div className="w-full max-w-md space-y-8 md:p-12 md:border-transparent border-2 p-6  border-hovbor rounded-xl">

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-[#112025] tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please enter your details to access the <span className="text-[#396d7c] font-bold">MedFlow</span> workspace.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">

                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {/*Email Svg icon*/}
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#396d7c] focus:border-transparent outline-none transition-all"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {/* SVG Icon for Password */}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#396d7c] hover:bg-[#2c5461] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#396d7c] transition duration-200 transform hover:scale-[1.02]"
                        >
                            Sign in to Dashboard
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-4">
                        <p className="text-xs text-gray-500">
                            © 2026 MedFlow Systems. All rights reserved. <br/>
                            Protected by Prayers and Hopes.
                        </p>
                    </div>
                </div>
            </div>

            {/* right-side: */}
            <div className="hidden md:block md:w-1/2 relative">
                                                   {/* Background Image */}

                <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1953&q=80"
                    alt="Hospital Background"
                />
                                                      {/* Teal Overlay */}
                <div className="absolute inset-0 bg-[#396d7c] opacity-40 mix-blend-multiply"></div>

                {/* text */}
                <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
                    <h3 className="text-4xl font-bold mb-2">Streamlining care with responsibily.</h3>
                    <p className="text-lg text-gray-100 opacity-90">
                        "The art of medicine consists of amusing the patient while nature cures the disease."
                    </p>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;