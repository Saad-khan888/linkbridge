# Frontend Structure Documentation

## Overview

The frontend is built with React.js using Vite as the build tool. It follows a component-based architecture with a clear separation of concerns.

## Directory Structure

```
client/
├── public/                 # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/                   # Source code
│   ├── assets/           # Images and media
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/       # Reusable components
│   │   ├── AdminRoute.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   ├── pages/            # Page components
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminProfile.jsx
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   ├── Landing.css
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.css
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── StudentDashboard.jsx
│   ├── App.css           # Global app styles
│   ├── App.jsx           # Main app component
│   ├── index.css         # Global CSS variables
│   └── main.jsx          # Entry point
├── .gitignore
├── eslint.config.js
├── index.html            # HTML template
├── package.json
├── README.md
└── vite.config.js        # Vite configuration
```

## Core Components

### 1. App.jsx

Main application component that sets up routing.

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin/profile" element={<PrivateRoute adminOnly><AdminProfile /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

**Key Features**:
- Wraps entire app with AuthProvider
- Sets up client-side routing
- Protects routes with PrivateRoute component

### 2. PrivateRoute Component

Route protection based on authentication and role.

```jsx
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  if (!adminOnly && user.role === 'admin') return <Navigate to="/admin/dashboard" />;

  return children;
};
```

**Features**:
- Checks authentication status
- Validates user role
- Redirects unauthorized users
- Shows loading state

## Context Providers

### 1. AuthContext

Manages authentication state and methods.

**State**:
- `user`: Current user object
- `loading`: Loading state
- `login()`: Login method
- `register()`: Registration method
- `logout()`: Logout method

**Usage**:
```jsx
const { user, login, logout } = useContext(AuthContext);
```

**Implementation**:
```jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, isAdmin = false) => {
    const res = await axios.post('/api/auth/login', { email, password, isAdmin });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data;
  };

  // ... other methods
};
```

### 2. SocketContext (Planned)

Will manage Socket.IO connection and events.

## Page Components

### 1. Landing Page

**File**: `src/pages/Landing.jsx`

**Features**:
- Hero section with call-to-action
- Feature highlights
- Navigation to login/register
- Responsive design
- Smooth animations

**Key Sections**:
- Navigation bar
- Hero section
- Features showcase
- Footer

### 2. Authentication Pages

#### Login Page
**File**: `src/pages/Login.jsx`

**Features**:
- Email and password inputs
- Form validation
- Error handling
- Link to registration
- Redirect after login

#### Register Page
**File**: `src/pages/Register.jsx`

**Features**:
- Multi-field registration form
- Department and semester selection
- Password validation
- Error handling
- Link to login

#### Admin Login Page
**File**: `src/pages/AdminLogin.jsx`

**Features**:
- Separate admin login
- Admin badge indicator
- Red theme for distinction
- Link to student login

### 3. Dashboard Pages

#### Student Dashboard
**File**: `src/pages/StudentDashboard.jsx`

**Structure**:
```jsx
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [socket, setSocket] = useState(null);

  // State for each content type
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  // ... more state

  return (
    <div className="dashboard">
      <aside className="sidebar">
        {/* Navigation */}
      </aside>
      <main className="main-content">
        {/* Content based on activeTab */}
      </main>
    </div>
  );
};
```

**Features**:
- Sidebar navigation
- Tab-based content switching
- Real-time chat integration
- Direct messaging
- File downloads
- Profile access

#### Admin Dashboard
**File**: `src/pages/AdminDashboard.jsx`

**Features**:
- Content creation modals
- CRUD operations
- Student management
- File upload
- Real-time chat
- Direct messaging

### 4. Profile Pages

#### Student Profile
**File**: `src/pages/Profile.jsx`

**Features**:
- View profile information
- Edit profile
- Upload profile picture
- Change password
- Delete account

#### Admin Profile
**File**: `src/pages/AdminProfile.jsx`

**Features**:
- Distinct red theme
- Simplified interface
- Admin badge
- Profile management

## Styling Architecture

### 1. Global Styles

**File**: `src/index.css`

**Contains**:
- CSS custom properties (variables)
- Typography settings
- Color palette
- Spacing system
- Animation keyframes
- Utility classes

**Key Variables**:
```css
:root {
  /* Colors */
  --primary-50: #e3f2fd;
  --primary-600: #1976d2;
  --primary-700: #1565c0;
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Poppins', sans-serif;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### 2. Component Styles

Each major component has its own CSS file:
- `Auth.css`: Authentication pages
- `Dashboard.css`: Dashboard components
- `Landing.css`: Landing page
- `Profile.css`: Profile pages

### 3. Design System

**Material Design 3 Principles**:
- Clean, modern interface
- Consistent spacing (8px grid)
- Rounded corners
- Soft shadows
- Smooth transitions
- Professional typography

**Color System**:
- Primary: Blue (#1976d2)
- Error: Red (#d32f2f)
- Warning: Orange (#f57c00)
- Success: Green (#388e3c)
- Neutral: Grays

**Typography**:
- Headings: Poppins (700 weight)
- Body: Inter (400-600 weight)
- Sizes: 0.875rem to 2rem

## State Management

### Local State
- Component-level state with `useState`
- Form inputs
- UI toggles
- Loading states

### Global State
- Authentication: AuthContext
- User information
- JWT token

### Server State
- Fetched with axios
- Cached in component state
- Refetched on tab change

## Data Fetching

### Pattern
```jsx
const fetchData = async () => {
  try {
    const res = await axios.get('/api/endpoint');
    setData(res.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

useEffect(() => {
  fetchData();
}, [dependency]);
```

### Axios Configuration
```jsx
// Set default base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Set auth token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## Real-time Features

### Socket.IO Integration

**Connection**:
```jsx
useEffect(() => {
  const token = localStorage.getItem('token');
  const newSocket = io('http://localhost:5000', { auth: { token } });
  setSocket(newSocket);

  newSocket.on('new-message', (message) => {
    setMessages(prev => [...prev, message]);
  });

  return () => newSocket.close();
}, []);
```

**Sending Messages**:
```jsx
const sendMessage = () => {
  if (socket && newMessage.trim()) {
    socket.emit('send-message', {
      content: newMessage,
      isGeneral: true
    });
    setNewMessage('');
  }
};
```

## Form Handling

### Pattern
```jsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('/api/endpoint', formData);
    // Handle success
  } catch (error) {
    // Handle error
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input
      value={formData.field1}
      onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
    />
  </form>
);
```

## File Upload

### Implementation
```jsx
const handleFileUpload = async (e) => {
  const files = Array.from(e.target.files);
  const formData = new FormData();
  
  for (const file of files) {
    formData.append('file', file);
    const res = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // Handle response
  }
};
```

## Performance Optimization

### Techniques Used
1. **Code Splitting**: React.lazy for route-based splitting
2. **Memoization**: React.memo for expensive components
3. **Debouncing**: For search and input handlers
4. **Lazy Loading**: Images and heavy components
5. **Optimized Re-renders**: Proper dependency arrays

### Future Optimizations
- Virtual scrolling for long lists
- Image lazy loading
- Service workers for caching
- Bundle size optimization

## Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet styles */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Desktop styles */
}
```

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly interface elements
- Responsive typography

## Accessibility

### Current Implementation
- Semantic HTML elements
- Proper form labels
- Keyboard navigation support
- Focus states
- Alt text for images

### Future Improvements
- ARIA labels
- Screen reader testing
- Keyboard shortcuts
- High contrast mode
- Focus trap in modals

## Build Configuration

### Vite Config
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Testing Strategy

### Recommended Testing
1. **Unit Tests**: Jest + React Testing Library
2. **Integration Tests**: Test user flows
3. **E2E Tests**: Cypress or Playwright
4. **Visual Tests**: Storybook

### Test Structure
```
src/
├── __tests__/
│   ├── components/
│   ├── pages/
│   └── utils/
```
