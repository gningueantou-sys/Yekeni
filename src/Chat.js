import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './Chat.css';

const reactions = ['❤️', '😂', '😮', '🙏', '👍', '🎉'];

const messagesRapides = [
  'Alhamdoulilah ! 🙏',
  'Je pense à vous ❤️',
  'Bonne journée à tous ! ☀️',
  'Salam aleikoum ! 🌙',
];

function Chat() {
  const [messages, setMessages] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [familleId, setFamilleId] = useState(null);
  const [monUserId, setMonUserId] = useState(null);
  const [nombreMembres, setNombreMembres] = useState(0);
  const [nouveau, setNouveau] = useState('');
  const [showReactions, setShowReactions] = useState(null);
  const messagesEndRef = useRef(null);
  const profilsMapRef = useRef({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mapRow = (row, monId) => {
    const profil = profilsMapRef.current[row.auteur_id];
    return {
      id: row.id,
      auteur: profil?.nom_complet || 'Membre',
      avatarUrl: profil?.avatar_url || null,
      texte: row.texte,
      heure: new Date(row.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      moi: row.auteur_id === monId,
      reactions: row.reactions || {},
    };
  };

  useEffect(() => {
    let canal;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }
      setMonUserId(user.id);

      const { data: profil, error: err1 } = await supabase
        .from('profils')
        .select('famille_id')
        .eq('id', user.id)
        .single();

      if (err1 || !profil?.famille_id) { setChargement(false); return; }
      setFamilleId(profil.famille_id);

      const { data: profilsFamille } = await supabase
        .from('profils')
        .select('id, nom_complet, avatar_url')
        .eq('famille_id', profil.famille_id);

      const map = {};
      (profilsFamille || []).forEach(p => { map[p.id] = p; });
      profilsMapRef.current = map;
      setNombreMembres(profilsFamille?.length || 0);

      const { data: messagesData, error: err2 } = await supabase
        .from('messages')
        .select('*')
        .eq('famille_id', profil.famille_id)
        .order('created_at', { ascending: true })
        .limit(200);

      if (err2) console.error('Erreur chargement messages :', err2);
      setMessages((messagesData || []).map(r => mapRow(r, user.id)));
      setChargement(false);

      // Temps réel : nouveaux messages et mises à jour de réactions
      canal = supabase
        .channel(`messages-${profil.famille_id}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'messages',
          filter: `famille_id=eq.${profil.famille_id}`,
        }, (payload) => {
          setMessages(prev => [...prev, mapRow(payload.new, user.id)]);
        })
        .on('postgres_changes', {
          event: 'UPDATE', schema: 'public', table: 'messages',
          filter: `famille_id=eq.${profil.famille_id}`,
        }, (payload) => {
          setMessages(prev => prev.map(m => m.id === payload.new.id ? mapRow(payload.new, user.id) : m));
        })
        .subscribe();
    }

    init();

    return () => { if (canal) supabase.removeChannel(canal); };
  }, []);

  const envoyerMessage = async () => {
    if (!nouveau.trim() || !familleId || !monUserId) return;
    const texte = nouveau;
    setNouveau('');

    const { error } = await supabase.from('messages').insert({
      famille_id: familleId,
      auteur_id: monUserId,
      texte,
    });

    if (error) {
      alert("Erreur lors de l'envoi : " + error.message);
      setNouveau(texte);
    }
    // Le message apparaît via l'abonnement temps réel, pas besoin de l'ajouter ici.
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  };

  const ajouterReaction = async (msgId, reaction) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;
    const nouvellesReactions = { ...msg.reactions, [reaction]: (msg.reactions[reaction] || 0) + 1 };

    const { error } = await supabase.from('messages').update({ reactions: nouvellesReactions }).eq('id', msgId);
    if (error) console.error('Erreur réaction :', error);
    setShowReactions(null);
    // La mise à jour visible vient aussi de l'abonnement temps réel.
  };

  if (chargement) {
    return <div className="chat-page"><p style={{padding:'2rem'}}>⏳ Chargement du chat...</p></div>;
  }

  return (
    <div className="chat-page">

      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-famille-avatar">👨‍👩‍👧‍👦</div>
          <div>
            <h2>Chat familial</h2>
            <p>{nombreMembres} membre{nombreMembres>1?'s':''}</p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        <div className="chat-date">Aujourd'hui</div>
        {messages.map(m => (
          <div key={m.id} className={`message-wrapper ${m.moi ? 'moi' : ''}`}>
            {!m.moi && (
              m.avatarUrl
                ? <img src={m.avatarUrl} alt={m.auteur} className="msg-avatar" style={{objectFit:'cover'}}/>
                : <span className="msg-avatar">👤</span>
            )}
            <div className="message-bubble-wrapper">
              {!m.moi && <p className="msg-nom">{m.auteur}</p>}
              <div
                className={`message-bubble ${m.moi ? 'moi' : ''}`}
                onMouseEnter={() => setShowReactions(m.id)}
                onMouseLeave={() => setShowReactions(null)}
              >
                <p>{m.texte}</p>
                <span className="msg-heure">{m.heure}</span>
                {showReactions === m.id && (
                  <div className="reactions-picker">
                    {reactions.map(r => (
                      <button key={r} onClick={() => ajouterReaction(m.id, r)}>{r}</button>
                    ))}
                  </div>
                )}
              </div>
              {m.reactions && Object.keys(m.reactions).length > 0 && (
                <div className="reactions-display">
                  {Object.entries(m.reactions).map(([r, count]) => (
                    <span key={r} className="reaction-tag">{r} {count}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p style={{textAlign:'center', color:'#888', padding:'2rem'}}>Aucun message pour l'instant — dis bonjour à la famille !</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* MESSAGES RAPIDES */}
      <div className="messages-rapides">
        {messagesRapides.map((mr, i) => (
          <button key={i} className="msg-rapide" onClick={() => setNouveau(mr)}>
            {mr}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input-zone">
        <textarea
          placeholder="Écrire un message à la famille..."
          value={nouveau}
          onChange={(e) => setNouveau(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button
          className="btn-envoyer"
          onClick={envoyerMessage}
          disabled={!nouveau.trim()}
        >
          📤 Envoyer
        </button>
      </div>

    </div>
  );
}

export default Chat;