import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search, Plus, Bell, CheckCircle, XCircle, Trash2, LogOut, Phone,
    LayoutDashboard, Users, CalendarDays, Settings, HeartPulse, Clock, AlertTriangle,
    Printer, Edit3, ChevronRight, Stethoscope, Loader2, UserPlus, CalendarPlus
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const ReceptionistDashv2 = () => {
    const navigate = useNavigate();

    // ── Data States ──
    const [patients, setPatients] = useState([]); // Today's Queue
    const [directory, setDirectory] = useState([]); // All Registered Patients
    const [doctors, setDoctors] = useState([]); // Doctor List
    
    // ── Search & UI States ──
    const [searchTerm, setSearchTerm] = useState("");
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    
    // Booking State
    const [bookData, setBookData] = useState({ q: '', searchResults: [], selectedUser: null, doctor: '' });
    const [isSearching, setIsSearching] = useState(false);

    // Registration State
    const [registerData, setRegisterData] = useState({ name: '', age: '', gender: 'Male', mobile: '', password: '' });

    const [activeNav, setActiveNav] = useState('dashboard');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [dashStats, setDashStats] = useState({ total: 0, waiting: 0, inProgress: 0, done: 0 });

    const userName = localStorage.getItem("UserName") || "Receptionist";
    const userRole = localStorage.getItem("Role") || "receptionist";
    const token = localStorage.getItem("token");

    const authHeaders = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    // ── Fetches ──
    const fetchPatients = useCallback(async (search = '') => {
        try {
            const query = search ? `?search=${encodeURIComponent(search)}` : '';
            const res = await axios.get(`${API_BASE}/patients${query}`, authHeaders);
            if (res.data.success) setPatients(res.data.patients);
        } catch (err) {
            console.error('Failed to fetch patients:', err.message);
            if (err.response?.status === 401) { localStorage.clear(); navigate('/'); }
        } finally {
            setIsLoading(false);
        }
    }, [token, navigate]);

    const fetchDirectory = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/patients/directory`, authHeaders);
            if (res.data.success) setDirectory(res.data.patients);
        } catch (err) {
            console.error('Failed to fetch directory:', err.message);
        }
    }, [token]);

    const fetchDoctors = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/staff/doctors`, authHeaders);
            if (res.data.success) setDoctors(res.data.doctors);
        } catch (err) {
            console.error('Failed to fetch doctors:', err.message);
        }
    }, [token]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/patients/stats`, authHeaders);
            if (res.data.success) setDashStats(res.data.stats);
        } catch (err) {
            console.error('Failed to fetch stats:', err.message);
        }
    }, [token]);

    useEffect(() => {
        document.title = "Dashboard — MediMaster";
        fetchPatients();
        fetchStats();
        fetchDoctors();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (activeNav === 'patients') {
            fetchDirectory();
        }
    }, [activeNav]);

    // Local filter for today's queue
    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.phone.includes(searchTerm)
    );

    const filteredDirectory = directory.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.mobile.includes(searchTerm)
    );

    // ── API actions ──
    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`${API_BASE}/patients/${id}/status`, { status: newStatus }, authHeaders);
            setPatients(patients.map(p => p._id === id ? { ...p, status: newStatus } : p));
            fetchStats();
        } catch (err) {
            console.error('Status update failed:', err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this patient from the queue?")) return;
        try {
            await axios.delete(`${API_BASE}/patients/${id}`, authHeaders);
            setPatients(patients.filter(p => p._id !== id));
            fetchStats();
        } catch (err) {
            console.error('Delete failed:', err.message);
        }
    };

    // ── Registration (Database) ──
    const handleRegisterPatient = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/receptionist/create-patient`, registerData, authHeaders);
            if (res.data.success) {
                alert('Patient account registered successfully!');
                setIsRegisterModalOpen(false);
                if (activeNav === 'patients') fetchDirectory();
                
                // Pre-fill booking
                setBookData({ 
                    q: registerData.mobile, 
                    searchResults: [], 
                    selectedUser: {
                        name: registerData.name, 
                        mobile: registerData.mobile, 
                        age: registerData.age, 
                        gender: registerData.gender
                    }, 
                    doctor: '' 
                });
                setRegisterData({ name: '', age: '', gender: 'Male', mobile: '', password: '' });
                setIsBookModalOpen(true);
            }
        } catch (err) {
            console.error('Registration failed:', err.message);
            alert(err.response?.data?.message || 'Failed to register patient.');
        }
    };

    // ── Fuzzy Search for Booking ──
    const searchUsers = async (query) => {
        setBookData(prev => ({ ...prev, q: query, searchResults: [], selectedUser: null }));
        if (query.trim().length >= 3) {
            setIsSearching(true);
            try {
                const res = await axios.get(`${API_BASE}/patients/search-user?q=${encodeURIComponent(query)}`, authHeaders);
                if (res.data.success) {
                    setBookData(prev => ({ ...prev, searchResults: res.data.users }));
                }
            } catch (err) {
                // Ignore 404s
            } finally {
                setIsSearching(false);
            }
        }
    };

    const selectSearchUser = (user) => {
        setBookData({ ...bookData, selectedUser: user, searchResults: [], q: `${user.name} (${user.mobile})` });
    };

    // ── Booking (Queue) ──
    const handleBookAppointment = async (e) => {
        e.preventDefault();
        if (!bookData.selectedUser) {
            alert("Please select a valid registered patient from the search.");
            return;
        }
        try {
            const payload = {
                name: bookData.selectedUser.name,
                age: bookData.selectedUser.age,
                gender: bookData.selectedUser.gender,
                phone: bookData.selectedUser.mobile,
                doctor: bookData.doctor
            };
            const res = await axios.post(`${API_BASE}/patients`, payload, authHeaders);
            if (res.data.success) {
                setPatients([res.data.patient, ...patients]);
                setIsBookModalOpen(false);
                setBookData({ q: '', searchResults: [], selectedUser: null, doctor: '' });
                fetchStats();
                if (activeNav !== 'dashboard') setActiveNav('dashboard');
            }
        } catch (err) {
            console.error('Booking failed:', err.message);
            alert(err.response?.data?.message || 'Failed to book appointment.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'appointments', label: 'Appointments', icon: CalendarDays },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Helpers
    const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const getStatusBadge = (status) => {
        switch (status) {
            case 'waiting': return 'badge-waiting';
            case 'in-progress': return 'badge-progress';
            case 'done': return 'badge-done';
            default: return 'bg-gray-100 text-gray-600';
        }
    };
    const getStatusDot = (status) => {
        switch (status) {
            case 'waiting': return 'bg-amber-500';
            case 'in-progress': return 'bg-blue-500';
            case 'done': return 'bg-emerald-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="flex bg-surface-100 min-h-screen font-sans">

            {/* ════════════════════════════════════
                SIDEBAR
            ════════════════════════════════════ */}
            <aside className="w-[260px] bg-white border-r border-surface-200 flex-col justify-between hidden lg:flex shadow-soft">
                {/* Logo */}
                <div>
                    <div className="p-6 flex items-center gap-3 border-b border-surface-200">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-teal">
                            <HeartPulse className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-gray-800 tracking-tight">
                                Medi<span className="text-primary-500">Master</span>
                            </h1>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Hospital Suite</p>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="mt-4 px-3 space-y-1">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            const isActive = activeNav === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-surface-50'
                                        }`}
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                    {item.label}
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-surface-200">
                    <div className="bg-surface-50 rounded-xl p-4 border border-surface-200 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-sm font-black text-white">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-700 truncate">{userName}</p>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider capitalize">{userRole}</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 text-sm font-semibold transition-all">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ════════════════════════════════════
                MAIN CONTENT
            ════════════════════════════════════ */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="px-8 py-6 bg-white border-b border-surface-200 flex justify-between items-center shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight capitalize">
                            {activeNav}
                        </h2>
                        <p className="text-sm text-gray-400 font-medium mt-0.5">
                            {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeNav !== 'dashboard' && (
                           <button onClick={() => setIsBookModalOpen(true)} className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
                               <CalendarPlus className="w-4 h-4" /> Book Appt
                           </button>
                        )}
                        <button className="relative p-2.5 bg-surface-50 border border-surface-200 rounded-xl hover:bg-surface-100 transition-all">
                            <Bell className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    
                    {/* TAB: DASHBOARD */}
                    {activeNav === 'dashboard' && (
                        <div className="animate-fade-in space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                {[
                                    { title: 'Total Patients', count: dashStats.total, icon: Users, bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
                                    { title: 'Doctors Active', count: doctors.length, icon: Stethoscope, bgLight: 'bg-primary-50', textColor: 'text-primary-600' },
                                    { title: 'Pending Tokens', count: dashStats.waiting, icon: Clock, bgLight: 'bg-amber-50', textColor: 'text-amber-600' },
                                    { title: 'Completed', count: dashStats.done, icon: CheckCircle, bgLight: 'bg-emerald-50', textColor: 'text-emerald-600' }
                                ].map((stat, i) => (
                                    <div key={i} className="card p-6 border border-surface-200 hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                                                <p className="text-3xl font-black text-gray-800 mt-2">{stat.count}</p>
                                            </div>
                                            <div className={`w-12 h-12 rounded-2xl ${stat.bgLight} flex items-center justify-center`}>
                                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Search & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input type="text" placeholder="Search today's queue..." className="input-field pl-12 bg-white" 
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <button onClick={() => setIsBookModalOpen(true)} className="btn-primary flex items-center justify-center gap-2 px-8">
                                    <CalendarPlus className="w-5 h-5" /> Walk-in Appointment
                                </button>
                            </div>

                            {/* Queue Table */}
                            <div className="card overflow-hidden border border-surface-200">
                                <div className="px-6 py-4 border-b border-surface-200">
                                    <h3 className="font-bold text-gray-800">Today's Live Queue</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-surface-50 border-b border-surface-200">
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Token</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Patient</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Doctor</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPatients.map(patient => (
                                                <tr key={patient._id} className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50">
                                                    <td className="px-6 py-4">
                                                        <span className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg font-black text-xs border border-primary-200">#{patient.token}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-gray-800 text-sm">{patient.name}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium">{patient.phone}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-500">{patient.doctor}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`badge ${getStatusBadge(patient.status)}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(patient.status)}`} />
                                                            {patient.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {patient.status !== 'done' && (
                                                                <button onClick={() => handleStatusChange(patient._id, 'done')} className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => handleDelete(patient._id)} className="text-red-400 hover:text-red-500 bg-red-50 p-2 rounded-lg">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredPatients.length === 0 && (
                                                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">No patients found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PATIENTS DIRECTORY */}
                    {activeNav === 'patients' && (
                        <div className="animate-fade-in space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-black text-gray-800">Patient Directory</h3>
                                    <p className="text-sm text-gray-400 font-medium">{directory.length} total registered patients</p>
                                </div>
                                <button onClick={() => setIsRegisterModalOpen(true)} className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 font-bold bg-white text-primary-600 border-2 border-primary-100 hover:border-primary-300">
                                    <UserPlus className="w-4 h-4" /> Register New Account
                                </button>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input type="text" placeholder="Search directory by name or mobile..." className="input-field pl-12 bg-white" 
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>

                            <div className="card overflow-hidden border border-surface-200">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-surface-50 border-b border-surface-200">
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Patient Name</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Mobile</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Age/Gender</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDirectory.map(user => (
                                            <tr key={user.id} className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
                                                        <span className="font-bold text-gray-800">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-600">{user.mobile}</td>
                                                <td className="px-6 py-4 font-medium text-gray-600">{user.age} • {user.gender}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <button onClick={() => {
                                                        setBookData({ q: `${user.name} (${user.mobile})`, searchResults: [], selectedUser: user, doctor: '' });
                                                        setIsBookModalOpen(true);
                                                    }} className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
                                                        Book Appt
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredDirectory.length === 0 && (
                                            <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">No results in directory.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: APPOINTMENTS */}
                    {activeNav === 'appointments' && (
                        <div className="animate-fade-in flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-20 h-20 bg-surface-200 rounded-3xl flex items-center justify-center mb-6">
                                <CalendarDays className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tight">Future Scheduling</h3>
                            <p className="text-gray-500 font-medium mt-3 max-w-md">Currently, Medimaster handles live daily queues on the Dashboard. Calendar-based future scheduling will be available soon.</p>
                            <button onClick={() => setActiveNav('dashboard')} className="mt-8 btn-secondary px-6 border-2">Return to Dashboard</button>
                        </div>
                    )}
                </div>
            </main>

            {/* ════════════════════════════════════
                REGISTER PATIENT MODAL
            ════════════════════════════════════ */}
            {isRegisterModalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-[480px] border border-surface-200 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Register Account</h2>
                                <p className="text-xs text-gray-400 font-medium mt-1">Add a new patient to the database</p>
                            </div>
                            <button onClick={() => setIsRegisterModalOpen(false)} className="p-2 hover:bg-surface-100 rounded-xl text-gray-400">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleRegisterPatient} className="space-y-4">
                            <input required type="text" className="input-field" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} placeholder="Full Name" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" className="input-field" value={registerData.age} onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })} placeholder="Age" />
                                <select className="input-field" value={registerData.gender} onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}>
                                                                       <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                                                                  </select>
                                                              </div>
                                                              <input required type="tel" pattern="[0-9]{10}" className="input-field" value={registerData.mobile} onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })} placeholder="10-digit mobile number" />
                                                              <input required type="password" className="input-field" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} placeholder="Login Password" />
                                                              <button type="submit" className="w-full py-4 text-sm font-bold bg-white border-2 border-primary-200 text-primary-600 hover:border-primary-400 rounded-xl">Create Account</button>
                                                          </form>
                                                      </div>
                                                  </div>
                                              )}
                                  
                                              {/* ════════════════════════════════════
                                                  BOOK APPOINTMENT MODAL (Fuzzy Search)
                                              ════════════════════════════════════ */}
                                              {isBookModalOpen && (
                                                  <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4 animate-fade-in">
                                                      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-[480px] border border-surface-200 animate-scale-in">
                                                          <div className="flex justify-between items-center mb-6">
                                                              <div>
                                                                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">Book to Queue</h2>
                                                                  <p className="text-xs text-gray-400 font-medium mt-1">Search DB to add patient to today's queue</p>
                                                              </div>
                                                              <button onClick={() => setIsBookModalOpen(false)} className="p-2 hover:bg-surface-100 rounded-xl text-gray-400">
                                                                  <XCircle className="w-6 h-6" />
                                                              </button>
                                                          </div>
                                  
                                                          <form onSubmit={handleBookAppointment} className="space-y-5">
                                                              <div className="relative">
                                                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                                                                      <span>Patient Search</span>
                                                                      {isSearching && <span className="text-primary-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/></span>}
                                                                  </label>
                                                                  <input required type="text" className="input-field" value={bookData.q}
                                                                      onChange={(e) => searchUsers(e.target.value)} placeholder="Type Name or Mobile No..." />
                                                                  
                                                                  {/* Search Results Dropdown */}
                                                                  {bookData.searchResults.length > 0 && (
                                                                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-surface-200 rounded-xl shadow-elevated z-10 overflow-hidden max-h-48 overflow-y-auto">
                                                                          {bookData.searchResults.map(user => (
                                                                              <div key={user.id} onClick={() => selectSearchUser(user)} className="p-3 border-b border-surface-100 hover:bg-primary-50 cursor-pointer transition-colors">
                                                                                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                                                                  <p className="text-xs text-gray-500 font-medium">{user.mobile} • {user.age} Yrs</p>
                                                                              </div>
                                                                          ))}
                                                                      </div>
                                                                  )}
                                                              </div>
                                  
                                                              {bookData.selectedUser && (
                                                                  <div className="bg-surface-50 p-4 border border-surface-200 rounded-xl">
                                                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Selected Patient</p>
                                                                      <p className="text-sm font-black text-gray-800">{bookData.selectedUser.name}</p>
                                                                      <p className="text-xs text-gray-500 font-semibold">{bookData.selectedUser.mobile} • {bookData.selectedUser.age} Yrs • {bookData.selectedUser.gender}</p>
                                                                  </div>
                                                              )}
                                  
                                                              <div>
                                                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">Consulting Doctor</label>
                                                                  <select required className="input-field appearance-none" value={bookData.doctor} onChange={(e) => setBookData({ ...bookData, doctor: e.target.value })}>
                                                                      <option value="">Select Doctor</option>
                                                                      {doctors.map(doc => (
                                                                          <option key={doc.id} value={doc.name}>{doc.name}</option>
                                                                      ))}
                                                                  </select>
                                                              </div>
                                  
                                                              <button type="submit" disabled={!bookData.selectedUser || !bookData.doctor} className="btn-primary w-full py-4 text-base font-bold mt-2 disabled:opacity-50">
                                                                  Add to Live Queue
                                                              </button>
                                                          </form>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  };
                                  
                                  export default ReceptionistDashv2;