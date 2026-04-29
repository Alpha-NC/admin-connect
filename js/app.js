// ============================================
// AdminConnect — Interactions complètes v2
// ============================================

const state = {
  timerSeconds: 0, timerRunning: false, timerInterval: null, alerts: 4,
};

function pad(n) { return String(n).padStart(2, '0'); }
function formatTime(s) { return `${pad(Math.floor(s/3600))}:${pad(Math.floor((s%3600)/60))}:${pad(s%60)}`; }

// ---- TOASTS ----
function showToast(message, type='success', duration=3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const colors = { success:'#22863A', warning:'#B95000', error:'#D92D20', info:'#2B7DC4' };
  const icons  = {
    success:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>',
    warning:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    error:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };
  const t = document.createElement('div');
  t.style.cssText = `display:flex;align-items:center;gap:10px;padding:12px 16px;background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.13);border-left:3px solid ${colors[type]};font-family:'DM Sans',sans-serif;font-size:13.5px;color:#1E1D1B;min-width:280px;max-width:360px;opacity:0;transform:translateY(8px);transition:all 0.25s ease;`;
  t.innerHTML = `<span style="color:${colors[type]};flex-shrink:0">${icons[type]}</span><span style="flex:1;line-height:1.4">${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:#8A8880;font-size:16px;line-height:1;padding:0;margin-left:4px">✕</button>`;
  container.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateY(0)'; });
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(8px)'; setTimeout(()=>t.remove(),300); }, duration);
}

// ---- MODALS ----
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.style.display='flex'; requestAnimationFrame(()=>m.classList.add('modal-open')); document.body.style.overflow='hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('modal-open'); setTimeout(()=>{ m.style.display='none'; },250); document.body.style.overflow=''; }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) closeModal(e.target.id);
});
document.addEventListener('keydown', e => {
  if (e.key==='Escape') document.querySelectorAll('.modal-backdrop.modal-open').forEach(m=>closeModal(m.id));
  if (e.key==='n' && !e.target.closest('input,textarea,select')) openModal('newClientModal');
  if ((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); openSearch(); }
});

// ---- SEARCH ----
const searchData = [
  { label:'Florent Sauvage', sub:'Devis #2026-047 · 4 200 € · En attente', url:'pages/client.html' },
  { label:'Baptiste Morel', sub:'Impayé · 2 350 € · J+47 critique', url:'pages/client.html' },
  { label:'Marie Castel', sub:'Signé · 7 800 € · Tout est ok', url:'pages/client.html' },
  { label:'Sophie Renard', sub:'Devis envoyé · 1 800 € · J+5', url:'pages/client.html' },
  { label:'Rapport Avril 2026', sub:'IA · CA 38 400 €', url:'pages/ia.html' },
  { label:'Alertes IA', sub:'4 alertes actives dont 2 critiques', url:'pages/ia.html' },
  { label:'Devis #2026-047', sub:'Florent Sauvage · 4 200 €', url:'pages/client.html' },
];
function openSearch() {
  openModal('searchModal');
  setTimeout(()=>document.getElementById('searchInput')?.focus(),100);
}
document.addEventListener('input', e => {
  if (e.target.id!=='searchInput') return;
  const q = e.target.value.toLowerCase().trim();
  const r = document.getElementById('searchResults');
  if (!r) return;
  if (!q) { r.innerHTML='<div style="padding:20px;text-align:center;color:#8A8880;font-size:13px">Tapez pour rechercher un client, document ou alerte…</div>'; return; }
  const hits = searchData.filter(d=>d.label.toLowerCase().includes(q)||d.sub.toLowerCase().includes(q));
  if (!hits.length) { r.innerHTML=`<div style="padding:20px;text-align:center;color:#8A8880;font-size:13px">Aucun résultat pour « ${q} »</div>`; return; }
  r.innerHTML = hits.map(h=>`<a href="${h.url}" onclick="closeModal('searchModal')" style="display:flex;gap:12px;align-items:center;padding:12px 18px;text-decoration:none;border-bottom:1px solid #EFEFEC;transition:background 0.15s;cursor:pointer;" onmouseenter="this.style.background='#FAF8F5'" onmouseleave="this.style.background=''">${'<div style="width:8px;height:8px;border-radius:50%;background:#E85D3A;flex-shrink:0;margin-top:5px"></div>'}<div><div style="font-size:13.5px;font-weight:500;color:#1E1D1B">${h.label}</div><div style="font-size:12px;color:#8A8880;margin-top:2px">${h.sub}</div></div></a>`).join('');
});

// ---- TIMER ----
window.startTimer = function() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  document.getElementById('playBtn')?.setAttribute('style','display:none');
  document.getElementById('stopBtn')?.setAttribute('style','display:flex');
  const s = document.getElementById('timerStatus');
  if (s) s.textContent = '⏱ Timer en cours…';
  state.timerInterval = setInterval(()=>{
    state.timerSeconds++;
    const el = document.getElementById('timerDisplay');
    if (el) el.textContent = formatTime(state.timerSeconds);
  }, 1000);
  showToast('Timer démarré — Mission Florent Sauvage', 'success');
};
window.stopTimer = function() {
  if (!state.timerRunning) return;
  clearInterval(state.timerInterval);
  state.timerRunning = false;
  document.getElementById('playBtn')?.setAttribute('style','display:flex');
  document.getElementById('stopBtn')?.setAttribute('style','display:none');
  const s = document.getElementById('timerStatus');
  if (s) s.textContent = `Arrêté · ${formatTime(state.timerSeconds)} enregistré`;
  showToast(`${formatTime(state.timerSeconds)} enregistré pour Florent Sauvage`, 'success');
};

// ---- ACTIONS GLOBALES ----
window.openModal = openModal;
window.closeModal = closeModal;
window.openSearch = openSearch;
window.showToast = showToast;
window.exportCSV = function() {
  const csv = `Nom,Email,Statut,Montant HT,Score IA\nFlorent Sauvage,florent.sauvage@gmail.com,Devis envoyé,4200,8.2\nMarie Castel,marie.castel@studio.fr,Signé,7800,2.8\nBaptiste Morel,b.morel@artisan.fr,Impayé,2350,9.1\nAurélie Laurent,aurelie@graphiste.fr,En cours,5600,5.4\nPierre Dubois,p.dubois@conseil.fr,Signé,12000,1.5\nSophie Renard,s.renard@coaching.fr,Devis envoyé,1800,6.1\nThomas Mercier,t.mercier@plomberie.fr,Signé,3200,2.2`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
  a.download = 'adminconnect_clients_avril2026.csv';
  a.click();
  showToast('Export CSV téléchargé ✓', 'success');
};
window.submitNewClient = function() {
  const nom = document.getElementById('nc_nom')?.value?.trim();
  const email = document.getElementById('nc_email')?.value?.trim();
  const type = document.getElementById('nc_type')?.value;
  if (!nom || !email) { showToast('Nom et email obligatoires', 'warning'); return; }
  closeModal('newClientModal');
  showToast(`Client « ${nom} » créé ✓`, 'success');
  const tbody = document.querySelector('.client-table tbody');
  if (tbody) {
    const initials = nom.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const cols = [['#F0FBF4','#22863A'],['#EFF8FF','#175CD3'],['#F5F0FF','#6E40C9'],['#FDF6EC','#B95000']];
    const [bg,fg] = cols[Math.floor(Math.random()*cols.length)];
    const tr = document.createElement('tr');
    tr.style.cssText = 'cursor:pointer;animation:fadeUp 0.3s ease';
    tr.onclick = ()=>window.location='pages/client.html';
    tr.innerHTML = `<td><div class="client-cell"><div class="client-avatar" style="background:${bg};color:${fg}">${initials}</div><div><div class="client-name">${nom}</div><div class="client-meta">${type||'Freelance'} · ${email}</div></div></div></td><td><span class="badge badge-info">En cours</span></td><td class="amount">—</td><td class="date-cell"><span>À l'instant</span></td><td><div class="score-cell"><div class="score-bar"><div class="score-fill score-ok" style="width:10%"></div></div><span class="score-num ok">1.0</span></div></td><td><span class="relance-badge relance-none">Aucune</span></td><td><button class="action-btn" onclick="event.stopPropagation();window.location='pages/client.html'">→</button></td>`;
    tbody.prepend(tr);
    document.getElementById('nc_nom').value='';
    document.getElementById('nc_email').value='';
  }
};
window.sendRelance = function() {
  closeModal('relanceModal');
  showToast('Relance envoyée à Florent Sauvage via Brevo ✓', 'success');
  setTimeout(()=>showToast('Email livré · Log conservé 5 ans (RGPD)', 'info', 4000), 1200);
  const btn = document.getElementById('relanceBtnMain');
  if (btn) { btn.innerHTML='✓ Relance envoyée'; btn.disabled=true; btn.style.opacity='0.6'; }
  const dot = document.querySelector('.relance-dot.current');
  if (dot) { dot.classList.remove('current'); dot.classList.add('done'); dot.textContent='✓'; }
  const next = document.querySelector('.relance-dot.future');
  if (next) { next.classList.remove('future'); next.classList.add('current'); next.textContent='!'; }
  state.alerts = Math.max(0, state.alerts-1);
  updateBadge();
};
window.sendPV = function() {
  closeModal('pvModal');
  showToast('PV envoyé à Florent Sauvage via Yousign ✓', 'success');
  setTimeout(()=>showToast('Signature eIDAS avancée en attente — vous serez notifié', 'info',4500), 1500);
  const badge = document.querySelector('.doc-item:last-child .badge');
  if (badge) { badge.className='badge badge-warning'; badge.textContent='En signature'; }
};
window.sendMED = function() {
  closeModal('medModal');
  showToast('Mise en demeure préparée — validation juriste requise', 'warning', 5000);
};
window.saveNote = function() {
  const text = document.getElementById('noteText')?.value?.trim();
  if (!text) { showToast('La note est vide', 'warning'); return; }
  closeModal('noteModal');
  showToast('Note interne ajoutée ✓', 'success');
  const notesBox = document.querySelector('.notes-content');
  if (notesBox) notesBox.style.borderColor = '#E85D3A';
};
window.generateReport = function() {
  const btn = document.getElementById('reportBtn');
  if (btn) { btn.textContent='⏳ Génération…'; btn.disabled=true; }
  setTimeout(()=>{
    if (btn) { btn.textContent='Générer un nouveau rapport'; btn.disabled=false; }
    showToast('Rapport Avril 2026 généré et envoyé par email ✓', 'success');
  }, 2200);
};
window.dismissAlert = function(el, msg) {
  const item = el.closest('.alert-item');
  if (item) { item.style.cssText+='opacity:0;transform:translateX(12px);transition:all 0.3s'; setTimeout(()=>item.remove(),300); }
  state.alerts = Math.max(0, state.alerts-1);
  updateBadge();
  if (msg) showToast(msg,'info');
};
window.markAllRead = function() {
  document.querySelectorAll('.alert-item').forEach((item,i)=>{
    setTimeout(()=>{ item.style.cssText+='opacity:0;transform:translateX(12px);transition:all 0.3s'; setTimeout(()=>item.remove(),300); }, i*80);
  });
  state.alerts=0; updateBadge();
  setTimeout(()=>showToast('Toutes les alertes marquées comme lues','success'),500);
};
window.toggleNotifs = function() { openModal('notifsModal'); };
window.cycleStatus = function(el) {
  const statuses=[{cls:'badge-info',text:'En cours'},{cls:'badge-warning',text:'Devis envoyé'},{cls:'badge-success',text:'Signé'},{cls:'badge-danger',text:'Impayé'}];
  const cur = statuses.findIndex(s=>el.classList.contains(s.cls));
  const next = statuses[(cur+1)%statuses.length];
  statuses.forEach(s=>el.classList.remove(s.cls));
  el.classList.add(next.cls); el.textContent=next.text;
  showToast(`Statut mis à jour : ${next.text}`,'info');
};

function updateBadge() {
  const b = document.getElementById('notifBadge');
  if (b) { b.textContent=state.alerts>0?state.alerts:''; b.style.display=state.alerts>0?'flex':'none'; }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', ()=>{
  updateBadge();

  // Score circle
  const circle = document.querySelector('.score-circle');
  if (circle) {
    const score = parseFloat(circle.dataset.score||'8.2');
    const pct = Math.round((score/10)*100);
    const color = score>7?'#D92D20':score>5?'#B95000':'#22863A';
    circle.style.background = `conic-gradient(${color} ${pct}%, var(--slate-100) ${pct}%)`;
    const num = circle.querySelector('.score-circle-num');
    if (num) num.style.color = color;
  }

  // Animate score bars
  document.querySelectorAll('.score-fill').forEach(bar=>{
    const w = bar.style.width; bar.style.width='0';
    setTimeout(()=>{ bar.style.transition='width 0.7s ease'; bar.style.width=w; },300);
  });

  // Animate chart bars
  document.querySelectorAll('.chart-bar').forEach((bar,i)=>{
    const h=bar.style.height; bar.style.height='0';
    setTimeout(()=>{ bar.style.transition='height 0.5s ease'; bar.style.height=h; },80+i*50);
  });

  // Search focus override
  const si = document.querySelector('.search-box input');
  if (si) { si.placeholder='Rechercher… (⌘K)'; si.addEventListener('focus', ()=>openSearch()); }

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab=>{
    tab.addEventListener('click', function(){
      this.closest('.filter-tabs').querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // KPI hover
  document.querySelectorAll('.kpi-card').forEach(card=>{
    card.style.cursor='pointer';
    card.addEventListener('click', function(){
      const label = this.querySelector('.kpi-label')?.textContent;
      showToast(`Vue détaillée : ${label} — Fonctionnalité Phase 2`,'info');
    });
  });
});
