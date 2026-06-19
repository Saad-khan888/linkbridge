import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, User, Mail, Building, Calendar, AlertCircle } from 'lucide-react';
import '../pages/Dashboard.css';

const TeacherApproval = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeView, setActiveView] = useState('pending'); // 'pending' or 'approved'

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get('http://localhost:5000/api/teachers/pending'),
        axios.get('http://localhost:5000/api/teachers/approved')
      ]);
      setPendingTeachers(pendingRes.data);
      setApprovedTeachers(approvedRes.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId) => {
    try {
      await axios.put(`http://localhost:5000/api/teachers/${teacherId}/approve`);
      showMessage('success', 'Teacher approved successfully');
      fetchTeachers();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to approve teacher');
    }
  };

  const handleReject = async (teacherId) => {
    if (!window.confirm('Are you sure you want to reject this teacher request? This will delete their account.')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${teacherId}/reject`);
      showMessage('success', 'Teacher request rejected');
      fetchTeachers();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to reject teacher');
    }
  };

  const handleDeactivate = async (teacherId) => {
    if (!window.confirm('Are you sure you want to deactivate this teacher?')) {
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/api/teachers/${teacherId}/deactivate`);
      showMessage('success', 'Teacher deactivated');
      fetchTeachers();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to deactivate teacher');
    }
  };

  const handleActivate = async (teacherId) => {
    try {
      await axios.put(`http://localhost:5000/api/teachers/${teacherId}/activate`);
      showMessage('success', 'Teacher activated');
      fetchTeachers();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to activate teacher');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading) {
    return <div className="loading">Loading teachers...</div>;
  }

  return (
    <div className="teacher-approval-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="approval-tabs">
        <button
          className={`tab-btn ${activeView === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveView('pending')}
        >
          Pending Requests
          {pendingTeachers.length > 0 && (
            <span className="badge">{pendingTeachers.length}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeView === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveView('approved')}
        >
          Approved Teachers
          <span className="badge">{approvedTeachers.length}</span>
        </button>
      </div>

      {activeView === 'pending' && (
        <div className="teachers-list">
          {pendingTeachers.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>No pending teacher requests</p>
            </div>
          ) : (
            pendingTeachers.map(teacher => (
              <div key={teacher._id} className="teacher-card pending">
                <div className="teacher-info">
                  <div className="teacher-header">
                    <User size={24} />
                    <div>
                      <h3>{teacher.name}</h3>
                      <span className="status-badge pending">Pending Approval</span>
                    </div>
                  </div>
                  <div className="teacher-details">
                    <div className="detail-item">
                      <Mail size={16} />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="detail-item">
                      <Building size={16} />
                      <span>{teacher.department}</span>
                    </div>
                    <div className="detail-item">
                      <User size={16} />
                      <span>Employee ID: {teacher.employeeId}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>Registered: {new Date(teacher.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="teacher-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(teacher._id)}
                  >
                    <Check size={18} />
                    Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(teacher._id)}
                  >
                    <X size={18} />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeView === 'approved' && (
        <div className="teachers-list">
          {approvedTeachers.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>No approved teachers yet</p>
            </div>
          ) : (
            approvedTeachers.map(teacher => (
              <div key={teacher._id} className="teacher-card approved">
                <div className="teacher-info">
                  <div className="teacher-header">
                    <User size={24} />
                    <div>
                      <h3>{teacher.name}</h3>
                      <span className={`status-badge ${teacher.isActive ? 'active' : 'inactive'}`}>
                        {teacher.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="teacher-details">
                    <div className="detail-item">
                      <Mail size={16} />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="detail-item">
                      <Building size={16} />
                      <span>{teacher.department}</span>
                    </div>
                    <div className="detail-item">
                      <User size={16} />
                      <span>Employee ID: {teacher.employeeId}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>Approved: {new Date(teacher.approvedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="teacher-actions">
                  {teacher.isActive ? (
                    <button
                      className="btn-deactivate"
                      onClick={() => handleDeactivate(teacher._id)}
                    >
                      <X size={18} />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="btn-approve"
                      onClick={() => handleActivate(teacher._id)}
                    >
                      <Check size={18} />
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherApproval;
