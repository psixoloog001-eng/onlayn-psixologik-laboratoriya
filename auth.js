/* PsixoLab — Profil tizimi (Firebase): kirish, bulutda natijalar, psixolog kabineti, guruh kodlari, PDF hisobot, admin paneli */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendEmailVerification, sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, collectionGroup,
  query, where, serverTimestamp
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
let user = null, profile = null, authReady = false, psychDoc = null, psychReq = null;

const L = (uz, ru) => (lang === 'ru' ? ru : uz);
const isAdmin = () => !!user && user.email === ADMIN_EMAIL && user.emailVerified;
const isPsych = () => !!user && (!!psychDoc || isAdmin());
const page = () => (location.hash || '#home').slice(1).split('/')[0];
const arg = () => decodeURIComponent((location.hash || '').slice(1).split('/')[1] || '');
const $ = id => document.getElementById(id);
const toDate = v => (v && typeof v.toDate === 'function' ? v.toDate() : (v ? new Date(v) : null));
const fmtDate = d => { const x = toDate(d); return x && !isNaN(x) ? x.toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ') : ''; };
const fmtDay = d => { const x = toDate(d); return x && !isNaN(x) ? x.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ') : ''; };
const genderLabel = g => (g === 'm' ? L('Erkak', 'Мужской') : g === 'f' ? L('Ayol', 'Женский') : '');
const clean = r => JSON.parse(JSON.stringify(r));
const loading = () => `<p class="lead">${L('Yuklanmoqda…', 'Загрузка…')}</p>`;
const siteUrl = () => location.origin + location.pathname;

/* Natijadagi xavf belgisi: 'crisis' (o'z-o'ziga zarar haqida fikr), 'high' (mutaxassis tavsiya etiladigan daraja) */
function riskOf(r) {
  if (!r || r.type !== 'test') return '';
  if (r.crisis) return 'crisis';
  const ts = TESTS[r.id];
  if (ts && ts.bands && ts.bands[r.band] && ts.bands[r.band][2]) return 'high';
  return '';
}
const riskBadge = k => k === 'crisis' ? `<span class="badge">${L('Shoshilinch e\'tibor', 'Срочное внимание')}</span>`
  : k === 'high' ? `<span class="badge warn">${L('Mutaxassis tavsiya etiladi', 'Рекомендован специалист')}</span>` : '';

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

function downloadCsv(name, rows) {
  const q = s => '"' + String(s === undefined || s === null ? '' : s).replace(/"/g, '""') + '"';
  const csv = rows.map(r => r.map(q).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name; a.click();
}
const rawData = r => Object.entries(r).filter(([k]) => !['uid', 'type', 'id', 'date'].includes(k))
  .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`).join('; ');

/* ---------- Sarlavha: kirish tugmasi, Kabinet va Admin havolalari ---------- */
const top = document.querySelector('.top');
const acct = document.createElement('a');
acct.className = 'acct-btn';
top.insertBefore(acct, document.querySelector('.lang'));
function navLink(href, text, show) {
  const nav = document.querySelector('nav');
  let a = nav.querySelector(`a[href="${href}"]`);
  if (show && !a) { a = document.createElement('a'); a.href = href; nav.appendChild(a); }
  if (!show && a) { a.remove(); a = null; }
  if (a) a.textContent = text;
}
function renderHeader() {
  if (user) {
    acct.href = '#profile';
    acct.textContent = '👤 ' + ((profile && profile.name) || user.email.split('@')[0]);
  } else {
    acct.href = '#login';
    acct.textContent = L('Kirish', 'Войти');
  }
  navLink('#cabinet', L('Psixolog kabineti', 'Кабинет психолога'), isPsych());
  navLink('#admin', L('Admin panel', 'Админ-панель'), isAdmin());
}

/* ---------- Natijalarni saqlash: shaxsiy bulut + guruh ---------- */
const _prevSave = saveResult;
saveResult = function (r) {
  _prevSave(r);
  if (!user) return;
  const data = clean(r);
  addDoc(collection(db, 'users', user.uid, 'results'), data).catch(e => console.warn('PsixoLab: natija saqlanmadi', e));
  if (profile && profile.groupCode) {
    addDoc(collection(db, 'groups', profile.groupCode, 'results'), { uid: user.uid, ...data })
      .catch(e => console.warn('PsixoLab: guruhga yuborilmadi', e));
  }
};

/* ---------- Kirish / ro'yxatdan o'tish ---------- */
function viewLogin(mode) {
  const reg = mode === 'register';
  const pending = sessionStorage.getItem('pl-join');
  app.innerHTML = `
    <h1>${reg ? L("Ro'yxatdan o'tish", 'Регистрация') : L('Kirish', 'Вход')}</h1>
    <p class="lead">${esc(L("Profil orqali natijalaringiz bulutda saqlanadi va istalgan qurilmadan ko'rishingiz mumkin.", 'С профилем ваши результаты сохраняются в облаке и доступны с любого устройства.'))}</p>
    ${pending ? `<div class="notice warn">${esc(L(`Guruhga (${pending}) qo'shilish uchun avval kiring yoki ro'yxatdan o'ting.`, `Чтобы присоединиться к группе (${pending}), сначала войдите или зарегистрируйтесь.`))}</div>` : ''}
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
      const pj = sessionStorage.getItem('pl-join');
      location.hash = pj ? '#join/' + pj : '#profile';
    } catch (e) {
      showErr(e.code === 'x' ? e.message : errText(e));
      $('asub').disabled = false;
    }
  };
}

/* ---------- Profil ---------- */
async function viewProfile() {
  if (!authReady) { app.innerHTML = loading(); return; }
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

    <h2>${L('Psixolog guruhi', 'Группа психолога')}</h2>
    <div class="card auth" id="grpbox">${groupBoxHtml()}</div>

    <h2>${L('Mening natijalarim (bulutda)', 'Мои результаты (в облаке)')}</h2>
    <div id="myres"><p class="meta">${L('Yuklanmoqda…', 'Загрузка…')}</p></div>

    ${isPsych() ? '' : `<h2>${L('Siz psixologmisiz?', 'Вы психолог?')}</h2><div class="card auth" id="psybox">${psychBoxHtml()}</div>`}`;
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
  bindGroupBox();
  bindPsychBox();
  loadMyResults();
}

function groupBoxHtml() {
  const p = profile || {};
  if (p.groupCode) return `
    <p>${esc(L('Siz quyidagi guruh a\'zosisiz:', 'Вы состоите в группе:'))} <strong>${esc(p.groupName || p.groupCode)}</strong> <span class="code">${esc(p.groupCode)}</span></p>
    <p class="meta">${esc(L("Shu guruhga qo'shilganingizdan keyingi natijalaringiz guruh psixologiga ham yuboriladi.", 'Ваши результаты после вступления также отправляются психологу группы.'))}</p>
    <label class="chk"><input type="checkbox" id="delg"> ${esc(L('Chiqishda guruhga yuborilgan natijalarimni ham o\'chirish', 'При выходе удалить и отправленные в группу результаты'))}</label>
    <div class="row-actions"><button class="btn secondary" id="leave">${L('Guruhdan chiqish', 'Выйти из группы')}</button></div>
    <p id="gmsg" class="meta"></p>`;
  return `
    <p class="meta">${esc(L("Agar psixologingiz sizga guruh kodini bergan bo'lsa, shu yerga kiriting.", 'Если психолог дал вам код группы, введите его здесь.'))}</p>
    <div class="row-actions"><input type="text" id="gcode" class="code-in" maxlength="12" placeholder="ABC123"><button class="btn" id="gjoin">${L("Qo'shilish", 'Вступить')}</button></div>
    <p id="gmsg" class="meta"></p>`;
}
function bindGroupBox() {
  if ($('gjoin')) $('gjoin').onclick = () => {
    const c = $('gcode').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length < 5) { $('gmsg').textContent = L("Kod noto'g'ri.", 'Неверный код.'); return; }
    location.hash = '#join/' + c;
  };
  if ($('leave')) $('leave').onclick = async () => {
    const code = profile.groupCode;
    $('leave').disabled = true;
    try {
      if ($('delg').checked) {
        const s = await getDocs(query(collection(db, 'groups', code, 'results'), where('uid', '==', user.uid)));
        for (const d of s.docs) await deleteDoc(d.ref);
      }
      try { await deleteDoc(doc(db, 'groups', code, 'members', user.uid)); } catch (e) { /* guruh o'chirilgan bo'lishi mumkin */ }
      const upd = { groupCode: null, groupName: null, groupJoinedAt: null, updatedAt: serverTimestamp() };
      await setDoc(doc(db, 'users', user.uid), upd, { merge: true });
      profile = { ...profile, ...upd };
      $('grpbox').innerHTML = groupBoxHtml(); bindGroupBox();
    } catch (e) { $('gmsg').textContent = errText(e); $('leave').disabled = false; }
  };
}

function psychBoxHtml() {
  if (psychReq) return `<p>${esc(L("Psixolog maqomi uchun arizangiz ko'rib chiqilmoqda. Tasdiqlangach, menyuda \"Psixolog kabineti\" paydo bo'ladi.", 'Ваша заявка на статус психолога рассматривается. После одобрения в меню появится «Кабинет психолога».'))}</p>
    <p class="meta">${esc(psychReq.org || '')} · ${esc(fmtDay(psychReq.createdAt))}</p>
    <div class="row-actions"><button class="btn secondary sm" id="preqdel">${L('Arizani bekor qilish', 'Отменить заявку')}</button></div>`;
  return `
    <p class="meta">${esc(L("Psixolog kabineti orqali guruh yaratasiz, mijoz yoki talabalaringizga kod berasiz va ularning natijalarini bir joyda ko'rasiz. Ariza administrator tomonidan tasdiqlanadi.", 'В кабинете психолога вы создаёте группы, раздаёте код клиентам или студентам и видите их результаты в одном месте. Заявку одобряет администратор.'))}</p>
    <details><summary class="btn secondary sm">${L('Ariza topshirish', 'Подать заявку')}</summary>
    <form id="psf" class="auth" style="margin-top:.8rem">
      <label>${L('F.I.Sh.', 'Ф.И.О.')}<input type="text" id="ps_nm" required value="${esc((profile && profile.name) || '')}"></label>
      <label>${L('Tashkilot (universitet, maktab, markaz)', 'Организация (вуз, школа, центр)')}<input type="text" id="ps_org" required></label>
      <label>${L('Lavozim / mutaxassislik', 'Должность / специальность')}<input type="text" id="ps_pos"></label>
      <label>${L('Telefon (ixtiyoriy)', 'Телефон (необязательно)')}<input type="text" id="ps_ph"></label>
      <label>${L('Izoh: nima uchun kerak (ixtiyoriy)', 'Комментарий: для чего нужен (необязательно)')}<input type="text" id="ps_note"></label>
      <button class="btn" type="submit">${L('Yuborish', 'Отправить')}</button>
      <p id="psmsg" class="meta"></p>
    </form></details>`;
}
function bindPsychBox() {
  if ($('psf')) $('psf').onsubmit = async ev => {
    ev.preventDefault();
    if (!$('ps_nm').value.trim() || !$('ps_org').value.trim()) { $('psmsg').textContent = L("F.I.Sh. va tashkilotni yozing.", 'Укажите Ф.И.О. и организацию.'); return; }
    const d = { email: user.email, name: $('ps_nm').value.trim(), org: $('ps_org').value.trim(), position: $('ps_pos').value.trim(), phone: $('ps_ph').value.trim(), note: $('ps_note').value.trim(), createdAt: serverTimestamp() };
    try { await setDoc(doc(db, 'psychRequests', user.uid), d); psychReq = { ...d, createdAt: new Date() }; $('psybox').innerHTML = psychBoxHtml(); bindPsychBox(); }
    catch (e) { $('psmsg').textContent = errText(e); }
  };
  if ($('preqdel')) $('preqdel').onclick = async () => {
    try { await deleteDoc(doc(db, 'psychRequests', user.uid)); psychReq = null; $('psybox').innerHTML = psychBoxHtml(); bindPsychBox(); } catch (e) { /* ignore */ }
  };
}

async function fetchMyCloud() {
  const snap = await getDocs(collection(db, 'users', user.uid, 'results'));
  return snap.docs.map(d => d.data()).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

async function loadMyResults() {
  const box = $('myres');
  if (!box || !user) return;
  let cloud = [];
  try { cloud = await fetchMyCloud(); }
  catch (e) { box.innerHTML = `<p class="notice danger">${esc(errText(e))}</p>`; return; }
  const local = (typeof loadResults === 'function' ? loadResults() : []);
  const have = new Set(cloud.map(r => r.date));
  const missing = local.filter(r => r.date && !have.has(r.date));
  const rows = cloud.map(r => ({ r, d: describe(r) })).filter(x => x.d);
  box.innerHTML = `
    ${missing.length ? `<div class="notice warn">${esc(L(`Bu brauzerda profilga hali qo'shilmagan ${missing.length} ta natija bor.`, `В этом браузере есть ${missing.length} результат(ов), ещё не добавленных в профиль.`))} <button class="btn sm" id="sync">${L("Profilga qo'shish", 'Добавить в профиль')}</button></div>` : ''}
    ${rows.length ? `<div class="row-actions"><a class="btn" href="#report">${L('PDF hisobot', 'PDF-отчёт')}</a><button class="btn secondary" id="mycsv">${t('exportCsv')}</button></div>
      <table><tr><th>${t('date')}</th><th>${t('test')}</th><th>${t('result')}</th><th>${t('interpretation')}</th></tr>
      ${rows.map(({ r, d }) => `<tr><td>${esc(fmtDate(r.date))}</td><td>${esc(d.name)}</td><td>${esc(d.result)}</td><td>${esc(d.note)}</td></tr>`).join('')}</table>`
      : `<p class="lead">${esc(L("Hali bulutda natijalar yo'q. Test yoki tajribani boshlang — natija avtomatik saqlanadi.", 'В облаке пока нет результатов. Пройдите тест или эксперимент — результат сохранится автоматически.'))}</p>`}`;
  const sync = $('sync');
  if (sync) sync.onclick = async () => {
    sync.disabled = true;
    for (const r of missing) { try { await addDoc(collection(db, 'users', user.uid, 'results'), clean(r)); } catch (e) { /* ignore */ } }
    loadMyResults();
  };
  if ($('mycsv')) $('mycsv').onclick = () => downloadCsv('psixolab-mening-natijalarim.csv',
    [[t('date'), t('test'), t('result'), t('interpretation')]].concat(rows.map(({ r, d }) => [r.date, d.name, d.result, d.note])));
}

/* ---------- Guruhga qo'shilish: #join/KOD ---------- */
async function viewJoin() {
  const code = arg().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!authReady) { app.innerHTML = loading(); return; }
  if (!user) { sessionStorage.setItem('pl-join', code); return viewLogin('register'); }
  sessionStorage.removeItem('pl-join');
  app.innerHTML = `<h1>${L("Guruhga qo'shilish", 'Вступление в группу')}</h1>${loading()}`;
  let g = null;
  try { const s = await getDoc(doc(db, 'groups', code)); g = s.exists() ? s.data() : null; } catch (e) { g = null; }
  if (!g || !g.active) {
    app.innerHTML = `<h1>${L("Guruhga qo'shilish", 'Вступление в группу')}</h1><div class="notice danger">${esc(L(`"${code}" kodli faol guruh topilmadi. Kodni psixologingizdan qayta so'rang.`, `Активная группа с кодом «${code}» не найдена. Уточните код у психолога.`))}</div><p><a class="btn secondary" href="#profile">${L('Profilga qaytish', 'В профиль')}</a></p>`;
    return;
  }
  const already = profile && profile.groupCode === code;
  app.innerHTML = `
    <h1>${L("Guruhga qo'shilish", 'Вступление в группу')}</h1>
    <div class="card auth">
      <h2>${esc(g.name)}</h2>
      <p><strong>${L('Psixolog', 'Психолог')}:</strong> ${esc(g.ownerName || '')}${g.org ? ' — ' + esc(g.org) : ''}</p>
      <p><strong>${L('Kod', 'Код')}:</strong> <span class="code">${esc(code)}</span></p>
      ${already ? `<div class="notice warn">${L("Siz allaqachon shu guruhdasiz.", 'Вы уже в этой группе.')}</div>` : `
      <div class="notice warn">${esc(g.anonymous
        ? L("Bu anonim guruh: psixolog natijalaringizni ko'radi, lekin ismingiz va emailingizni ko'rmaydi (faqat yosh va jins).", 'Это анонимная группа: психолог видит ваши результаты, но не видит имя и email (только возраст и пол).')
        : L("Qo'shilsangiz, shu psixolog ismingiz, emailingiz, yosh va jinsingizni hamda bundan keyingi test natijalaringizni ko'radi. Istalgan vaqtda profilingizdan guruhdan chiqishingiz mumkin.", 'После вступления психолог будет видеть ваше имя, email, возраст, пол и последующие результаты тестов. Выйти из группы можно в любой момент в профиле.'))}</div>
      ${profile && profile.groupCode ? `<p class="meta">${esc(L(`Hozirgi guruhingiz (${profile.groupCode}) o'rniga shu guruh tanlanadi.`, `Эта группа заменит текущую (${profile.groupCode}).`))}</p>` : ''}
      <label class="chk"><input type="checkbox" id="jprev"> ${esc(L('Avvalgi natijalarimni ham shu psixologga yuborish', 'Отправить психологу и мои прежние результаты'))}</label>
      <label class="chk"><input type="checkbox" id="jok"> ${esc(L('Roziman', 'Я согласен(на)'))}</label>
      <div class="row-actions"><button class="btn" id="jbtn">${L("Qo'shilish", 'Вступить')}</button><a class="btn secondary" href="#profile">${L('Bekor qilish', 'Отмена')}</a></div>
      <p id="jmsg" class="meta"></p>`}
    </div>`;
  if (!$('jbtn')) return;
  $('jbtn').onclick = async () => {
    if (!$('jok').checked) { $('jmsg').textContent = L("Rozilik belgisini qo'ying.", 'Отметьте согласие.'); return; }
    $('jbtn').disabled = true;
    try {
      const p = profile || {};
      if (p.groupCode && p.groupCode !== code) { try { await deleteDoc(doc(db, 'groups', p.groupCode, 'members', user.uid)); } catch (e) { /* ignore */ } }
      const m = g.anonymous ? { age: p.age || null, gender: p.gender || '', joinedAt: serverTimestamp() }
        : { name: p.name || '', email: user.email, age: p.age || null, gender: p.gender || '', group: p.group || '', joinedAt: serverTimestamp() };
      await setDoc(doc(db, 'groups', code, 'members', user.uid), m);
      const upd = { groupCode: code, groupName: g.name, groupJoinedAt: serverTimestamp(), updatedAt: serverTimestamp() };
      await setDoc(doc(db, 'users', user.uid), upd, { merge: true });
      profile = { ...p, ...upd };
      if ($('jprev').checked) {
        const prev = await fetchMyCloud();
        for (const r of prev) { try { await addDoc(collection(db, 'groups', code, 'results'), { uid: user.uid, ...clean(r) }); } catch (e) { /* ignore */ } }
      }
      location.hash = '#profile';
    } catch (e) { $('jmsg').textContent = errText(e); $('jbtn').disabled = false; }
  };
}

/* ---------- Shaxsiy PDF hisobot: #report ---------- */
async function viewReport() {
  if (!authReady) { app.innerHTML = loading(); return; }
  app.innerHTML = loading();
  let list = [];
  try { list = user ? await fetchMyCloud() : (typeof loadResults === 'function' ? loadResults().slice().reverse() : []); }
  catch (e) { app.innerHTML = `<div class="notice danger">${esc(errText(e))}</div>`; return; }
  const p = profile || {};
  const rows = list.map(r => ({ r, d: describe(r), k: riskOf(r) })).filter(x => x.d);
  const info = [p.name, p.age ? p.age + ' ' + L('yosh', 'лет') : '', genderLabel(p.gender), p.group].filter(Boolean).join(' · ');
  app.innerHTML = `
    <div class="row-actions no-print"><button class="btn" id="prn">${L('PDF sifatida saqlash / chop etish', 'Сохранить как PDF / печать')}</button><a class="btn secondary" href="${user ? '#profile' : '#results'}">${L('Orqaga', 'Назад')}</a></div>
    <p class="meta no-print">${esc(L('Chop etish oynasida "Printer" o\'rniga "PDF sifatida saqlash"ni tanlang.', 'В окне печати выберите «Сохранить как PDF» вместо принтера.'))}</p>
    <div class="card report">
      <div class="rep-head"><div><h2>PsixoLab — ${L('shaxsiy hisobot', 'личный отчёт')}</h2><p class="meta">${esc(info)}${user ? ' · ' + esc(user.email) : ''}</p></div><p class="meta">${esc(fmtDay(new Date()))}</p></div>
      ${rows.length ? `<table><tr><th>${t('date')}</th><th>${t('test')}</th><th>${t('result')}</th><th>${t('interpretation')}</th></tr>
        ${rows.map(({ r, d, k }) => `<tr><td>${esc(fmtDate(r.date))}</td><td>${esc(d.name)}</td><td>${esc(d.result)}</td><td>${esc(d.note)} ${riskBadge(k)}</td></tr>`).join('')}</table>`
        : `<p>${L("Natijalar yo'q.", 'Нет результатов.')}</p>`}
      ${rows.some(x => x.k) ? `<p class="notice warn">${esc(L("Belgilangan natijalar bo'yicha psixolog yoki shifokor bilan maslahatlashish tavsiya etiladi.", 'По отмеченным результатам рекомендуется консультация психолога или врача.'))}</p>` : ''}
      <p class="meta">${esc(L("Bu hisobot skrining natijalaridan iborat va tibbiy tashxis hisoblanmaydi. Yakuniy xulosani faqat mutaxassis beradi.", 'Отчёт содержит результаты скрининга и не является медицинским диагнозом. Окончательное заключение даёт только специалист.'))}</p>
    </div>`;
  $('prn').onclick = () => window.print();
}

/* ---------- Psixolog kabineti: #cabinet va #cabinet/KOD ---------- */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => CODE_CHARS[b % CODE_CHARS.length]).join('');

async function viewCabinet() {
  if (!authReady) { app.innerHTML = loading(); return; }
  if (!isPsych()) {
    app.innerHTML = `<h1>${L('Psixolog kabineti', 'Кабинет психолога')}</h1><div class="notice warn">${esc(L("Bu bo'lim tasdiqlangan psixologlar uchun. Profilingizdagi \"Siz psixologmisiz?\" bo'limidan ariza topshiring.", 'Раздел для одобренных психологов. Подайте заявку в профиле в блоке «Вы психолог?».'))}</div><p><a class="btn" href="${user ? '#profile' : '#login'}">${user ? L('Profilga', 'В профиль') : L('Kirish', 'Войти')}</a></p>`;
    return;
  }
  const code = arg();
  if (code) return viewGroup(code);
  app.innerHTML = `<h1>${L('Psixolog kabineti', 'Кабинет психолога')}</h1>${loading()}`;
  let groups = [];
  try {
    const s = await getDocs(query(collection(db, 'groups'), where('ownerUid', '==', user.uid)));
    groups = s.docs.map(d => d.data()).sort((a, b) => (toDate(b.createdAt) || 0) - (toDate(a.createdAt) || 0));
  } catch (e) { app.innerHTML = `<h1>${L('Psixolog kabineti', 'Кабинет психолога')}</h1><div class="notice danger">${esc(errText(e))}</div>`; return; }
  app.innerHTML = `
    <h1>${L('Psixolog kabineti', 'Кабинет психолога')}</h1>
    <p class="lead">${esc(L("Guruh yarating va kodni mijoz yoki talabalaringizga bering. Ular kod bilan qo'shilgach, natijalari shu yerda ko'rinadi.", 'Создайте группу и раздайте код клиентам или студентам. После вступления их результаты появятся здесь.'))}</p>
    <div class="card auth">
      <h2>${L('Yangi guruh', 'Новая группа')}</h2>
      <form id="gf">
        <label>${L('Guruh nomi', 'Название группы')}<input type="text" id="g_nm" required placeholder="${L('Masalan: Psixologiya 2-kurs, 2026', 'Например: Психология 2 курс, 2026')}"></label>
        <label>${L('Tashkilot (ixtiyoriy)', 'Организация (необязательно)')}<input type="text" id="g_org" value="${esc((psychDoc && psychDoc.org) || '')}"></label>
        <label class="chk"><input type="checkbox" id="g_anon"> ${esc(L("Anonim guruh: ishtirokchilarning ismi va emaili sizga ko'rinmaydi (so'rovnomalar va HR uchun qulay).", 'Анонимная группа: имена и email участников вам не видны (удобно для опросов и HR).'))}</label>
        <button class="btn" type="submit">${L('Guruh yaratish', 'Создать группу')}</button>
        <p id="gfmsg" class="meta"></p>
      </form>
    </div>
    <h2>${L('Mening guruhlarim', 'Мои группы')}</h2>
    ${groups.length ? `<div class="grid">${groups.map(g => `
      <a class="card glink" href="#cabinet/${esc(g.code)}">
        <h3>${esc(g.name)}</h3>
        <p><span class="code">${esc(g.code)}</span> ${g.anonymous ? `<span class="badge ok">${L('anonim', 'анонимно')}</span>` : ''} ${g.active ? '' : `<span class="badge">${L('yopilgan', 'закрыта')}</span>`}</p>
        <p class="meta">${esc(g.org || '')} ${esc(fmtDay(g.createdAt))}</p>
      </a>`).join('')}</div>` : `<p class="lead">${L("Hali guruh yo'q.", 'Групп пока нет.')}</p>`}`;
  $('gf').onsubmit = async ev => {
    ev.preventDefault();
    const name = $('g_nm').value.trim();
    if (!name) { $('gfmsg').textContent = L('Guruh nomini yozing.', 'Укажите название группы.'); return; }
    const ownerName = (psychDoc && psychDoc.name) || (profile && profile.name) || user.email;
    for (let i = 0; i < 5; i++) {
      const code = newCode();
      try {
        const ex = await getDoc(doc(db, 'groups', code));
        if (ex.exists()) continue;
        await setDoc(doc(db, 'groups', code), { code, name, org: $('g_org').value.trim(), ownerUid: user.uid, ownerName, ownerEmail: user.email, anonymous: $('g_anon').checked, active: true, createdAt: serverTimestamp() });
        location.hash = '#cabinet/' + code;
        return;
      } catch (e) { $('gfmsg').textContent = errText(e); return; }
    }
  };
}

async function viewGroup(code) {
  app.innerHTML = `<h1>${L('Guruh', 'Группа')} ${esc(code)}</h1>${loading()}`;
  let g, members = {}, results = [];
  try {
    const gs = await getDoc(doc(db, 'groups', code));
    if (!gs.exists() || gs.data().ownerUid !== user.uid) throw { code: 'permission-denied' };
    g = gs.data();
    (await getDocs(collection(db, 'groups', code, 'members'))).forEach(d => { members[d.id] = d.data(); });
    results = (await getDocs(collection(db, 'groups', code, 'results'))).docs.map(d => d.data());
  } catch (e) { app.innerHTML = `<h1>${L('Guruh', 'Группа')}</h1><div class="notice danger">${esc(errText(e))}</div><p><a class="btn secondary" href="#cabinet">${L('Kabinetga', 'В кабинет')}</a></p>`; return; }
  results.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const uids = [...new Set(Object.keys(members).concat(results.map(r => r.uid)))];
  const label = {};
  uids.forEach((u, i) => { const m = members[u] || {}; label[u] = g.anonymous ? `${L('Ishtirokchi', 'Участник')} #${i + 1}` : (m.name || m.email || `${L('Ishtirokchi', 'Участник')} #${i + 1}`); });
  const rows = results.map(r => ({ r, d: describe(r), k: riskOf(r), m: members[r.uid] || {} })).filter(x => x.d);
  const flagged = rows.filter(x => x.k);
  // Testlar bo'yicha umumiy ko'rinish
  const byTest = {};
  rows.forEach(x => {
    const b = byTest[x.r.id] || (byTest[x.r.id] = { name: x.d.name, n: 0, people: new Set(), sum: 0, cnt: 0, notes: {} });
    b.n++; b.people.add(x.r.uid);
    const v = x.r.type === 'test' ? x.r.score : x.r.value;
    if (typeof v === 'number') { b.sum += v; b.cnt++; }
    if (x.r.type === 'test' && x.d.note) b.notes[x.d.note] = (b.notes[x.d.note] || 0) + 1;
  });
  const link = `${siteUrl()}#join/${code}`;
  app.innerHTML = `
    <p class="no-print"><a href="#cabinet">← ${L('Kabinet', 'Кабинет')}</a></p>
    <h1>${esc(g.name)}</h1>
    <div class="card">
      <p><strong>${L('Kod', 'Код')}:</strong> <span class="code big">${esc(code)}</span> ${g.anonymous ? `<span class="badge ok">${L('anonim guruh', 'анонимная группа')}</span>` : ''} ${g.active ? `<span class="badge ok">${L('ochiq', 'открыта')}</span>` : `<span class="badge">${L('yopilgan', 'закрыта')}</span>`}</p>
      <p class="no-print"><strong>${L('Taklif havolasi', 'Ссылка-приглашение')}:</strong> <input type="text" readonly id="lnk" class="code-in wide" value="${esc(link)}"></p>
      <div class="row-actions no-print">
        <button class="btn" id="cp">${L('Havolani nusxalash', 'Копировать ссылку')}</button>
        <button class="btn secondary" id="tg">${L('Guruhni', 'Группу')} ${g.active ? L('yopish', 'закрыть') : L('ochish', 'открыть')}</button>
        <button class="btn secondary" id="gcsv">CSV</button>
        <button class="btn secondary" id="gpdf">${L('PDF hisobot', 'PDF-отчёт')}</button>
      </div>
      <p class="meta">${esc(g.org || '')} · ${esc(fmtDay(new Date()))}</p>
    </div>
    <div class="grid">
      <div class="card"><h3>${uids.length}</h3><p>${L("A'zolar", 'Участники')}</p></div>
      <div class="card"><h3>${rows.length}</h3><p>${L('Natijalar', 'Результаты')}</p></div>
      <div class="card"><h3>${new Set(flagged.map(x => x.r.uid)).size}</h3><p>${L("E'tibor talab qiladi", 'Требуют внимания')}</p></div>
    </div>
    ${flagged.length ? `<h2>${L("E'tibor talab qiladigan natijalar", 'Результаты, требующие внимания')}</h2>
      <table><tr><th>${L('Ishtirokchi', 'Участник')}</th><th>${t('test')}</th><th>${t('result')}</th><th>${t('interpretation')}</th><th>${t('date')}</th></tr>
      ${flagged.map(x => `<tr><td>${esc(label[x.r.uid])}</td><td>${esc(x.d.name)}</td><td>${esc(x.d.result)}</td><td>${esc(x.d.note)} ${riskBadge(x.k)}</td><td>${esc(fmtDay(x.r.date))}</td></tr>`).join('')}</table>` : ''}
    <h2>${L("Testlar bo'yicha umumiy ko'rinish", 'Сводка по методикам')}</h2>
    ${Object.keys(byTest).length ? `<table><tr><th>${t('test')}</th><th>${L('Ishtirokchilar', 'Участников')}</th><th>${L('Natijalar', 'Результатов')}</th><th>${L("O'rtacha", 'Среднее')}</th><th>${L('Taqsimot', 'Распределение')}</th></tr>
      ${Object.values(byTest).map(b => `<tr><td>${esc(b.name)}</td><td>${b.people.size}</td><td>${b.n}</td><td>${b.cnt ? Math.round(b.sum / b.cnt * 10) / 10 : '—'}</td><td>${Object.entries(b.notes).map(([k, v]) => `${esc(k)}: <strong>${v}</strong>`).join('<br>') || '—'}</td></tr>`).join('')}</table>`
      : `<p class="lead">${esc(L("Hali natijalar yo'q. Havolani ishtirokchilarga yuboring.", 'Результатов пока нет. Отправьте ссылку участникам.'))}</p>`}
    <h2>${L("A'zolar", 'Участники')}</h2>
    ${uids.length ? `<table><tr><th>${L('Ishtirokchi', 'Участник')}</th>${g.anonymous ? '' : '<th>Email</th>'}<th>${L('Yosh / jins', 'Возраст / пол')}</th><th>${L('Natijalar', 'Результатов')}</th><th>${L("Qo'shilgan", 'Вступил')}</th><th class="no-print"></th></tr>
      ${uids.map(u => { const m = members[u] || {}; return `<tr><td>${esc(label[u])}${members[u] ? '' : ` <span class="meta">(${L('chiqib ketgan', 'вышел')})</span>`}</td>${g.anonymous ? '' : `<td>${esc(m.email || '')}</td>`}<td>${esc([m.age || '', genderLabel(m.gender)].filter(Boolean).join(', '))}</td><td>${rows.filter(x => x.r.uid === u).length}</td><td>${esc(fmtDay(m.joinedAt))}</td><td class="no-print"><button class="btn secondary sm" data-show="${esc(u)}">${L("Ko'rish", 'Открыть')}</button></td></tr>`; }).join('')}</table>` : ''}
    <div id="mdetail"></div>`;
  $('cp').onclick = async () => { try { await navigator.clipboard.writeText(link); } catch (e) { $('lnk').select(); document.execCommand('copy'); } $('cp').textContent = L('Nusxalandi ✓', 'Скопировано ✓'); };
  $('tg').onclick = async () => { try { await setDoc(doc(db, 'groups', code), { active: !g.active }, { merge: true }); viewGroup(code); } catch (e) { alertBox(errText(e)); } };
  $('gpdf').onclick = () => window.print();
  $('gcsv').onclick = () => downloadCsv(`psixolab-guruh-${code}.csv`,
    [['date', 'participant', 'email', 'age', 'gender', 'test_id', 'test_name', 'result', 'interpretation', 'flag', 'raw_data']].concat(
      rows.map(x => [x.r.date, label[x.r.uid], g.anonymous ? '' : (x.m.email || ''), x.m.age || '', x.m.gender || '', x.r.id, x.d.name, x.d.result, x.d.note, x.k, rawData(x.r)])));
  app.querySelectorAll('[data-show]').forEach(b => b.onclick = () => {
    const u = b.dataset.show;
    const mine = rows.filter(x => x.r.uid === u);
    $('mdetail').innerHTML = `<h2>${esc(label[u])}</h2>${mine.length ? `<table><tr><th>${t('date')}</th><th>${t('test')}</th><th>${t('result')}</th><th>${t('interpretation')}</th></tr>
      ${mine.map(x => `<tr><td>${esc(fmtDate(x.r.date))}</td><td>${esc(x.d.name)}</td><td>${esc(x.d.result)}</td><td>${esc(x.d.note)} ${riskBadge(x.k)}</td></tr>`).join('')}</table>` : `<p class="lead">${L("Natijalar yo'q.", 'Нет результатов.')}</p>`}`;
    $('mdetail').scrollIntoView({ behavior: 'smooth' });
  });
}
function alertBox(m) { const p = document.createElement('p'); p.className = 'notice danger'; p.textContent = m; app.prepend(p); }

/* ---------- Admin paneli ---------- */
async function viewAdmin() {
  if (!authReady) { app.innerHTML = loading(); return; }
  if (!isAdmin()) {
    app.innerHTML = `<h1>${L('Admin panel', 'Админ-панель')}</h1><div class="notice danger">${esc(L("Bu sahifa faqat sayt administratori uchun. Admin email bilan kiring va emailni tasdiqlang.", 'Эта страница только для администратора сайта. Войдите с email администратора и подтвердите его.'))}</div>`;
    return;
  }
  app.innerHTML = `<h1>${L('Admin panel', 'Админ-панель')}</h1>${loading()}`;
  let users = {}, results = [], reqs = [], psychs = [];
  try {
    (await getDocs(collection(db, 'users'))).forEach(d => { users[d.id] = d.data(); });
    const rs = await getDocs(collectionGroup(db, 'results'));
    // faqat shaxsiy natijalar (users/{uid}/results); guruh nusxalari ikki marta sanalmasin
    results = rs.docs.filter(d => d.ref.parent.parent && d.ref.parent.parent.parent.id === 'users')
      .map(d => ({ uid: d.ref.parent.parent.id, ...d.data() }));
    reqs = (await getDocs(collection(db, 'psychRequests'))).docs.map(d => ({ uid: d.id, ...d.data() }));
    psychs = (await getDocs(collection(db, 'psychologists'))).docs.map(d => ({ uid: d.id, ...d.data() }));
  } catch (e) {
    app.innerHTML = `<h1>${L('Admin panel', 'Админ-панель')}</h1><div class="notice danger">${esc(errText(e))}</div>`;
    return;
  }
  results.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const rows = results.map(r => ({ r, u: users[r.uid] || {}, d: describe(r) })).filter(x => x.d);
  const ids = [...new Set(rows.map(x => x.r.id))];
  const draw = filter => {
    const list = filter ? rows.filter(x => x.r.id === filter) : rows;
    $('atable').innerHTML = list.length ? `
      <table><tr><th>${t('date')}</th><th>${L('Foydalanuvchi', 'Пользователь')}</th><th>${L('Yosh / jins', 'Возраст / пол')}</th><th>${L('Guruh', 'Группа')}</th><th>${t('test')}</th><th>${t('result')}</th><th>${t('interpretation')}</th></tr>
      ${list.map(({ r, u, d }) => `<tr><td>${esc(fmtDate(r.date))}</td><td>${esc(u.name || '')}<br><span class="meta">${esc(u.email || r.uid)}</span></td><td>${esc([u.age || '', genderLabel(u.gender)].filter(Boolean).join(', '))}</td><td>${esc(u.group || '')}</td><td>${esc(d.name)}</td><td>${esc(d.result)}</td><td>${esc(d.note)} ${riskBadge(riskOf(r))}</td></tr>`).join('')}</table>`
      : `<p class="lead">${L("Natijalar yo'q.", 'Нет результатов.')}</p>`;
  };
  app.innerHTML = `
    <h1>${L('Admin panel', 'Админ-панель')}</h1>
    <div class="grid">
      <div class="card"><h3>${Object.keys(users).length}</h3><p>${L("Ro'yxatdan o'tganlar", 'Зарегистрировано')}</p></div>
      <div class="card"><h3>${rows.length}</h3><p>${L('Jami natijalar', 'Всего результатов')}</p></div>
      <div class="card"><h3>${new Set(rows.map(x => x.r.uid)).size}</h3><p>${L('Test topshirganlar', 'Прошли тесты')}</p></div>
      <div class="card"><h3>${psychs.length}</h3><p>${L('Psixologlar', 'Психологи')}</p></div>
    </div>

    <h2>${L('Psixolog arizalari', 'Заявки психологов')} ${reqs.length ? `<span class="badge">${reqs.length}</span>` : ''}</h2>
    ${reqs.length ? `<table><tr><th>${L('F.I.Sh.', 'Ф.И.О.')}</th><th>Email</th><th>${L('Tashkilot / lavozim', 'Организация / должность')}</th><th>${L('Telefon', 'Телефон')}</th><th>${L('Izoh', 'Комментарий')}</th><th></th></tr>
      ${reqs.map(q => `<tr><td>${esc(q.name)}</td><td>${esc(q.email)}</td><td>${esc(q.org)}<br><span class="meta">${esc(q.position || '')}</span></td><td>${esc(q.phone || '')}</td><td>${esc(q.note || '')}</td>
        <td><button class="btn sm" data-ok="${esc(q.uid)}">${L('Tasdiqlash', 'Одобрить')}</button> <button class="btn secondary sm" data-no="${esc(q.uid)}">${L('Rad etish', 'Отклонить')}</button></td></tr>`).join('')}</table>`
      : `<p class="meta">${L("Yangi arizalar yo'q.", 'Новых заявок нет.')}</p>`}

    <h2>${L('Tasdiqlangan psixologlar', 'Одобренные психологи')}</h2>
    ${psychs.length ? `<table><tr><th>${L('F.I.Sh.', 'Ф.И.О.')}</th><th>Email</th><th>${L('Tashkilot', 'Организация')}</th><th>${L('Sana', 'Дата')}</th><th></th></tr>
      ${psychs.map(q => `<tr><td>${esc(q.name)}</td><td>${esc(q.email)}</td><td>${esc(q.org || '')}</td><td>${esc(fmtDay(q.approvedAt))}</td><td><button class="btn secondary sm" data-rm="${esc(q.uid)}">${L('Huquqni olish', 'Отозвать')}</button></td></tr>`).join('')}</table>`
      : `<p class="meta">${L("Hali yo'q. Siz admin sifatida kabinetdan o'zingiz ham foydalana olasiz.", 'Пока нет. Как администратор вы и сами можете пользоваться кабинетом.')}</p>`}

    <h2>${L('Barcha natijalar', 'Все результаты')}</h2>
    <div class="row-actions">
      <select id="flt" class="adm-sel"><option value="">${L('Barcha testlar', 'Все тесты')}</option>${ids.map(id => { const x = rows.find(y => y.r.id === id); return `<option value="${esc(id)}">${esc(x.d.name)}</option>`; }).join('')}</select>
      <button class="btn" id="acsv">${L('Hammasini CSV yuklab olish', 'Скачать всё в CSV')}</button>
      <button class="btn secondary" id="ucsv">${L("Foydalanuvchilar ro'yxati (CSV)", 'Список пользователей (CSV)')}</button>
    </div>
    <div id="atable"></div>`;
  draw('');
  $('flt').onchange = e => draw(e.target.value);
  $('acsv').onclick = () => {
    const f = $('flt').value;
    const list = f ? rows.filter(x => x.r.id === f) : rows;
    downloadCsv('psixolab-barcha-natijalar.csv',
      [['date', 'uid', 'email', 'name', 'age', 'gender', 'group', 'type', 'test_id', 'test_name', 'result', 'interpretation', 'flag', 'raw_data']].concat(
        list.map(({ r, u, d }) => [r.date, r.uid, u.email, u.name, u.age, u.gender, u.group, r.type, r.id, d.name, d.result, d.note, riskOf(r), rawData(r)])));
  };
  $('ucsv').onclick = () => downloadCsv('psixolab-foydalanuvchilar.csv',
    [['uid', 'email', 'name', 'age', 'gender', 'group', 'group_code', 'results_count']].concat(
      Object.entries(users).map(([uid, u]) => [uid, u.email, u.name, u.age, u.gender, u.group, u.groupCode || '', rows.filter(x => x.r.uid === uid).length])));
  app.querySelectorAll('[data-ok]').forEach(b => b.onclick = async () => {
    const q = reqs.find(x => x.uid === b.dataset.ok);
    b.disabled = true;
    try {
      await setDoc(doc(db, 'psychologists', q.uid), { email: q.email, name: q.name, org: q.org || '', position: q.position || '', approvedAt: serverTimestamp() });
      await deleteDoc(doc(db, 'psychRequests', q.uid));
      viewAdmin();
    } catch (e) { alertBox(errText(e)); b.disabled = false; }
  });
  app.querySelectorAll('[data-no]').forEach(b => b.onclick = async () => {
    b.disabled = true;
    try { await deleteDoc(doc(db, 'psychRequests', b.dataset.no)); viewAdmin(); } catch (e) { alertBox(errText(e)); b.disabled = false; }
  });
  app.querySelectorAll('[data-rm]').forEach(b => b.onclick = async () => {
    b.disabled = true;
    try { await deleteDoc(doc(db, 'psychologists', b.dataset.rm)); viewAdmin(); } catch (e) { alertBox(errText(e)); b.disabled = false; }
  });
}

/* ---------- Dizayn ---------- */
const style = document.createElement('style');
style.textContent = `
.acct-btn{color:#fff;text-decoration:none;font-weight:600;padding:.3rem .8rem;border:1px solid rgba(255,255,255,.35);border-radius:999px;background:rgba(255,255,255,.1);white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis}
.acct-btn:hover{background:rgba(255,255,255,.2)}
.auth{max-width:560px;margin:0 auto;gap:.7rem}
.auth label{display:flex;flex-direction:column;gap:.25rem;font-weight:600;font-size:.92rem;color:var(--text)}
.auth input[type=email],.auth input[type=password],.auth input[type=text],.auth input[type=number],.auth select,.adm-sel,.code-in{font-size:1rem;padding:.6rem .75rem;border-radius:10px;border:1px solid var(--border);text-align:left;letter-spacing:normal;font-family:inherit;background:#fff;color:var(--text);width:100%}
.adm-sel{width:auto}
.code-in{width:auto;min-width:9rem;text-transform:uppercase;letter-spacing:.12em;font-weight:700}
.code-in.wide{width:100%;text-transform:none;letter-spacing:normal;font-weight:400;font-size:.9rem}
.code{font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;letter-spacing:.12em;background:var(--accent-soft);color:#4c1d95;padding:.1rem .45rem;border-radius:6px}
.code.big{font-size:1.3rem}
.auth .chk{flex-direction:row;align-items:flex-start;gap:.5rem;font-weight:400}
.auth .chk input{margin-top:.25rem}
.auth form,form.auth{display:flex;flex-direction:column;gap:.7rem}
.auth details summary{list-style:none;display:inline-block;cursor:pointer}
.auth details summary::-webkit-details-marker{display:none}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
.auth-tabs{display:flex;gap:.5rem;margin-bottom:.3rem}
.auth-tabs a{flex:1;text-align:center;padding:.5rem;border-radius:10px;text-decoration:none;background:var(--accent-soft);color:#4c1d95 !important;font-weight:600}
.auth-tabs a.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff !important}
.badge{display:inline-block;font-size:.78rem;padding:.1rem .5rem;border-radius:999px;background:#fee2e2;color:#991b1b;font-weight:600;white-space:nowrap}
.badge.ok{background:#dcfce7;color:#166534}
.badge.warn{background:#fef3c7;color:#92400e}
.btn.sm{padding:.3rem .7rem;font-size:.85rem}
a.btn{text-decoration:none;display:inline-block}
.glink{text-decoration:none;color:var(--text)}
.glink h3{margin:.1rem 0 .4rem}
.report{color:var(--text)}
.rep-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;border-bottom:2px solid var(--border);margin-bottom:.8rem}
.rep-head h2{margin:0}
@media (max-width:640px){.acct-btn{order:2;max-width:130px;font-size:.85rem}.row2{grid-template-columns:1fr}}
@media print{
  header,nav,footer,.no-print,.row-actions,.acct-btn{display:none !important}
  html::before,body::before,body::after{display:none !important}
  html,body{background:#fff !important;animation:none !important}
  main,main *{color:#000 !important;text-shadow:none !important}
  main h1{-webkit-text-fill-color:#000 !important;background:none !important}
  .card{box-shadow:none !important;border:1px solid #ccc !important;background:#fff !important;break-inside:avoid}
  table{font-size:10pt}
  .badge{border:1px solid #999}
}`;
document.head.appendChild(style);

/* ---------- Marshrut ---------- */
const VIEWS = { login: () => viewLogin('login'), register: () => viewLogin('register'), profile: viewProfile, admin: viewAdmin, join: viewJoin, report: viewReport, cabinet: viewCabinet };
const _prevRoute = route;
window.removeEventListener('hashchange', _prevRoute);
route = function () {
  _prevRoute();
  renderHeader();
  const pg = page();
  if (VIEWS[pg]) { VIEWS[pg](); window.scrollTo(0, 0); return; }
  if (pg === 'results') {
    // "Natijalarim" sahifasiga PDF hisobot tugmasi
    const ra = app.querySelector('.row-actions');
    if (ra && !ra.querySelector('.pdf-btn')) {
      const a = document.createElement('a'); a.className = 'btn secondary pdf-btn'; a.href = '#report'; a.textContent = L('PDF hisobot', 'PDF-отчёт');
      ra.appendChild(a);
    }
  }
};
window.addEventListener('hashchange', route);

onAuthStateChanged(auth, async u => {
  user = u; profile = null; psychDoc = null; psychReq = null;
  if (u) {
    try { const s = await getDoc(doc(db, 'users', u.uid)); profile = s.exists() ? s.data() : null; } catch (e) { profile = null; }
    try { const s = await getDoc(doc(db, 'psychologists', u.uid)); psychDoc = s.exists() ? s.data() : null; } catch (e) { psychDoc = null; }
    if (!psychDoc) { try { const s = await getDoc(doc(db, 'psychRequests', u.uid)); psychReq = s.exists() ? s.data() : null; } catch (e) { psychReq = null; } }
  }
  authReady = true;
  renderHeader();
  if (VIEWS[page()]) route();
});
route();
