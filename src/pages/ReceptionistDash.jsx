import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Bell, User,
    CheckCircle, XCircle, Edit, Trash2,House
} from 'lucide-react';

const ReceptionistDash = () => {
  const navigate = useNavigate();

  // MOCK DATA
  const [stats] = useState([
    { title: 'Total Patients', count: 124, icon: '👥', color: 'bg-blue-100 text-blue-600' },
    { title: 'Doctors Active', count: 8, icon: '👨‍⚕️', color: 'bg-green-100 text-green-600' },
    { title: 'Pending Tokens', count: 14, icon: '⏳', color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Emergency', count: 2, icon: '🚑', color: 'bg-red-100 text-red-600' },

  ]);

    const [patients, setPatients] = useState([
        { id: 101, token: 101, name: "Rohan Sharma", age: 69, doctor: "Dr. A. Gupta", time: "10:30 AM", status: "Waiting", phone: "9876543210" },
        { id: 101, token: 101, name: "Rohit Sharma", age: 69, doctor: "Dr. A. Gupta", time: "10:30 AM", status: "Waiting", phone: "9876543210" },
        { id: 102, token: 102, name: "Anjali Verma", age: 96, doctor: "Dr. S. Khan", time: "10:45 AM", status: "in-progress", phone: "9876543211" },
        { id: 103, token: 103, name: "Vikram Singh", age: 42, doctor: "Dr. A. Gupta", time: "10:00 AM", status: "done", phone: "9876543212" },
    ]);

        // search filter
    const [searchTerm,setSearchTerm]=useState("");
    const filter=patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())
            || p.phone.includes(searchTerm));
        // add patient modal
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', doctor: '', phone: '' });



    useEffect(()=>{
        document.title="ReceptionDash-v1 |Medflow";
    },[]);



  return (

    <div className="min-h-screen bg-gray-50 flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-25  bg-[#112025] text-white flex flex-col hidden md:flex">
        <div className="p-6 text-2xl font-bold tracking-wide">
          Med<span className="text-[#396d7c]">Flow</span>
        </div>

        {/*<nav className="flex-1 px-4 space-y-2 mt-6">*/}
        {/*  <NavItem icon="🏠" label="Dashboard" active />*/}
        {/*  <NavItem icon="📅" label="Appointments" />*/}
        {/*  <NavItem icon="👨‍⚕️" label="Doctors List" />*/}
        {/*  <NavItem icon="⚙️" label="Settings" />*/}
        {/*</nav>*/}

        <div className="p-1 border-t border-gray-700">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <span className="mr-3">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Reception Dashboard</h1>
          <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-700">Pooja (Admin)</p>
                <p className="text-xs text-gray-500">Reception Desk 1</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-[#396d7c] text-white flex items-center justify-center font-bold">
                P
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-full ">
          {/* 1. Stats Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-4  ">
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/*  Search Bar */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
             <div className="relative w-full md:w-96">
                 <Search className="absolute left-3 top-3 text-gray-400 " size={18} />
                <input 
                  type="text" 
                  placeholder="Search patient by Name or Phone No."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#396d7c] focus:outline-none"
                  value={searchTerm}

                  onChange={(e)=>setSearchTerm(e.target.value)
                }
                />
             </div>
             <button className="bg-[#396d7c] hover:bg-[#2c5461] text-white px-6 py-2 rounded-lg shadow-md transition-all flex items-center">
                <span className="mr-2 text-xl">+</span> Register New Patient
             </button>
          </div>

          {/* 3. Recent Appointments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-700">Today's Appointments</h2>
              <button className="text-sm text-[#396d7c] font-semibold hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">Token</th>
                    <th className="p-4 font-medium">Patient Name</th>
                    <th className="p-4 font-medium">Doctor</th>
                    <th className="p-4 font-medium">Time</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>

                  {/*table part*/}
                <tbody className="divide-y divide-gray-100">
                  {filter.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">#{apt.id}</td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{apt.name}</p>
                        <p className="text-xs text-gray-500">{apt.age} Yrs</p>
                      </td>
                      <td className="p-4 text-gray-600">{apt.doctor}</td>
                      <td className="p-4 text-gray-600">{apt.time}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                          ${apt.status === 'Waiting' ? 'bg-yellow-100 text-yellow-700' : 
                            apt.status === 'Done' ? 'bg-green-100 text-green-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                          {apt.status}
                        </span>
                      </td>
                        {/*action column*/}
                      <td className="p-4">
                        <button className="text-gray-400 hover:text-[#396d7c]">
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                {filter.length === 0 && (
                    <div className="p-10 text-center">
                        <p className="text-gray-400">Errr....Found No-one. Recheck entered Patient Name or Number </p>
                    </div>
                )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// Sidebar component
const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center px-4 py-3 cursor-pointer rounded-lg transition-colors ${active ? 'bg-[#396d7c] text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{label}</span>
  </div>
);

export default ReceptionistDash;