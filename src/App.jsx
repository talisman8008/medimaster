import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Loginpage';
import ReceptionistDashv2 from './pages/ReceptionistDashv2.jsx';
import AdminDash from './pages/AdminDash.jsx';
import PatientDash from './pages/PatientDash.jsx';
import ProtectedRoute from './components/routeProtection.jsx';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/receptionist2"
                    element={
                        <ProtectedRoute>
                            <ReceptionistDashv2 />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDash />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute>
                            <PatientDash />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </HashRouter>
    );
}

export default App;