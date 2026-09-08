import React, { useState, useEffect } from 'react';
import './Membres.css';
import { supabase } from './supabaseClient';

// avatar/sang/maladie/allergie n'ont toujours pas de colonne réelle sur membres.
// role/estAdmin/estCoAdmin en revanche viennent maintenant de profils.role
// (via profils.membre_id) quand le membre a un compte lié.
const EXTRAS_KEY = 'yekeni_membres_extras';

const chargerExtras = () => {
  try {
    const saved = localStorage.getItem(EXTRAS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {};
};

const sauvegarderExtras = (extras) => {
  try { localStorage.setItem(EXTRAS_KEY, JSON.stringify(extras)); } catch (e) {}
};

const extrasParDefaut = (role = 'Membre') => ({
  avatar: '👤',
  sang: 'Inconnu',
  maladie: 'Aucune',
  allergie: 'Aucune',
  role,
});

// role_type Supabase : admin, moderateur, membre, invite
const roleVersLabel = { admin: 'Admin', moderateur: 'Co-Admin', membre: 'Membre', invite: 'Invité' };

// Fusionne les lignes réelles de Supabase avec les extras locaux et les profils liés
const fusionnerAvecExtras = (rows, extras, profilsParMembre) => rows.map(r => {
  const profil = profilsParMembre[r.id];
  return {
    id: r.id,
    nom: r.nom,
    prenom: r.prenom,
    genre: r.genre,
    date_naissance: r.date_naissance,
    ville: r.ville || '',
    pays: r.pays || '',
    profession: r.profession || '',
    telephone: r.telephone || '',
    telephoneVisible: r.telephone_visible !== false,
    santeVisible: r.sante_visible !== false,
    ...extrasParDefaut(),
    ...(extras[r.id] || {}),
    profilId: profil?.id || null,
    profilRole: profil?.role || null,
    estAdmin: profil?.role === 'admin',
    estCoAdmin: profil?.role === 'moderateur',
  };
});

const emojis = ['👴','👵','👨','👩','🧒','👧','👦','👤','🧑','👱'];

export default function Membres() {
  const [membres, setMembres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [membreSelectionne, setMembreSelectionne] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [showTransfert, setShowTransfert] = useState(false);
  const [showCoAdmin, setShowCoAdmin] = useState(false);
  const [confirmTransfert, setConfirmTransfert] = useState(null);
  const [nouveau, setNouveau] = useState({
    nom: '', prenom: '', genre: 'homme', date_naissance: '',
    role: 'Membre', sang: 'Inconnu', avatar: '👤',
    ville: '', pays: '', profession: '', telephone: '', maladie: 'Aucune', allergie: 'Aucune',
  });
  const GENRES = ['homme', 'femme', 'autre'];
  const [familleCode, setFamilleCode] = useState(null);
  const [familleId, setFamilleId] = useState(null);
  const [monRole, setMonRole] = useState(null);
  const [monUserId, setMonUserId] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [copie, setCopie] = useState(false);

  const admin = membres.find(m => m.estAdmin);
  const coAdmins = membres.filter(m => m.estCoAdmin);
  const membresFiltres = membres.filter(m =>
    m.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    m.ville.toLowerCase().includes(recherche.toLowerCase()) ||
    m.pays.toLowerCase().includes(recherche.toLowerCase())
  );

  const chargerMembres = async (fid) => {
    if (!fid) { setChargement(false); return; }

    const [{ data: membresData, error: errM }, { data: profilsData, error: errP }] = await Promise.all([
      supabase.from('membres').select('*').eq('famille_id', fid).order('nom', { ascending: true }),
      supabase.from('profils').select('id, membre_id, role').eq('famille_id', fid),
    ]);

    if (errM) { console.error('Erreur chargement membres :', errM); setChargement(false); return; }
    if (errP) { console.error('Erreur chargement profils :', errP); }

    const profilsParMembre = {};
    (profilsData || []).forEach(p => { if (p.membre_id) profilsParMembre[p.membre_id] = p; });

    const extras = chargerExtras();
    setMembres(fusionnerAvecExtras(membresData || [], extras, profilsParMembre));
    setChargement(false);
  };

  useEffect(() => {
    async function chargerFamille() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }
      setMonUserId(user.id);

      const { data: profil, error: err1 } = await supabase
        .from('profils')
        .select('role, famille_id')
        .eq('id', user.id)
        .single();

      if (err1) { console.error('Erreur profil :', err1); setChargement(false); return; }
      if (!profil) { setChargement(false); return; }

      setMonRole(profil.role);
      setFamilleId(profil.famille_id);

      if (profil.famille_id) {
        const { data: famille, error: err2 } = await supabase
          .from('familles')
          .select('code_invitation')
          .eq('id', profil.famille_id)
          .single();
        if (err2) { console.error('Erreur famille :', err2); }
        else if (famille) setFamilleCode(famille.code_invitation);

        await chargerMembres(profil.famille_id);
      } else {
        setChargement(false);
      }
    }
    chargerFamille();
  }, []);

  const ajouterMembre = async () => {
    if (!nouveau.nom || !familleId) return;

    const { data, error } = await supabase
      .from('membres')
      .insert({
        prenom: nouveau.prenom,
        nom: nouveau.nom,
        genre: nouveau.genre,
        date_naissance: nouveau.date_naissance || null,
        ville: nouveau.ville,
        pays: nouveau.pays,
        profession: nouveau.profession,
        telephone: nouveau.telephone,
        famille_id: familleId,
      })
      .select()
      .single();

    if (error) {
      alert("Erreur lors de l'ajout du membre : " + error.message);
      return;
    }

    const extras = chargerExtras();
    extras[data.id] = {
      avatar: nouveau.avatar,
      sang: nouveau.sang,
      maladie: nouveau.maladie,
      allergie: nouveau.allergie,
      role: nouveau.role,
    };
    sauvegarderExtras(extras);

    await chargerMembres(familleId);
    setShowForm(false);
    setNouveau({
      nom: '', prenom: '', genre: 'homme', date_naissance: '',
      role: 'Membre', sang: 'Inconnu', avatar: '👤',
      ville: '', pays: '', profession: '', telephone: '', maladie: 'Aucune', allergie: 'Aucune',
    });
  };

  const supprimerMembre = async (id) => {
    const m = membres.find(x => x.id === id);
    if (m?.estAdmin) { alert('Impossible de supprimer l\'Admin ! Transférez d\'abord le rôle.'); return; }

    const { error } = await supabase.from('membres').delete().eq('id', id);
    if (error) { alert('Erreur lors de la suppression : ' + error.message); return; }

    const extras = chargerExtras();
    delete extras[id];
    sauvegarderExtras(extras);

    await chargerMembres(familleId);
    setShowConfirm(null);
    setMembreSelectionne(null);
  };

  // Relie le compte connecté à une fiche membre de l'arbre (nécessaire pour pouvoir
  // recevoir un rôle Admin/Co-Admin, qui vit sur profils, pas sur membres)
  const relierMonCompte = async (membreId) => {
    if (!monUserId) return;
    const { error } = await supabase.from('profils').update({ membre_id: membreId }).eq('id', monUserId);
    if (error) { alert('Erreur : ' + error.message); return; }
    await chargerMembres(familleId);
    alert('✅ Ton compte est maintenant relié à cette fiche !');
  };

  // Seule la personne propriétaire de sa fiche peut changer sa propre visibilité
  const toggleVisibilite = async (membreId, champ, valeurActuelle) => {
    const { error } = await supabase.from('membres').update({ [champ]: !valeurActuelle }).eq('id', membreId);
    if (error) { alert('Erreur : ' + error.message); return; }
    await chargerMembres(familleId);
  };

  const transfererAdmin = async (id) => {
    const cible = membres.find(m => m.id === id);
    if (!cible?.profilId) { alert("Ce membre n'a pas encore de compte lié — il/elle doit d'abord se connecter et utiliser \"🔗 C'est moi\"."); return; }

    if (admin?.profilId) {
      const { error: errDemote } = await supabase.from('profils').update({ role: 'membre' }).eq('id', admin.profilId);
      if (errDemote) { alert('Erreur : ' + errDemote.message); return; }
    }
    const { error: errPromote } = await supabase.from('profils').update({ role: 'admin' }).eq('id', cible.profilId);
    if (errPromote) { alert('Erreur : ' + errPromote.message); return; }

    await chargerMembres(familleId);
    setShowTransfert(false);
    setConfirmTransfert(null);
    setMembreSelectionne(null);
    alert('👑 Le rôle d\'Admin a été transféré avec succès !');
  };

  const toggleCoAdmin = async (id) => {
    const m = membres.find(x => x.id === id);
    if (m?.estAdmin) { alert('L\'Admin principal ne peut pas être Co-Admin.'); return; }
    if (!m?.profilId) { alert("Ce membre n'a pas encore de compte lié — il/elle doit d'abord se connecter et utiliser \"🔗 C'est moi\"."); return; }
    const nbCoAdmins = membres.filter(x => x.estCoAdmin).length;
    if (!m?.estCoAdmin && nbCoAdmins >= 2) { alert('Maximum 2 Co-Admins autorisés.'); return; }

    const nouveauRole = m.estCoAdmin ? 'membre' : 'moderateur';
    const { error } = await supabase.from('profils').update({ role: nouveauRole }).eq('id', m.profilId);
    if (error) { alert('Erreur : ' + error.message); return; }

    await chargerMembres(familleId);
    setShowCoAdmin(false);
  };

  const getBadgeRole = (m) => {
    if (m.estAdmin) return { label: '👑 Admin', cls: 'admin' };
    if (m.estCoAdmin) return { label: '🤝 Co-Admin', cls: 'coadmin' };
    const label = m.profilRole ? roleVersLabel[m.profilRole] : m.role;
    if (label === 'Invité') return { label: '👤 Invité', cls: 'invité' };
    return { label: '👥 Membre', cls: 'membre' };
  };

  if (chargement) {
    return (
      <div className="membres-page">
        <div className="no-results"><p>⏳ Chargement des membres...</p></div>
      </div>
    );
  }

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
       {(monRole === 'admin' || monRole === 'moderateur') && (
  <button className="btn-nouveau" style={{background:'#E08E45'}} onClick={()=>setShowInvite(true)}>🔗 Inviter un membre</button>
)}
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

            {membreSelectionne.profilId === monUserId && (
              <div style={{background:'#F0FDF4', border:'2px solid #2D6A4F', borderRadius:'10px', padding:'.8rem', marginBottom:'1rem'}}>
                <p style={{fontSize:'.82rem', fontWeight:'700', color:'#1B4332', marginBottom:'.5rem'}}>🔒 Visibilité de mes infos pour le reste de la famille</p>
                <div style={{display:'flex', gap:'1.2rem', flexWrap:'wrap'}}>
                  <label style={{display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.82rem', cursor:'pointer'}}>
                    <input type="checkbox" checked={membreSelectionne.telephoneVisible} onChange={()=>toggleVisibilite(membreSelectionne.id, 'telephone_visible', membreSelectionne.telephoneVisible)}/>
                    📱 Téléphone visible
                  </label>
                  <label style={{display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.82rem', cursor:'pointer'}}>
                    <input type="checkbox" checked={membreSelectionne.santeVisible} onChange={()=>toggleVisibilite(membreSelectionne.id, 'sante_visible', membreSelectionne.santeVisible)}/>
                    🩺 Données santé visibles
                  </label>
                </div>
                <p style={{fontSize:'.75rem', color:'#888', marginTop:'.4rem', marginBottom:0}}>L'Admin peut toujours tout voir, même masqué (utile en urgence).</p>
              </div>
            )}

            {!membreSelectionne.profilId && (
              <div style={{background:'#FFF8E1', border:'2px solid #FFD54F', borderRadius:'10px', padding:'.8rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'.8rem', flexWrap:'wrap'}}>
                <span style={{fontSize:'.85rem', color:'#795548', flex:1}}>Aucun compte relié à cette fiche — les rôles Admin/Co-Admin ne sont possibles qu'avec un compte.</span>
                <button onClick={()=>relierMonCompte(membreSelectionne.id)} style={{background:'#2D6A4F', color:'white', border:'none', padding:'.4rem .9rem', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'.8rem'}}>
                  🔗 C'est moi
                </button>
              </div>
            )}

            {/* ACTIONS ADMIN */}
            <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1rem', padding:'0.8rem', background:'#F8FAFC', borderRadius:'10px'}}>
              <button onClick={()=>{ setConfirmTransfert(membreSelectionne); setShowTransfert(false); }}
                disabled={!membreSelectionne.profilId}
                style={{background:'#FFF8E1', border:'2px solid #FFD54F', color:'#B7791F', padding:'.45rem .9rem', borderRadius:'9px', cursor: membreSelectionne.profilId?'pointer':'not-allowed', fontWeight:'600', fontSize:'.82rem', opacity: membreSelectionne.profilId?1:0.5}}>
                👑 Nommer Admin
              </button>
              <button onClick={()=>toggleCoAdmin(membreSelectionne.id)}
                disabled={!membreSelectionne.profilId}
                style={{background: membreSelectionne.estCoAdmin?'#FEF2F2':'#F0FDF4', border:`2px solid ${membreSelectionne.estCoAdmin?'#EF5350':'#2D6A4F'}`, color: membreSelectionne.estCoAdmin?'#EF5350':'#2D6A4F', padding:'.45rem .9rem', borderRadius:'9px', cursor: membreSelectionne.profilId?'pointer':'not-allowed', fontWeight:'600', fontSize:'.82rem', opacity: membreSelectionne.profilId?1:0.5}}>
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
                  <div className="info-item">
                    <span className="info-label">📱 Téléphone</span>
                    <span className="info-value">
                      {(membreSelectionne.telephoneVisible || monRole === 'admin' || membreSelectionne.profilId === monUserId)
                        ? membreSelectionne.telephone
                        : '🔒 Masqué'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="info-section sante-section">
                <h3>🩺 Données de santé</h3>
                {(membreSelectionne.santeVisible || monRole === 'admin' || membreSelectionne.profilId === monUserId) ? (
                  <div className="info-grid">
                    <div className="info-item"><span className="info-label">🩸 Groupe sanguin</span><span className="info-value sang">{membreSelectionne.sang}</span></div>
                    <div className="info-item"><span className="info-label">🧬 Maladie héréditaire</span><span className={`info-value ${membreSelectionne.maladie!=='Aucune'?'warning':''}`}>{membreSelectionne.maladie}</span></div>
                    <div className="info-item"><span className="info-label">💊 Allergie</span><span className={`info-value ${membreSelectionne.allergie!=='Aucune'?'warning':''}`}>{membreSelectionne.allergie}</span></div>
                  </div>
                ) : (
                  <p style={{color:'#888', fontSize:'.85rem'}}>🔒 Ces données ont été masquées par ce membre.</p>
                )}
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
            <p style={{color:'#888', fontSize:'.88rem', marginBottom:'1rem'}}>⚠️ Cette action est importante. L'Admin actuel deviendra Membre. Seuls les membres avec un compte lié peuvent devenir Admin.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'.5rem', maxHeight:'300px', overflowY:'auto'}}>
              {membres.filter(m=>!m.estAdmin).map(m=>(
                <div key={m.id} style={{display:'flex', alignItems:'center', gap:'.8rem', padding:'.8rem', background:'#F8FAFC', borderRadius:'10px', cursor: m.profilId?'pointer':'not-allowed', border:'2px solid transparent', opacity: m.profilId?1:0.5}}
                  onClick={()=>{ if (m.profilId) setConfirmTransfert(m); }}
                  onMouseOver={e=>{ if(m.profilId) e.currentTarget.style.borderColor='#2D6A4F'; }}
                  onMouseOut={e=>e.currentTarget.style.borderColor='transparent'}>
                  <span style={{fontSize:'1.5rem'}}>{m.avatar}</span>
                  <div>
                    <div style={{fontWeight:'700', fontSize:'.9rem'}}>{m.nom}</div>
                    <div style={{fontSize:'.78rem', color:'#888'}}>{m.profilId ? `${m.profession} · ${m.ville}` : 'Aucun compte lié'}</div>
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
            <p style={{color:'#888', fontSize:'.88rem', marginBottom:'1rem'}}>Maximum 2 Co-Admins. Seuls les membres avec un compte lié peuvent être nommés.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'.5rem', maxHeight:'300px', overflowY:'auto'}}>
              {membres.filter(m=>!m.estAdmin).map(m=>(
                <div key={m.id} style={{display:'flex', alignItems:'center', gap:'.8rem', padding:'.8rem', background: m.estCoAdmin?'#F0FDF4':'#F8FAFC', borderRadius:'10px', border:`2px solid ${m.estCoAdmin?'#2D6A4F':'transparent'}`, opacity: m.profilId?1:0.5}}>
                  <span style={{fontSize:'1.5rem'}}>{m.avatar}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'700', fontSize:'.9rem'}}>{m.nom}</div>
                    <div style={{fontSize:'.78rem', color:'#888'}}>{m.profilId ? `${m.profession} · ${m.ville}` : 'Aucun compte lié'}</div>
                  </div>
                  <button onClick={()=>toggleCoAdmin(m.id)} disabled={!m.profilId} style={{
                    background: m.estCoAdmin?'#EF5350':'#2D6A4F', color:'white',
                    border:'none', padding:'.4rem .8rem', borderRadius:'8px',
                    cursor: m.profilId?'pointer':'not-allowed', fontWeight:'600', fontSize:'.78rem'
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
              <div className="form-group"><label>Genre</label>
                <select value={nouveau.genre} onChange={e=>setNouveau({...nouveau,genre:e.target.value})}>
                  {GENRES.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase()+g.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Date de naissance</label>
                <input type="date" value={nouveau.date_naissance} onChange={e=>setNouveau({...nouveau,date_naissance:e.target.value})}/>
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
              <div className="form-group"><label>Rôle (avant inscription)</label>
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
      {showInvite && (
  <div className="form-overlay" onClick={()=>setShowInvite(false)}>
    <div className="confirm-modal" onClick={e=>e.stopPropagation()}>
      <span style={{fontSize:'2.5rem'}}>🔗</span>
      <h3>Inviter un membre de la famille</h3>
      <p style={{color:'#888', fontSize:'.85rem'}}>Partage ce code — il permet de rejoindre directement ta famille à l'inscription.</p>
      <div style={{
        background:'#F0FDF4', border:'2px dashed #2D6A4F', borderRadius:'10px',
        padding:'1rem', fontSize:'1.4rem', fontWeight:'700', letterSpacing:'2px',
        color:'#1B4332', margin:'1rem 0'
      }}>
        {familleCode || 'Chargement...'}
      </div>
      <div className="form-buttons">
        <button className="btn-annuler" onClick={()=>setShowInvite(false)}>Fermer</button>
        <button className="btn-confirmer" onClick={()=>{
          navigator.clipboard.writeText(familleCode);
          setCopie(true);
          setTimeout(()=>setCopie(false), 2000);
        }}>
          {copie ? '✅ Copié !' : '📋 Copier le code'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}