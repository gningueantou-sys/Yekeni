import React, { useState } from 'react';
import './Memoire.css';

const souvenirsDef = [
  { id:1, titre:'Mariage de Papa et Maman', annee:'1985', categorie:'Mariage', emoji:'💒', description:'Le plus beau jour de notre famille. Célébrée à Dakar avec toute la famille.', auteur:'Moussa Diallo', likes:12 },
  { id:2, titre:'Naissance de Ibrahim', annee:'1990', categorie:'Naissance', emoji:'👶', description:"Ibrahim est né un mardi matin à l'hôpital Principal de Dakar.", auteur:'Fatoumata Diallo', likes:8 },
  { id:3, titre:'Baptême de Mariam', annee:'2005', categorie:'Baptême', emoji:'🙏', description:'Un baptême magnifique avec toute la famille réunie.', auteur:'Ibrahim Diallo', likes:15 },
  { id:4, titre:"Diplôme d'Aminata", annee:'2015', categorie:'Accomplissement', emoji:'🎓', description:'Aminata a obtenu son doctorat en médecine. Fierté de toute la famille !', auteur:'Aminata Diallo', likes:20 },
  { id:5, titre:'Réunion familiale à Touba', annee:'2019', categorie:'Réunion', emoji:'🌴', description:'Toute la famille réunie à Touba pour le Grand Magal.', auteur:'Ousmane Diallo', likes:25 },
  { id:6, titre:'Maison familiale de Dakar', annee:'1970', categorie:'Patrimoine', emoji:'🏡', description:'Notre maison familiale construite par Grand-père.', auteur:'Moussa Diallo', likes:30 },
];

const traditionsDef = [
  { id:1, titre:'Thiéboudienne du dimanche', categorie:'Cuisine', emoji:'🍚', description:'Chaque dimanche, Grand-mère prépare le thiéboudienne pour toute la famille. Cette tradition dure depuis plus de 40 ans.' },
  { id:2, titre:'Prière du Vendredi', categorie:'Religion', emoji:'🕌', description:'Tous les hommes de la famille se retrouvent à la mosquée du quartier chaque vendredi midi.' },
  { id:3, titre:'Récit des ancêtres', categorie:'Histoire orale', emoji:'📖', description:"Grand-père raconte chaque soir l'histoire de nos ancêtres, leurs voyages et leurs accomplissements." },
  { id:4, titre:'Korité en famille', categorie:'Fête', emoji:'🎉', description:'La fête de fin du Ramadan réunit toute la famille. Chacun porte ses plus beaux habits.' },
];

const categories = ['Tous','Mariage','Naissance','Baptême','Accomplissement','Réunion','Patrimoine'];

export default function Memoire() {
  const [onglet, setOnglet] = useState('souvenirs');
  const [categorie, setCategorie] = useState('Tous');
  const [souvenirs, setSouvenirs] = useState(souvenirsDef);
  const [traditions, setTraditions] = useState(traditionsDef);
  const [souvenirSel, setSouvenirSel] = useState(null);
  const [showFormSou, setShowFormSou] = useState(false);
  const [showFormTrad, setShowFormTrad] = useState(false);
  const [nouveau, setNouveau] = useState({ titre:'', annee:'', categorie:'Mariage', emoji:'📸', description:'', auteur:'' });
  const [nouvTrad, setNouvTrad] = useState({ titre:'', categorie:'Cuisine', emoji:'🍚', description:'' });

  const souvenirsFiltres = souvenirs.filter(s => categorie === 'Tous' || s.categorie === categorie);

  const ajouterSouvenir = () => {
    if (!nouveau.titre) return;
    setSouvenirs([...souvenirs, { ...nouveau, id: Date.now(), likes: 0 }]);
    setShowFormSou(false);
    setNouveau({ titre:'', annee:'', categorie:'Mariage', emoji:'📸', description:'', auteur:'' });
  };

  const supprimerSouvenir = (id) => {
    setSouvenirs(souvenirs.filter(s => s.id !== id));
    setSouvenirSel(null);
  };

  const ajouterTradition = () => {
    if (!nouvTrad.titre) return;
    setTraditions([...traditions, { ...nouvTrad, id: Date.now() }]);
    setShowFormTrad(false);
    setNouvTrad({ titre:'', categorie:'Cuisine', emoji:'🍚', description:'' });
  };

  const supprimerTradition = (id) => {
    setTraditions(traditions.filter(t => t.id !== id));
  };

  const liker = (id) => {
    setSouvenirs(souvenirs.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
    if (souvenirSel?.id === id) setSouvenirSel(s => ({ ...s, likes: s.likes + 1 }));
  };

  const emojisS = ['💒','👶','🙏','🎓','🌴','🏡','🎉','📸','🎵','🏆','✈️','🌍'];
  const emojisT = ['🍚','🕌','📖','🎉','💃','🥁','🌴','🏡','🎵','🙏','👗','🌍'];

  return (
    <div className="memoire-page">

      <div className="memoire-tabs">
        <button className={onglet==='souvenirs'?'mtab actif':'mtab'} onClick={()=>setOnglet('souvenirs')}>📸 Souvenirs</button>
        <button className={onglet==='traditions'?'mtab actif':'mtab'} onClick={()=>setOnglet('traditions')}>📖 Traditions & Culture</button>
        <button className={onglet==='histoire'?'mtab actif':'mtab'} onClick={()=>setOnglet('histoire')}>🏛️ Histoire familiale</button>
      </div>

      {/* SOUVENIRS */}
      {onglet==='souvenirs' && (
        <div className="memoire-content">
          <div className="memoire-toolbar">
            <div className="categories">
              {categories.map(c=>(
                <button key={c} className={categorie===c?'cat-btn actif':'cat-btn'} onClick={()=>setCategorie(c)}>{c}</button>
              ))}
            </div>
            <button className="btn-ajouter-souvenir" onClick={()=>setShowFormSou(true)}>+ Ajouter un souvenir</button>
          </div>
          <div className="souvenirs-grid">
            {souvenirsFiltres.map(s=>(
              <div key={s.id} className="souvenir-card" onClick={()=>setSouvenirSel(s)}>
                <div className="souvenir-emoji">{s.emoji}</div>
                <div className="souvenir-info">
                  <div className="souvenir-top">
                    <span className="souvenir-cat">{s.categorie}</span>
                    <span className="souvenir-annee">{s.annee}</span>
                  </div>
                  <h3>{s.titre}</h3>
                  <p>{s.description}</p>
                  <div className="souvenir-footer">
                    <span className="souvenir-auteur">✍️ {s.auteur}</span>
                    <button className="btn-like" onClick={e=>{e.stopPropagation();liker(s.id);}}>❤️ {s.likes}</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="souvenir-card ajouter" onClick={()=>setShowFormSou(true)}>
              <div className="souvenir-emoji">+</div>
              <div className="souvenir-info">
                <h3>Ajouter un souvenir</h3>
                <p>Partagez un moment précieux avec votre famille</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRADITIONS */}
      {onglet==='traditions' && (
        <div className="memoire-content">
          <div className="traditions-header">
            <h2>📖 Traditions & Culture familiale</h2>
            <p>Préservez l'héritage culturel de votre famille pour les générations futures</p>
          </div>
          <div className="traditions-grid">
            {traditions.map(t=>(
              <div className="tradition-card" key={t.id} style={{position:'relative'}}>
                <div className="tradition-emoji">{t.emoji}</div>
                <div className="tradition-info">
                  <span className="tradition-cat">{t.categorie}</span>
                  <h3>{t.titre}</h3>
                  <p>{t.description}</p>
                </div>
                <button className="btn-supprimer-trad" onClick={()=>supprimerTradition(t.id)} title="Supprimer">🗑️</button>
              </div>
            ))}
            <button onClick={()=>setShowFormTrad(true)} style={{
              background:'none', border:'2px dashed #ccc', borderRadius:'20px',
              padding:'1.5rem', display:'flex', gap:'1rem', alignItems:'center',
              cursor:'pointer', width:'100%', textAlign:'left'
            }}>
              <div style={{fontSize:'2rem', color:'#2D6A4F', fontWeight:'bold', flexShrink:0}}>+</div>
              <div>
                <h3 style={{margin:'0 0 0.3rem', fontSize:'1rem', fontWeight:'700', color:'#1a1a1a'}}>Ajouter une tradition</h3>
                <p style={{margin:0, fontSize:'0.85rem', color:'#666'}}>Documentez les traditions de votre famille</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* HISTOIRE */}
      {onglet==='histoire' && (
        <div className="memoire-content">
          <div className="histoire-container">
            <div className="histoire-header">
              <h2>🏛️ Histoire de la Famille Diallo</h2>
              <p>Transmise de génération en génération</p>
            </div>
            <div className="timeline">
              {[
                { date:'1920', titre:'🌍 Origines', texte:"La famille Diallo trouve ses origines dans le Fouta Toro. Nos ancêtres étaient des éleveurs et commerçants respectés." },
                { date:'1950', titre:'🏡 Installation à Dakar', texte:"L'arrière-grand-père Amadou Diallo s'installe à Dakar et construit la maison familiale qui existe encore aujourd'hui." },
                { date:'1970', titre:'📚 Éducation', texte:"Grand-père Moussa fait de l'éducation une priorité. Tous ses enfants iront à l'école." },
                { date:'1990', titre:'🌍 Diaspora', texte:"Les membres de la famille commencent à s'installer en France, aux USA et en Guinée." },
                { date:'2025', titre:'🌳 Yëkëni', texte:"La famille Diallo rejoint Yëkëni pour préserver son histoire et rester connectée malgré la distance." },
              ].map((item,i)=>(
                <div className="timeline-item" key={i}>
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-content">
                    <h4>{item.titre}</h4>
                    <p>{item.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DETAIL SOUVENIR */}
      {souvenirSel && (
        <div className="form-overlay" onClick={()=>setSouvenirSel(null)}>
          <div className="souvenir-detail" onClick={e=>e.stopPropagation()}>
            <div className="detail-emoji">{souvenirSel.emoji}</div>
            <h2>{souvenirSel.titre}</h2>
            <div className="detail-meta">
              <span className="souvenir-cat">{souvenirSel.categorie}</span>
              <span className="souvenir-annee">{souvenirSel.annee}</span>
            </div>
            <p>{souvenirSel.description}</p>
            <div className="detail-footer">
              <span>✍️ {souvenirSel.auteur}</span>
              <button className="btn-like grand" onClick={()=>liker(souvenirSel.id)}>❤️ {souvenirSel.likes} j'aime</button>
            </div>
            <div style={{display:'flex', gap:'0.8rem', marginTop:'1rem'}}>
              <button className="btn-fermer" onClick={()=>setSouvenirSel(null)} style={{flex:1}}>✕ Fermer</button>
              <button className="btn-fermer" onClick={()=>supprimerSouvenir(souvenirSel.id)}
                style={{flex:1, background:'#FFF0F0', color:'#EF5350', borderColor:'#EF5350'}}>
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM SOUVENIR */}
      {showFormSou && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>📸 Ajouter un souvenir</h3>
            <div className="emoji-picker">
              {emojisS.map(e=>(
                <button key={e} className={nouveau.emoji===e?'emoji-btn actif':'emoji-btn'} onClick={()=>setNouveau({...nouveau,emoji:e})}>{e}</button>
              ))}
            </div>
            <div className="form-group">
              <label>Titre *</label>
              <input type="text" placeholder="ex: Mariage de Papa et Maman" value={nouveau.titre} onChange={e=>setNouveau({...nouveau,titre:e.target.value})}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Année</label>
                <input type="text" placeholder="ex: 1985" value={nouveau.annee} onChange={e=>setNouveau({...nouveau,annee:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Catégorie</label>
                <select value={nouveau.categorie} onChange={e=>setNouveau({...nouveau,categorie:e.target.value})}>
                  {categories.filter(c=>c!=='Tous').map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Racontez ce souvenir..." value={nouveau.description} onChange={e=>setNouveau({...nouveau,description:e.target.value})} rows={3} style={{resize:'none',fontFamily:'inherit',padding:'0.75rem 1rem',border:'2px solid #f0f0f0',borderRadius:'12px',outline:'none',fontSize:'0.95rem'}}/>
            </div>
            <div className="form-group">
              <label>Votre nom</label>
              <input type="text" placeholder="ex: Moussa Diallo" value={nouveau.auteur} onChange={e=>setNouveau({...nouveau,auteur:e.target.value})}/>
            </div>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={()=>setShowFormSou(false)}>Annuler</button>
              <button className="btn-confirmer" onClick={ajouterSouvenir} disabled={!nouveau.titre}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* FORM TRADITION */}
      {showFormTrad && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>📖 Ajouter une tradition</h3>
            <div className="emoji-picker">
              {emojisT.map(e=>(
                <button key={e} className={nouvTrad.emoji===e?'emoji-btn actif':'emoji-btn'} onClick={()=>setNouvTrad({...nouvTrad,emoji:e})}>{e}</button>
              ))}
            </div>
            <div className="form-group">
              <label>Titre *</label>
              <input type="text" placeholder="ex: Thiéboudienne du dimanche" value={nouvTrad.titre} onChange={e=>setNouvTrad({...nouvTrad,titre:e.target.value})}/>
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <select value={nouvTrad.categorie} onChange={e=>setNouvTrad({...nouvTrad,categorie:e.target.value})}>
                {['Cuisine','Religion','Histoire orale','Fête','Musique','Habillement'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Décrivez cette tradition..." value={nouvTrad.description} onChange={e=>setNouvTrad({...nouvTrad,description:e.target.value})} rows={3} style={{resize:'none',fontFamily:'inherit',padding:'0.75rem 1rem',border:'2px solid #f0f0f0',borderRadius:'12px',outline:'none',fontSize:'0.95rem'}}/>
            </div>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={()=>setShowFormTrad(false)}>Annuler</button>
              <button className="btn-confirmer" onClick={ajouterTradition} disabled={!nouvTrad.titre}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}