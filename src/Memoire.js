import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './Memoire.css';

const categories = ['Tous','Mariage','Naissance','Baptême','Accomplissement','Réunion','Patrimoine'];
const emojisS = ['💒','👶','🙏','🎓','🌴','🏡','🎉','📸','🎵','🏆','✈️','🌍'];
const emojisT = ['🍚','🕌','📖','🎉','💃','🥁','🌴','🏡','🎵','🙏','👗','🌍'];

const fdSouvenirVide = { titre:'', annee:'', categorie:'Mariage', emoji:'📸', description:'' };
const fdTraditionVide = { titre:'', categorie:'Cuisine', emoji:'🍚', description:'' };

const mapSouvenir = (r) => ({
  id: r.id,
  titre: r.titre,
  annee: r.annee || '',
  categorie: r.categorie || '',
  emoji: r.emoji || '📸',
  description: r.description || '',
  auteur: r.profils?.nom_complet || 'Membre',
  likes: r.likes || 0,
});

const mapTradition = (r) => ({
  id: r.id,
  titre: r.titre,
  categorie: r.categorie || '',
  emoji: r.emoji || '📖',
  description: r.description || '',
});

export default function Memoire() {
  const [chargement, setChargement] = useState(true);
  const [familleId, setFamilleId] = useState(null);
  const [familleNom, setFamilleNom] = useState('');
  const [familleDescription, setFamilleDescription] = useState('');
  const [onglet, setOnglet] = useState('souvenirs');
  const [categorie, setCategorie] = useState('Tous');
  const [souvenirs, setSouvenirs] = useState([]);
  const [traditions, setTraditions] = useState([]);
  const [souvenirSel, setSouvenirSel] = useState(null);
  const [showFormSou, setShowFormSou] = useState(false);
  const [showFormTrad, setShowFormTrad] = useState(false);
  const [nouveau, setNouveau] = useState(fdSouvenirVide);
  const [nouvTrad, setNouvTrad] = useState(fdTraditionVide);

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }

      const { data: profil, error: errProfil } = await supabase
        .from('profils')
        .select('famille_id')
        .eq('id', user.id)
        .single();

      if (errProfil || !profil?.famille_id) { setChargement(false); return; }
      setFamilleId(profil.famille_id);

      const [{ data: famille }, { data: souvenirsData, error: errSou }, { data: traditionsData, error: errTrad }] = await Promise.all([
        supabase.from('familles').select('nom, description').eq('id', profil.famille_id).single(),
        supabase.from('souvenirs').select('*, profils(nom_complet)').eq('famille_id', profil.famille_id).order('created_at', { ascending: false }),
        supabase.from('traditions').select('*').eq('famille_id', profil.famille_id).order('created_at', { ascending: false }),
      ]);

      if (errSou) console.error('Erreur chargement souvenirs :', errSou);
      if (errTrad) console.error('Erreur chargement traditions :', errTrad);

      setFamilleNom(famille?.nom || '');
      setFamilleDescription(famille?.description || '');
      setSouvenirs((souvenirsData || []).map(mapSouvenir));
      setTraditions((traditionsData || []).map(mapTradition));
      setChargement(false);
    }
    charger();
  }, []);

  const souvenirsFiltres = souvenirs.filter(s => categorie === 'Tous' || s.categorie === categorie);

  const ajouterSouvenir = async () => {
    if (!nouveau.titre || !familleId) return;
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('souvenirs')
      .insert({
        famille_id: familleId,
        auteur_id: user?.id || null,
        titre: nouveau.titre,
        annee: nouveau.annee || null,
        categorie: nouveau.categorie,
        emoji: nouveau.emoji,
        description: nouveau.description || null,
      })
      .select('*, profils(nom_complet)')
      .single();

    if (error) { alert("Erreur lors de l'ajout : " + error.message); return; }

    setSouvenirs([mapSouvenir(data), ...souvenirs]);
    setShowFormSou(false);
    setNouveau(fdSouvenirVide);
  };

  const supprimerSouvenir = async (id) => {
    const { error } = await supabase.from('souvenirs').delete().eq('id', id);
    if (error) { alert('Erreur lors de la suppression : ' + error.message); return; }
    setSouvenirs(souvenirs.filter(s => s.id !== id));
    setSouvenirSel(null);
  };

  const ajouterTradition = async () => {
    if (!nouvTrad.titre || !familleId) return;

    const { data, error } = await supabase
      .from('traditions')
      .insert({
        famille_id: familleId,
        titre: nouvTrad.titre,
        categorie: nouvTrad.categorie,
        emoji: nouvTrad.emoji,
        description: nouvTrad.description || null,
      })
      .select()
      .single();

    if (error) { alert("Erreur lors de l'ajout : " + error.message); return; }

    setTraditions([mapTradition(data), ...traditions]);
    setShowFormTrad(false);
    setNouvTrad(fdTraditionVide);
  };

  const supprimerTradition = async (id) => {
    const { error } = await supabase.from('traditions').delete().eq('id', id);
    if (error) { alert('Erreur lors de la suppression : ' + error.message); return; }
    setTraditions(traditions.filter(t => t.id !== id));
  };

  const liker = async (id) => {
    const s = souvenirs.find(x => x.id === id);
    if (!s) return;
    const nouvellesLikes = s.likes + 1;

    const { error } = await supabase.from('souvenirs').update({ likes: nouvellesLikes }).eq('id', id);
    if (error) { console.error('Erreur like :', error); return; }

    setSouvenirs(souvenirs.map(x => x.id === id ? { ...x, likes: nouvellesLikes } : x));
    if (souvenirSel?.id === id) setSouvenirSel(s2 => ({ ...s2, likes: nouvellesLikes }));
  };

  if (chargement) {
    return <div className="memoire-page"><p style={{padding:'2rem'}}>⏳ Chargement...</p></div>;
  }

  return (
    <div className="memoire-page">
      <div className="memoire-tabs">
        <button className={onglet==='souvenirs'?'mtab actif':'mtab'} onClick={()=>setOnglet('souvenirs')}>📸 Souvenirs</button>
        <button className={onglet==='traditions'?'mtab actif':'mtab'} onClick={()=>setOnglet('traditions')}>📖 Traditions & Culture</button>
        <button className={onglet==='histoire'?'mtab actif':'mtab'} onClick={()=>setOnglet('histoire')}>🏛️ Histoire familiale</button>
      </div>

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
          {souvenirs.length === 0 && (
            <p style={{color:'#888', fontSize:'.85rem', textAlign:'center', marginTop:'1rem'}}>Aucun souvenir partagé pour l'instant.</p>
          )}
        </div>
      )}

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
          {traditions.length === 0 && (
            <p style={{color:'#888', fontSize:'.85rem', textAlign:'center', marginTop:'1rem'}}>Aucune tradition documentée pour l'instant.</p>
          )}
        </div>
      )}

      {onglet==='histoire' && (
        <div className="memoire-content">
          <div className="histoire-container">
            <div className="histoire-header">
              <h2>🏛️ Histoire de la {familleNom || 'famille'}</h2>
              <p>Transmise de génération en génération</p>
            </div>
            {familleDescription ? (
              <div style={{
                background:'#F0FDF4', border:'2px solid #2D6A4F', borderRadius:'14px',
                padding:'1.5rem', fontSize:'1rem', lineHeight:'1.7', color:'#1B4332',
              }}>
                {familleDescription}
              </div>
            ) : (
              <div style={{textAlign:'center', color:'#888', padding:'2rem'}}>
                <p>Aucune description de famille renseignée pour l'instant.</p>
                <p style={{fontSize:'.85rem'}}>Elle peut être ajoutée depuis la page de configuration de la famille.</p>
              </div>
            )}
          </div>
        </div>
      )}

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

      {showFormSou && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>📸 Ajouter un souvenir</h3>
            <div className="emoji-picker">
              {emojisS.map(e=>(
                <button key={e} className={nouveau.emoji===e?'emoji-btn actif':'emoji-btn'} onClick={()=>setNouveau({...nouveau,emoji:e})}>{e}</button>
              ))}
            </div>
            <div className="form-group"><label>Titre *</label>
              <input type="text" placeholder="ex: Mariage de Papa et Maman" value={nouveau.titre} onChange={e=>setNouveau({...nouveau,titre:e.target.value})}/>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Année</label>
                <input type="text" placeholder="ex: 1985" value={nouveau.annee} onChange={e=>setNouveau({...nouveau,annee:e.target.value})}/>
              </div>
              <div className="form-group"><label>Catégorie</label>
                <select value={nouveau.categorie} onChange={e=>setNouveau({...nouveau,categorie:e.target.value})}>
                  {categories.filter(c=>c!=='Tous').map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Description</label>
              <textarea placeholder="Racontez ce souvenir..." value={nouveau.description} onChange={e=>setNouveau({...nouveau,description:e.target.value})} rows={3} style={{resize:'none',fontFamily:'inherit',padding:'0.75rem 1rem',border:'2px solid #f0f0f0',borderRadius:'12px',outline:'none',fontSize:'0.95rem'}}/>
            </div>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={()=>setShowFormSou(false)}>Annuler</button>
              <button className="btn-confirmer" onClick={ajouterSouvenir} disabled={!nouveau.titre}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {showFormTrad && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>📖 Ajouter une tradition</h3>
            <div className="emoji-picker">
              {emojisT.map(e=>(
                <button key={e} className={nouvTrad.emoji===e?'emoji-btn actif':'emoji-btn'} onClick={()=>setNouvTrad({...nouvTrad,emoji:e})}>{e}</button>
              ))}
            </div>
            <div className="form-group"><label>Titre *</label>
              <input type="text" placeholder="ex: Thiéboudienne du dimanche" value={nouvTrad.titre} onChange={e=>setNouvTrad({...nouvTrad,titre:e.target.value})}/>
            </div>
            <div className="form-group"><label>Catégorie</label>
              <select value={nouvTrad.categorie} onChange={e=>setNouvTrad({...nouvTrad,categorie:e.target.value})}>
                {['Cuisine','Religion','Histoire orale','Fête','Musique','Habillement'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Description</label>
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