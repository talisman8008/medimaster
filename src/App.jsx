import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ReceptionistDash from './pages/ReceptionistDash';
import ReceptionistDashv2 from "./pages/ReceptionistDashv2.jsx";
import ProtectedRoute from "./components/routeProtection.jsx";
function App() {
    return (

        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />

                {/*<Route path="/receptionist" element={<ProtectedRoute><ReceptionistDash /> </ProtectedRoute>} />*/}
                {/*for Testing) */}
                <Route path="/receptionist-dash" element={<ReceptionistDash />} />
                {/*hehehhe*/}
            </Routes>
        </HashRouter>
    );
}

export default App;