/* PsixoLab — Profil tizimi: ro'yxatdan o'tish, kirish, bulutda natijalar, admin paneli (Firebase) */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendEmailVerification, sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, collectionGroup, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Firebase veb-ilova sozlamalari (bu ma'lumotlar ochiq bo'lishi mumkin — himoya xavfsizlik qoidalarida)
const firebaseConfig = {
  apiKey: 'AIzaSyAGe1XCuFJekNogbsoeqfpvOlqvsDaG5TM',
  authDomain: 'psixolab.firebaseapp.com',
  projectId: 'psixolab',
  storageBucket: 'psixolab.firebasestorage.app',
  messagingSenderId: '212225982003',
  appId: '1:212225982003:web:15bb9217cddd9dd574ed46'
};
const ADMIN_EMAIL = 'javoxirshermatov94@gmail.com';

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);
const db = getFirestore(fb);
let user = null, profile = null, authReady = false;

const L = (uz, ru) => (lang === 'ru' ? ru : uz);
const isAdmin = () => !!user && user.email === ADMIN_EMAIL && user.emailVerified;
const page = () => (location.hash || '#home').slice(1).split('/')[0];
const fmtDate = d => { try { return new Date(d).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ'); } catch (e) { return d || ''; } };
const genderLabel = g => (g === 'm' ? L('Erkak', 'Мужской') : g === 'f' ? L('Ayol', 'Женский') : '');

function errText(e) {
  const c = (e && e.code) || '';
  const M = {
    'auth/email-already-in-use': L("Bu email bilan allaqachon ro'yxatdan o'tilgan. \"Kirish\" bo'limidan foydalaning.", 'Этот email уже зарегистрирован. Воспользуйтесь разделом «Вход».'),
    'auth/invalid-email': L("Email manzil noto'g'ri yozilgan.", 'Неверный формат email.'),
    'auth/weak-password': L("Parol juda oddiy: kamida 6 ta belgi bo'lsin.", 'Слишком простой пароль: минимум 6 символов.'),
    'auth/invalid-credential': L("Email yoki parol noto'g'ri.", 'Неверный email или пароль.'),
    'auth/wrong-password': L("Email yoki parol noto'g'ri.", 'Неверный email или пароль.'),
    'auth/user-not-found': L("Email yoki parol noto'g'ri.", 'Неверный email или пароль.'),
    'auth/too-many-requests': L("Juda ko'p urinish bo'ldi. Birozdan keyin qayta urinib ko'ring.", 'Слишком много попыток. Попробуйте позже.'),
    'auth/network-request-failed': L("Internet aloqasi yo'q. Tarmoqni tekshiring.", 'Нет соединения с интернетом.'),
    'permission-denied': L("Ruxsat yo'q.", 'Нет доступа.')
  };
  return M[c] || (L('Xatolik: ', 'Ошибка: ') + (e && e.message ? e.message : c));
}

/* ---------- Sarlavhadagi tugma va admin havolasi ---------- */
const top = document.querySelector('.top');
const acct = document.createElement('a');
acct.className = 'acct-btn';
top.insertBefore(acct, document.querySelector('.lang'));
function renderHeader() {
  if (user) {
    acct.href = '#profile';
    acct.textContent = '👤 ' + ((profile && profile.name) || user.email.split('@')[0]);
  } else {
    acct.href = '#login';
    acct.textContent = L('Kirish', 'Войти');
  }
  const nav = document.querySelector('nav');
  let adm = nav.querySelector('a[href="#admin"]');
  if (isAdmin() && !adm) {
    adm = document.createElement('a'); adm.href = '#admin'; adm.textContent = L('Admin panel', 'Админ-панель');
    nav.appendChild(adm);
  } else if (!isAdmin() && adm) adm.remove();
  if (adm) adm.textContent = L('Admin panel', 'Админ-панель');
}

/* ---------- Natijalarni bulutga saqlash ---------- */
const _prevSave = saveResult;
saveResult = function (r) {
  _prevSave(r);
  if (!user) return;
  const data = JSON.parse(JSON.stringify(r));
  addDoc(collection(db, 'users', user.uid, 'results'), data).catch(e => console.warn('PsixoLab: natija saqlanmadi', e));
};

/* ---------- Kirish / ro'yxatdan o'tish ---------- */
function viewLogin(mode) {
  mode = mode || 'login';
  const reg = mode === 'register';
  app.innerHTML = `
    <h1>${reg ? L("Ro'yxatdan o'tish", 'Регистрация') : L('Kirish', 'Вход')}</h1>
    <p class="lead">${esc(L("Profil orqali natijalaringiz bulutda saqlanadi va istalgan qurilmadan ko'rishingiz mumkin.", 'С профилем ваши результаты сохраняются в облаке и доступны с любого устройства.'))}</p>
    <div class="card auth">
      <div class="auth-tabs">
        <a href="#login" class="${reg ? '' : 'on'}">${L('Kirish', 'Вход')}</a>
        <a href="#register" class="${reg ? 'on' : ''}">${L("Ro'yxatdan o'tish", 'Регистрация')}</a>
      </div>
      <form id="af" novalidate>
        <label>Email<input type="email" id="em" autocomplete="email" required></label>
        <label>${L('Parol', 'Пароль')}<input type="password" id="pw" autocomplete="${reg ? 'new-password' : 'current-password'}" required></label>
        ${reg ? `
        <label>${L('Parolni takrorlang', 'Повторите пароль')}<input type="password" id="pw2" autocomplete="new-password" required></label>
        <label>${L('Ism (ixtiyoriy)', 'Имя (необязательно)')}<input type="text" id="nm" autocomplete="name"></label>
        <div class="row2">
          <label>${L('Yosh', 'Возраст')}<input type="number" id="ag" min="6" max="100"></label>
          <label>${L('Jins', 'Пол')}<select id="gd"><option value="">—</option><option value="m">${L('Erkak', 'Мужской')}</option><option value="f">${L('Ayol', 'Женский')}</option></select></label>
        </div>
        <label>${L("Guruh / fakultet / ish joyi (ixtiyoriy)", 'Группа / факультет / место работы (необязательно)')}<input type="text" id="gr"></label>
        <label class="chk"><input type="checkbox" id="cs"> ${esc(L("Natijalarim xavfsiz saqlanishiga va psixolog (sayt administratori) tomonidan ilmiy maqsadda tahlil qilinishiga roziman.", 'Я согласен(на), что мои результаты будут надёжно храниться и могут анализироваться психологом (администратором сайта) в научных целях.'))}</label>` : ''}
        <p id="aerr" class="notice danger" hidden></p>
        <p id="aok" class="notice warn" hidden></p>
        <button class="btn" type="submit" id="asub">${reg ? L("Ro'yxatdan o'tish", 'Зарегистрироваться') : L('Kirish', 'Войти')}</button>
        ${reg ? '' : `<p><a href="#" id="forgot">${L('Parolni unutdingizmi?', 'Забыли пароль?')}</a></p>`}
      </form>
    </div>`;
  const $ = id => document.getElementById(id);
  const showErr = m => { $('aerr').textContent = m; $('aerr').hidden = false; };
  if (!reg) $('forgot').onclick = async ev => {
    ev.preventDefault();
    const em = $('em').value.trim();
    if (!em) return showErr(L("Avval email manzilingizni yozing.", 'Сначала введите email.'));
    try { await sendPasswordResetEmail(auth, em); $('aok').textContent = L("Parolni tiklash havolasi emailingizga yuborildi (Spam papkasini ham tekshiring).", 'Ссылка для сброса пароля отправлена на email (проверьте и папку «Спам»).'); $('aok').hidden = false; $('aerr').hidden = true; }
    catch (e) { showErr(errText(e)); }
  };
  $('af').onsubmit = async ev => {
    ev.preventDefault();
    $('aerr').hidden = true;
    const em = $('em').value.trim(), pw = $('pw').value;
    $('asub').disabled = true;
    try {
      if (reg) {
        if (pw !== $('pw2').value) throw { code: 'x', message: L('Parollar bir xil emas.', 'Пароли не совпадают.') };
        if (!$('cs').checked) throw { code: 'x', message: L("Davom etish uchun rozilik belgisini qo'ying.", 'Отметьте согласие, чтобы продолжить.') };
        const cred = await createUserWithEmailAndPassword(auth, em, pw);
        const ageVal = Number($('ag').value);
        profile = {
          email: em, name: $('nm').value.trim(), age: ageVal > 0 ? ageVal : null,
          gender: $('gd').value, group: $('gr').value.trim(), consent: true, createdAt: serverTimestamp()
        };
        await setDoc(doc(db, 'users', cred.user.uid), profile);
        try { await sendEmailVerification(cred.user); } catch (e) { /* ignore */ }
      } else {
        await signInWithEmailAndPassword(auth, em, pw);
      }
      location.hash = '#profile';
    } catch (e) {
      showErr(e.code === 'x' ? e.message : errText(e));
      $('asub').disabled = false;
    }
  };
}

/* ---------- Profil ---------- */
async function viewProfile() {
  if (!authReady) { app.innerHTML = `<p class="lead">${L('Yuklanmoqda…', 'Загрузка…')}</p>`; return; }
  if (!user) return viewLogin('login');
  const p = profile || {};
  app.innerHTML = `
    <h1>${L('Profilim', 'Мой профиль')}</h1>
    <div class="card auth">
      <p><strong>Email:</strong> ${esc(user.email)} ${user.emailVerified ? `<span class="badge ok">✓ ${L('tasdiqlangan', 'подтверждён')}</span>` : `<span class="badge">${L('tasdiqlanmagan', 'не подтверждён')}</span> <button class="btn secondary sm" id="ver">${L('Tasdiqlash xatini yuborish', 'Отправить письмо')}</button>`}</p>
      <form id="pf">
        <label>${L('Ism', 'Имя')}<input type="text" id="nm" value="${esc(p.name || '')}"></label>
        <div class="row2">
          <label>${L('Yosh', 'Возраст')}<input type="number" id="ag" min="6" max="100" value="${p.age || ''}"></label>
          <label>${L('Jins', 'Пол')}<select id="gd"><option value="">—</option><option value="m" ${p.gender === 'm' ? 'selected' : ''}>${L('Erkak', 'Мужской')}</option><option value="f" ${p.gender === 'f' ? 'selected' : ''}>${L('Ayol', 'Женский')}</option></select></label>
        </div>
        <label>${L('Guruh / fakultet / ish joyi', 'Группа / факультет / место работы')}<input type="text" id="gr" value="${esc(p.group || '')}"></label>
        <p id="pmsg" class="meta"></p>
        <div class="row-actions"><button class="btn" type="submit">${L('Saqlash', 'Сохранить')}</button><button class="btn secondary" type="button" id="out">${L('Chiqish', 'Выйти')}</button></div>
      </form>
    </div>
    <h2>${L('Mening natijalarim (bulutda)', 'Мои результаты (в облаке)')}</h2>
    <div id="myres"><p class="meta">${L('Yuklanmoqda…', 'Загрузка…')}</p></div>`;
  const $ = id => document.getElementById(id);
  if ($('ver')) $('ver').onclick = async () => {
    try { await sendEmailVerification(user); $('ver').textContent = L("Yuborildi — emailingizni tekshiring", 'Отправлено — проверьте почту'); $('ver').disabled = true; }
    catch (e) { $('pmsg').textContent = errText(e); }
  };
  $('out').onclick = async () => { await signOut(auth); location.hash = '#home'; };
  $('pf').onsubmit = async ev => {
    ev.preventDefault();
    const ageVal = Number($('ag').value);
    const upd = { email: user.email, name: $('nm').value.trim(), age: ageVal > 0 ? ageVal : null, gender: $('gd').value, group: $('gr').value.trim(), consent: true, updatedAt: serverTimestamp() };
    try { await setDoc(doc(db, 'users', user.uid), upd, { merge: true }); profile = { ...profile, ...upd }; $('pmsg').textContent = L('Saqlandi ✓', 'Сохранено ✓'); renderHeader(); }
    catch (e) { $('pmsg').textContent = errText(e); }
  };
  loadMyResults();
}

async function loadMyResults() {
  const box = document.getElementById('myres');
  if (!box || !user) return;
  let cloud = [];
  try {
    const snap = await getDocs(collection(db, 'users', user.uid, 'results'));
    cloud = snap.docs.map(d => d.data()).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  } catch (e) { box.innerHTML = `<p class="notice danger">${esc(errText(e))}</p>`; return; }
  const local = (typeof loadResults === 'function' ? loadResults() : []);
  const have = new Set(cloud.map(r => r.date));
  const missing = local.filter(r => r.date && !have.has(r.date));
  const rows = cloud.map(r => ({ r, d: describe(r) })).filter(x => x.d);
  box.innerHTML = `
    ${missing.length ? `<div class="notice warn">${esc(L(`Bu brauzerda profilga hali qo'shilmagan ${missing.length} ta natija bor.`, `В этом браузере есть ${missing.length} результат(ов), ещё не добавленных в профиль.`))} <button class="btn sm" id="sync">${L("Profilga qo'shish", 'Добавить в профиль')}</button></div>` : ''}
    ${rows.length ? `<div class="row-actions"><button class="btn secondary" id="mycsv">${t('exportCsv')}</button></div>
      <table><tr><th>${t('date')}</th><th>${t('test')}</th><th>${t('result')}</th><th>${t('interpretation')}</th></tr>
      ${rows.map(({ r, d }) => `<tr><td>${esc(fmtDate(r.date))}</td><td>${esc(d.name)}</td><td>${esc(d.result)}</td><td>${esc(d.note)}</td></tr>`).join('')}</table>`
      : `<p class="lead">${esc(L("Hali bulutda natijalar yo'q. Test yoki tajribani boshlang — natija avtomatik saqlanadi.", 'В облаке пока нет результатов. Пройдите тест или эксперимент — результат сохранится автоматически.'))}</p>`}`;
  const sync = document.getElementById('sync');
  if (sync) sync.onclick = async () => {
    sync.disabled = true;
    for (const r of missing) { try { await addDoc(collection(db, 'users', user.uid, 'results'), JSON.parse(JSON.stringify(r))); } catch (e) { /* ignore */ } }
    loadMyResults();
  };
  const csvBtn = document.getElementById('mycsv');
  if (csvBtn) csvBtn.onclick = () => downloadCsv('psixolab-mening-natijalarim.csv',
    [[t('date'), t('test'), t('result'), t('interpretation')]].concat(rows.map(({ r, d }) => [r.date, d.name, d.result, d.note])));
}

function downloadCsv(name, rows) {
  const q = s => '"' + String(s === undefined || s === null ? '' : s).replace(/"/g, '""') + '"';
  const csv = rows.map(r => r.map(q).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name; a.click();
}

/* ---------- Admin paneli ---------- */
async function viewAdmin() {
  if (!authReady) { app.innerHTML = `<p class="lead">${L('Yuklanmoqda…', 'Загрузка…')}</p>`; return; }
  if (!isAdmin()) {
    app.innerHTML = `<h1>${L('Admin panel', 'Админ-панель')}</h1><div class="notice danger">${esc(L("Bu sahifa faqat sayt administratori uchun. Admin email bilan kiring va emailni tasdiqlang.", 'Эта страница только для администратора сайта. Войдите с email администратора и подтвердите его.'))}</div>`;
    return;
  }
  app.innerHTML = `<h1>${L('Admin panel', 'Админ-панель')}</h1><p class="lead">${L('Yuklanmoqda…', 'Загрузка…')}</p>`;
  let users = {}, results = [];
  try {
    const us = await getDocs(collection(db, 'users'));
    us.forEach(d => { users[d.id] = d.data(); });
    const rs = await getDocs(collectionGroup(db, 'results'));
    results = rs.docs.map(d => ({ uid: d.ref.parent.parent.id, ...d.data() }));
  } catch (e) {
    app.innerHTML = `<h1>${L('Admin panel', 'Админ-панель')}</h1><div class="notice danger">${esc(errText(e))}</div>`;
    return;
  }
  results.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const rows = results.map(r => ({ r, u: users[r.uid] || {}, d: describe(r) })).filter(x => x.d);
  const ids = [...new Set(rows.map(x => x.r.id))];
  const draw = filter => {
    const list = filter ? rows.filter(x => x.r.id === filter) : rows;
    document.getElementById('atable').innerHTML = list.length ? `
      <table><tr><th>${t('date')}</th><th>${L('Foydalanuvchi', 'Пользователь')}</th><th>${L('Yosh / jins', 'Возраст / пол')}</th><th>${L('Guruh', 'Группа')}</th><th>${t('test')}</th><th>${t('result')}</th><th>${t('interpretation')}</th></tr>
      ${list.map(({ r, u, d }) => `<tr><td>${esc(fmtDate(r.date))}</td><td>${esc(u.name || '')}<br><span class="meta">${esc(u.email || r.uid)}</span></td><td>${esc([u.age || '', genderLabel(u.gender)].filter(Boolean).join(', '))}</td><td>${esc(u.group || '')}</td><td>${esc(d.name)}</td><td>${esc(d.result)}</td><td>${esc(d.note)}</td></tr>`).join('')}</table>`
      : `<p class="lead">${L("Natijalar yo'q.", 'Нет результатов.')}</p>`;
  };
  app.innerHTML = `
    <h1>${L('Admin panel', 'Админ-панель')}</h1>
    <div class="grid">
      <div class="card"><h3>${Object.keys(users).length}</h3><p>${L("Ro'yxatdan o'tganlar", 'Зарегистрировано')}</p></div>
      <div class="card"><h3>${rows.length}</h3><p>${L('Jami natijalar', 'Всего результатов')}</p></div>
      <div class="card"><h3>${new Set(rows.map(x => x.r.uid)).size}</h3><p>${L('Test topshirganlar', 'Прошли тесты')}</p></div>
    </div>
    <div class="row-actions">
      <select id="flt" class="adm-sel"><option value="">${L('Barcha testlar', 'Все тесты')}</option>${ids.map(id => { const x = rows.find(y => y.r.id === id); return `<option value="${esc(id)}">${esc(x.d.name)}</option>`; }).join('')}</select>
      <button class="btn" id="acsv">${L('Hammasini CSV yuklab olish', 'Скачать всё в CSV')}</button>
      <button class="btn secondary" id="ucsv">${L('Foydalanuvchilar ro\'yxati (CSV)', 'Список пользователей (CSV)')}</button>
    </div>
    <div id="atable"></div>`;
  draw('');
  document.getElementById('flt').onchange = e => draw(e.target.value);
  document.getElementById('acsv').onclick = () => {
    const f = document.getElementById('flt').value;
    const list = f ? rows.filter(x => x.r.id === f) : rows;
    const skip = new Set(['uid', 'type', 'id', 'date']);
    downloadCsv('psixolab-barcha-natijalar.csv',
      [['date', 'uid', 'email', 'name', 'age', 'gender', 'group', 'type', 'test_id', 'test_name', 'result', 'interpretation', 'raw_data']].concat(
        list.map(({ r, u, d }) => [r.date, r.uid, u.email, u.name, u.age, u.gender, u.group, r.type, r.id, d.name, d.result, d.note,
          Object.entries(r).filter(([k]) => !skip.has(k)).map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`).join('; ')])));
  };
  document.getElementById('ucsv').onclick = () => downloadCsv('psixolab-foydalanuvchilar.csv',
    [['uid', 'email', 'name', 'age', 'gender', 'group', 'results_count']].concat(
      Object.entries(users).map(([uid, u]) => [uid, u.email, u.name, u.age, u.gender, u.group, rows.filter(x => x.r.uid === uid).length])));
}

/* ---------- Dizayn ---------- */
const style = document.createElement('style');
style.textContent = `
.acct-btn{color:#fff;text-decoration:none;font-weight:600;padding:.3rem .8rem;border:1px solid rgba(255,255,255,.35);border-radius:999px;background:rgba(255,255,255,.1);white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis}
.acct-btn:hover{background:rgba(255,255,255,.2)}
.auth{max-width:520px;margin:0 auto;gap:.7rem}
.auth label{display:flex;flex-direction:column;gap:.25rem;font-weight:600;font-size:.92rem;color:var(--text)}
.auth input[type=email],.auth input[type=password],.auth input[type=text],.auth input[type=number],.auth select,.adm-sel{font-size:1rem;padding:.6rem .75rem;border-radius:10px;border:1px solid var(--border);text-align:left;letter-spacing:normal;font-family:inherit;background:#fff;color:var(--text);width:100%}
.adm-sel{width:auto}
.auth .chk{flex-direction:row;align-items:flex-start;gap:.5rem;font-weight:400}
.auth .chk input{margin-top:.25rem}
.auth form{display:flex;flex-direction:column;gap:.7rem}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
.auth-tabs{display:flex;gap:.5rem;margin-bottom:.3rem}
.auth-tabs a{flex:1;text-align:center;padding:.5rem;border-radius:10px;text-decoration:none;background:var(--accent-soft);color:#4c1d95 !important;font-weight:600}
.auth-tabs a.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff !important}
.badge{display:inline-block;font-size:.8rem;padding:.1rem .5rem;border-radius:999px;background:#fee2e2;color:#991b1b}
.badge.ok{background:#dcfce7;color:#166534}
.btn.sm{padding:.3rem .7rem;font-size:.85rem}
@media (max-width:640px){.acct-btn{order:2;max-width:130px;font-size:.85rem}}`;
document.head.appendChild(style);

/* ---------- Marshrut ---------- */
const _prevRoute = route;
window.removeEventListener('hashchange', _prevRoute);
route = function () {
  _prevRoute();
  renderHeader();
  const pg = page();
  if (pg === 'login') viewLogin('login');
  else if (pg === 'register') viewLogin('register');
  else if (pg === 'profile') viewProfile();
  else if (pg === 'admin') viewAdmin();
  else return;
  window.scrollTo(0, 0);
};
window.addEventListener('hashchange', route);

onAuthStateChanged(auth, async u => {
  user = u; profile = null;
  if (u) {
    try { const s = await getDoc(doc(db, 'users', u.uid)); profile = s.exists() ? s.data() : null; } catch (e) { profile = null; }
  }
  authReady = true;
  renderHeader();
  if (['login', 'register', 'profile', 'admin'].includes(page())) route();
});
route();
