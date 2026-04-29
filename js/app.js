// AdminConnect — Interactive JS

// ---- TIMER ----
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

function pad(n) { return String(n).padStart(2, '0'); }

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;

  const playBtn = document.getElementById('playBtn');
  const stopBtn = document.getElementById('stopBtn');
  const status  = document.getElementById('timerStatus');

  if (playBtn) playBtn.style.display = 'none';
  if (stopBtn) stopBtn.style.display = 'flex';
  if (status) status.textContent = 'Timer en cours…';

  timerInterval = setInterval(() => {
    timerSeconds++;
    const el = document.getElementById('timerDisplay');
    if (el) el.textContent = formatTime(timerSeconds);
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;

  const playBtn = document.getElementById('playBtn');
  const stopBtn = document.getElementById('stopBtn');
  const status  = document.getElementById('timerStatus');

  if (playBtn) playBtn.style.display = 'flex';
  if (stopBtn) stopBtn.style.display = 'none';
  if (status) status.textContent = `Timer arrêté · ${formatTime(timerSeconds)} enregistré`;
}

// ---- FILTER TABS ----
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// ---- TABLE ROW HOVER accent ----
document.querySelectorAll('.client-table tbody tr').forEach(row => {
  row.addEventListener('mouseenter', function() {
    this.querySelectorAll('.action-btn').forEach(b => b.style.opacity = '1');
  });
  row.addEventListener('mouseleave', function() {
    this.querySelectorAll('.action-btn').forEach(b => b.style.opacity = '');
  });
});

// ---- Smooth page transitions ----
document.querySelectorAll('a[href]').forEach(link => {
  if (link.getAttribute('href') === '#') {
    link.addEventListener('click', e => e.preventDefault());
  }
});
