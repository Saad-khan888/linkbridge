import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Edit2, LogOut, Trash2, Crown, CheckCircle } from 'lucide-react';
import API_URL from '../config/api';
import './Profile.css';

const AdminProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const res = await axios.put(`${API_URL}/api/auth/profile`, formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API_URL}/api/auth/profile`);
      logout();
      navigate('/');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page admin-profile-page">
      <div className="profile-container admin-profile-container">
        <div className="profile-header admin-profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <h1>Admin Profile Settings</h1>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-form-section">
            {!isEditing ? (
              <div className="profile-info">
                <div className="admin-badge-large">
                  <Crown className="badge-icon" size={32} />
                  <span>Administrator</span>
                </div>
                
                <div className="info-group">
                  <label>Full Name</label>
                  <p>{user?.name}</p>
                </div>
                
                <div className="info-group">
                  <label>Email Address</label>
                  <p>{user?.email}</p>
                </div>
                
                <div className="info-group">
                  <label>Account Type</label>
                  <p className="role-badge admin-role-badge">Administrator</p>
                </div>

                <div className="info-group">
                  <label>Account Status</label>
                  <p className="status-active">
                    <CheckCircle size={16} className="status-icon" />
                    Active
                  </p>
                </div>

                <div className="info-group">
                  <label>Member Since</label>
                  <p>{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                
                <button className="btn-edit admin-btn-edit" onClick={() => setIsEditing(true)}>
                  <Edit2 size={18} /> Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="profile-actions admin-profile-actions">
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
          <button className="btn-delete" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Admin Account</h2>
            <p>Are you sure you want to delete your administrator account? This action cannot be undone and will remove all your admin privileges.</p>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
