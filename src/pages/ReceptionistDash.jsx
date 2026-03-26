import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReceptionistDash = () => {
    const navigate = useNavigate();

    // ==========================================
    // 1. STATE MANAGEMENT
    // ==========================================
    const [activeTab, setActiveTab] = useState('Today Queue');

    // Modal 1: Add Patient States
    const [showAddModal, setShowAddModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [mobile, setMobile] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Modal 2: Credentials States
    const [showCredentials, setShowCredentials] = useState(false);
    const [generatedCreds, setGeneratedCreds] = useState({ username: '', password: '' });

    // Dummy Data for Table (Jab tak backend se fetch wala API nahi banta)
    const [queue, setQueue] = useState([
        { id: '1', name: 'Rahul Sharma', time: '10:30 AM', status: 'Waiting', doctor: 'Dr. Smith' },
        { id: '2', name: 'Priya Patel', time: '11:00 AM', status: 'Consulting', doctor: 'Dr. Jones' }
    ]);

    // ==========================================
    // 2. FUNCTIONS & LOGIC
    // ==========================================
    const handleLogout = () => {
        localStorage.clear(); // Bouncer ka ticket phaad do
        navigate('/'); // Login page pe phek do
    };

    const handleRegisterPatient = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mobile.length !== 10) {
                alert("Mobile number must be exactly 10 digits!");
                setIsLoading(false);
                return;
            }

            const res = await axios.post('http://localhost:5000/api/register-patient', {
                name: firstName,
                surname: surname,
                mobile: mobile,
                birthYear: new Date(birthDate).getFullYear()
            });

            if (res.data.success) {
                setShowAddModal(false);
                setGeneratedCreds(res.data.credentials);
                setShowCredentials(true);

                // Form reset
                setFirstName(''); setSurname(''); setMobile(''); setBirthDate('');

                // Note: Real app mein yahan hum naye patient ko table (queue) mein add kar denge
            }
        } catch (err) {
            console.error("Registration Error:", err);
            const errorMsg = err.response?.data?.message || "Server Error! Backend chalu hai na?";
            alert("❌ GADBAD HOGYI: " + errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // 3. UI RENDER (THE LOOKS)
    // ==========================================
    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">

            {/* ---------------- SIDEBAR ---------------- */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm">
                <div>
                    {/* Logo Section */}
                    <div className="h-20 flex items-center px-8 border-b border-gray-100">
                        <h2 className="text-2xl font-black text-[#396d7c] tracking-tight">MediFlow<span className="text-orange-500">.</span></h2>
                    </div>
                    {/* Navigation */}
                    <nav className="p-4 space-y-2 mt-4">
                        <button
                            onClick={() => setActiveTab('Today Queue')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'Today Queue' ? 'bg-[#396d7c] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            <span>📋</span>
                            <span className="font-semibold">Today's Queue</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('History')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'History' ? 'bg-[#396d7c] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            <span>🕒</span>
                            <span className="font-semibold">Patient History</span>
                        </button>
                    </nav>
                </div>

                {/* Profile & Logout */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-teal-100 text-[#396d7c] flex items-center justify-center font-bold text-lg">
                            R
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Receptionist</p>
                            <p className="text-xs text-gray-500">Front Desk</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* ---------------- MAIN CONTENT ---------------- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
                    <h1 className="text-2xl font-bold text-gray-800">{activeTab}</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 bg-[#396d7c] text-white px-5 py-2.5 rounded-lg hover:bg-[#2c5461] transition duration-200 transform hover:scale-[1.02] shadow-sm font-medium"
                    >
                        <span>+ New Patient</span>
                    </button>
                </header>

                {/* Dashboard Body (Table) */}
                <div className="flex-1 p-10 overflow-y-auto bg-gray-50">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time Slot</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {queue.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.doctor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                patient.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {patient.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-[#396d7c] hover:text-[#2c5461]">Edit</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* Empty State Illustration (If no patients) */}
                        {queue.length === 0 && (
                            <div className="text-center py-20">
                                <span className="text-6xl mb-4 block">☕</span>
                                <h3 className="text-lg font-medium text-gray-900">No patients waiting</h3>
                                <p className="text-gray-500">The queue is empty. Time for a coffee break!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ========================================================== */}
            {/* 🛡️ MODAL 1: ADD NEW PATIENT FORM                           */}
            {/* ========================================================== */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all animate-scale-in">

                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Patient</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleRegisterPatient} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Rahul"
                                           className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#396d7c] focus:bg-white outline-none transition-all"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Surname</label>
                                    <input type="text" required value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Sharma"
                                           className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#396d7c] focus:bg-white outline-none transition-all"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-medium">
                                        +91
                                    </div>
                                    <input type="tel" required maxLength="10" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="98765 43210"
                                           className="w-full pl-14 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#396d7c] focus:bg-white outline-none transition-all"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                                       className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#396d7c] focus:bg-white outline-none transition-all text-gray-700"/>
                                <p className="text-xs text-gray-400 mt-2 font-medium">💡 Year will be used to generate the initial password.</p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading}
                                        className="flex items-center justify-center min-w-[160px] px-6 py-2.5 text-white bg-[#396d7c] rounded-xl hover:bg-[#2c5461] disabled:bg-gray-400 font-medium transition-all transform hover:scale-[1.02] shadow-md">
                                    {isLoading ? 'Processing...' : 'Register Patient'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================== */}
            {/* ✨ MODAL 2: SUCCESS & CREDENTIALS POPUP                    */}
            {/* ========================================================== */}
            {showCredentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center transform transition-all animate-bounce-in">

                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-5 shadow-inner">
                            <span className="text-4xl">✓</span>
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-1">Patient Registered!</h2>
                        <p className="text-sm text-gray-500 mb-6">Share these details with the patient</p>

                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 text-left shadow-inner space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Login ID</label>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xl font-black text-[#396d7c]">{generatedCreds.username}</p>
                                    <button onClick={() => {navigator.clipboard.writeText(generatedCreds.username); alert("Copied!")}} className="text-gray-400 hover:text-[#396d7c] transition-colors">📋</button>
                                </div>
                            </div>
                            <div className="h-px bg-gray-200 w-full"></div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-lg font-mono font-bold text-gray-700">{generatedCreds.password}</p>
                                    <button onClick={() => {navigator.clipboard.writeText(generatedCreds.password); alert("Copied!")}} className="text-gray-400 hover:text-[#396d7c] transition-colors">📋</button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowCredentials(false)}
                            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#396d7c] hover:bg-[#2c5461] transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        >
                            Done & Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReceptionistDash;