import React from 'react'
import authService from '../services/authService'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
  console.log('ProtectedRoute checking...');
  
  try {
    const isAuthenticated = authService.isAuthenticated();
    console.log('Is authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    console.log('Authenticated, showing content');
    return children;
  } catch (error) {
    console.error('ProtectedRoute error:', error);
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;