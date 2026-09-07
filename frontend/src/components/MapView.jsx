import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
    // Upper Ganges Basin Center (approx. Haridwar/Rishikesh)
    const position = [29.9457, 78.1642];

    // Mock monitored locations with varied status
    // In a real app, this would come from GET /alerts
    const [locations, setLocations] = useState([
        { id: 1, lat: 29.9457, lon: 78.1642, status: 'Normal', f1: 0.45 },
        { id: 2, lat: 29.9600, lon: 78.1700, status: 'Tier 1 (Probable)', f1: 0.88 },
        { id: 3, lat: 29.9300, lon: 78.1500, status: 'Tier 2 (Confirmed)', f1: 0.95 },
        { id: 4, lat: 29.9800, lon: 78.1800, status: 'Normal', f1: 0.60 },
        { id: 5, lat: 29.9100, lon: 78.1400, status: 'Tier 1 (Probable)', f1: 0.86 },
    ]);

    const getColor = (status) => {
        if (status.includes('Tier 2')) return '#ef4444'; // Red-500
        if (status.includes('Tier 1')) return '#f97316'; // Orange-500
        return '#22c55e'; // Green-500
    };

    return (
        <div className="h-[650px] w-full rounded-xl overflow-hidden relative z-0">
            <MapContainer center={position} zoom={12} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc) => (
                    <CircleMarker
                        key={loc.id}
                        center={[loc.lat, loc.lon]}
                        pathOptions={{ color: getColor(loc.status), fillColor: getColor(loc.status), fillOpacity: 0.7 }}
                        radius={10}
                    >
                        <Popup>
                            <div className="text-sm">
                                <p><strong>Status:</strong> <span style={{ color: getColor(loc.status) }}>{loc.status}</span></p>
                                <p><strong>F1 Score:</strong> {loc.f1}</p>
                                <p><strong>Lat/Lon:</strong> {loc.lat}, {loc.lon}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
