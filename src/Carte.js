import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const membresInitiaux = [
  { id: 1, nom: 'Moussa Diallo', avatar: '👴', ville: 'Dakar', pays: 'Sénégal', lat: 14.6937, lng: -17.4441, genre: 'homme', role: 'Grand-père' },
  { id: 2, nom: 'Fatoumata Diallo', avatar: '👵', ville: 'Dakar', pays: 'Sénégal', lat: 14.6837, lng: -17.4541, genre: 'femme', role: 'Grand-mère' },
  { id: 3, nom: 'Ibrahim Diallo', avatar: '👨', ville: 'Paris', pays: 'France', lat: 48.8566, lng: 2.3522, genre: 'homme', role: 'Père' },
  { id: 4, nom: 'Aminata Diallo', avatar: '👩', ville: 'New York', pays: 'USA', lat: 40.7128, lng: -74.0060, genre: 'femme', role: 'Mère' },
  { id: 5, nom: 'Ousmane Diallo', avatar: '🧒', ville: 'Conakry', pays: 'Guinée', lat: 9.6412, lng: -13.5784, genre: 'homme', role: 'Fils' },
  { id: 6, nom: 'Mariam Diallo', avatar: '👧', ville: 'Abidjan', pays: "Côte d'Ivoire", lat: 5.3600, lng: -4.0083, genre: 'femme', role: 'Fille' },
];

function createIcon(avatar, genre) {
  const couleur = genre === 'homme' ? '#00BCD4' : '#E91E63';
  return L.divIcon({
    html: `
      <div style="
        background: ${couleur};
        width: 44px; height: 44px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 20px;">${avatar}</span>
      </div>
    `,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });
}

function Carte() {
  const [membres] = useState(membresInitiaux);
  const [membreSelectionne, setMembreSelectionne] = useState(null);
  const [filtre, setFiltre] = useState('tous');

  const membresFiltres = filtre === 'tous'
    ? membres
    : membres.filter(m => m.genre === filtre);

  const pays = [...new Set(membres.map(m => m.pays))];

  return (
    <div className="carte-page">

      {/* STATS */}
      <div className="carte-stats">
        <div className="carte-stat-card">
          <span>👥</span>
          <div>
            <h3>{membres.length}</h3>
            <p>Membres</p>
          </div>
        </div>
        <div className="carte-stat-card">
          <span>🌍</span>
          <div>
            <h3>{pays.length}</h3>
            <p>Pays</p>
          </div>
        </div>
        <div className="carte-stat-card">
          <span>🏙️</span>
          <div>
            <h3>{[...new Set(membres.map(m => m.ville))].length}</h3>
            <p>Villes</p>
          </div>
        </div>
        <div className="carte-stat-card premium">
          <span>💎</span>
          <div>
            <h3>Premium</h3>
            <p>Carte complète</p>
          </div>
          <span className="badge-premium">🔒</span>
        </div>
      </div>

      {/* FILTRES */}
      <div className="carte-filtres">
        <button className={filtre === 'tous' ? 'filtre-btn actif' : 'filtre-btn'} onClick={() => setFiltre('tous')}>
          👥 Tous ({membres.length})
        </button>
        <button className={filtre === 'homme' ? 'filtre-btn actif bleu' : 'filtre-btn'} onClick={() => setFiltre('homme')}>
          👨 Hommes ({membres.filter(m => m.genre === 'homme').length})
        </button>
        <button className={filtre === 'femme' ? 'filtre-btn actif rose' : 'filtre-btn'} onClick={() => setFiltre('femme')}>
          👩 Femmes ({membres.filter(m => m.genre === 'femme').length})
        </button>
      </div>

      <div className="carte-layout">

        {/* CARTE */}
        <div className="carte-map-container">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%', borderRadius: '16px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />

            {membresFiltres.map(m => (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                icon={createIcon(m.avatar, m.genre)}
                eventHandlers={{ click: () => setMembreSelectionne(m) }}
              >
                <Popup>
                  <div className="popup-content">
                    <div className="popup-avatar">{m.avatar}</div>
                    <h4>{m.nom}</h4>
                    <p>{m.role}</p>
                    <p>📍 {m.ville}, {m.pays}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Cercle autour de Dakar */}
            <Circle
              center={[14.6937, -17.4441]}
              radius={50000}
              pathOptions={{ color: '#2D6A4F', fillColor: '#2D6A4F', fillOpacity: 0.1 }}
            />
          </MapContainer>
        </div>

        {/* LISTE MEMBRES */}
        <div className="carte-liste">
          <h3>📍 Membres par localisation</h3>
          {pays.map(p => (
            <div key={p} className="pays-groupe">
              <div className="pays-header">
                <span className="pays-flag">🌍</span>
                <span className="pays-nom">{p}</span>
                <span className="pays-count">{membres.filter(m => m.pays === p).length}</span>
              </div>
              {membres.filter(m => m.pays === p).map(m => (
                <div
                  key={m.id}
                  className={`membre-location ${membreSelectionne?.id === m.id ? 'actif' : ''}`}
                  onClick={() => setMembreSelectionne(m)}
                >
                  <span className="membre-loc-avatar">{m.avatar}</span>
                  <div>
                    <p className="membre-loc-nom">{m.nom}</p>
                    <p className="membre-loc-ville">📍 {m.ville}</p>
                  </div>
                  <span className={`genre-badge ${m.genre}`}>
                    {m.genre === 'homme' ? '♂' : '♀'}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MEMBRE */}
      {membreSelectionne && (
        <div className="membre-detail-carte">
          <div className="detail-header">
            <span>{membreSelectionne.avatar}</span>
            <div>
              <h3>{membreSelectionne.nom}</h3>
              <p>{membreSelectionne.role} — {membreSelectionne.ville}, {membreSelectionne.pays}</p>
            </div>
            <button onClick={() => setMembreSelectionne(null)}>✕</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Carte;