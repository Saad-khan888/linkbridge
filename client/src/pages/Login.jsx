import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('=== LOGIN ATTEMPT (Frontend) ===');
      console.log('Email:', formData.email);
      console.log('Selected role tab:', role);
      
      const response = await login(formData.email, formData.password);
      
      console.log('Login response:', response);
      console.log('User role from response:', response.user.role);
      console.log('User data:', response.user);
      
      // Navigate based on user role
      if (response.user.role === 'admin') {
        console.log('Navigating to /admin/dashboard');
        navigate('/admin/dashboard');
      } else if (response.user.role === 'teacher') {
        console.log('Navigating to /teacher/dashboard');
        navigate('/teacher/dashboard');
      } else {
        console.log('Navigating to /dashboard');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <h1 className="brand-title">Linkbridge</h1>
            <p className="brand-subtitle">Connect. Learn. Grow.</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {/* Role Selection */}
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
              onClick={() => setRole('teacher')}
            >
              Teacher
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <button type="submit" className="btn-submit">Log In</button>
          </form>
          
          <div className="auth-divider">
            <span>New to Linkbridge?</span>
          </div>
          
          <Link to="/register" className="btn-secondary-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
