import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, ArrowLeft, Lock, Mail } from 'lucide-react';
import './Auth.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password, true);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-container">
        <div className="auth-card admin-card">
          <div className="admin-header">
            <div className="admin-icon-wrapper">
              <Shield size={32} strokeWidth={2.5} />
            </div>
            <h1 className="auth-title">Admin Portal</h1>
            <p className="auth-subtitle">Secure access for administrators</p>
          </div>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            <button type="submit" className="btn-submit admin-submit">
              <Shield size={18} />
              Sign In as Admin
            </button>
          </form>
          
          <div className="auth-footer-links">
            <Link to="/" className="back-link">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <Link to="/login" className="switch-link">
              Student Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
