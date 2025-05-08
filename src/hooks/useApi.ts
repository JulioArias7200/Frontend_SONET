import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { ApiResponse } from '../types/api';

// Hook genérico para llamadas a la API
function useApi<T, P = any>(
  apiFunc: (params?: P) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  // Función para ejecutar la llamada a la API
  const execute = useCallback(
    async (params?: P): Promise<ApiResponse<T> | undefined> => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunc(params);
        if (result.data) {
          setData(result.data);
        }
        return result;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        throw axiosError;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return {
    data,
    loading,
    error,
    execute
  };
}

export default useApi;