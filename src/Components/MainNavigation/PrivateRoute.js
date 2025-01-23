import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedEmails }) => {
  const token = localStorage.getItem('authToken');
  const userEmail = localStorage.getItem('userEmail');

  if (!token) {
    alert("Please login");
    return <Navigate to="/login"/>;
  }

  // Check if the user is allowed (based on their email)
  if (allowedEmails && !allowedEmails.includes(userEmail)) {
    alert("You are not authorized to access this page Please Login as Admin.");
    return <Navigate to="/login"/>;// Redirect to homepage if unauthorized
  }

  return <Outlet />;
};

export default PrivateRoute;
