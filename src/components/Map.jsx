import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function Map({ position }) {
  const defaultPosition = [19.0760, 72.8777]
  const mapPosition = position || defaultPosition

  return (
    <MapContainer
      center={mapPosition}
      zoom={15}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={mapPosition}>
        <Popup>
          📍 CivicFix Complaint Location
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map
