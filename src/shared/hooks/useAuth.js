import { useState, useEffect, useContext, createContext } from 'react';
import { storageService } from '@/shared/services/storage-service';
import { apiService } from '@/shared/services/api-client';
import { API_ENDPOINTS } from '@/core/constants/api-endpoints';
import { PERMISSIONS, ROLES } from '@/core/constants/permissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = storageService.getAuthToken();
        const savedUser = storageService.getCurrentUser();

        if (token && savedUser) {
          // Verify token is still valid
          await apiService.get(API_ENDPOINTS.AUTH.VERIFY);
          setUser(savedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token is invalid, clear storage
        storageService.clearUserSession();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { email, password, rememberMe = false } = credentials;

      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response;

      // Store tokens
      storageService.setAuthToken(accessToken, rememberMe);
      if (refreshToken) {
        storageService.setRefreshToken(refreshToken);
      }

      // Store user data
      storageService.setCurrentUser(userData);

      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage regardless of API call result
      storageService.clearUserSession();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = storageService.getRefreshToken();
      if (!refresh) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken: refresh,
      });

      const { accessToken } = response;
      storageService.setAuthToken(accessToken, true);

      return accessToken;
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role) => {
    if (!user || !user.role) return false;
    return user.role === role;
  };

  const hasAnyPermission = (permissions) => {
    if (!user || !user.permissions) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions) => {
    if (!user || !user.permissions) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  const canAccess = (requiredPermissions = [], requiredRole = null) => {
    if (requiredRole && !hasRole(requiredRole)) return false;
    if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) return false;
    return true;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;