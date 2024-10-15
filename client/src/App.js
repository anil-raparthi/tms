// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AuthForm from './components/AuthForm';
import SignUp from './components/SignUp';
import Login from './pages/Login';
import TransactionManagement from './components/TransactionManagement';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<AuthForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={<TransactionManagement />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
