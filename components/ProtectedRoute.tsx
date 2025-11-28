
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-dark-bg text-dark-text-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
