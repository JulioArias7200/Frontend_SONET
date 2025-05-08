import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import blipService from '../api/services/blipService';
import { Blip } from '../types/api';

const BlipList: React.FC = () => {
  const navigate = useNavigate();
  const { data: blips, loading, error, execute: fetchBlips } = useApi<Blip[]>(blipService.getAllBlips);

  useEffect(() => {
    fetchBlips();
  }, [fetchBlips]);

  if (loading) return <div>Cargando blips...</div>;
  if (error) return <div>Error al cargar los blips: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Blips Recientes</h2>
      {blips && blips.length > 0 ? (
        <ul className="space-y-2">
          {blips.map((blip) => (
            <li key={blip._id} className="p-4 border rounded-lg">
              <div className="font-bold">{blip.author}</div>
              <div>{blip.content}</div>
              <div className="text-sm text-gray-500">
                {new Date(blip.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No hay blips disponibles</div>
      )}
    </div>
  );
};

export default BlipList;