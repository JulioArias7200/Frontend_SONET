import apiClient from '../apiClient';
import { ApiResponse, Blip } from '@/types/models';

// Servicio para gestionar blips
const blipService = {
  // Obtener todos los blips
  getAllBlips: async (): Promise<ApiResponse<Blip[]>> => {
    try {
      return await apiClient.get<ApiResponse<Blip[]>>('/api/blips');
    } catch (error) {
      console.error('Error al obtener blips:', error);
      throw error;
    }
  },
  
  // Crear nuevo blip
  createBlip: async (blipData: { author: string, content: string, created_at?: Date }): Promise<ApiResponse<Blip>> => {
    try {
      return await apiClient.post<ApiResponse<Blip>>('/api/blips', blipData);
    } catch (error) {
      console.error('Error al crear blip:', error);
      throw error;
    }
  }
};

export default blipService;