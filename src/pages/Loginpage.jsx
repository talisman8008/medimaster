import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReceptionistDash = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Receptionist');

    // Component load hote hi LocalStorage se naam nikal lenge
    useEffect(() => {
        const storedName = localStorage.getItem('UserName');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    // Logout Function
    const handleLogout = () => {
        localStorage.clear(); // Saara data saaf
        navigate('/'); // Login page pe wapas
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* ⬅️ SIDEBAR */}
            <div className="w-64 bg-[#112025] text-white flex flex-col justify-between hidden md:flex">
                <div>
                    <div className="p-6 flex items-center justify-center border-b border-gray-700">
                        <h1 className="text-2xl font-extrabold text-white tracking-wider">
                            Medi<span className="text-[#396d7c]">Flow</span>
                        </h1>
                    </div>
                    <nav className="mt-6">
                        <a href="#" className="flex items-center py-3 px-6 bg-[#396d7c] text-white border-l-4 border-white">
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center py-3 px-6 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            Patients
                        </a>
                        <a href="#" className="flex items-center py-3 px-6 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Appointments
                        </a>
                    </nav>
                </div>
                <div className="p-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center py-2 px-4 border border-gray-600 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* ➡️ MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top Header */}
                <header className="flex justify-between items-center p-6 bg-white border-b border-gray-200 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {userName} 👋</h2>
                        <p className="text-sm text-gray-500 mt-1">Here is what's happening at the front desk today.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="bg-[#396d7c] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2c5461] transition-colors shadow-sm">
                            + New Patient
                        </button>
                        <div className="h-10 w-10 rounded-full bg-[#112025] text-white flex items-center justify-center font-bold text-lg border-2 border-[#396d7c]">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Dashboard Widgets (Scrollable) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-[#396d7c]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">24</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-full text-[#396d7c]">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-green-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Patients Checked In</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">12</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-full text-green-600">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-orange-400">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">5</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-full text-orange-500">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[#112025]">Recent Patient Queue</h3>
                            <button className="text-sm text-[#396d7c] font-medium hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                                    <th className="p-4 font-medium">Patient Name</th>
                                    <th className="p-4 font-medium">Mobile Number</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Time</th>
                                    <th className="p-4 font-medium">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800">Rahul Sharma</td>
                                    <td className="p-4 text-gray-500">+91 9876543210</td>
                                    <td className="p-4">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Waiting</span>
                                    </td>
                                    <td className="p-4 text-gray-500">10:15 AM</td>
                                    <td className="p-4">
                                        <button className="text-[#396d7c] hover:text-[#2c5461] font-medium text-sm">Admit</button>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800">Priya Singh</td>
                                    <td className="p-4 text-gray-500">+91 9123456780</td>
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Consulting</span>
                                    </td>
                                    <td className="p-4 text-gray-500">09:45 AM</td>
                                    <td className="p-4">
                                        <button className="text-gray-400 hover:text-gray-600 font-medium text-sm">Details</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ReceptionistDash;