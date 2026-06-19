import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Mail, Send, Users } from 'lucide-react';
import API_URL from '../config/api';
import './DirectMessaging.css';

const DirectMessaging = ({ socket }) => {
  const { user } = useContext(AuthContext);
  const [activeUserType, setActiveUserType] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  const [newDirectMessage, setNewDirectMessage] = useState('');
  const [availableUsers, setAvailableUsers] = useState({
    students: [],
    teachers: [],
    admins: []
  });

  // Determine available tabs based on user role
  const getUserTabs = () => {
    if (user.role === 'admin') {
      return [
        { key: 'teachers', label: 'Teachers', icon: Users },
        { key: 'students', label: 'Students', icon: Users }
      ];
    } else if (user.role === 'teacher') {
      return [
        { key: 'students', label: 'Students', icon: Users },
        { key: 'admins', label: 'Admins', icon: Users }
      ];
    } else {
      return [
        { key: 'admins', label: 'Admins', icon: Users },
        { key: 'teachers', label: 'Teachers', icon: Users }
      ];
    }
  };

  const tabs = getUserTabs();

  useEffect(() => {
    if (tabs.length > 0 && !activeUserType) {
      setActiveUserType(tabs[0].key);
    }
  }, []);

  useEffect(() => {
    if (activeUserType) {
      fetchAvailableUsers(activeUserType);
    }
  }, [activeUserType]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-direct-message', (message) => {
        if (selectedUser && (message.sender._id === selectedUser._id || message.receiver._id === selectedUser._id)) {
          setDirectMessages(prev => [...prev, message]);
        }
        fetchConversations();
      });
    }

    return () => {
      if (socket) {
        socket.off('new-direct-message');
      }
    };
  }, [socket, selectedUser]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/direct-messages/conversations`);
      setConversations(res.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchAvailableUsers = async (type) => {
    try {
      const res = await axios.get(`${API_URL}/api/direct-messages/users/list?type=${type}`);
      setAvailableUsers(prev => ({ ...prev, [type]: res.data }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDirectMessages = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/direct-messages/${userId}`);
      setDirectMessages(res.data);
    } catch (error) {
      console.error('Error fetching direct messages:', error);
    }
  };

  const sendDirectMessage = () => {
    if (newDirectMessage.trim() && socket && selectedUser) {
      socket.emit('send-direct-message', {
        receiver: selectedUser._id,
        content: newDirectMessage
      });
      setNewDirectMessage('');
    }
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    await fetchDirectMessages(user._id);
  };

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Administrator';
    if (role === 'teacher') return 'Teacher';
    return 'Student';
  };

  const getUserDisplayInfo = (u) => {
    if (u.role === 'student') {
      // Show department and semester for students
      return u.semester 
        ? `${u.department} - Sem ${u.semester}`
        : u.department;
    }
    return getRoleLabel(u.role);
  };

  const currentUsers = availableUsers[activeUserType] || [];

  return (
    <div className="direct-messaging">
      <div className="dm-container">
        <div className="dm-sidebar">
          <div className="dm-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`dm-tab ${activeUserType === tab.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveUserType(tab.key);
                  setSelectedUser(null);
                }}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="dm-list">
            {currentUsers.length === 0 ? (
              <div className="dm-empty-list">
                <p>No {activeUserType} available</p>
              </div>
            ) : (
              currentUsers.map(u => {
                const conversation = conversations.find(c => c.user._id === u._id);
                return (
                  <div
                    key={u._id}
                    className={`dm-item ${selectedUser?._id === u._id ? 'active' : ''}`}
                    onClick={() => selectUser(u)}
                  >
                    <div className="dm-avatar">{u.name.charAt(0)}</div>
                    <div className="dm-info">
                      <div className="dm-name">{u.name}</div>
                      <div className="dm-role">
                        {getUserDisplayInfo(u)}
                      </div>
                    </div>
                    {conversation && conversation.unreadCount > 0 && (
                      <span className="unread-badge">{conversation.unreadCount}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="dm-chat">
          {selectedUser ? (
            <>
              <div className="dm-header">
                <div className="dm-avatar">{selectedUser.name.charAt(0)}</div>
                <div>
                  <div className="dm-header-name">{selectedUser.name}</div>
                  <div className="dm-header-role">
                    {getUserDisplayInfo(selectedUser)}
                  </div>
                </div>
              </div>
              <div className="dm-messages">
                {directMessages.map((msg, idx) => {
                  const senderId = String(msg.sender?._id || msg.sender?.id || msg.sender);
                  const currentUserId = String(user?._id || user?.id);
                  const isSent = senderId === currentUserId;

                  return (
                    <div
                      key={idx}
                      className={`dm-message ${isSent ? 'sent' : 'received'}`}
                    >
                      <div className="dm-message-content">
                        <p>{msg.content}</p>
                        <span className="dm-message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="dm-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newDirectMessage}
                  onChange={(e) => setNewDirectMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendDirectMessage()}
                />
                <button onClick={sendDirectMessage} aria-label="Send message">
                  <Send size={28} strokeWidth={3} />
                </button>
              </div>
            </>
          ) : (
            <div className="dm-empty">
              <Mail size={48} />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectMessaging;
