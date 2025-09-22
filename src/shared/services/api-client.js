import { apiClient } from '@/core/config/api';
import { API_ENDPOINTS } from '@/core/constants/api-endpoints';

export class ApiClient {
  constructor() {
    this.client = apiClient;
    this.endpoints = API_ENDPOINTS;
  }

  // Generic CRUD methods
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // File upload
  async uploadFile(url, file, config = {}) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.client.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Batch requests
  async batchRequest(requests) {
    try {
      const promises = requests.map(({ method, url, data, config }) => {
        return this.client[method](url, data, config);
      });

      const responses = await Promise.all(promises);
      return responses.map(response => response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }
  }

  // Health check
  async healthCheck() {
    return this.get(this.endpoints.SYSTEM.HEALTH);
  }
}

// Export singleton instance
export const apiService = new ApiClient();
export default apiService;