import React, { useState } from 'react';
import './App.css';

function App() {
  const [langueActive, setLangueActive] = useState('fr');

  const textes = {
    fr: {
      slogan: "Retrouve tes racines, protège ton héritage",
      description: "Yëkëni te permet de créer l'arbre généalogique de ta famille, de préserver vos souvenirs, votre santé et de rester connecté à tes racines, où que tu sois dans le monde.",
      creer: "Créer mon arbre familial",
      rejoindre: "Rejoindre ma famille",
      fonctionnalites: "Tout ce dont ta famille a besoin",
    },
    wo: {
      slogan: "Dem sa dëkk, bind sa mbokk",
      description: "Yëkëni mën na la jëfandikoo ngir def arbre généalogique bi sa mbokk, diisël seen xam-xam ak seen wér-gi.",
      creer: "Def sa arbre familial",
      rejoindre: "Dugg ci sa mbokk",
      fonctionnalites: "Lañuy bëgg ci sa mbokk",
    }
  };

  const t = textes[langueActive] || textes['fr'];

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Yëkëni" style={{width:'38px', height:'38px', objectFit:'contain'}} />
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
          <button className="btn-login">Se connecter</button>
          <button className="btn-register">Commencer</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="accueil">
        <div className="hero-content">
          <div className="badge">🇸🇳 La première app familiale africaine</div>
          <h1 className="hero-title">
            {t.slogan.split(',')[0]},<br />
            <span className="highlight">{t.slogan.split(',')[1]}</span>
          </h1>
          <p className="hero-subtitle">{t.description}</p>
          <div className="hero-buttons">
            <button className="btn-primary">🌳 {t.creer}</button>
            <button className="btn-secondary">🔑 {t.rejoindre}</button>
          </div>
          <p className="hero-lang">🌍 Disponible en Français · Wolof · Pulaar · Sérère</p>
        </div>
        <div className="hero-visual">
          <div className="tree-preview">
            <div className="tree-node root">
              <div className="node-avatar">👴</div>
              <p className="node-name">Grand-père</p>
              <span className="node-blood">O+</span>
            </div>
            <div className="tree-connector"></div>
            <div className="tree-row">
              <div className="tree-node">
                <div className="node-avatar">👨</div>
                <p className="node-name">Père</p>
                <span className="node-blood">A+</span>
              </div>
              <div className="tree-node">
                <div className="node-avatar">👩</div>
                <p className="node-name">Mère</p>
                <span className="node-blood">B+</span>
              </div>
            </div>
            <div className="tree-connector"></div>
            <div className="tree-row">
              <div className="tree-node you">
                <div className="node-avatar">🧒</div>
                <p className="node-name">Toi</p>
                <span className="node-blood">AB+</span>
              </div>
              <div className="tree-node">
                <div className="node-avatar">🧒</div>
                <p className="node-name">Frère</p>
                <span className="node-blood">A+</span>
              </div>
              <div className="tree-node">
                <div className="node-avatar">👧</div>
                <p className="node-name">Sœur</p>
                <span className="node-blood">O+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITES */}
      <section className="features" id="fonctionnalites">
        <h2>{t.fonctionnalites}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔐</span>
            <h3>Code QR Secret</h3>
            <p>Chaque famille a un code unique. Seuls les membres invités peuvent rejoindre ta branche.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🌳</span>
            <h3>Arbre Interactif</h3>
            <p>Visualise ta famille sur un arbre généalogique beau et interactif, zoomable et navigable.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📸</span>
            <h3>Mémoire Familiale</h3>
            <p>Partagez photos, souvenirs et histoires pour que les générations futures se souviennent.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🌍</span>
            <h3>Carte Familiale</h3>
            <p>Découvre où vivent tous les membres de ta famille à travers le monde.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎂</span>
            <h3>Événements</h3>
            <p>Ne manque plus aucun anniversaire ou événement familial grâce aux rappels automatiques.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <h3>Intelligence Artificielle</h3>
            <p>L'IA génère automatiquement la biographie de chaque membre et identifie les visages.</p>
          </div>
        </div>
      </section>

      {/* SANTE FAMILIALE */}
      <section className="sante" id="sante">
        <div className="sante-content">
          <div className="sante-text">
            <div className="badge-sante">🩺 Nouveau — Santé Familiale</div>
            <h2>La santé de ta famille,<br /><span className="highlight">protégée et partagée</span></h2>
            <p>Yëkëni va au-delà de l'arbre généalogique. Documente les informations médicales de chaque membre pour protéger les générations futures.</p>
            <div className="sante-features">
              <div className="sante-item">
                <span>🩸</span>
                <div>
                  <h4>Groupes sanguins</h4>
                  <p>Sachez immédiatement qui peut donner du sang à qui en cas d'urgence.</p>
                </div>
              </div>
              <div className="sante-item">
                <span>🧬</span>
                <div>
                  <h4>Maladies héréditaires</h4>
                  <p>Drépanocytose, diabète, hypertension... documentez l'historique médical familial.</p>
                </div>
              </div>
              <div className="sante-item">
                <span>💊</span>
                <div>
                  <h4>Allergies & Traitements</h4>
                  <p>Conservez les allergies et traitements de chaque membre en lieu sûr.</p>
                </div>
              </div>
              <div className="sante-item">
                <span>🔒</span>
                <div>
                  <h4>Données chiffrées</h4>
                  <p>Vos données de santé sont ultra-privées. Seul vous et les admins y accèdent.</p>
                </div>
          </div>
            </div>
          </div>
          <div className="sante-card">
            <div className="carte-sante">
              <div className="carte-header">
                <span>🩺</span>
                <h4>Fiche Santé — Membre</h4>
              </div>
              <div className="carte-body">
                <div className="info-row">
                  <span className="label">Nom</span>
                  <span className="value">Moussa Diallo</span>
                </div>
                <div className="info-row">
                  <span className="label">Groupe sanguin</span>
                  <span className="value blood">O+</span>
                </div>
                <div className="info-row">
                  <span className="label">Maladie héréditaire</span>
                  <span className="value warning">Drépanocytose</span>
                </div>
                <div className="info-row">
                  <span className="label">Allergie</span>
                  <span className="value warning">Pénicilline</span>
                </div>
                <div className="info-row">
                  <span className="label">Accès</span>
                  <span className="value secure">🔒 Admins uniquement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat">
          <h3>10K+</h3>
          <p>Familles connectées</p>
        </div>
        <div className="stat">
          <h3>50K+</h3>
          <p>Membres enregistrés</p>
        </div>
        <div className="stat">
          <h3>15+</h3>
          <p>Pays africains</p>
        </div>
        <div className="stat">
          <h3>4</h3>
          <p>Langues locales</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>🌳 Yëkëni</span>
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