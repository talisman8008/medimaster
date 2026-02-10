import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Loginpage';

function App() {
    return (
        <HashRouter>
            <Routes>

                <Route path="/" element={<LoginPage />} />

            </Routes>
        </HashRouter>
    );
}

export default App;
