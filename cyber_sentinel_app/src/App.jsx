import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import LegalPage from './LegalPage';
import CustomCursor from './CustomCursor';
import Login from './Login';
import Dashboard from './Dashboard';
import BlogPost from './BlogPost';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/legal/:documentId" element={<LegalPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
