import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import './Statistiques.css';

const dataGenres = [
  { name: 'Hommes', value: 3, color: '#00BCD4' },
  { name: 'Femmes', value: 3, color: '#E91E63' },
];

const dataPays = [
  { pays: 'Sénégal', membres: 2 },
  { pays: 'France', membres: 1 },
  { pays: 'USA', membres: 1 },
  { pays: 'Guinée', membres: 1 },
  { pays: "Côte d'Ivoire", membres: 1 },
];

const dataGenerations = [
  { generation: 'Grands-parents', membres: 2 },
  { generation: 'Parents', membres: 2 },
  { generation: 'Enfants', membres: 2 },
];

const dataSang = [
  { name: 'O+', value: 2, color: '#2D6A4F' },
  { name: 'A+', value: 1, color: '#4CAF50' },
  { name: 'B+', value: 1, color: '#81C784' },
  { name: 'AB+', value: 1, color: '#A5D6A7' },
  { name: 'Inconnu', value: 1, color: '#BDBDBD' },
];

const dataCroissance = [
  { annee: '2020', membres: 2 },
  { annee: '2021', membres: 3 },
  { annee: '2022', membres: 4 },
  { annee: '2023', membres: 5 },
  { annee: '2024', membres: 6 },
  { annee: '2025', membres: 6 },
];

const COLORS_SANG = ['#2D6A4F', '#4CAF50', '#81C784', '#A5D6A7', '#BDBDBD'];

function Statistiques() {
  return (
    <div className="stats-page">

      {/* CARTES RESUME */}
      <div className="stats-resume">
        <div className="resume-card vert">
          <span>👥</span>
          <div>
            <h2>6</h2>
            <p>Total membres</p>
          </div>
        </div>
        <div className="resume-card bleu">
          <span>🌍</span>
          <div>
            <h2>5</h2>
            <p>Pays représentés</p>
          </div>
        </div>
        <div className="resume-card orange">
          <span>🌳</span>
          <div>
            <h2>3</h2>
            <p>Générations</p>
          </div>
        </div>
        <div className="resume-card rouge">
          <span>🩺</span>
          <div>
            <h2>2</h2>
            <p>Alertes santé</p>
          </div>
        </div>
      </div>

      {/* GRAPHIQUES LIGNE 1 */}
      <div className="stats-grid-2">

        {/* MEMBRES PAR PAYS */}
        <div className="stat-chart-card">
          <h3>🌍 Membres par pays</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataPays} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="pays" tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }}/>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="membres" fill="#2D6A4F" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* REPARTITION GENRES */}
        <div className="stat-chart-card">
          <h3>👥 Répartition par genre</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={dataGenres}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {dataGenres.map((entry, index) => (
                  <Cell key={index} fill={entry.color}/>
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }}/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAPHIQUES LIGNE 2 */}
      <div className="stats-grid-2">

        {/* CROISSANCE FAMILLE */}
        <div className="stat-chart-card">
          <h3>📈 Croissance de la famille</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dataCroissance} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="annee" tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }}/>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}/>
              <Line
                type="monotone"
                dataKey="membres"
                stroke="#2D6A4F"
                strokeWidth={3}
                dot={{ fill: '#2D6A4F', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GROUPES SANGUINS */}
        <div className="stat-chart-card">
          <h3>🩸 Groupes sanguins</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={dataSang}
                cx="50%"
                cy="50%"
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {dataSang.map((entry, index) => (
                  <Cell key={index} fill={COLORS_SANG[index % COLORS_SANG.length]}/>
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }}/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GENERATIONS */}
      <div className="stat-chart-card full">
        <h3>🌳 Membres par génération</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dataGenerations} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
            <XAxis dataKey="generation" tick={{ fontSize: 12 }}/>
            <YAxis tick={{ fontSize: 12 }}/>
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}/>
            <Bar dataKey="membres" radius={[8, 8, 0, 0]}>
              {dataGenerations.map((entry, index) => (
                <Cell key={index} fill={index === 0 ? '#1B4332' : index === 1 ? '#2D6A4F' : '#4CAF50'}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FAITS INTERESSANTS */}
      <div className="stats-faits">
        <h3>💡 Faits intéressants sur la famille Diallo</h3>
        <div className="faits-grid">
          <div className="fait-card">
            <span>🏆</span>
            <div>
              <h4>Prénom le plus porté</h4>
              <p>Moussa (2 membres)</p>
            </div>
          </div>
          <div className="fait-card">
            <span>🌍</span>
            <div>
              <h4>Continent le plus représenté</h4>
              <p>Afrique (4 membres)</p>
            </div>
          </div>
          <div className="fait-card">
            <span>🩸</span>
            <div>
              <h4>Groupe sanguin dominant</h4>
              <p>O+ (2 membres)</p>
            </div>
          </div>
          <div className="fait-card">
            <span>🌳</span>
            <div>
              <h4>Ville d'origine</h4>
              <p>Dakar, Sénégal</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Statistiques;