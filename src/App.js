import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Famille from './Famille';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [langueActive, setLangueActive] = useState('fr');
  const [page, setPage] = useState('accueil');
  const [session, setSession] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà connecté au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setPage('dashboard');
      setChargement(false);
    });

    // Écoute les changements de session (connexion / déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setPage('dashboard');
      else setPage('accueil');
    });

    window.addEventListener('goToFamille', () => setPage('famille'));
    window.addEventListener('goToDashboard', () => setPage('dashboard'));

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('goToFamille', () => setPage('famille'));
      window.removeEventListener('goToDashboard', () => setPage('dashboard'));
    };
  }, []);

  const seDeconnecter = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setPage('accueil');
  };

  if (chargement) return <Loader />;

  if (page === 'auth') return <Auth />;
  if (page === 'famille') return <Famille onRetour={() => setPage('accueil')} />;
  if (page === 'dashboard') return <Dashboard onRetour={seDeconnecter} />;

  const textes = {
    fr: {
      slogan: "Retrouve tes racines, protège ton héritage",
      description: "Yëkëni te permet de créer l'arbre généalogique de ta famille, de préserver vos souvenirs et de rester connecté à tes racines, où que tu sois dans le monde.",
      creer: "Créer mon arbre familial",
      rejoindre: "Rejoindre ma famille",
    },
    wo: {
      slogan: "Dem sa dëkk, bind sa mbokk",
      description: "Yëkëni mën na la jëfandikoo ngir def arbre généalogique bi sa mbokk.",
      creer: "Def sa arbre familial",
      rejoindre: "Dugg ci sa mbokk",
    }
  };

  const t = textes[langueActive] || textes['fr'];

  return (
    <div className="app">

      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Yëkëni" className="logo-img" style={{mixBlendMode:'multiply'}}/>
          <span className="logo-text">Yëkëni</span>
        </div>
        <nav className="nav">
          <a href="#accueil">Accueil</a>
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#sante">Santé</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="nav-right">
          <div className="langue-switcher">
            <button onClick={() => setLangueActive('fr')} className={langueActive === 'fr' ? 'actif' : ''}>FR</button>
            <button onClick={() => setLangueActive('wo')} className={langueActive === 'wo' ? 'actif' : ''}>WO</button>
          </div>
          <button className="btn-login" onClick={() => setPage('auth')}>Se connecter</button>
          <button className="btn-register" onClick={() => setPage('auth')}>Commencer</button>
        </div>
      </header>

      <section className="hero" id="accueil">
        <div className="hero-content">
          <div className="hero-logo-large">
            <img src="/logo.png" alt="Yëkëni" style={{mixBlendMode:'multiply', background:'transparent'}}/>
          </div>
          <div className="badge">🇸🇳 La première app familiale africaine</div>
          <h1 className="hero-title">
            {t.slogan.split(',')[0]},<br />
            <span className="highlight">{t.slogan.split(',')[1]}</span>
          </h1>
          <p className="hero-subtitle">{t.description}</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => setPage('auth')}>🌳 {t.creer}</button>
            <button className="btn-secondary" onClick={() => setPage('auth')}>🔑 {t.rejoindre}</button>
          </div>
          <p className="hero-lang">🌍 Disponible en Français · Wolof · Pulaar · Sérère</p>
        </div>
        <div className="hero-visual">
          <div className="tree-preview">
            <div className="tree-row">
              <div className="tree-node root">
                <div className="node-avatar">👴</div>
                <p className="node-name">Grand-père</p>
              </div>
              <div className="tree-node root">
                <div className="node-avatar">👵</div>
                <p className="node-name">Grand-mère</p>
              </div>
            </div>
            <div className="tree-connector"></div>
            <div className="tree-row">
              <div className="tree-node">
                <div className="node-avatar">👨</div>
                <p className="node-name">Père</p>
              </div>
              <div className="tree-node">
                <div className="node-avatar">👩</div>
                <p className="node-name">Mère</p>
              </div>
            </div>
            <div className="tree-connector"></div>
            <div className="tree-row">
              <div className="tree-node you">
                <div className="node-avatar">🧒</div>
                <p className="node-name">Toi</p>
              </div>
              <div className="tree-node">
                <div className="node-avatar">🧒</div>
                <p className="node-name">Frère</p>
              </div>
              <div className="tree-node">
                <div className="node-avatar">👧</div>
                <p className="node-name">Sœur</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="fonctionnalites">
        <h2>Tout ce dont ta famille a besoin</h2>
        <div className="features-grid">
          {[
            { icon:'🔐', titre:'Code QR Secret', desc:'Chaque famille a un code unique. Seuls les membres invités peuvent rejoindre ta branche.' },
            { icon:'🌳', titre:'Arbre Interactif', desc:'Visualise ta famille sur un arbre généalogique beau et interactif, zoomable et navigable.' },
            { icon:'📸', titre:'Mémoire Familiale', desc:'Partagez photos, souvenirs et histoires pour que les générations futures se souviennent.' },
            { icon:'🌍', titre:'Carte Familiale', desc:'Découvre où vivent tous les membres de ta famille à travers le monde.' },
            { icon:'🎂', titre:'Événements', desc:'Ne manque plus aucun anniversaire ou événement familial grâce aux rappels automatiques.' },
            { icon:'🤖', titre:'Intelligence Artificielle', desc:"L'IA génère automatiquement la biographie de chaque membre et identifie les visages." },
          ].map((f,i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.titre}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sante" id="sante">
        <div className="sante-content">
          <div className="sante-text">
            <div className="badge-sante">🩺 Nouveau — Santé Familiale</div>
            <h2>La santé de ta famille,<br /><span className="highlight">protégée et partagée</span></h2>
            <p>Yëkëni va au-delà de l'arbre généalogique. Documente les informations médicales de chaque membre pour protéger les générations futures.</p>
            <div className="sante-features">
              {[
                { icon:'🩸', titre:'Groupes sanguins', desc:"Sachez immédiatement qui peut donner du sang à qui en cas d'urgence." },
                { icon:'🧬', titre:'Maladies héréditaires', desc:"Drépanocytose, diabète, hypertension... documentez l'historique médical familial." },
                { icon:'💊', titre:'Allergies & Traitements', desc:'Conservez les allergies et traitements de chaque membre en lieu sûr.' },
                { icon:'🔒', titre:'Données chiffrées', desc:'Vos données de santé sont ultra-privées. Seul vous et les admins y accèdent.' },
              ].map((s,i) => (
                <div className="sante-item" key={i}>
                  <span>{s.icon}</span>
                  <div><h4>{s.titre}</h4><p>{s.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="sante-card">
            <div className="carte-sante">
              <div className="carte-header">
                <span>🩺</span>
                <h4>Fiche Santé — Membre</h4>
              </div>
              <div className="carte-body">
                {[
                  { label:'Nom', value:'Moussa Diallo', cls:'' },
                  { label:'Groupe sanguin', value:'O+', cls:'blood' },
                  { label:'Maladie héréditaire', value:'Drépanocytose', cls:'warning' },
                  { label:'Allergie', value:'Pénicilline', cls:'warning' },
                  { label:'Accès', value:'🔒 Admins uniquement', cls:'secure' },
                ].map((row,i) => (
                  <div className="info-row" key={i}>
                    <span className="label">{row.label}</span>
                    <span className={`value ${row.cls}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        {[
          { val:'10K+', label:'Familles connectées' },
          { val:'50K+', label:'Membres enregistrés' },
          { val:'15+', label:'Pays africains' },
          { val:'4', label:'Langues locales' },
        ].map((s,i) => (
          <div className="stat" key={i}>
            <h3>{s.val}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <img src="/logo.png" alt="Yëkëni" className="logo-img" style={{mixBlendMode:'multiply'}}/>
              <span className="logo-text" style={{color:'white'}}>Yëkëni</span>
            </div>
            <p>Se retrouver, se reconnaître</p>
          </div>
          <div className="footer-links">
            <a href="#accueil">Accueil</a>
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#sante">Santé</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <p className="footer-bottom">Fait avec ❤️ au Sénégal · © 2025 Yëkëni</p>
      </footer>

    </div>
  );
}

export default App;