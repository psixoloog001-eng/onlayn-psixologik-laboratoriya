/* PsixoLab — Rivojlanish xaritasi, kunlik vazifalar va ularning ijrosini tekshirish */
// Profil tizimi hozircha o'chirilgan: barcha ma'lumot faqat brauzerda saqlanadi.
// Qayta yoqish uchun index.html ga auth.js ni qaytaring va bu yerda Firebase importlarini tiklang.
const doc = () => null, setDoc = async () => {}, updateDoc = async () => {}, getDoc = async () => ({ exists: () => false }),
  collection = () => null, getDocs = async () => ({ docs: [] }), db = null;
let user = null, groupCode = null, cloudResults = null;
const L = (uz, ru) => (lang === 'ru' ? ru : uz);
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (k, n) => { const [y, m, d] = k.split('-').map(Number); return dayKey(new Date(y, m - 1, d + n)); };
const page = () => (location.hash || '#home').slice(1).split('/')[0] || 'home';

/* ---------- Yo'nalishlar va vazifalar katalogi ---------- */
const DIRS = {
  attention: { icon: '🎯', uz: 'Diqqat', ru: 'Внимание' },
  memory: { icon: '🧠', uz: 'Xotira', ru: 'Память' },
  executive: { icon: '🧩', uz: 'Fikrlash va rejalashtirish', ru: 'Мышление и планирование' },
  stress: { icon: '🌿', uz: 'Stressni boshqarish', ru: 'Управление стрессом' },
  mood: { icon: '☀️', uz: 'Kayfiyat', ru: 'Настроение' },
  self: { icon: '💪', uz: "O'ziga ishonch", ru: 'Уверенность в себе' }
};
const COG = ['attention', 'memory', 'executive'];
const XP = { exp: 20, test: 15, timer: 15, ground: 15, journal: 15, check: 10 };
const PH = () => ({
  box: [[L('Nafas oling', 'Вдох'), 4, 1.35], [L('Ushlab turing', 'Задержка'), 4, 1.35], [L('Nafas chiqaring', 'Выдох'), 4, 1], [L('Ushlab turing', 'Задержка'), 4, 1]],
  count: [[L('Nafas oling', 'Вдох'), 4, 1.35], [L('Chiqaring va sanang', 'Выдох и счёт'), 6, 1]],
  pmr: [[L('Mushaklarni 5 soniya qattiq tarang qiling', 'Напрягите мышцы на 5 секунд'), 5, 1.2], [L("Bo'shating va farqni his qiling", 'Расслабьте и почувствуйте разницу'), 25, 1]]
});
const ex = (id, dir, target) => ({ id, dir, kind: 'exp', target });
const TASKS = [
  ex('a_schulte', 'attention', 'schulte'), ex('a_stroop', 'attention', 'stroop'), ex('a_flanker', 'attention', 'flanker'), ex('a_rt', 'attention', 'rt'),
  { id: 'a_breath', dir: 'attention', kind: 'timer', min: 5, ph: 'count', uz: 'Nafasni sanash mashqi', ru: 'Счёт дыхания',
    duz: "Ko'zingizni yumib, har bir nafas chiqarishni 1 dan 10 gacha sanang. Adashsangiz — 1 dan qayta boshlang.", dru: 'Закройте глаза и считайте каждый выдох от 1 до 10. Сбились — начните с 1.' },
  ex('m_span', 'memory', 'span'), ex('m_corsi', 'memory', 'corsi'), ex('m_nback', 'memory', 'nback'), ex('m_words', 'memory', 'words'),
  ex('e_trail', 'executive', 'trail'), ex('e_hanoi', 'executive', 'hanoi'), ex('e_gonogo', 'executive', 'gonogo'),
  { id: 's_box', dir: 'stress', kind: 'timer', min: 4, ph: 'box', uz: '"Kvadrat" nafas', ru: '«Квадратное» дыхание',
    duz: 'Doira bilan birga: 4 soniya nafas oling, 4 ushlang, 4 chiqaring, 4 ushlang.', dru: 'Вместе с кругом: 4 секунды вдох, 4 задержка, 4 выдох, 4 задержка.' },
  { id: 's_pmr', dir: 'stress', kind: 'timer', min: 6, ph: 'pmr', uz: 'Mushaklarni bosqichma-bosqich bo\'shashtirish', ru: 'Прогрессивная мышечная релаксация',
    duz: "Har bosqichda bitta mushak guruhini (qo'llar, yelka, yuz, qorin, oyoqlar) navbat bilan tarang qilib, keyin bo'shating.", dru: 'На каждом шаге напрягайте и расслабляйте по очереди одну группу мышц (руки, плечи, лицо, живот, ноги).' },
  { id: 's_ground', dir: 'stress', kind: 'ground', uz: '5-4-3-2-1 mashqi', ru: 'Упражнение 5-4-3-2-1',
    duz: "Hozir atrofingizda ko'rayotgan, his qilayotgan, eshitayotgan narsalarni yozing — bu xavotirni pasaytiradi.", dru: 'Запишите, что вы сейчас видите, ощущаете, слышите — это снижает тревогу.' },
  { id: 's_journal', dir: 'stress', kind: 'journal', uz: 'Stress kundaligi', ru: 'Дневник стресса',
    duz: 'Bugun sizni nima bezovta qildi? Qanday fikr keldi va qanday javob berdingiz? Keyingi safar nimani boshqacha qilasiz?', dru: 'Что сегодня вас беспокоило? Какая была мысль и как вы отреагировали? Что сделаете иначе в следующий раз?' },
  { id: 's_walk', dir: 'stress', kind: 'check', uz: 'Harakat: 20 daqiqa', ru: 'Движение: 20 минут',
    duz: "Kamida 20 daqiqa sayr qiling yoki jismoniy mashq bajaring.", dru: 'Погуляйте или сделайте зарядку не менее 20 минут.' },
  { id: 'md_grat', dir: 'mood', kind: 'journal', uz: '3 ta yaxshi narsa', ru: '3 хороших события',
    duz: "Bugun bo'lgan 3 ta yaxshi narsani va ular nima sababdan bo'lganini yozing.", dru: 'Запишите 3 хороших события сегодняшнего дня и почему они произошли.' },
  { id: 'md_act', dir: 'mood', kind: 'check', uz: 'Yoqimli faoliyat', ru: 'Приятное занятие',
    duz: "O'zingizga yoqadigan bitta ishni rejalashtirib, bugun bajaring (kitob, musiqa, hunar, sport…).", dru: 'Запланируйте и сделайте сегодня одно приятное дело (книга, музыка, хобби, спорт…).' },
  { id: 'md_call', dir: 'mood', kind: 'check', uz: 'Yaqinlar bilan aloqa', ru: 'Связь с близкими',
    duz: "Yaqin odamingiz bilan qo'ng'iroq yoki uchrashuvda kamida 10 daqiqa gaplashing.", dru: 'Поговорите с близким человеком хотя бы 10 минут — по телефону или вживую.' },
  { id: 'md_box', dir: 'mood', kind: 'timer', min: 3, ph: 'box', uz: 'Tinchlantiruvchi nafas', ru: 'Успокаивающее дыхание',
    duz: 'Uch daqiqa "kvadrat" nafas: 4-4-4-4.', dru: 'Три минуты «квадратного» дыхания: 4-4-4-4.' },
  { id: 'sf_wins', dir: 'self', kind: 'journal', uz: 'Bugungi yutuqlarim', ru: 'Мои сегодняшние успехи',
    duz: "Bugun uddalagan 3 ta ishingizni yozing — kichik bo'lsa ham. Har birida o'zingizning qaysi fazilatingiz yordam berdi?", dru: 'Запишите 3 дела, которые вам сегодня удались, даже маленькие. Какое ваше качество помогло в каждом?' },
  { id: 'sf_letter', dir: 'self', kind: 'journal', uz: "O'zimga do'stona xat", ru: 'Дружеское письмо себе',
    duz: "Yaqin do'stingizga gapiradigandek o'zingizga 3-4 jumla qo'llab-quvvatlovchi xat yozing.", dru: 'Напишите себе 3–4 поддерживающих предложения так, как сказали бы близкому другу.' },
  { id: 'sf_goal', dir: 'self', kind: 'check', uz: 'Kichik maqsad', ru: 'Маленькая цель',
    duz: "Bugun uchun aniq va kichik bitta maqsad qo'ying va uni bajaring.", dru: 'Поставьте на сегодня одну конкретную маленькую цель и выполните её.' },
  { id: 'w_phq9', dir: 'mood', kind: 'test', target: 'phq9', weekly: true },
  { id: 'w_gad7', dir: 'stress', kind: 'test', target: 'gad7', weekly: true },
  { id: 'w_pss10', dir: 'stress', kind: 'test', target: 'pss10', weekly: true },
  { id: 'w_ros', dir: 'self', kind: 'test', target: 'rosenberg', weekly: true }
];
const TMAP = Object.fromEntries(TASKS.map(x => [x.id, x]));
const expName = id => { const e = EXPERIMENTS.find(x => x.id === id); return e ? t(e.title) : id; };
const title = x => x.kind === 'exp' ? expName(x.target) : x.kind === 'test' ? (TESTS[x.target] ? TESTS[x.target].name[lang] : x.target) : x[lang] || x.uz;
const descr = x => x.kind === 'exp' ? L("Tajribani o'tkazing — natija saqlangach vazifa avtomatik tekshiriladi.", 'Пройдите эксперимент — после сохранения результата задание засчитается автоматически.')
  : x.kind === 'test' ? L("Haftalik nazorat testi: holatingiz dinamikasini kuzatish uchun.", 'Еженедельный контрольный тест: чтобы отслеживать динамику состояния.')
  : (lang === 'ru' ? x.dru : x.duz);

/* ---------- Holat (localStorage + bulut) ---------- */
let state = { goals: [], days: {} };
const lkey = () => 'psixolab-plan' + (user ? ':' + user.uid : '');
function loadLocal(k) { try { return JSON.parse(localStorage.getItem(k || lkey())) || null; } catch (e) { return null; } }
function save() {
  try { localStorage.setItem(lkey(), JSON.stringify(state)); } catch (e) { /* ignore */ }
  if (user) setDoc(doc(db, 'users', user.uid, 'plan', 'main'), { goals: state.goals, days: state.days, updatedAt: Date.now() }).catch(e => console.warn('PsixoLab plan', e));
}
function syncGroup() {
  if (!user || !groupCode) return;
  const s = stats();
  updateDoc(doc(db, 'groups', groupCode, 'members', user.uid), { activity: { xp: s.xp, streak: s.streak, lastDay: s.lastDay, done7: s.done7, total7: s.total7, goals: state.goals, at: Date.now() } }).catch(() => {});
}

/* Sanaga bog'liq tasodifiy (bir kunda o'zgarmaydigan) tanlov */
function rng(seedStr) { let h = 1779033703 ^ seedStr.length; for (let i = 0; i < seedStr.length; i++) { h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
function doneRecently(id, k, n) { for (let i = 1; i <= n; i++) { const d = state.days[addDays(k, -i)]; if (d && d.tasks.some(x => x.id === id && x.done)) return true; } return false; }
function allResults() { return cloudResults || (typeof loadResults === 'function' ? loadResults() : []); }
function genDay(k) {
  const r = rng((user ? user.uid : 'local') + k);
  const g = state.goals, cog = g.filter(x => COG.includes(x)), emo = g.filter(x => !COG.includes(x));
  const chosen = [];
  const pick = dirs => {
    let pool = TASKS.filter(x => !x.weekly && dirs.includes(x.dir) && !chosen.includes(x.id));
    const fresh = pool.filter(x => !doneRecently(x.id, k, 1));
    if (fresh.length) pool = fresh;
    if (pool.length) chosen.push(pool[Math.floor(r() * pool.length)].id);
  };
  pick(cog.length ? cog : emo); pick(emo.length ? emo : cog); pick(g);
  const tasks = chosen.map(id => ({ id, done: false }));
  // Haftalik nazorat testi (7 kunda bir marta)
  const since = addDays(k, -6);
  const due = TASKS.filter(x => x.weekly && g.includes(x.dir)).find(x =>
    !allResults().some(res => res.id === x.target && String(res.date).slice(0, 10) >= since) && !doneRecently(x.id, k, 6));
  if (due) tasks.push({ id: due.id, done: false, bonus: true });
  return { tasks };
}
function today() {
  const k = dayKey();
  if (!state.goals.length) return null;
  if (!state.days[k]) { state.days[k] = genDay(k); save(); }
  return state.days[k];
}
function complete(id, verified, text) {
  const d = today(); if (!d) return;
  const task = d.tasks.find(x => x.id === id);
  if (!task || task.done) return;
  task.done = true; task.at = Date.now(); task.ver = !!verified;
  if (text) task.text = text;
  save(); syncGroup();
  toast(`✓ ${title(TMAP[id])} · +${XP[TMAP[id].kind]} XP`);
}

/* ---------- Statistika ---------- */
function stats() {
  const xpDir = {}; let xp = 0, lastDay = '';
  for (const [k, d] of Object.entries(state.days)) for (const x of d.tasks) if (x.done && TMAP[x.id]) {
    const v = XP[TMAP[x.id].kind]; xp += v; xpDir[TMAP[x.id].dir] = (xpDir[TMAP[x.id].dir] || 0) + v; if (k > lastDay) lastDay = k;
  }
  const cnt = k => { const d = state.days[k]; return d ? d.tasks.filter(x => x.done).length : 0; };
  const k0 = dayKey();
  let s = 0, k = cnt(k0) >= 2 ? k0 : addDays(k0, -1);
  while (cnt(k) >= 2) { s++; k = addDays(k, -1); }
  let done7 = 0, total7 = 0;
  for (let i = 0; i < 7; i++) { const d = state.days[addDays(k0, -i)]; if (d) { total7 += d.tasks.filter(x => !x.bonus).length; done7 += d.tasks.filter(x => x.done && !x.bonus).length; } }
  return { xp, xpDir, streak: s, lastDay, done7, total7, level: Math.floor(xp / 150) + 1, cnt };
}

/* Natijalar dinamikasi uchun ko'rsatkichlar: [id, yaxshilanish yo'nalishi (+1 o'sish yaxshi, -1 kamayish yaxshi)] */
const METRICS = [['schulte', -1], ['stroop', -1], ['flanker', -1], ['rt', -1], ['span', 1], ['corsi', 1], ['nback', 1], ['words', 1], ['trail', -1], ['hanoi', -1], ['gonogo', -1], ['phq9', -1], ['gad7', -1], ['pss10', -1], ['rosenberg', 1], ['logic', 1]];
function spark(vals) {
  const w = 120, h = 32, mn = Math.min(...vals), mx = Math.max(...vals), rg = mx - mn || 1;
  const pts = vals.map((v, i) => `${(vals.length === 1 ? w / 2 : i * w / (vals.length - 1)).toFixed(1)},${(h - 4 - (v - mn) / rg * (h - 8)).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" class="spark"><polyline points="${pts}" fill="none" stroke="#7c3aed" stroke-width="2"/>${vals.length ? `<circle cx="${pts.split(' ').pop().split(',')[0]}" cy="${pts.split(' ').pop().split(',')[1]}" r="3" fill="#7c3aed"/>` : ''}</svg>`;
}
function dynamicsHtml() {
  const res = allResults().slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const cards = METRICS.map(([id, dirn]) => {
    const list = res.filter(r => r.id === id).map(r => r.type === 'test' ? r.score : r.value).filter(v => typeof v === 'number');
    if (!list.length) return '';
    const first = list[0], last = list[list.length - 1], diff = Math.round((last - first) * 100) / 100;
    const better = list.length > 1 && diff !== 0 ? (diff * dirn > 0) : null;
    const nm = TESTS[id] ? TESTS[id].name[lang] : expName(id);
    return `<div class="card dyn"><div class="dyn-h">${esc(nm)}</div>${spark(list.slice(-12))}
      <div class="meta">${L('Oxirgi', 'Последний')}: <strong>${last}</strong> · ${list.length} ${L('marta', 'раз')}
      ${better === null ? '' : `<span class="badge ${better ? 'ok' : 'warn'}">${better ? '▲ ' + L('yaxshilandi', 'улучшение') : '▼ ' + L('pasaydi', 'снижение')}</span>`}</div></div>`;
  }).join('');
  return cards ? `<div class="grid">${cards}</div>` : `<p class="meta">${esc(L("Test va tajribalarni bajarganingiz sari bu yerda o'zgarish grafiklari paydo bo'ladi.", 'По мере выполнения тестов и экспериментов здесь появятся графики изменений.'))}</p>`;
}

/* ---------- Ko'rinishlar ---------- */
function suggest() {
  const res = allResults(), s = new Set();
  const last = id => res.filter(r => r.id === id).slice(-1)[0];
  const p = last('phq9'), g = last('gad7'), ps = last('pss10'), ro = last('rosenberg');
  if (p && p.band >= 2) s.add('mood');
  if ((g && g.band >= 2) || (ps && ps.band >= 1)) s.add('stress');
  if (ro && ro.band === 0) s.add('self');
  ['attention', 'memory', 'stress'].forEach(x => { if (s.size < 3) s.add(x); });
  return [...s];
}
function viewSetup() {
  const cur = state.goals.length ? state.goals : suggest();
  app.innerHTML = `
    <h1>${L('Rivojlanish xaritasi', 'Карта развития')}</h1>
    <p class="lead">${esc(L("2–4 ta yo'nalishni tanlang. Har kuni shu yo'nalishlar bo'yicha 3 ta qisqa vazifa beriladi (10–20 daqiqa). Belgilanganlar natijalaringiz asosida tavsiya qilingan.", 'Выберите 2–4 направления. Каждый день вы будете получать 3 коротких задания по ним (10–20 минут). Отмеченные рекомендованы по вашим результатам.'))}</p>
    <div class="grid">${Object.entries(DIRS).map(([k, d]) => `
      <label class="card dirpick"><input type="checkbox" value="${k}" ${cur.includes(k) ? 'checked' : ''}><span class="dir-ic">${d.icon}</span><strong>${esc(d[lang])}</strong></label>`).join('')}</div>
    <p id="smsg" class="notice warn" hidden></p>
    <div class="row-actions"><button class="btn" id="sgo">${state.goals.length ? L('Saqlash', 'Сохранить') : L('Xaritani yaratish', 'Создать карту')}</button>${state.goals.length ? `<a class="btn secondary" href="#plan">${L('Bekor qilish', 'Отмена')}</a>` : ''}</div>
    <p class="meta">${esc(L("Xaritangiz shu brauzerda saqlanadi.", 'Карта сохраняется в этом браузере.'))}</p>`;
  $('sgo').onclick = () => {
    const g = [...app.querySelectorAll('.dirpick input:checked')].map(x => x.value);
    if (g.length < 1 || g.length > 4) { $('smsg').textContent = L("1 tadan 4 tagacha yo'nalish tanlang.", 'Выберите от 1 до 4 направлений.'); $('smsg').hidden = false; return; }
    const changed = g.join() !== state.goals.join();
    state.goals = g;
    const k = dayKey();
    if (changed && state.days[k] && !state.days[k].tasks.some(x => x.done)) delete state.days[k];
    save(); syncGroup();
    location.hash = '#plan';
  };
}

function taskCard(x, i) {
  const T = TMAP[x.id]; if (!T) return '';
  const d = DIRS[T.dir];
  const st = x.done ? (x.ver ? `<span class="badge ok">✓ ${L('Tizim tekshirdi', 'Проверено системой')}</span>` : `<span class="badge ok">✓ ${L("O'zingiz belgiladingiz", 'Отмечено вами')}</span>`)
    : `<span class="badge warn">${L('Bajarilmagan', 'Не выполнено')}</span>`;
  let act = '';
  if (!x.done) {
    if (T.kind === 'exp') act = `<a class="btn" href="#exp/${T.target}">${L('Boshlash', 'Начать')}</a>`;
    else if (T.kind === 'test') act = `<a class="btn" href="#test/${T.target}">${L('Testni boshlash', 'Начать тест')}</a>`;
    else if (T.kind === 'timer') act = `<button class="btn" data-run="${i}">▶ ${L('Boshlash', 'Начать')} · ${T.min} ${L('daq', 'мин')}</button>`;
    else if (T.kind === 'ground') act = `<button class="btn" data-ground="${i}">${L('Boshlash', 'Начать')}</button>`;
    else if (T.kind === 'journal') act = `<button class="btn" data-journal="${i}">${L('Yozish', 'Написать')}</button>`;
    else act = `<button class="btn secondary" data-check="${i}">${L('Bajardim', 'Выполнено')}</button>`;
  }
  const how = { exp: L('avtomatik tekshiriladi', 'проверяется автоматически'), test: L('avtomatik tekshiriladi', 'проверяется автоматически'), timer: L('taymer tugagach hisoblanadi', 'засчитывается по окончании таймера'), ground: L("hamma maydonlar to'ldirilgach", 'после заполнения всех полей'), journal: L('kamida 80 belgi', 'не менее 80 символов'), check: L("o'zingiz belgilaysiz", 'отмечаете сами') }[T.kind];
  return `<div class="card task ${x.done ? 'done' : ''}" id="task${i}">
    <div class="task-top"><span class="dir-tag">${d.icon} ${esc(d[lang])}</span>${x.bonus ? `<span class="badge">${L('Haftalik', 'Еженедельно')}</span>` : ''}<span class="xp">+${XP[T.kind]} XP</span></div>
    <h3>${esc(title(T))}</h3><p>${esc(descr(T))}</p>
    <p class="meta">${esc(how)}</p>
    <div class="row-actions">${st}${act}</div><div class="task-body"></div></div>`;
}

function viewPlan() {
  if (!state.goals.length) return viewSetup();
  const d = today(), s = stats();
  const nd = d.tasks.filter(x => x.done).length;
  const cal = Array.from({ length: 28 }, (_, i) => { const k = addDays(dayKey(), i - 27); const c = s.cnt(k); return `<span class="cal c${Math.min(c, 3)}" title="${k}: ${c}"></span>`; }).join('');
  app.innerHTML = `
    <h1>${L('Rivojlanish xaritasi', 'Карта развития')}</h1>
    <div class="grid stats4">
      <div class="card"><h3>🔥 ${s.streak}</h3><p>${L('kunlik seriya', 'дней подряд')}</p></div>
      <div class="card"><h3>⭐ ${s.xp}</h3><p>XP · ${L('daraja', 'уровень')} ${s.level}</p></div>
      <div class="card"><h3>✅ ${nd}/${d.tasks.length}</h3><p>${L('bugun bajarildi', 'сделано сегодня')}</p></div>
      <div class="card"><h3>📅 ${s.total7 ? Math.round(s.done7 / s.total7 * 100) : 0}%</h3><p>${L('7 kunlik ijro', 'выполнение за 7 дней')}</p></div>
    </div>
    <h2>${L('Bugungi vazifalar', 'Задания на сегодня')}</h2>
    ${nd >= d.tasks.filter(x => !x.bonus).length ? `<div class="notice ok-box">🎉 ${esc(L("Bugungi asosiy vazifalar bajarildi! Ertaga yangi vazifalar beriladi.", 'Основные задания на сегодня выполнены! Завтра будут новые.'))}</div>` : ''}
    <div class="tasks">${d.tasks.map(taskCard).join('')}</div>
    <h2>${L("Yo'nalishlar bo'yicha yo'l", 'Путь по направлениям')}</h2>
    <div class="card">${state.goals.map(g => { const xp = s.xpDir[g] || 0, lv = Math.min(10, Math.floor(xp / 100) + 1); return `
      <div class="track"><div class="track-h"><span>${DIRS[g].icon} <strong>${esc(DIRS[g][lang])}</strong></span><span class="meta">${L('Daraja', 'Уровень')} ${lv}/10 · ${xp} XP</span></div>
      <div class="nodes">${Array.from({ length: 10 }, (_, i) => `<span class="node ${i < lv - 1 ? 'full' : i === lv - 1 ? 'cur' : ''}">${i + 1}</span>`).join('<i></i>')}</div>
      <div class="bar"><span style="width:${lv >= 10 ? 100 : xp % 100}%"></span></div></div>`; }).join('')}
      <p class="meta">${esc(L("Har 100 XP — keyingi daraja. Vazifalarni muntazam bajarib, har bir yo'nalishda 10-darajaga yeting.", 'Каждые 100 XP — новый уровень. Выполняйте задания регулярно и дойдите до 10-го уровня по каждому направлению.'))}</p></div>
    <h2>${L("Oxirgi 28 kun", 'Последние 28 дней')}</h2>
    <div class="card"><div class="calgrid">${cal}</div><p class="meta">${esc(L("Rang qanchalik to'q bo'lsa, o'sha kuni shuncha ko'p vazifa bajarilgan. Seriya — kamida 2 ta vazifa bajarilgan ketma-ket kunlar.", 'Чем темнее клетка, тем больше заданий выполнено в этот день. Серия — дни подряд, когда выполнено не менее 2 заданий.'))}</p></div>
    <h2>${L('Natijalar dinamikasi', 'Динамика результатов')}</h2>
    ${dynamicsHtml()}
    <div class="row-actions"><a class="btn secondary" href="#plan/setup">${L("Yo'nalishlarni o'zgartirish", 'Изменить направления')}</a></div>
    <p class="meta">${esc(L("Kundalik yozuvlaringiz faqat shu brauzerda saqlanadi va hech kimga yuborilmaydi.", 'Ваши записи хранятся только в этом браузере и никуда не отправляются.'))}</p>`;
  bindTasks(d);
}

function bindTasks(d) {
  const body = i => $('task' + i).querySelector('.task-body');
  app.querySelectorAll('[data-check]').forEach(b => b.onclick = () => {
    const i = +b.dataset.check;
    body(i).innerHTML = `<p>${esc(L("Rostdan ham bajardingizmi? Halollik — natijaning asosi.", 'Вы действительно выполнили? Честность — основа результата.'))}</p><div class="row-actions"><button class="btn" id="cy${i}">${L('Ha, bajardim', 'Да, выполнил(а)')}</button></div>`;
    $('cy' + i).onclick = () => { complete(d.tasks[i].id, false); viewPlan(); };
  });
  app.querySelectorAll('[data-journal]').forEach(b => b.onclick = () => {
    const i = +b.dataset.journal;
    body(i).innerHTML = `<textarea id="jt${i}" rows="5" class="jt" placeholder="${L('Shu yerga yozing…', 'Пишите здесь…')}"></textarea><p class="meta"><span id="jc${i}">0</span>/80 · ${esc(L("faqat sizga ko'rinadi", 'видно только вам'))}</p><button class="btn" id="js${i}" disabled>${L('Saqlash', 'Сохранить')}</button>`;
    const ta = $('jt' + i);
    ta.oninput = () => { const n = ta.value.trim().length; $('jc' + i).textContent = n; $('js' + i).disabled = n < 80; };
    $('js' + i).onclick = () => { complete(d.tasks[i].id, true, ta.value.trim().slice(0, 3000)); viewPlan(); };
    ta.focus();
  });
  app.querySelectorAll('[data-ground]').forEach(b => b.onclick = () => {
    const i = +b.dataset.ground;
    const rows = [[5, L("ko'rayotgan narsangiz", 'что вы видите')], [4, L('his qilayotgan narsangiz (teginish)', 'что ощущаете телом')], [3, L('eshitayotgan tovushlar', 'что слышите')], [2, L('hidlar', 'запахи')], [1, L("ta'm", 'вкус')]];
    body(i).innerHTML = rows.map(([n, lb]) => `<p class="meta"><strong>${n}</strong> — ${esc(lb)}</p><div class="gin">${Array.from({ length: n }, () => '<input type="text" class="gi">').join('')}</div>`).join('') + `<button class="btn" id="gs${i}" disabled>${L('Tayyor', 'Готово')}</button>`;
    const ins = [...body(i).querySelectorAll('.gi')];
    ins.forEach(x => x.oninput = () => { $('gs' + i).disabled = !ins.every(y => y.value.trim().length >= 2); });
    $('gs' + i).onclick = () => { complete(d.tasks[i].id, true); viewPlan(); };
  });
  app.querySelectorAll('[data-run]').forEach(b => b.onclick = () => runTimer(+b.dataset.run, d));
}

let timerStop = null;
function runTimer(i, d) {
  if (timerStop) timerStop();
  const T = TMAP[d.tasks[i].id];
  const phases = PH()[T.ph];
  const box = $('task' + i).querySelector('.task-body');
  box.innerHTML = `<div class="breath"><div class="circle" id="bc"></div><div class="ph" id="bp"></div></div><p class="timer" id="bt"></p><p class="meta" id="bn">${esc(L("Sahifadan chiqsangiz taymer to'xtaydi.", 'Если уйти со страницы, таймер остановится.'))}</p><button class="btn secondary" id="bx">${L("To'xtatish", 'Остановить')}</button>`;
  let left = T.min * 60, pi = 0, pleft = phases[0][1], alive = true;
  const show = () => {
    const [txt, , sc] = phases[pi];
    $('bp').textContent = txt; $('bc').style.transform = `scale(${sc})`;
    $('bc').style.transitionDuration = phases[pi][1] + 's';
    $('bt').textContent = `${Math.floor(left / 60)}:${pad(left % 60)}`;
  };
  show();
  const iv = setInterval(() => {
    if (!$('bt')) { stop(); return; }
    if (!alive || document.hidden) return;
    left--; pleft--;
    if (pleft <= 0) { pi = (pi + 1) % phases.length; pleft = phases[pi][1]; }
    if (left <= 0) { stop(); complete(d.tasks[i].id, true); viewPlan(); return; }
    show();
  }, 1000);
  const stop = () => { alive = false; clearInterval(iv); timerStop = null; };
  timerStop = stop;
  $('bx').onclick = () => { stop(); viewPlan(); };
}

function toast(m) {
  const el = document.createElement('div'); el.className = 'pl-toast'; el.textContent = m;
  document.body.appendChild(el); setTimeout(() => el.remove(), 3500);
}

/* Bosh sahifadagi "Bugungi vazifalar" kartasi */
function homeBanner() {
  if (app.querySelector('.plan-banner')) return;
  const el = document.createElement('a'); el.href = '#plan'; el.className = 'card plan-banner';
  if (!state.goals.length) {
    el.innerHTML = `<div><h3>🗺️ ${L('Shaxsiy rivojlanish xaritangizni yarating', 'Создайте свою карту развития')}</h3><p>${esc(L("Har kuni 3 ta qisqa vazifa, seriya va darajalar — diqqat, xotira, stress va kayfiyat ustida muntazam ishlang.", 'Каждый день 3 коротких задания, серии и уровни — регулярно тренируйте внимание, память, работу со стрессом и настроение.'))}</p></div><span class="btn">${L('Boshlash', 'Начать')}</span>`;
  } else {
    const d = today(), s = stats(), nd = d.tasks.filter(x => x.done).length;
    el.innerHTML = `<div><h3>📋 ${L('Bugungi vazifalar', 'Задания на сегодня')}: ${nd}/${d.tasks.length}</h3><p>🔥 ${s.streak} ${L('kunlik seriya', 'дней подряд')} · ⭐ ${s.xp} XP</p><div class="bar"><span style="width:${Math.round(nd / d.tasks.length * 100)}%"></span></div></div><span class="btn">${nd >= d.tasks.length ? L("Ko'rish", 'Открыть') : L('Davom etish', 'Продолжить')}</span>`;
  }
  const hero = app.querySelector('.hero'), h1 = app.querySelector('h1');
  if (hero) hero.after(el); else if (h1) h1.after(el); else app.prepend(el);
}

/* ---------- Ulanishlar ---------- */
const _prevSave = saveResult;
saveResult = function (r) {
  _prevSave(r);
  if (cloudResults) cloudResults.push(r);
  const d = today(); if (!d) return;
  const x = d.tasks.find(y => !y.done && TMAP[y.id] && TMAP[y.id].target === r.id);
  if (x) complete(x.id, true);
};

function navAdd() {
  const nav = document.querySelector('nav');
  let a = nav.querySelector('a[href="#plan"]');
  if (!a) { a = document.createElement('a'); a.href = '#plan'; const res = nav.querySelector('a[href="#results"]'); res ? res.after(a) : nav.appendChild(a); }
  a.textContent = L('Rivojlanish', 'Развитие');
  a.classList.toggle('active', page() === 'plan');
}

const style = document.createElement('style');
style.textContent = `
.stats4 h3{margin:.1rem 0;font-size:1.6rem}.stats4 p{margin:0}
.tasks{display:grid;gap:1rem}
.task{color:var(--text)}.task.done{opacity:.85;border-left:5px solid #22c55e}
.task h3{margin:.3rem 0}.task-top{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}
.dir-tag{font-size:.85rem;font-weight:600;background:var(--accent-soft);color:#4c1d95;padding:.15rem .6rem;border-radius:999px}
.xp{margin-left:auto;font-weight:700;color:#7c3aed}
.task-body:empty{display:none}.task-body{margin-top:.8rem}
.jt{width:100%;font:inherit;padding:.6rem;border-radius:10px;border:1px solid var(--border);color:var(--text)}
.gin{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.4rem}.gi{flex:1 1 7rem;min-width:6rem;padding:.4rem .5rem;border-radius:8px;border:1px solid var(--border);font:inherit;color:var(--text)}
.breath{display:flex;flex-direction:column;align-items:center;gap:1rem;padding:1.5rem 0}
.circle{width:110px;height:110px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#a78bfa,#6366f1 60%,#0e7490);box-shadow:0 0 40px rgba(124,58,237,.5);transition:transform 4s ease-in-out}
.ph{font-weight:700;font-size:1.15rem;color:var(--text);text-align:center}
.timer{text-align:center;font-size:1.6rem;font-weight:700;font-variant-numeric:tabular-nums;color:var(--text)}
.track{margin:.4rem 0 1.2rem}.track-h{display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap;color:var(--text)}
.nodes{display:flex;align-items:center;margin:.6rem 0 .4rem}.nodes i{flex:1;height:3px;background:#e5e7eb}
.node{width:26px;height:26px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:.72rem;font-weight:700;background:#e5e7eb;color:#6b7280}
.node.full{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff}
.node.cur{background:#fff;color:#7c3aed;border:3px solid #7c3aed;box-shadow:0 0 0 4px rgba(124,58,237,.18)}
.bar{height:8px;border-radius:99px;background:#e5e7eb;overflow:hidden}.bar span{display:block;height:100%;background:linear-gradient(90deg,#6366f1,#22d3ee)}
.calgrid{display:grid;grid-template-columns:repeat(14,1fr);gap:5px;max-width:520px}
.cal{aspect-ratio:1;border-radius:5px;background:#eef2ff}.cal.c1{background:#c4b5fd}.cal.c2{background:#8b5cf6}.cal.c3{background:#5b21b6}
.dyn{color:var(--text)}.dyn-h{font-weight:700}.spark{width:100%;height:40px;margin:.3rem 0}
.dirpick{display:flex;align-items:center;gap:.6rem;cursor:pointer;color:var(--text)}.dirpick input{width:1.2rem;height:1.2rem}.dir-ic{font-size:1.6rem}
.plan-banner{display:flex;justify-content:space-between;align-items:center;gap:1rem;text-decoration:none;color:var(--text);margin:1rem 0}
.plan-banner h3{margin:0 0 .3rem}.plan-banner p{margin:0 0 .4rem}.plan-banner>div{flex:1}
.ok-box{background:#dcfce7;color:#166534;border-color:#86efac}
.pl-toast{position:fixed;left:50%;bottom:1.5rem;transform:translateX(-50%);background:#166534;color:#fff;padding:.7rem 1.2rem;border-radius:12px;font-weight:600;z-index:99;box-shadow:0 8px 24px rgba(0,0,0,.25)}
@media (max-width:640px){.plan-banner{flex-direction:column;align-items:stretch}.node{width:22px;height:22px}}`;
document.head.appendChild(style);

const _prevRoute = route;
window.removeEventListener('hashchange', _prevRoute);
route = function () {
  if (timerStop) timerStop();
  _prevRoute();
  navAdd();
  const pg = page();
  if (pg === 'plan') { (location.hash.split('/')[1] === 'setup' ? viewSetup : viewPlan)(); window.scrollTo(0, 0); }
  else if (pg === 'home') homeBanner();
};
window.addEventListener('hashchange', route);

state = loadLocal() || { goals: [], days: {} };
route();
