import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

const messagesInitiaux = [
  { id: 1, auteur: 'Moussa Diallo', avatar: '👴', texte: 'Bonjour la famille ! Que Allah vous bénisse tous ! 🌳', heure: '09:00', moi: false },
  { id: 2, auteur: 'Fatoumata Diallo', avatar: '👵', texte: 'Bonjour Papa ! Comment tu vas ce matin ?', heure: '09:05', moi: false },
  { id: 3, auteur: 'Ibrahim Diallo', avatar: '👨', texte: 'Salam aleikoum la famille ! Je pense à vous depuis Paris ❤️', heure: '09:10', moi: false },
  { id: 4, auteur: 'Moi', avatar: '🧒', texte: 'Aleikoum salam ! Tout va bien Alhamdoulilah 😊', heure: '09:15', moi: true },
  { id: 5, auteur: 'Aminata Diallo', avatar: '👩', texte: 'Bonjour à tous ! N\'oubliez pas l\'anniversaire de Grand-père dans 3 jours 🎂', heure: '09:20', moi: false },
  { id: 6, auteur: 'Moussa Diallo', avatar: '👴', texte: 'Merci ma fille ! Vous êtes tous invités à la maison 🏡', heure: '09:25', moi: false },
];

const reactions = ['❤️', '😂', '😮', '🙏', '👍', '🎉'];

function Chat() {
  const [messages, setMessages] = useState(messagesInitiaux);
  const [nouveau, setNouveau] = useState('');
  const [showReactions, setShowReactions] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const envoyerMessage = () => {
    if (!nouveau.trim()) return;
    const msg = {
      id: messages.length + 1,
      auteur: 'Moi',
      avatar: '🧒',
      texte: nouveau,
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      moi: true
    };
    setMessages([...messages, msg]);
    setNouveau('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  };

  const ajouterReaction = (msgId, reaction) => {
    setMessages(messages.map(m => {
      if (m.id === msgId) {
        const reactions = m.reactions || {};
        return { ...m, reactions: { ...reactions, [reaction]: (reactions[reaction] || 0) + 1 } };
      }
      return m;
    }));
    setShowReactions(null);
  };

  const messagesRapides = [
    'Alhamdoulilah ! 🙏',
    'Je pense à vous ❤️',
    'Bonne journée à tous ! ☀️',
    'Salam aleikoum ! 🌙',
  ];

  return (
    <div className="chat-page">

      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-famille-avatar">👨‍👩‍👧‍👦</div>
          <div>
            <h2>Famille Diallo</h2>
            <p>5 membres · 3 en ligne</p>
          </div>
        </div>
        <div className="membres-en-ligne">
          {['👴', '👵', '👨'].map((a, i) => (
            <span key={i} className="avatar-ligne">{a}</span>
          ))}
          <span className="en-ligne-texte">en ligne</span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        <div className="chat-date">Aujourd'hui</div>
        {messages.map(m => (
          <div key={m.id} className={`message-wrapper ${m.moi ? 'moi' : ''}`}>
            {!m.moi && <span className="msg-avatar">{m.avatar}</span>}
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