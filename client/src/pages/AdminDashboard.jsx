import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { FileText, Bell, BookOpen, Calendar, Users, User, LogOut, Plus, Trash2, Paperclip, X, Download, Mail, MessageCircle, AlertCircle, UserCheck, Clock, MapPin, Building2 } from 'lucide-react';
import TeacherApproval from '../components/TeacherApproval';
import DirectMessaging from '../components/DirectMessaging';
import { getDownloadUrl, getFileTypeLabel } from '../utils/fileUtils';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('assignments');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [socket, setSocket] = useState(null);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    subject: '',
    department: '',
    semester: '',
    dueDate: '',
    eventDate: '',
    location: '',
    type: 'general',
    category: 'notes',
    isPinned: false,
    attachments: [],
    validUntil: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', { auth: { token } });
    setSocket(newSocket);

    newSocket.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);



  const fetchData = async () => {
    try {
      if (activeTab === 'students') {
        const res = await axios.get('http://localhost:5000/api/auth/users');
        setStudents(res.data);
      } else if (activeTab === 'chat') {
        const res = await axios.get('http://localhost:5000/api/messages');
        setMessages(res.data);
      } else if (activeTab === 'notices') {
        const res = await axios.get('http://localhost:5000/api/notices');
        setItems(res.data);
      } else if (activeTab !== 'teachers' && activeTab !== 'messages') {
        const res = await axios.get(`http://localhost:5000/api/${activeTab}`);
        setItems(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedFiles = [];

    try {
      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const res = await axios.post('http://localhost:5000/api/upload', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedFiles.push(res.data);
      }

      setFormData({
        ...formData,
        attachments: [...(formData.attachments || []), ...uploadedFiles]
      });
      setMessage({ type: 'success', text: 'Files uploaded successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload files' });
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const endpoint = activeTab === 'announcements' ? 'announcements' : activeTab;
      const dataToSend = { ...formData };
      
      if (activeTab === 'materials') {
        dataToSend.files = formData.attachments;
      }

      await axios.post(`http://localhost:5000/api/${endpoint}`, dataToSend);
      setMessage({ type: 'success', text: 'Created successfully!' });
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create' });
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('send-message', {
        content: newMessage,
        isGeneral: true
      });
      setNewMessage('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/${activeTab}/${id}`);
      setMessage({ type: 'success', text: 'Deleted successfully!' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${userId}/toggle-status`, {
        isActive: !currentStatus
      });
      setMessage({ type: 'success', text: 'User status updated!' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user status' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      subject: '',
      department: '',
      semester: '',
      dueDate: '',
      eventDate: '',
      location: '',
      type: 'general',
      category: 'notes',
      isPinned: false,
      attachments: [],
      validUntil: ''
    });
    setEditingItem(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const removeAttachment = (index) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
  };

  return (
    <div className="dashboard">
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header">
          <h2>Linkbridge</h2>
          <div className="user-info">
            <div className="user-avatar admin-avatar">{user?.name?.charAt(0)}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={activeTab === 'assignments' ? 'active' : ''} onClick={() => setActiveTab('assignments')}>
            <FileText className="nav-icon" size={20} /> Assignments
          </button>
          <button className={activeTab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')}>
            <Bell className="nav-icon" size={20} /> Announcements
          </button>
          <button className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}>
            <BookOpen className="nav-icon" size={20} /> Materials
          </button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>
            <Calendar className="nav-icon" size={20} /> Events
          </button>
          <button className={activeTab === 'notices' ? 'active' : ''} onClick={() => setActiveTab('notices')}>
            <AlertCircle className="nav-icon" size={20} /> Notices
          </button>
          <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            <Mail className="nav-icon" size={20} /> Messages
          </button>
          <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>
            <MessageCircle className="nav-icon" size={20} /> General Chat
          </button>
          <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
            <Users className="nav-icon" size={20} /> Students
          </button>
          <button className={activeTab === 'teachers' ? 'active' : ''} onClick={() => setActiveTab('teachers')}>
            <UserCheck className="nav-icon" size={20} /> Teachers
          </button>
          <button onClick={() => navigate('/admin/profile')}>
            <User className="nav-icon" size={20} /> Profile
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="main-content">
        {message.text && (
          <div className={`message ${message.type}`} style={{ marginBottom: '1rem' }}>
            {message.text}
          </div>
        )}

        <div className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          {activeTab !== 'students' && activeTab !== 'teachers' && activeTab !== 'chat' && activeTab !== 'messages' && (
            <button className="btn-create" onClick={openCreateModal}>
              <Plus size={18} /> Create New
            </button>
          )}
        </div>

        {activeTab === 'students' ? (
          <div className="students-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Enrollment</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.filter(s => s.role === 'student').map(student => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.enrollmentNumber}</td>
                    <td>{student.department}</td>
                    <td>{student.semester}</td>
                    <td>
                      <span className={`status-badge ${student.isActive ? 'active' : 'inactive'}`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-small"
                        onClick={() => handleToggleUserStatus(student._id, student.isActive)}
                      >
                        {student.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'teachers' ? (
          <TeacherApproval />
        ) : activeTab === 'chat' ? (
          <div className="chat-section">
            <div className="chat-container">
              <div className="messages-list">
                {messages.map((msg, idx) => (
                  <div key={idx} className="message">
                    <div className="message-avatar">{msg.sender?.name?.charAt(0)}</div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">{msg.sender?.name}</span>
                        {msg.sender?.role === 'admin' && (
                          <span className="admin-badge">Admin</span>
                        )}
                        <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        ) : activeTab === 'messages' ? (
          <div className="messages-section">
            <DirectMessaging socket={socket} />
          </div>
        ) : (
          <div className="cards-grid">
            {items.length === 0 ? (
              <p className="empty-state">No {activeTab} yet. Create one to get started!</p>
            ) : (
              items.map(item => (
                <div key={item._id} className={`card ${item.isPinned ? 'pinned' : ''}`}>
                  {item.isPinned && <span className="pin-badge">Pinned</span>}
                  <h3>{item.title}</h3>
                  <p>{item.description || item.content}</p>
                  <div className="card-meta">
                    {item.subject && <span><BookOpen size={14} /> {item.subject}</span>}
                    {item.department && <span><Building2 size={14} /> {item.department}</span>}
                    {item.dueDate && <span><Clock size={14} /> Due: {new Date(item.dueDate).toLocaleDateString()}</span>}
                    {item.eventDate && <span><Calendar size={14} /> {new Date(item.eventDate).toLocaleDateString()}</span>}
                    {item.location && <span><MapPin size={14} /> {item.location}</span>}
                    {item.type && <span className={`badge badge-${item.type}`}>{item.type}</span>}
                  </div>
                  {((item.attachments && item.attachments.length > 0) || (item.files && item.files.length > 0)) && (
                    <div className="card-files">
                      <div className="files-header">
                        <Paperclip size={16} />
                        <span>Attachments ({(item.attachments || item.files)?.length})</span>
                      </div>
                      <div className="files-list">
                        {(item.attachments || item.files)?.map((file, idx) => {
                          const fileUrl = file.url || file;
                          const fileName = file.filename || file.name || `File ${idx + 1}`;
                          const downloadUrl = getDownloadUrl(fileUrl, fileName);
                          const fileType = getFileTypeLabel(fileName);
                          
                          return (
                            <a 
                              key={idx} 
                              href={downloadUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="file-link"
                            >
                              <Download size={14} />
                              <span>{fileName}</span>
                              <span className="file-badge">{fileType}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="card-actions">
                    <button className="btn-delete-small" onClick={() => handleDelete(item._id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Create {activeTab.slice(0, -1)}</h2>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{activeTab === 'announcements' || activeTab === 'notices' ? 'Content' : 'Description'}</label>
                  <textarea
                    value={activeTab === 'announcements' || activeTab === 'notices' ? formData.content : formData.description}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      [activeTab === 'announcements' || activeTab === 'notices' ? 'content' : 'description']: e.target.value 
                    })}
                    required
                  />
                </div>

                {(activeTab === 'assignments' || activeTab === 'materials') && (
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="">All Departments</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Political Science">Political Science</option>
                      <option value="BBA">BBA</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    >
                      <option value="">All Semesters</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {activeTab === 'assignments' && (
                  <div className="form-group">
                    <label>Due Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => {
                        console.log('Due date changed:', e.target.value);
                        setFormData({ ...formData, dueDate: e.target.value });
                      }}
                    />
                  </div>
                )}

                {activeTab === 'events' && (
                  <>
                    <div className="form-group">
                      <label>Event Date & Time</label>
                      <input
                        type="datetime-local"
                        value={formData.eventDate}
                        onChange={(e) => {
                          console.log('Event date changed:', e.target.value);
                          setFormData({ ...formData, eventDate: e.target.value });
                        }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Main Auditorium, Room 101"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'announcements' && (
                  <>
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="general">General</option>
                        <option value="urgent">Urgent</option>
                        <option value="event">Event</option>
                        <option value="notice">Notice</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.isPinned}
                          onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                        />
                        {' '}Pin this announcement
                      </label>
                    </div>
                  </>
                )}

                {activeTab === 'materials' && (
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="notes">Notes</option>
                      <option value="slides">Slides</option>
                      <option value="reference">Reference</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}

                {activeTab === 'notices' && (
                  <>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="general">General</option>
                        <option value="academic">Academic</option>
                        <option value="exam">Exam</option>
                        <option value="holiday">Holiday</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Valid Until</label>
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Attachments</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="btn-upload-files"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Paperclip size={16} /> {uploading ? 'Uploading...' : 'Upload Files'}
                  </button>
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="uploaded-files">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="file-item">
                          <span>{file.filename}</span>
                          <button type="button" onClick={() => removeAttachment(index)}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
