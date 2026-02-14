import React, { useState } from 'react';
import {
    Search, Plus, Bell, Calendar, User,
    Clock, CheckCircle, XCircle, MoreVertical,
    Phone, FileText, ChevronRight
} from 'lucide-react';

// Mock Data (Abhi ke liye yahi use kar rahe hain)
const MOCK_PATIENTS = [
    { id: 101, name: "Rohan Sharma", age: 24, gender: "M", problem: "High Fever", token: 101, time: "10:30 AM", status: "waiting", phone: "9876543210" },
    { id: 102, name: "Anjali Verma", age: 34, gender: "F", problem: "Migraine", token: 102, time: "10:45 AM", status: "in-progress", phone: "9876543211" },
    { id: 103, name: "Vikram Singh", age: 56, gender: "M", problem: "Regular Checkup", token: 103, time: "11:00 AM", status: "done", phone: "9876543212" },
    { id: 104, name: "Priya Reddy", age: 29, gender: "F", problem: "Stomach Ache", token: 104, time: "11:15 AM", status: "waiting", phone: "9876543213" },
    { id: 105, name: "Rahul Roy", age: 45, gender: "M", problem: "Back Pain", token: 105, time: "11:30 AM", status: "waiting", phone: "9876543214" },
];

const ReceptionistDashv1 = () => {
    const [selectedPatient, setSelectedPatient] = useState(MOCK_PATIENTS[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all"); // all, waiting, done

    // Filter Logic
    const filteredPatients = MOCK_PATIENTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.token.toString().includes(searchTerm);
        const matchesFilter = filter === "all" ? true : p.status === filter;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'waiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'done': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

            {/* LEFT PANEL: The List (WhatsApp Style) - 35% Width */}
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10">

                {/* Header Section */}
                <div className="p-4 border-b border-gray-100 bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="bg-teal-600 text-white p-1 rounded">MF</span> MedFlow
                        </h1>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full shadow-md transition-all">
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Name or Token..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mt-4 text-sm overflow-x-auto pb-1">
                        {['all', 'waiting', 'done'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-full capitalize transition-colors ${filter === f ? 'bg-teal-100 text-teal-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* The Scrollable List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                        <div
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 group
                ${selectedPatient?.id === patient.id ? 'bg-teal-50 border-l-4 border-l-teal-600' : 'border-l-4 border-l-transparent'}
              `}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${selectedPatient?.id === patient.id ? 'bg-teal-200 text-teal-800' : 'bg-gray-200 text-gray-600'}`}>
                                        {patient.token}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${selectedPatient?.id === patient.id ? 'text-teal-900' : 'text-gray-800'}`}>{patient.name}</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock size={12} /> {patient.time} • {patient.problem}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-full border ${getStatusColor(patient.status)}`}>
                  {patient.status.toUpperCase()}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL: The Details (Cockpit) - 65% Width */}
            <div className="flex-1 bg-gray-50 flex flex-col h-full relative">
                {selectedPatient ? (
                    <>
                        {/* Top Bar of Right Panel */}
                        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
                            <div>
                                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Current Selection</span>
                                <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.name}</h2>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                                    <XCircle size={18} /> Cancel
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium shadow-md hover:bg-teal-700 transition-all">
                                    <CheckCircle size={18} /> Mark Done
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="p-8 flex-1 overflow-y-auto">

                            {/* Highlight Card: Token Number */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg transform transition hover:scale-105">
                                    <p className="text-teal-100 text-sm font-medium mb-1">Token Number</p>
                                    <h1 className="text-6xl font-extrabold tracking-tighter">#{selectedPatient.token}</h1>
                                    <p className="mt-4 text-teal-100 text-sm bg-teal-800/30 inline-block px-3 py-1 rounded-full">
                                        Priority: Normal
                                    </p>
                                </div>

                                <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-4 tracking-wider border-b pb-2">Patient Vitals & Info</h3>
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-gray-400 text-xs">Age / Gender</p>
                                            <p className="text-lg font-semibold text-gray-800">{selectedPatient.age} Yrs / {selectedPatient.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs">Contact</p>
                                            <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                <Phone size={16} className="text-teal-500" /> {selectedPatient.phone}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-400 text-xs">Chief Complaint</p>
                                            <p className="text-lg font-semibold text-gray-800 bg-gray-50 p-2 rounded-md border border-gray-100 mt-1">
                                                {selectedPatient.problem}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action History / Notes */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-gray-800 font-bold flex items-center gap-2">
                                        <FileText size={20} className="text-gray-400" /> Clinical Notes
                                    </h3>
                                    <button className="text-teal-600 text-sm font-medium hover:underline">View History</button>
                                </div>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    rows="4"
                                    placeholder="Receptionist internal notes (optional)..."
                                ></textarea>
                            </div>

                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <User size={64} className="mb-4 text-gray-200" />
                        <p>Select a patient from the list to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceptionistDashv1;