import React, { useState } from 'react';
import './Auth.css';
import { supabase } from './supabaseClient';

function Auth() {
  const [mode, setMode] = useState('connexion');

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Erreur connexion Google :', error.message);
    }
  }

  // --- Connexion par email ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  async function handleEmailSignIn() {
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setLoginError('Email ou mot de passe incorrect.');
      return;
    }
    window.dispatchEvent(new CustomEvent('goToDashboard'));
  }

  // --- Inscription par email ---
  const [inscPrenom, setInscPrenom] = useState('');
  const [inscNom, setInscNom] = useState('');
  const [inscEmail, setInscEmail] = useState('');
  const [inscPassword, setInscPassword] = useState('');
  const [inscLangue, setInscLangue] = useState('Français');
  const [inscError, setInscError] = useState('');
  const [inscChargement, setInscChargement] = useState(false);

  async function handleEmailSignUp() {
    setInscError('');
    if (!inscPrenom || !inscNom || !inscEmail || !inscPassword) {
      setInscError('Merci de remplir tous les champs.');
      return;
    }

    setInscChargement(true);
    const { data, error } = await supabase.auth.signUp({
      email: inscEmail,
      password: inscPassword,
    });

    if (error) {
      setInscError(error.message);
      setInscChargement(false);
      return;
    }

    if (data.user) {
      const { error: errProfil } = await supabase
        .from('profils')
        .update({ nom_complet: `${inscPrenom} ${inscNom}` })
        .eq('id', data.user.id);
      if (errProfil) console.error('Erreur mise à jour profil :', errProfil);
    }

    setInscChargement(false);
    window.dispatchEvent(new CustomEvent('goToFamille'));
  }

  // --- Rejoindre une famille avec un code ---
  const [rPrenom, setRPrenom] = useState('');
  const [rNom, setRNom] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rCode, setRCode] = useState('');
  const [rError, setRError] = useState('');
  const [rChargement, setRChargement] = useState(false);

  async function handleRejoindre() {
    setRError('');
    if (!rPrenom || !rNom || !rEmail || !rPassword || !rCode) {
      setRError('Merci de remplir tous les champs, y compris le code.');
      return;
    }

    setRChargement(true);

    const { data: famille, error: errFamille } = await supabase
      .from('familles')
      .select('id')
      .eq('code_invitation', rCode.trim().toUpperCase())
      .single();

    if (errFamille || !famille) {
      setRError('Code famille invalide.');
      setRChargement(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: rEmail,
      password: rPassword,
    });

    if (error) {
      setRError(error.message);
      setRChargement(false);
      return;
    }

    if (data.user) {
      const { error: errProfil } = await supabase
        .from('profils')
        .update({ nom_complet: `${rPrenom} ${rNom}`, famille_id: famille.id })
        .eq('id', data.user.id);
      if (errProfil) {
        setRError("Compte créé mais erreur lors du rattachement à la famille : " + errProfil.message);
        setRChargement(false);
        return;
      }
    }

    setRChargement(false);
    window.dispatchEvent(new CustomEvent('goToDashboard'));
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo">🌳</span>
          <h1>Yëkëni</h1>
          <p>Retrouve tes racines,<br />protège ton héritage</p>
        </div>
        <div className="auth-tree">
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
          <div className="a-row">
            <div className="a-node"><span>👨</span><p>Père</p></div>
            <div className="a-node"><span>👩</span><p>Mère</p></div>
          </div>
          <div className="a-row">
            <div className="a-node you"><span>🧒</span><p>Toi</p></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-tabs">
            <button className={mode === 'connexion' ? 'tab actif' : 'tab'} onClick={() => setMode('connexion')}>
              Se connecter
            </button>
            <button className={mode === 'inscription' ? 'tab actif' : 'tab'} onClick={() => setMode('inscription')}>
              S'inscrire
            </button>
          </div>

          {mode === 'connexion' && (
            <div className="auth-form">
              <h2>Bon retour ! 👋</h2>
              <p className="auth-desc">Connecte-toi pour retrouver ta famille</p>
              <button type="button" className="btn-google" onClick={handleGoogleSignIn}>
                <img src="/icons/google.svg" alt="" width="18" height="18" />
                Continuer avec Google
              </button>
              <div className="divider"><span>ou</span></div>
              <div className="form-group">
                <label>Adresse email</label>
                <input type="email" placeholder="exemple@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
              </div>
              {loginError && <p style={{color:'#EF5350', fontSize:'.82rem', marginTop:'-8px'}}>{loginError}</p>}
              <a href="#" className="forgot">Mot de passe oublié ?</a>
              <button className="btn-auth" onClick={handleEmailSignIn}>
                Se connecter
              </button>
              <button type="button" className="btn-retour" style={{marginTop:'.6rem'}} onClick={() => setMode('code')}>
                🔑 J'ai un code famille pour rejoindre les miens
              </button>
            </div>
          )}

          {mode === 'code' && (
            <div className="auth-form">
              <h2>Rejoindre une famille 🔑</h2>
              <p className="auth-desc">Crée ton compte et entre le code secret de ta famille</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" placeholder="Moussa" value={rPrenom} onChange={e => setRPrenom(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" placeholder="Diallo" value={rNom} onChange={e => setRNom(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse email</label>
                <input type="email" placeholder="exemple@email.com" value={rEmail} onChange={e => setREmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••" value={rPassword} onChange={e => setRPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Code famille</label>
                <input
                  type="text"
                  placeholder="ex: YEK-9KKUKQ"
                  style={{textTransform:'uppercase', letterSpacing:'3px', fontWeight:'700'}}
                  value={rCode}
                  onChange={e => setRCode(e.target.value)}
                />
              </div>
              {rError && <p style={{color:'#EF5350', fontSize:'.82rem'}}>{rError}</p>}
              <button className="btn-auth" onClick={handleRejoindre} disabled={rChargement}>
                {rChargement ? 'Vérification...' : 'Rejoindre la famille 🌳'}
              </button>
              <button className="btn-retour" onClick={() => setMode('connexion')}>← Retour</button>
            </div>
          )}

          {mode === 'inscription' && (
            <div className="auth-form">
              <h2>Bienvenue ! 🌳</h2>
              <p className="auth-desc">Crée ton compte et commence ton arbre familial</p>
              <button type="button" className="btn-google" onClick={handleGoogleSignIn}>
                <img src="/icons/google.svg" alt="" width="18" height="18" />
                Continuer avec Google
              </button>
              <div className="divider"><span>ou</span></div>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" placeholder="Moussa" value={inscPrenom} onChange={e => setInscPrenom(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" placeholder="Diallo" value={inscNom} onChange={e => setInscNom(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse email</label>
                <input type="email" placeholder="exemple@email.com" value={inscEmail} onChange={e => setInscEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••" value={inscPassword} onChange={e => setInscPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Langue préférée</label>
                <select value={inscLangue} onChange={e => setInscLangue(e.target.value)}>
                  <option>Français</option>
                  <option>Wolof</option>
                  <option>Pulaar</option>
                  <option>Sérère</option>
                </select>
              </div>
              {inscError && <p style={{color:'#EF5350', fontSize:'.82rem'}}>{inscError}</p>}
              <button className="btn-auth" onClick={handleEmailSignUp} disabled={inscChargement}>
                {inscChargement ? 'Création...' : 'Créer mon compte'}
              </button>
              <button type="button" className="btn-retour" style={{marginTop:'.6rem'}} onClick={() => setMode('code')}>
                🔑 J'ai un code famille pour rejoindre les miens
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Auth;