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
            </div>
          )}

          {mode === 'code' && (
            <div className="auth-form">
              <h2>Rejoindre une famille 🔑</h2>
              <p className="auth-desc">Entre le code secret de ta famille</p>
              <div className="form-group">
                <label>Code famille</label>
                <input type="text" placeholder="ex: YEK-9KKUKQ" style={{textTransform:'uppercase', letterSpacing:'3px', fontWeight:'700'}}/>
              </div>
              <button className="btn-auth" onClick={() => window.dispatchEvent(new CustomEvent('goToDashboard'))}>
                Rejoindre la famille 🌳
              </button>
              <button className="btn-retour" onClick={() => setMode('connexion')}>← Retour</button>
            </div>
          )}

          {mode === 'inscription' && (
            <div className="auth-form">
              <h2>Bienvenue ! 🌳</h2>
              <p className="auth-desc">Crée ton compte et commence ton arbre familial</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" placeholder="Moussa" />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" placeholder="Diallo" />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse email</label>
                <input type="email" placeholder="exemple@email.com" />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>Langue préférée</label>
                <select>
                  <option>Français</option>
                  <option>Wolof</option>
                  <option>Pulaar</option>
                  <option>Sérère</option>
                </select>
              </div>
              <button className="btn-auth" onClick={() => window.dispatchEvent(new CustomEvent('goToFamille'))}>
                Créer mon compte
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Auth;