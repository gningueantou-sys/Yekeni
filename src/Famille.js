import { QRCodeSVG as QRCode } from 'qrcode.react';
import React, { useState } from 'react';
import './Famille.css';

function Famille({ onRetour }) {
  const [etape, setEtape] = useState(1);
  const [famille, setFamille] = useState({
    nom: '',
    clan: '',
    pays: '',
    langue: 'Français',
    description: ''
  });

  const codeGenere = 'YEK-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleChange = (e) => {
    setFamille({ ...famille, [e.target.name]: e.target.value });
  };

  return (
    <div className="famille-page">
      <div className="famille-header">
        <button className="btn-retour" onClick={onRetour}>← Retour</button>
        <div className="logo">
          <span>🌳</span>
          <span className="logo-text">Yëkëni</span>
        </div>
        <div className="etapes">
          <div className={`etape ${etape >= 1 ? 'actif' : ''}`}>1</div>
          <div className="etape-line"></div>
          <div className={`etape ${etape >= 2 ? 'actif' : ''}`}>2</div>
          <div className="etape-line"></div>
          <div className={`etape ${etape >= 3 ? 'actif' : ''}`}>3</div>
        </div>
      </div>

      {etape === 1 && (
        <div className="famille-content">
          <div className="famille-box">
            <div className="famille-icon">🏡</div>
            <h2>Crée ta famille</h2>
            <p className="famille-desc">Commence par donner un nom à ta branche familiale</p>
            <div className="form-group">
              <label>Nom de famille *</label>
              <input type="text" name="nom" placeholder="ex: Famille Diallo" value={famille.nom} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Nom du clan ou lignée</label>
              <input type="text" name="clan" placeholder="ex: Clan des Diallo du Fouta" value={famille.clan} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Pays d'origine</label>
                <select name="pays" value={famille.pays} onChange={handleChange}>
                  <option value="">Choisir...</option>
                  <option>Sénégal</option>
                  <option>Mali</option>
                  <option>Guinée</option>
                  <option>Côte d'Ivoire</option>
                  <option>Burkina Faso</option>
                  <option>Niger</option>
                  <option>Mauritanie</option>
                  <option>Gambie</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Langue familiale</label>
                <select name="langue" value={famille.langue} onChange={handleChange}>
                  <option>Français</option>
                  <option>Wolof</option>
                  <option>Pulaar</option>
                  <option>Sérère</option>
                  <option>Mandingue</option>
                  <option>Soninké</option>
                  <option>Diola</option>
                  <option>Bambara</option>
                  <option>Haoussa</option>
                  <option>Yoruba</option>
                  <option>Igbo</option>
                  <option>Lingala</option>
                  <option>Swahili</option>
                  <option>Arabe</option>
                  <option>Autre</option>
                </select>
                {famille.langue === 'Autre' && (
                  <input type="text" name="langue" placeholder="Écris ta langue ici..." onChange={handleChange} style={{marginTop: '0.5rem'}} />
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Description de la famille</label>
              <textarea name="description" placeholder="Racontez l'histoire de votre famille..." value={famille.description} onChange={handleChange} rows={3} />
            </div>
            <button className="btn-suivant" onClick={() => setEtape(2)} disabled={!famille.nom}>
              Suivant →
            </button>
          </div>
        </div>
      )}

      {etape === 2 && (
        <div className="famille-content">
          <div className="famille-box">
            <div className="famille-icon">🔐</div>
            <h2>Ton code famille secret</h2>
            <p className="famille-desc">Ce code unique permet à tes proches de rejoindre ta branche familiale. Partage-le uniquement avec les membres de ta famille.</p>
            <div className="code-display">
              <div className="code-badge">{codeGenere}</div>
              <p className="code-hint">🔒 Ce code est unique et confidentiel</p>
            </div>
            <div className="qr-placeholder">
              <div className="qr-box">
                <QRCode value={codeGenere} size={140} bgColor="#ffffff" fgColor="#1B4332" level="H" />
              </div>
              <p>Tes membres peuvent scanner ce QR code pour rejoindre la famille</p>
            </div>
            <div className="niveau-acces">
              <h4>🛡️ Niveaux d'accès</h4>
              <div className="acces-grid">
                <div className="acces-card admin">
                  <span>👑</span>
                  <h5>Administrateur</h5>
                  <p>Accès total + données santé</p>
                </div>
                <div className="acces-card membre">
                  <span>👤</span>
                  <h5>Membre</h5>
                  <p>Voir et ajouter des membres</p>
                </div>
                <div className="acces-card invite">
                  <span>👁️</span>
                  <h5>Invité</h5>
                  <p>Vue limitée de l'arbre</p>
                </div>
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-retour-etape" onClick={() => setEtape(1)}>← Retour</button>
              <button className="btn-suivant" onClick={() => setEtape(3)}>Suivant →</button>
            </div>
          </div>
        </div>
      )}

      {etape === 3 && (
        <div className="famille-content">
          <div className="famille-box">
            <div className="famille-icon success">✅</div>
            <h2>Famille créée avec succès !</h2>
            <p className="famille-desc">Ta branche familiale <strong>{famille.nom}</strong> est prête.</p>
            <div className="recap">
              <div className="recap-item">
                <span className="recap-label">Famille</span>
                <span className="recap-value">{famille.nom}</span>
              </div>
              {famille.clan && (
                <div className="recap-item">
                  <span className="recap-label">Clan</span>
                  <span className="recap-value">{famille.clan}</span>
                </div>
              )}
              {famille.pays && (
                <div className="recap-item">
                  <span className="recap-label">Pays</span>
                  <span className="recap-value">{famille.pays}</span>
                </div>
              )}
              <div className="recap-item">
                <span className="recap-label">Langue</span>
                <span className="recap-value">{famille.langue}</span>
              </div>
              <div className="recap-item">
                <span className="recap-label">Code secret</span>
                <span className="recap-value code">{codeGenere}</span>
              </div>
            </div>
            <div className="prochaines-etapes">
              <h4>🚀 Prochaines étapes</h4>
              <div className="etape-item">
                <span>👥</span>
                <p>Inviter les membres de ta famille</p>
              </div>
              <div className="etape-item">
                <span>🌳</span>
                <p>Construire ton arbre généalogique</p>
              </div>
              <div className="etape-item">
                <span>📸</span>
                <p>Ajouter des photos et souvenirs</p>
              </div>
            </div>
      <button className="btn-suivant" onClick={() => window.dispatchEvent(new CustomEvent('goToDashboard'))}>
  🌳 Commencer mon arbre familial
</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Famille;