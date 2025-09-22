import React from 'react';
import { authService } from '../../services';

// Componente para mostrar/ocultar elementos según roles
const RoleBasedComponent = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallback = null
}) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return fallback;
  }

  // Verificar roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return fallback;
  }

  // Verificar permisos requeridos
  if (requiredPermissions.length > 0 && currentUser.permissions) {
    const hasPermissions = requiredPermissions.every(permission =>
      currentUser.permissions.includes(permission)
    );

    if (!hasPermissions) {
      return fallback;
    }
  }

  return children;
};

// Hook personalizado para verificar permisos
export const usePermissions = () => {
  const currentUser = authService.getCurrentUser();

  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  const hasPermission = (permission) => {
    return currentUser?.permissions?.includes(permission);
  };

  const hasAnyRole = (roles) => {
    return roles.includes(currentUser?.role);
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission =>
      currentUser?.permissions?.includes(permission)
    );
  };

  return {
    currentUser,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllPermissions,
    isAdmin: hasRole('admin'),
    isDoctor: hasRole('doctor'),
    isNurse: hasRole('nurse'),
    isReceptionist: hasRole('receptionist')
  };
};

export default RoleBasedComponent;