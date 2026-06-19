# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error information"
}
```

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "enrollmentNumber": "CS2024001",
  "department": "Computer Science",
  "semester": 3
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "isAdmin": false
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "department": "Computer Science",
    "semester": 3
  }
}
```

#### Get Current User
```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "department": "Computer Science",
    "semester": 3,
    "avatar": "https://cloudinary.com/...",
    "enrollmentNumber": "CS2024001"
  }
}
```

### Assignments

#### Get All Assignments
```http
GET /assignments
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `department` (optional): Filter by department
- `semester` (optional): Filter by semester

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Data Structures Assignment 1",
    "description": "Implement binary search tree",
    "subject": "Data Structures",
    "department": "Computer Science",
    "semester": 3,
    "dueDate": "2024-12-31T23:59:59.000Z",
    "attachments": [
      {
        "url": "https://cloudinary.com/...",
        "publicId": "assignments/file123",
        "filename": "assignment.pdf"
      }
    ],
    "createdBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Prof. Smith"
    },
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Create Assignment (Admin Only)
```http
POST /assignments
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Data Structures Assignment 1",
  "description": "Implement binary search tree",
  "subject": "Data Structures",
  "department": "Computer Science",
  "semester": 3,
  "dueDate": "2024-12-31T23:59:59.000Z",
  "attachments": [
    {
      "url": "https://cloudinary.com/...",
      "publicId": "assignments/file123",
      "filename": "assignment.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Data Structures Assignment 1",
  ...
}
```

#### Delete Assignment (Admin Only)
```http
DELETE /assignments/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Deleted successfully"
}
```

### Announcements

#### Get All Announcements
```http
GET /announcements
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Holiday Notice",
    "content": "University will be closed on...",
    "type": "general",
    "isPinned": true,
    "department": "Computer Science",
    "attachments": [],
    "createdBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin"
    },
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Create Announcement (Admin Only)
```http
POST /announcements
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Holiday Notice",
  "content": "University will be closed on...",
  "type": "general",
  "isPinned": false,
  "department": "",
  "semester": "",
  "attachments": []
}
```

#### Delete Announcement (Admin Only)
```http
DELETE /announcements/:id
```

### Materials

#### Get All Materials
```http
GET /materials
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Lecture Notes - Week 1",
    "description": "Introduction to algorithms",
    "subject": "Algorithms",
    "category": "notes",
    "department": "Computer Science",
    "files": [
      {
        "url": "https://cloudinary.com/...",
        "publicId": "materials/file123",
        "filename": "notes.pdf"
      }
    ],
    "createdBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Prof. Smith"
    },
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Create Material (Admin Only)
```http
POST /materials
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Lecture Notes - Week 1",
  "description": "Introduction to algorithms",
  "subject": "Algorithms",
  "category": "notes",
  "department": "Computer Science",
  "semester": 3,
  "files": [
    {
      "url": "https://cloudinary.com/...",
      "publicId": "materials/file123",
      "filename": "notes.pdf"
    }
  ]
}
```

#### Delete Material (Admin Only)
```http
DELETE /materials/:id
```

### Events

#### Get All Events
```http
GET /events
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Tech Fest 2024",
    "description": "Annual technology festival",
    "eventDate": "2024-12-15T09:00:00.000Z",
    "location": "Main Auditorium",
    "organizer": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin"
    },
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Create Event (Admin Only)
```http
POST /events
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Tech Fest 2024",
  "description": "Annual technology festival",
  "eventDate": "2024-12-15T09:00:00.000Z",
  "location": "Main Auditorium",
  "department": "",
  "semester": ""
}
```

#### Delete Event (Admin Only)
```http
DELETE /events/:id
```

### Notices

#### Get All Notices
```http
GET /notices
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Exam Schedule",
    "content": "Final exams will be held from...",
    "category": "exam",
    "department": "Computer Science",
    "semester": 3,
    "validUntil": "2024-12-31T23:59:59.000Z",
    "attachments": [],
    "isActive": true,
    "createdBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin"
    },
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Create Notice (Admin Only)
```http
POST /notices
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Exam Schedule",
  "content": "Final exams will be held from...",
  "category": "exam",
  "department": "Computer Science",
  "semester": 3,
  "validUntil": "2024-12-31T23:59:59.000Z",
  "attachments": []
}
```

#### Delete Notice (Admin Only)
```http
DELETE /notices/:id
```

### Messages (General Chat)

#### Get All Messages
```http
GET /messages
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "sender": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "avatar": "https://cloudinary.com/...",
      "role": "student"
    },
    "content": "Hello everyone!",
    "isGeneral": true,
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

### Direct Messages

#### Get Conversations
```http
GET /direct-messages/conversations
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Prof. Smith",
      "avatar": "https://cloudinary.com/...",
      "role": "admin"
    },
    "lastMessage": {
      "_id": "507f1f77bcf86cd799439013",
      "content": "Your assignment was great!",
      "createdAt": "2024-12-01T10:00:00.000Z"
    },
    "unreadCount": 2
  }
]
```

#### Get Messages with User
```http
GET /direct-messages/:userId
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "sender": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "avatar": "https://cloudinary.com/...",
      "role": "student"
    },
    "receiver": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Prof. Smith",
      "avatar": "https://cloudinary.com/...",
      "role": "admin"
    },
    "content": "Can you help me with the assignment?",
    "isRead": true,
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Send Direct Message
```http
POST /direct-messages
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "receiver": "507f1f77bcf86cd799439013",
  "content": "Can you help me with the assignment?",
  "attachments": []
}
```

#### Get Available Users for Messaging
```http
GET /direct-messages/users/list
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Prof. Smith",
    "email": "smith@university.com",
    "avatar": "https://cloudinary.com/...",
    "role": "admin",
    "department": "Computer Science"
  }
]
```

### File Upload

#### Upload File
```http
POST /upload
```

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
```
file: <binary file data>
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "uploads/abc123",
  "filename": "document.pdf"
}
```

### Profile

#### Get Profile
```http
GET /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "enrollmentNumber": "CS2024001",
  "department": "Computer Science",
  "semester": 3,
  "avatar": "https://cloudinary.com/...",
  "role": "student"
}
```

#### Update Profile
```http
PUT /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "enrollmentNumber": "CS2024001",
  "department": "Computer Science",
  "semester": 4,
  "avatar": "https://cloudinary.com/..."
}
```

#### Delete Account
```http
DELETE /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

### User Management (Admin Only)

#### Get All Users
```http
GET /auth/users
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "enrollmentNumber": "CS2024001",
    "department": "Computer Science",
    "semester": 3,
    "role": "student",
    "isActive": true,
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Toggle User Status
```http
PUT /auth/users/:userId/toggle-status
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "isActive": false
}
```

**Response:**
```json
{
  "message": "User status updated"
}
```

## WebSocket Events

### Connection
```javascript
socket.on('connection', (socket) => {
  console.log('User connected:', socket.id);
});
```

### Send General Message
```javascript
socket.emit('send-message', {
  content: 'Hello everyone!',
  isGeneral: true
});
```

### Receive General Message
```javascript
socket.on('new-message', (message) => {
  console.log('New message:', message);
});
```

### Send Direct Message
```javascript
socket.emit('send-direct-message', {
  receiver: '507f1f77bcf86cd799439013',
  content: 'Private message'
});
```

### Receive Direct Message
```javascript
socket.on('new-direct-message', (message) => {
  console.log('New direct message:', message);
});
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production.

## API Versioning

Current version: v1 (implicit)

Future versions will use URL versioning: `/api/v2/...`
