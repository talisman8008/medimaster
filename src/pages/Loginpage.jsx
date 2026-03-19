import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Phone, Lock, Shield, ArrowRight, HeartPulse, Activity, Stethoscope } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [loginData, setLoginData] = useState({ mobile: '', password: '' });

    useEffect(() => {
        document.title = 'MediMaster — Login';
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate('/receptionist2');
        }
    }, [navigate]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/login`, loginData);
            if (res.data.success) {
                const profile = res.data.profiles[0];
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('UserName', profile.name);
                localStorage.setItem('Role', profile.role);
                if (res.data.token) localStorage.setItem('token', res.data.token);
                showToast('Login successful! Redirecting...');

                // Route based on role
                let destination = '/receptionist2';
                if (profile.role === 'patient') destination = '/patient';
                else if (profile.role === 'admin') destination = '/admin';
                
                setTimeout(() => navigate(destination), 1200);
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Login failed. Check your credentials.', 'error');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-100 flex items-center justify-center p-4 relative overflow-hidden">

            {/* ── Decorative Background Shapes ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary-100/60 blur-[80px] animate-blob" />
                <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-warm-100/50 blur-[80px] animate-blob" style={{ animationDelay: '3s' }} />
                <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-primary-200/30 blur-[60px] animate-float" />
            </div>

            {/* Subtle dot grid */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #2a9d8f 0.5px, transparent 0)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* ── Main Card ── */}
            <div className="relative w-full max-w-[440px] animate-scale-in">

                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 mb-4 shadow-glow-teal">
                        <HeartPulse className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Medi<span className="text-primary-500">Master</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Staff Portal</p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-3xl shadow-elevated p-8 border border-surface-200">

                    {/* ── Login Form ── */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    required
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    className="input-field pl-12"
                                    value={loginData.mobile}
                                    onChange={(e) => setLoginData({ ...loginData, mobile: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="input-field pl-12 pr-12"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4 font-medium">
                            Contact your administrator for account access
                        </p>
                    </form>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-8 mt-8 text-gray-400">
                    <div className="flex items-center gap-2 text-xs font-medium">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Secure Auth</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Real-time</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>HIPAA Ready</span>
                    </div>
                </div>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] animate-slide-right ${toast.type === 'error'
                        ? 'bg-white border border-red-200 shadow-lg'
                        : 'bg-white border border-emerald-200 shadow-lg'
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

export default LoginPage;