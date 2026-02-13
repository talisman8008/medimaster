import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ReceptionistDash from './pages/ReceptionistDash';

function App() {
    return (

        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/receptionist" element={<ReceptionistDash />} />
                {/*hehehhe*/}
            </Routes>
        </HashRouter>
    );
}

export default App;