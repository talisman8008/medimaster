import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ReceptionistDash from './pages/ReceptionistDash';
import ReceptionistDashv2 from "./pages/ReceptionistDashv2.jsx";
function App() {
    return (

        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/receptionist" element={<ReceptionistDash />} />
                <Route path="/receptionist2" element={<ReceptionistDashv2 />} />
                {/*hehehhe*/}
            </Routes>
        </HashRouter>
    );
}

export default App;