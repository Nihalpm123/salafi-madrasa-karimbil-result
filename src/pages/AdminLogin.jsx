import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password123') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--color-accent-light)', borderRadius: '50%', marginBottom: '24px' }}>
          <Lock size={32} color="var(--color-accent)" />
        </div>
        <h2 style={{ marginBottom: '8px' }}>Admin Login</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>Enter your credentials to access the dashboard</p>
        
        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Username</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ width: '100%' }} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              style={{ width: '100%' }} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Login to Dashboard</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
