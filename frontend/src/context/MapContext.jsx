import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [radius, setRadius] = useState(5); // Default 5km
  const [neighbors, setNeighbors] = useState([]);
  const [loadingNeighbors, setLoadingNeighbors] = useState(false);

  useEffect(() => {
    // Only fetch if user is properly verified and has location
    if (user?.isVerified && user.location) {
      fetchNeighbors();
    }
  }, [radius, user]);

  const fetchNeighbors = async () => {
    setLoadingNeighbors(true);
    try {
      const [lng, lat] = user.location;
      const res = await api.post('/map/neighbors', { lat, lng, radiusInKm: radius });
      setNeighbors(res.data);
    } catch (error) {
      console.error('Failed to fetch neighbors', error);
    } finally {
      setLoadingNeighbors(false);
    }
  };

  return (
    <MapContext.Provider value={{ radius, setRadius, neighbors, loadingNeighbors }}>
      {children}
    </MapContext.Provider>
  );
};
