import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PublicRoute = ({children}) => {
  console.log('PublicRoute checking...');
  
  try {
    const isAuthenticated = authService.isAuthenticated();
    console.log('Is authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('Already authenticated, redirecting to home');
      return <Navigate to="/" replace />;
    }
    
    console.log('Not authenticated, showing public content');
    return children;
  } catch (error) {
    console.error('PublicRoute error:', error);
    return children;
  }
}

export default PublicRoute;