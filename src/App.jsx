import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Loginpage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Router ne ab LoginPage ko wrap kar liya, ab useNavigate chalega */}
                <Route path="/" element={<LoginPage />} />
                {/*<Route path="/receptionist" element={<ReceptionistDash />} />*/}
            </Routes>
        </Router>
    );
}

export default App;