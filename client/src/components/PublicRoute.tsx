// src/components/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // User is authenticated, redirect to their home page
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return <Navigate to={`/user/${user._id}`} replace />;
  }

  // User not authenticated, render the child routes
  return <Outlet />;
};

export default PublicRoute;