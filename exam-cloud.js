/* PsixoLab — Bilim testlari natijalarini bulutga (Firebase Firestore) yuborish va o'qituvchi sahifasi (#teacher).
   Talabalar ro'yxatdan o'tmaydi: natija test tugashi bilan "examResults" to'plamiga yoziladi (faqat yaratish mumkin).
   O'qib chiqish va o'chirish faqat o'qituvchi (admin) hisobiga ruxsat etilgan — himoya Firestore xavfsizlik qoidalarida. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, setDoc, deleteDoc, collection, getDocs, query, orderBy, limit, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const fb = initializeApp({
  apiKey: 'AIzaSyAGe1XCuFJekNogbsoeqfpvOlqvsDaG5TM',
  authDomain: 'psixolab.firebaseapp.com',
  projectId: 'psixolab',
  storageBucket: 'psixolab.firebasestorage.app',
  messagingSenderId: '212225982003',
  appId: '1:212225982003:web:15bb9217cddd9dd574ed46'
});
const ADMIN_EMAIL = 'javoxirshermatov94@gmail.com';
const auth = getAuth(fb), db = getFirestore(fb);
const L = (uz, ru) => (lang === 'ru' ? ru : uz);
const $ = id => document.getElementById(id);
const QK = 'psixolab-exam-queue';
const EX = window.EXAMS || {};
const gradeOf = p => p >= 86 ? 5 : p >= 71 ? 4 : p >= 55 ? 3 : 2;

// ================= Talaba: natijani yuborish (internet bo'lmasa navbatda qoladi) =================
const loadQ = () => { try { return JSON.parse(localStorage.getItem(QK) || '[]'); } catch (e) { return []; } };
const saveQ = q => { try { localStorage.setItem(QK, JSON.stringify(q)); } catch (e) {} };
function setStatus(rid, state) {
  const el = $('xsend'); if (!el || el.dataset.rid !== rid) return;
  el.className = 'exam-send ' + (state === 'ok' ? 'ok' : state === 'err' ? 'err' : '');
  el.innerHTML = state === 'ok' ? '✓ ' + L("Natija o'qituvchiga yuborildi", 'Результат отправлен преподавателю')
    : state === 'err' ? '⚠ ' + L("Natija hali yuborilmadi (internetni tekshiring). Sahifani yopmang yoki keyinroq saytni qayta oching — u avtomatik yuboriladi.", 'Результат ещё не отправлен (проверьте интернет). Не закрывайте страницу или откройте сайт позже — он отправится автоматически.') + ` <button type="button" class="btn secondary" id="xresend">${L('Qayta yuborish', 'Отправить снова')}</button>`
    : '⏳ ' + L("Natija o'qituvchiga yuborilmoqda…", 'Результат отправляется преподавателю…');
  const b = $('xresend'); if (b) b.addEventListener('click', () => { setStatus(rid, ''); flush(); });
}
const withTimeout = (pr, ms) => Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), ms))]);
let flushing = false;
async function flush() {
  if (flushing) return; flushing = true;
  try {
    for (const p of loadQ()) {
      try {
        await withTimeout(setDoc(doc(db, 'examResults', p.rid), {
          exam: String(p.exam), title: String(p.title || ''), name: String(p.name).slice(0, 80), group: String(p.group || '').slice(0, 30),
          score: p.score | 0, max: p.max | 0, pct: p.pct | 0, grade: p.grade | 0, time: p.time | 0, leaves: p.leaves | 0, away: p.away | 0,
          ended: String(p.ended || ''), q: (p.q || []).map(x => x | 0), a: (p.a || []).map(x => x | 0), started: Number(p.started) || 0,
          at: serverTimestamp()
        }), 15000);
        saveQ(loadQ().filter(x => x.rid !== p.rid)); setStatus(p.rid, 'ok');
      } catch (e) {
        // allaqachon yozilgan bo'lsa (qayta yuborish) — navbatdan olib tashlaymiz
        if (e && e.code === 'permission-denied' && p.tries > 10) saveQ(loadQ().filter(x => x.rid !== p.rid));
        else { const q = loadQ(); const it = q.find(x => x.rid === p.rid); if (it) { it.tries = (it.tries || 0) + 1; saveQ(q); } }
        setStatus(p.rid, 'err');
      }
    }
  } finally { flushing = false; }
}
window.PL_examFlush = flush;
flush();
window.addEventListener('online', flush);

// ================= O'qituvchi sahifasi =================
let user = null, rows = null, F = { exam: '', group: '', from: '', to: '', q: '' }, sort = ['at', -1], tab = 'table', loadErr = '';
const isAdmin = () => !!user && user.email === ADMIN_EMAIL && user.emailVerified;
const fmtT = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const dt = r => r.at && r.at.toDate ? r.at.toDate() : new Date(r.started || 0);
const dstr = d => d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

async function loadRows() {
  loadErr = '';
  try {
    const snap = await getDocs(query(collection(db, 'examResults'), orderBy('at', 'desc'), limit(5000)));
    rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { rows = []; loadErr = e.code || e.message; }
}
function filtered() {
  const from = F.from ? new Date(F.from + 'T00:00') : null, to = F.to ? new Date(F.to + 'T23:59:59') : null, q = F.q.trim().toLowerCase();
  return (rows || []).filter(r => (!F.exam || r.exam === F.exam) && (!F.group || r.group === F.group) && (!from || dt(r) >= from) && (!to || dt(r) <= to) && (!q || (r.name || '').toLowerCase().includes(q)));
}

function viewTeacher() {
  document.body.dataset.page = 'teacher';
  if (!user) {
    app.innerHTML = `
      <h1>${L("O'qituvchi sahifasi", 'Страница преподавателя')}</h1>
      <div class="card" style="max-width:440px">
        <p>${L("Talabalarning bilim testi natijalarini ko'rish uchun o'qituvchi hisobingizga kiring.", 'Войдите в учётную запись преподавателя, чтобы видеть результаты студентов.')}</p>
        <form id="tlog">
          <label class="exam-f">Email<input id="tem" type="email" autocomplete="username" required></label>
          <label class="exam-f">${L('Parol', 'Пароль')}<input id="tpw" type="password" autocomplete="current-password" required></label>
          <p id="terr" class="notice danger" hidden></p><p id="tok" class="notice" hidden></p>
          <div class="row-actions"><button class="btn" type="submit">${L('Kirish', 'Войти')}</button><button class="btn secondary" type="button" id="tforgot">${L('Parolni unutdim', 'Забыли пароль')}</button></div>
        </form>
      </div>`;
    $('tlog').addEventListener('submit', async ev => {
      ev.preventDefault();
      try { await signInWithEmailAndPassword(auth, $('tem').value.trim(), $('tpw').value); }
      catch (e) { $('terr').textContent = L("Email yoki parol noto'g'ri.", 'Неверный email или пароль.') + ` (${e.code || ''})`; $('terr').hidden = false; }
    });
    $('tforgot').addEventListener('click', async () => {
      const em = $('tem').value.trim(); if (!em) { $('tem').focus(); return; }
      try { await sendPasswordResetEmail(auth, em); $('tok').textContent = L('Parolni tiklash havolasi emailingizga yuborildi.', 'Ссылка для сброса пароля отправлена на email.'); $('tok').hidden = false; } catch (e) { $('terr').textContent = e.code || ''; $('terr').hidden = false; }
    });
    return;
  }
  if (!isAdmin()) {
    const unver = user.email === ADMIN_EMAIL && !user.emailVerified;
    app.innerHTML = `<h1>${L("O'qituvchi sahifasi", 'Страница преподавателя')}</h1>
      <div class="notice ${unver ? 'warn' : 'danger'}">${unver ? L("Emailingiz hali tasdiqlanmagan. Tugmani bosing, pochtangizga kelgan havolani oching, so'ng bu sahifaga qaytib, «Tekshirish» tugmasini bosing.", 'Ваш email ещё не подтверждён. Нажмите кнопку, откройте ссылку из письма, затем вернитесь и нажмите «Проверить».') : L("Bu hisobga natijalarni ko'rish ruxsati berilmagan.", 'У этой учётной записи нет доступа к результатам.')} (${esc(user.email || '')})</div>
      <div class="row-actions">${unver ? `<button class="btn" id="tver">${L('Emailni tasdiqlash', 'Подтвердить email')}</button><button class="btn secondary" id="tchk">${L('Tekshirish', 'Проверить')}</button>` : ''}<button class="btn secondary" id="tout">${L('Chiqish', 'Выйти')}</button></div>`;
    $('tout').addEventListener('click', () => signOut(auth));
    if (unver) {
      $('tver').addEventListener('click', async () => { try { await sendEmailVerification(user); $('tver').textContent = L('Yuborildi — pochtani tekshiring (Spam ham)', 'Отправлено — проверьте почту (и «Спам»)'); $('tver').disabled = true; } catch (e) { $('tver').textContent = e.code || 'error'; } });
      $('tchk').addEventListener('click', async () => { await user.reload(); await user.getIdToken(true); user = auth.currentUser; viewTeacher(); });
    }
    return;
  }
  if (!rows) { app.innerHTML = `<h1>${L("O'qituvchi sahifasi", 'Страница преподавателя')}</h1><p>${L('Natijalar yuklanmoqda…', 'Загрузка результатов…')}</p>`; loadRows().then(viewTeacher); return; }
  render();
}

function render() {
  const all = rows || [], list = filtered();
  const exams = [...new Set(all.map(r => r.exam))], groups = [...new Set(all.filter(r => !F.exam || r.exam === F.exam).map(r => r.group))].sort();
  const avg = list.length ? Math.round(list.reduce((s, r) => s + r.pct, 0) / list.length) : 0;
  const gd = [5, 4, 3, 2].map(g => list.filter(r => r.grade === g).length);
  const sus = list.filter(r => r.leaves > 0).length;
  const byG = groups.filter(g => !F.group || g === F.group).map(g => { const x = list.filter(r => r.group === g); return [g, x.length, x.length ? Math.round(x.reduce((s, r) => s + r.pct, 0) / x.length) : 0, [5, 4, 3, 2].map(k => x.filter(r => r.grade === k).length), x.filter(r => r.leaves > 0).length]; }).filter(x => x[1]);
  const key = sort[0], dir = sort[1];
  const sorted = list.slice().sort((a, b) => { const va = key === 'at' ? dt(a) : a[key], vb = key === 'at' ? dt(b) : b[key]; return (va > vb ? 1 : va < vb ? -1 : 0) * dir; });
  const th = (k, t) => `<th data-k="${k}" class="${sort[0] === k ? 'on' : ''}">${t}${sort[0] === k ? (sort[1] > 0 ? ' ▲' : ' ▼') : ''}</th>`;
  app.innerHTML = `
    <div class="t-head"><h1>${L("O'qituvchi sahifasi", 'Страница преподавателя')}</h1>
      <div class="row-actions"><button class="btn secondary" id="trel">↻ ${L('Yangilash', 'Обновить')}</button><button class="btn secondary" id="tout">${L('Chiqish', 'Выйти')}</button></div></div>
    ${loadErr ? `<div class="notice danger">${L('Natijalarni yuklab bo\'lmadi', 'Не удалось загрузить результаты')}: ${esc(loadErr)}. ${L("Firestore xavfsizlik qoidalari joylanganini tekshiring.", 'Проверьте, опубликованы ли правила безопасности Firestore.')}</div>` : ''}
    <div class="card t-filters">
      <label>${L('Fan', 'Предмет')}<select id="fexam"><option value="">${L('Barchasi', 'Все')}</option>${exams.map(x => `<option value="${esc(x)}" ${F.exam === x ? 'selected' : ''}>${esc((EX[x] || {}).title || x)}</option>`).join('')}</select></label>
      <label>${L('Guruh', 'Группа')}<select id="fgroup"><option value="">${L('Barchasi', 'Все')}</option>${groups.map(x => `<option ${F.group === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>
      <label>${L('Sanadan', 'С даты')}<input type="date" id="ffrom" value="${F.from}"></label>
      <label>${L('Sanagacha', 'По дату')}<input type="date" id="fto" value="${F.to}"></label>
      <label>${L('Ism bo\'yicha qidiruv', 'Поиск по имени')}<input id="fq" value="${esc(F.q)}"></label>
    </div>
    <div class="t-stats">
      <div class="card"><b>${list.length}</b><span>${L('natija', 'результатов')}</span></div>
      <div class="card"><b>${avg}%</b><span>${L("o'rtacha", 'средний')}</span></div>
      <div class="card"><b>${gd.join(' / ')}</b><span>${L('baholar', 'оценки')}: 5 / 4 / 3 / 2</span></div>
      <div class="card"><b class="${sus ? 'bad' : ''}">${sus}</b><span>${L('testdan chiqqanlar', 'выходили из теста')}</span></div>
    </div>
    <div class="t-tabs">${[['table', L('Natijalar', 'Результаты')], ['groups', L('Guruhlar', 'Группы')], ['items', L('Savollar tahlili', 'Анализ вопросов')]].map(([k, t]) => `<button type="button" data-t="${k}" class="${tab === k ? 'on' : ''}">${t}</button>`).join('')}
      <span class="t-sp"></span><button class="btn" id="tcsv">⬇ Excel (CSV)</button></div>
    <div id="tbody">${tab === 'table' ? `
      <div class="t-wrap"><table class="t-table"><thead><tr><th>#</th>${th('name', L('Ism familiya', 'ФИО'))}${th('group', L('Guruh', 'Группа'))}${th('score', L('Ball', 'Балл'))}${th('pct', '%')}${th('grade', L('Baho', 'Оценка'))}${th('leaves', L('Chiqish', 'Выходы'))}${th('time', L('Vaqt', 'Время'))}${th('at', L('Sana', 'Дата'))}<th></th></tr></thead>
      <tbody>${sorted.map((r, i) => `<tr data-id="${esc(r.id)}" class="${r.ended === 'cheat' ? 'cheat' : ''}"><td>${i + 1}</td><td><b>${esc(r.name)}</b></td><td>${esc(r.group)}</td><td>${r.score}/${r.max}</td><td>${r.pct}%</td><td><span class="t-g g${r.grade}">${r.grade}</span></td><td class="${r.leaves ? 'bad' : ''}">${r.leaves || 0}${r.ended === 'cheat' ? ' ⛔' : ''}</td><td>${fmtT(r.time || 0)}${r.ended === 'timeout' ? ' ⏱' : ''}</td><td>${dstr(dt(r))}</td><td><button class="t-more" type="button">${L('Batafsil', 'Подробно')}</button></td></tr>`).join('') || `<tr><td colspan="10">${L("Hozircha natija yo'q.", 'Пока нет результатов.')}</td></tr>`}</tbody></table></div>
      <p class="meta">⛔ — ${L('qoidabuzarlik sababli yakunlangan', 'завершён из-за нарушения')} · ⏱ — ${L('vaqt tugagan', 'время истекло')}</p>`
    : tab === 'groups' ? `
      <div class="t-wrap"><table class="t-table"><thead><tr><th>${L('Guruh', 'Группа')}</th><th>${L('Topshirganlar', 'Сдали')}</th><th>${L("O'rtacha", 'Средний')}</th><th>5</th><th>4</th><th>3</th><th>2</th><th>${L('Chiqqanlar', 'Выходили')}</th></tr></thead>
      <tbody>${byG.map(([g, n, a, d, s]) => `<tr><td><b>${esc(g)}</b></td><td>${n}</td><td>${a}%</td>${d.map(x => `<td>${x}</td>`).join('')}<td class="${s ? 'bad' : ''}">${s}</td></tr>`).join('') || `<tr><td colspan="8">—</td></tr>`}</tbody></table></div>`
    : itemsHtml(list)}</div>`;
  const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
  on('fexam', 'change', e => { F.exam = e.target.value; F.group = ''; render(); });
  on('fgroup', 'change', e => { F.group = e.target.value; render(); });
  on('ffrom', 'change', e => { F.from = e.target.value; render(); });
  on('fto', 'change', e => { F.to = e.target.value; render(); });
  on('fq', 'change', e => { F.q = e.target.value; render(); });
  on('trel', 'click', () => { rows = null; viewTeacher(); });
  on('tout', 'click', () => { rows = null; signOut(auth); });
  on('tcsv', 'click', () => csv(sorted));
  app.querySelectorAll('.t-tabs button[data-t]').forEach(b => b.addEventListener('click', () => { tab = b.dataset.t; render(); }));
  app.querySelectorAll('.t-table th[data-k]').forEach(h => h.addEventListener('click', () => { const k = h.dataset.k; sort = [k, sort[0] === k ? -sort[1] : (k === 'name' || k === 'group' ? 1 : -1)]; render(); }));
  app.querySelectorAll('.t-more').forEach(b => b.addEventListener('click', () => detail(rows.find(r => r.id === b.closest('tr').dataset.id))));
}

function itemsHtml(list) {
  const stat = {};
  list.forEach(r => (r.q || []).forEach((qi, k) => { const key = r.exam + ':' + qi; const s = stat[key] || (stat[key] = { exam: r.exam, qi, n: 0, ok: 0, picks: [0, 0, 0, 0, 0] }); const e = EX[r.exam]; if (!e || !e.qs[qi]) return; s.n++; if (r.a[k] === e.qs[qi][3]) s.ok++; s.picks[r.a[k] >= 0 ? r.a[k] : 4]++; }));
  const arr = Object.values(stat).filter(s => s.n).sort((a, b) => a.ok / a.n - b.ok / b.n);
  if (!arr.length) return `<p>${L("Hozircha ma'lumot yo'q.", 'Пока нет данных.')}</p>`;
  return `<p class="meta">${L("Savollar eng qiyinidan boshlab saralangan: qaysi mavzu talabalarga yomon tushunarli bo'lganini va qaysi noto'g'ri variant ko'p tanlanganini ko'rasiz.", 'Вопросы отсортированы от самого трудного: видно, какие темы усвоены хуже и какой неверный вариант выбирают чаще.')}</p>
    <div class="t-wrap"><table class="t-table t-items"><thead><tr><th>№</th><th>${L('Savol', 'Вопрос')}</th><th>${L('Tushgan', 'Показан')}</th><th>${L("To'g'ri", 'Верно')}</th><th>A</th><th>B</th><th>C</th><th>D</th><th>${L("Bo'sh", 'Пусто')}</th></tr></thead><tbody>
    ${arr.map(s => { const q = EX[s.exam].qs[s.qi], p = Math.round(s.ok / s.n * 100); return `<tr><td>${s.qi + 1}</td><td>${esc(q[1])}</td><td>${s.n}</td><td><span class="t-pct ${p < 40 ? 'bad' : p < 70 ? 'mid' : 'ok'}">${p}%</span></td>${[0, 1, 2, 3].map(j => `<td class="${j === q[3] ? 'c' : ''}" title="${esc(q[2][j])}">${s.picks[j]}</td>`).join('')}<td>${s.picks[4]}</td></tr>`; }).join('')}
    </tbody></table></div><p class="meta">${L("A–D ustunlari asl (kalitdagi) variantlar bo'yicha; yashil — to'g'ri javob. Variant matnini ko'rish uchun sichqonchani raqam ustiga olib boring.", 'Столбцы A–D — по исходным вариантам ключа; зелёный — верный ответ. Наведите на число, чтобы увидеть текст варианта.')}</p>`;
}

function detail(r) {
  if (!r) return;
  const e = EX[r.exam];
  const w = document.createElement('div'); w.className = 'exam-warn'; w.id = 'tdet';
  w.innerHTML = `<div class="exam-warn-box t-det"><button class="t-x" type="button">✕</button>
    <h2>${esc(r.name)} · ${esc(r.group)}</h2>
    <p><b>${r.score}/${r.max} (${r.pct}%)</b> · ${L('baho', 'оценка')} ${r.grade} · ${L('vaqt', 'время')} ${fmtT(r.time || 0)} · ${L('chiqishlar', 'выходы')}: ${r.leaves || 0}${r.away ? ` (${r.away} ${L('soniya', 'сек')})` : ''} · ${dstr(dt(r))}</p>
    ${r.ended === 'cheat' ? `<p class="notice danger">${L('Qoidabuzarlik sababli avtomatik yakunlangan.', 'Завершён автоматически из-за нарушения.')}</p>` : ''}
    <ol class="t-ans">${(r.q || []).map((qi, k) => { const q = e && e.qs[qi]; if (!q) return ''; const a = r.a[k], ok = a === q[3]; return `<li class="${ok ? 'ok' : 'bad'}"><b>${ok ? '✓' : '✗'}</b> ${esc(q[1])}<br><small>${ok ? '' : `${L('Javobi', 'Ответ')}: ${a >= 0 ? esc(q[2][a]) : '—'} · `}${L("To'g'ri", 'Верно')}: ${esc(q[2][q[3]])}</small></li>`; }).join('')}</ol>
    <div class="row-actions"><button class="btn secondary" id="tdel">${L("Natijani o'chirish", 'Удалить результат')}</button></div></div>`;
  document.body.appendChild(w);
  const close = () => w.remove();
  w.addEventListener('click', ev => { if (ev.target === w) close(); });
  w.querySelector('.t-x').addEventListener('click', close);
  const del = $('tdel');
  del.addEventListener('click', async () => {
    if (!del.dataset.sure) { del.dataset.sure = 1; del.textContent = L("Rostdan o'chirilsinmi? Qaytarib bo'lmaydi — yana bosing", 'Точно удалить? Без возможности восстановления — нажмите ещё раз'); return; }
    try { await deleteDoc(doc(db, 'examResults', r.id)); rows = rows.filter(x => x.id !== r.id); close(); render(); } catch (e) { del.textContent = e.code || 'error'; }
  });
}

function csv(list) {
  const head = [L('Ism familiya', 'ФИО'), L('Guruh', 'Группа'), L('Fan', 'Предмет'), L('Ball', 'Балл'), L('Maks', 'Макс'), '%', L('Baho', 'Оценка'), L('Chiqishlar', 'Выходы'), L('Tashqarida (s)', 'Вне теста (с)'), L('Yakun', 'Завершение'), L('Vaqt', 'Время'), L('Sana', 'Дата')];
  const cell = v => { const s = String(v ?? ''); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = [head.join(';')].concat(list.map(r => [r.name, r.group, r.title || r.exam, r.score, r.max, r.pct, r.grade, r.leaves || 0, r.away || 0, r.ended === 'cheat' ? L('qoidabuzarlik', 'нарушение') : r.ended === 'timeout' ? L('vaqt tugadi', 'время вышло') : '', fmtT(r.time || 0), dstr(dt(r))].map(cell).join(';')));
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `natijalar_${F.group || 'hammasi'}_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

const css = document.createElement('style');
css.textContent = `
  .t-head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
  .card.t-filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:.8rem}.t-filters label{display:flex;flex-direction:column;font-size:.82rem;font-weight:600;gap:.25rem;color:var(--muted);margin:0}
  .t-filters select,.t-filters input{padding:.45rem .6rem;border:1.5px solid var(--border);border-radius:9px;font:inherit;color:var(--text);width:100%;box-sizing:border-box;background:#fff}
  .t-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:.8rem;margin:1rem 0}
  .t-stats .card{display:flex;flex-direction:column;gap:.2rem}.t-stats b{font:800 1.6rem var(--display);color:var(--accent)}.t-stats b.bad{color:#E0466B}.t-stats span{color:var(--muted);font-size:.85rem}
  .t-tabs{display:flex;gap:.4rem;align-items:center;margin:.6rem 0;flex-wrap:wrap}.t-sp{flex:1}
  .t-tabs button[data-t]{padding:.5rem 1rem;border-radius:999px;border:1.5px solid rgba(201,190,255,.5);background:transparent;color:inherit;font-weight:700;cursor:pointer}
  .t-tabs button.on{background:#C9BEFF;color:#16123F;border-color:#C9BEFF}
  .t-wrap{overflow-x:auto;background:#fff;border-radius:14px}
  .t-table{width:100%;border-collapse:collapse;font-size:.9rem;color:#1E1A4D;background:#fff}
  .t-table th{background:#F1EEFD;text-align:left;padding:.6rem;white-space:nowrap;cursor:pointer;user-select:none}.t-table th.on{color:#5B47E0}
  .t-table td{padding:.55rem .6rem;border-top:1px solid #ECE8FA;vertical-align:top}.t-table tr.cheat td{background:#FFF1F4}
  .t-table td.bad{color:#E0466B;font-weight:700}.t-table td.c{background:#E3F6EF;font-weight:700}
  .t-g{display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:7px;color:#fff;font-weight:800}
  .t-g.g5{background:#1F9D7A}.t-g.g4{background:#5B47E0}.t-g.g3{background:#D98E04}.t-g.g2{background:#E0466B}
  .t-pct{font-weight:800}.t-pct.bad{color:#E0466B}.t-pct.mid{color:#D98E04}.t-pct.ok{color:#1F9D7A}
  .t-items td:nth-child(2){min-width:320px}
  .t-more{border:0;background:#F1EEFD;color:#5B47E0;font-weight:700;border-radius:8px;padding:.3rem .6rem;cursor:pointer}
  .t-det{max-width:760px;max-height:85vh;overflow:auto;position:relative}.t-x{position:absolute;top:.7rem;right:.7rem;border:0;background:#F1EEFD;border-radius:8px;width:32px;height:32px;cursor:pointer}
  .t-ans{padding-left:1.2rem}.t-ans li{margin:.5rem 0;line-height:1.4}.t-ans li.ok b{color:#1F9D7A}.t-ans li.bad b{color:#E0466B}.t-ans small{color:#625D8F}
  @media print{.t-filters,.t-tabs,.t-head .row-actions,.t-more{display:none!important}}`;
document.head.appendChild(css);

const _route = route;
window.removeEventListener('hashchange', _route);
route = function () {
  const pg = (location.hash || '#home').slice(1).split('/')[0];
  _route();
  if (pg === 'teacher') { viewTeacher(); window.scrollTo(0, 0); }
};
window.addEventListener('hashchange', route);
onAuthStateChanged(auth, u => { user = u; if (!u) rows = null; if ((location.hash || '').startsWith('#teacher')) viewTeacher(); });
route();
