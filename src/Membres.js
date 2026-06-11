import React, { useState } from 'react';
import './Membres.css';

const membresInitiaux = [
  { id: 1, nom: 'Moussa Diallo', prenom: 'Moussa', role: 'Admin', sang: 'O+', avatar: '👴', ville: 'Dakar', pays: 'Sénégal', profession: 'Retraité', telephone: '+221 77 000 00 00', maladie: 'Aucune', allergie: 'Aucune' },
  { id: 2, nom: 'Fatoumata Diallo', prenom: 'Fatoumata', role: 'Membre', sang: 'A+', avatar: '👵', ville: 'Dakar', pays: 'Sénégal', profession: 'Ménagère', telephone: '+221 77 000 00 01', maladie: 'Diabète', allergie: 'Aucune' },
  { id: 3, nom: 'Ibrahim Diallo', prenom: 'Ibrahim', role: 'Membre', sang: 'B+', avatar: '👨', ville: 'Paris', pays: 'France', profession: 'Ingénieur', telephone: '+33 6 00 00 00 00', maladie: 'Aucune', allergie: 'Pénicilline' },
  { id: 4, nom: 'Aminata Diallo', prenom: 'Aminata', role: 'Membre', sang: 'AB+', avatar: '👩', ville: 'New York', pays: 'USA', profession: 'Médecin', telephone: '+1 000 000 0000', maladie: 'Aucune', allergie: 'Aucune' },
  { id: 5, nom: 'Ousmane Diallo', prenom: 'Ousmane', role: 'Invité', sang: 'O+', avatar: '🧒', ville: 'Conakry', pays: 'Guinée', profession: 'Étudiant', telephone: '+224 00 00 00 00', maladie: 'Drépanocytose', allergie: 'Aucune' },
];

const emojis = ['👴', '👵', '👨', '👩', '🧒', '👧', '👦', '👤', '🧑', '👱'];

function Membres() {
  const [membres, setMembres] = useState(membresInitiaux);
  const [recherche, setRecherche] = useState('');
  const [membreSelectionne, setMembreSelectionne] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [nouveau, setNouveau] = useState({
    nom: '', prenom: '', role: 'Membre', sang: 'Inconnu', avatar: '👤',
    ville: '', pays: '', profession: '', telephone: '', maladie: 'Aucune', allergie: 'Aucune'
  });

  const membresFiltres = membres.filter(m =>
    m.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    m.ville.toLowerCase().includes(recherche.toLowerCase()) ||
    m.pays.toLowerCase().includes(recherche.toLowerCase())
  );

  const ajouterMembre = () => {
    const newMembre = { ...nouveau, id: membres.length + 1 };
    setMembres([...membres, newMembre]);
    setShowForm(false);
    setNouveau({ nom: '', prenom: '', role: 'Membre', sang: 'Inconnu', avatar: '👤', ville: '', pays: '', profession: '', telephone: '', maladie: 'Aucune', allergie: 'Aucune' });
  };

  const supprimerMembre = (id) => {
    setMembres(membres.filter(m => m.id !== id));
    setShowConfirm(null);
    setMembreSelectionne(null);
  };

  return (
    <div className="membres-page">

      {/* TOOLBAR */}
      <div className="membres-toolbar">
        <div className="recherche-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        <div className="toolbar-stats">
          <span>👥 {membres.length} membres</span>
          <span>🌍 {[...new Set(membres.map(m => m.pays))].length} pays</span>
        </div>
        <button className="btn-nouveau" onClick={() => setShowForm(true)}>
          + Nouveau membre
        </button>
      </div>

      <div className="membres-layout">

        {/* LISTE */}
        <div className="membres-liste">
          {membresFiltres.map(m => (
            <div
              key={m.id}
              className={`membre-item ${membreSelectionne?.id === m.id ? 'actif' : ''}`}
              onClick={() => setMembreSelectionne(m)}
            >
              <div className="membre-item-avatar">{m.avatar}</div>
              <div className="membre-item-info">
                <h4>{m.nom}</h4>
                <p>{m.profession} — {m.ville}, {m.pays}</p>
              </div>
              <div className="membre-item-badges">
                <span className={`badge-role ${m.role.toLowerCase()}`}>{m.role}</span>
                <span className="badge-sang">{m.sang}</span>
                {m.maladie !== 'Aucune' && <span className="badge-alert">⚠️</span>}
              </div>
            </div>
          ))}

          {membresFiltres.length === 0 && (
            <div className="no-results">
              <p>😔 Aucun membre trouvé</p>
            </div>
          )}
        </div>

        {/* PROFIL */}
        {membreSelectionne ? (
          <div className="membre-profil">
            <div className="profil-header">
              <div className="profil-avatar">{membreSelectionne.avatar}</div>
              <div>
                <h2>{membreSelectionne.nom}</h2>
                <p>{membreSelectionne.profession}</p>
                <span className={`badge-role ${membreSelectionne.role.toLowerCase()}`}>{membreSelectionne.role}</span>
              </div>
              <button className="btn-supprimer" onClick={() => setShowConfirm(membreSelectionne.id)}>
                🗑️ Supprimer
              </button>
            </div>

            <div className="profil-infos">
              <div className="info-section">
                <h3>📋 Informations personnelles</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">🌍 Ville</span>
                    <span className="info-value">{membreSelectionne.ville}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🏳️ Pays</span>
                    <span className="info-value">{membreSelectionne.pays}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">💼 Profession</span>
                    <span className="info-value">{membreSelectionne.profession}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📱 Téléphone</span>
                    <span className="info-value">{membreSelectionne.telephone}</span>
                  </div>
                </div>
              </div>

              <div className="info-section sante-section">
                <h3>🩺 Données de santé</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">🩸 Groupe sanguin</span>
                    <span className="info-value sang">{membreSelectionne.sang}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🧬 Maladie héréditaire</span>
                    <span className={`info-value ${membreSelectionne.maladie !== 'Aucune' ? 'warning' : ''}`}>
                      {membreSelectionne.maladie}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">💊 Allergie</span>
                    <span className={`info-value ${membreSelectionne.allergie !== 'Aucune' ? 'warning' : ''}`}>
                      {membreSelectionne.allergie}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="membre-profil vide">
            <div className="vide-content">
              <span>👆</span>
              <p>Clique sur un membre pour voir son profil</p>
            </div>
          </div>
        )}
      </div>

      {/* FORM AJOUT */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>👤 Ajouter un membre</h3>
            <div className="emoji-picker">
              {emojis.map(e => (
                <button key={e} className={nouveau.avatar === e ? 'emoji-btn actif' : 'emoji-btn'} onClick={() => setNouveau({ ...nouveau, avatar: e })}>
                  {e}
                </button>
              ))}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prénom *</label>
                <input type="text" placeholder="Moussa" value={nouveau.prenom} onChange={(e) => setNouveau({ ...nouveau, prenom: e.target.value, nom: e.target.value + ' Diallo' })} />
              </div>
              <div className="form-group">
                <label>Nom complet *</label>
                <input type="text" placeholder="Moussa Diallo" value={nouveau.nom} onChange={(e) => setNouveau({ ...nouveau, nom: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ville</label>
                <input type="text" placeholder="Dakar" value={nouveau.ville} onChange={(e) => setNouveau({ ...nouveau, ville: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Pays</label>
                <input type="text" placeholder="Sénégal" value={nouveau.pays} onChange={(e) => setNouveau({ ...nouveau, pays: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Profession</label>
                <input type="text" placeholder="Étudiant" value={nouveau.profession} onChange={(e) => setNouveau({ ...nouveau, profession: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="text" placeholder="+221 77 000 00 00" value={nouveau.telephone} onChange={(e) => setNouveau({ ...nouveau, telephone: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Rôle</label>
                <select value={nouveau.role} onChange={(e) => setNouveau({ ...nouveau, role: e.target.value })}>
                  <option>Admin</option>
                  <option>Membre</option>
                  <option>Invité</option>
                </select>
              </div>
              <div className="form-group">
                <label>Groupe sanguin</label>
                <select value={nouveau.sang} onChange={(e) => setNouveau({ ...nouveau, sang: e.target.value })}>
                 <option value="Inconnu">❓ Inconnu</option>
                  <option>O+</option><option>O-</option>
                  <option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Maladie héréditaire</label>
                <input type="text" placeholder="Aucune" value={nouveau.maladie} onChange={(e) => setNouveau({ ...nouveau, maladie: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Allergie</label>
                <input type="text" placeholder="Aucune" value={nouveau.allergie} onChange={(e) => setNouveau({ ...nouveau, allergie: e.target.value })} />
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={() => setShowForm(false)}>Annuler</button>
              <button className="btn-confirmer" onClick={ajouterMembre} disabled={!nouveau.nom}>
                Ajouter le membre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION SUPPRESSION */}
      {showConfirm && (
        <div className="form-overlay">
          <div className="confirm-modal">
            <span>⚠️</span>
            <h3>Supprimer ce membre ?</h3>
            <p>Cette action est irréversible.</p>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={() => setShowConfirm(null)}>Annuler</button>
              <button className="btn-supprimer-confirm" onClick={() => supprimerMembre(showConfirm)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Membres;