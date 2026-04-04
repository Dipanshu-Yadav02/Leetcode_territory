import { useContext, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapContext } from '../../context/MapContext';
import { AuthContext } from '../../context/AuthContext';

// Custom Map Pins (SVGs encoded as Data URLs or basic HTML markers)
const createUserIcon = (isKing) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="
    background-color: ${isKing ? '#eab308' : '#FFA116'};
    width: 20px; height: 20px; 
    border-radius: 50%; border: 3px solid #1E1E1E;
    box-shadow: 0 0 10px ${isKing ? '#eab308' : '#FFA116'};
    ${isKing ? 'position: relative;' : ''}
  ">
    ${isKing ? '<div style="position:absolute; top:-16px; left:-2px; font-size:16px;">👑</div>' : ''}
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const myIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="
    background-color: #3b82f6;
    width: 16px; height: 16px; 
    border-radius: 50%; border: 3px solid #1E1E1E;
    box-shadow: 0 0 15px #3b82f6;
    animation: pulse 2s infinite;
  "></div>
  <style>
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
  </style>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Component to dynamically fit bounds or recenter Map
const MapController = ({ center, radius }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { duration: 1.5 });
    }
  }, [center, radius, map]);
  return null;
};

const MapWidget = () => {
  const { user } = useContext(AuthContext);
  const { neighbors, radius } = useContext(MapContext);

  if (!user?.location) return null;

  const [lng, lat] = user.location;
  const position = [lat, lng];

  return (
    <div className="absolute inset-0 w-full h-full z-0 text-gray-900">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false} // Hide default zoom controls to let our UI shine
      >
        <MapController center={position} radius={radius} />
        
        {/* CartoDB Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* The Green Influence Radius Circle */}
        <Circle 
          center={position} 
          radius={radius * 1000} // Leaflet takes meters
          pathOptions={{ color: '#00FF00', fillColor: '#00FF00', fillOpacity: 0.1, weight: 1 }}
        />

        {/* My Pin */}
        <Marker position={position} icon={myIcon}>
          <Popup className="dark-popup">
            <strong>{user.leetcodeUsername} (You)</strong><br/>
            Rank: {user.leetcodeGlobalRank.toLocaleString()}
          </Popup>
        </Marker>

        {/* Rivals Pins */}
        {neighbors.map((n, idx) => {
          if (n.leetcodeUsername === user.leetcodeUsername) return null; // Drawn above
          const nLat = n.location.coordinates[1];
          const nLng = n.location.coordinates[0];
          const isKing = idx === 0; // Neighbors are sorted, index 0 is best
          
          return (
            <Marker key={n._id} position={[nLat, nLng]} icon={createUserIcon(isKing)}>
              <Popup>
                <strong>{n.leetcodeUsername} {isKing ? '👑' : ''}</strong><br/>
                Rank: {n.leetcodeGlobalRank.toLocaleString()}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapWidget;
