import React, { useState, useEffect } from 'react';
import './Racines.css';

const STORAGE_KEY = 'yekeni_racines';

const membresDef = [
  { id:1, nom:'Moussa Diallo', avatar:'👴', ethnie:'Peul', region:'Fouta Toro', village:'Matam', pays:'Sénégal', langues:['Pulaar','Wolof'], generation:'Grand-père', visibilite:'public' },
  { id:2, nom:'Fatoumata Diallo', avatar:'👵', ethnie:'Wolof', region:'Casamance', village:'Ziguinchor', pays:'Sénégal', langues:['Wolof','Français'], generation:'Grand-mère', visibilite:'public' },
  { id:3, nom:'Ibrahim Diallo', avatar:'👨', ethnie:'Peul', region:'Fouta Toro', village:'Matam', pays:'Sénégal', langues:['Pulaar'], generation:'Père', visibilite:'famille' },
  { id:4, nom:'Aminata Diallo', avatar:'👩', ethnie:'Sérère', region:'Sine Saloum', village:'Fatick', pays:'Sénégal', langues:['Sérère','Wolof','Français'], generation:'Mère', visibilite:'prive' },
];

const chargerMembres = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return membresDef;
};

const ethnies = ['Peul','Wolof','Sérère','Mandingue','Diola','Soninké','Bambara','Autre'];
const langues = ['Pulaar','Wolof','Sérère','Mandinka','Diola','Soninké','Français'];
const generations = ['Arrière-grand-père','Arrière-grand-mère','Grand-père','Grand-mère','Père','Mère','Moi','Enfant'];

export default function Racines() {
  const [membres, setMembres] = useState(chargerMembres);
  const [sel, setSel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [fd, setFd] = useState({ nom:'', avatar:'👤', ethnie:'Peul', region:'', village:'', pays:'Sénégal', langues:[], generation:'Moi', visibilite:'public' });
  const [onglet, setOnglet] = useState('carte');
  const [showAutreLangue, setShowAutreLangue] = useState(false);
  const [autreLangue, setAutreLangue] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(membres));
    } catch(e) {}
  }, [membres]);
<div className="fg-r"><label>👁️ Visibilité</label>
  <select value={fd.visibilite} onChange={e=>setFd({...fd,visibilite:e.target.value})}>
    <option value="public">🌍 Public — Visible par tous</option>
    <option value="famille">👥 Famille — Membres uniquement</option>
    <option value="prive">🔒 Privé — Admin & Co-Admins uniquement</option>
  </select>
</div>
  const ajouter = () => {
    if (!fd.nom) return;
    setMembres([...membres, { ...fd, id: Date.now() }]);
    setShowForm(false);
    setFd({ nom:'', avatar:'👤', ethnie:'Peul', region:'', village:'', pays:'Sénégal', langues:[], generation:'Moi' });
  };

  const supprimer = (id) => {
    setMembres(membres.filter(m => m.id !== id));
    setSel(null);
  };

  const toggleLangue = (l) => {
    const dejaDedans = fd.langues.includes(l);
    setFd({...fd, langues: dejaDedans ? fd.langues.filter(x=>x!==l) : [...fd.langues, l]});
  };

  const ethniesUniques = [...new Set(membres.map(m => m.ethnie))];
  const languesUniques = [...new Set(membres.flatMap(m => m.langues||[]))];
  const regionsUniques = [...new Set(membres.map(m => m.region))];
  const avatars = ['👴','👵','👨','👩','🧒','👧','👦','🧔','👱','🧓'];

  return (
    <div className="racines-page">

      <div className="racines-header">
        <div>
          <h1>🌍 Mes Racines</h1>
          <p>Retrouve et préserve les origines de ta famille · ✅ sauvegardé</p>
        </div>
        <button className="btn-ajouter-racine" onClick={()=>setShowForm(true)}>+ Ajouter une origine</button>
      </div>

      <div className="racines-stats">
        <div className="rstat"><span className="rstat-icon">👥</span><div><h3>{membres.length}</h3><p>Membres tracés</p></div></div>
        <div className="rstat"><span className="rstat-icon">🌍</span><div><h3>{ethniesUniques.length}</h3><p>Ethnies</p></div></div>
        <div className="rstat"><span className="rstat-icon">🗣️</span><div><h3>{languesUniques.length}</h3><p>Langues</p></div></div>
        <div className="rstat"><span className="rstat-icon">📍</span><div><h3>{regionsUniques.length}</h3><p>Régions d'origine</p></div></div>
      </div>

      <div className="racines-tabs">
        <button className={onglet==='carte'?'rtab actif':'rtab'} onClick={()=>setOnglet('carte')}>🗺️ Origines</button>
        <button className={onglet==='ethnies'?'rtab actif':'rtab'} onClick={()=>setOnglet('ethnies')}>🌿 Ethnies & Langues</button>
        <button className={onglet==='audio'?'rtab actif':'rtab'} onClick={()=>setOnglet('audio')}>🎙️ Voix des anciens</button>
      </div>

      {onglet==='carte' && (
        <div className="racines-content">
          <div className="origines-banner">
            <div className="banner-text">
              <h3>🌍 La carte de vos origines</h3>
              <p>Chaque membre de ta famille vient d'un endroit précis. Documentez ces lieux avant qu'ils ne soient oubliés.</p>
            </div>
            <div className="banner-regions">
              {regionsUniques.map((r,i)=>(
                <span key={i} className="region-badge">📍 {r}</span>
              ))}
            </div>
          </div>
          <div className="membres-origines">
            {membres.map(m=>(
              <div key={m.id} className="origine-card" onClick={()=>setSel(m)}>
                <div className="origine-avatar">{m.avatar}</div>
                <div className="origine-info">
                  <div className="origine-nom">{m.nom}</div>
                  <div className="origine-gen">{m.generation}</div>
                  <div className="origine-lieu">
                    <span>📍 {m.village}, {m.region}</span>
                    <span>🌍 {m.pays}</span>
                  </div>
                  <div className="origine-tags">
                    <span className="tag-ethnie">{m.ethnie}</span>
                    {(m.langues||[]).map((l,i)=>(
                      <span key={i} className="tag-langue">🗣️ {l}</span>
                    ))}
                  </div>
                </div>
                <button className="btn-voir">›</button>
              </div>
            ))}
            <div className="origine-card ajouter" onClick={()=>setShowForm(true)}>
              <div className="origine-avatar" style={{fontSize:'2rem'}}>+</div>
              <div className="origine-info">
                <div className="origine-nom">Ajouter un ancêtre</div>
                <div className="origine-gen">Documentez ses origines</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {onglet==='ethnies' && (
        <div className="racines-content">
          <div className="ethnies-section">
            <h3>🌿 Composition ethnique de la famille</h3>
            <div className="ethnies-grid">
              {ethniesUniques.map((e,i)=>{
                const count = membres.filter(m=>m.ethnie===e).length;
                const pct = Math.round((count/membres.length)*100);
                const couleurs = ['#2D6A4F','#B56A3A','#00BCD4','#EF5350','#FF9800','#9C27B0'];
                return (
                  <div key={i} className="ethnie-card">
                    <div className="ethnie-top">
                      <span className="ethnie-nom">{e}</span>
                      <span className="ethnie-pct">{pct}%</span>
                    </div>
                    <div className="ethnie-bar">
                      <div className="ethnie-fill" style={{width:`${pct}%`, background:couleurs[i%couleurs.length]}}/>
                    </div>
                    <div className="ethnie-membres">
                      {membres.filter(m=>m.ethnie===e).map((m,j)=>(
                        <span key={j} className="ethnie-membre-tag">{m.avatar} {m.nom}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="langues-section">
            <h3>🗣️ Langues parlées dans la famille</h3>
            <div className="langues-grid">
              {languesUniques.map((l,i)=>{
                const membresLang = membres.filter(m=>(m.langues||[]).includes(l));
                return (
                  <div key={i} className="langue-card">
                    <div className="langue-icon">🗣️</div>
                    <div className="langue-info">
                      <h4>{l}</h4>
                      <p>{membresLang.map(m=>m.nom).join(', ')}</p>
                    </div>
                    <span className="langue-count">{membresLang.length}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="alerte-racines">
            <span>⚠️</span>
            <div>
              <h4>Préservez vos langues !</h4>
              <p>Plusieurs langues africaines sont en danger d'extinction. Enregistrez la voix de vos anciens dans l'onglet "Voix des anciens".</p>
            </div>
          </div>
        </div>
      )}

      {onglet==='audio' && (
        <div className="racines-content">
          <div className="audio-header">
            <h3>🎙️ Voix des anciens</h3>
            <p>Enregistrez et préservez la voix, les histoires et les sagesses de vos ancêtres avant qu'elles ne disparaissent.</p>
          </div>
          <div className="audio-grid">
            {[
              { nom:'Moussa Diallo', avatar:'👴', titre:'Histoire des origines Peul', duree:'3:42', langue:'Pulaar', desc:"Grand-père raconte l'histoire de la famille depuis le Fouta Toro" },
              { nom:'Fatoumata Diallo', avatar:'👵', titre:'Recette du Thiéboudienne', duree:'5:15', langue:'Wolof', desc:'Grand-mère explique la recette secrète transmise depuis 3 générations' },
              { nom:'Moussa Diallo', avatar:'👴', titre:'Proverbes Peul', duree:'2:30', langue:'Pulaar', desc:'Les sagesses ancestrales en Pulaar' },
            ].map((a,i)=>(
              <div key={i} className="audio-card">
                <div className="audio-top">
                  <span className="audio-avatar">{a.avatar}</span>
                  <div><h4>{a.titre}</h4><p>{a.nom} · {a.langue}</p></div>
                  <span className="audio-duree">{a.duree}</span>
                </div>
                <p className="audio-desc">{a.desc}</p>
                <div className="audio-player">
                  <button className="btn-play">▶️ Écouter</button>
                  <div className="audio-barre">
                    <div className="audio-progress" style={{width:`${(i+1)*25}%`}}/>
                  </div>
                </div>
              </div>
            ))}
            <div className="audio-card ajouter" onClick={()=>alert("Fonctionnalité d'enregistrement à venir !")}>
              <div style={{fontSize:'3rem', textAlign:'center', marginBottom:'0.5rem'}}>🎙️</div>
              <h4 style={{textAlign:'center'}}>Enregistrer un témoignage</h4>
              <p style={{textAlign:'center', color:'#888', fontSize:'0.85rem'}}>Capturez la voix d'un ancien de la famille</p>
            </div>
          </div>
        </div>
      )}

      {sel && (
        <div className="ov-racines" onClick={()=>setSel(null)}>
          <div className="modal-racines" onClick={e=>e.stopPropagation()}>
            <button className="xbtn-r" onClick={()=>setSel(null)}>✕</button>
            <div style={{textAlign:'center', marginBottom:'1.2rem'}}>
              <div style={{fontSize:'4rem'}}>{sel.avatar}</div>
              <h2>{sel.nom}</h2>
              <p style={{color:'#888'}}>{sel.generation}</p>
            </div>
            <div className="detail-racine-grid">
              <div className="dr-item"><span>🌿 Ethnie</span><strong>{sel.ethnie}</strong></div>
              <div className="dr-item"><span>📍 Village</span><strong>{sel.village}</strong></div>
              <div className="dr-item"><span>🗺️ Région</span><strong>{sel.region}</strong></div>
              <div className="dr-item"><span>🌍 Pays</span><strong>{sel.pays}</strong></div>
              <div className="dr-item" style={{gridColumn:'1/-1'}}>
                <span>🗣️ Langues parlées</span>
                <div style={{display:'flex', flexWrap:'wrap', gap:'0.4rem', marginTop:'0.4rem'}}>
                  {(sel.langues||[]).map((l,i)=>(
                    <span key={i} style={{background:'#fef3c7', color:'#d97706', padding:'2px 10px', borderRadius:'10px', fontSize:'0.8rem', fontWeight:'600'}}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:'flex', gap:'0.8rem', marginTop:'1.2rem'}}>
              <button className="btn-fermer-r" onClick={()=>setSel(null)} style={{flex:1}}>Fermer</button>
              <button className="btn-fermer-r" onClick={()=>supprimer(sel.id)}
                style={{flex:1, background:'#FFF0F0', color:'#EF5350', border:'2px solid #EF5350'}}>
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="ov-racines">
          <div className="modal-racines">
            <button className="xbtn-r" onClick={()=>setShowForm(false)}>✕</button>
            <h3>🌍 Ajouter une origine</h3>
            <div className="emoji-picker-r">
              {avatars.map(a=>(
                <button key={a} className={fd.avatar===a?'av-btn actif':'av-btn'} onClick={()=>setFd({...fd,avatar:a})}>{a}</button>
              ))}
            </div>
            <div className="fg-r"><label>Nom complet *</label>
              <input value={fd.nom} onChange={e=>setFd({...fd,nom:e.target.value})} placeholder="ex: Amadou Diallo"/>
            </div>
            <div className="fg-r"><label>Génération</label>
              <select value={fd.generation} onChange={e=>setFd({...fd,generation:e.target.value})}>
                {generations.map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="fg-r"><label>Ethnie</label>
              <select value={fd.ethnie} onChange={e=>setFd({...fd,ethnie:e.target.value})}>
                {ethnies.map(e=><option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="fg-r"><label>Langues parlées</label>
              <div style={{display:'flex', flexWrap:'wrap', gap:'0.4rem', marginTop:'0.3rem'}}>
                {langues.map(l=>(
                  <button key={l} onClick={()=>toggleLangue(l)} style={{
                    padding:'0.3rem 0.8rem', borderRadius:'20px', cursor:'pointer',
                    border:'2px solid', fontSize:'0.8rem', fontWeight:'600',
                    borderColor: fd.langues.includes(l)?'#2D6A4F':'#e0e0e0',
                    background: fd.langues.includes(l)?'#dcfce7':'white',
                    color: fd.langues.includes(l)?'#2D6A4F':'#888',
                  }}>{l}</button>
                ))}
                <button onClick={()=>setShowAutreLangue(!showAutreLangue)} style={{
                  padding:'0.3rem 0.8rem', borderRadius:'20px', cursor:'pointer',
                  border:'2px solid', fontSize:'0.8rem', fontWeight:'600',
                  borderColor: showAutreLangue?'#2D6A4F':'#e0e0e0',
                  background: showAutreLangue?'#dcfce7':'white',
                  color: showAutreLangue?'#2D6A4F':'#888',
                }}>+ Autre</button>
              </div>
              {showAutreLangue && (
                <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
                  <input value={autreLangue} onChange={e=>setAutreLangue(e.target.value)}
                    placeholder="ex: Bambara, Haoussa..."
                    style={{flex:1, padding:'0.5rem 0.8rem', border:'2px solid #2D6A4F', borderRadius:'9px', fontSize:'0.86rem', outline:'none', fontFamily:'inherit'}}
                  />
                  <button onClick={()=>{
                    if(autreLangue.trim()){
                      setFd({...fd, langues:[...fd.langues, autreLangue.trim()]});
                      setAutreLangue('');
                      setShowAutreLangue(false);
                    }
                  }} style={{background:'#2D6A4F', color:'white', border:'none', padding:'0.5rem 1rem', borderRadius:'9px', cursor:'pointer', fontWeight:'600'}}>
                    Ajouter
                  </button>
                </div>
              )}
            </div>
            <div className="fg-r"><label>Village d'origine</label>
              <input value={fd.village} onChange={e=>setFd({...fd,village:e.target.value})} placeholder="ex: Matam"/>
            </div>
            <div className="fg-r"><label>Région</label>
              <input value={fd.region} onChange={e=>setFd({...fd,region:e.target.value})} placeholder="ex: Fouta Toro"/>
            </div>
            <div className="fg-r"><label>Pays</label>
              <input value={fd.pays} onChange={e=>setFd({...fd,pays:e.target.value})} placeholder="ex: Sénégal"/>
            </div>
            <div style={{display:'flex', gap:'0.8rem', marginTop:'1rem'}}>
              <button className="btn-fermer-r" onClick={()=>setShowForm(false)} style={{flex:1}}>Annuler</button>
              <button className="btn-fermer-r" onClick={ajouter} disabled={!fd.nom}
                style={{flex:2, background:'#2D6A4F', color:'white', border:'none', opacity:fd.nom?1:0.5}}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}