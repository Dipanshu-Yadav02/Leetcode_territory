import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Verify from './pages/Verify';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireVerified = true }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="h-screen bg-leetcode-bg flex justify-center items-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (requireVerified && !user.isVerified) return <Navigate to="/verify" />;
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Verify only requires being logged in, not Verified */}
        <Route path="/verify" element={
          <ProtectedRoute requireVerified={false}>
            <Verify />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute requireVerified={true}>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
