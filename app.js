// =====================
// NAVIGATION
// =====================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
}

function navTop(btn, id) {
  document.querySelectorAll('.tn').forEach(n => n.classList.remove('active'));
  btn.classList.add('active');
  updateSidebar(id);
  showScreen(id);
  window.scrollTo(0, 0);
}

function navSide(btn, id) {
  document.querySelectorAll('.si').forEach(s => s.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateTopNav(id);
  showScreen(id);
  window.scrollTo(0, 0);
}

function updateSidebar(id) {
  const map = {
    dashboard: 0, criar: 1, templates: 2, calendario: 3,
    curadoria: 4, tendencias: 5, inspiracoes: 6, repost: 7,
    briefing: 8, diagnostico: 9, memoria: 10, estrategia: 11,
    paidmedia: 12, impulse: 13, campanhas: 14, orcamento: 15,
    workspaces: 16
  };
  const items = document.querySelectorAll('.si');
  if (map[id] !== undefined && items[map[id]]) {
    items[map[id]].classList.add('active');
  }
}

function updateTopNav(id) {
  const map = {
    dashboard: 0, criar: 1, templates: 2,
    curadoria: 3, tendencias: 3, inspiracoes: 3, repost: 3,
    calendario: 4,
    paidmedia: 5, impulse: 5, campanhas: 5, orcamento: 5
  };
  const btns = document.querySelectorAll('.tn');
  btns.forEach(b => b.classList.remove('active'));
  if (map[id] !== undefined && btns[map[id]]) {
    btns[map[id]].classList.add('active');
  }
}

// =====================
// FORMAT & HOOK SELECTION
// =====================

function selectFormat(el) {
  document.querySelectorAll('.format-card').forEach(f => f.classList.remove('selected'));
  el.classList.add('selected');
}

function selectHook(el) {
  document.querySelectorAll('.hook-card').forEach(h => h.classList.remove('selected'));
  el.classList.add('selected');
}

function togglePill(el, groupId) {
  const group = document.getElementById(groupId);
  if (group) group.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
}

// =====================
// WORKSPACE SWITCHER
// =====================

function switchWorkspace(name, color) {
  document.getElementById('ws-name').textContent = name;
  document.getElementById('ws-dot').style.background = color;

  document.querySelectorAll('.ws-card').forEach(c => c.classList.remove('active'));
  event.currentTarget.classList.add('active');

  navSide(null, 'dashboard');
  showNotification('Workspace alterado para ' + name);
}

// =====================
// TEMPLATE OPENER
// =====================

function openTemplate(name, platform) {
  const modal = document.getElementById('ai-modal');
  const content = document.getElementById('modal-content');
  document.querySelector('.modal-title').innerHTML =
    '<i class="ti ti-brand-canva"></i> Gerando conteúdo para template';

  modal.style.display = 'flex';
  content.innerHTML = '<div style="text-align:center;padding:30px"><div class="spinner" style="border-color:rgba(83,74,183,.3);border-top-color:#534AB7;margin:0 auto 12px"></div><p style="color:#4B4B6B;font-size:13px">Gerando texto para o template <strong>' + name + '</strong>...</p></div>';

  generateWithAI(
    'Gere o texto completo para o template "' + name + '" (' + platform + ') para a Neat Space (serviço de limpeza profissional para Airbnb em Brisbane). Inclua o texto de todos os elementos visuais já formatado e pronto para copiar e colar no Canva. Tom profissional e confiável.',
    content
  );
}

// =====================
// COPY HELPERS
// =====================

function copyResult() {
  const text = document.getElementById('ai-result-text').innerText;
  copyToClipboard(text);
}

function copyModal() {
  const text = document.getElementById('modal-content').innerText;
  copyToClipboard(text);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copiado para a área de transferência!');
  }).catch(() => {
    showNotification('Selecione o texto e use Ctrl+C para copiar.');
  });
}

// =====================
// MODAL
// =====================

function closeModal(event) {
  if (event.target.classList.contains('modal-overlay')) {
    document.getElementById('ai-modal').style.display = 'none';
  }
}

// =====================
// NOTIFICATION TOAST
// =====================

function showNotification(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 999;
      background: #1A1A2E; color: #fff; font-size: 13px;
      padding: 10px 18px; border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      transition: opacity .3s; opacity: 0;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// =====================
// PILL TOGGLE (generic)
// =====================

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.pill').forEach(p => {
    if (!p.getAttribute('onclick')) {
      p.addEventListener('click', function () {
        this.classList.toggle('on');
      });
    }
  });
});
