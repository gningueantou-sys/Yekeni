import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const genererRapportPDF = () => {
  // Charger les données
  const membres = (() => { try { const s = localStorage.getItem('yekeni_membres'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
  const arbre = (() => { try { const s = localStorage.getItem('yekeni_arbre'); return s ? JSON.parse(s).membres || [] : []; } catch(e) { return []; } })();
  const racines = (() => { try { const s = localStorage.getItem('yekeni_racines'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
  const souvenirs = (() => { try { const s = localStorage.getItem('yekeni_souvenirs'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
  const evenements = (() => { try { const s = localStorage.getItem('yekeni_evenements'); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();

  const doc = new jsPDF();
  const vert = [45, 106, 79];
  const vertFonce = [27, 67, 50];
  const blanc = [255, 255, 255];
  const gris = [100, 116, 139];
  const grisClaire = [248, 249, 250];
  const date = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });

  // ═══════════════════════════════════════════
  // PAGE 1 — COUVERTURE
  // ═══════════════════════════════════════════
  doc.setFillColor(...vertFonce);
  doc.rect(0, 0, 210, 297, 'F');

  // Cercles décoratifs
  doc.setFillColor(45, 106, 79);
  doc.circle(180, 30, 40, 'F');
  doc.setFillColor(82, 183, 136);
  doc.circle(20, 250, 30, 'F');

  // Logo texte
  doc.setTextColor(...blanc);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text('Yëkëni', 20, 80);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(174, 207, 190);
  doc.text('"Se retrouver, se reconnaître"', 20, 95);

  // Ligne décorative
  doc.setDrawColor(82, 183, 136);
  doc.setLineWidth(2);
  doc.line(20, 105, 100, 105);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blanc);
  doc.text('Rapport Familial', 20, 125);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(174, 207, 190);
  doc.text('Archive complète de la famille', 20, 138);

  // Stats résumé
  const statsY = 165;
  const statItems = [
    { val: membres.length, label: 'Membres' },
    { val: arbre.length, label: 'Dans l\'arbre' },
    { val: racines.length, label: 'Origines' },
    { val: evenements.length, label: 'Événements' },
  ];

  statItems.forEach((s, i) => {
    const x = 20 + i * 45;
    doc.setFillColor(45, 106, 79);
    doc.roundedRect(x, statsY, 38, 30, 4, 4, 'F');
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...blanc);
    doc.text(String(s.val), x + 19, statsY + 14, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(174, 207, 190);
    doc.text(s.label, x + 19, statsY + 24, { align: 'center' });
  });

  // Footer couverture
  doc.setFontSize(10);
  doc.setTextColor(174, 207, 190);
  doc.text(`Généré le ${date} · yekeni.netlify.app`, 105, 280, { align: 'center' });

  // ═══════════════════════════════════════════
  // PAGE 2 — MEMBRES
  // ═══════════════════════════════════════════
  doc.addPage();

  // Header page
  doc.setFillColor(...vertFonce);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(...blanc);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('👥 Membres de la Famille', 15, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(174, 207, 190);
  doc.text(`${membres.length} membre${membres.length>1?'s':''}`, 195, 16, { align: 'right' });

  if (membres.length > 0) {
    doc.autoTable({
      startY: 32,
      head: [['Avatar', 'Nom complet', 'Rôle', 'Ville', 'Pays', 'Groupe sanguin', 'Profession']],
      body: membres.map(m => [
        m.avatar || '👤',
        m.nom || '-',
        m.estAdmin ? '👑 Admin' : m.estCoAdmin ? '🤝 Co-Admin' : m.role || 'Membre',
        m.ville || '-',
        m.pays || '-',
        m.sang || '-',
        m.profession || '-',
      ]),
      headStyles: { fillColor: vert, textColor: blanc, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
      alternateRowStyles: { fillColor: grisClaire },
      columnStyles: { 0: { cellWidth: 12, halign: 'center' }, 1: { cellWidth: 40 }, 2: { cellWidth: 25 } },
      margin: { left: 15, right: 15 },
      styles: { overflow: 'linebreak', cellPadding: 3 },
    });
  } else {
    doc.setTextColor(...gris);
    doc.setFontSize(11);
    doc.text('Aucun membre enregistré.', 105, 60, { align: 'center' });
  }

  // Section santé
  const santeMembres = membres.filter(m => m.maladie && m.maladie !== 'Aucune');
  if (santeMembres.length > 0) {
    const y = doc.lastAutoTable?.finalY + 15 || 100;
    doc.setFillColor(...vert);
    doc.roundedRect(15, y, 180, 8, 2, 2, 'F');
    doc.setTextColor(...blanc);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('🩺 Alertes Santé', 20, y + 5.5);

    doc.autoTable({
      startY: y + 12,
      head: [['Membre', 'Maladie héréditaire', 'Allergie', 'Groupe sanguin']],
      body: santeMembres.map(m => [m.nom, m.maladie || '-', m.allergie || '-', m.sang || '-']),
      headStyles: { fillColor: [239, 83, 80], textColor: blanc, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [255, 235, 238] },
      margin: { left: 15, right: 15 },
    });
  }

  // ═══════════════════════════════════════════
  // PAGE 3 — RACINES & ORIGINES
  // ═══════════════════════════════════════════
  doc.addPage();

  doc.setFillColor(...vertFonce);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(...blanc);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🌍 Origines & Racines', 15, 16);

  if (racines.length > 0) {
    // Ethnies uniques
    const ethniesUniques = [...new Set(racines.map(r => r.ethnie).filter(Boolean))];
    const languesUniques = [...new Set(racines.flatMap(r => r.langues || []))];

    // Badges ethnies
    let bx = 15, by = 35;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...vertFonce);
    doc.text('Ethnies représentées :', 15, by);
    by += 8;

    ethniesUniques.forEach(e => {
      doc.setFillColor(...vert);
      doc.roundedRect(bx, by, 30, 7, 2, 2, 'F');
      doc.setTextColor(...blanc);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(e, bx + 15, by + 4.5, { align: 'center' });
      bx += 34;
      if (bx > 170) { bx = 15; by += 10; }
    });

    by += 12;
    bx = 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...vertFonce);
    doc.text('Langues parlées :', 15, by);
    by += 8;

    languesUniques.forEach(l => {
      doc.setFillColor(217, 119, 6);
      doc.roundedRect(bx, by, 30, 7, 2, 2, 'F');
      doc.setTextColor(...blanc);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(l, bx + 15, by + 4.5, { align: 'center' });
      bx += 34;
      if (bx > 170) { bx = 15; by += 10; }
    });

    by += 15;

    // Tableau origines
    doc.autoTable({
      startY: by,
      head: [['Membre', 'Génération', 'Ethnie', 'Village', 'Région', 'Pays', 'Langues']],
      body: racines.map(r => [
        r.nom || '-',
        r.generation || '-',
        r.ethnie || '-',
        r.village || '-',
        r.region || '-',
        r.pays || '-',
        (r.langues || []).join(', ') || '-',
      ]),
      headStyles: { fillColor: vert, textColor: blanc, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: 15, right: 15 },
      styles: { overflow: 'linebreak', cellPadding: 3 },
    });
  } else {
    doc.setTextColor(...gris);
    doc.setFontSize(11);
    doc.text('Aucune origine enregistrée.', 105, 60, { align: 'center' });
  }

  // ═══════════════════════════════════════════
  // PAGE 4 — ÉVÉNEMENTS & MÉMOIRE
  // ═══════════════════════════════════════════
  doc.addPage();

  doc.setFillColor(...vertFonce);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(...blanc);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🎂 Événements & 📸 Mémoire', 15, 16);

  if (evenements.length > 0) {
    doc.autoTable({
      startY: 32,
      head: [['Icône', 'Titre', 'Date', 'Description', 'Statut']],
      body: evenements
        .sort((a,b) => new Date(a.date) - new Date(b.date))
        .map(e => {
          const j = Math.ceil((new Date(e.date) - new Date()) / (1000*60*60*24));
          return [
            e.type || '🎂',
            e.titre || '-',
            new Date(e.date).toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'}),
            e.description || '-',
            j < 0 ? 'Passé' : j === 0 ? "Aujourd'hui" : `Dans ${j}j`,
          ];
        }),
      headStyles: { fillColor: vert, textColor: blanc, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: grisClaire },
      columnStyles: { 0: { cellWidth: 12, halign: 'center' }, 4: { cellWidth: 22 } },
      margin: { left: 15, right: 15 },
    });
  }

  // Souvenirs
  if (souvenirs.length > 0) {
    const y = doc.lastAutoTable?.finalY + 15 || 100;
    doc.setFillColor(...vert);
    doc.roundedRect(15, y, 180, 8, 2, 2, 'F');
    doc.setTextColor(...blanc);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('📸 Souvenirs Familiaux', 20, y + 5.5);

    doc.autoTable({
      startY: y + 12,
      head: [['Emoji', 'Titre', 'Année', 'Catégorie', 'Auteur']],
      body: souvenirs.map(s => [s.emoji || '📸', s.titre || '-', s.annee || '-', s.categorie || '-', s.auteur || '-']),
      headStyles: { fillColor: [45, 106, 79], textColor: blanc, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: { 0: { cellWidth: 12, halign: 'center' } },
      margin: { left: 15, right: 15 },
    });
  }

  // ═══════════════════════════════════════════
  // PAGE 5 — ARBRE GÉNÉALOGIQUE
  // ═══════════════════════════════════════════
  doc.addPage();

  doc.setFillColor(...vertFonce);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(...blanc);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🌳 Arbre Généalogique', 15, 16);
  doc.setFontSize(9);
  doc.setTextColor(174, 207, 190);
  doc.text(`${arbre.length} membre${arbre.length>1?'s':''}`, 195, 16, { align: 'right' });

  if (arbre.length > 0) {
    doc.autoTable({
      startY: 32,
      head: [['Prénom', 'Nom', 'Genre', 'Année', 'Statut', 'Parents', 'Enfants', 'Conjoints']],
      body: arbre.map(m => [
        m.prenom || '-',
        m.nom || '-',
        m.genre === 'homme' ? '👨 Homme' : '👩 Femme',
        m.annee || '-',
        m.statut === 'decede' ? '† Décédé(e)' : 'Vivant(e)',
        m.parentIds?.length || 0,
        m.enfantIds?.length || 0,
        m.conjointIds?.length || 0,
      ]),
      headStyles: { fillColor: vert, textColor: blanc, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: 15, right: 15 },
      styles: { overflow: 'linebreak', cellPadding: 3 },
    });
  }

  // ═══════════════════════════════════════════
  // FOOTER SUR TOUTES LES PAGES
  // ═══════════════════════════════════════════
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(...vertFonce);
    doc.rect(0, 287, 210, 10, 'F');
    doc.setTextColor(174, 207, 190);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Yëkëni — Rapport Familial · ${date}`, 15, 293);
    doc.text(`Page ${i} / ${total}`, 195, 293, { align: 'right' });
  }

  // Sauvegarder
  doc.save(`Yekeni_Rapport_Familial_${new Date().toISOString().split('T')[0]}.pdf`);
};

export default genererRapportPDF;