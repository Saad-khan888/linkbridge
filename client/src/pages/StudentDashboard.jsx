import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { FileText, Bell, BookOpen, Calendar, MessageCircle, User, LogOut, Download, ExternalLink, Mail, AlertCircle, Clock, MapPin } from 'lucide-react';
import DeactivatedNotice from '../components/DeactivatedNotice';
import DirectMessaging from '../components/DirectMessaging';
import { getDownloadUrl, getFileTypeLabel } from '../utils/fileUtils';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is deactivated
  if (user && !user.isActive) {
    return <DeactivatedNotice />;
  }
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', { auth: { token } });
    setSocket(newSocket);

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);



  const fetchData = async () => {
    try {
      if (activeTab === 'assignments') {
        const res = await axios.get('http://localhost:5000/api/assignments');
        setAssignments(res.data);
      } else if (activeTab === 'announcements') {
        const res = await axios.get('http://localhost:5000/api/announcements');
        setAnnouncements(res.data);
      } else if (activeTab === 'materials') {
        const res = await axios.get('http://localhost:5000/api/materials');
        setMaterials(res.data);
      } else if (activeTab === 'events') {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } else if (activeTab === 'notices') {
        const res = await axios.get('http://localhost:5000/api/notices');
        setNotices(res.data);
      } else if (activeTab === 'chat') {
        const res = await axios.get('http://localhost:5000/api/messages');
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Linkbridge</h2>
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0)}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.department}</div>
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
          <button onClick={() => navigate('/profile')}>
            <User className="nav-icon" size={20} /> Profile
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="main-content">
        {activeTab === 'assignments' && (
          <div className="content-section">
            <h1>Assignments</h1>
            <div className="cards-grid">
              {assignments.length === 0 ? (
                <p className="empty-state">No assignments yet</p>
              ) : (
                assignments.map(assignment => (
                  <div key={assignment._id} className="card">
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <div className="card-meta">
                      <span><Clock size={14} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span><BookOpen size={14} /> {assignment.subject}</span>
                    </div>
                    {assignment.attachments && assignment.attachments.length > 0 && (
                      <div className="card-files">
                        <div className="files-header">
                          <FileText size={16} />
                          <span>Assignment Files ({assignment.attachments.length})</span>
                        </div>
                        <div className="files-list">
                          {assignment.attachments.map((file, idx) => {
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
                                <ExternalLink size={12} className="external-icon" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="content-section">
            <h1>Announcements</h1>
            <div className="cards-grid">
              {announcements.length === 0 ? (
                <p className="empty-state">No announcements yet</p>
              ) : (
                announcements.map(announcement => (
                  <div key={announcement._id} className={`card ${announcement.isPinned ? 'pinned' : ''}`}>
                    {announcement.isPinned && <span className="pin-badge">Pinned</span>}
                    <h3>{announcement.title}</h3>
                    <p>{announcement.content}</p>
                    <div className="card-meta">
                      <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      <span className={`badge badge-${announcement.type}`}>{announcement.type}</span>
                    </div>
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="card-files">
                        <div className="files-header">
                          <FileText size={16} />
                          <span>Attachments ({announcement.attachments.length})</span>
                        </div>
                        <div className="files-list">
                          {announcement.attachments.map((file, idx) => {
                            const fileName = file.filename || `File ${idx + 1}`;
                            const downloadUrl = getDownloadUrl(file.url, fileName);
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
                                <ExternalLink size={12} className="external-icon" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="content-section">
            <h1>Study Materials</h1>
            <div className="cards-grid">
              {materials.length === 0 ? (
                <p className="empty-state">No materials yet</p>
              ) : (
                materials.map(material => (
                  <div key={material._id} className="card">
                    <h3>{material.title}</h3>
                    <p>{material.description}</p>
                    <div className="card-meta">
                      <span>{material.subject}</span>
                      <span className="badge">{material.category}</span>
                    </div>
                    {material.files && material.files.length > 0 && (
                      <div className="card-files">
                        <div className="files-header">
                          <BookOpen size={16} />
                          <span>Study Materials ({material.files.length})</span>
                        </div>
                        <div className="files-list">
                          {material.files.map((file, idx) => {
                            const fileName = file.filename || `File ${idx + 1}`;
                            const downloadUrl = getDownloadUrl(file.url, fileName);
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
                                <ExternalLink size={12} className="external-icon" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="content-section">
            <h1>Events</h1>
            <div className="cards-grid">
              {events.length === 0 ? (
                <p className="empty-state">No events scheduled</p>
              ) : (
                events.map(event => (
                  <div key={event._id} className="card">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="card-meta">
                      <span><Calendar size={14} /> {new Date(event.eventDate).toLocaleDateString()}</span>
                      <span><MapPin size={14} /> {event.location}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="content-section">
            <h1>Notices</h1>
            <div className="cards-grid">
              {notices.length === 0 ? (
                <p className="empty-state">No notices yet</p>
              ) : (
                notices.map(notice => (
                  <div key={notice._id} className="card">
                    <h3>{notice.title}</h3>
                    <p>{notice.content}</p>
                    <div className="card-meta">
                      <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                      <span className="badge">{notice.category}</span>
                      {notice.validUntil && (
                        <span>Valid until: {new Date(notice.validUntil).toLocaleDateString()}</span>
                      )}
                    </div>
                    {notice.attachments && notice.attachments.length > 0 && (
                      <div className="card-files">
                        <div className="files-header">
                          <FileText size={16} />
                          <span>Attachments ({notice.attachments.length})</span>
                        </div>
                        <div className="files-list">
                          {notice.attachments.map((file, idx) => {
                            const fileName = file.filename || `File ${idx + 1}`;
                            const downloadUrl = getDownloadUrl(file.url, fileName);
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
                                <ExternalLink size={12} className="external-icon" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-section">
            <h1>General Chat</h1>
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
        )}

        {activeTab === 'messages' && (
          <div className="content-section">
            <h1>Direct Messages</h1>
            <DirectMessaging socket={socket} />
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
