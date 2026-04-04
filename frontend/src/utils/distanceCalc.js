// Returns distance in km between two [lng, lat] GeoJSON coordinates
export const calculateDistance = (coord1, coord2) => {
  if (!coord1 || !coord2) return null;
  
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  if (d < 0.1) return 'Here';
  if (d < 1) return `${(d * 1000).toFixed(0)}m away`;
  return `${d.toFixed(1)}km away`;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
