import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'yekeni_notifications';

const notifsDef = [
  { id:1, type:'souvenir', message:'Moussa Diallo a ajouté un souvenir : "Mariage de Papa et Maman"', temps:'Il y a 2h', lu:false, icon:'📸' },
  { id:2, type:'membre', message:'Ibrahim Diallo a rejoint la famille', temps:'Il y a 1j', lu:false, icon:'👥' },
  { id:3, type:'evenement', message:'Anniversaire de Grand-père dans 3 jours !', temps:'Il y a 3h', lu:true, icon:'🎂' },
  { id:4, type:'arbre', message:'Fatoumata Diallo a modifié l\'arbre généalogique', temps:'Il y a 5h', lu:true, icon:'🌳' },
];

const charger = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : notifsDef;
  } catch(e) { return notifsDef; }
};

export default function Notifications({ onClose }) {
  const [notifs, setNotifs] = useState(charger);

  useEffect(()=>{
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs)); } catch(e) {}
  }, [notifs]);

  const marquerLu = (id) => setNotifs(ns => ns.map(n => n.id===id ? {...n, lu:true} : n));
  const marquerTousLus = () => setNotifs(ns => ns.map(n => ({...n, lu:true})));
  const supprimer = (id) => setNotifs(ns => ns.filter(n => n.id!==id));
  const nonLus = notifs.filter(n => !n.lu).length;

  return (
    <div style={{
      position:'fixed', top:0, right:0, width:'360px', height:'100vh',
      background:'white', boxShadow:'-4px 0 24px rgba(0,0,0,.15)',
      zIndex:2000, display:'flex', flexDirection:'column',
      animation:'slideInRight .3s ease'
    }}>
      <style>{`@keyframes slideInRight { from { transform:translateX(100%) } to { transform:translateX(0) } }`}</style>

      {/* HEADER */}
      <div style={{padding:'1.2rem 1.4rem', borderBottom:'2px solid #F0F0F0', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#1B4332,#2D6A4F)'}}>
        <div>
          <h3 style={{color:'white', margin:0, fontSize:'1rem', fontWeight:'800'}}>🔔 Notifications</h3>
          {nonLus > 0 && <p style={{color:'#AECFBE', margin:'.2rem 0 0', fontSize:'.78rem'}}>{nonLus} non lu{nonLus>1?'s':''}</p>}
        </div>
        <div style={{display:'flex', gap:'.5rem'}}>
          {nonLus > 0 && (
            <button onClick={marquerTousLus} style={{background:'rgba(255,255,255,.15)', border:'none', color:'white', padding:'.3rem .7rem', borderRadius:'8px', cursor:'pointer', fontSize:'.75rem', fontWeight:'600'}}>
              Tout lire
            </button>
          )}
          <button onClick={onClose} style={{background:'rgba(255,255,255,.2)', border:'none', color:'white', width:'28px', height:'28px', borderRadius:'50%', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
        </div>
      </div>

      {/* LISTE */}
      <div style={{flex:1, overflowY:'auto', padding:'.8rem'}}>
        {notifs.length === 0 ? (
          <div style={{textAlign:'center', padding:'3rem 1rem', color:'#888'}}>
            <div style={{fontSize:'3rem', marginBottom:'1rem'}}>🔕</div>
            <p>Aucune notification</p>
          </div>
        ) : (
          notifs.map(n => (
            <div key={n.id} onClick={()=>marquerLu(n.id)} style={{
              display:'flex', gap:'.8rem', padding:'.9rem', marginBottom:'.5rem',
              background: n.lu ? '#FAFAFA' : '#F0FDF4',
              borderRadius:'12px', cursor:'pointer', position:'relative',
              border: n.lu ? '1px solid #F0F0F0' : '1px solid #D1FAE5',
              transition:'all .2s'
            }}>
              <div style={{fontSize:'1.5rem', flexShrink:0}}>{n.icon}</div>
              <div style={{flex:1}}>
                <p style={{margin:'0 0 .3rem', fontSize:'.85rem', color: n.lu?'#555':'#1a1a1a', fontWeight: n.lu?'400':'600', lineHeight:'1.4'}}>{n.message}</p>
                <span style={{fontSize:'.72rem', color:'#999'}}>{n.temps}</span>
              </div>
              <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'.3rem'}}>
                {!n.lu && <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#2D6A4F', flexShrink:0}}/>}
                <button onClick={e=>{e.stopPropagation();supprimer(n.id);}} style={{background:'none', border:'none', cursor:'pointer', fontSize:'.75rem', color:'#ccc', padding:'.1rem'}}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div style={{padding:'.8rem 1rem', borderTop:'2px solid #F0F0F0', textAlign:'center'}}>
        <button onClick={()=>setNotifs([])} style={{background:'#FEF2F2', border:'2px solid #FECACA', color:'#EF5350', padding:'.5rem 1.2rem', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'.82rem'}}>
          🗑️ Effacer tout
        </button>
      </div>
    </div>
  );
}

export function NotifBadge({ onClick, count }) {
  return (
    <button onClick={onClick} style={{
      position:'relative', background:'rgba(255,255,255,.15)',
      border:'2px solid rgba(255,255,255,.25)', borderRadius:'10px',
      padding:'.4rem .7rem', cursor:'pointer', color:'white',
      fontSize:'1.1rem', display:'flex', alignItems:'center', gap:'.3rem'
    }}>
      🔔
      {count > 0 && (
        <span style={{
          position:'absolute', top:'-6px', right:'-6px',
          background:'#EF5350', color:'white', borderRadius:'50%',
          width:'18px', height:'18px', fontSize:'.7rem', fontWeight:'800',
          display:'flex', alignItems:'center', justifyContent:'center',
          border:'2px solid white'
        }}>{count > 9 ? '9+' : count}</span>
      )}
    </button>
  );
}