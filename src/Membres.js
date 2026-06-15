import React, { useState, useEffect } from 'react';
import './Membres.css';

const STORAGE_KEY = 'yekeni_membres';

const membresInitiaux = [
  { id:1, nom:'Moussa Diallo', prenom:'Moussa', role:'Admin', sang:'O+', avatar:'👴', ville:'Dakar', pays:'Sénégal', profession:'Retraité', telephone:'+221 77 000 00 00', maladie:'Aucune', allergie:'Aucune', estAdmin:true, estCoAdmin:false },
  { id:2, nom:'Fatoumata Diallo', prenom:'Fatoumata', role:'Membre', sang:'A+', avatar:'👵', ville:'Dakar', pays:'Sénégal', profession:'Ménagère', telephone:'+221 77 000 00 01', maladie:'Diabète', allergie:'Aucune', estAdmin:false, estCoAdmin:false },
  { id:3, nom:'Ibrahim Diallo', prenom:'Ibrahim', role:'Membre', sang:'B+', avatar:'👨', ville:'Paris', pays:'France', profession:'Ingénieur', telephone:'+33 6 00 00 00 00', maladie:'Aucune', allergie:'Pénicilline', estAdmin:false, estCoAdmin:true },
  { id:4, nom:'Aminata Diallo', prenom:'Aminata', role:'Membre', sang:'AB+', avatar:'👩', ville:'New York', pays:'USA', profession:'Médecin', telephone:'+1 000 000 0000', maladie:'Aucune', allergie:'Aucune', estAdmin:false, estCoAdmin:false },
  { id:5, nom:'Ousmane Diallo', prenom:'Ousmane', role:'Invité', sang:'O+', avatar:'🧒', ville:'Conakry', pays:'Guinée', profession:'Étudiant', telephone:'+224 00 00 00 00', maladie:'Drépanocytose', allergie:'Aucune', estAdmin:false, estCoAdmin:false },
];

const charger = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return membresInitiaux;
};

const emojis = ['👴','👵','👨','👩','🧒','👧','👦','👤','🧑','👱'];

export default function Membres() {
  const [membres, setMembres] = useState(charger);
  const [recherche, setRecherche] = useState('');
  const [membreSelectionne, setMembreSelectionne] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [showTransfert, setShowTransfert] = useState(false);
  const [showCoAdmin, setShowCoAdmin] = useState(false);
  const [confirmTransfert, setConfirmTransfert] = useState(null);
  const [nouveau, setNouveau] = useState({
    nom:'', prenom:'', role:'Membre', sang:'Inconnu', avatar:'👤',
    ville:'', pays:'', profession:'', telephone:'', maladie:'Aucune', allergie:'Aucune'
  });

  useEffect(()=>{ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(membres)); } catch(e){} }, [membres]);

  const admin = membres.find(m => m.estAdmin);
  const coAdmins = membres.filter(m => m.estCoAdmin);
  const membresFiltres = membres.filter(m =>
    m.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    m.ville.toLowerCase().includes(recherche.toLowerCase()) ||
    m.pays.toLowerCase().includes(recherche.toLowerCase())
  );

  const ajouterMembre = () => {
    if (!nouveau.nom) return;
    setMembres([...membres, { ...nouveau, id: Date.now(), estAdmin:false, estCoAdmin:false }]);
    setShowForm(false);
    setNouveau({ nom:'', prenom:'', role:'Membre', sang:'Inconnu', avatar:'👤', ville:'', pays:'', profession:'', telephone:'', maladie:'Aucune', allergie:'Aucune' });
  };

  const supprimerMembre = (id) => {
    const m = membres.find(x => x.id === id);
    if (m?.estAdmin) { alert('Impossible de supprimer l\'Admin ! Transférez d\'abord le rôle.'); return; }
    setMembres(membres.filter(m => m.id !== id));
    setShowConfirm(null);
    setMembreSelectionne(null);
  };

  const transfererAdmin = (id) => {
    setMembres(membres.map(m => ({
      ...m,
      estAdmin: m.id === id,
      role: m.id === id ? 'Admin' : (m.estAdmin ? 'Membre' : m.role)
    })));
    setShowTransfert(false);
    setConfirmTransfert(null);
    setMembreSelectionne(null);
    alert('👑 Le rôle d\'Admin a été transféré avec succès !');
  };

  const toggleCoAdmin = (id) => {
    const m = membres.find(x => x.id === id);
    if (m?.estAdmin) { alert('L\'Admin principal ne peut pas être Co-Admin.'); return; }
    const nbCoAdmins = membres.filter(x => x.estCoAdmin).length;
    if (!m?.estCoAdmin && nbCoAdmins >= 2) { alert('Maximum 2 Co-Admins autorisés.'); return; }
    setMembres(membres.map(x => x.id === id ? { ...x, estCoAdmin: !x.estCoAdmin } : x));
    setShowCoAdmin(false);
  };

  const getBadgeRole = (m) => {
    if (m.estAdmin) return { label: '👑 Admin', cls: 'admin' };
    if (m.estCoAdmin) return { label: '🤝 Co-Admin', cls: 'coadmin' };
    if (m.role === 'Invité') return { label: '👤 Invité', cls: 'invité' };
    return { label: '👥 Membre', cls: 'membre' };
  };

  return (
    <div className="membres-page">

      {/* BANDEAU ADMIN */}
      <div style={{background:'linear-gradient(135deg,#1B4332,#2D6A4F)', borderRadius:'14px', padding:'1rem 1.4rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap'}}>
        <div style={{flex:1}}>
          <div style={{display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.3rem'}}>
            <span style={{fontSize:'1.3rem'}}>👑</span>
            <span style={{color:'white', fontWeight:'700', fontSize:'.95rem'}}>Admin : {admin?.nom || 'Non défini'}</span>
          </div>
          {coAdmins.length > 0 && (
            <div style={{display:'flex', alignItems:'center', gap:'.4rem'}}>
              <span style={{fontSize:'1rem'}}>🤝</span>
              <span style={{color:'#AECFBE', fontSize:'.82rem'}}>Co-Admin{coAdmins.length > 1 ? 's' : ''} : {coAdmins.map(c=>c.nom).join(', ')}</span>
            </div>
          )}
        </div>
        <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap'}}>
          <button onClick={()=>setShowTransfert(true)} style={{background:'rgba(255,255,255,.15)', border:'2px solid rgba(255,255,255,.3)', color:'white', padding:'.45rem .9rem', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>
            👑 Transférer Admin
          </button>
          <button onClick={()=>setShowCoAdmin(true)} style={{background:'rgba(255,255,255,.1)', border:'2px solid rgba(255,255,255,.2)', color:'white', padding:'.45rem .9rem', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>
            🤝 Gérer Co-Admins
          </button>
        </div>
      </div>

      <div className="membres-toolbar">
        <div className="recherche-box">
          <span>🔍</span>
          <input type="text" placeholder="Rechercher un membre..." value={recherche} onChange={e=>setRecherche(e.target.value)}/>
        </div>
        <div className="toolbar-stats">
          <span>👥 {membres.length} membres</span>
          <span>🌍 {[...new Set(membres.map(m=>m.pays))].length} pays</span>
        </div>
        <button className="btn-nouveau" onClick={()=>setShowForm(true)}>+ Nouveau membre</button>
      </div>

      <div className="membres-layout">
        <div className="membres-liste">
          {membresFiltres.map(m=>{
            const badge = getBadgeRole(m);
            return (
              <div key={m.id} className={`membre-item ${membreSelectionne?.id===m.id?'actif':''}`} onClick={()=>setMembreSelectionne(m)}>
                <div className="membre-item-avatar">{m.avatar}</div>
                <div className="membre-item-info">
                  <h4>{m.nom} {m.estAdmin && '👑'} {m.estCoAdmin && '🤝'}</h4>
                  <p>{m.profession} — {m.ville}, {m.pays}</p>
                </div>
                <div className="membre-item-badges">
                  <span className={`badge-role ${badge.cls}`}>{badge.label}</span>
                  <span className="badge-sang">{m.sang}</span>
                  {m.maladie!=='Aucune'&&<span className="badge-alert">⚠️</span>}
                </div>
              </div>
            );
          })}
          {membresFiltres.length===0&&<div className="no-results"><p>😔 Aucun membre trouvé</p></div>}
        </div>

        {membreSelectionne ? (
          <div className="membre-profil">
            <div className="profil-header">
              <div className="profil-avatar">{membreSelectionne.avatar}</div>
              <div>
                <h2>{membreSelectionne.nom}</h2>
                <p>{membreSelectionne.profession}</p>
                <span className={`badge-role ${getBadgeRole(membreSelectionne).cls}`}>{getBadgeRole(membreSelectionne).label}</span>
              </div>
              {!membreSelectionne.estAdmin && (
                <button className="btn-supprimer" onClick={()=>setShowConfirm(membreSelectionne.id)}>🗑️ Supprimer</button>
              )}
            </div>

            {/* ACTIONS ADMIN */}
            <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1rem', padding:'0.8rem', background:'#F8FAFC', borderRadius:'10px'}}>
              <button onClick={()=>{ setConfirmTransfert(membreSelectionne); setShowTransfert(false); }}
                style={{background:'#FFF8E1', border:'2px solid #FFD54F', color:'#B7791F', padding:'.45rem .9rem', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>
                👑 Nommer Admin
              </button>
              <button onClick={()=>toggleCoAdmin(membreSelectionne.id)}
                style={{background: membreSelectionne.estCoAdmin?'#FEF2F2':'#F0FDF4', border:`2px solid ${membreSelectionne.estCoAdmin?'#EF5350':'#2D6A4F'}`, color: membreSelectionne.estCoAdmin?'#EF5350':'#2D6A4F', padding:'.45rem .9rem', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>
                {membreSelectionne.estCoAdmin ? '❌ Retirer Co-Admin' : '🤝 Nommer Co-Admin'}
              </button>
            </div>

            <div className="profil-infos">
              <div className="info-section">
                <h3>📋 Informations personnelles</h3>
                <div className="info-grid">
                  <div className="info-item"><span className="info-label">🌍 Ville</span><span className="info-value">{membreSelectionne.ville}</span></div>
                  <div className="info-item"><span className="info-label">🏳️ Pays</span><span className="info-value">{membreSelectionne.pays}</span></div>
                  <div className="info-item"><span className="info-label">💼 Profession</span><span className="info-value">{membreSelectionne.profession}</span></div>
                  <div className="info-item"><span className="info-label">📱 Téléphone</span><span className="info-value">{membreSelectionne.telephone}</span></div>
                </div>
              </div>
              <div className="info-section sante-section">
                <h3>🩺 Données de santé</h3>
                <div className="info-grid">
                  <div className="info-item"><span className="info-label">🩸 Groupe sanguin</span><span className="info-value sang">{membreSelectionne.sang}</span></div>
                  <div className="info-item"><span className="info-label">🧬 Maladie héréditaire</span><span className={`info-value ${membreSelectionne.maladie!=='Aucune'?'warning':''}`}>{membreSelectionne.maladie}</span></div>
                  <div className="info-item"><span className="info-label">💊 Allergie</span><span className={`info-value ${membreSelectionne.allergie!=='Aucune'?'warning':''}`}>{membreSelectionne.allergie}</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="membre-profil vide">
            <div className="vide-content"><span>👆</span><p>Clique sur un membre pour voir son profil</p></div>
          </div>
        )}
      </div>

      {/* MODAL TRANSFERT ADMIN */}
      {showTransfert && (
        <div className="form-overlay" onClick={()=>setShowTransfert(false)}>
          <div className="form-modal" onClick={e=>e.stopPropagation()}>
            <h3>👑 Transférer le rôle d'Admin</h3>
            <p style={{color:'#888', fontSize:'.88rem', marginBottom:'1rem'}}>⚠️ Cette action est importante. L'Admin actuel deviendra Membre. Choisissez avec soin.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'.5rem', maxHeight:'300px', overflowY:'auto'}}>
              {membres.filter(m=>!m.estAdmin).map(m=>(
                <div key={m.id} style={{display:'flex', alignItems:'center', gap:'.8rem', padding:'.8rem', background:'#F8FAFC', borderRadius:'10px', cursor:'pointer', border:'2px solid transparent'}}
                  onClick={()=>setConfirmTransfert(m)}
                  onMouseOver={e=>e.currentTarget.style.borderColor='#2D6A4F'}
                  onMouseOut={e=>e.currentTarget.style.borderColor='transparent'}>
                  <span style={{fontSize:'1.5rem'}}>{m.avatar}</span>
                  <div>
                    <div style={{fontWeight:'700', fontSize:'.9rem'}}>{m.nom}</div>
                    <div style={{fontSize:'.78rem', color:'#888'}}>{m.profession} · {m.ville}</div>
                  </div>
                  {m.estCoAdmin && <span style={{marginLeft:'auto', background:'#dcfce7', color:'#2D6A4F', padding:'2px 8px', borderRadius:'8px', fontSize:'.75rem', fontWeight:'600'}}>Co-Admin</span>}
                </div>
              ))}
            </div>
            <button className="btn-annuler" style={{width:'100%', marginTop:'1rem'}} onClick={()=>setShowTransfert(false)}>Annuler</button>
          </div>
        </div>
      )}

      {/* CONFIRMATION TRANSFERT */}
      {confirmTransfert && (
        <div className="form-overlay" onClick={()=>setConfirmTransfert(null)}>
          <div className="confirm-modal" onClick={e=>e.stopPropagation()}>
            <span style={{fontSize:'2.5rem'}}>👑</span>
            <h3>Confirmer le transfert ?</h3>
            <p><strong>{confirmTransfert.nom}</strong> deviendra le nouvel Admin de la famille.</p>
            <p style={{color:'#888', fontSize:'.85rem'}}>L'Admin actuel ({admin?.nom}) deviendra Membre.</p>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={()=>setConfirmTransfert(null)}>Annuler</button>
              <button className="btn-confirmer" onClick={()=>transfererAdmin(confirmTransfert.id)}>✅ Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CO-ADMINS */}
      {showCoAdmin && (
        <div className="form-overlay" onClick={()=>setShowCoAdmin(false)}>
          <div className="form-modal" onClick={e=>e.stopPropagation()}>
            <h3>🤝 Gérer les Co-Admins</h3>
            <p style={{color:'#888', fontSize:'.88rem', marginBottom:'1rem'}}>Maximum 2 Co-Admins. Ils peuvent gérer la famille en cas d'absence de l'Admin.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'.5rem', maxHeight:'300px', overflowY:'auto'}}>
              {membres.filter(m=>!m.estAdmin).map(m=>(
                <div key={m.id} style={{display:'flex', alignItems:'center', gap:'.8rem', padding:'.8rem', background: m.estCoAdmin?'#F0FDF4':'#F8FAFC', borderRadius:'10px', border:`2px solid ${m.estCoAdmin?'#2D6A4F':'transparent'}`}}>
                  <span style={{fontSize:'1.5rem'}}>{m.avatar}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'700', fontSize:'.9rem'}}>{m.nom}</div>
                    <div style={{fontSize:'.78rem', color:'#888'}}>{m.profession} · {m.ville}</div>
                  </div>
                  <button onClick={()=>toggleCoAdmin(m.id)} style={{
                    background: m.estCoAdmin?'#EF5350':'#2D6A4F', color:'white',
                    border:'none', padding:'.4rem .8rem', borderRadius:'8px',
                    cursor:'pointer', fontWeight:'600', fontSize:'.78rem'
                  }}>
                    {m.estCoAdmin ? '❌ Retirer' : '✅ Nommer'}
                  </button>
                </div>
              ))}
            </div>
            <button className="btn-annuler" style={{width:'100%', marginTop:'1rem'}} onClick={()=>setShowCoAdmin(false)}>Fermer</button>
          </div>
        </div>
      )}

      {/* FORM AJOUT */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>👤 Ajouter un membre</h3>
            <div className="emoji-picker">
              {emojis.map(e=>(
                <button key={e} className={nouveau.avatar===e?'emoji-btn actif':'emoji-btn'} onClick={()=>setNouveau({...nouveau,avatar:e})}>{e}</button>
              ))}
            </div>
            <div className="form-row">
              <div className="form-group"><label>Prénom *</label>
                <input type="text" placeholder="Moussa" value={nouveau.prenom} onChange={e=>setNouveau({...nouveau,prenom:e.target.value,nom:e.target.value+' Diallo'})}/>
              </div>
              <div className="form-group"><label>Nom complet *</label>
                <input type="text" placeholder="Moussa Diallo" value={nouveau.nom} onChange={e=>setNouveau({...nouveau,nom:e.target.value})}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Ville</label>
                <input type="text" placeholder="Dakar" value={nouveau.ville} onChange={e=>setNouveau({...nouveau,ville:e.target.value})}/>
              </div>
              <div className="form-group"><label>Pays</label>
                <input type="text" placeholder="Sénégal" value={nouveau.pays} onChange={e=>setNouveau({...nouveau,pays:e.target.value})}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Profession</label>
                <input type="text" placeholder="Étudiant" value={nouveau.profession} onChange={e=>setNouveau({...nouveau,profession:e.target.value})}/>
              </div>
              <div className="form-group"><label>Téléphone</label>
                <input type="text" placeholder="+221 77 000 00 00" value={nouveau.telephone} onChange={e=>setNouveau({...nouveau,telephone:e.target.value})}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Rôle</label>
                <select value={nouveau.role} onChange={e=>setNouveau({...nouveau,role:e.target.value})}>
                  <option>Membre</option><option>Invité</option>
                </select>
              </div>
              <div className="form-group"><label>Groupe sanguin</label>
                <select value={nouveau.sang} onChange={e=>setNouveau({...nouveau,sang:e.target.value})}>
                  <option value="Inconnu">❓ Inconnu</option>
                  <option>O+</option><option>O-</option>
                  <option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Maladie héréditaire</label>
                <input type="text" placeholder="Aucune" value={nouveau.maladie} onChange={e=>setNouveau({...nouveau,maladie:e.target.value})}/>
              </div>
              <div className="form-group"><label>Allergie</label>
                <input type="text" placeholder="Aucune" value={nouveau.allergie} onChange={e=>setNouveau({...nouveau,allergie:e.target.value})}/>
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={()=>setShowForm(false)}>Annuler</button>
              <button className="btn-confirmer" onClick={ajouterMembre} disabled={!nouveau.nom}>Ajouter le membre</button>
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
              <button className="btn-annuler" onClick={()=>setShowConfirm(null)}>Annuler</button>
              <button className="btn-supprimer-confirm" onClick={()=>supprimerMembre(showConfirm)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}