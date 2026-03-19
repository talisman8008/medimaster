import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, User, Clock, CheckCircle, Activity, Heart, Shield } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const PatientDash = () => {
    const navigate = useNavigate();
    const [tokenData, setTokenData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTokenStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/patients/my-token`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setTokenData(res.data);
                setError(null);
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            } else if (err.response?.status === 404) {
                setError(err.response.data.message);
                setTokenData(null);
            } else {
                setError('Unable to fetch token status. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'MediMaster — Patient Portal';
        
        const role = localStorage.getItem('Role');
        const token = localStorage.getItem('token');
        if (role !== 'patient' || !token) {
            navigate('/');
            return;
        }

        fetchTokenStatus();
        const interval = setInterval(fetchTokenStatus, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('UserName');
        localStorage.removeItem('Role');
        localStorage.removeItem('token');
        navigate('/');
    };

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'waiting':
                return (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-50 text-amber-600 font-black tracking-wider text-sm border border-amber-200 shadow-sm animate-pulse-soft">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        PLEASE WAIT
                    </div>
                );
            case 'in-progress':
                return (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 font-black tracking-wider text-sm border border-blue-200 shadow-sm">
                        <Activity className="w-4 h-4 animate-spin-slow" />
                        WITH DOCTOR
                    </div>
                );
            case 'done':
                return (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-600 font-black tracking-wider text-sm border border-emerald-200 shadow-sm">
                        <CheckCircle className="w-4 h-4" />
                        CONSULTATION COMPLETE
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white border-b border-surface-200 shadow-sm sticky top-0 z-30">
                <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-teal">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-gray-800">Medi<span className="text-primary-500">Master</span></h1>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl hover:bg-surface-100 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col pt-8">
                
                <div className="text-center mb-8 animate-slide-up">
                    <h2 className="text-3xl font-black text-gray-800">
                        Hello, {localStorage.getItem('UserName')?.split(' ')[0] || 'Patient'}
                    </h2>
                    <p className="text-sm font-bold text-gray-400 mt-2">Welcome to your health portal</p>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center pt-12 animate-in fade-in">
                        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin shadow-lg"></div>
                        <p className="mt-6 text-sm font-black tracking-widest text-primary-500 uppercase">Checking status...</p>
                    </div>
                ) : error ? (
                    <div className="card text-center p-8 bg-white border-dashed border-2 border-surface-200 animate-slide-up delay-100 mt-4 shadow-sm">
                        <div className="w-16 h-16 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-5">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 mb-2">No Active Token</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                            {error}
                        </p>
                        <button
                            onClick={fetchTokenStatus}
                            className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-6 py-2.5 rounded-xl transition-colors"
                        >
                            Refresh Status
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-slide-up delay-100">
                        
                        {/* Token Card */}
                        <div className="relative bg-white rounded-[2rem] p-8 shadow-elevated border border-surface-200 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                            
                            <div className="text-center">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Your Token Number</p>
                                <div className="text-8xl font-black text-primary-600 tracking-tighter mb-6 drop-shadow-sm">
                                    {tokenData.patient.token}
                                </div>
                                
                                <StatusBadge status={tokenData.patient.status} />
                            </div>

                            {(tokenData.patient.status === 'waiting' || tokenData.patient.status === 'in-progress') && (
                                <div className="mt-8 pt-6 border-t border-surface-100/50">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4">Live Status</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 rounded-2xl bg-surface-50 border border-surface-100">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Queue Pos</p>
                                            <p className="text-2xl font-black text-gray-800">
                                                {tokenData.aheadCount > 0 ? `#${tokenData.aheadCount + 1}` : 'Next'}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 rounded-2xl bg-surface-50 border border-surface-100">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Wait Time</p>
                                            <p className="text-2xl font-black text-primary-600">
                                                ~{tokenData.estimatedWaitMinutes}<span className="text-sm font-bold text-primary-400 ml-1">min</span>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar Animation */}
                                    <div className="w-full bg-surface-100 h-2 mt-6 rounded-full overflow-hidden">
                                        <div className="bg-primary-500 h-full rounded-full w-full animate-progress-indeterminate" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Doctor Info */}
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-surface-200 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Assigned To</p>
                                <p className="text-base font-bold text-gray-800 mt-0.5">{tokenData.patient.doctor || 'General Physician'}</p>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
};

export default PatientDash;
