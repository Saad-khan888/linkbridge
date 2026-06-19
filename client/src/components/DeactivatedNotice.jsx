import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, LogOut, User, Trash2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import './DeactivatedNotice.css';

const DeactivatedNotice = () => {
  const { user, logout, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
      // If still deactivated after refresh, the component will remain
      // If reactivated, the parent component will re-render and show the dashboard
    } catch (error) {
      console.error('Error refreshing user status:', error);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete('http://localhost:5000/api/auth/delete-account');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleViewProfile = () => {
    if (user.role === 'teacher') {
      navigate('/teacher/profile');
    } else if (user.role === 'student') {
      navigate('/profile');
    }
  };

  return (
    <div className="deactivated-container">
      <div className="deactivated-card">
        <div className="deactivated-icon">
          <AlertCircle size={64} />
        </div>
        
        <h1>Account Deactivated</h1>
        
        <p className="deactivated-message">
          Your account has been deactivated by an administrator. 
          You no longer have access to the platform's features.
        </p>

        <div className="deactivated-info">
          <div className="info-item">
            <strong>Name:</strong> {user?.name}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="info-item">
            <strong>Role:</strong> {user?.role === 'teacher' ? 'Teacher' : 'Student'}
          </div>
        </div>

        <p className="deactivated-help">
          If you believe this is a mistake, please contact the administrator.
        </p>

        <div className="deactivated-actions">
          <button 
            className={`btn-refresh ${refreshing ? 'refreshing' : ''}`} 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Checking...' : 'Check Status'}
          </button>

          <button className="btn-profile" onClick={handleViewProfile}>
            <User size={18} />
            View Profile
          </button>
          
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
          
          <button className="btn-delete" onClick={handleDeleteAccount}>
            <Trash2 size={18} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivatedNotice;
