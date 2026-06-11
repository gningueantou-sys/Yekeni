import React, { useState, useRef } from 'react';
import './ArbreAnime.css';

let nextId = 2;
const createM = (id, nom, prenom, genre, annee = '', statut = 'vivant') => ({
  id, nom, prenom, genre, annee, statut, photo: null,
  parents: [], conjoints: [], enfants: []
});

function ArbreAnime() {
  const [membres, setMembres] = useState([createM(1, 'Moi', '', 'homme')]);
  const [showForm, setShowForm] = useState(null);
  const [showProfil, setShowProfil] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', genre: 'homme', annee: '', statut: 'vivant' });
  const fileRef = useRef();
  const [photoTarget, setPhotoTarget] = useState(null);

  const get = id => membres.find(m => m.id === id);

  const ajouter = () => {
    if (!form.nom && !form.prenom) return;
    const { type, refId } = showForm;
    const newId = nextId++;
    const newM = createM(newId, form.nom, form.prenom, form.genre, form.annee, form.statut);
    const ref = membres.find(m => m.id === refId);

    if (type === 'pere' || type === 'mere') newM.enfants = [refId];
    if (type === 'conjoint') newM.conjoints = [refId];
    if (type === 'fils' || type === 'fille') newM.parents = [refId];
    if (type === 'frere' || type === 'soeur') newM.parents = [...(ref?.parents || [])];

    setMembres(ms => [
      ...ms.map(m => {
        if (m.id !== refId) return m;
        if (type === 'pere' || type === 'mere') return { ...m, parents: [...m.parents, newId] };
        if (type === 'conjoint') return { ...m, conjoints: [...m.conjoints, newId] };
        if (type === 'fils' || type === 'fille') return { ...m, enfants: [...m.enfants, newId] };
        return m;
      }),
      newM
    ]);
    setShowForm(null);
    setForm({ nom: '', prenom: '', genre: 'homme', annee: '', statut: 'vivant' });
  };

  const ouvrir = (type, refId, genre = 'homme') => {
    setForm({ nom: '', prenom: '', genre, annee: '', statut: 'vivant' });
    setShowForm({ type, refId });
    setShowProfil(null);
  };

  const changerPhoto = (id) => {
    setPhotoTarget(id);
    fileRef.current.click();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file || !photoTarget) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setMembres(ms => ms.map(m => m.id === photoTarget ? { ...m, photo: ev.target.result } : m));
      setShowProfil(p => p?.id === photoTarget ? { ...p, photo: ev.target.result } : p);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const CV = ({ label, genre, onClick }) => (
    <div className={`cv ${genre}`} onClick={onClick}>
      <div className="cv-icon">
        <svg viewBox="0 0 60 60" width="32" height="32">
          <circle cx="30" cy="22" r="13" fill="#ccc"/>
          <ellipse cx="30" cy="52" rx="20" ry="13" fill="#ccc"/>
        </svg>
      </div>
      <div className="cv-text">
        <span className="cv-plus">+</span>
        <span className="cv-label">{label}</span>
      </div>
    </div>
  );

  const Carte = ({ m, centre }) => {
    const c = m.genre === 'homme' ? '#00BCD4' : '#E91E63';
    const bg = m.genre === 'homme' ? '#E0F7FA' : '#FCE4EC';
    const init = ((m.prenom?.[0] || '') + (m.nom?.[0] || '')).toUpperCase();
    return (
      <div className={`carte ${m.genre} ${centre ? 'centre' : ''}`}
        style={{ borderColor: c }}
        onClick={() => setShowProfil(get(m.id))}>
        <div className="carte-photo-wrap" style={{ borderColor: c, background: bg }}>
          {m.photo
            ? <img src={m.photo} alt={m.nom}/>
            : <div className="carte-initiales-wrap">
                <svg viewBox="0 0 60 60" width="40" height="40">
                  <circle cx="30" cy="22" r="13" fill={c} opacity="0.5"/>
                  <ellipse cx="30" cy="52" rx="20" ry="13" fill={c} opacity="0.5"/>
                  {init && <text x="30" y="28" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">{init}</text>}
                </svg>
              </div>
          }
        </div>
        <div className="carte-details">
          <div className="carte-nom">{m.prenom} {m.nom}</div>
          {m.annee && <div className="carte-annee">{m.annee}{m.statut === 'decede' ? ' – Décédé(e)' : ''}</div>}
        </div>
        <div className="carte-arrow">›</div>
      </div>
    );
  };

  const Noeud = ({ id, centre = false }) => {
    const m = get(id);
    if (!m) return null;
    const parents = m.parents.map(get).filter(Boolean);
    const conjoints = m.conjoints.map(get).filter(Boolean);
    const enfants = m.enfants.map(get).filter(Boolean);
    const hasPere = parents.some(p => p.genre === 'homme');
    const hasMere = parents.some(p => p.genre === 'femme');

    return (
      <div className="noeud">
        {/* PARENTS */}
        <div className="rangee parents-rangee">
          {!hasPere && <CV label="Père" genre="homme" onClick={() => ouvrir('pere', id, 'homme')}/>}
          {parents.filter(p => p.genre === 'homme').map(p => <Carte key={p.id} m={p}/>)}
          {!hasMere && <CV label="Mère" genre="femme" onClick={() => ouvrir('mere', id, 'femme')}/>}
          {parents.filter(p => p.genre === 'femme').map(p => <Carte key={p.id} m={p}/>)}
        </div>
        <div className="lien-v"/>

        {/* NIVEAU PRINCIPAL */}
        <div className="principal-row">
          <div className="side-col">
            <CV label="Frère" genre="homme" onClick={() => ouvrir('frere', id, 'homme')}/>
            <CV label="Sœur" genre="femme" onClick={() => ouvrir('soeur', id, 'femme')}/>
          </div>
          <div className="lien-h"/>
          <div className="centre-col">
            <Carte m={m} centre={centre}/>
          </div>
          <div className="lien-h"/>
          <div className="side-col">
            {conjoints.map(c => <Carte key={c.id} m={c}/>)}
            <CV label="Conjoint(e)" genre="homme" onClick={() => ouvrir('conjoint', id)}/>
          </div>
        </div>

        <div className="lien-v"/>
        <button className="btn-plus-rond" onClick={() => ouvrir('fils', id, 'homme')}>+</button>

        {/* ENFANTS */}
        {enfants.length > 0 && (
          <>
            <div className="lien-v"/>
            <div className="rangee enfants-rangee">
              {enfants.map(e => (
                <div key={e.id} className="enfant-col">
                  <div className="lien-v-petit"/>
                  <Carte m={e}/>
                  <div className="lien-v-petit"/>
                  <button className="btn-plus-rond petit" onClick={() => ouvrir('fils', e.id)}>+</button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="lien-v"/>
        <div className="rangee">
          <CV label="Ajouter un fils" genre="homme" onClick={() => ouvrir('fils', id, 'homme')}/>
          <CV label="Ajouter une fille" genre="femme" onClick={() => ouvrir('fille', id, 'femme')}/>
        </div>
      </div>
    );
  };

  return (
    <div className="arbre-anime-page">
      <div className="arbre-anime-header">
        <div>
          <h2>🌳 Arbre généalogique</h2>
          <p>{membres.length} membres · Cliquez sur un membre pour voir son profil</p>
        </div>
      </div>

      <div className="arbre-scroll">
        <Noeud id={1} centre={true}/>
      </div>

      <input type="file" ref={fileRef} accept="image/*" style={{display:'none'}} onChange={handleFile}/>

      {/* FORMULAIRE AJOUT */}
      {showForm && (
        <div className="overlay" onClick={() => setShowForm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="fermer-btn" onClick={() => setShowForm(null)}>✕</button>
            <h3>➕ Ajouter — {showForm.type}</h3>
            <div className="form-g">
              <label>Prénom</label>
              <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} placeholder="Prénom"/>
            </div>
            <div className="form-g">
              <label>Nom *</label>
              <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Nom de famille"/>
            </div>
            <div className="form-g">
              <label>Genre</label>
              <select value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div className="form-g">
              <label>Année de naissance</label>
              <input value={form.annee} onChange={e => setForm({...form, annee: e.target.value})} placeholder="ex: 1980"/>
            </div>
            <div className="form-g">
              <label>Statut</label>
              <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})}>
                <option value="vivant">Vivant(e)</option>
                <option value="decede">Décédé(e)</option>
              </select>
            </div>
            <div className="form-btns">
              <button onClick={() => setShowForm(null)}>Annuler</button>
              <button className="confirmer" onClick={ajouter} disabled={!form.nom && !form.prenom}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* PROFIL MEMBRE */}
      {showProfil && (
        <div className="overlay" onClick={() => setShowProfil(null)}>
          <div className="modal profil-modal" onClick={e => e.stopPropagation()}>
            <button className="fermer-btn" onClick={() => setShowProfil(null)}>✕</button>

            {/* PHOTO */}
            <div className="profil-top">
              <div className="profil-photo" onClick={() => changerPhoto(showProfil.id)}
                style={{ borderColor: showProfil.genre === 'homme' ? '#00BCD4' : '#E91E63' }}>
                {showProfil.photo
                  ? <img src={showProfil.photo} alt={showProfil.nom}/>
                  : <svg viewBox="0 0 60 60" width="70" height="70">
                      <circle cx="30" cy="22" r="13" fill={showProfil.genre === 'homme' ? '#00BCD4' : '#E91E63'} opacity="0.4"/>
                      <ellipse cx="30" cy="52" rx="20" ry="13" fill={showProfil.genre === 'homme' ? '#00BCD4' : '#E91E63'} opacity="0.4"/>
                    </svg>
                }
                <div className="photo-hover">📷</div>
              </div>
              <h3>{showProfil.prenom} {showProfil.nom}</h3>
              {showProfil.annee && <p className="profil-annee">{showProfil.annee}{showProfil.statut === 'decede' ? ' – Décédé(e)' : ''}</p>}
            </div>

            {/* ACTIONS */}
            <div className="profil-actions">
              <h4>Ajouter un membre lié à {showProfil.prenom || showProfil.nom} :</h4>
              <div className="actions-grid">
                <button className="action-btn homme" onClick={() => ouvrir('pere', showProfil.id, 'homme')}>👨 Père</button>
                <button className="action-btn femme" onClick={() => ouvrir('mere', showProfil.id, 'femme')}>👩 Mère</button>
                <button className="action-btn homme" onClick={() => ouvrir('frere', showProfil.id, 'homme')}>👦 Frère</button>
                <button className="action-btn femme" onClick={() => ouvrir('soeur', showProfil.id, 'femme')}>👧 Sœur</button>
                <button className="action-btn homme" onClick={() => ouvrir('fils', showProfil.id, 'homme')}>🧒 Fils</button>
                <button className="action-btn femme" onClick={() => ouvrir('fille', showProfil.id, 'femme')}>👧 Fille</button>
                <button className="action-btn conjoint" onClick={() => ouvrir('conjoint', showProfil.id)}>💑 Conjoint(e)</button>
              </div>
              <button className="btn-photo-profil" onClick={() => changerPhoto(showProfil.id)}>📸 Changer la photo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArbreAnime;