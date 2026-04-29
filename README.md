# AdminConnect — Maquette interactive

**Maquette HTML/CSS/JS statique pour le projet AdminConnect**  
Préparée par Alpha No_Code · Avril 2026 · Confidentiel

---

## Présentation

Maquette navigable en 3 écrans représentant le dashboard principal d'AdminConnect — hub opérationnel pour assistantes administratives indépendantes.

**Objectif** : support de présentation au RDV client pour valider le scope du MVP avant la Phase 1 de développement.

---

## Écrans inclus

| Fichier | Écran | Description |
|---|---|---|
| `index.html` | CRM Clients | Liste clients avec statuts, montants, scores IA, badges relance |
| `pages/client.html` | Dossier client | Documents, timer, relances graduelles, score IA détaillé |
| `pages/ia.html` | IA & Alertes | Rapport mensuel, alertes actives, graphique CA, tableau de scores |

---

## Utilisation

### En local
```bash
# Ouvrir directement dans le navigateur
open index.html

# Ou avec un serveur local (recommandé)
npx serve .
# → http://localhost:3000
```

### Navigation
- Cliquez sur une ligne du tableau CRM → dossier client
- Menu sidebar → navigation entre les 3 écrans
- Timer sur la page client → interactif (démarrer / arrêter)
- Boutons d'action → navigation contextuelle

---

## Stack

- **HTML5 sémantique** — structure claire et accessible
- **CSS custom** — variables CSS, zéro framework, animations légères
- **JS vanilla** — timer interactif, filtres, interactions
- **Google Fonts** — DM Serif Display + DM Sans

Aucune dépendance externe. Fonctionne offline.

---

## Structure des fichiers

```
adminconnect/
├── index.html          ← CRM Clients (écran d'accueil)
├── css/
│   └── style.css       ← Styles complets (toutes les pages)
├── js/
│   └── app.js          ← Interactions JS (timer, filtres)
└── pages/
    ├── client.html     ← Dossier client — Florent Sauvage
    └── ia.html         ← IA & Alertes — Rapport mensuel
```

---

## Design

**Palette** : Ivoire chaud `#FAF8F5` · Ardoise `#1E1D1B` · Corail `#E85D3A`  
**Typography** : DM Serif Display (titres) + DM Sans (corps)  
**Aesthetic** : SaaS français raffiné — sobre, fonctionnel, lisible

---

## Prochaines étapes

Suite à la validation de cette maquette en RDV :

1. **Phase 0** — Cadrage stratégique (2 semaines) : décision outil interne vs SaaS, consultation juriste PV Virtuel, specs MVP
2. **Phase 1** — MVP AdminConnect (6 semaines) : Baserow + WeWeb + n8n + Brevo
3. **Phase 2** — Enrichissement (6 semaines) : IA Mistral + Yousign + relances avancées

Budget Phase 0+1+2 : **10 300 € HT** · Licence mensuelle : **350 € HT/mois**

---

*Document confidentiel — Alpha No_Code & MACOR Laure / Gestion Clé Admin*
