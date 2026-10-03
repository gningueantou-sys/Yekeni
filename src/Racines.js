import React, { useState, useEffect, useRef } from 'react';
import './Racines.css';
import { supabase } from './supabaseClient';

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

const mapRow = (r, extras) => ({
  id: r.id,
  prenom: r.prenom || '',
  nomSeul: r.nom || '',
  nom: r.prenom ? `${r.prenom} ${r.nom}` : (r.nom || ''),
  avatar: extras[r.id]?.avatar || '👤',
  ethnie: r.ethnie || '',
  region: r.region_origine || '',
  village: r.village_origine || '',
  pays: r.pays_origine || '',
  langues: r.langues || [],
  generation: r.generation_label || '',
  visibilite: r.visibilite || 'famille',
});

const ethnies = ['Peul','Wolof','Sérère','Mandingue','Diola','Soninké','Bambara','Autre'];
const langues = ['Pulaar','Wolof','Sérère','Mandinka','Diola','Soninké','Français'];
const generations = ['Arrière-grand-père','Arrière-grand-mère','Grand-père','Grand-mère','Père','Mère','Moi','Enfant'];
const avatars = ['👴','👵','👨','👩','🧒','👧','👦','🧔','👱','🧓'];

const fdVide = { nom:'', avatar:'👤', ethnie:'Peul', region:'', village:'', pays:'Sénégal', langues:[], generation:'Moi' };

export default function Racines() {
  const [membres, setMembres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [familleId, setFamilleId] = useState(null);
  const [monUserId, setMonUserId] = useState(null);
  const [sel, setSel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [cible, setCible] = useState('nouveau'); // 'nouveau' ou un id de membre existant
  const [fd, setFd] = useState(fdVide);
  const [onglet, setOnglet] = useState('carte');
  const [showAutreLangue, setShowAutreLangue] = useState(false);
  const [autreLangue, setAutreLangue] = useState('');

  // --- Voix des anciens (témoignages audio) ---
  const [temoignages, setTemoignages] = useState([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [fdTemoignage, setFdTemoignage] = useState({ titre:'', langue:'Français', description:'', membreId:'' });
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const mimeTypeRef = useRef('audio/webm');

  // Safari (iOS et macOS) ne sait pas enregistrer en 'audio/webm' — il ne
  // déclenche jamais d'erreur visible, mais produit un fichier illisible.
  // On détecte le format que le navigateur sait vraiment produire.
  const choisirMimeType = () => {
    const candidats = ['audio/mp4', 'audio/webm', 'audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/aac'];
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
      for (const c of candidats) {
        if (MediaRecorder.isTypeSupported(c)) return c;
      }
    }
    return ''; // laisse le navigateur choisir son propre défaut
  };

  const extensionPourMime = (mime) => {
    if (mime.includes('mp4') || mime.includes('aac')) return 'm4a';
    if (mime.includes('ogg')) return 'ogg';
    return 'webm';
  };

  const chargerTemoignages = async (fid) => {
    const { data, error } = await supabase
      .from('temoignages')
      .select('*, membres(prenom, nom), profils(nom_complet)')
      .eq('famille_id', fid)
      .order('created_at', { ascending: false });
    if (error) { console.error('Erreur chargement témoignages :', error); return; }
    setTemoignages(data || []);
  };

  const chargerMembres = async (fid) => {
    const { data, error } = await supabase
      .from('membres')
      .select('*')
      .eq('famille_id', fid)
      .order('nom', { ascending: true });
    if (error) { console.error('Erreur chargement racines :', error); return; }
    const extras = chargerExtras();
    setMembres((data || []).map(r => mapRow(r, extras)));
  };

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }
      setMonUserId(user.id);
      const { data: profil, error } = await supabase
        .from('profils')
        .select('famille_id')
        .eq('id', user.id)
        .single();
      if (error || !profil?.famille_id) { setChargement(false); return; }
      setFamilleId(profil.famille_id);
      await chargerMembres(profil.famille_id);
      await chargerTemoignages(profil.famille_id);
      setChargement(false);
    }
    init();
  }, []);

  const membresDocumentes = membres.filter(m => m.ethnie);
  const membresSansOrigine = membres.filter(m => !m.ethnie);

  const ouvrirForm = () => {
    setCible('nouveau');
    setFd(fdVide);
    setShowForm(true);
  };

  const choisirCible = (valeur) => {
    setCible(valeur);
    if (valeur === 'nouveau') {
      setFd(fdVide);
    } else {
      const m = membres.find(x => x.id === valeur);
      setFd({
        nom: m.nom,
        avatar: m.avatar,
        ethnie: m.ethnie || 'Peul',
        region: m.region,
        village: m.village,
        pays: m.pays || 'Sénégal',
        langues: m.langues,
        generation: m.generation || 'Moi',
      });
    }
  };

  const ajouter = async () => {
    if (!fd.nom) return;

    const champsOrigine = {
      ethnie: fd.ethnie,
      region_origine: fd.region,
      village_origine: fd.village,
      pays_origine: fd.pays,
      langues: fd.langues,
      generation_label: fd.generation,
      famille_id: familleId,
    };

    let idFinal = cible;

    if (cible === 'nouveau') {
      const { data, error } = await supabase
        .from('membres')
        .insert({ nom: fd.nom, ...champsOrigine })
        .select()
        .single();
      if (error) { alert("Erreur lors de l'ajout : " + error.message); return; }
      idFinal = data.id;
    } else {
      const { error } = await supabase
        .from('membres')
        .update(champsOrigine)
        .eq('id', cible);
      if (error) { alert('Erreur lors de la mise à jour : ' + error.message); return; }
    }

    const extras = chargerExtras();
    extras[idFinal] = { ...(extras[idFinal] || {}), avatar: fd.avatar };
    sauvegarderExtras(extras);

    await chargerMembres(familleId);
    setShowForm(false);
    setFd(fdVide);
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce membre de la famille ? (Il sera aussi retiré de la page Membres et de l\'arbre)')) return;
    const { error } = await supabase.from('membres').delete().eq('id', id);
    if (error) { alert('Erreur lors de la suppression : ' + error.message); return; }
    const extras = chargerExtras();
    delete extras[id];
    sauvegarderExtras(extras);
    await chargerMembres(familleId);
    setSel(null);
  };

  const toggleLangue = (l) => {
    const dejaDedans = fd.langues.includes(l);
    setFd({...fd, langues: dejaDedans ? fd.langues.filter(x=>x!==l) : [...fd.langues, l]});
  };

  // --- Enregistrement audio ---
  const ouvrirModalEnregistrement = () => {
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    setFdTemoignage({ titre:'', langue:'Français', description:'', membreId:'' });
    setShowRecordModal(true);
  };

  const demarrerEnregistrement = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeChoisi = choisirMimeType();
      const recorder = mimeChoisi ? new MediaRecorder(stream, { mimeType: mimeChoisi }) : new MediaRecorder(stream);
      // recorder.mimeType est la valeur réelle utilisée par le navigateur
      // (peut différer légèrement de ce qu'on a demandé, ex: avec les codecs).
      mimeTypeRef.current = recorder.mimeType || mimeChoisi || 'audio/webm';
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
        setAudioBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setEnregistrement(true);
    } catch (e) {
      alert("Impossible d'accéder au micro : " + e.message);
    }
  };

  const arreterEnregistrement = () => {
    mediaRecorderRef.current?.stop();
    setEnregistrement(false);
  };

  const recommencerEnregistrement = () => {
    setAudioBlob(null);
    setAudioPreviewUrl(null);
  };

  const envoyerTemoignage = async () => {
    if (!audioBlob || !fdTemoignage.titre || !familleId) return;
    setEnvoiEnCours(true);

    const mime = mimeTypeRef.current || 'audio/webm';
    const extension = extensionPourMime(mime);
    const chemin = `${familleId}/${Date.now()}.${extension}`;
    const { error: errUpload } = await supabase.storage.from('temoignages').upload(chemin, audioBlob, {
      contentType: mime,
    });

    if (errUpload) {
      alert("Erreur lors de l'envoi de l'audio : " + errUpload.message);
      setEnvoiEnCours(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('temoignages').getPublicUrl(chemin);

    const { data: { user } } = await supabase.auth.getUser();
    const { error: errInsert } = await supabase.from('temoignages').insert({
      famille_id: familleId,
      membre_id: fdTemoignage.membreId || null,
      cree_par: user?.id || null,
      titre: fdTemoignage.titre,
      langue: fdTemoignage.langue,
      description: fdTemoignage.description || null,
      audio_url: urlData.publicUrl,
    });

    if (errInsert) {
      alert("Erreur lors de l'enregistrement : " + errInsert.message);
      setEnvoiEnCours(false);
      return;
    }

    await chargerTemoignages(familleId);
    setEnvoiEnCours(false);
    setShowRecordModal(false);
  };

  const supprimerTemoignage = async (t) => {
    if (!window.confirm('Supprimer ce témoignage ?')) return;
    const chemin = t.audio_url.split('/temoignages/')[1];
    if (chemin) await supabase.storage.from('temoignages').remove([chemin]);
    const { error } = await supabase.from('temoignages').delete().eq('id', t.id);
    if (error) { alert('Erreur lors de la suppression : ' + error.message); return; }
    setTemoignages(temoignages.filter(x => x.id !== t.id));
  };

  const ethniesUniques = [...new Set(membresDocumentes.map(m => m.ethnie))];
  const languesUniques = [...new Set(membresDocumentes.flatMap(m => m.langues||[]))];
  const regionsUniques = [...new Set(membresDocumentes.map(m => m.region).filter(Boolean))];

  if (chargement) {
    return <div className="racines-page"><p style={{padding:'2rem'}}>⏳ Chargement...</p></div>;
  }

  return (
    <div className="racines-page">

      <div className="racines-header">
        <div>
          <h1>🌍 Mes Racines</h1>
          <p>Retrouve et préserve les origines de ta famille · ☁️ sauvegardé sur Supabase</p>
        </div>
        <button className="btn-ajouter-racine" onClick={ouvrirForm}>+ Ajouter une origine</button>
      </div>

      <div className="racines-stats">
        <div className="rstat"><span className="rstat-icon">👥</span><div><h3>{membresDocumentes.length}</h3><p>Membres tracés</p></div></div>
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
            {membresDocumentes.map(m=>(
              <div key={m.id} className="origine-card" onClick={()=>setSel(m)}>
                <div className="origine-avatar">{m.avatar}</div>
                <div className="origine-info">
                  <div className="origine-nom">{m.nom}</div>
                  <div className="origine-gen">{m.generation}</div>
                  <div className="origine-lieu">
                    <span>📍 {m.village || '—'}, {m.region || '—'}</span>
                    <span>🌍 {m.pays || '—'}</span>
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
            <div className="origine-card ajouter" onClick={ouvrirForm}>
              <div className="origine-avatar" style={{fontSize:'2rem'}}>+</div>
              <div className="origine-info">
                <div className="origine-nom">Ajouter un ancêtre</div>
                <div className="origine-gen">Documentez ses origines</div>
              </div>
            </div>
          </div>
          {membresSansOrigine.length > 0 && (
            <p style={{color:'#888', fontSize:'.85rem', marginTop:'1rem'}}>
              {membresSansOrigine.length} membre{membresSansOrigine.length>1?'s':''} de ta famille n'{membresSansOrigine.length>1?'ont':'a'} pas encore d'origine documentée : {membresSansOrigine.map(m=>m.nom).join(', ')}.
            </p>
          )}
        </div>
      )}

      {onglet==='ethnies' && (
        <div className="racines-content">
          <div className="ethnies-section">
            <h3>🌿 Composition ethnique de la famille</h3>
            <div className="ethnies-grid">
              {ethniesUniques.map((e,i)=>{
                const count = membresDocumentes.filter(m=>m.ethnie===e).length;
                const pct = Math.round((count/membresDocumentes.length)*100);
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
                      {membresDocumentes.filter(m=>m.ethnie===e).map((m,j)=>(
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
                const membresLang = membresDocumentes.filter(m=>(m.langues||[]).includes(l));
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
            {temoignages.map((t)=>(
              <div key={t.id} className="audio-card">
                <div className="audio-top">
                  <span className="audio-avatar">🎙️</span>
                  <div>
                    <h4>{t.titre}</h4>
                    <p>{t.membres ? `${t.membres.prenom} ${t.membres.nom}` : (t.profils?.nom_complet || 'Membre')} · {t.langue}</p>
                  </div>
                  {t.cree_par === monUserId && (
                    <button onClick={()=>supprimerTemoignage(t)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'.9rem', opacity:0.5}} title="Supprimer">🗑️</button>
                  )}
                </div>
                {t.description && <p className="audio-desc">{t.description}</p>}
                <audio controls src={t.audio_url} style={{width:'100%', marginTop:'.5rem'}}/>
              </div>
            ))}
            <div className="audio-card ajouter" onClick={ouvrirModalEnregistrement}>
              <div style={{fontSize:'3rem', textAlign:'center', marginBottom:'0.5rem'}}>🎙️</div>
              <h4 style={{textAlign:'center'}}>Enregistrer un témoignage</h4>
              <p style={{textAlign:'center', color:'#888', fontSize:'0.85rem'}}>Capturez la voix d'un ancien de la famille</p>
            </div>
          </div>
          {temoignages.length === 0 && (
            <p style={{color:'#888', fontSize:'.85rem', textAlign:'center', marginTop:'1rem'}}>Aucun témoignage enregistré pour l'instant.</p>
          )}
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
              <div className="dr-item"><span>📍 Village</span><strong>{sel.village || '—'}</strong></div>
              <div className="dr-item"><span>🗺️ Région</span><strong>{sel.region || '—'}</strong></div>
              <div className="dr-item"><span>🌍 Pays</span><strong>{sel.pays || '—'}</strong></div>
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

            <div className="fg-r"><label>Membre concerné</label>
              <select value={cible} onChange={e=>choisirCible(e.target.value === 'nouveau' ? 'nouveau' : e.target.value)}>
                <option value="nouveau">+ Nouveau membre</option>
                {membresSansOrigine.map(m=>(
                  <option key={m.id} value={m.id}>{m.nom} (pas encore d'origine)</option>
                ))}
              </select>
            </div>

            <div className="emoji-picker-r">
              {avatars.map(a=>(
                <button key={a} className={fd.avatar===a?'av-btn actif':'av-btn'} onClick={()=>setFd({...fd,avatar:a})}>{a}</button>
              ))}
            </div>
            <div className="fg-r"><label>Nom complet *</label>
              <input value={fd.nom} onChange={e=>setFd({...fd,nom:e.target.value})} placeholder="ex: Amadou Diallo" disabled={cible !== 'nouveau'}/>
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
            <div className="fg-r"><label>Pays d'origine</label>
              <input value={fd.pays} onChange={e=>setFd({...fd,pays:e.target.value})} placeholder="ex: Sénégal"/>
            </div>
            <div style={{display:'flex', gap:'0.8rem', marginTop:'1rem'}}>
              <button className="btn-fermer-r" onClick={()=>setShowForm(false)} style={{flex:1}}>Annuler</button>
              <button className="btn-fermer-r" onClick={ajouter} disabled={!fd.nom}
                style={{flex:2, background:'#2D6A4F', color:'white', border:'none', opacity:fd.nom?1:0.5}}>
                {cible === 'nouveau' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecordModal && (
        <div className="ov-racines" onClick={()=>{ if(!envoiEnCours) setShowRecordModal(false); }}>
          <div className="modal-racines" onClick={e=>e.stopPropagation()}>
            <button className="xbtn-r" onClick={()=>setShowRecordModal(false)}>✕</button>
            <h3>🎙️ Enregistrer un témoignage</h3>

            <div style={{textAlign:'center', padding:'1.5rem 0'}}>
              {!audioBlob ? (
                <button
                  onClick={enregistrement ? arreterEnregistrement : demarrerEnregistrement}
                  style={{
                    width:'80px', height:'80px', borderRadius:'50%', border:'none',
                    background: enregistrement ? '#EF5350' : '#2D6A4F', color:'white',
                    fontSize:'2rem', cursor:'pointer',
                  }}
                >
                  {enregistrement ? '⏹️' : '🎙️'}
                </button>
              ) : (
                <div>
                  <audio controls src={audioPreviewUrl} style={{width:'100%'}}/>
                  <button onClick={recommencerEnregistrement} style={{marginTop:'.8rem', background:'none', border:'2px solid #ccc', borderRadius:'9px', padding:'.4rem .9rem', cursor:'pointer'}}>
                    🔄 Recommencer
                  </button>
                </div>
              )}
              <p style={{color:'#888', fontSize:'.82rem', marginTop:'.6rem'}}>
                {enregistrement ? '🔴 Enregistrement en cours...' : (audioBlob ? 'Écoute avant d\'envoyer' : 'Clique pour commencer à enregistrer')}
              </p>
            </div>

            {audioBlob && (
              <>
                <div className="fg-r"><label>Titre *</label>
                  <input value={fdTemoignage.titre} onChange={e=>setFdTemoignage({...fdTemoignage,titre:e.target.value})} placeholder="ex: Histoire des origines Peul"/>
                </div>
                <div className="fg-r"><label>Concerne quel membre ? (optionnel)</label>
                  <select value={fdTemoignage.membreId} onChange={e=>setFdTemoignage({...fdTemoignage,membreId:e.target.value})}>
                    <option value="">Aucun en particulier</option>
                    {membres.map(m=><option key={m.id} value={m.id}>{m.nom}</option>)}
                  </select>
                </div>
                <div className="fg-r"><label>Langue</label>
                  <select value={fdTemoignage.langue} onChange={e=>setFdTemoignage({...fdTemoignage,langue:e.target.value})}>
                    {langues.map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="fg-r"><label>Description</label>
                  <textarea value={fdTemoignage.description} onChange={e=>setFdTemoignage({...fdTemoignage,description:e.target.value})} placeholder="De quoi parle ce témoignage ?" rows={2} style={{resize:'none',fontFamily:'inherit',padding:'0.6rem 0.8rem',border:'2px solid #f0f0f0',borderRadius:'10px',outline:'none',width:'100%'}}/>
                </div>
                <div style={{display:'flex', gap:'0.8rem', marginTop:'1rem'}}>
                  <button className="btn-fermer-r" onClick={()=>setShowRecordModal(false)} style={{flex:1}} disabled={envoiEnCours}>Annuler</button>
                  <button className="btn-fermer-r" onClick={envoyerTemoignage} disabled={!fdTemoignage.titre || envoiEnCours}
                    style={{flex:2, background:'#2D6A4F', color:'white', border:'none', opacity:fdTemoignage.titre?1:0.5}}>
                    {envoiEnCours ? 'Envoi...' : 'Enregistrer le témoignage'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}