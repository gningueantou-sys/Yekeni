import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { supabase } from './supabaseClient';
import './Statistiques.css';

const COLORS_SANG = ['#2D6A4F', '#4CAF50', '#81C784', '#A5D6A7', '#BDBDBD', '#66BB6A', '#388E3C', '#C8E6C9'];

const CONTINENT_PAR_PAYS = {
  'sénégal': 'Afrique', 'mali': 'Afrique', 'guinée': 'Afrique', "côte d'ivoire": 'Afrique',
  'burkina faso': 'Afrique', 'niger': 'Afrique', 'mauritanie': 'Afrique', 'gambie': 'Afrique',
  'france': 'Europe', 'espagne': 'Europe', 'italie': 'Europe', 'allemagne': 'Europe', 'belgique': 'Europe',
  'usa': 'Amérique du Nord', 'états-unis': 'Amérique du Nord', 'canada': 'Amérique du Nord',
};

function Statistiques() {
  const [chargement, setChargement] = useState(true);
  const [membres, setMembres] = useState([]);
  const [santeParMembre, setSanteParMembre] = useState({});
  const [aCreatedAt, setACreatedAt] = useState(true);

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }

      const { data: profil } = await supabase
        .from('profils')
        .select('famille_id')
        .eq('id', user.id)
        .single();

      if (!profil?.famille_id) { setChargement(false); return; }

      let { data: membresData, error: errM } = await supabase
        .from('membres')
        .select('id, prenom, nom, genre, pays, village_origine, region_origine, generation_label, created_at')
        .eq('famille_id', profil.famille_id);

      if (errM) {
        setACreatedAt(false);
        const retry = await supabase
          .from('membres')
          .select('id, prenom, nom, genre, pays, village_origine, region_origine, generation_label')
          .eq('famille_id', profil.famille_id);
        membresData = retry.data;
        if (retry.error) console.error('Erreur chargement statistiques :', retry.error);
      }

      const { data: santeData, error: errS } = await supabase
        .from('sante_familiale')
        .select('membre_id, groupe_sanguin, maladie_hereditaire, allergie')
        .eq('famille_id', profil.famille_id);
      if (errS) console.error('Erreur chargement santé (stats) :', errS);

      const santeMap = {};
      (santeData || []).forEach(s => { santeMap[s.membre_id] = s; });

      setMembres(membresData || []);
      setSanteParMembre(santeMap);
      setChargement(false);
    }
    charger();
  }, []);

  if (chargement) {
    return <div className="stats-page"><p style={{padding:'2rem'}}>⏳ Calcul des statistiques...</p></div>;
  }

  const total = membres.length;
  const paysUniques = [...new Set(membres.map(m => m.pays).filter(Boolean))];
  const alertesSante = Object.values(santeParMembre).filter(s =>
    (s.maladie_hereditaire && s.maladie_hereditaire !== 'Aucune') ||
    (s.allergie && s.allergie !== 'Aucune')
  ).length;

  const dataPays = paysUniques.map(p => ({
    pays: p, membres: membres.filter(m => m.pays === p).length,
  })).sort((a, b) => b.membres - a.membres);

  const dataGenres = ['homme', 'femme', 'autre']
    .map(g => ({ name: g === 'homme' ? 'Hommes' : g === 'femme' ? 'Femmes' : 'Autre', value: membres.filter(m => m.genre === g).length, color: g === 'homme' ? '#00BCD4' : g === 'femme' ? '#E91E63' : '#9E9E9E' }))
    .filter(d => d.value > 0);

  const generationsUniques = [...new Set(membres.map(m => m.generation_label).filter(Boolean))];
  const dataGenerations = generationsUniques.map(g => ({
    generation: g, membres: membres.filter(m => m.generation_label === g).length,
  }));

  const dataSang = (() => {
    const compte = {};
    membres.forEach(m => {
      const g = santeParMembre[m.id]?.groupe_sanguin || 'Inconnu';
      compte[g] = (compte[g] || 0) + 1;
    });
    return Object.entries(compte).map(([name, value]) => ({ name, value }));
  })();

  const dataCroissance = (() => {
    if (!aCreatedAt) return [];
    const parAnnee = {};
    membres.forEach(m => {
      if (!m.created_at) return;
      const annee = new Date(m.created_at).getFullYear();
      parAnnee[annee] = (parAnnee[annee] || 0) + 1;
    });
    const annees = Object.keys(parAnnee).map(Number).sort((a, b) => a - b);
    let cumul = 0;
    return annees.map(a => { cumul += parAnnee[a]; return { annee: String(a), membres: cumul }; });
  })();

  // Faits intéressants
  const prenomCounts = {};
  membres.forEach(m => { if (m.prenom) prenomCounts[m.prenom] = (prenomCounts[m.prenom] || 0) + 1; });
  const prenomTop = Object.entries(prenomCounts).sort((a, b) => b[1] - a[1])[0];

  const continentCounts = {};
  membres.forEach(m => {
    if (!m.pays) return;
    const c = CONTINENT_PAR_PAYS[m.pays.toLowerCase()] || 'Autre';
    continentCounts[c] = (continentCounts[c] || 0) + 1;
  });
  const continentTop = Object.entries(continentCounts).sort((a, b) => b[1] - a[1])[0];

  const sangTop = dataSang.filter(s => s.name !== 'Inconnu').sort((a, b) => b.value - a.value)[0];

  const lieuxOrigine = membres.map(m => m.village_origine || m.region_origine).filter(Boolean);
  const lieuOrigineCounts = {};
  lieuxOrigine.forEach(l => { lieuOrigineCounts[l] = (lieuOrigineCounts[l] || 0) + 1; });
  const lieuOrigineTop = Object.entries(lieuOrigineCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="stats-page">

      {/* CARTES RESUME */}
      <div className="stats-resume">
        <div className="resume-card vert">
          <span>👥</span>
          <div>
            <h2>{total}</h2>
            <p>Total membres</p>
          </div>
        </div>
        <div className="resume-card bleu">
          <span>🌍</span>
          <div>
            <h2>{paysUniques.length}</h2>
            <p>Pays représentés</p>
          </div>
        </div>
        <div className="resume-card orange">
          <span>🌳</span>
          <div>
            <h2>{generationsUniques.length}</h2>
            <p>Générations documentées</p>
          </div>
        </div>
        <div className="resume-card rouge">
          <span>🩺</span>
          <div>
            <h2>{alertesSante}</h2>
            <p>Alertes santé</p>
          </div>
        </div>
      </div>

      {/* GRAPHIQUES LIGNE 1 */}
      <div className="stats-grid-2">

        {/* MEMBRES PAR PAYS */}
        <div className="stat-chart-card">
          <h3>🌍 Membres par pays</h3>
          {dataPays.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dataPays} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="pays" tick={{ fontSize: 11 }}/>
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false}/>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}/>
                <Bar dataKey="membres" fill="#2D6A4F" radius={[6, 6, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{color:'#888', fontSize:'.85rem'}}>Aucun pays renseigné pour l'instant.</p>}
        </div>

        {/* REPARTITION GENRES */}
        <div className="stat-chart-card">
          <h3>👥 Répartition par genre</h3>
          {dataGenres.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dataGenres} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                  {dataGenres.map((entry, index) => <Cell key={index} fill={entry.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }}/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{color:'#888', fontSize:'.85rem'}}>Aucun membre pour l'instant.</p>}
        </div>
      </div>

      {/* GRAPHIQUES LIGNE 2 */}
      <div className="stats-grid-2">

        {/* CROISSANCE FAMILLE */}
        <div className="stat-chart-card">
          <h3>📈 Membres ajoutés par année</h3>
          {dataCroissance.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dataCroissance} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="annee" tick={{ fontSize: 11 }}/>
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false}/>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}/>
                <Line type="monotone" dataKey="membres" stroke="#2D6A4F" strokeWidth={3} dot={{ fill: '#2D6A4F', r: 5 }} activeDot={{ r: 7 }}/>
              </LineChart>
            </ResponsiveContainer>
          ) : <p style={{color:'#888', fontSize:'.85rem'}}>Pas assez de données pour tracer la croissance.</p>}
        </div>

        {/* GROUPES SANGUINS */}
        <div className="stat-chart-card">
          <h3>🩸 Groupes sanguins</h3>
          {dataSang.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dataSang} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value">
                  {dataSang.map((entry, index) => <Cell key={index} fill={COLORS_SANG[index % COLORS_SANG.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }}/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{color:'#888', fontSize:'.85rem'}}>Aucune donnée santé pour l'instant.</p>}
        </div>
      </div>

      {/* GENERATIONS */}
      <div className="stat-chart-card full">
        <h3>🌳 Membres par génération</h3>
        {dataGenerations.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataGenerations} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="generation" tick={{ fontSize: 12 }}/>
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false}/>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}/>
              <Bar dataKey="membres" radius={[8, 8, 0, 0]}>
                {dataGenerations.map((entry, index) => <Cell key={index} fill={index === 0 ? '#1B4332' : index === 1 ? '#2D6A4F' : '#4CAF50'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <p style={{color:'#888', fontSize:'.85rem'}}>Aucune génération renseignée — ajoute-en depuis "Mes Racines".</p>}
      </div>

      {/* FAITS INTERESSANTS */}
      <div className="stats-faits">
        <h3>💡 Faits intéressants sur la famille</h3>
        <div className="faits-grid">
          <div className="fait-card">
            <span>🏆</span>
            <div>
              <h4>Prénom le plus porté</h4>
              <p>{prenomTop ? `${prenomTop[0]} (${prenomTop[1]} membre${prenomTop[1]>1?'s':''})` : 'Non renseigné'}</p>
            </div>
          </div>
          <div className="fait-card">
            <span>🌍</span>
            <div>
              <h4>Continent le plus représenté</h4>
              <p>{continentTop ? `${continentTop[0]} (${continentTop[1]} membre${continentTop[1]>1?'s':''})` : 'Non renseigné'}</p>
            </div>
          </div>
          <div className="fait-card">
            <span>🩸</span>
            <div>
              <h4>Groupe sanguin dominant</h4>
              <p>{sangTop ? `${sangTop.name} (${sangTop.value} membre${sangTop.value>1?'s':''})` : 'Non renseigné'}</p>
            </div>
          </div>
          <div className="fait-card">
            <span>🌳</span>
            <div>
              <h4>Lieu d'origine le plus cité</h4>
              <p>{lieuOrigineTop ? lieuOrigineTop[0] : 'Non renseigné'}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Statistiques;