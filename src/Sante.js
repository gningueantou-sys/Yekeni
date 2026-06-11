import React, { useState } from 'react';
import './Sante.css';

const membresInitiaux = [
  { id: 1, nom: 'Moussa Diallo', avatar: '👴', sang: 'O+', maladie: 'Aucune', allergie: 'Aucune', traitement: 'Aucun', medecin: 'Dr. Diop', urgence: '+221 77 000 00 00' },
  { id: 2, nom: 'Fatoumata Diallo', avatar: '👵', sang: 'A+', maladie: 'Diabète', allergie: 'Aucune', traitement: 'Metformine', medecin: 'Dr. Fall', urgence: '+221 77 000 00 01' },
  { id: 3, nom: 'Ibrahim Diallo', avatar: '👨', sang: 'B+', maladie: 'Aucune', allergie: 'Pénicilline', traitement: 'Aucun', medecin: 'Dr. Martin', urgence: '+33 6 00 00 00 00' },
  { id: 4, nom: 'Aminata Diallo', avatar: '👩', sang: 'AB+', maladie: 'Aucune', allergie: 'Aucune', traitement: 'Aucun', medecin: 'Dr. Smith', urgence: '+1 000 000 0000' },
  { id: 5, nom: 'Ousmane Diallo', avatar: '🧒', sang: 'O+', maladie: 'Drépanocytose', allergie: 'Aucune', traitement: 'Hydroxyurée', medecin: 'Dr. Camara', urgence: '+224 00 00 00 00' },
];

const groupesSanguins = {
  'O+': { compatible: ['O+', 'A+', 'B+', 'AB+'], description: 'Donneur universel positif' },
  'O-': { compatible: ['Tous'], description: 'Donneur universel absolu' },
  'A+': { compatible: ['A+', 'AB+'], description: 'Compatible avec A+ et AB+' },
  'A-': { compatible: ['A+', 'A-', 'AB+', 'AB-'], description: 'Compatible avec A et AB' },
  'B+': { compatible: ['B+', 'AB+'], description: 'Compatible avec B+ et AB+' },
  'B-': { compatible: ['B+', 'B-', 'AB+', 'AB-'], description: 'Compatible avec B et AB' },
  'AB+': { compatible: ['AB+'], description: 'Receveur universel' },
  'AB-': { compatible: ['AB+', 'AB-'], description: 'Compatible avec AB' },
};

function Sante() {
  const [membres, setMembres] = useState(membresInitiaux);
  const [membreSelectionne, setMembreSelectionne] = useState(null);
  const [onglet, setOnglet] = useState('apercu');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  const ouvrirForm = (membre) => {
    setFormData({ ...membre });
    setShowForm(true);
  };

  const sauvegarderForm = () => {
    setMembres(membres.map(m => m.id === formData.id ? formData : m));
    if (membreSelectionne?.id === formData.id) setMembreSelectionne(formData);
    setShowForm(false);
  };

  const membresMaladies = membres.filter(m => m.maladie !== 'Aucune');
  const membresAllergies = membres.filter(m => m.allergie !== 'Aucune');

  return (
    <div className="sante-page">

      {/* TABS */}
      <div className="sante-tabs">
        <button className={onglet === 'apercu' ? 'stab actif' : 'stab'} onClick={() => setOnglet('apercu')}>📊 Aperçu</button>
        <button className={onglet === 'fiches' ? 'stab actif' : 'stab'} onClick={() => setOnglet('fiches')}>🩺 Fiches santé</button>
        <button className={onglet === 'urgence' ? 'stab actif' : 'stab'} onClick={() => setOnglet('urgence')}>🚨 Urgence</button>
        <button className={onglet === 'sang' ? 'stab actif' : 'stab'} onClick={() => setOnglet('sang')}>🩸 Compatibilité sanguine</button>
      </div>

      {/* APERCU */}
      {onglet === 'apercu' && (
        <div className="sante-content">
          <div className="sante-stats">
            <div className="sante-stat-card">
              <span>👥</span>
              <h3>{membres.length}</h3>
              <p>Membres suivis</p>
            </div>
            <div className="sante-stat-card warning">
              <span>⚠️</span>
              <h3>{membresMaladies.length}</h3>
              <p>Maladies héréditaires</p>
            </div>
            <div className="sante-stat-card danger">
              <span>💊</span>
              <h3>{membresAllergies.length}</h3>
              <p>Allergies connues</p>
            </div>
            <div className="sante-stat-card success">
              <span>🩸</span>
              <h3>{[...new Set(membres.map(m => m.sang))].length}</h3>
              <p>Groupes sanguins</p>
            </div>
          </div>

          {membresMaladies.length > 0 && (
            <div className="sante-alert-section">
              <h3>⚠️ Membres avec maladies héréditaires</h3>
              <div className="alert-liste">
                {membresMaladies.map(m => (
                  <div className="alert-card" key={m.id}>
                    <span className="alert-avatar">{m.avatar}</span>
                    <div>
                      <h4>{m.nom}</h4>
                      <p>🧬 {m.maladie} — Traitement : {m.traitement}</p>
                    </div>
                    <span className="alert-sang">{m.sang}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {membresAllergies.length > 0 && (
            <div className="sante-alert-section">
              <h3>💊 Membres avec allergies</h3>
              <div className="alert-liste">
                {membresAllergies.map(m => (
                  <div className="alert-card allergie" key={m.id}>
                    <span className="alert-avatar">{m.avatar}</span>
                    <div>
                      <h4>{m.nom}</h4>
                      <p>⚠️ Allergie : {m.allergie}</p>
                    </div>
                    <span className="alert-sang">{m.sang}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FICHES SANTE */}
      {onglet === 'fiches' && (
        <div className="sante-content">
          <div className="fiches-layout">
            <div className="fiches-liste">
              {membres.map(m => (
                <div
                  key={m.id}
                  className={`fiche-item ${membreSelectionne?.id === m.id ? 'actif' : ''}`}
                  onClick={() => setMembreSelectionne(m)}
                >
                  <span className="fiche-avatar">{m.avatar}</span>
                  <div>
                    <h4>{m.nom}</h4>
                    <p>{m.sang} {m.maladie !== 'Aucune' ? '⚠️' : '✅'}</p>
                  </div>
                </div>
              ))}
            </div>

            {membreSelectionne ? (
              <div className="fiche-detail">
                <div className="fiche-header">
                  <span>{membreSelectionne.avatar}</span>
                  <div>
                    <h2>{membreSelectionne.nom}</h2>
                    <span className="fiche-sang">{membreSelectionne.sang}</span>
                  </div>
                  <button className="btn-modifier" onClick={() => ouvrirForm(membreSelectionne)}>
                    ✏️ Modifier
                  </button>
                </div>
                <div className="fiche-infos">
                  <div className="fiche-row">
                    <span className="fiche-label">🩸 Groupe sanguin</span>
                    <span className="fiche-value sang">{membreSelectionne.sang}</span>
                  </div>
                  <div className="fiche-row">
                    <span className="fiche-label">🧬 Maladie héréditaire</span>
                    <span className={`fiche-value ${membreSelectionne.maladie !== 'Aucune' ? 'warning' : 'ok'}`}>
                      {membreSelectionne.maladie}
                    </span>
                  </div>
                  <div className="fiche-row">
                    <span className="fiche-label">💊 Allergie</span>
                    <span className={`fiche-value ${membreSelectionne.allergie !== 'Aucune' ? 'warning' : 'ok'}`}>
                      {membreSelectionne.allergie}
                    </span>
                  </div>
                  <div className="fiche-row">
                    <span className="fiche-label">💉 Traitement</span>
                    <span className="fiche-value">{membreSelectionne.traitement}</span>
                  </div>
                  <div className="fiche-row">
                    <span className="fiche-label">👨‍⚕️ Médecin</span>
                    <span className="fiche-value">{membreSelectionne.medecin}</span>
                  </div>
                  <div className="fiche-row">
                    <span className="fiche-label">📞 Urgence</span>
                    <span className="fiche-value">{membreSelectionne.urgence}</span>
                  </div>
                </div>
                <div className="fiche-lock">
                  🔒 Données chiffrées — Accès Admin uniquement
                </div>
              </div>
            ) : (
              <div className="fiche-detail vide">
                <span>👆</span>
                <p>Clique sur un membre pour voir sa fiche santé</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* URGENCE */}
      {onglet === 'urgence' && (
        <div className="sante-content">
          <div className="urgence-header">
            <span>🚨</span>
            <div>
              <h2>Mode Urgence</h2>
              <p>Accès rapide aux informations médicales critiques</p>
            </div>
          </div>
          <div className="urgence-grid">
            {membres.map(m => (
              <div className="urgence-card" key={m.id}>
                <div className="urgence-top">
                  <span>{m.avatar}</span>
                  <div>
                    <h4>{m.nom}</h4>
                    <span className="urgence-sang">{m.sang}</span>
                  </div>
                </div>
                <div className="urgence-infos">
                  {m.maladie !== 'Aucune' && (
                    <div className="urgence-info warning">
                      🧬 {m.maladie}
                    </div>
                  )}
                  {m.allergie !== 'Aucune' && (
                    <div className="urgence-info danger">
                      ⚠️ Allergie : {m.allergie}
                    </div>
                  )}
                  {m.traitement !== 'Aucun' && (
                    <div className="urgence-info">
                      💉 {m.traitement}
                    </div>
                  )}
                </div>
                <a href={`tel:${m.urgence}`} className="urgence-tel">
                  📞 {m.urgence}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPATIBILITE SANGUINE */}
      {onglet === 'sang' && (
        <div className="sante-content">
          <div className="sang-intro">
            <h2>🩸 Compatibilité sanguine dans la famille</h2>
            <p>En cas d'urgence, sachez qui peut donner du sang à qui</p>
          </div>
          <div className="sang-grid">
            {membres.map(m => (
              <div className="sang-card" key={m.id}>
                <div className="sang-card-header">
                  <span>{m.avatar}</span>
                  <div>
                    <h4>{m.nom}</h4>
                    <span className="sang-badge">{m.sang}</span>
                  </div>
                </div>
                <div className="sang-info">
                  <p className="sang-desc">{groupesSanguins[m.sang]?.description || 'Groupe inconnu'}</p>
                  <div className="sang-compatible">
                    <span className="sang-label">Peut donner à :</span>
                    <div className="sang-tags">
                      {groupesSanguins[m.sang]?.compatible.map((g, i) => (
                        <span key={i} className="sang-tag">{g}</span>
                      ))}
                    </div>
                  </div>
                  <div className="donneurs">
                    <span className="sang-label">Membres compatibles :</span>
                    <div className="donneurs-liste">
                      {membres.filter(d => groupesSanguins[d.sang]?.compatible.includes(m.sang) || groupesSanguins[d.sang]?.compatible.includes('Tous')).map((d, i) => (
                        <span key={i} className="donneur-tag">{d.avatar} {d.nom.split(' ')[0]}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORM MODIFIER */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>✏️ Modifier la fiche santé</h3>
            <h4>{formData.nom}</h4>
            <div className="form-group">
              <label>🩸 Groupe sanguin</label>
              <select value={formData.sang} onChange={(e) => setFormData({ ...formData, sang: e.target.value })}>
                <option value="Inconnu">❓ Inconnu</option>
                <option>O+</option><option>O-</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
              </select>
            </div>
            <div className="form-group">
              <label>🧬 Maladie héréditaire</label>
              <input type="text" value={formData.maladie} onChange={(e) => setFormData({ ...formData, maladie: e.target.value })} />
            </div>
            <div className="form-group">
              <label>💊 Allergie</label>
              <input type="text" value={formData.allergie} onChange={(e) => setFormData({ ...formData, allergie: e.target.value })} />
            </div>
            <div className="form-group">
              <label>💉 Traitement</label>
              <input type="text" value={formData.traitement} onChange={(e) => setFormData({ ...formData, traitement: e.target.value })} />
            </div>
            <div className="form-group">
              <label>👨‍⚕️ Médecin traitant</label>
              <input type="text" value={formData.medecin} onChange={(e) => setFormData({ ...formData, medecin: e.target.value })} />
            </div>
            <div className="form-group">
              <label>📞 Contact urgence</label>
              <input type="text" value={formData.urgence} onChange={(e) => setFormData({ ...formData, urgence: e.target.value })} />
            </div>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={() => setShowForm(false)}>Annuler</button>
              <button className="btn-confirmer" onClick={sauvegarderForm}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Sante;