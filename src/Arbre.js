import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Arbre.css';

const NodePersonne = ({ data }) => (
  <div className={`node-personne ${data.relation}`}>
    <div className="node-emoji">{data.emoji}</div>
    <div className="node-info">
      <h4>{data.nom}</h4>
      <p>{data.relation}</p>
      <span className="node-sang">{data.sang}</span>
    </div>
  </div>
);

const nodeTypes = { personne: NodePersonne };

const nodesInitiaux = [
  { id: '1', type: 'personne', position: { x: 350, y: 0 }, data: { nom: 'Moussa Diallo', relation: 'grand-pere', emoji: '👴', sang: 'O+' } },
  { id: '2', type: 'personne', position: { x: 600, y: 0 }, data: { nom: 'Fatoumata Diallo', relation: 'grand-mere', emoji: '👵', sang: 'A+' } },
  { id: '3', type: 'personne', position: { x: 200, y: 200 }, data: { nom: 'Ibrahim Diallo', relation: 'pere', emoji: '👨', sang: 'B+' } },
  { id: '4', type: 'personne', position: { x: 500, y: 200 }, data: { nom: 'Aminata Diallo', relation: 'mere', emoji: '👩', sang: 'AB+' } },
  { id: '5', type: 'personne', position: { x: 150, y: 400 }, data: { nom: 'Ousmane Diallo', relation: 'fils', emoji: '🧒', sang: 'O+' } },
  { id: '6', type: 'personne', position: { x: 400, y: 400 }, data: { nom: 'Mariam Diallo', relation: 'fille', emoji: '👧', sang: 'A+' } },
];

const edgesInitiaux = [
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#2D6A4F', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#2D6A4F', strokeWidth: 2 } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#2D6A4F', strokeWidth: 2 } },
  { id: 'e3-6', source: '3', target: '6', animated: true, style: { stroke: '#2D6A4F', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#2D6A4F', strokeWidth: 2 } },
  { id: 'e4-6', source: '4', target: '6', animated: true, style: { stroke: '#2D6A4F', strokeWidth: 2 } },
];

function Arbre() {
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesInitiaux);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesInitiaux);
  const [showForm, setShowForm] = useState(false);
  const [nouveauMembre, setNouveauMembre] = useState({ nom: '', relation: 'fils', sang: 'O+', emoji: '👤' });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#2D6A4F', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const ajouterMembre = () => {
    const newNode = {
      id: String(nodes.length + 1),
      type: 'personne',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 200 + 500 },
      data: { nom: nouveauMembre.nom, relation: nouveauMembre.relation, emoji: nouveauMembre.emoji, sang: nouveauMembre.sang }
    };
    setNodes((nds) => [...nds, newNode]);
    setShowForm(false);
    setNouveauMembre({ nom: '', relation: 'fils', sang: 'O+', emoji: '👤' });
  };

  const emojis = ['👴', '👵', '👨', '👩', '🧒', '👧', '👦', '👤'];

  return (
    <div className="arbre-page">
      <div className="arbre-toolbar">
        <div>
          <h2>🌳 Arbre généalogique interactif</h2>
          <p>Glisse les membres, connecte-les et construis ton arbre</p>
        </div>
        <button className="btn-ajouter-membre" onClick={() => setShowForm(true)}>
          + Ajouter un membre
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>👤 Nouveau membre</h3>
            <div className="emoji-picker">
              {emojis.map(e => (
                <button key={e} className={nouveauMembre.emoji === e ? 'emoji-btn actif' : 'emoji-btn'} onClick={() => setNouveauMembre({ ...nouveauMembre, emoji: e })}>
                  {e}
                </button>
              ))}
            </div>
            <div className="form-group">
              <label>Nom complet</label>
              <input type="text" placeholder="ex: Aminata Diallo" value={nouveauMembre.nom} onChange={(e) => setNouveauMembre({ ...nouveauMembre, nom: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Relation</label>
                <select value={nouveauMembre.relation} onChange={(e) => setNouveauMembre({ ...nouveauMembre, relation: e.target.value })}>
                  <option value="grand-pere">Grand-père</option>
                  <option value="grand-mere">Grand-mère</option>
                  <option value="pere">Père</option>
                  <option value="mere">Mère</option>
                  <option value="fils">Fils</option>
                  <option value="fille">Fille</option>
                  <option value="frere">Frère</option>
                  <option value="soeur">Sœur</option>
                </select>
              </div>
              <div className="form-group">
                <label>Groupe sanguin</label>
                <select value={nouveauMembre.sang} onChange={(e) => setNouveauMembre({ ...nouveauMembre, sang: e.target.value })}>
                  <option value="Inconnu">❓ Inconnu</option>
                  <option>O+</option><option>O-</option>
                  <option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option>
                </select>
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn-annuler" onClick={() => setShowForm(false)}>Annuler</button>
              <button className="btn-confirmer" onClick={ajouterMembre} disabled={!nouveauMembre.nom}>
                Ajouter à l'arbre 🌳
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="arbre-flow">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView>
          <Controls />
          <MiniMap nodeColor="#2D6A4F" maskColor="rgba(0,0,0,0.1)" />
          <Background color="#e0e0e0" gap={20} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Arbre;