# Database Schema Documentation

## Database Overview

Linkbridge uses MongoDB as its database system with Mongoose as the ODM (Object Document Mapper). The database is named `linkbridge` and contains 8 main collections.

## Collections

### 1. Users Collection

Stores all user information including students and administrators.

**Collection Name**: `users`

**Schema**:
```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  enrollmentNumber: {
    type: String,
    sparse: true
  },
  department: {
    type: String
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes**:
- `email`: Unique index
- `enrollmentNumber`: Sparse index
- `role`: Index for filtering
- `isActive`: Index for filtering

**Example Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$...",
  "role": "student",
  "enrollmentNumber": "CS2024001",
  "department": "Computer Science",
  "semester": 3,
  "avatar": "https://res.cloudinary.com/...",
  "isActive": true,
  "createdAt": ISODate("2024-12-01T10:00:00.000Z"),
  "updatedAt": ISODate("2024-12-01T10:00:00.000Z")
}
```

### 2. Assignments Collection

Stores assignment information created by administrators.

**Collection Name**: `assignments`

**Schema**:
```javascript
{
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  department: {
    type: String
  },
  semester: {
    type: Number
  },
  dueDate: {
    type: Date
  },
  attachments: [{
    url: String,
    publicId: String,
    filename: String
  }],
  submissions: [{
    student: {
      type: ObjectId,
      ref: 'User'
    },
    files: [{
      url: String,
      publicId: String,
      filename: String
    }],
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes**:
- `department`: Index for filtering
- `semester`: Index for filtering
- `dueDate`: Index for sorting
- `createdBy`: Index for queries

**Example Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "title": "Data Structures Assignment 1",
  "description": "Implement binary search tree",
  "subject": "Data Structures",
  "department": "Computer Science",
  "semester": 3,
  "dueDate": ISODate("2024-12-31T23:59:59.000Z"),
  "attachments": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "assignments/file123",
      "filename": "assignment.pdf"
    }
  ],
  "submissions": [],
  "createdBy": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-12-01T10:00:00.000Z")
}
```

### 3. Announcements Collection

Stores announcements and notices posted by administrators.

**Collection Name**: `announcements`

**Schema**:
```javascript
{
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'urgent', 'event', 'notice'],
    default: 'general'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  department: {
    type: String
  },
  semester: {
    type: Number
  },
  attachments: [{
    url: String,
    publicId: String,
    filename: String
  }],
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes**:
- `type`: Index for filtering
- `isPinned`: Index for sorting
- `department`: Index for filtering
- `createdAt`: Index for sorting

**Example Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "title": "Holiday Notice",
  "content": "University will be closed on December 25th",
  "type": "general",
  "isPinned": true,
  "department": "",
  "semester": null,
  "attachments": [],
  "createdBy": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-12-01T10:00:00.000Z")
}
```

### 4. Materials Collection

Stores study materials uploaded by administrators.

**Collection Name**: `materials`

**Schema**:
```javascript
{
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  subject: {
    type: String
  },
  category: {
    type: String,
    enum: ['notes', 'slides', 'reference', 'other'],
    default: 'notes'
  },
  department: {
    type: String
  },
  semester: {
    type: Number
  },
  files: [{
    url: String,
    publicId: String,
    filename: String
  }],
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes**:
- `subject`: Index for filtering
- `category`: Index for filtering
- `department`: Index for filtering
- `semester`: Index for filtering

**Example Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "title": "Lecture Notes - Week 1",
  "description": "Introduction to algorithms",
  "subject": "Algorithms",
  "category": "notes",
  "department": "Computer Science",
  "semester": 3,
  "files": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "materials/file123",
      "filename": "notes.pdf"
    }
  ],
  "createdBy": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-12-01T10:00:00.000Z")
}
```

### 5. Events Collection

Stores event information.

**Collection Name**: `events`

**Schema**:
```javascript
{
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  eventDate: {
    type: Date,
    required: true
  },
  location: {
    type: String
  },
  department: {
    type: String
  },
  semester: {
    type: Number
  },
  organizer: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes**:
- `eventDate`: Index for sorting
- `department`: Index for filtering

**Example Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "title": "Tech Fest 2024",
  "description": "Annual technology festival",
  "eventDate": ISODate("2024-12-15T09:00:00.000Z"),
  "location": "Main Auditorium",
  "department": "",
  "semester": null,
  "organizer": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-12-01T10:00:00.000Z")
}
```

### 6. Notices Collection

Stores official notices with validity periods.

**Collection Name**: `notices`

**Schema**:
```javascript
{
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['academic', 'exam', 'holiday', 'general'],
    default: 'general'
  },
  department: {
    type: String
  },
  semester: {
    type: Number
  },
  validUntil: {
    type: Date
  },
  attachments: [{
    url: String,
    publicId: String,
    filename: String
  }],
  createdBy: {
    type: ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes**:
- `category`: Index for filtering
- `isActive`: Index for filtering
- `validUntil`: Index for expiration checks

**Example Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "title": "Exam Schedule",
  "content": "Final exams will be held from December 20-30",
  "category": "exam",
  "department": "Computer Science",
  "semester": 3,
  "validUntil": ISODate("2024-12-31T23:59:59.000Z"),
  "attachments": [],
  "createdBy": ObjectId("507f1f77bcf86cd799439011"),
  "isActive": true,
  "createdAt": ISODate("2024-12-01T10:00:00.000Z")
}
```

### 7. Messages Collection

Stores general chat messages.

**Collection Name**: `messages`

**Schema**:
```javascript
{
  sender: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    url: String,
    publicId: String,
    filename: String
  }],
  department: {
    type: String
  },
  semester: {
    type: Number
  },
  isGeneral: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes**:
- `sender`: Index for queries
- `createdAt`: Index for sorting
- `isGeneral`: Index for filtering

**Example Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439017"),
  "sender": ObjectId("507f1f77bcf86cd799439011"),
  "content": "Hello everyone!",
  "attachments": [],
  "department": null,
  "semester": null,
  "isGeneral": true,
  "createdAt": ISODate("2024-12-01T10:00:00.000Z")
}
```

### 8. DirectMessages Collection

Stores private messages between users.

**Collection Name**: `directmessages`

**Schema**:
```javascript
{
  sender: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String
  },
  attachments: [{
    url: String,
    publicId: String,
    filename: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes**:
- Compound index: `{ sender: 1, receiver: 1 }`
- `isRead`: Index for unread count
- `createdAt`: Index for sorting

**Example Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439018"),
  "sender": ObjectId("507f1f77bcf86cd799439011"),
  "receiver": ObjectId("507f1f77bcf86cd799439012"),
  "content": "Can you help me with the assignment?",
  "attachments": [],
  "isRead": false,
  "createdAt": ISODate("2024-12-01T10:00:00.000Z")
}
```

## Relationships

### User → Assignments
- One-to-Many: One user (admin) can create many assignments
- Reference: `assignments.createdBy` → `users._id`

### User → Announcements
- One-to-Many: One user (admin) can create many announcements
- Reference: `announcements.createdBy` → `users._id`

### User → Materials
- One-to-Many: One user (admin) can create many materials
- Reference: `materials.createdBy` → `users._id`

### User → Events
- One-to-Many: One user (admin) can organize many events
- Reference: `events.organizer` → `users._id`

### User → Notices
- One-to-Many: One user (admin) can create many notices
- Reference: `notices.createdBy` → `users._id`

### User → Messages
- One-to-Many: One user can send many messages
- Reference: `messages.sender` → `users._id`

### User → DirectMessages
- Many-to-Many: Users can send messages to each other
- References: 
  - `directmessages.sender` → `users._id`
  - `directmessages.receiver` → `users._id`

### User → Assignment Submissions
- Many-to-Many: Students can submit to many assignments
- Embedded: `assignments.submissions.student` → `users._id`

## Database Queries

### Common Query Patterns

#### Get assignments for a specific department and semester
```javascript
Assignment.find({
  $or: [
    { department: 'Computer Science', semester: 3 },
    { department: null },
    { department: '' }
  ]
}).populate('createdBy', 'name');
```

#### Get unread direct messages count
```javascript
DirectMessage.countDocuments({
  receiver: userId,
  isRead: false
});
```

#### Get pinned announcements first
```javascript
Announcement.find()
  .sort('-isPinned -createdAt')
  .populate('createdBy', 'name');
```

#### Get upcoming events
```javascript
Event.find({
  eventDate: { $gte: new Date() }
}).sort('eventDate');
```

## Data Validation

### Mongoose Validators
- Required fields validation
- Enum validation for specific fields
- Min/max validation for numbers
- Email format validation
- Unique constraint on email

### Application-Level Validation
- Password strength (minimum 6 characters)
- File size limits (5MB)
- File type validation
- Department and semester matching

## Backup Strategy

### Recommended Backup Approach
1. **Daily Backups**: Automated daily MongoDB dumps
2. **Retention**: Keep last 30 days of backups
3. **Cloud Storage**: Store backups in cloud (S3, Google Cloud)
4. **Testing**: Regular restore testing

### Backup Command
```bash
mongodump --uri="mongodb://localhost:27017/linkbridge" --out=/backup/$(date +%Y%m%d)
```

### Restore Command
```bash
mongorestore --uri="mongodb://localhost:27017/linkbridge" /backup/20241201
```

## Performance Optimization

### Indexes
All collections have appropriate indexes for common queries.

### Query Optimization
- Use `.select()` to limit returned fields
- Use `.lean()` for read-only queries
- Implement pagination for large datasets
- Use aggregation pipeline for complex queries

### Connection Pooling
MongoDB driver automatically manages connection pooling.

## Migration Strategy

### Schema Changes
1. Create migration script
2. Test on development database
3. Backup production database
4. Run migration on production
5. Verify data integrity

### Example Migration Script
```javascript
// Add new field to existing documents
db.users.updateMany(
  { phoneNumber: { $exists: false } },
  { $set: { phoneNumber: null } }
);
```
