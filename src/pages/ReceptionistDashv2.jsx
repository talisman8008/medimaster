import React, { useState } from 'react';
import {
    Search, Plus, Bell, User,
    CheckCircle, XCircle, Edit, Trash2
} from 'lucide-react';

const ReceptionistDashv2 = () => {
    // 1. Data
    const [patients, setPatients] = useState([
        { id: 101, token: 101, name: "Rohan Sharma", age: 24, doctor: "Dr. A. Gupta", time: "10:30 AM", status: "waiting", phone: "9876543210" },
        { id: 102, token: 102, name: "Anjali Verma", age: 34, doctor: "Dr. S. Khan", time: "10:45 AM", status: "in-progress", phone: "9876543211" },
        { id: 103, token: 103, name: "Vikram Singh", age: 56, doctor: "Dr. A. Gupta", time: "10:00 AM", status: "done", phone: "9876543212" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', doctor: '', phone: '' });

    // --- LOGIC SECTION ---

    // Filter Logic (Search bar ke liye)
    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
    );

    // Status Badge ka color
    const getStatusColor = (status) => {
        switch(status) {
            case 'waiting': return 'bg-yellow-100 text-yellow-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'done': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Mark Done Function
    const handleStatusChange = (id, newStatus) => {
        setPatients(patients.map(p => p.id === id ? { ...p, status: newStatus } : p));
    };

    // Delete Function
    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to remove this patient?")) {
            setPatients(patients.filter(p => p.id !== id));
        }
    };

    // Add Patient Function
    const handleAddPatient = (e) => {
        e.preventDefault();
        const newId = patients.length + 101;
        const patientToAdd = {
            id: newId,
            token: newId,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'waiting',
            ...newPatient
        };
        setPatients([patientToAdd, ...patients]); // List ke top pe add karo
        setIsModalOpen(false); // Modal band
        setNewPatient({ name: '', age: '', doctor: '', phone: '' }); // Form clear
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">

            {/* HEADER & STATS */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Reception Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Pooja</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-full shadow-sm"><Bell size={20} className="text-gray-600" /></div>
                    <div className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">P</div>
                </div>
            </div>

            {/* SEARCH & ADD BUTTON */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search patient by name or phone..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow-md transition-all flex items-center gap-2 font-medium"
                >
                    <Plus size={20} /> Register New Patient
                </button>
            </div>

            {/* MAIN TABLE */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                        <th className="p-4 border-b">Token</th>
                        <th className="p-4 border-b">Patient Name</th>
                        <th className="p-4 border-b">Doctor</th>
                        <th className="p-4 border-b">Time</th>
                        <th className="p-4 border-b">Status</th>
                        <th className="p-4 border-b text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-bold text-teal-700">#{patient.token}</td>
                            <td className="p-4">
                                <div className="font-semibold text-gray-800">{patient.name}</div>
                                <div className="text-xs text-gray-400">{patient.age} Yrs • {patient.phone}</div>
                            </td>
                            <td className="p-4 text-gray-600">{patient.doctor}</td>
                            <td className="p-4 text-gray-500 font-mono text-sm">{patient.time}</td>
                            <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                    {/* Mark Done Button */}
                                    <button
                                        onClick={() => handleStatusChange(patient.id, 'done')}
                                        title="Mark as Done"
                                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                    >
                                        <CheckCircle size={20} />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(patient.id)}
                                        title="Remove Patient"
                                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {filteredPatients.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No patients found matching your search.
                    </div>
                )}
            </div>

            {/* --- ADD PATIENT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[450px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">New Registration</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddPatient} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                                <input required type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                       value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} placeholder="Enter name" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Age</label>
                                    <input required type="number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                           value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} placeholder="25" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                                    <input required type="tel" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                           value={newPatient.phone} onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} placeholder="98..." />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Assign Doctor</label>
                                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                                        value={newPatient.doctor} onChange={(e) => setNewPatient({...newPatient, doctor: e.target.value})}>
                                    <option value="">Select a Doctor</option>
                                    <option value="Dr. A. Gupta">Dr. A. Gupta (General)</option>
                                    <option value="Dr. S. Khan">Dr. S. Khan (Neurology)</option>
                                    <option value="Dr. R. Kapoor">Dr. R. Kapoor (Ortho)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all mt-4">
                                Generate Token & Add
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReceptionistDashv2;