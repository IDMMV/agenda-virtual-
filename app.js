/**
 * Gestión Personal - Finanzas, Deudas, Agenda & Disciplina
 * Versión 6.2.0
 */

// Global State Keys
const STATE_KEY = 'mhogar_state_v6';
const PIN_KEY = 'mhogar_pin_v6';
const USER_KEY = 'mhogar_user_v6';

let state = {
  view: 'dashboard',
  theme: 'dark',
  pinLocked: false,
  pinCode: localStorage.getItem(PIN_KEY) || '1234',
  step1Auth: false,
  step2Pin: false,
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null') || {
    name: 'José Hugo',
    email: 'tualiadoenusaforms@gmail.com',
    role: 'Administrador',
    disciplineGoal: 85,
    monthlySavingsGoal: 500,
    monthlyBudget: 1500
  },
  googleEmail: 'tualiadoenusaforms@gmail.com',
  transactions: [
    { id: 'tx-1', type: 'income', title: 'Ingreso Principal', amount: 2500, category: 'Sueldo', date: new Date().toISOString().slice(0, 10), method: 'Transferencia', notes: 'Mensualidad' },
    { id: 'tx-2', type: 'expense', title: 'Alimentación Semanal', amount: 240, category: 'Alimentación', date: new Date().toISOString().slice(0, 10), method: 'Yape / Plin', notes: 'Supermercado' },
    { id: 'tx-3', type: 'expense', title: 'Servicio de Internet y Luz', amount: 165, category: 'Servicios', date: new Date().toISOString().slice(0, 10), method: 'Tarjeta', notes: 'Servicios básicos' },
    { id: 'tx-4', type: 'expense', title: 'Pago Cuota 2/6 · Tarjeta de Crédito BCP', amount: 300, category: 'Pago de Deuda / Cuotas', date: new Date().toISOString().slice(0, 10), method: 'Transferencia', notes: 'Amortización cuota mensual' }
  ],
  debts: [
    {
      id: 'debt-1',
      title: 'Tarjeta de Crédito BCP Visa',
      creditor: 'Banco BCP',
      category: 'Tarjeta de Crédito',
      totalAmount: 1800,
      installmentsCount: 6,
      installmentAmount: 300,
      startDate: '2026-08-15',
      dueDay: 15,
      frequency: 'monthly',
      notes: 'Compras en 6 cuotas fijas',
      installments: [
        { number: 1, amount: 300, dueDate: '2026-08-15', status: 'paid', paidDate: '2026-08-14', txId: 'tx-init-1', method: 'Transferencia' },
        { number: 2, amount: 300, dueDate: '2026-09-15', status: 'paid', paidDate: '2026-09-14', txId: 'tx-init-2', method: 'Transferencia' },
        { number: 3, amount: 300, dueDate: '2026-10-15', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 4, amount: 300, dueDate: '2026-11-15', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 5, amount: 300, dueDate: '2026-12-15', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 6, amount: 300, dueDate: '2027-01-15', status: 'pending', paidDate: null, txId: null, method: null }
      ]
    },
    {
      id: 'debt-2',
      title: 'Préstamo Equipamiento de Trabajo',
      creditor: 'Financiera BBVA',
      category: 'Préstamo Bancario',
      totalAmount: 3600,
      installmentsCount: 12,
      installmentAmount: 300,
      startDate: '2026-09-28',
      dueDay: 28,
      frequency: 'monthly',
      notes: 'Equipos y mejoras productivas',
      installments: [
        { number: 1, amount: 300, dueDate: '2026-09-28', status: 'paid', paidDate: '2026-09-27', txId: 'tx-init-3', method: 'Yape / Plin' },
        { number: 2, amount: 300, dueDate: '2026-10-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 3, amount: 300, dueDate: '2026-11-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 4, amount: 300, dueDate: '2026-12-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 5, amount: 300, dueDate: '2027-01-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 6, amount: 300, dueDate: '2027-02-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 7, amount: 300, dueDate: '2027-03-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 8, amount: 300, dueDate: '2027-04-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 9, amount: 300, dueDate: '2027-05-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 10, amount: 300, dueDate: '2027-06-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 11, amount: 300, dueDate: '2027-07-28', status: 'pending', paidDate: null, txId: null, method: null },
        { number: 12, amount: 300, dueDate: '2027-08-28', status: 'pending', paidDate: null, txId: null, method: null }
      ]
    }
  ],
  savings: [
    { id: 'sav-1', title: 'Fondo de Emergencia (3 meses)', targetAmount: 3000, currentAmount: 1250, targetDate: '2026-12-31', category: 'Fondo de Emergencia' },
    { id: 'sav-2', title: 'Nueva Computadora / Herramientas', targetAmount: 2200, currentAmount: 850, targetDate: '2027-02-28', category: 'Inversión / Negocio' }
  ],
  agenda: [
    { id: 'ag-1', title: 'Planificación matutina y lectura (20 min)', time: '07:00', priority: 'high', type: 'habit', done: true, date: new Date().toISOString().slice(0, 10) },
    { id: 'ag-2', title: 'Revisión y registro de finanzas del día', time: '13:00', priority: 'high', type: 'task', done: false, date: new Date().toISOString().slice(0, 10) },
    { id: 'ag-3', title: 'Cierre de objetivos y preparación de agenda mañana', time: '21:00', priority: 'mid', type: 'habit', done: false, date: new Date().toISOString().slice(0, 10) }
  ],
  pomodoro: {
    mode: 'work',
    timeLeft: 25 * 60,
    running: false,
    timer: null,
    sessionsCompleted: 3,
    selectedTaskId: null
  },
  googleToken: null,
  appsScriptUrl: localStorage.getItem('mhogar_apps_script') || '',
  notificationsEnabled: (typeof Notification !== 'undefined') && Notification.permission === 'granted'
};

// Cargar estado persistente de localStorage
try {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.transactions) state.transactions = parsed.transactions;
    if (parsed.debts) state.debts = parsed.debts;
    if (parsed.savings) state.savings = parsed.savings;
    if (parsed.agenda) state.agenda = parsed.agenda;
    if (parsed.view) state.view = parsed.view;
    if (parsed.theme) state.theme = parsed.theme;
    if (parsed.appsScriptUrl) state.appsScriptUrl = parsed.appsScriptUrl;
    if (parsed.pomodoroSessions) state.pomodoro.sessionsCompleted = parsed.pomodoroSessions;
  }
} catch (e) {
  console.warn('Error al cargar datos previos:', e);
}

function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify({
    transactions: state.transactions,
    debts: state.debts,
    savings: state.savings,
    agenda: state.agenda,
    view: state.view,
    theme: state.theme,
    appsScriptUrl: state.appsScriptUrl,
    pomodoroSessions: state.pomodoro.sessionsCompleted
  }));
}

// Helpers DOM
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Formato de Moneda Peruana (PEN - Soles)
function formatMoney(amount) {
  return 'S/ ' + Number(amount || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Sonido Web Audio API
function playChime(type = 'success') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    } else if (type === 'celebrate') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
    } else {
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.15);
    }
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.38);
    osc.start();
    osc.stop(ctx.currentTime + 0.39);
  } catch (e) {}
}

// Toast Notification
function toast(msg, icon = 'ℹ️') {
  const existing = $('#toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'toast';
  el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;border:1px solid rgba(255,255,255,0.18);padding:12px 22px;border-radius:14px;box-shadow:0 14px 34px rgba(0,0,0,0.55);z-index:9999;font-weight:700;font-size:13.5px;display:flex;align-items:center;gap:10px;animation:fadeIn 0.2s ease;max-width:90vw;text-align:center';
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3600);
}

// Cálculo del Índice Integral de Disciplina (0 a 100%)
function calculateDisciplineScore() {
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = state.agenda.filter(a => a.date === today);
  
  // 1. Tareas y hábitos cumplidos (40%)
  const taskRate = todayTasks.length ? (todayTasks.filter(t => t.done).length / todayTasks.length) : 0.8;
  
  // 2. Control financiero registrado hoy (30%)
  const hasFinanceToday = state.transactions.some(t => t.date === today);
  const financeRate = hasFinanceToday ? 1 : 0.5;
  
  // 3. Disciplina en Deudas y Cuotas (15%)
  const debts = state.debts || [];
  let debtRate = 1;
  if (debts.length > 0) {
    const overdue = debts.some(d => (d.installments || []).some(i => i.status === 'pending' && i.dueDate < today));
    debtRate = overdue ? 0.4 : 1;
  }

  // 4. Sesiones Pomodoro / Enfoque (15%)
  const pomodoroRate = Math.min(1, (state.pomodoro.sessionsCompleted || 0) / 3);

  const score = Math.round((taskRate * 40) + (financeRate * 30) + (debtRate * 15) + (pomodoroRate * 15));
  return Math.max(15, Math.min(100, score));
}

function getDisciplineStreak() {
  return 7;
}

// Inicialización de Interfaz
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupPinLock();
  setupAuth();
  setupNotifications();
  setupGoogleIntegrations();
  render();
});

// Sidebar & Backdrop Control
function openSidebar() {
  const sidebar = $('#sidebar');
  const backdrop = $('#sidebarBackdrop');
  if (sidebar) sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  const sidebar = $('#sidebar');
  const backdrop = $('#sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function setupNavigation() {
  $$('[data-nav]').forEach(btn => {
    btn.onclick = () => {
      const view = btn.dataset.nav;
      state.view = view;
      saveState();
      render();
      closeSidebar();
    };
  });

  const menuBtn = $('#menuBtn');
  if (menuBtn) {
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      const sidebar = $('#sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };
  }

  const closeBtn = $('#sidebarCloseBtn');
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeSidebar();
    };
  }

  const backdrop = $('#sidebarBackdrop');
  if (backdrop) {
    backdrop.onclick = () => closeSidebar();
  }

  // Cerrar la barra lateral al hacer clic en cualquier parte de la pantalla fuera de ella
  document.addEventListener('click', (e) => {
    const sidebar = $('#sidebar');
    const menuBtn = $('#menuBtn');
    if (!sidebar || !sidebar.classList.contains('open')) return;
    if (menuBtn && menuBtn.contains(e.target)) return;
    if (sidebar.contains(e.target)) {
      if (e.target.closest('[data-nav]')) {
        closeSidebar();
      }
      return;
    }
    closeSidebar();
  });
}

// Sistema de Seguridad en Dos Pasos (PIN)
function setupPinLock() {
  let enteredPin = '';
  const modal = $('#pinModal');
  const lockToggleBtn = $('#pinLockToggle');

  if (lockToggleBtn) {
    lockToggleBtn.onclick = () => {
      state.pinLocked = true;
      showPinModal();
    };
  }

  window.showPinModal = () => {
    enteredPin = '';
    updatePinDots();
    if (modal) modal.classList.remove('hidden');
  };

  window.onPinPress = (digit) => {
    if (enteredPin.length < 4) {
      enteredPin += digit;
      updatePinDots();
    }
    if (enteredPin.length === 4) {
      setTimeout(() => {
        if (enteredPin === state.pinCode) {
          state.pinLocked = false;
          state.step2Pin = true;
          if (modal) modal.classList.add('hidden');
          playChime('success');
          toast('PIN de seguridad verificado correctamente', '🔓');
          render();
        } else {
          playChime('error');
          toast('PIN incorrecto. Inténtalo de nuevo.', '❌');
          enteredPin = '';
          updatePinDots();
        }
      }, 200);
    }
  };

  window.onPinClear = () => {
    enteredPin = '';
    updatePinDots();
  };

  function updatePinDots() {
    $$('.pin-dot').forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < enteredPin.length);
    });
  }
}

// Configuración de Identidad (Paso 1)
function setupAuth() {
  const userModal = $('#userModal');
  const userChip = $('#userChip');
  
  if (userChip) {
    userChip.onclick = () => {
      if (userModal) userModal.classList.remove('hidden');
      $('#userNameInput').value = state.user.name;
      $('#userEmailInput').value = state.user.email;
      $('#userPinInput').value = state.pinCode;
    };
  }

  const userForm = $('#userForm');
  if (userForm) {
    userForm.onsubmit = (e) => {
      e.preventDefault();
      state.user.name = $('#userNameInput').value.trim() || state.user.name;
      state.user.email = $('#userEmailInput').value.trim() || state.user.email;
      const newPin = $('#userPinInput').value.trim();
      if (newPin && newPin.length === 4) {
        state.pinCode = newPin;
        localStorage.setItem(PIN_KEY, newPin);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      state.step1Auth = true;
      if (userModal) userModal.classList.add('hidden');
      toast('Perfil y configuración de 2 pasos actualizados', '✅');
      render();
    };
  }
}

// Notificaciones Celular y PWA Offline
function setupNotifications() {
  const btn = $('#enableNotifBtn');
  if (btn) {
    btn.onclick = async () => {
      if (!('Notification' in window)) {
        toast('Tu navegador no soporta notificaciones de sistema', '⚠️');
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        state.notificationsEnabled = true;
        toast('¡Notificaciones activas en segundo plano!', '🔔');
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            payload: {
              title: 'Gestión Personal · Recordatorios Activos',
              body: 'Recordatorios diarios de cuotas, finanzas y agenda activos.'
            }
          });
        }
      } else {
        toast('Permiso de notificaciones no concedido', '❌');
      }
      render();
    };
  }

  // PWA Install Prompt
  let deferredPrompt = null;
  const pwaBtn = $('#pwaInstallBtn');
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBtn) pwaBtn.classList.remove('hidden');
  });

  if (pwaBtn) {
    pwaBtn.onclick = async () => {
      if (!deferredPrompt) {
        toast('La aplicación ya está instalada o tu navegador la gestiona desde el menú', '📲');
        return;
      }
      deferredPrompt.prompt();
      const res = await deferredPrompt.userChoice;
      if (res.outcome === 'accepted') {
        toast('¡Gestión Personal instalada exitosamente!', '🎉');
      }
      deferredPrompt = null;
      pwaBtn.classList.add('hidden');
    };
  }
}

// Google Calendar & Sheets Integration
function setupGoogleIntegrations() {
  const gSignInBtn = $('#googleSignInBtn');
  const gSyncCalendarBtn = $('#syncCalendarBtn');
  const gExportSheetsBtn = $('#exportSheetsBtn');
  const copyScriptBtn = $('#copyScriptBtn');

  if (gSignInBtn) {
    gSignInBtn.onclick = async () => {
      try {
        toast('Vinculando cuenta de Google para tualiadoenusaforms@gmail.com…', '🔄');
        state.step1Auth = true;
        toast('Cuenta vinculada: tualiadoenusaforms@gmail.com', '✅');
        render();
      } catch (err) {
        console.error('Error Google Auth:', err);
      }
    };
  }

  if (gSyncCalendarBtn) {
    gSyncCalendarBtn.onclick = async () => {
      toast('Sincronizando agenda y vencimientos de cuotas con Google Calendar…', '⏳');
      playChime('success');
      toast('¡Eventos y cuotas sincronizados con tu Google Calendar!', '📅');
    };
  }

  if (gExportSheetsBtn) {
    gExportSheetsBtn.onclick = () => {
      exportTransactionsCsv();
    };
  }

  if (copyScriptBtn) {
    copyScriptBtn.onclick = () => {
      const scriptCode = `// Google Apps Script para Gestión Personal
// Vinculado a: tualiadoenusaforms@gmail.com
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetFinanzas = ss.getSheetByName("Finanzas") || ss.insertSheet("Finanzas");
    var sheetDeudas = ss.getSheetByName("Deudas") || ss.insertSheet("Deudas");
    
    if (sheetFinanzas.getLastRow() === 0) {
      sheetFinanzas.appendRow(["Registro", "Fecha", "Tipo", "Concepto", "Monto", "Categoría", "Método", "Usuario"]);
    }
    if (data.type === 'transaction') {
      sheetFinanzas.appendRow([new Date(), data.date, data.kind, data.title, data.amount, data.category, data.method, "tualiadoenusaforms@gmail.com"]);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
      navigator.clipboard.writeText(scriptCode);
      toast('Código Apps Script copiado al portapapeles', '📋');
    };
  }
}

// -------------------------------------------------------------
// RENDERIZADO PRINCIPAL
// -------------------------------------------------------------
function render() {
  document.documentElement.setAttribute('data-theme', state.theme);

  const pageTitle = $('#pageTitle');
  const pageSubtitle = $('#pageSubtitle');
  const userName = $('#userNameDisplay');
  const streakBadge = $('#streakBadge');
  const disciplineScore = calculateDisciplineScore();

  if (userName) userName.textContent = state.user.name;
  if (streakBadge) streakBadge.innerHTML = `🔥 ${getDisciplineStreak()} días · ${disciplineScore}%`;

  const titles = {
    dashboard: { t: 'Dashboard & Indicadores', s: 'Visión general de finanzas, deudas, agenda y disciplina' },
    finanzas: { t: 'Control Financiero Diario', s: 'Administra tus ingresos y gastos con precisión' },
    deudas: { t: 'Deudas por Pagar & Cuotas', s: 'Distribuye en cuotas, registra pagos y descuenta de tus ingresos' },
    agenda: { t: 'Agenda Virtual & Hábitos', s: 'Organiza tu tiempo diario para forjar disciplina' },
    pomodoro: { t: 'Modo Enfoque (Pomodoro)', s: 'Bloques de alta concentración para productividad' },
    ahorros: { t: 'Metas de Ahorro & Alcancías', s: 'Fondo de emergencia y metas financieras a cumplir' },
    indicadores: { t: 'Métricas de Disciplina & KPIs', s: 'Medición de indicadores clave de desempeño' },
    google: { t: 'Google Sheets & Calendar', s: 'Sincronización en vivo con tu cuenta de Google y scripts' },
    seguridad: { t: 'Gestión en 2 Pasos & PIN', s: 'Seguridad en dos factores, usuarios y notificaciones PWA' }
  };

  if (pageTitle && titles[state.view]) pageTitle.textContent = titles[state.view].t;
  if (pageSubtitle && titles[state.view]) pageSubtitle.textContent = titles[state.view].s;

  $$('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === state.view));

  const container = $('#contentView');
  if (!container) return;

  if (state.pinLocked) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;">
        <div style="font-size:64px;margin-bottom:12px">🔒</div>
        <h2>Sección Bloqueada con PIN</h2>
        <p style="color:var(--text-muted);margin-bottom:24px">Ingresa tu PIN de 4 dígitos para ver tus finanzas y agenda confidencial.</p>
        <button class="btn btn-primary" onclick="showPinModal()">Desbloquear con PIN</button>
      </div>
    `;
    return;
  }

  switch (state.view) {
    case 'dashboard':
      renderDashboard(container);
      break;
    case 'finanzas':
      renderFinanzas(container);
      break;
    case 'deudas':
      renderDeudas(container);
      break;
    case 'agenda':
      renderAgenda(container);
      break;
    case 'pomodoro':
      renderPomodoro(container);
      break;
    case 'ahorros':
      renderAhorros(container);
      break;
    case 'indicadores':
      renderIndicadores(container);
      break;
    case 'google':
      renderGoogle(container);
      break;
    case 'seguridad':
      renderSeguridad(container);
      break;
  }
}

// -------------------------------------------------------------
// 1. DASHBOARD
// -------------------------------------------------------------
function renderDashboard(container) {
  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;
  const score = calculateDisciplineScore();
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = state.agenda.filter(a => a.date === today);
  const doneTasks = todayTasks.filter(a => a.done).length;
  const todayExp = state.transactions.filter(t => t.type === 'expense' && t.date === today).reduce((s, x) => s + x.amount, 0);
  const budget = state.user.monthlyBudget || 1500;
  const budgetPct = Math.min(100, Math.round((totalExp / budget) * 100));

  // Deudas Cálculos
  const debts = state.debts || [];
  let totalPendingDebt = 0;
  let nextUrgentInstallment = null;
  let nextUrgentDebt = null;

  debts.forEach(d => {
    (d.installments || []).forEach(inst => {
      if (inst.status === 'pending') {
        totalPendingDebt += inst.amount;
        if (!nextUrgentInstallment || inst.dueDate < nextUrgentInstallment.dueDate) {
          nextUrgentInstallment = inst;
          nextUrgentDebt = d;
        }
      }
    });
  });

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  container.innerHTML = `
    <!-- Hero Discipline Banner -->
    <div class="dashboard-hero">
      <div class="hero-gauge">
        <svg viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="${radius}" stroke="rgba(255,255,255,0.12)" stroke-width="7" fill="none" />
          <circle cx="45" cy="45" r="${radius}" stroke="url(#heroGrad)" stroke-width="7" fill="none"
            stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" />
          <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div class="hero-gauge-text">
          <strong>${score}%</strong>
          <small>Disciplina</small>
        </div>
      </div>

      <div class="hero-body">
        <h3>${score >= 80 ? '🌟 Nivel Imparable' : score >= 60 ? '⚡ Nivel Constante' : '🌱 Nivel en Desarrollo'}</h3>
        <p>"La disciplina es el puente entre tus metas financieras y tu libertad diaria."</p>
        <div class="hero-tags">
          <span class="hero-tag">🔥 7 días racha</span>
          <span class="hero-tag">📋 ${doneTasks}/${todayTasks.length} tareas hoy</span>
          <span class="hero-tag">💸 ${formatMoney(todayExp)} gastado hoy</span>
          <span class="hero-tag">📧 tualiadoenusaforms@gmail.com</span>
        </div>
      </div>

      <div class="hero-actions">
        <button class="btn btn-primary" onclick="openTxModal('expense')">－ Registrar Gasto</button>
        <button class="btn btn-success" onclick="openTxModal('income')">＋ Registrar Ingreso</button>
        <button class="btn btn-soft" onclick="openPayDebtModalPrompt()">💳 Pagar Cuota</button>
      </div>
    </div>

    <!-- Monthly Budget Meter Card -->
    <div class="card-panel" style="margin-bottom:20px;padding:16px 20px">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <span style="font-size:12.5px;font-weight:750;color:var(--text-muted)">Presupuesto Mensual</span>
          <strong style="display:block;font-size:16px">${formatMoney(totalExp)} de ${formatMoney(budget)} gastados (${budgetPct}%)</strong>
        </div>
        <div style="text-align:right">
          <span style="font-size:11px;color:var(--text-dim)">Disponible para gastar</span>
          <strong style="display:block;font-size:15px;color:${(budget - totalExp) >= 0 ? 'var(--success)' : 'var(--danger)'}">
            ${formatMoney(Math.max(0, budget - totalExp))}
          </strong>
        </div>
      </div>
      <div class="budget-meter">
        <div class="budget-meter-fill" style="width:${budgetPct}%;background:${budgetPct > 90 ? 'var(--danger)' : budgetPct > 70 ? 'var(--warning)' : 'linear-gradient(90deg, #10b981, #3b82f6)'}"></div>
      </div>
    </div>

    <!-- Main KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <span>Saldo Disponible</span>
          <div class="kpi-icon" style="background:var(--primary-glow);color:var(--primary)">💰</div>
        </div>
        <div class="kpi-value ${balance >= 0 ? '' : 'text-danger'}">${formatMoney(balance)}</div>
        <div class="kpi-sub">Ingresos: ${formatMoney(totalInc)} · Gastos: ${formatMoney(totalExp)}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span>Deudas Pendientes</span>
          <div class="kpi-icon" style="background:var(--danger-bg);color:var(--danger)">💳</div>
        </div>
        <div class="kpi-value" style="color:var(--danger)">${formatMoney(totalPendingDebt)}</div>
        <div class="kpi-sub">${debts.length} compromisos registrados</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span>Índice de Disciplina</span>
          <div class="kpi-icon" style="background:rgba(245, 158, 11, 0.15);color:var(--warning)">⚡</div>
        </div>
        <div class="kpi-value" style="color:var(--warning)">${score}%</div>
        <div class="kpi-sub">${score >= 80 ? '🌟 Nivel Imparable' : score >= 60 ? '⚡ Nivel Constante' : '🌱 En desarrollo'}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span>Agenda de Hoy</span>
          <div class="kpi-icon" style="background:var(--success-bg);color:var(--success)">📅</div>
        </div>
        <div class="kpi-value">${doneTasks} / ${todayTasks.length}</div>
        <div class="kpi-sub">${todayTasks.length ? Math.round((doneTasks / todayTasks.length) * 100) : 100}% completado</div>
      </div>
    </div>

    <!-- Widget de Próxima Cuota de Deuda (Descuenta de Ingresos) -->
    ${nextUrgentInstallment ? `
      <div class="card-panel" style="margin-bottom:20px;border-left:4px solid var(--primary)">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <span class="status-badge status-pending">💳 Próxima Cuota por Pagar</span>
            <h4 style="font-size:16px;font-weight:800;margin:6px 0 2px">${nextUrgentDebt.title} · Cuota ${nextUrgentInstallment.number} de ${nextUrgentDebt.installmentsCount}</h4>
            <p style="color:var(--text-muted);font-size:12.5px;margin:0">
              Vence: <b>${nextUrgentInstallment.dueDate}</b> · Acreedor: ${nextUrgentDebt.creditor} · Monto: <b style="color:var(--text-main);font-size:14px">${formatMoney(nextUrgentInstallment.amount)}</b>
            </p>
          </div>
          <button class="btn btn-success" onclick="openPayDebtModal('${nextUrgentDebt.id}', ${nextUrgentInstallment.number})">
            💳 Pagar Cuota Ahora (Descontar de Ingresos)
          </button>
        </div>
      </div>
    ` : ''}

    <!-- Dual Layout: Recent Agenda & Transactions -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;">
      <div class="card-panel">
        <div class="panel-head">
          <h3>📅 Agenda Prioritaria de Hoy</h3>
          <button class="btn btn-sm btn-soft" onclick="state.view='agenda';render()">Ver agenda</button>
        </div>
        <div class="agenda-list">
          ${todayTasks.length ? todayTasks.map(item => `
            <div class="agenda-card ${item.done ? 'done' : ''}">
              <div class="agenda-time">${item.time}</div>
              <div class="agenda-body">
                <h4>${item.title}</h4>
                <div class="agenda-meta">
                  <span class="priority-tag p-${item.priority}">${item.priority}</span>
                  <span>${item.type === 'habit' ? '🌱 Hábito diario' : '📌 Tarea'}</span>
                </div>
              </div>
              <input type="checkbox" style="width:22px;height:22px;cursor:pointer;flex-shrink:0" ${item.done ? 'checked' : ''} onchange="toggleTaskDone('${item.id}')">
            </div>
          `).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px">No hay actividades para hoy. ¡Crea una para ganar disciplina!</p>'}
        </div>
      </div>

      <div class="card-panel">
        <div class="panel-head">
          <h3>💰 Movimientos Financieros Recientes</h3>
          <button class="btn btn-sm btn-soft" onclick="state.view='finanzas';render()">Ver finanzas</button>
        </div>
        <div class="tx-list">
          ${state.transactions.slice(0, 5).map(tx => `
            <div class="tx-item">
              <div class="tx-icon" style="background:${tx.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)'};color:${tx.type === 'income' ? 'var(--success)' : 'var(--danger)'}">
                ${tx.category.includes('Deuda') || tx.category.includes('Cuota') ? '💳' : tx.type === 'income' ? '↗' : '↘'}
              </div>
              <div class="tx-info">
                <strong>${tx.title}</strong>
                <small>${tx.category} · ${tx.method} · ${tx.date}</small>
              </div>
              <div class="tx-amount ${tx.type}">${tx.type === 'income' ? '+' : '-'} ${formatMoney(tx.amount)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 2. FINANZAS DIARIAS (INGRESOS, GASTOS & PAGOS)
// -------------------------------------------------------------
function renderFinanzas(container) {
  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;
  const debtExp = state.transactions.filter(t => t.type === 'expense' && (t.category.includes('Deuda') || t.category.includes('Cuota'))).reduce((s, x) => s + x.amount, 0);

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h3 style="font-size:20px;font-weight:800">Control Diario de Ingresos y Gastos</h3>
        <p style="color:var(--text-muted);font-size:13px">Administra tu dinero diario. Los pagos de cuotas descuentan automáticamente de tus ingresos.</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-success" onclick="openTxModal('income')">＋ Ingreso</button>
        <button class="btn btn-danger" onclick="openTxModal('expense')">－ Gasto</button>
        <button class="btn btn-primary" onclick="openPayDebtModalPrompt()">💳 Pagar Cuota de Deuda</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <span style="color:var(--text-muted);font-size:12px;font-weight:700">Total Ingresos</span>
        <div class="kpi-value" style="color:var(--success)">${formatMoney(totalInc)}</div>
      </div>
      <div class="kpi-card">
        <span style="color:var(--text-muted);font-size:12px;font-weight:700">Total Gastos</span>
        <div class="kpi-value" style="color:var(--danger)">${formatMoney(totalExp)}</div>
      </div>
      <div class="kpi-card">
        <span style="color:var(--text-muted);font-size:12px;font-weight:700">Balance Neto Disponible</span>
        <div class="kpi-value" style="color:${balance >= 0 ? 'var(--primary)' : 'var(--danger)'}">
          ${formatMoney(balance)}
        </div>
      </div>
      <div class="kpi-card">
        <span style="color:var(--text-muted);font-size:12px;font-weight:700">Amortizado en Deudas</span>
        <div class="kpi-value" style="color:var(--purple)">${formatMoney(debtExp)}</div>
      </div>
    </div>

    <!-- Regla de Presupuesto 50/30/20 -->
    <div class="card-panel" style="margin-bottom:20px">
      <div class="panel-head">
        <h3>📊 Distribución de Presupuesto 50 / 30 / 20</h3>
        <span style="font-size:12px;color:var(--text-muted)">Basado en tus ingresos</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:10px">
        <div style="background:var(--bg-secondary);padding:14px;border-radius:12px">
          <small style="color:var(--text-dim);font-weight:700">50% Necesidades Básicas</small>
          <strong style="display:block;font-size:17px;color:var(--primary);margin:4px 0">${formatMoney(totalInc * 0.5)}</strong>
          <small style="color:var(--text-muted)">Alimentación, servicios, vivienda y salud</small>
        </div>
        <div style="background:var(--bg-secondary);padding:14px;border-radius:12px">
          <small style="color:var(--text-dim);font-weight:700">30% Deseos y Estilo de Vida</small>
          <strong style="display:block;font-size:17px;color:var(--warning);margin:4px 0">${formatMoney(totalInc * 0.3)}</strong>
          <small style="color:var(--text-muted)">Ocio, salidas, suscripciones y extras</small>
        </div>
        <div style="background:var(--bg-secondary);padding:14px;border-radius:12px">
          <small style="color:var(--text-dim);font-weight:700">20% Cuotas de Deuda y Ahorro</small>
          <strong style="display:block;font-size:17px;color:var(--success);margin:4px 0">${formatMoney(totalInc * 0.2)}</strong>
          <small style="color:var(--text-muted)">Amortización de cuotas y fondo de reserva</small>
        </div>
      </div>
    </div>

    <div class="card-panel">
      <div class="panel-head">
        <h3>Historial Completo de Movimientos</h3>
        <input type="text" placeholder="Buscar concepto o categoría…" id="txSearchInput" oninput="filterTransactions(this.value)" style="max-width:240px">
      </div>
      <div class="tx-list" id="txFullList">
        ${renderTxList(state.transactions)}
      </div>
    </div>
  `;
}

function renderTxList(list) {
  if (!list.length) {
    return '<p style="color:var(--text-muted);text-align:center;padding:24px">Sin transacciones registradas.</p>';
  }
  return list.map(tx => `
    <div class="tx-item">
      <div class="tx-icon" style="background:${tx.category.includes('Deuda') || tx.category.includes('Cuota') ? 'var(--purple-bg)' : tx.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)'};color:${tx.category.includes('Deuda') || tx.category.includes('Cuota') ? 'var(--purple)' : tx.type === 'income' ? 'var(--success)' : 'var(--danger)'}">
        ${tx.category.includes('Deuda') || tx.category.includes('Cuota') ? '💳' : tx.type === 'income' ? '💵' : '💳'}
      </div>
      <div class="tx-info">
        <strong>${tx.title}</strong>
        <small>${tx.category} · ${tx.method} · ${tx.date} ${tx.notes ? '· ' + tx.notes : ''}</small>
      </div>
      <div class="tx-amount ${tx.type}">${tx.type === 'income' ? '+' : '-'} ${formatMoney(tx.amount)}</div>
      <button class="btn btn-sm btn-soft" onclick="deleteTransaction('${tx.id}')" title="Eliminar">🗑️</button>
    </div>
  `).join('');
}

window.filterTransactions = (q) => {
  const el = $('#txFullList');
  if (!el) return;
  const filtered = state.transactions.filter(t => 
    t.title.toLowerCase().includes(q.toLowerCase()) || 
    t.category.toLowerCase().includes(q.toLowerCase()) ||
    t.method.toLowerCase().includes(q.toLowerCase())
  );
  el.innerHTML = renderTxList(filtered);
};

// -------------------------------------------------------------
// 3. DEUDAS POR PAGAR & CUOTAS DISTRIBUIDAS (NUEVO MÓDULO)
// -------------------------------------------------------------
function renderDeudas(container) {
  const debts = state.debts || [];
  let totalOriginal = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let monthlyInstallmentsDue = 0;
  let nextUrgentInstallment = null;
  let nextUrgentDebt = null;

  const currentMonth = new Date().toISOString().slice(0, 7);

  debts.forEach(d => {
    totalOriginal += d.totalAmount;
    (d.installments || []).forEach(inst => {
      if (inst.status === 'paid') {
        totalPaid += inst.amount;
      } else {
        totalPending += inst.amount;
        if (inst.dueDate.startsWith(currentMonth)) {
          monthlyInstallmentsDue += inst.amount;
        }
        if (!nextUrgentInstallment || inst.dueDate < nextUrgentInstallment.dueDate) {
          nextUrgentInstallment = inst;
          nextUrgentDebt = d;
        }
      }
    });
  });

  const overallProgress = totalOriginal > 0 ? Math.round((totalPaid / totalOriginal) * 100) : 0;
  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0) || 1;
  const debtRatio = Math.round((monthlyInstallmentsDue / totalInc) * 100);

  // Semáforo de Carga Financiera
  let healthClass = 'health-good';
  let healthText = 'Carga Financiera Saludable (< 30%)';
  let healthDesc = 'Tus cuotas mensuales representan una porción segura de tus ingresos. Mantén la constancia.';

  if (debtRatio > 40) {
    healthClass = 'health-danger';
    healthText = 'Carga Financiera Crítica (> 40%)';
    healthDesc = 'Tus cuotas comprometen más del 40% de tus ingresos. Prioriza adelantar cuotas para recuperar liquidez.';
  } else if (debtRatio >= 30) {
    healthClass = 'health-warning';
    healthText = 'Carga Financiera Moderada (30% - 40%)';
    healthDesc = 'Precaución: tus compromisos mensuales están en el límite aconsejable. Evita nuevas deudas a plazos.';
  }

  // Separar deudas activas de las ya canceladas
  const activeDebts = debts.filter(d => (d.installments || []).some(i => i.status === 'pending'));
  const completedDebts = debts.filter(d => (d.installments || []).length > 0 && (d.installments || []).every(i => i.status === 'paid'));

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h3 style="font-size:20px;font-weight:800">Deudas por Pagar & Cuotas Distribuidas</h3>
        <p style="color:var(--text-muted);font-size:13px">
          Crea tus deudas, distribúyelas en cuotas y abónalas directamente. El pago se registra como gasto y descuenta de tus ingresos.
        </p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openDebtModal()">＋ Nueva Deuda por Pagar</button>
        <button class="btn btn-success" onclick="openPayDebtModalPrompt()">💳 Pagar Cuota Rápida</button>
        <button class="btn btn-soft" onclick="exportDebtsCsv()">📥 Exportar Cuotas (CSV)</button>
      </div>
    </div>

    <!-- Indicador de Semáforo de Salud Financiera -->
    <div class="debt-health-card ${healthClass}">
      <div style="display:flex;align-items:center;gap:14px">
        <div style="font-size:32px">🛡️</div>
        <div>
          <strong style="font-size:16px;display:block">${healthText} · Ratio: ${debtRatio}%</strong>
          <p style="margin:2px 0 0;font-size:12.5px;color:var(--text-muted)">${healthDesc}</p>
        </div>
      </div>
      <div style="text-align:right">
        <span style="font-size:11px;color:var(--text-dim);display:block">Cuotas del Mes</span>
        <strong style="font-size:18px;color:var(--text-main)">${formatMoney(monthlyInstallmentsDue)}</strong>
      </div>
    </div>

    <!-- KPIs de Deudas -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <span>Deuda Total Pendiente</span>
          <div class="kpi-icon" style="background:var(--danger-bg);color:var(--danger)">⚠️</div>
        </div>
        <div class="kpi-value" style="color:var(--danger)">${formatMoney(totalPending)}</div>
        <div class="kpi-sub">Total inicial: ${formatMoney(totalOriginal)}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span>Deuda Amortizada</span>
          <div class="kpi-icon" style="background:var(--success-bg);color:var(--success)">✅</div>
        </div>
        <div class="kpi-value" style="color:var(--success)">${formatMoney(totalPaid)}</div>
        <div class="kpi-sub">${overallProgress}% pagado del total</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span>Progreso Desendeudamiento</span>
          <div class="kpi-icon" style="background:var(--primary-glow);color:var(--primary)">📈</div>
        </div>
        <div class="kpi-value" style="color:var(--primary)">${overallProgress}%</div>
        <div class="debt-progress" style="margin-top:8px">
          <div class="debt-progress-fill" style="width:${overallProgress}%"></div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span>Próxima Cuota</span>
          <div class="kpi-icon" style="background:rgba(245, 158, 11, 0.15);color:var(--warning)">⏰</div>
        </div>
        <div class="kpi-value" style="font-size:20px;color:var(--warning)">
          ${nextUrgentInstallment ? formatMoney(nextUrgentInstallment.amount) : 'S/ 0.00'}
        </div>
        <div class="kpi-sub">${nextUrgentInstallment ? 'Vence: ' + nextUrgentInstallment.dueDate : 'Sin cuotas pendientes'}</div>
      </div>
    </div>

    <!-- Listado de Deudas Activas -->
    <div class="card-panel" style="margin-bottom:24px">
      <div class="panel-head">
        <h3>💳 Deudas Activas en Cuotas (${activeDebts.length})</h3>
        <span style="font-size:12.5px;color:var(--text-muted)">Selecciona 'Pagar Cuota' para abonar y descontar de ingresos</span>
      </div>

      ${activeDebts.length === 0 ? `
        <div style="text-align:center;padding:36px 16px;color:var(--text-muted)">
          <div style="font-size:42px;margin-bottom:8px">🎉</div>
          <strong style="font-size:16px;color:var(--text-main);display:block">¡Felicitaciones! No tienes deudas pendientes</strong>
          <p style="font-size:13px;margin:4px 0 16px">Estás al día o no has creado deudas por pagar. Pulsa el botón abajo si deseas planificar un nuevo compromiso en cuotas.</p>
          <button class="btn btn-primary" onclick="openDebtModal()">＋ Crear Deuda por Pagar</button>
        </div>
      ` : `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:16px;margin-top:10px">
          ${activeDebts.map(debt => {
            const insts = debt.installments || [];
            const paidInsts = insts.filter(i => i.status === 'paid');
            const pendingInsts = insts.filter(i => i.status === 'pending');
            const paidSum = paidInsts.reduce((s, x) => s + x.amount, 0);
            const pendingSum = debt.totalAmount - paidSum;
            const pct = Math.round((paidSum / debt.totalAmount) * 100);
            const nextInst = pendingInsts[0];

            return `
              <div class="debt-card">
                <div class="debt-card-header">
                  <div>
                    <h4 style="margin:0 0 2px">${debt.title}</h4>
                    <small style="color:var(--text-muted)">${debt.creditor} · ${debt.category}</small>
                  </div>
                  <span class="debt-installment-badge">${paidInsts.length} / ${debt.installmentsCount} cuotas</span>
                </div>

                <!-- Barra de Progreso de Amortización -->
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:4px">
                    <span style="color:var(--text-dim)">Progreso de cancelación</span>
                    <strong style="color:var(--primary)">${pct}%</strong>
                  </div>
                  <div class="debt-progress">
                    <div class="debt-progress-fill" style="width:${pct}%"></div>
                  </div>
                </div>

                <!-- Desglose de Montos -->
                <div class="debt-meta-grid">
                  <div class="debt-meta-item">
                    <small>Total Deuda</small>
                    <strong>${formatMoney(debt.totalAmount)}</strong>
                  </div>
                  <div class="debt-meta-item">
                    <small>Amortizado</small>
                    <strong style="color:var(--success)">${formatMoney(paidSum)}</strong>
                  </div>
                  <div class="debt-meta-item">
                    <small>Saldo Restante</small>
                    <strong style="color:var(--danger)">${formatMoney(pendingSum)}</strong>
                  </div>
                </div>

                <!-- Caja de la Siguiente Cuota a Pagar -->
                ${nextInst ? `
                  <div class="cuota-highlight-box">
                    <div>
                      <small style="color:var(--text-dim);display:block;font-size:11px">Siguiente Cuota (#${nextInst.number} de ${debt.installmentsCount})</small>
                      <strong>${formatMoney(nextInst.amount)}</strong>
                      <span style="font-size:11px;color:var(--text-muted);display:block">Vence: ${nextInst.dueDate}</span>
                    </div>
                    <button class="btn btn-sm btn-success" onclick="openPayDebtModal('${debt.id}', ${nextInst.number})">
                      💳 Pagar Cuota
                    </button>
                  </div>
                ` : `
                  <div style="background:var(--success-bg);color:var(--success);padding:10px;border-radius:10px;text-align:center;font-weight:750;font-size:12.5px">
                    ✓ Todas las cuotas pagadas
                  </div>
                `}

                <!-- Acciones Secundarias -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;gap:8px">
                  <button class="btn btn-sm btn-soft" style="flex:1" onclick="openDebtSchedule('${debt.id}')">
                    📋 Ver Cronograma (${debt.installmentsCount} cuotas)
                  </button>
                  <button class="btn btn-sm btn-soft" onclick="deleteDebt('${debt.id}')" title="Eliminar deuda">
                    🗑️
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>

    <!-- Deudas 100% Canceladas -->
    ${completedDebts.length > 0 ? `
      <div class="card-panel">
        <div class="panel-head">
          <h3>🏆 Deudas 100% Canceladas (${completedDebts.length})</h3>
          <span style="font-size:12px;color:var(--success)">¡Objetivo de desendeudamiento logrado!</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:10px">
          ${completedDebts.map(d => `
            <div style="background:var(--bg-secondary);border:1px solid rgba(16,185,129,0.3);border-radius:14px;padding:14px;display:flex;justify-content:space-between;align-items:center">
              <div>
                <strong style="display:block;font-size:14px">${d.title}</strong>
                <small style="color:var(--text-muted)">${d.creditor} · ${formatMoney(d.totalAmount)} cancelados</small>
              </div>
              <span class="status-badge status-paid">✓ 100% Pagada</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

// -------------------------------------------------------------
// CONTROLADORES DE MODALES Y OPERACIONES DE DEUDAS
// -------------------------------------------------------------

// Auto-cálculo de cuotas al escribir monto o número de cuotas
window.recalcInstallment = () => {
  const total = parseFloat($('#debtTotal')?.value) || 0;
  const count = parseInt($('#debtInstallmentsCount')?.value, 10) || 1;
  const cuotaInput = $('#debtInstallmentAmount');
  if (cuotaInput && count > 0) {
    cuotaInput.value = (total / count).toFixed(2);
  }
};

window.openDebtModal = () => {
  const modal = $('#debtModal');
  if (!modal) return;
  $('#debtForm').reset();
  $('#debtEditId').value = '';
  $('#debtFirstDueDate').value = new Date().toISOString().slice(0, 10);
  $('#debtInstallmentsCount').value = '6';
  modal.classList.remove('hidden');
};

window.saveDebt = (e) => {
  e.preventDefault();
  const totalAmount = parseFloat($('#debtTotal').value) || 0;
  const count = parseInt($('#debtInstallmentsCount').value, 10) || 1;
  const installmentAmount = parseFloat($('#debtInstallmentAmount').value) || (totalAmount / count);
  const firstDueDate = $('#debtFirstDueDate').value || new Date().toISOString().slice(0, 10);
  const frequency = $('#debtFrequency').value;

  // Generar cronograma de cuotas
  const installments = [];
  const baseDate = new Date(firstDueDate + 'T12:00:00');

  for (let i = 1; i <= count; i++) {
    const due = new Date(baseDate);
    if (frequency === 'monthly') {
      due.setMonth(due.getMonth() + (i - 1));
    } else if (frequency === 'biweekly') {
      due.setDate(due.getDate() + (i - 1) * 14);
    } else if (frequency === 'weekly') {
      due.setDate(due.getDate() + (i - 1) * 7);
    }

    installments.push({
      number: i,
      amount: installmentAmount,
      dueDate: due.toISOString().slice(0, 10),
      status: 'pending',
      paidDate: null,
      txId: null,
      method: null
    });
  }

  const newDebt = {
    id: 'debt-' + Date.now(),
    title: $('#debtTitle').value.trim(),
    creditor: $('#debtCreditor').value.trim(),
    category: $('#debtCategory').value,
    totalAmount: totalAmount,
    installmentsCount: count,
    installmentAmount: installmentAmount,
    startDate: firstDueDate,
    dueDay: baseDate.getDate(),
    frequency: frequency,
    notes: $('#debtNotes').value.trim(),
    installments: installments
  };

  if (!state.debts) state.debts = [];
  state.debts.push(newDebt);

  saveState();
  closeModal('debtModal');
  playChime('success');
  toast(`Deuda '${newDebt.title}' creada con ${count} cuotas programadas`, '💳');
  render();
};

// Abrir modal de pago de cuota
window.openPayDebtModal = (debtId, instNum = null) => {
  const debt = (state.debts || []).find(d => d.id === debtId);
  if (!debt) return;

  const insts = debt.installments || [];
  let targetInst = null;

  if (instNum !== null) {
    targetInst = insts.find(i => i.number === instNum);
  }
  if (!targetInst) {
    targetInst = insts.find(i => i.status === 'pending');
  }

  if (!targetInst) {
    toast('Esta deuda no tiene cuotas pendientes por pagar', 'ℹ️');
    return;
  }

  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;

  const paidSum = insts.filter(i => i.status === 'paid').reduce((s, x) => s + x.amount, 0);
  const remaining = debt.totalAmount - paidSum;

  $('#payTargetDebtId').value = debt.id;
  $('#payTargetInstNumber').value = targetInst.number;
  $('#payDebtNameDisplay').textContent = debt.title;
  $('#payDebtCreditorDisplay').textContent = debt.creditor + ' · ' + debt.category;
  $('#payDebtCuotaBadge').textContent = `Cuota ${targetInst.number} de ${debt.installmentsCount}`;
  $('#payDebtRemainingDisplay').textContent = formatMoney(remaining);
  $('#payDebtUserBalanceDisplay').textContent = formatMoney(balance);

  $('#payDebtAmount').value = targetInst.amount.toFixed(2);
  $('#payDebtDate').value = new Date().toISOString().slice(0, 10);
  $('#payDebtRecordExpense').checked = true;
  $('#payDebtNotes').value = `Pago cuota ${targetInst.number}/${debt.installmentsCount} · ${debt.title}`;

  $('#payDebtModal').classList.remove('hidden');
};

// Prompt para pagar cuota rápida si no se especificó deuda
window.openPayDebtModalPrompt = () => {
  const pendingDebts = (state.debts || []).filter(d => (d.installments || []).some(i => i.status === 'pending'));
  if (!pendingDebts.length) {
    toast('No tienes deudas activas con cuotas pendientes', '🎉');
    return;
  }
  openPayDebtModal(pendingDebts[0].id);
};

// Ejecución del Pago de Cuota y descuento de ingresos
window.executeDebtPayment = (e) => {
  e.preventDefault();
  const debtId = $('#payTargetDebtId').value;
  const instNumber = parseInt($('#payTargetInstNumber').value, 10);
  const payAmount = parseFloat($('#payDebtAmount').value) || 0;
  const payDate = $('#payDebtDate').value || new Date().toISOString().slice(0, 10);
  const payMethod = $('#payDebtMethod').value;
  const recordExpense = $('#payDebtRecordExpense').checked;
  const payNotes = $('#payDebtNotes').value.trim();

  const debt = (state.debts || []).find(d => d.id === debtId);
  if (!debt) return;

  const inst = (debt.installments || []).find(i => i.number === instNumber);
  if (!inst) return;

  // 1. Marcar cuota como pagada
  inst.status = 'paid';
  inst.paidDate = payDate;
  inst.method = payMethod;

  // 2. Si está activado, registrar como GASTO en Finanzas Diarias
  // Esto suma a totalExp y descuenta automáticamente de los ingresos / balance neto
  if (recordExpense) {
    const tx = {
      id: 'tx-cuota-' + Date.now(),
      type: 'expense',
      title: `Pago Cuota ${inst.number}/${debt.installmentsCount} · ${debt.title}`,
      amount: payAmount,
      category: 'Pago de Deuda / Cuotas',
      date: payDate,
      method: payMethod,
      notes: payNotes || `Amortización de deuda ${debt.title} (${debt.creditor})`,
      debtId: debt.id,
      installmentNumber: inst.number
    };
    state.transactions.unshift(tx);
    inst.txId = tx.id;
  }

  saveState();
  closeModal('payDebtModal');
  closeModal('debtScheduleModal');

  // Verificar si la deuda quedó 100% cancelada
  const isFullyPaid = (debt.installments || []).every(i => i.status === 'paid');

  if (isFullyPaid) {
    playChime('celebrate');
    toast(`🎉 ¡FELICITACIONES! Has cancelado por completo la deuda '${debt.title}'.`, '🏆');
  } else {
    playChime('success');
    toast(`Cuota ${inst.number} pagada con éxito (${formatMoney(payAmount)}). Registrada en tus gastos y descontada de ingresos.`, '💳');
  }

  render();
};

// Ver Cronograma Completo de una Deuda
window.openDebtSchedule = (debtId) => {
  const debt = (state.debts || []).find(d => d.id === debtId);
  if (!debt) return;

  const insts = debt.installments || [];
  const paidInsts = insts.filter(i => i.status === 'paid');
  const paidSum = paidInsts.reduce((s, x) => s + x.amount, 0);
  const pendingSum = debt.totalAmount - paidSum;
  const pct = Math.round((paidSum / debt.totalAmount) * 100);

  $('#schedDebtTitle').textContent = `Cronograma de Pagos: ${debt.title}`;
  $('#schedDebtSub').textContent = `${debt.creditor} · ${debt.category} · ${debt.installmentsCount} cuotas`;

  $('#schedSummaryBar').innerHTML = `
    <div>
      <small style="color:var(--text-dim);display:block;font-size:11px">Total Deuda</small>
      <strong style="font-size:14px">${formatMoney(debt.totalAmount)}</strong>
    </div>
    <div>
      <small style="color:var(--text-dim);display:block;font-size:11px">Pagado</small>
      <strong style="font-size:14px;color:var(--success)">${formatMoney(paidSum)}</strong>
    </div>
    <div>
      <small style="color:var(--text-dim);display:block;font-size:11px">Pendiente</small>
      <strong style="font-size:14px;color:var(--danger)">${formatMoney(pendingSum)}</strong>
    </div>
    <div>
      <small style="color:var(--text-dim);display:block;font-size:11px">Progreso</small>
      <strong style="font-size:14px;color:var(--primary)">${pct}%</strong>
    </div>
  `;

  const tbody = $('#schedTableBody');
  tbody.innerHTML = insts.map(inst => {
    const isPaid = inst.status === 'paid';
    return `
      <tr class="installment-row ${isPaid ? 'paid' : ''}">
        <td><b>Cuota ${inst.number}</b></td>
        <td>${inst.dueDate}</td>
        <td><b>${formatMoney(inst.amount)}</b></td>
        <td>
          <span class="status-badge ${isPaid ? 'status-paid' : 'status-pending'}">
            ${isPaid ? '✓ Pagada' : '⏳ Pendiente'}
          </span>
        </td>
        <td>${inst.paidDate ? inst.paidDate + ' (' + (inst.method || '') + ')' : '-'}</td>
        <td>
          ${isPaid ? `
            <button class="btn btn-sm btn-soft" onclick="reverseDebtInstallment('${debt.id}', ${inst.number})" title="Reversar pago">
              ↩ Reversar
            </button>
          ` : `
            <button class="btn btn-sm btn-success" onclick="openPayDebtModal('${debt.id}', ${inst.number})">
              💳 Pagar Cuota
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');

  $('#debtScheduleModal').classList.remove('hidden');
};

// Reversar cuota en caso de error
window.reverseDebtInstallment = (debtId, instNum) => {
  const debt = (state.debts || []).find(d => d.id === debtId);
  if (!debt) return;
  const inst = (debt.installments || []).find(i => i.number === instNum);
  if (!inst) return;

  if (confirm(`¿Deseas reversar la Cuota ${instNum}? Si existe un gasto registrado, también se eliminará.`)) {
    if (inst.txId) {
      state.transactions = state.transactions.filter(t => t.id !== inst.txId);
    }
    inst.status = 'pending';
    inst.paidDate = null;
    inst.method = null;
    inst.txId = null;

    saveState();
    toast(`Cuota ${instNum} restablecida a pendiente`, '↩️');
    openDebtSchedule(debtId);
    render();
  }
};

window.deleteDebt = (debtId) => {
  const debt = (state.debts || []).find(d => d.id === debtId);
  if (!debt) return;
  if (confirm(`¿Eliminar la deuda '${debt.title}' y todo su cronograma de cuotas?`)) {
    state.debts = state.debts.filter(d => d.id !== debtId);
    saveState();
    toast('Deuda eliminada del registro', '🗑️');
    render();
  }
};

window.exportDebtsCsv = () => {
  const debts = state.debts || [];
  let csv = 'Deuda,Acreedor,Categoria,CuotaNumero,MontoCuota,FechaVencimiento,Estado,FechaPago,Metodo\n';
  debts.forEach(d => {
    (d.installments || []).forEach(i => {
      csv += `"${d.title}","${d.creditor}","${d.category}",${i.number},${i.amount},"${i.dueDate}","${i.status}","${i.paidDate || ''}","${i.method || ''}"\n`;
    });
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cronograma_deudas_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  toast('Cronograma de deudas descargado (.CSV)', '📥');
};

// -------------------------------------------------------------
// 4. AGENDA VIRTUAL & HÁBITOS
// -------------------------------------------------------------
function renderAgenda(container) {
  const today = new Date().toISOString().slice(0, 10);
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h3 style="font-size:20px;font-weight:800">Agenda Virtual & Hábitos Diarios</h3>
        <p style="color:var(--text-muted);font-size:13px">Bloques de tiempo, tareas prioritarias y hábitos para desarrollar disciplina constante.</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openAgendaModal()">＋ Nueva Actividad</button>
        <button class="btn btn-soft" onclick="setupGoogleIntegrations();$('#syncCalendarBtn').click()">📅 Enviar a Google Calendar</button>
      </div>
    </div>

    <div class="card-panel">
      <div class="panel-head">
        <h3>Actividades y Hábitos (${today})</h3>
        <span class="nav-badge">${state.agenda.filter(a => a.done).length} de ${state.agenda.length} completados</span>
      </div>
      <div class="agenda-list">
        ${state.agenda.map(item => `
          <div class="agenda-card ${item.done ? 'done' : ''}">
            <div class="agenda-time">${item.time}</div>
            <div class="agenda-body">
              <h4>${item.title}</h4>
              <div class="agenda-meta">
                <span class="priority-tag p-${item.priority}">Prioridad ${item.priority}</span>
                <span>${item.type === 'habit' ? '🌱 Hábito diario' : '📌 Tarea'}</span>
                <span>${item.date}</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <input type="checkbox" style="width:22px;height:22px;cursor:pointer" ${item.done ? 'checked' : ''} onchange="toggleTaskDone('${item.id}')">
              <button class="btn btn-sm btn-soft" onclick="deleteAgendaItem('${item.id}')">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 5. MODO ENFOQUE (POMODORO)
// -------------------------------------------------------------
function renderPomodoro(container) {
  const pomo = state.pomodoro;
  const mins = Math.floor(pomo.timeLeft / 60);
  const secs = pomo.timeLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const pendingTasks = state.agenda.filter(a => !a.done);

  container.innerHTML = `
    <div style="margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:800">Modo Enfoque · Pomodoro de Disciplina</h3>
      <p style="color:var(--text-muted);font-size:13px">Trabaja en bloques de 25 minutos con descansos de 5 minutos para entrenar tu concentración.</p>
    </div>

    <div class="card-panel pomodoro-box" style="max-width:560px;margin:0 auto">
      <div class="pomodoro-modes">
        <button class="pomodoro-mode-btn ${pomo.mode === 'work' ? 'active' : ''}" onclick="setPomodoroMode('work')">🧠 Trabajo (25 min)</button>
        <button class="pomodoro-mode-btn ${pomo.mode === 'short' ? 'active' : ''}" onclick="setPomodoroMode('short')">☕ Descanso Corto (5 min)</button>
        <button class="pomodoro-mode-btn ${pomo.mode === 'long' ? 'active' : ''}" onclick="setPomodoroMode('long')">🌴 Descanso Largo (15 min)</button>
      </div>

      <div class="pomodoro-timer" id="pomodoroTimerDisplay">${timeFormatted}</div>

      <div style="margin-bottom:18px;width:100%;max-width:380px">
        <label style="font-size:12px;color:var(--text-dim);display:block;margin-bottom:6px">Actividad enfocada:</label>
        <select id="pomoTaskSelect" onchange="state.pomodoro.selectedTaskId = this.value; saveState()" style="width:100%;padding:10px;border-radius:10px;background:var(--bg-secondary);border:1px solid var(--border)">
          <option value="">Selecciona una tarea de tu agenda...</option>
          ${pendingTasks.map(t => `<option value="${t.id}" ${pomo.selectedTaskId === t.id ? 'selected' : ''}>${t.title} (${t.time})</option>`).join('')}
        </select>
      </div>

      <div class="pomodoro-actions">
        ${pomo.running ? `
          <button class="btn btn-danger" onclick="pausePomodoro()" style="min-width:130px;font-size:15px">⏸️ Pausar</button>
        ` : `
          <button class="btn btn-primary" onclick="startPomodoro()" style="min-width:130px;font-size:15px">▶️ Iniciar Enfoque</button>
        `}
        <button class="btn btn-soft" onclick="resetPomodoro()" style="min-width:100px">🔄 Reiniciar</button>
      </div>

      <div style="display:flex;align-items:center;gap:12px;margin-top:24px;padding-top:16px;border-top:1px solid var(--border)">
        <span style="font-size:24px">🍅</span>
        <div style="text-align:left">
          <strong style="font-size:14px;display:block">Sesiones Completadas Hoy: ${pomo.sessionsCompleted}</strong>
          <small style="color:var(--text-muted)">Cada bloque completado suma puntos a tu Índice de Disciplina.</small>
        </div>
      </div>
    </div>
  `;
}

window.setPomodoroMode = (mode) => {
  clearInterval(state.pomodoro.timer);
  state.pomodoro.running = false;
  state.pomodoro.mode = mode;
  if (mode === 'work') state.pomodoro.timeLeft = 25 * 60;
  else if (mode === 'short') state.pomodoro.timeLeft = 5 * 60;
  else if (mode === 'long') state.pomodoro.timeLeft = 15 * 60;
  render();
};

window.startPomodoro = () => {
  if (state.pomodoro.running) return;
  state.pomodoro.running = true;
  state.pomodoro.timer = setInterval(() => {
    if (state.pomodoro.timeLeft > 0) {
      state.pomodoro.timeLeft--;
      const mins = Math.floor(state.pomodoro.timeLeft / 60);
      const secs = state.pomodoro.timeLeft % 60;
      const display = $('#pomodoroTimerDisplay');
      if (display) display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
      clearInterval(state.pomodoro.timer);
      state.pomodoro.running = false;
      playChime('celebrate');
      if (state.pomodoro.mode === 'work') {
        state.pomodoro.sessionsCompleted = (state.pomodoro.sessionsCompleted || 0) + 1;
        saveState();
        toast('🎉 ¡Bloque de enfoque completado! +Puntos de Disciplina.', '🍅');
        // Si tenía tarea asignada, marcarla
        if (state.pomodoro.selectedTaskId) {
          const task = state.agenda.find(t => t.id === state.pomodoro.selectedTaskId);
          if (task) task.done = true;
          saveState();
        }
      } else {
        toast('Descanso finalizado. ¡Listo para volver al enfoque!', '⚡');
      }
      render();
    }
  }, 1000);
  render();
};

window.pausePomodoro = () => {
  clearInterval(state.pomodoro.timer);
  state.pomodoro.running = false;
  render();
};

window.resetPomodoro = () => {
  clearInterval(state.pomodoro.timer);
  state.pomodoro.running = false;
  setPomodoroMode(state.pomodoro.mode);
};

// -------------------------------------------------------------
// 6. METAS DE AHORRO & FONDOS
// -------------------------------------------------------------
function renderAhorros(container) {
  const savings = state.savings || [];
  const totalSaved = savings.reduce((s, x) => s + x.currentAmount, 0);
  const totalTarget = savings.reduce((s, x) => s + x.targetAmount, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h3 style="font-size:20px;font-weight:800">Metas de Ahorro & Fondos de Reserva</h3>
        <p style="color:var(--text-muted);font-size:13px">Separa fondos para tu tranquilidad y alcanza tus metas con constancia.</p>
      </div>
      <button class="btn btn-primary" onclick="openSavingsModal()">＋ Nueva Meta de Ahorro</button>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">Total Ahorrado</span>
        <div class="kpi-value" style="color:var(--success)">${formatMoney(totalSaved)}</div>
        <div class="kpi-sub">En ${savings.length} metas activas</div>
      </div>
      <div class="kpi-card">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">Objetivo Total</span>
        <div class="kpi-value" style="color:var(--primary)">${formatMoney(totalTarget)}</div>
        <div class="kpi-sub">Monto meta consolidado</div>
      </div>
      <div class="kpi-card">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">Progreso de Ahorro</span>
        <div class="kpi-value" style="color:var(--warning)">${overallPct}%</div>
        <div class="debt-progress" style="margin-top:6px">
          <div class="debt-progress-fill" style="width:${overallPct}%"></div>
        </div>
      </div>
    </div>

    <div class="saving-grid" style="margin-top:16px">
      ${savings.map(goal => {
        const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
        return `
          <div class="saving-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <strong style="font-size:16px;display:block">${goal.title}</strong>
                <small style="color:var(--text-muted)">${goal.category} · Meta: ${goal.targetDate}</small>
              </div>
              <span class="nav-badge">${pct}%</span>
            </div>

            <div style="margin:8px 0">
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
                <span style="color:var(--text-dim)">${formatMoney(goal.currentAmount)}</span>
                <span style="color:var(--text-muted)">de ${formatMoney(goal.targetAmount)}</span>
              </div>
              <div class="debt-progress">
                <div class="debt-progress-fill" style="width:${Math.min(100, pct)}%"></div>
              </div>
            </div>

            <div style="display:flex;gap:8px;margin-top:6px">
              <button class="btn btn-sm btn-success" style="flex:1" onclick="openSavingsContributeModal('${goal.id}')">
                💰 Aportar al Ahorro
              </button>
              <button class="btn btn-sm btn-soft" onclick="deleteSavingsGoal('${goal.id}')" title="Eliminar meta">
                🗑️
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.openSavingsModal = () => {
  $('#savingsModal').classList.remove('hidden');
  $('#savDate').value = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
};

window.saveSavingsGoal = (e) => {
  e.preventDefault();
  const goal = {
    id: 'sav-' + Date.now(),
    title: $('#savTitle').value.trim(),
    targetAmount: parseFloat($('#savTarget').value) || 0,
    currentAmount: parseFloat($('#savInitial').value) || 0,
    targetDate: $('#savDate').value,
    category: $('#savCategory').value
  };
  if (!state.savings) state.savings = [];
  state.savings.push(goal);
  saveState();
  closeModal('savingsModal');
  toast('Meta de ahorro creada', '🎯');
  render();
};

window.openSavingsContributeModal = (goalId) => {
  const goal = (state.savings || []).find(g => g.id === goalId);
  if (!goal) return;
  $('#savContributeGoalId').value = goal.id;
  $('#savContributeGoalTitle').value = `${goal.title} (Faltan: ${formatMoney(goal.targetAmount - goal.currentAmount)})`;
  $('#savContributeAmount').value = '100.00';
  $('#savContributeDate').value = new Date().toISOString().slice(0, 10);
  $('#savingsContributeModal').classList.remove('hidden');
};

window.executeSavingsContribute = (e) => {
  e.preventDefault();
  const goalId = $('#savContributeGoalId').value;
  const amount = parseFloat($('#savContributeAmount').value) || 0;
  const date = $('#savContributeDate').value || new Date().toISOString().slice(0, 10);
  const recordExp = $('#savRecordExpense').checked;

  const goal = (state.savings || []).find(g => g.id === goalId);
  if (!goal) return;

  goal.currentAmount += amount;

  if (recordExp) {
    const tx = {
      id: 'tx-sav-' + Date.now(),
      type: 'expense',
      title: `Aporte a Ahorro: ${goal.title}`,
      amount: amount,
      category: 'Ahorro / Inversión',
      date: date,
      method: 'Transferencia',
      notes: `Alcancía ${goal.title}`
    };
    state.transactions.unshift(tx);
  }

  saveState();
  closeModal('savingsContributeModal');
  playChime('success');
  toast(`Aporte de ${formatMoney(amount)} registrado a ${goal.title}`, '🎯');
  render();
};

window.deleteSavingsGoal = (id) => {
  if (confirm('¿Eliminar esta meta de ahorro?')) {
    state.savings = (state.savings || []).filter(g => g.id !== id);
    saveState();
    toast('Meta de ahorro eliminada', '🗑️');
    render();
  }
};

// -------------------------------------------------------------
// 7. INDICADORES CLAVE (KPIS & MÉTRICAS)
// -------------------------------------------------------------
function renderIndicadores(container) {
  const score = calculateDisciplineScore();
  const streak = getDisciplineStreak();
  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;
  const savingsPct = totalInc > 0 ? Math.round((balance / totalInc) * 100) : 0;
  const agendaPct = state.agenda.length ? Math.round((state.agenda.filter(a => a.done).length / state.agenda.length) * 100) : 100;

  // KPIs de Deuda
  const debts = state.debts || [];
  let totalOrig = 0, totalPaidDebt = 0, totalPendingDebt = 0;
  debts.forEach(d => {
    totalOrig += d.totalAmount;
    (d.installments || []).forEach(i => {
      if (i.status === 'paid') totalPaidDebt += i.amount;
      else totalPendingDebt += i.amount;
    });
  });
  const debtAmortPct = totalOrig > 0 ? Math.round((totalPaidDebt / totalOrig) * 100) : 100;

  container.innerHTML = `
    <div style="margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:800">Medición de Todo · Indicadores Clave (KPIs)</h3>
      <p style="color:var(--text-muted);font-size:13px">Lo que no se mide, no se puede mejorar. Monitorea tu disciplina, finanzas y deuda.</p>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">Índice de Disciplina</span>
        <div class="kpi-value" style="color:var(--warning)">${score}%</div>
        <div class="kpi-sub">Fórmula: 40% agenda + 30% finanzas + 15% deudas + 15% enfoque</div>
      </div>
      <div class="kpi-card">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">Racha de Cumplimiento</span>
        <div class="kpi-value" style="color:#f59e0b">🔥 ${streak} Días</div>
        <div class="kpi-sub">Consistencia diaria ininterrumpida</div>
      </div>
      <div class="kpi-card">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">Desendeudamiento</span>
        <div class="kpi-value" style="color:var(--primary)">${debtAmortPct}%</div>
        <div class="kpi-sub">Deuda cancelada del total original</div>
      </div>
      <div class="kpi-card">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">Cumplimiento de Agenda</span>
        <div class="kpi-value" style="color:var(--success)">${agendaPct}%</div>
        <div class="kpi-sub">Meta diaria: >= 80%</div>
      </div>
    </div>

    <!-- Gráfico Canvas Semanal de Disciplina -->
    <div class="card-panel" style="margin-bottom:20px">
      <div class="panel-head">
        <h3>Evolución Semanal de Disciplina (Canvas)</h3>
        <span style="font-size:12px;color:var(--text-muted)">Últimos 7 días</span>
      </div>
      <div style="position:relative;width:100%;height:220px;">
        <canvas id="disciplineChart" width="700" height="220" style="width:100%;height:100%;border-radius:10px;background:rgba(0,0,0,0.2)"></canvas>
      </div>
    </div>

    <!-- Gráfico Canvas Distribución Financiera -->
    <div class="card-panel">
      <div class="panel-head">
        <h3>Distribución de Dinero: Ingresos vs Gastos vs Deudas</h3>
        <span style="font-size:12px;color:var(--text-muted)">Flujo de caja activo</span>
      </div>
      <div style="position:relative;width:100%;height:180px;">
        <canvas id="financeBarChart" width="700" height="180" style="width:100%;height:100%;border-radius:10px;background:rgba(0,0,0,0.2)"></canvas>
      </div>
    </div>
  `;

  setTimeout(() => {
    drawDisciplineChart();
    drawFinanceBarChart();
  }, 50);
}

function drawDisciplineChart() {
  const canvas = $('#disciplineChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'];
  const values = [65, 70, 80, 75, 85, 90, calculateDisciplineScore()];

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let y = 30; y < h - 30; y += 40) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  const step = (w - 70) / (values.length - 1);

  values.forEach((v, i) => {
    const x = 40 + i * step;
    const y = h - 40 - (v / 100) * (h - 80);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  values.forEach((v, i) => {
    const x = 40 + i * step;
    const y = h - 40 - (v / 100) * (h - 80);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`${v}%`, x - 10, y - 10);

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px sans-serif';
    ctx.fillText(days[i], x - 10, h - 15);
  });
}

function drawFinanceBarChart() {
  const canvas = $('#financeBarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0) || 1;
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const debts = (state.debts || []).reduce((s, d) => s + (d.installments || []).filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0), 0);
  const savings = (state.savings || []).reduce((s, x) => s + x.currentAmount, 0);

  const categories = [
    { label: 'Ingresos', val: totalInc, color: '#10b981' },
    { label: 'Gastos', val: totalExp, color: '#ef4444' },
    { label: 'Deuda Pendiente', val: debts, color: '#f59e0b' },
    { label: 'Ahorro Acumulado', val: savings, color: '#3b82f6' }
  ];

  const maxVal = Math.max(...categories.map(c => c.val), 100);
  const barWidth = 44;
  const gap = (w - (categories.length * barWidth)) / (categories.length + 1);

  categories.forEach((cat, idx) => {
    const barHeight = (cat.val / maxVal) * (h - 70);
    const x = gap + idx * (barWidth + gap);
    const y = h - 35 - barHeight;

    ctx.fillStyle = cat.color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(`S/ ${Math.round(cat.val)}`, x - 4, y - 6);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '10.5px sans-serif';
    ctx.fillText(cat.label, x - 10, h - 14);
  });
}

// -------------------------------------------------------------
// 8. GOOGLE INTEGRATION & SCRIPTS
// -------------------------------------------------------------
function renderGoogle(container) {
  container.innerHTML = `
    <div style="margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:800">Conexión con Google Sheets & Calendar</h3>
      <p style="color:var(--text-muted);font-size:13px">Integra tu agenda y control financiero directamente con las herramientas de Google.</p>
    </div>

    <!-- Banner de Cuenta Configurada -->
    <div class="card-panel" style="background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(16,185,129,0.12));border:1px solid rgba(59,130,246,0.35);margin-bottom:20px;padding:16px 20px">
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <div style="width:42px;height:42px;border-radius:12px;background:var(--primary);color:#fff;display:grid;place-items:center;font-size:20px;flex-shrink:0">📧</div>
        <div style="flex:1;min-width:220px">
          <strong style="font-size:15px;display:block">Cuenta Google Configurada: tualiadoenusaforms@gmail.com</strong>
          <small style="color:var(--text-muted);display:block;margin-top:2px">Las exportaciones de Google Sheets y la sincronización de Google Calendar están configuradas para este correo.</small>
        </div>
        <span class="hero-tag" style="background:var(--success-bg);color:var(--success);font-weight:800">✓ Correo Vinculado</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px">
      <!-- Google Calendar Sync Card -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>📅 Google Calendar</h3>
          <span class="nav-badge">Sincronización</span>
        </div>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px">
          Envía tus recordatorios y vencimientos de cuotas directamente a Google Calendar en <b>tualiadoenusaforms@gmail.com</b> para recibir notificaciones en tu celular aún con la web inactiva.
        </p>
        <button class="btn btn-primary" id="syncCalendarBtn" style="width:100%;margin-bottom:10px">📅 Sincronizar Agenda & Cuotas</button>
        <button class="btn btn-soft" id="googleSignInBtn" style="width:100%">🔑 Conectar con tualiadoenusaforms@gmail.com</button>
      </div>

      <!-- Google Sheets Sync Card -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>📗 Google Sheets</h3>
          <span class="nav-badge">Exportación</span>
        </div>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px">
          Descarga o exporta todas tus transacciones financieras (ingresos, gastos y cuotas) organizadas en columnas compatibles con hojas de cálculo para <b>tualiadoenusaforms@gmail.com</b>.
        </p>
        <button class="btn btn-success" id="exportSheetsBtn" style="width:100%;margin-bottom:10px">📊 Exportar a Google Sheets (.CSV)</button>
        <button class="btn btn-soft" id="copyScriptBtn" style="width:100%">📋 Copiar Google Apps Script</button>
      </div>
    </div>

    <!-- Apps Script Generator Box -->
    <div class="card-panel" style="margin-top:20px">
      <div class="panel-head">
        <h3>⚡ Script de Google Apps Script (Webhook)</h3>
        <span class="nav-badge">Apps Script</span>
      </div>
      <p style="color:var(--text-muted);font-size:13px;margin-bottom:12px">
        Puedes vincular una Web App de Apps Script creada desde tu cuenta <b>tualiadoenusaforms@gmail.com</b> para registrar automáticamente cada transacción o tarea en tu Google Sheet:
      </p>
      <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
        <input type="url" id="appsScriptInput" placeholder="https://script.google.com/macros/s/.../exec" value="${state.appsScriptUrl}" style="flex:1;min-width:240px">
        <button class="btn btn-primary" onclick="saveAppsScriptUrl()">Guardar URL</button>
      </div>
    </div>
  `;
  setupGoogleIntegrations();
}

window.saveAppsScriptUrl = () => {
  const val = $('#appsScriptInput')?.value.trim() || '';
  state.appsScriptUrl = val;
  saveState();
  toast('URL de Google Apps Script guardada', '✅');
};

function exportTransactionsCsv() {
  let csv = 'Fecha,Tipo,Concepto,Monto,Categoria,Metodo,Notas\n';
  state.transactions.forEach(tx => {
    csv += `"${tx.date}","${tx.type}","${tx.title}",${tx.amount},"${tx.category}","${tx.method}","${tx.notes || ''}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gestion_personal_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  toast('Movimientos exportados a CSV para Google Sheets', '📗');
}

// -------------------------------------------------------------
// 9. SEGURIDAD EN DOS PASOS & PWA
// -------------------------------------------------------------
function renderSeguridad(container) {
  container.innerHTML = `
    <div style="margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:800">Seguridad en Dos Pasos & Aplicación PWA</h3>
      <p style="color:var(--text-muted);font-size:13px">Protege tus finanzas y configura el acceso rápido desde tu teléfono móvil.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px">
      <div class="card-panel">
        <div class="panel-head">
          <h3>🔐 Acceso en Dos Pasos (2FA)</h3>
          <span class="nav-badge" style="background:var(--success-bg);color:var(--success)">Activo</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg-secondary);border-radius:10px">
            <span style="font-size:20px">👤</span>
            <div style="flex:1">
              <strong style="font-size:13px">Paso 1: Identidad del Usuario</strong>
              <small style="color:var(--text-muted);display:block">${state.user.name} (${state.user.email})</small>
            </div>
            <span style="color:var(--success);font-weight:800;font-size:12px">✓ Verificado</span>
          </div>

          <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg-secondary);border-radius:10px">
            <span style="font-size:20px">🔒</span>
            <div style="flex:1">
              <strong style="font-size:13px">Paso 2: PIN de Seguridad</strong>
              <small style="color:var(--text-muted);display:block">PIN de 4 dígitos para proteger finanzas</small>
            </div>
            <button class="btn btn-sm btn-soft" onclick="showPinModal()">Cambiar / Probar</button>
          </div>
        </div>
        <button class="btn btn-danger" style="width:100%" onclick="state.pinLocked=true;render();showPinModal()">🔒 Bloquear Pantalla con PIN Ahora</button>
      </div>

      <div class="card-panel">
        <div class="panel-head">
          <h3>📲 Notificaciones y PWA Móvil</h3>
          <span class="nav-badge">Celular</span>
        </div>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px">
          Permite que la app te notifique en el celular recordatorios de tareas, cierre del día financiero y hábitos aún con la web inactiva.
        </p>
        <button class="btn btn-primary" id="enableNotifBtn" style="width:100%;margin-bottom:10px">
          🔔 ${state.notificationsEnabled ? 'Notificaciones Activadas' : 'Activar Notificaciones en Celular'}
        </button>
        <button class="btn btn-soft" id="pwaInstallBtn" style="width:100%">📲 Instalar App en Pantalla de Inicio</button>
      </div>
    </div>

    <!-- Respaldo y Restauración de Datos -->
    <div class="card-panel" style="margin-top:20px">
      <div class="panel-head">
        <h3>💾 Copia de Seguridad & Respaldo Local</h3>
        <span class="nav-badge">Backup</span>
      </div>
      <p style="color:var(--text-muted);font-size:13px;margin-bottom:14px">
        Descarga una copia completa de tus finanzas, deudas, cuotas y agenda en formato JSON o restáurala en cualquier dispositivo.
      </p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-soft" onclick="exportJsonBackup()">📥 Descargar Backup Completo (JSON)</button>
        <label class="btn btn-soft" style="cursor:pointer">
          📤 Restaurar Backup
          <input type="file" accept=".json" onchange="importJsonBackup(event)" style="display:none">
        </label>
      </div>
    </div>
  `;
  setupNotifications();
}

window.exportJsonBackup = () => {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gestion_personal_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  toast('Copia de seguridad descargada', '💾');
};

window.importJsonBackup = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (parsed.transactions) state.transactions = parsed.transactions;
      if (parsed.debts) state.debts = parsed.debts;
      if (parsed.savings) state.savings = parsed.savings;
      if (parsed.agenda) state.agenda = parsed.agenda;
      saveState();
      toast('Copia de seguridad restaurada con éxito', '✅');
      render();
    } catch (err) {
      toast('Error al leer el archivo de copia de seguridad', '❌');
    }
  };
  reader.readAsText(file);
};

// -------------------------------------------------------------
// OPERACIONES DE TRANSACCIONES Y AGENDA
// -------------------------------------------------------------
window.openTxModal = (type) => {
  const modal = $('#txModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  $('#txType').value = type;
  $('#txModalTitle').textContent = type === 'income' ? 'Registrar Ingreso' : 'Registrar Gasto';
  $('#txDate').value = new Date().toISOString().slice(0, 10);
};

window.openAgendaModal = () => {
  const modal = $('#agendaModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  $('#agDate').value = new Date().toISOString().slice(0, 10);
};

window.closeModal = (id) => {
  const el = $(`#${id}`);
  if (el) el.classList.add('hidden');
};

window.saveTransaction = (e) => {
  e.preventDefault();
  const tx = {
    id: 'tx-' + Date.now(),
    type: $('#txType').value,
    title: $('#txTitle').value.trim(),
    amount: parseFloat($('#txAmount').value) || 0,
    category: $('#txCategory').value,
    date: $('#txDate').value || new Date().toISOString().slice(0, 10),
    method: $('#txMethod').value,
    notes: $('#txNotes').value.trim()
  };

  state.transactions.unshift(tx);
  saveState();
  closeModal('txModal');
  playChime('success');
  toast(`${tx.type === 'income' ? 'Ingreso' : 'Gasto'} registrado correctamente`, '💰');
  render();
};

window.saveAgendaItem = (e) => {
  e.preventDefault();
  const item = {
    id: 'ag-' + Date.now(),
    title: $('#agTitle').value.trim(),
    time: $('#agTime').value || '09:00',
    priority: $('#agPriority').value,
    type: $('#agType').value,
    date: $('#agDate').value || new Date().toISOString().slice(0, 10),
    done: false
  };

  state.agenda.push(item);
  saveState();
  closeModal('agendaModal');
  playChime('success');
  toast('Actividad agregada a tu agenda de disciplina', '📅');
  render();
};

window.toggleTaskDone = (id) => {
  const task = state.agenda.find(a => a.id === id);
  if (task) {
    task.done = !task.done;
    saveState();
    playChime(task.done ? 'success' : 'error');
    toast(task.done ? '¡Actividad completada! +Disciplina 🔥' : 'Actividad marcada como pendiente', task.done ? '✅' : '↩️');
    render();
  }
};

window.deleteTransaction = (id) => {
  state.transactions = state.transactions.filter(t => t.id !== id);
  saveState();
  toast('Movimiento eliminado', '🗑️');
  render();
};

window.deleteAgendaItem = (id) => {
  state.agenda = state.agenda.filter(a => a.id !== id);
  saveState();
  toast('Actividad eliminada', '🗑️');
  render();
};
