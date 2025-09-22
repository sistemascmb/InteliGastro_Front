import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/shared/services/api-client';

export const useApi = (url, options = {}) => {
  const {
    immediate = true,
    method = 'GET',
    data = null,
    params = {},
    dependencies = [],
  } = options;

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (overrideData = null) => {
    try {
      setLoading(true);
      setError(null);

      let result;
      const requestData = overrideData || data;

      switch (method.toUpperCase()) {
        case 'GET':
          result = await apiService.get(url, { params });
          break;
        case 'POST':
          result = await apiService.post(url, requestData);
          break;
        case 'PUT':
          result = await apiService.put(url, requestData);
          break;
        case 'PATCH':
          result = await apiService.patch(url, requestData);
          break;
        case 'DELETE':
          result = await apiService.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setResponse(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, data, params]);

  useEffect(() => {
    if (immediate && method.toUpperCase() === 'GET') {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  return {
    data: response,
    error,
    loading,
    execute,
    refetch: execute,
  };
};

export const useApiMutation = (url, method = 'POST') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (data, config = {}) => {
    try {
      setLoading(true);
      setError(null);

      let result;
      switch (method.toUpperCase()) {
        case 'POST':
          result = await apiService.post(url, data, config);
          break;
        case 'PUT':
          result = await apiService.put(url, data, config);
          break;
        case 'PATCH':
          result = await apiService.patch(url, data, config);
          break;
        case 'DELETE':
          result = await apiService.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method]);

  return {
    mutate,
    loading,
    error,
  };
};

export default useApi;