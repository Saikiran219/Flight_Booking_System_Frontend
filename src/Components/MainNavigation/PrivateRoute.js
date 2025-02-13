import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('Role'); 
  
  if (!token) {
    alert("Please login");
    return <Navigate to="/login"/>;
  }

  // Check if the user is allowed (based on their email)
  if (!allowedRoles.includes(userRole)) {
     alert("You are not authorized to access this page Please Login as Admin.");
     return <Navigate to="/login"/>;
   }
  return <Outlet />;
};

export default PrivateRoute;
