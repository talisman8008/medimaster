import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Bell, User,
    CheckCircle, XCircle, Edit, Trash2, LogOut, Phone, Calendar
} from 'lucide-react';

const ReceptionistDashv2 = () => {
    const navigate = useNavigate();

    // 1. DATA STATES
    const [patients, setPatients] = useState([
        { id: 101, token: 101, name: "Rohan Sharma", age: 24, doctor: "Dr. A. Gupta", time: "10:30 AM", status: "waiting", phone: "9876543210", gender: "Male" },
        { id: 102, token: 102, name: "Anjali Verma", age: 34, doctor: "Dr. S. Khan", time: "10:45 AM", status: "in-progress", phone: "8369930634", gender: "Female" },
        { id: 103, token: 103, name: "Vikram Singh", age: 56, doctor: "Dr. A. Gupta", time: "10:00 AM", status: "done", phone: "8104503411", gender: "Male" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', doctor: '', phone: '', gender: 'Male' });

    // Role fetch kar rahe hain jo Login pe set kiya tha
    const userRole = localStorage.getItem("Role") || "Receptionist";

    // --- LOGIC SECTION ---

    // Search Logic: Case-insensitive search for Name and Phone
    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'waiting': return 'bg-yellow-100 text-yellow-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'done': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setPatients(patients.map(p => p.id === id ? { ...p, status: newStatus } : p));
    };

    const handleDelete = (id) => {
        if(window.confirm("Remove this patient from list?")) {
            setPatients(patients.filter(p => p.id !== id));
            if (selectedPatient?.id === id) setIsDrawerOpen(false);
        }
    };

    const handleAddPatient = (e) => {
        e.preventDefault();
        const newId = Date.now(); // Unique ID using timestamp
        const patientToAdd = {
            id: newId,
            token: patients.length + 101,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'waiting',
            ...newPatient
        };
        setPatients([patientToAdd, ...patients]);
        setIsModalOpen(false);
        setNewPatient({ name: '', age: '', doctor: '', phone: '', gender: 'Male' });
    };

    const handleLogout = () => {
        localStorage.clear(); // Saara session khatam
        navigate('/');
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 transition-all duration-300">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-[#112025] tracking-tight">MediFlow Dash</h1>
                        <p className="text-gray-500 font-medium">Logged in as: <span className="text-teal-600 capitalize">{userRole}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-all">
                            <LogOut size={20} /> Logout
                        </button>
                        <div className="bg-[#396d7c] text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg">
                            {userRole.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* TOP ACTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by patient name or phone number..."
                            className="w-full pl-12 pr-4 py-4 bg-white border-none shadow-sm rounded-2xl focus:ring-2 focus:ring-[#396d7c] outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#396d7c] hover:bg-[#2c5461] text-white px-6 py-4 rounded-2xl shadow-xl shadow-teal-100 transition-all flex items-center justify-center gap-3 font-bold text-lg"
                    >
                        <Plus size={24} /> New Registration
                    </button>
                </div>

                {/* PATIENT TABLE */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="p-6">Token</th>
                            <th className="p-6">Patient Details</th>
                            <th className="p-6">Consulting Doctor</th>
                            <th className="p-6">Arrival</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {filteredPatients.map((patient) => (
                            <tr
                                key={patient.id}
                                onClick={() => { setSelectedPatient(patient); setIsDrawerOpen(true); }}
                                className="cursor-pointer hover:bg-teal-50/30 transition-all group"
                            >
                                <td className="p-6">
                                    <span className="bg-teal-50 text-[#396d7c] px-3 py-1 rounded-lg font-black text-sm">#{patient.token}</span>
                                </td>
                                <td className="p-6">
                                    <div className="font-bold text-gray-800 text-lg">{patient.name}</div>
                                    <div className="text-sm text-gray-400 font-medium">{patient.phone} • {patient.gender}</div>
                                </td>
                                <td className="p-6 font-semibold text-gray-600">{patient.doctor}</td>
                                <td className="p-6 text-gray-400 font-mono text-sm">{patient.time}</td>
                                <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(patient.status)}`}>
                                            {patient.status}
                                        </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(patient.id, 'done'); }}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                                        >
                                            <CheckCircle size={22} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(patient.id); }}
                                            className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {filteredPatients.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="text-5xl mb-4">🔎</div>
                            <p className="text-gray-400 font-bold">No patients found. Recheck spelling or phone number.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- SIDE DRAWER (The "Killer" Feature) --- */}
            <div className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 flex flex-col`}>
                {selectedPatient && (
                    <>
                        <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-[#112025]">Patient Profile</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Token #{selectedPatient.token}</p>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} className="p-3 hover:bg-white shadow-sm rounded-2xl transition-all text-gray-400 hover:text-red-500">
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-[32px] bg-gradient-to-br from-[#396d7c] to-[#2c5461] text-white flex items-center justify-center text-4xl font-black shadow-xl">
                                    {selectedPatient.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-gray-800 leading-tight">{selectedPatient.name}</h4>
                                    <p className="text-[#396d7c] font-bold flex items-center gap-2 mt-1">
                                        <Phone size={16} /> {selectedPatient.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Age</p>
                                    <p className="text-xl font-bold text-gray-700">{selectedPatient.age} Years</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Gender</p>
                                    <p className="text-xl font-bold text-gray-700">{selectedPatient.gender}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Visit Information</label>
                                <div className="p-6 bg-teal-50/50 rounded-3xl border border-teal-100 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Doctor:</span>
                                        <span className="font-bold text-[#396d7c]">{selectedPatient.doctor}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Arrival:</span>
                                        <span className="font-bold text-gray-700">{selectedPatient.time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Reception Notes</label>
                                <textarea
                                    className="w-full p-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-[#396d7c] outline-none min-h-[150px] text-gray-600 font-medium"
                                    placeholder="Add notes (e.g., 'Wants early slot', 'Payment pending'...)"
                                />
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50/50 border-t grid grid-cols-2 gap-4">
                            <button className="py-4 bg-[#396d7c] text-white rounded-2xl font-black shadow-lg hover:bg-[#2c5461] transition-all">PRINT TOKEN</button>
                            <button className="py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-100 transition-all">EDIT PROFILE</button>
                        </div>
                    </>
                )}
            </div>

            {/* Backdrop */}
            {isDrawerOpen && <div onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-[#112025]/20 backdrop-blur-sm z-40 transition-all duration-500" />}

            {/* --- REGISTRATION MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#112025]/60 backdrop-blur-md flex justify-center items-center z-[60] p-4">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-[500px] animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight">New Patient</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-red-500 transition-colors"><XCircle size={32} /></button>
                        </div>
                        <form onSubmit={handleAddPatient} className="space-y-6">
                            <div className="space-y-4">
                                <input required type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#396d7c] outline-none font-bold"
                                       value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} placeholder="Full Name" />

                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#396d7c] outline-none font-bold"
                                           value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} placeholder="Age" />
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#396d7c] outline-none font-bold text-gray-500"
                                            value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <input required type="tel" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#396d7c] outline-none font-bold"
                                       value={newPatient.phone} onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} placeholder="Phone Number" />

                                <select className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#396d7c] outline-none font-bold text-gray-500"
                                        value={newPatient.doctor} onChange={(e) => setNewPatient({...newPatient, doctor: e.target.value})}>
                                    <option value="">Select Doctor</option>
                                    <option value="Dr. A. Gupta">Dr. A. Gupta (General)</option>
                                    <option value="Dr. S. Khan">Dr. S. Khan (Neuro)</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-[#396d7c] hover:bg-[#2c5461] text-white py-5 rounded-[24px] font-black shadow-2xl transition-all text-xl mt-4 uppercase tracking-widest">
                                Register Now
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionistDashv2;