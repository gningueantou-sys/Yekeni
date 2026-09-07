import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from './supabaseClient';
import './Carte.css';

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Cache de géocodage (ville+pays -> lat/lng) pour éviter de re-interroger
// le service de géocodage à chaque chargement de la carte
const GEOCODE_CACHE_KEY = 'yekeni_geocode_cache';
const chargerCacheGeo = () => {
  try { return JSON.parse(localStorage.getItem(GEOCODE_CACHE_KEY) || '{}'); } catch (e) { return {}; }
};
const sauvegarderCacheGeo = (cache) => {
  try { localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache)); } catch (e) {}
};

async function geocoder(ville, pays, cache) {
  const cle = `${ville}|${pays}`.toLowerCase();
  if (cache[cle]) return cache[cle];
  try {
    const q = encodeURIComponent(`${ville}, ${pays}`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`);
    const data = await res.json();
    if (data && data[0]) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      cache[cle] = coords;
      sauvegarderCacheGeo(cache);
      return coords;
    }
  } catch (e) {
    console.error('Erreur géocodage', ville, pays, e);
  }
  return null;
}

function createIcon(genre) {
  const couleur = genre === 'homme' ? '#00BCD4' : genre === 'femme' ? '#E91E63' : '#9E9E9E';
  const emoji = genre === 'homme' ? '👨' : genre === 'femme' ? '👩' : '🧑';
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
        <span style="transform: rotate(45deg); font-size: 20px;">${emoji}</span>
      </div>
    `,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });
}

function Carte() {
  const [membres, setMembres] = useState([]);
  const [nonLocalises, setNonLocalises] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [membreSelectionne, setMembreSelectionne] = useState(null);
  const [filtre, setFiltre] = useState('tous');

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }

      const { data: profil } = await supabase
        .from('profils')
        .select('famille_id')
        .eq('id', user.id)
        .single();

      if (!profil?.famille_id) { setChargement(false); return; }

      const { data, error } = await supabase
        .from('membres')
        .select('id, prenom, nom, genre, ville, pays, profession')
        .eq('famille_id', profil.famille_id);

      if (error) { console.error('Erreur chargement carte :', error); setChargement(false); return; }

      const cache = chargerCacheGeo();
      const localises = [];
      const sansLieu = [];

      for (const r of (data || [])) {
        const nom = r.prenom ? `${r.prenom} ${r.nom}` : r.nom;
        if (r.ville && r.pays) {
          const coords = await geocoder(r.ville, r.pays, cache);
          if (coords) {
            localises.push({
              id: r.id, nom, genre: r.genre, ville: r.ville, pays: r.pays,
              profession: r.profession || '', lat: coords.lat, lng: coords.lng,
            });
          } else {
            sansLieu.push({ id: r.id, nom, ville: r.ville, pays: r.pays });
          }
        } else {
          sansLieu.push({ id: r.id, nom, ville: r.ville, pays: r.pays });
        }
      }

      setMembres(localises);
      setNonLocalises(sansLieu);
      setChargement(false);
    }
    charger();
  }, []);

  const membresFiltres = filtre === 'tous'
    ? membres
    : membres.filter(m => m.genre === filtre);

  const pays = [...new Set(membres.map(m => m.pays))];

  if (chargement) {
    return <div className="carte-page"><p style={{padding:'2rem'}}>⏳ Localisation des membres en cours...</p></div>;
  }

  return (
    <div className="carte-page">

      {/* STATS */}
      <div className="carte-stats">
        <div className="carte-stat-card">
          <span>👥</span>
          <div>
            <h3>{membres.length}</h3>
            <p>Membres localisés</p>
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
                icon={createIcon(m.genre)}
                eventHandlers={{ click: () => setMembreSelectionne(m) }}
              >
                <Popup>
                  <div className="popup-content">
                    <h4>{m.nom}</h4>
                    {m.profession && <p>{m.profession}</p>}
                    <p>📍 {m.ville}, {m.pays}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
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
                  <div>
                    <p className="membre-loc-nom">{m.nom}</p>
                    <p className="membre-loc-ville">📍 {m.ville}</p>
                  </div>
                  <span className={`genre-badge ${m.genre}`}>
                    {m.genre === 'homme' ? '♂' : m.genre === 'femme' ? '♀' : '·'}
                  </span>
                </div>
              ))}
            </div>
          ))}
          {membres.length === 0 && (
            <p style={{color:'#888', fontSize:'.85rem'}}>Aucun membre localisé pour l'instant — renseigne une ville et un pays sur la page Membres.</p>
          )}
        </div>
      </div>

      {nonLocalises.length > 0 && (
        <p style={{color:'#888', fontSize:'.85rem', marginTop:'1rem'}}>
          {nonLocalises.length} membre{nonLocalises.length>1?'s':''} n'{nonLocalises.length>1?'ont':'a'} pas pu être placé{nonLocalises.length>1?'s':''} sur la carte : {nonLocalises.map(m=>m.nom).join(', ')} (ville/pays manquant ou introuvable).
        </p>
      )}

      {/* DETAIL MEMBRE */}
      {membreSelectionne && (
        <div className="membre-detail-carte">
          <div className="detail-header">
            <div>
              <h3>{membreSelectionne.nom}</h3>
              <p>{membreSelectionne.profession ? `${membreSelectionne.profession} — ` : ''}{membreSelectionne.ville}, {membreSelectionne.pays}</p>
            </div>
            <button onClick={() => setMembreSelectionne(null)}>✕</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Carte;