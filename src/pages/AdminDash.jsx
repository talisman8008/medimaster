import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, UserPlus, LogOut, CheckCircle, Shield, Phone, Activity } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const AdminDash = () => {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Add Staff Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', mobile: '', password: '', role: 'receptionist' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toast
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/admin/staff`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setStaff(res.data.staff);
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout(); // Auto-logout if unauthorized/token expired
            } else {
                showToast('Failed to load staff list', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'MediMaster — Admin Portal';
        
        // Security Check
        const role = localStorage.getItem('Role');
        const token = localStorage.getItem('token');
        if (role !== 'admin' || !token) {
            navigate('/');
            return;
        }

        fetchStaff();
        const interval = setInterval(fetchStaff, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('UserName');
        localStorage.removeItem('Role');
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE}/admin/create-staff`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast(res.data.message);
                setIsModalOpen(false);
                setFormData({ name: '', mobile: '', password: '', role: 'receptionist' });
                fetchStaff();
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to create staff account', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'doctor': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'nurse': return 'bg-pink-50 text-pink-700 border-pink-200';
            case 'receptionist': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'patient': return 'bg-gray-50 text-gray-700 border-gray-200'; // Should rarely be listed here, but just in case
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    // Derived stats
    const totalStaff = staff.length;
    const adminCount = staff.filter(s => s.profiles[0]?.role === 'admin').length;
    const doctorCount = staff.filter(s => s.profiles[0]?.role === 'doctor').length;
    const recepCount = staff.filter(s => s.profiles[0]?.role === 'receptionist').length;

    return (
        <div className="flex h-screen bg-surface-100 overflow-hidden text-gray-800 font-sans selection:bg-primary-500 selection:text-white">
            
            {/* ════════════════════════════════════
                SIDEBAR (Desktop)
            ════════════════════════════════════ */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-surface-200 shadow-soft z-20">
                <div className="h-20 flex items-center px-8 border-b border-surface-200">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-teal mr-4">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-gray-800">Admin<span className="text-primary-500">Portal</span></h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">MediMaster</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="px-4 py-3 mb-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Management</p>
                    </div>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-primary-50 text-primary-700 rounded-xl font-bold transition-all border border-primary-100 shadow-sm relative overflow-hidden group">
                        <Users className="w-5 h-5 z-10" />
                        <span className="z-10">Staff Directory</span>
                        <div className="absolute inset-0 bg-primary-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </button>
                    {/* Placeholder for future features */}
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-surface-50 hover:text-gray-800 rounded-xl font-bold transition-all">
                        <Activity className="w-5 h-5" />
                        <span>System Logs</span>
                    </button>
                </div>

                <div className="p-4 border-t border-surface-200 bg-surface-50/50">
                    <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-white border border-surface-200 rounded-xl shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-inner">
                            {localStorage.getItem('UserName')?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{localStorage.getItem('UserName') || 'Administrator'}</p>
                            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Super Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold transition-colors border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ════════════════════════════════════
                MAIN CONTENT AREA
            ════════════════════════════════════ */}
            <main className="flex-1 flex flex-col min-w-0 bg-surface-100 relative z-10">
                {/* ── Mobile Header ── */}
                <header className="lg:hidden h-[72px] bg-white border-b border-surface-200 flex items-center justify-between px-4 sm:px-6 z-30 shadow-sm relative">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-teal">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-lg font-black tracking-tight text-gray-800">Admin<span className="text-primary-500">Portal</span></h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 bg-surface-50 border border-surface-200 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                {/* ── Scrollable Content ── */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">

                    {/* ── Stats Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[
                            { title: 'Total Staff', count: totalStaff, bgLight: 'bg-primary-50', textColor: 'text-primary-600', icon: Users },
                            { title: 'Doctors', count: doctorCount, bgLight: 'bg-blue-50', textColor: 'text-blue-600', icon: Shield },
                            { title: 'Receptionists', count: recepCount, bgLight: 'bg-emerald-50', textColor: 'text-emerald-600', icon: Users },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="card group p-6 hover:shadow-elevated hover:border-primary-200 transition-all duration-300 animate-slide-up"
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                                            <p className="text-3xl font-black text-gray-800 mt-2">{stat.count}</p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-2xl ${stat.bgLight} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Title + Add Button ── */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800">Staff Directory</h2>
                            <p className="text-sm font-medium text-gray-500 mt-1">Manage system access and roles</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary flex items-center justify-center gap-3 py-3.5 px-6 whitespace-nowrap text-sm w-full sm:w-auto"
                        >
                            <UserPlus className="w-5 h-5" />
                            Add New Staff
                        </button>
                    </div>

                    {/* ── Staff Table ── */}
                    <div className="card overflow-hidden animate-slide-up delay-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-surface-200 bg-surface-50">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Staff Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Role / Access</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Contact</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="inline-block w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
                                                <p className="mt-4 text-sm font-bold text-gray-400">Loading directory...</p>
                                            </td>
                                        </tr>
                                    ) : staff.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-16 text-center">
                                                <div className="text-5xl mb-4 opacity-30">👥</div>
                                                <p className="text-gray-400 font-bold">No staff found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        staff.map((user) => {
                                            const primaryProfile = user.profiles[0] || {};
                                            return (
                                                <tr key={user._id} className="table-row-hover border-b border-surface-100 last:border-0">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                                                                {primaryProfile.name ? primaryProfile.name.charAt(0) : '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800 text-sm">{primaryProfile.name || 'Unknown'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider border ${getRoleBadge(primaryProfile.role)}`}>
                                                            {primaryProfile.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-semibold text-gray-500">
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                            {user.mobile}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                            Active
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* ════════════════════════════════════
                ADD STAFF MODAL
            ════════════════════════════════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                        onClick={() => setIsModalOpen(false)}
                    />
                    
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-surface-200 overflow-hidden animate-slide-up scale-in z-10 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-surface-200 bg-surface-50">
                            <h3 className="text-xl font-black text-gray-800">Add New Staff</h3>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Create access credentials</p>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <form onSubmit={handleAddStaff} className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5" />
                                        Staff Role
                                    </label>
                                    <select
                                        required
                                        className="input-field appearance-none cursor-pointer"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="receptionist">Receptionist</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="nurse">Nurse</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter full name"
                                        className="input-field"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-1.5">
                                        Mobile Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        placeholder="10-digit mobile number"
                                        className="input-field"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-1.5">
                                        Password
                                    </label>
                                    <input
                                        required
                                        type="password"
                                        placeholder="Create a strong password"
                                        className="input-field"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3.5 px-4 bg-surface-100 hover:bg-surface-200 text-gray-600 rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] btn-primary py-3.5 px-4 flex items-center justify-center disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toast Notifications ── */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[120] animate-slide-right ${
                    toast.type === 'error' ? 'bg-white border border-red-200 shadow-lg' : 'bg-white border border-emerald-200 shadow-lg'
                } rounded-xl px-6 py-4 max-w-sm`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                        <p className={`text-sm font-semibold ${toast.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDash;
