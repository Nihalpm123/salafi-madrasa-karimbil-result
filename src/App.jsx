import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import PublicResults from './pages/PublicResults';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  return (
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        padding: '16px 40px', 
        zIndex: 100, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-bg-panel)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
          SALAFI MADRASA KARIMBIL
        </div>
        <div>
          <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', marginRight: '24px', fontWeight: 500 }}>Home</Link>
          {localStorage.getItem('adminAuth') === 'true' ? (
            <>
              <Link to="/admin" style={{ color: 'var(--color-accent)', textDecoration: 'none', marginRight: '24px', fontWeight: 500 }}>Dashboard</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 500 }}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>Admin Login</Link>
          )}
        </div>
      </nav>
  );
};

function App() {
  return (
    <Router>
      <Navigation />

      <div className="page-wrapper container">
        <Routes>
          <Route path="/" element={<PublicResults />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
