import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './Dashboard.css';
import Notifications from './Notifications';
import Racines from './Racines';
import Membres from './Membres';
import Sante from './Sante';
import Memoire from './Memoire';
import Chat from './Chat';
import Carte from './Carte';
import ArbreAnime from './ArbreAnime';
import Statistiques from './Statistiques';

function NotifBadge2({ onClick, count }) {
  return (
    <button onClick={onClick} style={{
      position:'relative', background:'rgba(255,255,255,.15)',
      border:'2px solid rgba(255,255,255,.25)', borderRadius:'10px',
      padding:'.4rem .7rem', cursor:'pointer', color:'white',
      fontSize:'1.1rem', display:'flex', alignItems:'center', gap:'.3rem'
    }}>
      🔔
      {count > 0 && (
        <span style={{
          position:'absolute', top:'-6px', right:'-6px',
          background:'#EF5350', color:'white', borderRadius:'50%',
          width:'18px', height:'18px', fontSize:'.7rem', fontWeight:'800',
          display:'flex', alignItems:'center', justifyContent:'center',
          border:'2px solid white'
        }}>{count > 9 ? '9+' : count}</span>
      )}
    </button>
  );
}

const joursRestants = (dateStr) => {
  const today = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d - today) / (1000*60*60*24));
};

const typesEvt = ['🎂','💒','👶','🙏','🎓','🌴','🏡','🎉','💔','🏆'];

function Dashboard({ onRetour }) {
  const [onglet, setOnglet] = useState('accueil');
  const [showNotifs, setShowNotifs] = useState(false);
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [showFormEvt, setShowFormEvt] = useState(false);
  const [fdEvt, setFdEvt] = useState({ titre:'', date:'', type:'🎂', description:'' });
  const [utilisateur, setUtilisateur] = useState(null);

  // Données depuis localStorage (inchangées pour l'instant)
  const vraisMembres = (() => { try { const s = localStorage.getItem('yekeni_membres'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
  const vraisArbre = (() => { try { const s = localStorage.getItem('yekeni_arbre'); return s ? JSON.parse(s).membres || [] : []; } catch(e) { return []; } })();
  const vraisRacines = (() => { try { const s = localStorage.getItem('yekeni_racines'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
  const pays = [...new Set(vraisMembres.map(m=>m.pays).filter(Boolean))];
  const ethnies = [...new Set(vraisRacines.map(m=>m.ethnie).filter(Boolean))];
  const langues = [...new Set(vraisRacines.flatMap(m=>m.langues||[]))];

  useEffect(() => {
    // Récupère l'utilisateur connecté
    supabase.auth.getUser().then(({ data: { user } }) => setUtilisateur(user));
    // Charge les événements depuis Supabase
    chargerEvenements();
  }, []);

  const chargerEvenements = async () => {
    setChargement(true);
    const { data, error } = await supabase
      .from('evenements')
      .select('*')
      .order('date_evenement', { ascending: true });

    if (error) {
      console.error('Erreur chargement événements:', error);
    } else {
      setEvenements(data || []);
    }
    setChargement(false);
  };

  const ajouterEvt = async () => {
    if (!fdEvt.titre || !fdEvt.date) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('evenements')
      .insert([{
        titre: fdEvt.titre,
        date_evenement: fdEvt.date,
        type: 'autre',
        description: fdEvt.description || null,
        cree_par: user?.id || null,
        statut: 'valide'
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur ajout événement:', error);
    } else {
      setEvenements(prev => [...prev, data].sort((a,b) => new Date(a.date_evenement) - new Date(b.date_evenement)));
      setShowFormEvt(false);
      setFdEvt({ titre:'', date:'', type:'🎂', description:'' });
    }
  };

  const supprimerEvt = async (id) => {
    const { error } = await supabase.from('evenements').delete().eq('id', id);
    if (!error) setEvenements(prev => prev.filter(e => e.id !== id));
  };

  // Adaptateurs pour affichage (Supabase utilise date_evenement, pas date)
  const evtTries = [...evenements];
  const evtAvenir = evtTries.filter(e => joursRestants(e.date_evenement) >= 0);
  const evtUrgents = evtAvenir.filter(e => joursRestants(e.date_evenement) <= 7);
  const nonLusNotifs = 2;

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Yëkëni" className="sidebar-logo-img"/>
          <span>Yëkëni</span>
        </div>
        <div className="sidebar-famille">
          <div className="famille-avatar">👨‍👩‍👧‍👦</div>
          <div style={{flex:1}}>
            <h4>Famille Diallo</h4>
            <p style={{fontSize:'.75rem', color:'#AECFBE'}}>{utilisateur?.email || 'Connecté'}</p>
          </div>
          <NotifBadge2 onClick={()=>setShowNotifs(true)} count={nonLusNotifs}/>
        </div>
        <nav className="sidebar-nav">
          <button className={onglet==='accueil'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('accueil')}>🏠 Accueil</button>
          <button className={onglet==='arbre'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('arbre')}>🌳 Arbre familial</button>
          <button className={onglet==='membres'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('membres')}>👥 Membres</button>
          <button className={onglet==='sante'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('sante')}>🩺 Santé familiale</button>
          <button className={onglet==='memoire'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('memoire')}>📸 Mémoire</button>
          <button className={onglet==='evenements'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('evenements')}>🎂 Événements</button>
          <button className={onglet==='chat'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('chat')}>💬 Chat familial</button>
          <button className={onglet==='carte'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('carte')}>🗺️ Carte familiale</button>
          <button className={onglet==='stats'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('stats')}>📊 Statistiques</button>
          <button className={onglet==='racines'?'nav-item actif':'nav-item'} onClick={()=>setOnglet('racines')}>🌍 Mes Racines</button>
        </nav>
        <button className="btn-deconnexion" onClick={onRetour}>← Déconnexion</button>
      </div>

      <div className="main-content">

        {onglet==='accueil' && (
          <div className="content-section">
            <div className="content-header">
              <div>
                <h1>Bonjour 👋</h1>
                <p>Bienvenue dans votre espace familial Yëkëni</p>
              </div>
              <button className="btn-inviter" onClick={()=>setOnglet('evenements')}>+ Ajouter un événement</button>
            </div>

            {evtUrgents.length > 0 && (
              <div style={{background:'#FFF8E1', border:'2px solid #FFD54F', borderRadius:'14px', padding:'1rem 1.2rem', display:'flex', gap:'.8rem', alignItems:'center', marginBottom:'.5rem'}}>
                <span style={{fontSize:'1.5rem'}}>🔔</span>
                <div>
                  <h4 style={{margin:'0 0 .2rem', color:'#F57F17', fontSize:'.95rem'}}>
                    {evtUrgents.length} événement{evtUrgents.length>1?'s':''} dans moins de 7 jours !
                  </h4>
                  <p style={{margin:0, color:'#795548', fontSize:'.82rem'}}>{evtUrgents.map(e=>e.titre).join(' · ')}</p>
                </div>
                <button onClick={()=>setOnglet('evenements')} style={{marginLeft:'auto', background:'#FF8F00', color:'white', border:'none', padding:'.4rem .9rem', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>Voir</button>
              </div>
            )}

            <div className="stats-grid">
              <div className="stat-card" onClick={()=>setOnglet('membres')} style={{cursor:'pointer'}}><span className="stat-icon">👥</span><div><h3>{vraisMembres.length}</h3><p>Membres</p></div></div>
              <div className="stat-card" onClick={()=>setOnglet('carte')} style={{cursor:'pointer'}}><span className="stat-icon">🌍</span><div><h3>{pays.length}</h3><p>Pays</p></div></div>
              <div className="stat-card" onClick={()=>setOnglet('evenements')} style={{cursor:'pointer'}}><span className="stat-icon">🎂</span><div><h3>{evtAvenir.length}</h3><p>Événements à venir</p></div></div>
              <div className="stat-card" onClick={()=>setOnglet('arbre')} style={{cursor:'pointer'}}><span className="stat-icon">🌳</span><div><h3>{vraisArbre.length}</h3><p>Dans l'arbre</p></div></div>
            </div>

            {vraisRacines.length > 0 && (
              <div className="section-block">
                <h2>🌍 Origines de la famille</h2>
                <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap', marginTop:'.5rem'}}>
                  {ethnies.map((e,i)=><span key={i} style={{background:'#dcfce7', color:'#2D6A4F', padding:'.3rem .9rem', borderRadius:'20px', fontSize:'.82rem', fontWeight:'600'}}>🌿 {e}</span>)}
                  {langues.map((l,i)=><span key={i} style={{background:'#fef3c7', color:'#d97706', padding:'.3rem .9rem', borderRadius:'20px', fontSize:'.82rem', fontWeight:'600'}}>🗣️ {l}</span>)}
                </div>
                <button onClick={()=>setOnglet('racines')} style={{marginTop:'.8rem', background:'none', border:'2px solid #2D6A4F', color:'#2D6A4F', padding:'.4rem 1rem', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>Voir toutes les racines →</button>
              </div>
            )}

            <div className="section-block">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2>🎂 Événements à venir</h2>
                <button onClick={()=>setOnglet('evenements')} style={{background:'none', border:'none', color:'#2D6A4F', cursor:'pointer', fontWeight:'600', fontSize:'.85rem'}}>Voir tout →</button>
              </div>
              {chargement ? (
                <p style={{color:'#888', fontSize:'.88rem'}}>⏳ Chargement...</p>
              ) : evtAvenir.length > 0 ? (
                <div className="evenements-list">
                  {evtAvenir.slice(0,3).map((e,i)=>{
                    const j = joursRestants(e.date_evenement);
                    return (
                      <div className="evenement-card" key={i}>
                        <span className="evt-icon">🎂</span>
                        <div className="evt-info"><h4>{e.titre}</h4><p>{new Date(e.date_evenement).toLocaleDateString('fr-FR',{day:'numeric',month:'long'})}</p></div>
                        <div className="evt-jours"><span style={{color:j<=7?'#EF5350':'#2D6A4F', fontWeight:700}}>{j===0?"Aujourd'hui 🎉":`Dans ${j}j`}</span></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{textAlign:'center', padding:'1.5rem', color:'#888'}}>
                  <p>Aucun événement à venir</p>
                  <button className="btn-inviter" onClick={()=>setOnglet('evenements')}>+ Ajouter</button>
                </div>
              )}
            </div>

            <div className="section-block">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2>👥 Membres de la famille</h2>
                <button onClick={()=>setOnglet('membres')} style={{background:'none', border:'none', color:'#2D6A4F', cursor:'pointer', fontWeight:'600', fontSize:'.85rem'}}>Voir tout →</button>
              </div>
              <div className="membres-grid">
                {vraisMembres.slice(0,5).map((m,i)=>(
                  <div className="membre-card" key={i} onClick={()=>setOnglet('membres')} style={{cursor:'pointer'}}>
                    <div className="membre-avatar">{m.avatar}</div>
                    <h4>{m.nom}</h4>
                    <p>{m.ville}</p>
                    <div className="membre-badges">
                      <span className={`badge-role ${m.role?.toLowerCase()}`}>{m.role}</span>
                      <span className="badge-sang">{m.sang}</span>
                    </div>
                  </div>
                ))}
                <div className="membre-card ajouter" onClick={()=>setOnglet('membres')}>
                  <div className="membre-avatar">➕</div>
                  <h4>Ajouter</h4>
                  <p>un membre</p>
                </div>
              </div>
            </div>

            <div className="section-block">
              <h2>⚡ Accès rapide</h2>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:'.8rem', marginTop:'.5rem'}}>
                {[
                  {icon:'🌳', label:'Arbre familial', ong:'arbre'},
                  {icon:'📸', label:'Mémoire', ong:'memoire'},
                  {icon:'🩺', label:'Santé', ong:'sante'},
                  {icon:'💬', label:'Chat', ong:'chat'},
                  {icon:'🗺️', label:'Carte', ong:'carte'},
                  {icon:'📊', label:'Statistiques', ong:'stats'},
                ].map((a,i)=>(
                  <button key={i} onClick={()=>setOnglet(a.ong)} style={{background:'white', border:'2px solid #E0E0E0', borderRadius:'14px', padding:'1rem .8rem', cursor:'pointer', textAlign:'center', transition:'all .2s', fontFamily:'inherit', display:'flex', flexDirection:'column', alignItems:'center', gap:'.4rem'}}
                    onMouseOver={e=>{e.currentTarget.style.borderColor='#2D6A4F';e.currentTarget.style.background='#f0fdf4';}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor='#E0E0E0';e.currentTarget.style.background='white';}}>
                    <span style={{fontSize:'1.8rem'}}>{a.icon}</span>
                    <span style={{fontSize:'.78rem', fontWeight:'600', color:'#555'}}>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {onglet==='arbre' && <div style={{padding:'1rem'}}><ArbreAnime/></div>}
        {onglet==='membres' && <div className="content-section"><div className="content-header"><div><h1>👥 Membres</h1><p>Gérez les membres de votre famille</p></div></div><Membres/></div>}
        {onglet==='sante' && <div className="content-section"><div className="content-header"><div><h1>🩺 Santé familiale</h1><p>Données médicales de la famille</p></div></div><Sante/></div>}
        {onglet==='memoire' && <div className="content-section"><div className="content-header"><div><h1>📸 Mémoire familiale</h1><p>Souvenirs, traditions et histoire</p></div></div><Memoire/></div>}
        {onglet==='chat' && <div style={{height:'calc(100vh - 2rem)'}}><Chat/></div>}
        {onglet==='carte' && <div className="content-section"><div className="content-header"><div><h1>🗺️ Carte familiale</h1><p>Où vivent les membres dans le monde</p></div></div><Carte/></div>}
        {onglet==='stats' && <div className="content-section"><div className="content-header"><div><h1>📊 Statistiques familiales</h1><p>Analyse complète de ta famille</p></div></div><Statistiques/></div>}
        {onglet==='racines' && <div className="content-section"><Racines/></div>}

        {onglet==='evenements' && (
          <div className="content-section">
            <div className="content-header">
              <div><h1>🎂 Événements familiaux</h1><p>Ne manque aucun moment important · ☁️ sauvegardé sur Supabase</p></div>
              <button className="btn-inviter" onClick={()=>setShowFormEvt(true)}>+ Ajouter un événement</button>
            </div>
            <div style={{display:'flex', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap'}}>
              <div className="stat-card" style={{flex:1, minWidth:'120px'}}><span className="stat-icon">🎂</span><div><h3>{evenements.length}</h3><p>Total</p></div></div>
              <div className="stat-card" style={{flex:1, minWidth:'120px'}}><span className="stat-icon">⏰</span><div><h3>{evtUrgents.length}</h3><p>Cette semaine</p></div></div>
              <div className="stat-card" style={{flex:1, minWidth:'120px'}}><span className="stat-icon">📅</span><div><h3>{evtAvenir.length}</h3><p>À venir</p></div></div>
            </div>

            {chargement ? (
              <p style={{textAlign:'center', color:'#888', padding:'2rem'}}>⏳ Chargement des événements...</p>
            ) : (
              <div className="evenements-list grand">
                {evtTries.map((e,i)=>{
                  const j = joursRestants(e.date_evenement);
                  return (
                    <div className="evenement-card grand" key={i}>
                      <span className="evt-icon">🎂</span>
                      <div className="evt-info">
                        <h4>{e.titre}</h4>
                        <p>{new Date(e.date_evenement).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
                        {e.description&&<p style={{color:'#888',fontSize:'.82rem',marginTop:'.2rem'}}>{e.description}</p>}
                      </div>
                      <div className="evt-jours">
                        <span style={{color:j<0?'#888':j<=7?'#EF5350':'#2D6A4F', fontWeight:700}}>
                          {j<0?'Passé':j===0?"Aujourd'hui 🎉":`Dans ${j}j`}
                        </span>
                      </div>
                      <button onClick={()=>supprimerEvt(e.id)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1rem', opacity:0.3, marginLeft:'.5rem'}} title="Supprimer">🗑️</button>
                    </div>
                  );
                })}
                {evenements.length===0&&(
                  <div style={{textAlign:'center', padding:'2rem', color:'#888'}}>
                    <p>Aucun événement pour l'instant</p>
                    <button className="btn-inviter" onClick={()=>setShowFormEvt(true)}>+ Ajouter le premier événement</button>
                  </div>
                )}
              </div>
            )}

            {showFormEvt && (
              <div className="ov-evt" onClick={()=>setShowFormEvt(false)}>
                <div className="mod-evt" onClick={e=>e.stopPropagation()}>
                  <button className="xbtn-evt" onClick={()=>setShowFormEvt(false)}>✕</button>
                  <h3>🎂 Ajouter un événement</h3>
                  <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1rem'}}>
                    {typesEvt.map(emoji=>(
                      <button key={emoji} onClick={()=>setFdEvt({...fdEvt,type:emoji})} style={{fontSize:'1.6rem', background:fdEvt.type===emoji?'#dcfce7':'#f0f0f0', border:fdEvt.type===emoji?'2px solid #2D6A4F':'2px solid transparent', borderRadius:'8px', padding:'.2rem', cursor:'pointer'}}>{emoji}</button>
                    ))}
                  </div>
                  <div className="fg-evt"><label>Titre *</label><input value={fdEvt.titre} onChange={e=>setFdEvt({...fdEvt,titre:e.target.value})} placeholder="ex: Anniversaire de Papa" autoFocus/></div>
                  <div className="fg-evt"><label>Date *</label><input type="date" value={fdEvt.date} onChange={e=>setFdEvt({...fdEvt,date:e.target.value})}/></div>
                  <div className="fg-evt"><label>Description</label><input value={fdEvt.description} onChange={e=>setFdEvt({...fdEvt,description:e.target.value})} placeholder="ex: Fête d'anniversaire à la maison"/></div>
                  <div style={{display:'flex', gap:'.7rem', marginTop:'1.2rem'}}>
                    <button onClick={()=>setShowFormEvt(false)} style={{flex:1, padding:'.72rem', borderRadius:'9px', border:'2px solid #e0e0e0', background:'white', cursor:'pointer', fontWeight:'600'}}>Annuler</button>
                    <button onClick={ajouterEvt} disabled={!fdEvt.titre||!fdEvt.date} style={{flex:2, padding:'.72rem', borderRadius:'9px', border:'none', background:fdEvt.titre&&fdEvt.date?'#2D6A4F':'#ccc', color:'white', cursor:'pointer', fontWeight:'700'}}>Ajouter</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {showNotifs && <Notifications onClose={()=>setShowNotifs(false)}/>}
      {showNotifs && <div onClick={()=>setShowNotifs(false)} style={{position:'fixed', inset:0, background:'rgba(0,0,0,.3)', zIndex:1999}}/>}

    </div>
  );
}

export default Dashboard;