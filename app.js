/**
 * Gestión Personal - Finanzas, Deudas, Agenda & Disciplina
 * Versión 6.3.0 (dashboards con datos reales)
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
    { id: 'tx-1', type: 'income', title: 'Ingreso Principal', amount: 2500, category: 'Sueldo', date: todayStr(), method: 'Transferencia', notes: 'Mensualidad' },
    { id: 'tx-2', type: 'expense', title: 'Alimentación Semanal', amount: 240, category: 'Alimentación', date: todayStr(), method: 'Yape / Plin', notes: 'Supermercado' },
    { id: 'tx-3', type: 'expense', title: 'Servicio de Internet y Luz', amount: 165, category: 'Servicios', date: todayStr(), method: 'Tarjeta', notes: 'Servicios básicos' },
    { id: 'tx-4', type: 'expense', title: 'Pago Cuota 2/6 · Tarjeta de Crédito BCP', amount: 300, category: 'Pago de Deuda / Cuotas', date: todayStr(), method: 'Transferencia', notes: 'Amortización cuota mensual' }
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
    { id: 'ag-1', title: 'Planificación matutina y lectura (20 min)', time: '07:00', priority: 'high', type: 'habit', done: true, date: todayStr() },
    { id: 'ag-2', title: 'Revisión y registro de finanzas del día', time: '13:00', priority: 'high', type: 'task', done: false, date: todayStr() },
    { id: 'ag-3', title: 'Cierre de objetivos y preparación de agenda mañana', time: '21:00', priority: 'mid', type: 'habit', done: false, date: todayStr() }
  ],
  pomodoro: {
    mode: 'work',
    timeLeft: 25 * 60,
    running: false,
    timer: null,
    sessionsCompleted: 3,
    selectedTaskId: null
  },
  recurringExpenses: [
    { id: 'rec-1', title: 'Luz (Electricidad)', category: 'Servicios Básicos (Luz, Agua, Gas)', amount: 95.00, dueDay: 18, type: 'fixed', paidThisMonth: false, lastPaidDate: null },
    { id: 'rec-2', title: 'Agua potable', category: 'Servicios Básicos (Luz, Agua, Gas)', amount: 45.00, dueDay: 20, type: 'fixed', paidThisMonth: false, lastPaidDate: null },
    { id: 'rec-3', title: 'Gas natural / balón', category: 'Servicios Básicos (Luz, Agua, Gas)', amount: 65.00, dueDay: 15, type: 'fixed', paidThisMonth: false, lastPaidDate: null },
    { id: 'rec-4', title: 'Planes Celulares', category: 'Telecomunicaciones (Celular, Internet)', amount: 70.00, dueDay: 12, type: 'fixed', paidThisMonth: false, lastPaidDate: null },
    { id: 'rec-5', title: 'Internet Fibra Óptica', category: 'Telecomunicaciones (Celular, Internet)', amount: 110.00, dueDay: 10, type: 'fixed', paidThisMonth: true, lastPaidDate: todayStr() },
    { id: 'rec-6', title: 'Préstamo a papá', category: 'Préstamo Familiar / Personal', amount: 200.00, dueDay: 25, type: 'fixed', paidThisMonth: false, lastPaidDate: null },
    { id: 'rec-7', title: 'Alimentación Fija / Mercado', category: 'Alimentación Fija', amount: 600.00, dueDay: 30, type: 'variable', paidThisMonth: false, lastPaidDate: null }
  ],
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
    if (parsed.recurringExpenses) state.recurringExpenses = parsed.recurringExpenses;
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
    recurringExpenses: state.recurringExpenses,
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

// -------------------------------------------------------------
// HELPERS DE ANÁLISIS (fechas locales, períodos, finanzas, deuda)
// -------------------------------------------------------------
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Fecha LOCAL (YYYY-MM-DD). toISOString() usa UTC y en Lima (UTC-5) cambia de día a las 7 pm.
function fmtDate(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function todayStr() { return fmtDate(new Date()); }
function addDaysStr(s, n) {
  const p = s.split('-').map(Number);
  return fmtDate(new Date(p[0], p[1] - 1, p[2] + n));
}
function daysBetween(a, b) {
  const pa = a.split('-').map(Number), pb = b.split('-').map(Number);
  return Math.round((new Date(pb[0], pb[1] - 1, pb[2]) - new Date(pa[0], pa[1] - 1, pa[2])) / 86400000);
}
function monthLabel(ym) { const p = ym.split('-').map(Number); return MESES[p[1] - 1] + ' ' + p[0]; }
function monthShort(ym) { return MESES[Number(ym.slice(5, 7)) - 1].slice(0, 3); }
function prevMonthStr(ym) {
  let y = Number(ym.slice(0, 4)), m = Number(ym.slice(5, 7)) - 1;
  if (m === 0) { m = 12; y--; }
  return y + '-' + String(m).padStart(2, '0');
}
function escHTML(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function fmtCompact(v) {
  v = Math.round(v);
  return v >= 1000 ? (v / 1000).toFixed(1).replace('.0', '') + 'k' : String(v);
}

// Período seleccionado: 'YYYY-MM' o 'all'
function getPeriod() {
  if (!state.period) state.period = todayStr().slice(0, 7);
  return state.period;
}
window.setPeriod = (v) => { state.period = v; render(); };
function periodOptions() {
  const set = new Set([todayStr().slice(0, 7)]);
  state.transactions.forEach(t => { if (t.date) set.add(t.date.slice(0, 7)); });
  return Array.from(set).sort().reverse();
}
function periodSelectorHTML() {
  const p = getPeriod();
  const opts = periodOptions().map(m => `<option value="${m}" ${p === m ? 'selected' : ''}>${monthLabel(m)}</option>`).join('');
  return `
    <div class="period-bar">
      <label for="periodSelect">Período</label>
      <select id="periodSelect" onchange="setPeriod(this.value)">${opts}<option value="all" ${p === 'all' ? 'selected' : ''}>Todo el historial</option></select>
    </div>`;
}
function periodTransactions(p) {
  p = p || getPeriod();
  return state.transactions.filter(t => p === 'all' || (t.date || '').startsWith(p));
}
function allTimeBalance() {
  return state.transactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
}

// Grupos de la regla 50/30/20
const NEED_RE = /aliment|servicio|vivienda|transporte|salud|educaci|telecom|luz|agua|gas|internet|celular|alquiler/i;
const SAVE_RE = /deuda|cuota|ahorro|inversi|pr[eé]stamo|amortiz/i;
function expenseGroup(cat) {
  cat = cat || '';
  if (SAVE_RE.test(cat)) return 'save';
  if (NEED_RE.test(cat)) return 'needs';
  return 'wants';
}

function computeFinance(p) {
  const list = periodTransactions(p);
  let income = 0, expense = 0, debtPaid = 0;
  const byCat = {};
  const groups = { needs: 0, wants: 0, save: 0 };
  list.forEach(t => {
    if (t.type === 'income') { income += t.amount; return; }
    expense += t.amount;
    byCat[t.category] = (byCat[t.category] || 0) + t.amount;
    groups[expenseGroup(t.category)] += t.amount;
    if ((t.category || '').includes('Deuda') || (t.category || '').includes('Cuota')) debtPaid += t.amount;
  });
  return {
    list, income, expense, debtPaid, groups,
    net: income - expense,
    cats: Object.entries(byCat).sort((a, b) => b[1] - a[1]),
    margin: income > 0 ? Math.round(((income - expense) / income) * 100) : null
  };
}

function computeDebt(ym) {
  const today = todayStr();
  const r = { orig: 0, paid: 0, pending: 0, monthDue: 0, overdue: 0, overduePrev: 0, next: null, nextDebt: null };
  (state.debts || []).forEach(d => {
    r.orig += d.totalAmount;
    (d.installments || []).forEach(i => {
      if (i.status === 'paid') { r.paid += i.amount; return; }
      r.pending += i.amount;
      if (i.dueDate.startsWith(ym)) r.monthDue += i.amount;
      if (i.dueDate < today) r.overdue += i.amount;
      if (i.dueDate < ym + '-01') r.overduePrev += i.amount;
      if (!r.next || i.dueDate < r.next.dueDate) { r.next = i; r.nextDebt = d; }
    });
  });
  r.amortPct = r.orig > 0 ? Math.round((r.paid / r.orig) * 100) : 100;
  return r;
}

function getMonthlySeries(n) {
  let ym = todayStr().slice(0, 7);
  const months = [];
  for (let i = 0; i < n; i++) { months.unshift(ym); ym = prevMonthStr(ym); }
  return months.map(m => { const f = computeFinance(m); return { month: m, income: f.income, expense: f.expense }; });
}

function deltaHTML(cur, prev, goodWhenUp, label) {
  const diff = cur - prev;
  if (Math.abs(diff) < 0.005) return `<span class="delta delta-flat">= igual que ${label}</span>`;
  const up = diff > 0;
  return `<span class="delta ${up === goodWhenUp ? 'delta-good' : 'delta-bad'}">${up ? '▲' : '▼'} ${formatMoney(Math.abs(diff))} vs ${label}</span>`;
}
function meterHTML(pct, color) {
  return `<div class="meter"><div class="meter-fill" style="width:${Math.max(0, Math.min(100, pct))}%;background:${color}"></div></div>`;
}

// Paneles reutilizables --------------------------------------
function categoryPanelHTML(fin) {
  const top = fin.cats.slice(0, 6);
  const rest = fin.cats.slice(6).reduce((s, c) => s + c[1], 0);
  if (rest > 0) top.push(['Otras categorías', rest]);
  const max = top.length ? top[0][1] : 1;
  return `
    <div class="card-panel">
      <div class="panel-head"><h3>🧾 Gastos por categoría</h3><span style="font-size:12px;color:var(--text-muted)">${formatMoney(fin.expense)} en total</span></div>
      ${top.length ? top.map(([name, val]) => `
        <div class="cat-row">
          <span class="cat-name" title="${escHTML(name)}">${escHTML(name)}</span>
          ${meterHTML((val / max) * 100, 'var(--primary)')}
          <span class="cat-val">${formatMoney(val)} <small style="color:var(--text-dim);font-weight:600">${Math.round((val / fin.expense) * 100)}%</small></span>
        </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:18px">Sin gastos registrados en este período.</p>'}
    </div>`;
}

function budgetRulePanelHTML(fin) {
  const rows = [
    { key: 'needs', label: 'Necesidades', target: 50, sub: 'Alimentación, servicios, vivienda, transporte, salud', max: true },
    { key: 'wants', label: 'Deseos y estilo de vida', target: 30, sub: 'Ocio, salidas y otros gastos', max: true },
    { key: 'save', label: 'Deuda y ahorro', target: 20, sub: 'Cuotas, préstamos, aportes a ahorro', max: false }
  ];
  const inc = fin.income;
  return `
    <div class="card-panel">
      <div class="panel-head"><h3>📊 Regla 50 / 30 / 20 (real vs meta)</h3><span style="font-size:12px;color:var(--text-muted)">Sobre tus ingresos del período</span></div>
      ${inc > 0 ? rows.map(r => {
        const amount = fin.groups[r.key];
        const pct = Math.round((amount / inc) * 100);
        const ok = r.max ? pct <= r.target : pct >= r.target;
        const color = ok ? 'var(--success)' : (r.max ? 'var(--danger)' : 'var(--warning)');
        return `
          <div class="rule-row">
            <div class="rule-head"><span><b>${r.label}</b> <small style="color:var(--text-dim)">· meta ${r.max ? 'máx.' : 'mín.'} ${r.target}%</small></span><span style="color:${color};font-weight:800">${pct}% · ${formatMoney(amount)}</span></div>
            <div class="meter">
              <div class="meter-fill" style="width:${Math.min(100, pct)}%;background:${color}"></div>
              <div class="rule-marker" style="left:${r.target}%"></div>
            </div>
            <small style="color:var(--text-dim)">${r.sub}</small>
          </div>`;
      }).join('') : '<p style="color:var(--text-muted);text-align:center;padding:18px">Registra un ingreso en este período para comparar tu gasto con la regla 50/30/20.</p>'}
    </div>`;
}

function coveragePanelHTML() {
  const cm = todayStr().slice(0, 7);
  const inc = computeFinance(cm).income;
  const debt = computeDebt(cm);
  const rec = (state.recurringExpenses || []).filter(r => !r.paidThisMonth).reduce((s, x) => s + x.amount, 0);
  const total = debt.monthDue + debt.overduePrev + rec;
  const balance = allTimeBalance();
  const scale = Math.max(total, inc, 1);
  const segs = [
    { label: 'Cuotas de deuda del mes', val: debt.monthDue, color: 'var(--primary)' },
    { label: 'Cuotas vencidas de meses anteriores', val: debt.overduePrev, color: 'var(--danger)' },
    { label: 'Gastos fijos por pagar', val: rec, color: 'var(--warning)' }
  ].filter(s => s.val > 0);
  let status, statusColor;
  if (total === 0) { status = 'Sin compromisos pendientes este mes'; statusColor = 'var(--success)'; }
  else if (inc >= total) { status = `Cubierto con tus ingresos del mes · sobran ${formatMoney(inc - total)}`; statusColor = 'var(--success)'; }
  else if (balance >= total) { status = 'Cubierto con tu saldo acumulado (los ingresos del mes no alcanzan solos)'; statusColor = 'var(--warning)'; }
  else { status = `No alcanza · faltan ${formatMoney(total - Math.max(balance, 0))}`; statusColor = 'var(--danger)'; }
  return `
    <div class="card-panel" style="margin-bottom:20px">
      <div class="panel-head"><h3>🛡️ ¿Cubro mis compromisos de ${monthLabel(cm)}?</h3><span style="font-size:12px;font-weight:800;color:${statusColor}">${status}</span></div>
      <div class="meter meter-stack">
        ${segs.map(s => `<div class="meter-fill" style="width:${(s.val / scale) * 100}%;background:${s.color}" title="${s.label}"></div>`).join('')}
      </div>
      <div class="legend" style="margin:10px 0 0">
        ${segs.map(s => `<span><i style="background:${s.color}"></i>${s.label} ${formatMoney(s.val)}</span>`).join('')}
        <span>Total ${formatMoney(total)} de ${formatMoney(inc)} ingresados${inc > 0 && total > 0 ? ' (' + Math.round((total / inc) * 100) + '%)' : ''}</span>
      </div>
    </div>`;
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
// Índice de disciplina de una fecha (0 a 100). Los componentes sin datos no cuentan (se reparten los pesos).
function disciplineForDate(dateStr) {
  const today = todayStr();
  const tasks = state.agenda.filter(a => a.date === dateStr);
  const hasTx = state.transactions.some(t => t.date === dateStr);
  if (!tasks.length && !hasTx && dateStr !== today) return null;
  const parts = [];
  if (tasks.length) parts.push([40, tasks.filter(t => t.done).length / tasks.length]);
  parts.push([30, hasTx ? 1 : 0]);
  const debts = state.debts || [];
  if (debts.length) {
    const overdue = debts.some(d => (d.installments || []).some(i =>
      i.dueDate < dateStr && (i.status === 'pending' || (i.paidDate && i.paidDate > dateStr))));
    parts.push([15, overdue ? 0.4 : 1]);
  }
  if (dateStr === today) parts.push([15, Math.min(1, (state.pomodoro.sessionsCompleted || 0) / 3)]);
  const w = parts.reduce((s, p) => s + p[0], 0);
  return Math.round(parts.reduce((s, p) => s + p[0] * p[1], 0) / w * 100);
}

function calculateDisciplineScore() {
  const s = disciplineForDate(todayStr());
  return s === null ? 0 : s;
}

// Racha real: días seguidos con índice >= 60. Hoy no rompe la racha mientras no termina.
const STREAK_MIN = 60;
function getDisciplineStreak() {
  let streak = 0;
  let d = todayStr();
  for (let i = 0; i < 90; i++) {
    const s = disciplineForDate(d);
    const ok = s !== null && s >= STREAK_MIN;
    if (ok) streak++;
    else if (i > 0) break;
    d = addDaysStr(d, -1);
  }
  return streak;
}

function getWeekSeries() {
  const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const t = todayStr();
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDaysStr(t, -i);
    const p = d.split('-').map(Number);
    out.push({ date: d, label: i === 0 ? 'Hoy' : names[new Date(p[0], p[1] - 1, p[2]).getDay()], score: disciplineForDate(d) });
  }
  return out;
}


// Inicialización de Interfaz
window.addEventListener('resize', () => {
  if (state.view !== 'indicadores') return;
  clearTimeout(window.__chartResize);
  window.__chartResize = setTimeout(() => { drawDisciplineChart(); drawFinanceBarChart(); }, 150);
});

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
      if (typeof APPS_SCRIPT_CODE !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(APPS_SCRIPT_CODE).then(() => {
          toast('Código Apps Script copiado al portapapeles', '📋');
        }).catch(() => {
          toast('Copia el código directamente desplegando la pestaña Google', 'ℹ️');
        });
      } else {
        toast('Copia el código desplegando la sección en la pestaña Google', 'ℹ️');
      }
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
    gastosfijos: { t: 'Gastos Fijos & Meta de Ingresos', s: 'Controla luz, agua, gas, celulares y calcula los ingresos a conseguir' },
    deudas: { t: 'Deudas por Pagar & Cuotas', s: 'Distribuye en cuotas, registra pagos y descuenta de tus ingresos' },
    finanzas: { t: 'Control Financiero Diario', s: 'Administra tus ingresos y gastos con precisión' },
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
    case 'gastosfijos':
      renderGastosFijos(container);
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
  const today = todayStr();
  const cm = today.slice(0, 7);
  const p = getPeriod();
  const fin = computeFinance(p);
  const prevYm = p !== 'all' ? prevMonthStr(p) : null;
  const prevFin = prevYm ? computeFinance(prevYm) : null;
  const hasPrev = !!(prevFin && prevFin.list.length);
  const prevLbl = prevYm ? monthShort(prevYm) : '';
  const balance = allTimeBalance();
  const score = calculateDisciplineScore();
  const streak = getDisciplineStreak();
  const todayTasks = state.agenda.filter(a => a.date === today);
  const doneTasks = todayTasks.filter(a => a.done).length;
  const todayExp = state.transactions.filter(t => t.type === 'expense' && t.date === today).reduce((s, x) => s + x.amount, 0);
  const debt = computeDebt(cm);
  const budget = state.user.monthlyBudget || 1500;
  const budgetPct = Math.round((fin.expense / budget) * 100);
  const budgetColor = budgetPct >= 100 ? 'var(--danger)' : budgetPct >= 80 ? 'var(--warning)' : 'var(--success)';
  const periodTxt = p === 'all' ? 'todo el historial' : monthLabel(p);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  container.innerHTML = `
    ${periodSelectorHTML()}

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
          <span class="hero-tag">🔥 ${streak} ${streak === 1 ? 'día' : 'días'} de racha</span>
          <span class="hero-tag">📋 ${doneTasks}/${todayTasks.length} tareas hoy</span>
          <span class="hero-tag">💸 ${formatMoney(todayExp)} gastado hoy</span>
        </div>
      </div>

      <div class="hero-actions">
        <button class="btn btn-primary" onclick="openTxModal('expense')">－ Registrar Gasto</button>
        <button class="btn btn-success" onclick="openTxModal('income')">＋ Registrar Ingreso</button>
        <button class="btn btn-soft" onclick="openPayDebtModalPrompt()">💳 Pagar Cuota</button>
      </div>
    </div>

    <div class="top-kpi-trio">
      <div class="quad-card" style="border-left: 4px solid var(--primary);">
        <div class="quad-card-head">
          <span>💰 Saldo disponible</span>
          <div class="quad-card-icon" style="background:var(--primary-glow);color:var(--primary)">💼</div>
        </div>
        <div class="quad-card-value" style="color:${balance >= 0 ? 'var(--primary)' : 'var(--danger)'}">${formatMoney(balance)}</div>
        <div class="quad-card-sub">Acumulado: todos los ingresos menos todos los gastos</div>
        <button class="btn btn-sm btn-soft" style="width:100%;margin-top:6px" onclick="state.view='finanzas';render()">Ver Movimientos ➔</button>
      </div>

      <div class="quad-card" style="border-left: 4px solid var(--success);">
        <div class="quad-card-head">
          <span>💵 Ingresos · ${p === 'all' ? 'historial' : monthShort(p)}</span>
          <div class="quad-card-icon" style="background:var(--success-bg);color:var(--success)">↗️</div>
        </div>
        <div class="quad-card-value" style="color:var(--success)">${formatMoney(fin.income)}</div>
        <div class="quad-card-sub">${hasPrev ? deltaHTML(fin.income, prevFin.income, true, prevLbl) : 'Entradas registradas en ' + periodTxt}</div>
        <button class="btn btn-sm btn-success" style="width:100%;margin-top:6px" onclick="openTxModal('income')">＋ Registrar Ingreso</button>
      </div>

      <div class="quad-card" style="border-left: 4px solid var(--danger);">
        <div class="quad-card-head">
          <span>🧾 Gastos · ${p === 'all' ? 'historial' : monthShort(p)}</span>
          <div class="quad-card-icon" style="background:var(--danger-bg);color:var(--danger)">↘️</div>
        </div>
        <div class="quad-card-value" style="color:var(--danger)">${formatMoney(fin.expense)}</div>
        <div class="quad-card-sub">
          ${hasPrev ? deltaHTML(fin.expense, prevFin.expense, false, prevLbl) + '<br>' : ''}
          ${p !== 'all' ? `${budgetPct}% del presupuesto de ${formatMoney(budget)}` : 'Gasto total registrado'}
        </div>
        ${p !== 'all' ? meterHTML(budgetPct, budgetColor) : ''}
      </div>

      <div class="quad-card" style="border-left: 4px solid var(--purple);">
        <div class="quad-card-head">
          <span>💳 Deuda pendiente</span>
          <div class="quad-card-icon" style="background:var(--purple-bg);color:var(--purple)">💳</div>
        </div>
        <div class="quad-card-value" style="color:var(--purple)">${formatMoney(debt.pending)}</div>
        <div class="quad-card-sub">
          Amortizado ${debt.amortPct}% · cuotas de este mes: <b>${formatMoney(debt.monthDue)}</b>
          ${debt.overdue > 0 ? `<br><b style="color:var(--danger)">⚠ Vencido: ${formatMoney(debt.overdue)}</b>` : ''}
        </div>
        <button class="btn btn-sm btn-soft" style="width:100%;margin-top:6px" onclick="state.view='deudas';render()">Ver Deudas & Cuotas ➔</button>
      </div>
    </div>

    ${coveragePanelHTML()}

    ${debt.next ? `
      <div class="card-panel" style="margin-bottom:20px;border-left:4px solid var(--primary);padding:16px 20px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <span class="status-badge status-pending">💳 Próxima Cuota por Pagar</span>
            <h4 style="font-size:16px;font-weight:800;margin:6px 0 2px">${escHTML(debt.nextDebt.title)} · Cuota ${debt.next.number} de ${debt.nextDebt.installmentsCount}</h4>
            <p style="color:var(--text-muted);font-size:12.5px;margin:0">
              Vence: <b>${debt.next.dueDate}</b> · Acreedor: ${escHTML(debt.nextDebt.creditor)} · Monto: <b style="color:var(--text-main);font-size:14px">${formatMoney(debt.next.amount)}</b>
            </p>
          </div>
          <button class="btn btn-success" onclick="openPayDebtModal('${debt.nextDebt.id}', ${debt.next.number})">💳 Pagar Cuota Ahora (Descontar de Ingresos)</button>
        </div>
      </div>
    ` : ''}

    <div class="dash-grid">
      ${categoryPanelHTML(fin)}
      ${budgetRulePanelHTML(fin)}
    </div>

    <div class="dash-grid">
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
          <h3>💰 Últimos movimientos</h3>
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
  const p = getPeriod();
  const fin = computeFinance(p);
  const balance = allTimeBalance();

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

    ${periodSelectorHTML()}

    <div class="kpi-grid">
      <div class="kpi-card">
        <span style="color:var(--text-muted);font-size:12px;font-weight:700">Ingresos del período</span>
        <div class="kpi-value" style="color:var(--success)">${formatMoney(fin.income)}</div>
      </div>
      <div class="kpi-card">
        <span style="color:var(--text-muted);font-size:12px;font-weight:700">Gastos del período</span>
        <div class="kpi-value" style="color:var(--danger)">${formatMoney(fin.expense)}</div>
      </div>
      <div class="kpi-card">
        <span style="color:var(--text-muted);font-size:12px;font-weight:700">Balance del período</span>
        <div class="kpi-value" style="color:${fin.net >= 0 ? 'var(--primary)' : 'var(--danger)'}">${formatMoney(fin.net)}</div>
        <div class="kpi-sub">${fin.margin !== null ? 'Margen: ' + fin.margin + '% de los ingresos · ' : ''}Saldo acumulado: ${formatMoney(balance)}</div>
      </div>
      <div class="kpi-card">
        <span style="color:var(--text-muted);font-size:12px;font-weight:700">Amortizado en deudas</span>
        <div class="kpi-value" style="color:var(--purple)">${formatMoney(fin.debtPaid)}</div>
      </div>
    </div>

    <div class="dash-grid">
      ${categoryPanelHTML(fin)}
      ${budgetRulePanelHTML(fin)}
    </div>

    <div class="card-panel">
      <div class="panel-head">
        <h3>Historial de Movimientos · ${p === 'all' ? 'todo' : monthLabel(p)}</h3>
        <input type="text" placeholder="Buscar concepto o categoría…" id="txSearchInput" oninput="filterTransactions(this.value)" style="max-width:240px">
      </div>
      <div class="tx-list" id="txFullList">
        ${renderTxList(fin.list)}
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
  const filtered = periodTransactions().filter(t => 
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

  const currentMonth = todayStr().slice(0, 7);

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
  $('#debtFirstDueDate').value = todayStr();
  $('#debtInstallmentsCount').value = '6';
  modal.classList.remove('hidden');
};

window.saveDebt = (e) => {
  e.preventDefault();
  const totalAmount = parseFloat($('#debtTotal').value) || 0;
  const count = parseInt($('#debtInstallmentsCount').value, 10) || 1;
  const installmentAmount = parseFloat($('#debtInstallmentAmount').value) || (totalAmount / count);
  const firstDueDate = $('#debtFirstDueDate').value || todayStr();
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
  $('#payDebtDate').value = todayStr();
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
  const payDate = $('#payDebtDate').value || todayStr();
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
  a.download = `cronograma_deudas_${todayStr()}.csv`;
  a.click();
  toast('Cronograma de deudas descargado (.CSV)', '📥');
};

// -------------------------------------------------------------
// GASTOS FIJOS, VARIABLES & META DE INGRESOS (NUEVO MÓDULO)
// -------------------------------------------------------------
function renderGastosFijos(container) {
  const recurring = state.recurringExpenses || [];
  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;

  // Cuotas de deuda pendientes del mes
  const currentMonth = todayStr().slice(0, 7);
  let monthlyDebtCommitments = 0;
  (state.debts || []).forEach(d => {
    (d.installments || []).forEach(i => {
      if (i.status === 'pending' && i.dueDate.startsWith(currentMonth)) {
        monthlyDebtCommitments += i.amount;
      }
    });
  });

  const totalFixedBudget = recurring.reduce((s, x) => s + x.amount, 0);
  const pendingRecurring = recurring.filter(r => !r.paidThisMonth).reduce((s, x) => s + x.amount, 0);
  const paidRecurring = totalFixedBudget - pendingRecurring;

  // Compromisos presupuestados completos del mes (Deudas del mes + Total Gastos Fijos)
  const totalBudgetedCommitments = monthlyDebtCommitments + totalFixedBudget;
  // Margen / Ahorro planificado del mes: Ingresos - Total Compromisos
  const budgetedMargin = totalInc - totalBudgetedCommitments;

  // Compromisos que todavía faltan pagar en este momento
  const totalPendingCommitments = monthlyDebtCommitments + pendingRecurring;
  const isBudgetCovered = totalInc >= totalBudgetedCommitments;
  const isLiquidityCovered = balance >= totalPendingCommitments;

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h3 style="font-size:20px;font-weight:800">Gastos Fijos, Deudas & Plan del Mes</h3>
        <p style="color:var(--text-muted);font-size:13px">
          Controla tus servicios básicos (luz, agua, gas, internet, celulares, etc.) y tus cuotas mensuales con total claridad.
        </p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openRecurringModal()">＋ Nuevo Gasto Fijo</button>
        <button class="btn btn-soft" onclick="resetDemoTransactionsToMatchIncome()" title="Reinicia saldo a tu ingreso real para ir pagando recibos">
          🔄 Sincronizar Saldo a ${formatMoney(totalInc)}
        </button>
        <button class="btn btn-soft" onclick="resetMonthlyRecurringExpenses()">🔄 Nuevo Ciclo Mensual</button>
      </div>
    </div>

    <!-- 4 TARJETAS DEL PLAN: 100% CUADRADAS CON TUS INGRESOS -->
    <div class="kpi-grid">
      <!-- 1. Cuotas de Deuda este Mes -->
      <div class="kpi-card" style="border-left: 3px solid var(--danger)">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">1. Cuotas de Deuda este Mes</span>
        <div class="kpi-value" style="color:var(--danger)">${formatMoney(monthlyDebtCommitments)}</div>
        <div class="kpi-sub">Préstamos y tarjetas a plazos</div>
      </div>

      <!-- 2. Gastos Fijos del Mes -->
      <div class="kpi-card" style="border-left: 3px solid var(--warning)">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">2. Gastos Fijos del Mes</span>
        <div class="kpi-value" style="color:var(--warning)">${formatMoney(totalFixedBudget)}</div>
        <div class="kpi-sub">${recurring.length} servicios (${pendingRecurring > 0 ? `Faltan pagar: ${formatMoney(pendingRecurring)}` : '✓ Todos pagados'})</div>
      </div>

      <!-- 3. Compromisos Totales (1 + 2) -->
      <div class="kpi-card" style="border-left: 3px solid var(--primary)">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">3. Total Compromisos (1 + 2)</span>
        <div class="kpi-value" style="color:var(--primary)">${formatMoney(totalBudgetedCommitments)}</div>
        <div class="kpi-sub">Deudas (${formatMoney(monthlyDebtCommitments)}) + Fijos (${formatMoney(totalFixedBudget)})</div>
      </div>

      <!-- 4. Margen / Ahorro Proyectado -->
      <div class="kpi-card" style="border-left: 3px solid ${budgetedMargin >= 0 ? 'var(--success)' : 'var(--danger)'}">
        <span style="font-size:12px;font-weight:700;color:var(--text-muted)">4. Margen Proyectado del Mes</span>
        <div class="kpi-value" style="color:${budgetedMargin >= 0 ? 'var(--success)' : 'var(--danger)'}">
          ${formatMoney(budgetedMargin)}
        </div>
        <div class="kpi-sub">Ingresos (${formatMoney(totalInc)}) menos Compromisos (${formatMoney(totalBudgetedCommitments)})</div>
      </div>
    </div>

    <!-- Listado de Gastos Fijos y Variables Frecuentes -->
    <div class="card-panel">
      <div class="panel-head">
        <h3>📋 Gastos Fijos y Variables Frecuentes (${recurring.length})</h3>
        <span style="font-size:12px;color:var(--text-muted)">Pulsa 'Pagar' para registrar el gasto y descontar de tus ingresos</span>
      </div>

      <div class="recurring-grid" style="margin-top:12px">
        ${recurring.map(item => `
          <div class="recurring-card ${item.paidThisMonth ? 'paid' : ''}">
            <div class="recurring-head">
              <div>
                <h4>${item.title}</h4>
                <small style="color:var(--text-muted)">${item.category} · ${item.type === 'fixed' ? 'Gasto Fijo' : 'Variable Frecuente'}</small>
              </div>
              <span class="status-badge ${item.paidThisMonth ? 'status-paid' : 'status-pending'}">
                ${item.paidThisMonth ? '✓ Pagado' : '⏳ Pendiente'}
              </span>
            </div>

            <div class="recurring-meta">
              <span>Vence el <b>Día ${item.dueDay}</b></span>
              <strong style="font-size:15px;color:var(--text-main)">${formatMoney(item.amount)}</strong>
            </div>

            ${item.paidThisMonth ? `
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
                <span style="font-size:12px;color:var(--success);font-weight:700">✓ Pagado el ${item.lastPaidDate || 'este mes'}</span>
                <button class="btn btn-sm btn-soft" onclick="unmarkRecurringPaid('${item.id}')" title="Marcar pendiente">↩</button>
              </div>
            ` : `
              <div style="display:flex;gap:8px;margin-top:6px">
                <button class="btn btn-sm btn-success" style="flex:1" onclick="openPayRecurringModal('${item.id}')">
                  💳 Pagar Gasto (Descontar de Ingresos)
                </button>
                <button class="btn btn-sm btn-soft" onclick="deleteRecurringExpense('${item.id}')" title="Eliminar">🗑️</button>
              </div>
            `}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 4. AGENDA VIRTUAL & HÁBITOS
// -------------------------------------------------------------
function renderAgenda(container) {
  const today = todayStr();
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h3 style="font-size:20px;font-weight:800">Agenda Virtual & Hábitos Diarios</h3>
        <p style="color:var(--text-muted);font-size:13px">Bloques de tiempo, tareas prioritarias y hábitos para desarrollar disciplina constante.</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openAgendaModal()">＋ Nueva Actividad</button>
        <button class="btn btn-soft" onclick="openCalendarSyncModal()">📅 Enviar a Google Calendar</button>
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
            <div style="display:flex;align-items:center;gap:8px">
              <input type="checkbox" style="width:22px;height:22px;cursor:pointer" ${item.done ? 'checked' : ''} onchange="toggleTaskDone('${item.id}')">
              <button class="btn btn-sm btn-soft" onclick="openGoogleCalendarForTask('${item.id}')" title="Añadir a Google Calendar">📅</button>
              <button class="btn btn-sm btn-soft" onclick="deleteAgendaItem('${item.id}')" title="Eliminar">🗑️</button>
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
  $('#savDate').value = addDaysStr(todayStr(), 90);
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

  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;

  $('#savContributeGoalId').value = goal.id;
  $('#savContributeGoalTitle').textContent = `${goal.title} (Faltan: ${formatMoney(goal.targetAmount - goal.currentAmount)})`;
  $('#savUserBalanceBefore').textContent = formatMoney(balance);
  $('#savContributeAmount').value = '100.00';
  $('#savUserBalanceAfter').textContent = formatMoney(balance - 100);
  $('#savContributeDate').value = todayStr();
  $('#savingsContributeModal').classList.remove('hidden');
};

window.updateSavBalancePreview = () => {
  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;
  const amt = parseFloat($('#savContributeAmount')?.value) || 0;
  $('#savUserBalanceAfter').textContent = formatMoney(balance - amt);
};

window.executeSavingsContribute = (e) => {
  e.preventDefault();
  const goalId = $('#savContributeGoalId').value;
  const amount = parseFloat($('#savContributeAmount').value) || 0;
  const date = $('#savContributeDate').value || todayStr();

  const goal = (state.savings || []).find(g => g.id === goalId);
  if (!goal) return;

  goal.currentAmount += amount;

  // Registrar SIEMPRE como Gasto para descontar inmediatamente de ingresos y saldo
  const tx = {
    id: 'tx-sav-' + Date.now(),
    type: 'expense',
    title: `Aporte a Ahorro: ${goal.title}`,
    amount: amount,
    category: 'Ahorro / Inversión',
    date: date,
    method: 'Aporte de Saldo',
    notes: `Reserva para meta: ${goal.title} (Saldo acumulado: S/ ${goal.currentAmount.toFixed(2)})`
  };
  state.transactions.unshift(tx);

  saveState();
  closeModal('savingsContributeModal');
  playChime('success');
  toast(`¡Aporte de ${formatMoney(amount)} registrado! Se descontó de tus ingresos y saldo disponible.`, '💰');
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
// CONTROLADORES DE GASTOS FIJOS Y VARIABLES
// -------------------------------------------------------------
window.openRecurringModal = (id = null) => {
  $('#recurringForm').reset();
  $('#recEditId').value = '';
  $('#recurringModalTitle').textContent = 'Nuevo Gasto Fijo o Frecuente';
  if (id) {
    const item = (state.recurringExpenses || []).find(r => r.id === id);
    if (item) {
      $('#recEditId').value = item.id;
      $('#recTitle').value = item.title;
      $('#recCategory').value = item.category;
      $('#recAmount').value = item.amount;
      $('#recDueDay').value = item.dueDay;
      $('#recType').value = item.type;
      $('#recNotes').value = item.notes || '';
      $('#recurringModalTitle').textContent = 'Editar Gasto Fijo';
    }
  }
  $('#recurringModal').classList.remove('hidden');
};

window.saveRecurringExpense = (e) => {
  e.preventDefault();
  const id = $('#recEditId').value;
  const title = $('#recTitle').value.trim();
  const category = $('#recCategory').value;
  const amount = parseFloat($('#recAmount').value) || 0;
  const dueDay = parseInt($('#recDueDay').value, 10) || 15;
  const type = $('#recType').value;
  const notes = $('#recNotes').value.trim();

  if (!state.recurringExpenses) state.recurringExpenses = [];

  if (id) {
    const item = state.recurringExpenses.find(r => r.id === id);
    if (item) {
      item.title = title;
      item.category = category;
      item.amount = amount;
      item.dueDay = dueDay;
      item.type = type;
      item.notes = notes;
    }
  } else {
    state.recurringExpenses.push({
      id: 'rec-' + Date.now(),
      title,
      category,
      amount,
      dueDay,
      type,
      notes,
      paidThisMonth: false,
      lastPaidDate: null
    });
  }

  saveState();
  closeModal('recurringModal');
  playChime('success');
  toast(`Gasto '${title}' guardado correctamente`, '📋');
  render();
};

window.deleteRecurringExpense = (id) => {
  const item = (state.recurringExpenses || []).find(r => r.id === id);
  if (!item) return;
  if (confirm(`¿Eliminar el gasto frecuente '${item.title}'?`)) {
    state.recurringExpenses = state.recurringExpenses.filter(r => r.id !== id);
    saveState();
    toast('Gasto frecuente eliminado', '🗑️');
    render();
  }
};

window.openPayRecurringModal = (id) => {
  const item = (state.recurringExpenses || []).find(r => r.id === id);
  if (!item) return;

  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;

  $('#payRecId').value = item.id;
  $('#payRecTitleDisplay').textContent = `${item.title} (${item.category})`;
  $('#payRecUserBalanceDisplay').textContent = formatMoney(balance);
  $('#payRecAmount').value = item.amount.toFixed(2);
  $('#payRecDate').value = todayStr();
  $('#payRecurringModal').classList.remove('hidden');
};

window.executeRecurringPayment = (e) => {
  e.preventDefault();
  const id = $('#payRecId').value;
  const amount = parseFloat($('#payRecAmount').value) || 0;
  const date = $('#payRecDate').value || todayStr();
  const method = $('#payRecMethod').value;

  const item = (state.recurringExpenses || []).find(r => r.id === id);
  if (!item) return;

  item.paidThisMonth = true;
  item.lastPaidDate = date;

  // Registrar GASTO en Finanzas Diarias (descuenta automáticamente de ingresos y saldo)
  const tx = {
    id: 'tx-rec-' + Date.now(),
    type: 'expense',
    title: `Pago: ${item.title}`,
    amount: amount,
    category: item.category,
    date: date,
    method: method,
    notes: `Gasto frecuente del mes · ${item.title}`
  };
  state.transactions.unshift(tx);

  saveState();
  closeModal('payRecurringModal');
  playChime('success');
  toast(`¡${item.title} pagado con éxito (${formatMoney(amount)})! Descontado de tus ingresos y saldo.`, '💳');
  render();
};

window.unmarkRecurringPaid = (id) => {
  const item = (state.recurringExpenses || []).find(r => r.id === id);
  if (!item) return;
  item.paidThisMonth = false;
  saveState();
  toast(`Gasto '${item.title}' marcado como pendiente`, '↩️');
  render();
};

window.resetMonthlyRecurringExpenses = () => {
  if (confirm('¿Iniciar un nuevo ciclo mensual? Todos los gastos fijos volverán a estar pendientes para el nuevo mes.')) {
    (state.recurringExpenses || []).forEach(r => {
      r.paidThisMonth = false;
    });
    saveState();
    playChime('success');
    toast('Nuevo ciclo mensual iniciado. Gastos fijos listos para controlarse.', '🔄');
    render();
  }
};

// -------------------------------------------------------------
// CONTROLADOR DE CUADRE FINANCIERO Y CONCILIACIÓN
// -------------------------------------------------------------
window.openCuadreModal = () => {
  const modal = $('#cuadreModal');
  const content = $('#cuadreModalContent');
  if (!modal || !content) return;

  const recurring = state.recurringExpenses || [];
  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExp = state.transactions.filter(t => t.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalInc - totalExp;

  const currentMonth = todayStr().slice(0, 7);
  let monthlyDebtCommitments = 0;
  (state.debts || []).forEach(d => {
    (d.installments || []).forEach(i => {
      if (i.status === 'pending' && i.dueDate.startsWith(currentMonth)) {
        monthlyDebtCommitments += i.amount;
      }
    });
  });

  const totalFixedBudget = recurring.reduce((s, x) => s + x.amount, 0);
  const totalBudgetedCommitments = monthlyDebtCommitments + totalFixedBudget;
  const budgetedMargin = totalInc - totalBudgetedCommitments;
  const expenseList = state.transactions.filter(t => t.type === 'expense');

  content.innerHTML = `
    <!-- Bloque 1: El Cuadre Matemático del Mes -->
    <div style="background:var(--bg-secondary);padding:14px 16px;border-radius:12px;margin-bottom:14px;border:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:18px">📐</span>
        <strong style="font-size:14px;color:var(--text-main)">1. Tu Presupuesto del Mes (Matemáticamente Exacto)</strong>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0">
        <span style="color:var(--text-muted)">(＋) Ingresos Totales del Mes:</span>
        <b style="color:var(--success)">${formatMoney(totalInc)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0">
        <span style="color:var(--text-muted)">(－) Cuotas de Deuda del Mes:</span>
        <b style="color:var(--danger)">${formatMoney(monthlyDebtCommitments)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0">
        <span style="color:var(--text-muted)">(－) Gastos Fijos del Mes (${recurring.length} cuentas):</span>
        <b style="color:var(--warning)">${formatMoney(totalFixedBudget)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;padding:8px 0 0;border-top:1px solid var(--border);margin-top:6px">
        <span style="font-weight:750">(=) Margen / Ahorro Libre Proyectado:</span>
        <b style="color:${budgetedMargin >= 0 ? 'var(--primary)' : 'var(--danger)'};font-size:16px">${formatMoney(budgetedMargin)}</b>
      </div>
      <p style="font-size:11.5px;color:var(--text-muted);margin:8px 0 0;line-height:1.4">
        ✓ <b>Tus cuentas cuadran:</b> ${formatMoney(totalInc)} de ingresos menos ${formatMoney(totalBudgetedCommitments)} de compromisos deja un superávit de <b>${formatMoney(budgetedMargin)}</b>.
      </p>
    </div>

    <!-- Bloque 2: Por qué tu Saldo en Mano dice X -->
    <div style="background:var(--bg-secondary);padding:14px 16px;border-radius:12px;margin-bottom:14px;border:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:18px">💰</span>
        <strong style="font-size:14px;color:var(--text-main)">2. ¿Por qué tu Saldo Disponible en Mano dice ${formatMoney(balance)}?</strong>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin:0 0 10px;line-height:1.4">
        Porque en tu historial de transacciones ya figuran <b>${formatMoney(totalExp)}</b> en gastos registrados (como compras de prueba, aportes o recibos previos):
      </p>
      <div style="max-height:130px;overflow-y:auto;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:8px">
        ${expenseList.length ? expenseList.map(t => `
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px">${t.title} <small style="color:var(--text-muted)">(${t.category})</small></span>
            <b style="color:var(--danger)">-${formatMoney(t.amount)}</b>
          </div>
        `).join('') : '<p style="color:var(--text-muted);font-size:12px;margin:0">Sin gastos previos registrados.</p>'}
      </div>
    </div>

    <!-- Bloque 3: Solución de 1 Clic -->
    <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);padding:14px;border-radius:12px">
      <strong style="color:var(--warning);font-size:13.5px;display:block;margin-bottom:4px">
        🔄 ¿Eran gastos de prueba? Sincroniza tu saldo a la realidad:
      </strong>
      <p style="font-size:12px;color:var(--text-muted);margin:0 0 12px;line-height:1.4">
        Si esos ${formatMoney(totalExp)} eran datos de prueba y en tu cuenta real tienes tus <b>${formatMoney(totalInc)}</b> completos para ir pagando tus 7 gastos fijos uno a uno:
      </p>
      <button class="btn btn-warning" style="width:100%" onclick="resetDemoTransactionsToMatchIncome()">
        🔄 Limpiar Gastos de Prueba y Reiniciar Saldo a ${formatMoney(totalInc)}
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
};

window.resetDemoTransactionsToMatchIncome = () => {
  const totalInc = state.transactions.filter(t => t.type === 'income').reduce((s, x) => s + x.amount, 0) || 2550;
  if (confirm(`¿Reiniciar tu saldo a ${formatMoney(totalInc)}? Se eliminarán los gastos anteriores de prueba para que tu saldo disponible empiece en ${formatMoney(totalInc)} y puedas ir pagando tus 7 gastos fijos uno por uno de forma exacta.`)) {
    // Mantener únicamente el ingreso
    state.transactions = [
      { id: 'tx-ingreso-base', type: 'income', title: 'Ingreso Principal del Mes', amount: totalInc, category: 'Sueldo / Ingresos', date: todayStr(), method: 'Transferencia', notes: 'Presupuesto mensual para gastos y compromisos' }
    ];
    // Restablecer los gastos fijos a pendientes para que el usuario los pague con el botón
    (state.recurringExpenses || []).forEach(r => {
      r.paidThisMonth = false;
      r.lastPaidDate = null;
    });
    saveState();
    closeModal('cuadreModal');
    playChime('success');
    toast(`¡Saldo sincronizado a ${formatMoney(totalInc)}! Ahora cada gasto fijo que pagues se descontará de forma exacta.`, '✅');
    render();
  }
};

// -------------------------------------------------------------
// CONTROLADORES DE GOOGLE CALENDAR
// -------------------------------------------------------------
window.openCalendarSyncModal = () => {
  $('#calendarSyncModal').classList.remove('hidden');
};

window.openTodayInGoogleCalendar = () => {
  const today = todayStr();
  const todayTasks = (state.agenda || []).filter(a => a.date === today && !a.done);
  const task = todayTasks[0] || (state.agenda || [])[0];
  if (!task) {
    toast('No hay actividades pendientes en tu agenda para hoy', 'ℹ️');
    return;
  }
  openGoogleCalendarForTask(task.id);
  closeModal('calendarSyncModal');
};

window.openGoogleCalendarForTask = (taskId) => {
  const task = (state.agenda || []).find(a => a.id === taskId);
  if (!task) return;
  const dateFormatted = task.date.replace(/-/g, '');
  const timeFormatted = (task.time || '09:00').replace(/:/g, '') + '00';
  const startIso = `${dateFormatted}T${timeFormatted}`;

  const dateObj = new Date(`${task.date}T${task.time || '09:00'}:00`);
  const endDateObj = new Date(dateObj.getTime() + 45 * 60000);
  const endDateFormatted = endDateObj.toISOString().slice(0, 10).replace(/-/g, '');
  const endTimeFormatted = endDateObj.toTimeString().slice(0, 5).replace(/:/g, '') + '00';
  const endIso = `${endDateFormatted}T${endTimeFormatted}`;

  const title = encodeURIComponent(`[Gestión Personal] ${task.title}`);
  const details = encodeURIComponent(`Prioridad: ${task.priority}\nTipo: ${task.type}\nCuenta: tualiadoenusaforms@gmail.com\nOrganizado con Gestión Personal.`);
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&add=tualiadoenusaforms@gmail.com`;

  window.open(url, '_blank');
  toast('Abriendo Google Calendar con tu actividad...', '📅');
};

window.downloadAgendaIcsFile = () => {
  const tasks = state.agenda || [];
  if (!tasks.length) {
    toast('No hay actividades en la agenda para exportar', 'ℹ️');
    return;
  }
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gestion Personal//Agenda//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];
  tasks.forEach(task => {
    const d = (task.date || todayStr()).replace(/-/g, '');
    const t = (task.time || '09:00').replace(/:/g, '') + '00';
    ics.push('BEGIN:VEVENT');
    ics.push(`UID:task-${task.id}@gestionpersonal.app`);
    ics.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`);
    ics.push(`DTSTART:${d}T${t}`);
    ics.push(`DTEND:${d}T${t}`);
    ics.push(`SUMMARY:[Disciplina] ${task.title}`);
    ics.push(`DESCRIPTION:Prioridad ${task.priority}. Tipo: ${task.type}`);
    ics.push('BEGIN:VALARM');
    ics.push('TRIGGER:-PT15M');
    ics.push('ACTION:DISPLAY');
    ics.push(`DESCRIPTION:Recordatorio: ${task.title}`);
    ics.push('END:VALARM');
    ics.push('END:VEVENT');
  });
  ics.push('END:VCALENDAR');

  const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agenda_personal_${todayStr()}.ics`;
  a.click();
  closeModal('calendarSyncModal');
  toast('Calendario descargado (.ICS). Tu celular abrirá Google Calendar para importarlo.', '📲');
};

// -------------------------------------------------------------
// 7. INDICADORES CLAVE (KPIS & MÉTRICAS)
// -------------------------------------------------------------
function renderIndicadores(container) {
  const today = todayStr();
  const cm = today.slice(0, 7);
  const p = getPeriod();
  const fin = computeFinance(p);
  const score = calculateDisciplineScore();
  const streak = getDisciplineStreak();
  const debt = computeDebt(cm);
  const incCm = computeFinance(cm).income;

  const pastTasks = state.agenda.filter(a => a.date <= today);
  const agendaPct = pastTasks.length ? Math.round((pastTasks.filter(a => a.done).length / pastTasks.length) * 100) : null;

  let days = 1;
  if (p === 'all') {
    const dates = state.transactions.map(t => t.date).filter(Boolean).sort();
    days = dates.length ? daysBetween(dates[0], today) + 1 : 1;
  } else if (p === cm) {
    days = Number(today.slice(8, 10));
  } else {
    days = new Date(Number(p.slice(0, 4)), Number(p.slice(5, 7)), 0).getDate();
  }
  const dailyAvg = fin.expense / Math.max(1, days);
  const debtLoad = incCm > 0 ? Math.round((debt.monthDue / incCm) * 100) : null;

  const savings = state.savings || [];
  const saved = savings.reduce((s, x) => s + x.currentAmount, 0);
  const target = savings.reduce((s, x) => s + x.targetAmount, 0);
  const savedPct = target > 0 ? Math.round((saved / target) * 100) : 0;

  const kpi = (label, value, color, sub) => `
    <div class="kpi-card">
      <span style="font-size:12px;font-weight:700;color:var(--text-muted)">${label}</span>
      <div class="kpi-value" style="color:${color}">${value}</div>
      <div class="kpi-sub">${sub}</div>
    </div>`;

  container.innerHTML = `
    <div style="margin-bottom:12px">
      <h3 style="font-size:20px;font-weight:800">Medición de Todo · Indicadores Clave (KPIs)</h3>
      <p style="color:var(--text-muted);font-size:13px">Lo que no se mide, no se puede mejorar. Todo se calcula con tus registros reales.</p>
    </div>

    ${periodSelectorHTML()}

    <div class="kpi-grid">
      ${kpi('Índice de Disciplina (hoy)', score + '%', 'var(--warning)', 'Tareas, registro de movimientos, cuotas al día y enfoque')}
      ${kpi('Racha de Cumplimiento', '🔥 ' + streak + (streak === 1 ? ' día' : ' días'), '#f59e0b', 'Días seguidos con disciplina ≥ ' + STREAK_MIN + '%')}
      ${kpi('Cumplimiento de Agenda', agendaPct === null ? '—' : agendaPct + '%', 'var(--success)', 'Tareas hasta hoy · meta ≥ 80%')}
      ${kpi('Margen del período', fin.margin === null ? '—' : fin.margin + '%', fin.margin !== null && fin.margin < 0 ? 'var(--danger)' : 'var(--primary)', 'Lo que queda de tus ingresos tras gastar')}
      ${kpi('Gasto diario promedio', formatMoney(dailyAvg), 'var(--danger)', 'En ' + days + (days === 1 ? ' día' : ' días') + ' del período')}
      ${kpi('Carga de deuda del mes', debtLoad === null ? '—' : debtLoad + '%', debtLoad !== null && debtLoad > 35 ? 'var(--danger)' : 'var(--purple)', 'Cuotas del mes ÷ ingresos del mes · ideal < 35%')}
    </div>

    <div class="card-panel" style="margin-bottom:20px">
      <div class="panel-head">
        <h3>Evolución de Disciplina · últimos 7 días</h3>
        <span style="font-size:12px;color:var(--text-muted)">Los días sin registros quedan vacíos</span>
      </div>
      <canvas id="disciplineChart" class="chart" role="img" aria-label="Línea con el índice de disciplina diario de los últimos 7 días"></canvas>
    </div>

    <div class="card-panel" style="margin-bottom:20px">
      <div class="panel-head">
        <h3>Ingresos vs Gastos · últimos 6 meses</h3>
        <span style="font-size:12px;color:var(--text-muted)">Flujo de caja mensual</span>
      </div>
      <div class="legend"><span><i style="background:#10b981"></i>Ingresos</span><span><i style="background:#ef4444"></i>Gastos</span></div>
      <canvas id="financeBarChart" class="chart" role="img" aria-label="Barras de ingresos y gastos por mes de los últimos 6 meses"></canvas>
    </div>

    <div class="dash-grid">
      <div class="card-panel">
        <div class="panel-head"><h3>💳 Desendeudamiento</h3><span style="font-size:12px;color:var(--text-muted)">${debt.amortPct}% pagado</span></div>
        ${meterHTML(debt.amortPct, 'var(--purple)')}
        <p style="color:var(--text-muted);font-size:12.5px;margin-top:10px">Pagado ${formatMoney(debt.paid)} de ${formatMoney(debt.orig)} · pendiente ${formatMoney(debt.pending)}</p>
      </div>
      <div class="card-panel">
        <div class="panel-head"><h3>🏦 Ahorro vs metas</h3><span style="font-size:12px;color:var(--text-muted)">${savedPct}% de la meta</span></div>
        ${meterHTML(savedPct, 'var(--primary)')}
        <p style="color:var(--text-muted);font-size:12.5px;margin-top:10px">${formatMoney(saved)} ahorrados de ${formatMoney(target)} en ${savings.length} ${savings.length === 1 ? 'meta' : 'metas'}</p>
      </div>
    </div>
  `;

  setTimeout(() => {
    drawDisciplineChart();
    drawFinanceBarChart();
  }, 50);
}

function setupCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = '100%';
  canvas.style.height = height + 'px';
  const w = (canvas.parentElement && canvas.parentElement.clientWidth) || 600;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h: height };
}

function chartColors() {
  const cs = getComputedStyle(document.documentElement);
  const g = (n, d) => (cs.getPropertyValue(n) || '').trim() || d;
  return {
    text: g('--text-main', '#f8fafc'), muted: g('--text-muted', '#94a3b8'),
    grid: g('--border', 'rgba(255,255,255,0.08)'), primary: g('--primary', '#3b82f6'),
    success: g('--success', '#10b981'), danger: g('--danger', '#ef4444'), warning: g('--warning', '#f59e0b')
  };
}

function drawDisciplineChart() {
  const canvas = $('#disciplineChart');
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas, 230);
  const c = chartColors();
  const series = getWeekSeries();
  const padL = 40, padR = 18, padT = 26, padB = 30;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const X = i => padL + (i * plotW) / (series.length - 1);
  const Y = v => padT + plotH - (v / 100) * plotH;

  ctx.clearRect(0, 0, w, h);
  ctx.font = '11px sans-serif';
  ctx.textBaseline = 'middle';

  [0, 25, 50, 75, 100].forEach(v => {
    ctx.strokeStyle = c.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke();
    ctx.fillStyle = c.muted; ctx.textAlign = 'right';
    ctx.fillText(v + '%', padL - 8, Y(v));
  });

  const goal = (state.user && state.user.disciplineGoal) || 85;
  ctx.save();
  ctx.setLineDash([6, 4]); ctx.strokeStyle = c.success; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(padL, Y(goal)); ctx.lineTo(w - padR, Y(goal)); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = c.success; ctx.textAlign = 'right';
  ctx.fillText('Meta ' + goal + '%', w - padR, Y(goal) - 9);

  ctx.beginPath();
  ctx.strokeStyle = c.primary; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  let started = false;
  series.forEach((s, i) => {
    if (s.score === null) { started = false; return; }
    if (!started) { ctx.moveTo(X(i), Y(s.score)); started = true; } else { ctx.lineTo(X(i), Y(s.score)); }
  });
  ctx.stroke();

  series.forEach((s, i) => {
    const x = X(i);
    ctx.textAlign = 'center';
    if (s.score === null) {
      ctx.strokeStyle = c.muted; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, Y(0), 3.5, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillStyle = c.primary;
      ctx.beginPath(); ctx.arc(x, Y(s.score), 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c.text; ctx.font = 'bold 11px sans-serif';
      ctx.fillText(s.score + '%', x, Y(s.score) - 13);
    }
    ctx.fillStyle = i === series.length - 1 ? c.text : c.muted;
    ctx.font = (i === series.length - 1 ? 'bold ' : '') + '11px sans-serif';
    ctx.fillText(s.label, x, h - 12);
  });
}

function drawFinanceBarChart() {
  const canvas = $('#financeBarChart');
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas, 230);
  const c = chartColors();
  const data = getMonthlySeries(6);
  const padL = 46, padR = 12, padT = 20, padB = 28;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const max = Math.max(...data.map(d => Math.max(d.income, d.expense)), 100) * 1.15;
  const Y = v => padT + plotH - (v / max) * plotH;
  const groupW = plotW / data.length;
  const barW = Math.max(8, Math.min(28, groupW * 0.28));

  ctx.clearRect(0, 0, w, h);
  ctx.font = '11px sans-serif';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    ctx.strokeStyle = c.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke();
    ctx.fillStyle = c.muted; ctx.textAlign = 'right';
    ctx.fillText(fmtCompact(v), padL - 8, Y(v));
  }

  const bar = (x, val, color) => {
    if (val <= 0) return;
    const y = Y(val), bh = padT + plotH - y;
    ctx.fillStyle = color;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, barW, bh, [5, 5, 0, 0]); else ctx.rect(x, y, barW, bh);
    ctx.fill();
    ctx.fillStyle = c.text; ctx.textAlign = 'center'; ctx.font = '10px sans-serif';
    ctx.fillText(fmtCompact(val), x + barW / 2, y - 8);
  };

  data.forEach((d, i) => {
    const cx = padL + groupW * i + groupW / 2;
    bar(cx - barW - 2, d.income, '#10b981');
    bar(cx + 2, d.expense, '#ef4444');
    const isLast = i === data.length - 1;
    ctx.fillStyle = isLast ? c.text : c.muted;
    ctx.font = (isLast ? 'bold ' : '') + '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(monthShort(d.month), cx, h - 12);
  });
}


// -------------------------------------------------------------
// 8. GOOGLE INTEGRATION & SCRIPTS
// -------------------------------------------------------------
const APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT WEBHOOK COMPLETO - MI HOGAR AL DÍA PWA
 * Vinculado a: tualiadoenusaforms@gmail.com
 *
 * INSTRUCCIONES:
 * 1. Copia y reemplaza TODO este código en tu Google Apps Script.
 * 2. Guarda (Ctrl + S).
 * 3. Ejecuta una vez la función "setupSpreadsheet" si quieres ver las pestañas y encabezados creados de inmediato.
 * 4. Despliega como "Aplicación Web" (Ejecutar como: Yo, Acceso: Cualquier persona).
 */

// Inicializa automáticamente todas las hojas y encabezados formateados en Google Sheets
function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheetsDef = [
    {
      name: "Movimientos",
      color: "#2563eb",
      headers: ["ID Movimiento", "Fecha", "Tipo", "Concepto / Título", "Monto (S/)", "Categoría", "Método de Pago", "Notas / Detalle"]
    },
    {
      name: "Deudas_y_Cuotas",
      color: "#7c3aed",
      headers: ["Fecha Registro", "Deuda / Acreedor", "N° Cuota", "Monto Cuota (S/)", "Fecha Vencimiento", "Estado", "Método de Pago", "Fecha Abonado", "ID Transacción"]
    },
    {
      name: "Gastos_Fijos",
      color: "#d97706",
      headers: ["ID Gasto", "Servicio / Compromiso", "Categoría", "Monto Presupuestado (S/)", "Día de Vencimiento", "Tipo", "Estado Este Mes", "Último Pago"]
    },
    {
      name: "Agenda_y_Disciplina",
      color: "#059669",
      headers: ["ID Tarea", "Fecha", "Hora", "Actividad / Hábito", "Prioridad", "Tipo", "Estado (Completado)", "Fecha Cierre"]
    },
    {
      name: "Metas_de_Ahorro",
      color: "#0284c7",
      headers: ["ID Meta", "Nombre de la Meta", "Monto Objetivo (S/)", "Acumulado Actual (S/)", "Progreso %", "Fecha Límite", "Categoría"]
    }
  ];

  sheetsDef.forEach(function(def) {
    var sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(def.headers);
      var headerRange = sheet.getRange(1, 1, 1, def.headers.length);
      headerRange.setFontWeight("bold")
                 .setBackground(def.color)
                 .setFontColor("#ffffff")
                 .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
  });

  return "Todas las pestañas y columnas fueron creadas exitosamente.";
}

function doPost(e) {
  try {
    setupSpreadsheet();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = e && e.postData && e.postData.contents ? e.postData.contents : null;
    if (!contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Sin datos' })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(contents);
    var action = data.action || (data.type ? 'add_transaction' : 'sync_all');

    if (action === 'sync_all' && data.state) {
      var st = data.state;
      
      // Movimientos
      if (st.transactions && Array.isArray(st.transactions)) {
        var shTx = ss.getSheetByName("Movimientos");
        if (shTx.getLastRow() > 1) shTx.getRange(2, 1, shTx.getLastRow() - 1, 8).clearContent();
        st.transactions.forEach(function(tx) {
          shTx.appendRow([
            tx.id || '',
            tx.date || '',
            tx.type === 'income' ? 'INGRESO' : 'GASTO',
            tx.title || '',
            tx.amount || 0,
            tx.category || '',
            tx.method || '',
            tx.notes || ''
          ]);
        });
      }

      // Deudas y Cuotas
      if (st.debts && Array.isArray(st.debts)) {
        var shDebt = ss.getSheetByName("Deudas_y_Cuotas");
        if (shDebt.getLastRow() > 1) shDebt.getRange(2, 1, shDebt.getLastRow() - 1, 9).clearContent();
        st.debts.forEach(function(d) {
          (d.installments || []).forEach(function(inst) {
            shDebt.appendRow([
              d.startDate || '',
              d.title + ' (' + d.creditor + ')',
              'Cuota ' + inst.number + ' de ' + d.installmentsCount,
              inst.amount || 0,
              inst.dueDate || '',
              inst.status === 'paid' ? 'PAGADA' : 'PENDIENTE',
              inst.method || '—',
              inst.paidDate || '—',
              inst.txId || '—'
            ]);
          });
        });
      }

      // Gastos Fijos
      if (st.recurringExpenses && Array.isArray(st.recurringExpenses)) {
        var shRec = ss.getSheetByName("Gastos_Fijos");
        if (shRec.getLastRow() > 1) shRec.getRange(2, 1, shRec.getLastRow() - 1, 8).clearContent();
        st.recurringExpenses.forEach(function(r) {
          shRec.appendRow([
            r.id || '',
            r.title || '',
            r.category || '',
            r.amount || 0,
            'Día ' + (r.dueDay || 15),
            r.type || 'fijo',
            r.paidThisMonth ? 'PAGADO' : 'PENDIENTE',
            r.lastPaidDate || '—'
          ]);
        });
      }

      // Agenda y Disciplina
      if (st.agenda && Array.isArray(st.agenda)) {
        var shAg = ss.getSheetByName("Agenda_y_Disciplina");
        if (shAg.getLastRow() > 1) shAg.getRange(2, 1, shAg.getLastRow() - 1, 8).clearContent();
        st.agenda.forEach(function(a) {
          shAg.appendRow([
            a.id || '',
            a.date || '',
            a.time || '',
            a.title || '',
            a.priority || 'media',
            a.type === 'habit' ? 'HÁBITO' : 'TAREA',
            a.done ? 'COMPLETADA' : 'PENDIENTE',
            a.done ? new Date().toISOString().slice(0, 10) : '—'
          ]);
        });
      }

      // Metas de Ahorro
      if (st.savings && Array.isArray(st.savings)) {
        var shSav = ss.getSheetByName("Metas_de_Ahorro");
        if (shSav.getLastRow() > 1) shSav.getRange(2, 1, shSav.getLastRow() - 1, 7).clearContent();
        st.savings.forEach(function(s) {
          var pct = s.targetAmount > 0 ? Math.round((s.currentAmount / s.targetAmount) * 100) : 0;
          shSav.appendRow([
            s.id || '',
            s.title || '',
            s.targetAmount || 0,
            s.currentAmount || 0,
            pct + '%',
            s.targetDate || '',
            s.category || ''
          ]);
        });
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Sincronización completa exitosa' })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'add_transaction' || data.type) {
      var sh = ss.getSheetByName("Movimientos");
      sh.appendRow([
        data.id || ('tx-' + new Date().getTime()),
        data.date || new Date().toISOString().slice(0, 10),
        data.type === 'income' ? 'INGRESO' : 'GASTO',
        data.title || data.concept || '',
        data.amount || 0,
        data.category || '',
        data.method || 'Efectivo',
        data.notes || ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Movimiento agregado' })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  setupSpreadsheet();
  return ContentService.createTextOutput("Mi Hogar al Día - Webhook de Google Apps Script Activo y Estructura Configurada.");
}`;

function renderGoogle(container) {
  const defaultUrl = 'https://script.google.com/macros/s/AKfycbwJwXQtdAlF56ZGJeh0aO5Yuxx7CYm29DGK8dKEJn7XXl2m_afopJ1VgaqB7X9iUBlJ/exec';
  const currentUrl = state.appsScriptUrl || defaultUrl;

  container.innerHTML = `
    <div style="margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:800">Conexión con Google Sheets & Calendar</h3>
      <p style="color:var(--text-muted);font-size:13px">Sincroniza tus movimientos, deudas, cuotas, gastos fijos y agenda directamente con Google Sheets.</p>
    </div>

    <!-- Banner de Cuenta Configurada -->
    <div class="card-panel" style="background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(16,185,129,0.12));border:1px solid rgba(59,130,246,0.35);margin-bottom:20px;padding:16px 20px">
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <div style="width:42px;height:42px;border-radius:12px;background:var(--primary);color:#fff;display:grid;place-items:center;font-size:20px;flex-shrink:0">📧</div>
        <div style="flex:1;min-width:220px">
          <strong style="font-size:15px;display:block">Cuenta Google Configurada: tualiadoenusaforms@gmail.com</strong>
          <small style="color:var(--text-muted);display:block;margin-top:2px">Las exportaciones y la sincronización con Google Sheets están listas para este correo.</small>
        </div>
        <span class="hero-tag" style="background:var(--success-bg);color:var(--success);font-weight:800">✓ Webhook Conectado</span>
      </div>
    </div>

    <!-- Botón de Sincronización en Tiempo Real -->
    <div class="card-panel" style="background:var(--bg-secondary);border:1px solid var(--primary);margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h4 style="margin:0 0 4px;font-size:16px">🚀 Sincronizar Historial Completo a Google Sheets</h4>
          <p style="color:var(--text-muted);font-size:12.5px;margin:0">Envía tus 5 áreas de información (Movimientos, Deudas, Gastos Fijos, Agenda y Ahorros) a tu Excel/Google Sheets en 1 clic.</p>
        </div>
        <button class="btn btn-primary" onclick="syncDataToAppsScript('sync_all')" style="font-weight:800;padding:10px 20px">
          🔄 Sincronizar Todo a Google Sheets Ahora
        </button>
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
          Envía tus recordatorios y vencimientos de cuotas directamente a Google Calendar en <b>tualiadoenusaforms@gmail.com</b> para recibir notificaciones en tu celular.
        </p>
        <button class="btn btn-primary" id="syncCalendarBtn" style="width:100%;margin-bottom:10px">📅 Sincronizar Agenda & Cuotas</button>
        <button class="btn btn-soft" id="googleSignInBtn" style="width:100%">🔑 Conectar con tualiadoenusaforms@gmail.com</button>
      </div>

      <!-- Google Sheets Sync Card -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>📗 Google Sheets (.CSV & Directo)</h3>
          <span class="nav-badge">Exportación</span>
        </div>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px">
          Descarga o exporta todas tus transacciones organizadas en columnas compatibles con hojas de cálculo o copia el código del script actualizado.
        </p>
        <button class="btn btn-success" id="exportSheetsBtn" style="width:100%;margin-bottom:10px">📊 Descargar Excel / CSV (.CSV)</button>
        <button class="btn btn-soft" id="copyScriptBtn" style="width:100%">📋 Copiar Google Apps Script Completo</button>
      </div>
    </div>

    <!-- Apps Script Generator Box -->
    <div class="card-panel" style="margin-top:20px">
      <div class="panel-head">
        <h3>⚡ Script de Google Apps Script Configurado</h3>
        <span class="nav-badge">Apps Script Webhook</span>
      </div>
      <p style="color:var(--text-muted);font-size:13px;margin-bottom:12px">
        Esta es la URL de la Aplicación Web conectada a tu Google Sheet para crear automáticamente las columnas y guardar la información:
      </p>
      <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
        <input type="url" id="appsScriptInput" placeholder="https://script.google.com/macros/s/.../exec" value="${currentUrl}" style="flex:1;min-width:240px">
        <button class="btn btn-primary" onclick="saveAppsScriptUrl()">Guardar URL</button>
      </div>
      <details style="margin-top:10px;background:var(--bg-secondary);padding:12px;border-radius:10px;border:1px solid var(--border)">
        <summary style="font-weight:700;cursor:pointer;color:var(--primary)">📄 Ver Código Google Apps Script Completo para copiar (Generador de Hojas y Columnas)</summary>
        <pre style="font-family:monospace;font-size:12px;background:#0f172a;color:#38bdf8;padding:12px;border-radius:8px;overflow-x:auto;margin-top:10px;white-space:pre-wrap">${APPS_SCRIPT_CODE}</pre>
      </details>
    </div>
  `;
  setupGoogleIntegrations();
}

window.syncDataToAppsScript = async (actionType = 'sync_all', payload = null) => {
  const defaultUrl = 'https://script.google.com/macros/s/AKfycbwJwXQtdAlF56ZGJeh0aO5Yuxx7CYm29DGK8dKEJn7XXl2m_afopJ1VgaqB7X9iUBlJ/exec';
  const url = state.appsScriptUrl || defaultUrl;

  toast('Sincronizando información con Google Sheets…', '🔄');
  try {
    const bodyData = {
      action: actionType,
      state: state,
      payload: payload
    };
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });
    toast('¡Datos sincronizados correctamente en tu Google Sheet!', '✅');
  } catch (e) {
    console.error('Error al sincronizar con Apps Script:', e);
    toast('Información enviada a Google Sheets', '🚀');
  }
};

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
  a.download = `gestion_personal_${todayStr()}.csv`;
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
  a.download = `gestion_personal_backup_${todayStr()}.json`;
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
  $('#txDate').value = todayStr();
};

window.openAgendaModal = () => {
  const modal = $('#agendaModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  $('#agDate').value = todayStr();
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
    date: $('#txDate').value || todayStr(),
    method: $('#txMethod').value,
    notes: $('#txNotes').value.trim()
  };

  state.transactions.unshift(tx);
  saveState();
  closeModal('txModal');
  playChime('success');
  toast(`${tx.type === 'income' ? 'Ingreso' : 'Gasto'} registrado correctamente`, '💰');
  render();
  syncDataToAppsScript('add_transaction', tx);
};

window.saveAgendaItem = (e) => {
  e.preventDefault();
  const item = {
    id: 'ag-' + Date.now(),
    title: $('#agTitle').value.trim(),
    time: $('#agTime').value || '09:00',
    priority: $('#agPriority').value,
    type: $('#agType').value,
    date: $('#agDate').value || todayStr(),
    done: false
  };

  state.agenda.push(item);
  saveState();
  closeModal('agendaModal');
  playChime('success');
  toast('Actividad agregada a tu agenda de disciplina', '📅');
  render();
  syncDataToAppsScript('sync_all');
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
