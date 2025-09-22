import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermissions = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico
  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si se requieren permisos específicos
  if (requiredPermissions.length > 0 && currentUser?.permissions) {
    const hasPermissions = requiredPermissions.every(permission =>
      currentUser.permissions.includes(permission)
    );

    if (!hasPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si todo está bien, mostrar el componente
  return children;
};

export default ProtectedRoute;