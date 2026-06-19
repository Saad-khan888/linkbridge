# Teacher vs Admin Access Rights

## Overview
This document outlines the differences in access and permissions between Teachers and Admins in the Linkbridge platform.

---

## 📊 Access Comparison Table

| Feature | Teacher | Admin | Notes |
|---------|---------|-------|-------|
| **Assignments** | ✅ Create, View, Delete | ✅ Create, View, Delete | Both can manage assignments |
| **Announcements** | ✅ Create, View, Delete | ✅ Create, View, Delete | Both can manage announcements |
| **Study Materials** | ✅ Create, View, Delete | ✅ Create, View, Delete | Both can manage materials |
| **Events** | ✅ Create, View, Delete | ✅ Create, View, Delete | Both can manage events |
| **Notices** | ✅ Create, View, Delete | ✅ Create, View, Delete | Both can manage notices |
| **File Uploads** | ✅ Upload files | ✅ Upload files | Both can upload attachments |
| **General Chat** | ✅ Send messages | ✅ Send messages | Both can participate in chat |
| **Direct Messages** | ✅ Message students & admins | ✅ Message teachers & students | Both have DM access |
| **User Management** | ❌ No access | ✅ Full access | Admin only |
| **Student Accounts** | ❌ Cannot manage | ✅ Activate/Deactivate | Admin only |
| **Teacher Approval** | ❌ Cannot approve | ✅ Approve/Reject | Admin only |
| **View All Users** | ❌ No access | ✅ Full access | Admin only |
| **System Settings** | ❌ No access | ✅ Full access | Admin only |

---

## 🎓 Teacher Permissions

### ✅ **What Teachers CAN Do:**

#### Content Management
- **Create** assignments, announcements, materials, events, and notices
- **Delete** their own content (and potentially others' content)
- **Upload** files and attachments
- **View** all content relevant to their department

#### Communication
- **Send** messages in general chat
- **Direct message** students in their department
- **Direct message** admins for support
- **Receive** messages from students and admins

#### Dashboard Access
- Access to Teacher Dashboard
- View their profile
- Edit their own profile information
- View student lists (read-only)

### ❌ **What Teachers CANNOT Do:**

#### User Management
- Cannot activate/deactivate student accounts
- Cannot approve or reject teacher registrations
- Cannot view all users in the system
- Cannot delete user accounts
- Cannot modify user roles

#### System Administration
- Cannot access admin-only routes
- Cannot manage system-wide settings
- Cannot access teacher approval panel

---

## 👨‍💼 Admin Permissions

### ✅ **What Admins CAN Do:**

#### Everything Teachers Can Do, PLUS:

#### User Management
- **View** all users (students, teachers, admins)
- **Activate/Deactivate** student accounts
- **Approve/Reject** teacher registration requests
- **Delete** user accounts
- **Manage** user status and permissions

#### Teacher Management
- **Review** pending teacher registrations
- **Approve** verified teachers
- **Reject** suspicious or invalid registrations
- **View** teacher approval queue

#### Content Management
- **Create** all types of content (assignments, announcements, etc.)
- **Delete** any content (not just their own)
- **Manage** content across all departments
- **View** all content system-wide

#### Communication
- **Message** all students and teachers
- **Access** all conversations
- **Moderate** chat if needed

#### System Access
- Full access to Admin Dashboard
- Access to all admin-only routes
- System-wide visibility and control

### ❌ **What Admins CANNOT Do:**

Admins have full system access with no restrictions within the platform scope.

---

## 🔐 Technical Implementation

### Middleware Used

1. **`authenticate`** - Verifies user is logged in
   - Used by: All protected routes
   - Checks: Valid JWT token

2. **`isAdmin`** - Restricts to admins only
   - Used by: User management routes
   - Checks: `user.role === 'admin'`

3. **`authorizeTeacher`** - Allows teachers AND admins
   - Used by: Content creation/deletion routes
   - Checks: `user.role === 'teacher' || user.role === 'admin'`

### Route Protection

#### Admin-Only Routes:
```javascript
// User Management
GET    /api/auth/users              // View all users
PUT    /api/auth/users/:id/toggle-status  // Activate/deactivate
DELETE /api/auth/users/:id          // Delete user

// Teacher Approval
GET    /api/teachers/pending        // View pending teachers
PUT    /api/teachers/:id/approve    // Approve teacher
PUT    /api/teachers/:id/reject     // Reject teacher
```

#### Teacher + Admin Routes:
```javascript
// Content Management
POST   /api/assignments             // Create assignment
DELETE /api/assignments/:id         // Delete assignment

POST   /api/announcements           // Create announcement
DELETE /api/announcements/:id       // Delete announcement

POST   /api/materials               // Create material
DELETE /api/materials/:id           // Delete material

POST   /api/events                  // Create event
DELETE /api/events/:id              // Delete event

POST   /api/notices                 // Create notice
DELETE /api/notices/:id             // Delete notice
```

---

## 📱 Dashboard Differences

### Teacher Dashboard Features:
- Assignments tab
- Announcements tab
- Materials tab
- Events tab
- Notices tab
- Messages (DM) tab
- General Chat tab
- Profile tab

### Admin Dashboard Features:
All Teacher features, PLUS:
- **Students tab** - View and manage student accounts
- **Teachers tab** - Approve/reject teacher registrations
- Full user management capabilities

---

## 🎯 Use Cases

### When to Use Teacher Account:
- Creating and managing course content
- Communicating with students
- Uploading study materials
- Posting announcements
- Scheduling events

### When to Use Admin Account:
- Managing user accounts
- Approving new teachers
- System-wide content management
- Handling user issues
- Platform administration

---

## 🔄 Permission Flow

```
Student Registration
    ↓
Auto-approved → Student Account (Active)

Teacher Registration
    ↓
Pending Status → Admin Review → Approved/Rejected
                                    ↓
                            Teacher Account (Active)

Admin Account
    ↓
Created manually or promoted by existing admin
```

---

## 📝 Summary

**Key Differences:**

1. **Content Management**: Both can create/delete content
2. **User Management**: Only admins can manage users
3. **Teacher Approval**: Only admins can approve teachers
4. **Scope**: Teachers work within their domain, admins have system-wide access
5. **Dashboard**: Admins have additional tabs for user management

**Philosophy:**
- Teachers are trusted content creators
- Admins are system administrators
- Both roles can manage educational content
- Only admins can manage people and permissions
