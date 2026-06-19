# System Architecture

## High-Level Architecture

Linkbridge follows a three-tier architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  (React.js SPA - Vite, React Router, Socket.IO Client) │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│    (Node.js + Express.js + Socket.IO Server)           │
│  - REST API Endpoints                                   │
│  - WebSocket Handlers                                   │
│  - Authentication Middleware                            │
│  - Business Logic                                       │
└─────────────────────────────────────────────────────────┘
                          ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                          │
│              (MongoDB Database)                         │
│  - User Collection                                      │
│  - Assignment Collection                                │
│  - Announcement Collection                              │
│  - Material Collection                                  │
│  - Event Collection                                     │
│  - Notice Collection                                    │
│  - Message Collection                                   │
│  - DirectMessage Collection                             │
└─────────────────────────────────────────────────────────┘
```

## Architecture Patterns

### 1. Client-Server Architecture
- **Client**: React SPA handling UI and user interactions
- **Server**: Node.js/Express API handling business logic and data operations
- **Communication**: RESTful APIs for CRUD operations, WebSocket for real-time features

### 2. MVC Pattern (Backend)
- **Models**: Mongoose schemas defining data structure
- **Controllers**: Route handlers implementing business logic
- **Views**: JSON responses (API-first approach)

### 3. Component-Based Architecture (Frontend)
- Reusable React components
- Context API for global state management
- Custom hooks for shared logic

## System Components

### Frontend Components

#### 1. Pages
- **Landing Page**: Public-facing homepage
- **Authentication Pages**: Login, Register, Admin Login
- **Student Dashboard**: Main interface for students
- **Admin Dashboard**: Management interface for administrators
- **Profile Pages**: User profile management

#### 2. Contexts
- **AuthContext**: User authentication state and methods
- **SocketContext**: WebSocket connection management

#### 3. Components
- **PrivateRoute**: Route protection based on authentication
- **AdminRoute**: Route protection for admin-only pages

### Backend Components

#### 1. Server Core
```
server/
├── server.js           # Entry point, Express setup, Socket.IO
├── config/            # Configuration files
│   └── cloudinary.js  # Cloudinary setup
├── middleware/        # Express middleware
│   └── auth.js        # Authentication & authorization
├── models/            # Mongoose schemas
│   ├── User.js
│   ├── Assignment.js
│   ├── Announcement.js
│   ├── Material.js
│   ├── Event.js
│   ├── Notice.js
│   ├── Message.js
│   └── DirectMessage.js
└── routes/            # API endpoints
    ├── auth.js
    ├── assignments.js
    ├── announcements.js
    ├── materials.js
    ├── events.js
    ├── notices.js
    ├── messages.js
    ├── directMessages.js
    ├── upload.js
    ├── profile.js
    └── users.js
```

## Data Flow

### 1. Authentication Flow
```
User → Login Form → POST /api/auth/login → Verify Credentials
                                          ↓
                                    Generate JWT
                                          ↓
                              Store in localStorage
                                          ↓
                              Include in API Headers
                                          ↓
                              Middleware Validates
                                          ↓
                              Access Protected Routes
```

### 2. Content Creation Flow (Admin)
```
Admin → Create Form → POST /api/{resource} → Validate Data
                                            ↓
                                      Check Authorization
                                            ↓
                                      Upload Files (if any)
                                            ↓
                                      Save to MongoDB
                                            ↓
                                      Return Success
                                            ↓
                                      Update UI
```

### 3. Real-time Messaging Flow
```
User A → Type Message → Emit 'send-message' → Server Receives
                                              ↓
                                        Authenticate Socket
                                              ↓
                                        Save to Database
                                              ↓
                                        Broadcast to Room
                                              ↓
User B ← Receive Message ← Emit 'new-message' ← All Connected Users
```

### 4. File Upload Flow
```
User → Select File → POST /api/upload → Multer Middleware
                                       ↓
                                  Validate File
                                       ↓
                                  Upload to Cloudinary
                                       ↓
                                  Return URL & Metadata
                                       ↓
                                  Store in Content Document
```

## Communication Protocols

### REST API
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Authentication**: Bearer Token (JWT)
- **Methods**: GET, POST, PUT, DELETE

### WebSocket (Socket.IO)
- **Protocol**: WebSocket with fallback to HTTP long-polling
- **Events**:
  - `connection`: Client connects
  - `send-message`: Send general chat message
  - `new-message`: Receive general chat message
  - `send-direct-message`: Send direct message
  - `new-direct-message`: Receive direct message
  - `disconnect`: Client disconnects

## Security Architecture

### 1. Authentication Layer
- JWT tokens with 7-day expiration
- Secure password hashing with bcrypt
- Token validation on every protected route

### 2. Authorization Layer
- Role-based access control (Student, Admin)
- Middleware checks for admin-only routes
- Resource ownership verification

### 3. Data Protection
- Environment variables for sensitive data
- CORS configuration
- Input validation and sanitization
- MongoDB injection prevention

### 4. File Upload Security
- File type validation
- File size limits (5MB)
- Secure cloud storage with Cloudinary

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT tokens (no server-side sessions)
- MongoDB sharding support
- Load balancer ready

### Vertical Scaling
- Efficient database queries
- Indexed collections
- Pagination for large datasets
- Lazy loading on frontend

### Caching Strategy
- Browser caching for static assets
- CDN for uploaded files (Cloudinary)
- Future: Redis for session management

## Performance Optimization

### Frontend
- Code splitting with React.lazy
- Vite for fast builds and HMR
- Optimized re-renders with React.memo
- Debounced search and input handlers

### Backend
- Connection pooling for MongoDB
- Efficient Mongoose queries with select()
- Indexed database fields
- Compressed responses

### Network
- Minified and bundled assets
- CDN delivery for files
- WebSocket for reduced HTTP overhead
- Gzip compression

## Monitoring & Logging

### Current Implementation
- Console logging for development
- Error handling with try-catch blocks
- Socket.IO connection logging

### Future Enhancements
- Winston for structured logging
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Analytics dashboard

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                    ↓
┌───────────────┐                    ┌───────────────┐
│  Web Server 1 │                    │  Web Server 2 │
│  (Node.js)    │                    │  (Node.js)    │
└───────────────┘                    └───────────────┘
        ↓                                    ↓
        └─────────────────┬─────────────────┘
                          ↓
                  ┌───────────────┐
                  │   MongoDB     │
                  │   Cluster     │
                  └───────────────┘
```

## Technology Stack Details

### Frontend Stack
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router 6**: Client-side routing
- **Axios**: HTTP client
- **Socket.IO Client**: WebSocket client
- **Lucide React**: Icon library

### Backend Stack
- **Node.js 18+**: Runtime environment
- **Express.js 4**: Web framework
- **Socket.IO 4**: Real-time engine
- **Mongoose 7**: MongoDB ODM
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Cloudinary**: Cloud storage

### Database
- **MongoDB 6+**: NoSQL database
- **Mongoose**: Object modeling

### DevOps
- **Git**: Version control
- **npm**: Package management
- **dotenv**: Environment configuration
