import { APP_CONSTANTS } from '@/core/constants/app-constants';

class StorageService {
  constructor() {
    this.keys = APP_CONSTANTS.STORAGE_KEYS;
  }

  // Generic storage methods
  setItem(key, value, useSessionStorage = false) {
    try {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  getItem(key, defaultValue = null) {
    try {
      // Try localStorage first, then sessionStorage
      let value = localStorage.getItem(key) || sessionStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  clear() {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Auth-specific methods
  setAuthToken(token, persistent = false) {
    if (persistent) {
      localStorage.setItem(this.keys.AUTH_TOKEN, token);
    } else {
      sessionStorage.setItem(this.keys.AUTH_TOKEN, token);
    }
  }

  getAuthToken() {
    return localStorage.getItem(this.keys.AUTH_TOKEN) ||
           sessionStorage.getItem(this.keys.AUTH_TOKEN);
  }

  removeAuthToken() {
    localStorage.removeItem(this.keys.AUTH_TOKEN);
    sessionStorage.removeItem(this.keys.AUTH_TOKEN);
  }

  setRefreshToken(token) {
    localStorage.setItem(this.keys.REFRESH_TOKEN, token);
  }

  getRefreshToken() {
    return localStorage.getItem(this.keys.REFRESH_TOKEN);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.keys.REFRESH_TOKEN);
  }

  // User data methods
  setCurrentUser(user) {
    this.setItem(this.keys.CURRENT_USER, user);
  }

  getCurrentUser() {
    return this.getItem(this.keys.CURRENT_USER);
  }

  removeCurrentUser() {
    this.removeItem(this.keys.CURRENT_USER);
  }

  // User preferences
  setUserPreferences(preferences) {
    this.setItem(this.keys.USER_PREFERENCES, preferences);
  }

  getUserPreferences() {
    return this.getItem(this.keys.USER_PREFERENCES, {
      theme: 'light',
      language: 'es',
      dateFormat: APP_CONSTANTS.DATE_FORMATS.DISPLAY,
      pageSize: APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    });
  }

  updateUserPreference(key, value) {
    const preferences = this.getUserPreferences();
    preferences[key] = value;
    this.setUserPreferences(preferences);
  }

  // Sidebar state
  setSidebarState(isOpen) {
    this.setItem(this.keys.SIDEBAR_STATE, isOpen);
  }

  getSidebarState() {
    return this.getItem(this.keys.SIDEBAR_STATE, true);
  }

  // Session management
  clearUserSession() {
    this.removeAuthToken();
    this.removeRefreshToken();
    this.removeCurrentUser();
  }

  // Check if storage is available
  isStorageAvailable(type = 'localStorage') {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get storage info
  getStorageInfo() {
    if (!this.isStorageAvailable()) {
      return { available: false };
    }

    try {
      const used = new Blob(Object.values(localStorage)).size;
      const available = 5 * 1024 * 1024; // 5MB typical limit

      return {
        available: true,
        used,
        available: available,
        percentage: (used / available) * 100,
      };
    } catch (error) {
      return { available: true, error: error.message };
    }
  }
}

export const storageService = new StorageService();
export default storageService;