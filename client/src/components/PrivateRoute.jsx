import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false, teacherOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  console.log('=== PrivateRoute Check ===');
  console.log('Loading:', loading);
  console.log('User:', user);
  console.log('User role:', user?.role);
  console.log('adminOnly:', adminOnly);
  console.log('teacherOnly:', teacherOnly);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    console.log('No user, redirecting to /login');
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    console.log('Admin only route, user is not admin, redirecting to /dashboard');
    return <Navigate to="/dashboard" />;
  }

  if (teacherOnly && user.role !== 'teacher') {
    console.log('Teacher only route, user is not teacher, redirecting to /dashboard');
    return <Navigate to="/dashboard" />;
  }

  // Redirect admins to admin dashboard if they try to access student routes
  if (!adminOnly && !teacherOnly && user.role === 'admin') {
    console.log('Admin trying to access student route, redirecting to /admin/dashboard');
    return <Navigate to="/admin/dashboard" />;
  }

  // Redirect teachers to teacher dashboard if they try to access student routes
  if (!adminOnly && !teacherOnly && user.role === 'teacher') {
    console.log('Teacher trying to access student route, redirecting to /teacher/dashboard');
    return <Navigate to="/teacher/dashboard" />;
  }

  console.log('Access granted, rendering children');
  return children;
};

export default PrivateRoute;
