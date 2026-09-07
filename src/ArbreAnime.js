import React, { useState, useRef, useEffect } from 'react';
import './ArbreAnime.css';
import { supabase } from './supabaseClient';

const mapRow = (r) => ({
  id: r.id,
  nom: r.nom || '',
  prenom: r.prenom || '',
  genre: r.genre,
  dateNaissance: r.date_naissance || '',
  annee: r.date_naissance ? String(r.date_naissance).slice(0, 4) : '',
  decede: !!r.decede,
  photo: r.photo_url || null,
  pereId: r.pere_id,
  mereId: r.mere_id,
  conjointIds: r.conjoint_ids || [],
});

export default function ArbreAnime() {
  const [membres, setMembres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [familleId, setFamilleId] = useState(null);
  const [centreId, setCentreId] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [form, setForm] = useState(null);
  const [profilEdit, setProfilEdit] = useState(null);
  const [fd, setFd] = useState({ nom:'', prenom:'', genre:'homme', date_naissance:'', statut:'vivant' });
  const [fdEdit, setFdEdit] = useState({});
  const [recherche, setRecherche] = useState('');
  const [showRecherche, setShowRecherche] = useState(false);
  const fileRef = useRef();
  const [photoId, setPhotoId] = useState(null);
  const [bio, setBio] = useState('');
  const [bioLoading, setBioLoading] = useState(false);
  const [bioMembre, setBioMembre] = useState(null);

  const chargerMembres = async (fid) => {
    const { data, error } = await supabase
      .from('membres')
      .select('*')
      .eq('famille_id', fid)
      .order('nom', { ascending: true });
    if (error) { console.error('Erreur chargement arbre :', error); return; }
    setMembres((data || []).map(mapRow));
  };

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }
      const { data: profil, error } = await supabase
        .from('profils')
        .select('famille_id')
        .eq('id', user.id)
        .single();
      if (error || !profil?.famille_id) { setChargement(false); return; }
      setFamilleId(profil.famille_id);
      await chargerMembres(profil.famille_id);
      setChargement(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (membres.length > 0 && !centreId) setCentreId(membres[0].id);
    if (membres.length > 0 && centreId && !membres.find(m => m.id === centreId)) {
      setCentreId(membres[0].id);
      setHistorique([]);
    }
  }, [membres, centreId]);

  const get = id => membres.find(m => m.id === id);
  const centre = centreId ? get(centreId) : null;

  const naviguer = (id) => {
    setHistorique(h => [...h, centreId]);
    setCentreId(id);
  };

  const retour = () => {
    if (historique.length === 0) return;
    const prev = historique[historique.length - 1];
    setHistorique(h => h.slice(0, -1));
    setCentreId(prev);
  };

  const retourDebut = () => {
    setHistorique([]);
    if (membres.length > 0) setCentreId(membres[0].id);
  };

  const genererBio = async (m) => {
    setBioLoading(true);
    setBio('');
    setBioMembre(m);
    try {
      const response = await fetch('/api/generate_bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: m.prenom,
          nom: m.nom,
          annee: m.annee,
          decede: m.decede,
          genre: m.genre,
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setBio('Erreur : ' + (data.error || 'impossible de générer la biographie.'));
      } else {
        setBio(data.bio || 'Impossible de générer la biographie.');
      }
    } catch(e) {
      setBio('Erreur : ' + e.message);
    }
    setBioLoading(false);
  };

  const ajouter = async () => {
    if (!fd.nom && !fd.prenom) return;
    const { type, refId } = form;
    const ref = refId ? get(refId) : null;

    const nouveauRow = {
      prenom: fd.prenom,
      nom: fd.nom,
      genre: fd.genre,
      date_naissance: fd.date_naissance || null,
      decede: fd.statut === 'decede',
      famille_id: familleId,
    };

    if ((type === 'fils' || type === 'fille') && ref) {
      if (ref.genre === 'homme') nouveauRow.pere_id = ref.id; else nouveauRow.mere_id = ref.id;
    }
    if ((type === 'frere' || type === 'soeur') && ref) {
      if (ref.pereId) nouveauRow.pere_id = ref.pereId;
      if (ref.mereId) nouveauRow.mere_id = ref.mereId;
    }

    const { data, error } = await supabase.from('membres').insert(nouveauRow).select().single();
    if (error) { alert("Erreur lors de l'ajout : " + error.message); return; }

    if (type === 'pere' && ref) {
      await supabase.from('membres').update({ pere_id: data.id }).eq('id', ref.id);
    }
    if (type === 'mere' && ref) {
      await supabase.from('membres').update({ mere_id: data.id }).eq('id', ref.id);
    }
    if (type === 'conjoint' && ref) {
      await supabase.from('membres').update({ conjoint_ids: [...(ref.conjointIds||[]), data.id] }).eq('id', ref.id);
      await supabase.from('membres').update({ conjoint_ids: [ref.id] }).eq('id', data.id);
    }

    await chargerMembres(familleId);
    setForm(null);
    setFd({ nom:'', prenom:'', genre:'homme', date_naissance:'', statut:'vivant' });
  };

  const modifier = async () => {
    const { error } = await supabase.from('membres').update({
      nom: fdEdit.nom,
      prenom: fdEdit.prenom,
      genre: fdEdit.genre,
      date_naissance: fdEdit.date_naissance || null,
      decede: fdEdit.statut === 'decede',
    }).eq('id', profilEdit.id);
    if (error) { alert('Erreur : ' + error.message); return; }
    await chargerMembres(familleId);
    setProfilEdit(null);
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce membre ? (Il sera aussi retiré de la page Membres)')) return;

    const affectes = membres.filter(m => m.conjointIds.includes(id));
    for (const m of affectes) {
      await supabase.from('membres').update({ conjoint_ids: m.conjointIds.filter(x => x !== id) }).eq('id', m.id);
    }

    const { error } = await supabase.from('membres').delete().eq('id', id);
    if (error) { alert('Erreur lors de la suppression : ' + error.message); return; }

    if (centreId === id) { setHistorique([]); setCentreId(null); }
    await chargerMembres(familleId);
    setProfilEdit(null);
  };

  const ouvrir = (type, refId, genre='homme') => {
    setFd({nom:'',prenom:'',genre,date_naissance:'',statut:'vivant'});
    setForm({type, refId});
    setProfilEdit(null);
  };

  const ouvrirEdit = (m) => {
    setProfilEdit(m);
    setFdEdit({ nom:m.nom, prenom:m.prenom, genre:m.genre, date_naissance:m.dateNaissance, statut: m.decede ? 'decede' : 'vivant' });
    setForm(null);
    setBio('');
    setBioMembre(null);
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file || !photoId) return;
    const r = new FileReader();
    r.onload = async (ev) => {
      const { error } = await supabase.from('membres').update({ photo_url: ev.target.result }).eq('id', photoId);
      if (error) { alert('Erreur upload photo : ' + error.message); return; }
      await chargerMembres(familleId);
    };
    r.readAsDataURL(file);
    e.target.value = '';
  };

  const membresFiltres = membres.filter(m =>
    (m.prenom + ' ' + m.nom).toLowerCase().includes(recherche.toLowerCase()) && recherche.length > 0
  );

  const filAriane = [...historique, centreId].map(id => get(id)).filter(Boolean);

  const CV = ({label, genre, onClick}) => (
    <div className={`cv cv-${genre}`} onClick={onClick}>
      <svg viewBox="0 0 44 44" width="26" height="26">
        <circle cx="22" cy="15" r="10" fill="#bbb"/>
        <ellipse cx="22" cy="36" rx="16" ry="10" fill="#bbb"/>
      </svg>
      <span className="cv-plus">+</span>
      <span className="cv-lbl">{label}</span>
    </div>
  );

  const Carte = ({m, isCenter=false}) => {
    const c = m.genre==='homme' ? '#00BCD4' : '#EF5350';
    const init = ((m.prenom?.[0]||'')+(m.nom?.[0]||'')).toUpperCase();
    return (
      <div className={`carte ${isCenter?'carte-centre-principale':''}`}
        style={{borderColor:c, cursor: !isCenter ? 'pointer' : 'default'}}
        onClick={()=>{ if(!isCenter) naviguer(m.id); }}
      >
        <div className="carte-ph" style={{borderColor:c}}
          onClick={e=>{e.stopPropagation(); setPhotoId(m.id); fileRef.current.click();}}>
          {m.photo
            ? <img src={m.photo} alt={m.nom}/>
            : <div className="carte-ph-default">
                <svg viewBox="0 0 44 44" width="34" height="34">
                  <circle cx="22" cy="15" r="10" fill={c} opacity="0.3"/>
                  <ellipse cx="22" cy="36" rx="16" ry="10" fill={c} opacity="0.3"/>
                  {init&&<text x="22" y="20" textAnchor="middle" fontSize="11" fill={c} fontWeight="bold">{init}</text>}
                </svg>
              </div>
          }
          <div className="carte-ph-ov">📷</div>
        </div>
        <div className="carte-body">
          <div className="carte-nom">{m.prenom} {m.nom}</div>
          {m.annee&&<div className="carte-an">{m.annee}{m.decede?' – †':''}</div>}
          {!isCenter && <div className="carte-nav-hint">Cliquer pour naviguer →</div>}
        </div>
        <button className="carte-edit" onClick={e=>{e.stopPropagation(); ouvrirEdit(m);}}>✏️</button>
      </div>
    );
  };

  if (chargement) return <div className="arbre-page"><p style={{padding:'2rem'}}>⏳ Chargement de l'arbre...</p></div>;

  if (!centre) {
    return (
      <div className="arbre-page">
        <div className="arbre-head">
          <div className="arbre-head-left">
            <h2>🌳 Arbre généalogique</h2>
            <p>Aucun membre pour l'instant</p>
          </div>
        </div>
        <div style={{textAlign:'center', padding:'3rem'}}>
          <button className="btn-inviter" onClick={()=>{ setFd({nom:'',prenom:'',genre:'homme',date_naissance:'',statut:'vivant'}); setForm({type:'racine', refId:null}); }}>
            + Commencer l'arbre
          </button>
        </div>
        {form && (
          <div className="ov" onClick={()=>setForm(null)}>
            <div className="mod" onClick={e=>e.stopPropagation()}>
              <button className="xbtn" onClick={()=>setForm(null)}>✕</button>
              <h3>➕ Premier membre</h3>
              <div className="fg"><label>Prénom</label>
                <input value={fd.prenom} onChange={e=>setFd({...fd,prenom:e.target.value})} placeholder="Prénom" autoFocus/>
              </div>
              <div className="fg"><label>Nom</label>
                <input value={fd.nom} onChange={e=>setFd({...fd,nom:e.target.value})} placeholder="Nom de famille"/>
              </div>
              <div className="fg"><label>Genre</label>
                <select value={fd.genre} onChange={e=>setFd({...fd,genre:e.target.value})}>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="fbtns">
                <button onClick={()=>setForm(null)}>Annuler</button>
                <button className="ok" onClick={ajouter} disabled={!fd.nom&&!fd.prenom}>Ajouter</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const parents = [centre.pereId, centre.mereId].map(get).filter(Boolean);
  const conjoints = centre.conjointIds.map(get).filter(Boolean);
  const enfants = membres.filter(m => m.pereId === centre.id || m.mereId === centre.id);
  const hasPere = !!centre.pereId;
  const hasMere = !!centre.mereId;
  const freresSoeurs = membres.filter(m => {
    if (m.id === centre.id) return false;
    const memePere = centre.pereId && m.pereId === centre.pereId;
    const memeMere = centre.mereId && m.mereId === centre.mereId;
    return memePere || memeMere;
  });

  return (
    <div className="arbre-page">

      <div className="arbre-head">
        <div className="arbre-head-left">
          <h2>🌳 Arbre généalogique</h2>
          <p>{membres.length} membre{membres.length>1?'s':''} · ☁️ sauvegardé sur Supabase</p>
        </div>
        <div className="arbre-head-right">
          <button className="btn-recherche" onClick={()=>setShowRecherche(!showRecherche)}>🔍</button>
        </div>
      </div>

      {showRecherche && (
        <div className="arbre-recherche">
          <input autoFocus placeholder="Rechercher un membre..."
            value={recherche} onChange={e=>setRecherche(e.target.value)}/>
          {membresFiltres.length > 0 && (
            <div className="recherche-resultats">
              {membresFiltres.map(m=>(
                <div key={m.id} className="recherche-item" onClick={()=>{
                  naviguer(m.id); setShowRecherche(false); setRecherche('');
                }}>
                  <span>{m.genre==='homme'?'👨':'👩'}</span>
                  <span>{m.prenom} {m.nom}</span>
                  {m.annee&&<span className="r-annee">{m.annee}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="fil-ariane">
        <button className="fa-btn" onClick={retourDebut}>🏠</button>
        {filAriane.map((m,i)=>(
          <React.Fragment key={m.id}>
            <span className="fa-sep">›</span>
            <button className="fa-btn" onClick={()=>{
              const idx = historique.indexOf(m.id);
              if(idx!==-1){ setHistorique(h=>h.slice(0,idx)); setCentreId(m.id); }
              else { setCentreId(m.id); setHistorique([]); }
            }}>{m.prenom||m.nom}</button>
          </React.Fragment>
        ))}
        {historique.length>0&&<button className="btn-retour-arbre" onClick={retour}>← Retour</button>}
      </div>

      <div className="arbre-canvas">
        <div className="arbre-inner">

          <div className="parents-du-membre">
            <div className="parents-rangee">
              {!hasPere&&<CV label="Père" genre="homme" onClick={()=>ouvrir('pere',centre.id,'homme')}/>}
              {parents.filter(p=>p.genre==='homme').map(p=>(
                <div key={p.id} className="parent-item">
                  <Carte m={p}/><div className="lv"/>
                </div>
              ))}
              {!hasMere&&<CV label="Mère" genre="femme" onClick={()=>ouvrir('mere',centre.id,'femme')}/>}
              {parents.filter(p=>p.genre==='femme').map(p=>(
                <div key={p.id} className="parent-item">
                  <Carte m={p}/><div className="lv"/>
                </div>
              ))}
            </div>
            <div className="lv"/>
          </div>

          <div className="ligne-principale">
            <div className="fratrie-col">
              {freresSoeurs.map(fs=><Carte key={fs.id} m={fs}/>)}
              <CV label="Frère" genre="homme" onClick={()=>ouvrir('frere',centre.id,'homme')}/>
              <CV label="Sœur" genre="femme" onClick={()=>ouvrir('soeur',centre.id,'femme')}/>
            </div>
            <div className="lh"/>
            <div className="carte-centre-wrap">
              <Carte m={centre} isCenter={true}/>
            </div>
            <div className="lh"/>
            <div className="conjoints-col">
              {conjoints.map(c=><Carte key={c.id} m={c}/>)}
              <CV label="Conjoint(e)" genre="homme" onClick={()=>ouvrir('conjoint',centre.id)}/>
            </div>
          </div>

          <div className="lv"/>
          <button className="btn-plus" onClick={()=>ouvrir('fils',centre.id,'homme')}>+</button>
          {enfants.length>0&&<>
            <div className="lv"/>
            <div className="enfants-rangee">
              {enfants.map((e,i)=>(
                <div key={e.id} className="enfant-col">
                  {i>0&&<div className="lh-enfant"/>}
                  <div className="lv-sm"/>
                  <Carte m={e}/>
                </div>
              ))}
            </div>
          </>}
          <div className="lv"/>
          <div className="add-enfants">
            <CV label="Fils" genre="homme" onClick={()=>ouvrir('fils',centre.id,'homme')}/>
            <CV label="Fille" genre="femme" onClick={()=>ouvrir('fille',centre.id,'femme')}/>
          </div>

        </div>
      </div>

      <input type="file" ref={fileRef} accept="image/*" style={{display:'none'}} onChange={handleFile}/>

      {form&&(
        <div className="ov" onClick={()=>setForm(null)}>
          <div className="mod" onClick={e=>e.stopPropagation()}>
            <button className="xbtn" onClick={()=>setForm(null)}>✕</button>
            <h3>➕ {form.type.charAt(0).toUpperCase()+form.type.slice(1)}</h3>
            <div className="fg"><label>Prénom</label>
              <input value={fd.prenom} onChange={e=>setFd({...fd,prenom:e.target.value})} placeholder="Prénom" autoFocus/>
            </div>
            <div className="fg"><label>Nom</label>
              <input value={fd.nom} onChange={e=>setFd({...fd,nom:e.target.value})} placeholder="Nom de famille"/>
            </div>
            <div className="fg"><label>Genre</label>
              <select value={fd.genre} onChange={e=>setFd({...fd,genre:e.target.value})}>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="fg"><label>Date de naissance</label>
              <input type="date" value={fd.date_naissance} onChange={e=>setFd({...fd,date_naissance:e.target.value})}/>
            </div>
            <div className="fg"><label>Statut</label>
              <select value={fd.statut} onChange={e=>setFd({...fd,statut:e.target.value})}>
                <option value="vivant">Vivant(e)</option>
                <option value="decede">Décédé(e)</option>
              </select>
            </div>
            <div className="fbtns">
              <button onClick={()=>setForm(null)}>Annuler</button>
              <button className="ok" onClick={ajouter} disabled={!fd.nom&&!fd.prenom}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {profilEdit&&(
        <div className="ov" onClick={()=>setProfilEdit(null)}>
          <div className="mod profil-mod" onClick={e=>e.stopPropagation()}>
            <button className="xbtn" onClick={()=>setProfilEdit(null)}>✕</button>
            <div className="profil-top">
              <div className="profil-ph" style={{borderColor:profilEdit.genre==='homme'?'#00BCD4':'#EF5350'}}
                onClick={()=>{setPhotoId(profilEdit.id);fileRef.current.click();}}>
                {profilEdit.photo
                  ?<img src={profilEdit.photo} alt=""/>
                  :<svg viewBox="0 0 60 60" width="60" height="60">
                    <circle cx="30" cy="20" r="13" fill={profilEdit.genre==='homme'?'#00BCD4':'#EF5350'} opacity="0.4"/>
                    <ellipse cx="30" cy="48" rx="20" ry="13" fill={profilEdit.genre==='homme'?'#00BCD4':'#EF5350'} opacity="0.4"/>
                  </svg>}
                <div className="ph-ov">📷</div>
              </div>
              <h3>{profilEdit.prenom} {profilEdit.nom}</h3>
            </div>
            <p className="sep">✏️ Modifier les informations</p>
            <div className="fg"><label>Prénom</label>
              <input value={fdEdit.prenom||''} onChange={e=>setFdEdit({...fdEdit,prenom:e.target.value})} placeholder="Prénom"/>
            </div>
            <div className="fg"><label>Nom</label>
              <input value={fdEdit.nom||''} onChange={e=>setFdEdit({...fdEdit,nom:e.target.value})} placeholder="Nom"/>
            </div>
            <div className="fg"><label>Genre</label>
              <select value={fdEdit.genre||'homme'} onChange={e=>setFdEdit({...fdEdit,genre:e.target.value})}>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="fg"><label>Date de naissance</label>
              <input type="date" value={fdEdit.date_naissance||''} onChange={e=>setFdEdit({...fdEdit,date_naissance:e.target.value})}/>
            </div>
            <div className="fg"><label>Statut</label>
              <select value={fdEdit.statut||'vivant'} onChange={e=>setFdEdit({...fdEdit,statut:e.target.value})}>
                <option value="vivant">Vivant(e)</option>
                <option value="decede">Décédé(e)</option>
              </select>
            </div>
            <div className="fbtns">
              <button onClick={()=>supprimer(profilEdit.id)} style={{color:'#EF5350',borderColor:'#EF5350'}}>🗑️</button>
              <button onClick={()=>setProfilEdit(null)}>Annuler</button>
              <button className="ok" onClick={modifier}>💾 Sauvegarder</button>
            </div>
            <p className="sep">Ajouter un membre lié</p>
            <div className="act-grid">
              <button className="ab h" onClick={()=>ouvrir('pere',profilEdit.id,'homme')}>👨 Père</button>
              <button className="ab f" onClick={()=>ouvrir('mere',profilEdit.id,'femme')}>👩 Mère</button>
              <button className="ab h" onClick={()=>ouvrir('frere',profilEdit.id,'homme')}>👦 Frère</button>
              <button className="ab f" onClick={()=>ouvrir('soeur',profilEdit.id,'femme')}>👧 Sœur</button>
              <button className="ab h" onClick={()=>ouvrir('fils',profilEdit.id,'homme')}>🧒 Fils</button>
              <button className="ab f" onClick={()=>ouvrir('fille',profilEdit.id,'femme')}>👧 Fille</button>
              <button className="ab v" onClick={()=>ouvrir('conjoint',profilEdit.id)}>💑 Conjoint(e)</button>
            </div>
            <p className="sep">🤖 Intelligence Artificielle</p>
            <button onClick={()=>genererBio(profilEdit)} style={{
              width:'100%', background:'linear-gradient(135deg,#1B4332,#2D6A4F)',
              color:'white', border:'none', padding:'.75rem', borderRadius:'10px',
              cursor: bioLoading?'wait':'pointer', fontWeight:'700', fontSize:'.88rem',
              fontFamily:'inherit', marginBottom:'.8rem', opacity: bioLoading?0.8:1
            }}>
              {bioLoading && bioMembre?.id===profilEdit.id ? '⏳ Génération en cours...' : '✨ Générer une biographie'}
            </button>
            {bio && bioMembre?.id===profilEdit.id && (
              <div style={{
                background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                border:'2px solid #2D6A4F', borderRadius:'12px',
                padding:'1rem', fontSize:'.85rem', lineHeight:'1.7',
                color:'#1B4332', fontStyle:'italic'
              }}>
                <div style={{fontWeight:'700', fontStyle:'normal', marginBottom:'.4rem'}}>📖 Biographie générée :</div>
                {bio}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}