import React, { useState } from 'react';
import './Dashboard.css';
import Racines from './Racines';
import Membres from './Membres';
import Sante from './Sante';
import Memoire from './Memoire';
import Chat from './Chat';
import Carte from './Carte';
import ArbreAnime from './ArbreAnime';
import Statistiques from './Statistiques';

const joursRestants = (dateStr) => {
  const today = new Date();
  const d = new Date(dateStr);
  const diff = Math.ceil((d - today) / (1000*60*60*24));
  return diff;
};
function Dashboard({ onRetour }) {
  const [onglet, setOnglet] = useState('accueil');

  const membres = [
    { nom: 'Moussa Diallo', role: 'Admin', sang: 'O+', avatar: '👴', ville: 'Dakar' },
    { nom: 'Fatoumata Diallo', role: 'Membre', sang: 'A+', avatar: '👵', ville: 'Dakar' },
    { nom: 'Ibrahim Diallo', role: 'Membre', sang: 'B+', avatar: '👨', ville: 'Paris' },
    { nom: 'Aminata Diallo', role: 'Membre', sang: 'AB+', avatar: '👩', ville: 'New York' },
    { nom: 'Ousmane Diallo', role: 'Invité', sang: 'O+', avatar: '🧒', ville: 'Conakry' },
  ];

  const evenements = [
    { titre: 'Anniversaire de Grand-père', date: '25 Mai', type: '🎂', jours: 3 },
    { titre: 'Mariage de Ibrahim', date: '15 Juin', type: '💒', jours: 24 },
    { titre: 'Baptême de Mariam', date: '2 Juillet', type: '👶', jours: 41 },
  ];

  const renderComp = (Comp, props = {}, name = 'Composant') => {
    if (!Comp) return <div className="comp-error">{name} introuvable</div>;
    if (typeof Comp === 'function') {
      const C = Comp;
      return <C {...props} />;
    }
    if (Comp && Comp.default && typeof Comp.default === 'function') {
      const C = Comp.default;
      return <C {...props} />;
    }
    // If we reach here, Comp is likely a module object. Provide detailed debug info.
    const type = typeof Comp;
    const ctor = Comp && Comp.constructor ? Comp.constructor.name : 'N/A';
    const keys = Comp && typeof Comp === 'object' ? Object.keys(Comp).join(', ') : '';
    const hasDefault = Comp && Comp.default ? typeof Comp.default : 'none';
    const esModule = Comp && Comp.__esModule ? 'yes' : 'no';
    console.warn(`${name} invalide:`, { Comp, type, ctor, keys, hasDefault, esModule });
    return (
      <div className="comp-error">
        {name} invalide — typeof: {type}; ctor: {ctor}; keys: {keys || '—'}; default: {hasDefault}; __esModule: {esModule}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Yëkëni" className="sidebar-logo-img"/>
          <span>Yëkëni</span>
        </div>
        <div className="sidebar-famille">
          <div className="famille-avatar">👨‍👩‍👧‍👦</div>
          <div>
            <h4>Famille Diallo</h4>
            <p>YEK-9KKUKQ</p>
          </div>
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
            {onglet==='racines' && (
      <div className="content-section">
        {renderComp(Racines, {}, 'Racines')}
      </div>
    ) }

 {onglet==='accueil' && (()=>{
  // Lire les vraies données depuis localStorage
  const vraisMembres = (() => { try { const s = localStorage.getItem('yekeni_membres'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
  const vraisEvt = (() => { try { const s = localStorage.getItem('yekeni_evenements'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
  const vraisArbre = (() => { try { const s = localStorage.getItem('yekeni_arbre'); return s ? JSON.parse(s).membres || [] : []; } catch(e) { return []; } })();
  const vraisRacines = (() => { try { const s = localStorage.getItem('yekeni_racines'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();

  const pays = [...new Set(vraisMembres.map(m=>m.pays).filter(Boolean))];
  const ethnies = [...new Set(vraisRacines.map(m=>m.ethnie).filter(Boolean))];
  const langues = [...new Set(vraisRacines.flatMap(m=>m.langues||[]))];
  const evtAvenir = vraisEvt.filter(e=>joursRestants(e.date)>=0).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const evtUrgents = vraisEvt.filter(e=>joursRestants(e.date)>=0&&joursRestants(e.date)<=7);

  return (
    <div className="content-section">
      <div className="content-header">
        <div>
          <h1>Bonjour 👋</h1>
          <p>Bienvenue dans votre espace familial Yëkëni</p>
        </div>
        <button className="btn-inviter" onClick={()=>setOnglet('evenements')}>+ Ajouter un événement</button>
      </div>

      {/* ALERTE EVENEMENTS URGENTS */}
      {evtUrgents.length > 0 && (
        <div style={{background:'#FFF8E1', border:'2px solid #FFD54F', borderRadius:'14px', padding:'1rem 1.2rem', display:'flex', gap:'.8rem', alignItems:'center', marginBottom:'.5rem'}}>
          <span style={{fontSize:'1.5rem'}}>🔔</span>
          <div>
            <h4 style={{margin:'0 0 .2rem', color:'#F57F17', fontSize:'.95rem'}}>
              {evtUrgents.length} événement{evtUrgents.length>1?'s':''} dans moins de 7 jours !
            </h4>
            <p style={{margin:0, color:'#795548', fontSize:'.82rem'}}>
              {evtUrgents.map(e=>e.titre).join(' · ')}
            </p>
          </div>
          <button onClick={()=>setOnglet('evenements')} style={{marginLeft:'auto', background:'#FF8F00', color:'white', border:'none', padding:'.4rem .9rem', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>
            Voir
          </button>
        </div>
      )}

      {/* STATS DYNAMIQUES */}
      <div className="stats-grid">
        <div className="stat-card" onClick={()=>setOnglet('membres')} style={{cursor:'pointer'}}>
          <span className="stat-icon">👥</span>
          <div>
            <h3>{vraisMembres.length}</h3>
            <p>Membres</p>
          </div>
        </div>
        <div className="stat-card" onClick={()=>setOnglet('carte')} style={{cursor:'pointer'}}>
          <span className="stat-icon">🌍</span>
          <div>
            <h3>{pays.length}</h3>
            <p>Pays</p>
          </div>
        </div>
        <div className="stat-card" onClick={()=>setOnglet('evenements')} style={{cursor:'pointer'}}>
          <span className="stat-icon">🎂</span>
          <div>
            <h3>{evtAvenir.length}</h3>
            <p>Événements à venir</p>
          </div>
        </div>
        <div className="stat-card" onClick={()=>setOnglet('arbre')} style={{cursor:'pointer'}}>
          <span className="stat-icon">🌳</span>
          <div>
            <h3>{vraisArbre.length}</h3>
            <p>Dans l'arbre</p>
          </div>
        </div>
      </div>

      {/* RACINES */}
      {vraisRacines.length > 0 && (
        <div className="section-block">
          <h2>🌍 Origines de la famille</h2>
          <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap', marginTop:'.5rem'}}>
            {ethnies.map((e,i)=>(
              <span key={i} style={{background:'#dcfce7', color:'#2D6A4F', padding:'.3rem .9rem', borderRadius:'20px', fontSize:'.82rem', fontWeight:'600'}}>🌿 {e}</span>
            ))}
            {langues.map((l,i)=>(
              <span key={i} style={{background:'#fef3c7', color:'#d97706', padding:'.3rem .9rem', borderRadius:'20px', fontSize:'.82rem', fontWeight:'600'}}>🗣️ {l}</span>
            ))}
          </div>
          <button onClick={()=>setOnglet('racines')} style={{marginTop:'.8rem', background:'none', border:'2px solid #2D6A4F', color:'#2D6A4F', padding:'.4rem 1rem', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>
            Voir toutes les racines →
          </button>
        </div>
      )}

      {/* EVENEMENTS */}
      <div className="section-block">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2>🎂 Événements à venir</h2>
          <button onClick={()=>setOnglet('evenements')} style={{background:'none', border:'none', color:'#2D6A4F', cursor:'pointer', fontWeight:'600', fontSize:'.85rem'}}>Voir tout →</button>
        </div>
        {evtAvenir.length > 0 ? (
          <div className="evenements-list">
            {evtAvenir.slice(0,3).map((e,i)=>{
              const j = joursRestants(e.date);
              return (
                <div className="evenement-card" key={i}>
                  <span className="evt-icon">{e.type}</span>
                  <div className="evt-info">
                    <h4>{e.titre}</h4>
                    <p>{new Date(e.date).toLocaleDateString('fr-FR',{day:'numeric',month:'long'})}</p>
                  </div>
                  <div className="evt-jours">
                    <span style={{color:j<=7?'#EF5350':'#2D6A4F', fontWeight:700}}>
                      {j===0?'Aujourd\'hui 🎉':`Dans ${j}j`}
                    </span>
                  </div>
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

      {/* MEMBRES */}
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

      {/* ACCES RAPIDE */}
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
            <button key={i} onClick={()=>setOnglet(a.ong)} style={{
              background:'white', border:'2px solid #E0E0E0', borderRadius:'14px',
              padding:'1rem .8rem', cursor:'pointer', textAlign:'center',
              transition:'all .2s', fontFamily:'inherit',
              display:'flex', flexDirection:'column', alignItems:'center', gap:'.4rem'
            }}
            onMouseOver={e=>{e.currentTarget.style.borderColor='#2D6A4F';e.currentTarget.style.background='#f0fdf4';}}
            onMouseOut={e=>{e.currentTarget.style.borderColor='#E0E0E0';e.currentTarget.style.background='white';}}>
              <span style={{fontSize:'1.8rem'}}>{a.icon}</span>
              <span style={{fontSize:'.78rem', fontWeight:'600', color:'#555'}}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
})()}

        {onglet==='arbre' && (
          <div style={{padding:'1rem'}}>
            {renderComp(ArbreAnime, {}, 'ArbreAnime')}
          </div>
        )}

        {onglet==='membres' && (
          <div className="content-section">
            <div className="content-header">
              <div><h1>👥 Membres</h1><p>Gérez les membres de votre famille</p></div>
            </div>
            {renderComp(Membres, {}, 'Membres')}
          </div>
        )}

        {onglet==='sante' && (
          <div className="content-section">
            <div className="content-header">
              <div><h1>🩺 Santé familiale</h1><p>Données médicales de la famille</p></div>
            </div>
            {renderComp(Sante, {}, 'Sante')}
          </div>
        )}

        {onglet==='memoire' && (
          <div className="content-section">
            <div className="content-header">
              <div><h1>📸 Mémoire familiale</h1><p>Souvenirs, traditions et histoire</p></div>
            </div>
            {renderComp(Memoire, {}, 'Memoire')}
          </div>
        )}

        {onglet==='evenements' && (
          <div className="content-section">
            <div className="content-header">
              <div><h1>🎂 Événements familiaux</h1><p>Ne manque aucun moment important</p></div>
              <button className="btn-inviter">+ Ajouter un événement</button>
            </div>
            <div className="evenements-list grand">
              {evenements.map((e,i)=>(
                <div className="evenement-card grand" key={i}>
                  <span className="evt-icon">{e.type}</span>
                  <div className="evt-info"><h4>{e.titre}</h4><p>{e.date}</p></div>
                  <div className="evt-jours"><span>Dans {e.jours} jours</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {onglet==='chat' && (
          <div style={{height:'calc(100vh - 2rem)'}}>
            {renderComp(Chat, {}, 'Chat')}
          </div>
        )}

        {onglet==='carte' && (
          <div className="content-section">
            <div className="content-header">
              <div><h1>🗺️ Carte familiale</h1><p>Où vivent les membres dans le monde</p></div>
            </div>
            {renderComp(Carte, {}, 'Carte')}
          </div>
        )}

        {onglet==='stats' && (
          <div className="content-section">
            <div className="content-header">
              <div><h1>📊 Statistiques familiales</h1><p>Analyse complète de ta famille</p></div>
            </div>
            {renderComp(Statistiques, {}, 'Statistiques')}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;