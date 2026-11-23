'use strict';
/* PsixoLab — qo'shimcha tajribalar: N-back, Flanker, Iz qoldirish testi, Luriya 10 so'z, Xanoy minorasi */
(function () {

const L = (uz, ru) => (lang === 'ru' ? ru : uz);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = (x, d) => Number(x).toFixed(d).replace('.', ',');
const back = () => `<a href="#experiments">← ${t('back')}</a>`;
const again = () => `<div class="row-actions"><button class="btn" id="again">${t('retake')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
const concl = ps => `<div class="conclusion"><h2>${L('Xulosa', 'Заключение')}</h2>${ps.map(p => `<p>${esc(p)}</p>`).join('')}</div>`;
const mean = a => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);

/* ---------- Nomlar ---------- */
Object.assign(T.uz, {
  nbTitle: 'N-back (ishchi xotira)', nbDesc: "Harflar ketma-ket chiqadi. Harf 2 qadam oldingi harf bilan bir xil bo'lsa, tugmani bosing. Ishchi xotirani o'lchaydi.",
  flTitle: 'Flanker (tanlab diqqat)', flDesc: "O'rtadagi strelka qaysi tomonga qaraganini tanlang, chetdagilariga e'tibor bermang. Tanlab diqqat qilishni o'lchaydi.",
  tmTitle: 'Iz qoldirish testi (Trail Making)', tmDesc: "Doirachalarni tartib bilan bosing: A qismida 1-2-3…, B qismida 1-A-2-B… Diqqatni almashtirish qobiliyatini o'lchaydi.",
  lwTitle: "Luriya: 10 so'zni eslab qolish", lwDesc: "10 ta so'z 5 marta ko'rsatiladi, har safar eslab qolganlaringizni yozasiz. Xotira va eslab qolish egri chizig'ini o'lchaydi.",
  hnTitle: 'Xanoy minorasi (rejalashtirish)', hnDesc: "4 ta diskni chap ustundan o'ng ustunga eng kam yurish bilan o'tkazing. Rejalashtirish va oldindan o'ylash qobiliyatini o'lchaydi."
});
Object.assign(T.ru, {
  nbTitle: 'N-back (рабочая память)', nbDesc: 'Буквы появляются по очереди. Если буква совпадает с буквой два шага назад, нажмите кнопку. Измеряет рабочую память.',
  flTitle: 'Фланкер (избирательное внимание)', flDesc: 'Выберите, куда смотрит центральная стрелка, не обращая внимания на крайние. Измеряет избирательное внимание.',
  tmTitle: 'Тест прокладывания пути (Trail Making)', tmDesc: 'Нажимайте кружки по порядку: в части A 1-2-3…, в части B 1-А-2-Б… Измеряет переключение внимания.',
  lwTitle: 'Лурия: заучивание 10 слов', lwDesc: '10 слов показываются 5 раз, каждый раз вы записываете запомненные. Измеряет память и кривую запоминания.',
  hnTitle: 'Ханойская башня (планирование)', hnDesc: 'Переложите 4 диска с левого стержня на правый за наименьшее число ходов. Измеряет планирование и способность думать наперёд.'
});

EXPERIMENTS.push(
  { id: 'nback', title: 'nbTitle', desc: 'nbDesc', minutes: 2 },
  { id: 'flanker', title: 'flTitle', desc: 'flDesc', minutes: 2 },
  { id: 'trail', title: 'tmTitle', desc: 'tmDesc', minutes: 3 },
  { id: 'words', title: 'lwTitle', desc: 'lwDesc', minutes: 5 },
  { id: 'hanoi', title: 'hnTitle', desc: 'hnDesc', minutes: 4 }
);

/* ===================== 1. N-back ===================== */
function viewNback() {
  const N = 32, LET = 'BCDFGHKLMNPRSTVZ'.split('');
  const seq = [];
  for (let i = 0; i < N; i++) {
    if (i >= 2 && Math.random() < 0.33) seq.push(seq[i - 2]);
    else { let c; do { c = LET[Math.floor(Math.random() * LET.length)]; } while (i >= 2 && c === seq[i - 2]); seq.push(c); }
  }
  app.innerHTML = `${back()}<h1>${esc(t('nbTitle'))}</h1><p>${esc(t('nbDesc'))}</p>
    <div class="stage" id="nb">
      <p><strong>${esc(L("Harf 2 qadam oldingi harf bilan bir xil bo'lsa, \"MOS\" tugmasini (yoki Probel) bosing.", 'Если буква совпадает с буквой два шага назад, нажмите «СОВПАДАЕТ» (или Пробел).'))}</strong></p>
      <p class="meta">${esc(L('Masalan: K – T – K → uchinchi harfda (K) bosiladi.', 'Например: K – T – K → нажать на третьей букве (K).'))}</p>
      <button class="btn" id="go">${t('start')}</button>
    </div>`;
  const resp = new Array(N).fill(false);
  let cur = -1;
  const alive = () => !!document.getElementById('nb');
  const press = () => { if (cur >= 2 && !resp[cur]) { resp[cur] = true; const s = document.getElementById('nbs'); if (s) s.classList.add('pressed'); } };
  const onKey = e => { if (!alive()) { document.removeEventListener('keydown', onKey); return; } if (e.code === 'Space') { e.preventDefault(); press(); } };
  document.getElementById('go').onclick = async () => {
    document.addEventListener('keydown', onKey);
    const stage = document.getElementById('nb');
    stage.innerHTML = `<div class="meta" id="cnt"></div><div class="nb-letter" id="nbs"></div>
      <button class="btn gng-btn" id="press">${L('MOS', 'СОВПАДАЕТ')}</button>`;
    document.getElementById('press').addEventListener('pointerdown', e => { e.preventDefault(); press(); });
    for (let i = 0; i < N; i++) {
      if (!alive()) return;
      cur = i;
      const s = document.getElementById('nbs');
      s.className = 'nb-letter'; s.textContent = seq[i];
      document.getElementById('cnt').textContent = `${i + 1} / ${N}`;
      await sleep(600);
      if (!alive()) return;
      s.textContent = '';
      await sleep(1900);
    }
    cur = -1;
    document.removeEventListener('keydown', onKey);
    let hits = 0, misses = 0, fa = 0, cr = 0;
    for (let i = 2; i < N; i++) {
      const target = seq[i] === seq[i - 2];
      if (target && resp[i]) hits++; else if (target) misses++; else if (resp[i]) fa++; else cr++;
    }
    const acc = Math.round((hits + cr) / (N - 2) * 100);
    saveResult({ type: 'exp', id: 'nback', value: acc, hits, misses, fa, targets: hits + misses });
    const ps = [acc >= 85 ? L("Ishchi xotirangiz yaxshi: ma'lumotni yodda saqlab, uni doimiy yangilab turish qobiliyatingiz yuqori.", 'Хорошая рабочая память: вы умеете удерживать информацию и постоянно её обновлять.')
      : acc >= 70 ? L("Ishchi xotirangiz o'rtacha darajada.", 'Рабочая память на среднем уровне.')
      : L("Ishchi xotira yuklamasi siz uchun og'ir bo'ldi. Bu vazifa ko'pchilik uchun qiyin, mashq qilsangiz natija sezilarli yaxshilanadi.", 'Нагрузка на рабочую память оказалась высокой. Это задание трудное для многих, с тренировкой результат заметно улучшается.')];
    if (fa > 3) ps.push(L("Noto'g'ri bosishlar ko'p bo'ldi: shoshilmang, faqat ishonch hosil qilganingizda bosing.", 'Было много ложных нажатий: не спешите, нажимайте только когда уверены.'));
    stage.innerHTML = `
      <div>${L('Aniqlik', 'Точность')}</div><div class="score">${acc}%</div>
      <table>
        <tr><th>${L("To'g'ri topilgan moslar", 'Найденные совпадения')}</th><td>${hits} / ${hits + misses}</td></tr>
        <tr><th>${L("O'tkazib yuborilgan moslar", 'Пропущенные совпадения')}</th><td>${misses}</td></tr>
        <tr><th>${L("Noto'g'ri bosishlar", 'Ложные нажатия')}</th><td>${fa}</td></tr>
      </table>${concl(ps)}${again()}`;
    document.getElementById('again').onclick = viewNback;
  };
}

/* ===================== 2. Flanker ===================== */
function viewFlanker() {
  const N = 32;
  const trials = shuffle(Array.from({ length: N }, (_, i) => ({ dir: i % 2 ? 'L' : 'R', cong: i % 4 < 2 })));
  const AR = { L: '←', R: '→' };
  app.innerHTML = `${back()}<h1>${esc(t('flTitle'))}</h1><p>${esc(t('flDesc'))}</p>
    <div class="stage" id="fl">
      <p><strong>${esc(L("Faqat O'RTADAGI strelkaga qarang. Tugmalar yoki klaviaturadagi ← → strelkalar bilan javob bering.", 'Смотрите только на ЦЕНТРАЛЬНУЮ стрелку. Отвечайте кнопками или клавишами ← →.'))}</strong></p>
      <div class="fl-stim" style="color:var(--muted)">← ← → ← ←</div>
      <p class="meta">${esc(L("Bu misolda to'g'ri javob: → (o'rtadagi strelka o'ngga qaragan).", 'В этом примере правильный ответ: → (центральная стрелка смотрит вправо).'))}</p>
      <button class="btn" id="go">${t('start')}</button>
    </div>`;
  let resolver = null, shown = 0;
  const alive = () => !!document.getElementById('fl');
  const respond = d => { if (resolver) { const r = resolver; resolver = null; r({ d, rt: performance.now() - shown }); } };
  const onKey = e => {
    if (!alive()) { document.removeEventListener('keydown', onKey); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); respond('L'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); respond('R'); }
  };
  document.getElementById('go').onclick = async () => {
    document.addEventListener('keydown', onKey);
    const stage = document.getElementById('fl');
    stage.innerHTML = `<div class="meta" id="cnt"></div><div class="fl-stim" id="fls">+</div>
      <div class="color-buttons"><button class="btn fl-btn" data-d="L">←</button><button class="btn fl-btn" data-d="R">→</button></div>`;
    stage.querySelectorAll('[data-d]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); respond(b.dataset.d); }));
    for (let i = 0; i < N; i++) {
      if (!alive()) return;
      const tr = trials[i], s = document.getElementById('fls');
      document.getElementById('cnt').textContent = `${i + 1} / ${N}`;
      s.textContent = '+';
      await sleep(500);
      if (!alive()) return;
      const fl = tr.cong ? AR[tr.dir] : AR[tr.dir === 'L' ? 'R' : 'L'];
      s.textContent = `${fl} ${fl} ${AR[tr.dir]} ${fl} ${fl}`;
      shown = performance.now();
      const res = await Promise.race([new Promise(r => { resolver = r; }), sleep(2000).then(() => null)]);
      resolver = null;
      tr.rt = res ? res.rt : null;
      tr.correct = !!res && res.d === tr.dir;
      s.textContent = '';
      await sleep(250);
    }
    document.removeEventListener('keydown', onKey);
    const ok = trials.filter(x => x.correct);
    const c = mean(ok.filter(x => x.cong).map(x => x.rt));
    const ic = mean(ok.filter(x => !x.cong).map(x => x.rt));
    const acc = Math.round(ok.length / N * 100);
    const eff = ic - c;
    saveResult({ type: 'exp', id: 'flanker', value: eff, cong: c, incong: ic, acc });
    const ps = [eff <= 60 ? L("Tanlab diqqat qilish qobiliyatingiz yaxshi: chetdagi chalg'ituvchi belgilar sizga deyarli ta'sir qilmadi.", 'Хорошее избирательное внимание: отвлекающие крайние стрелки почти не повлияли на вас.')
      : eff <= 120 ? L("Flanker effekti me'yor doirasida, bu ko'pchilik odamlarga xos.", 'Эффект фланкера в пределах нормы, как у большинства людей.')
      : L("Chetdagi chalg'ituvchi belgilar sizga sezilarli ta'sir qildi. Diqqatni jamlash mashqlari (masalan, Shulte jadvallari) foydali.", 'Отвлекающие стрелки заметно повлияли на вас. Полезны упражнения на концентрацию (например, таблицы Шульте).')];
    if (acc < 85) ps.push(L("Xatolar ko'p bo'ldi: tezlikdan ko'ra aniqlikka e'tibor bering.", 'Было много ошибок: уделяйте больше внимания точности, а не скорости.'));
    stage.innerHTML = `
      <div>${L('Flanker effekti', 'Эффект фланкера')}</div><div class="score">${eff} ${t('ms')}</div>
      <table>
        <tr><th>${L('Mos (← ← ← ← ←)', 'Совпадающие (← ← ← ← ←)')}</th><td>${c} ${t('ms')}</td></tr>
        <tr><th>${L('Nomos (→ → ← → →)', 'Несовпадающие (→ → ← → →)')}</th><td>${ic} ${t('ms')}</td></tr>
        <tr><th>${t('accuracy')}</th><td>${acc}%</td></tr>
      </table>
      <p class="meta">${esc(L("Flanker effekti — nomos urinishlarda qancha ko'proq vaqt ketganini ko'rsatadi.", 'Эффект фланкера показывает, насколько дольше вы отвечаете в несовпадающих пробах.'))}</p>
      ${concl(ps)}${again()}`;
    document.getElementById('again').onclick = viewFlanker;
  };
}

/* ===================== 3. Iz qoldirish testi ===================== */
function placePoints(n) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const pts = [];
    let tries = 0;
    while (pts.length < n && tries < 4000) {
      tries++;
      const p = [7 + Math.random() * 86, 7 + Math.random() * 86];
      if (pts.every(q => Math.hypot(p[0] - q[0], p[1] - q[1]) > 13)) pts.push(p);
    }
    if (pts.length === n) return pts;
  }
  return Array.from({ length: n }, (_, i) => [10 + (i % 5) * 20, 10 + Math.floor(i / 5) * 20]);
}
function viewTrail() {
  const lettersUz = 'A B C D E F G H I J K L'.split(' ');
  const lettersRu = 'А Б В Г Д Е Ж З И К Л М'.split(' ');
  const res = { a: 0, b: 0, errA: 0, errB: 0 };
  app.innerHTML = `${back()}<h1>${esc(t('tmTitle'))}</h1><p>${esc(t('tmDesc'))}</p><div class="stage" id="tm"></div>`;
  const alive = () => !!document.getElementById('tm');
  intro('A');
  function intro(part) {
    if (!alive()) return;
    const txt = part === 'A'
      ? L("A qismi: 1 dan 25 gacha raqamlarni tartib bilan imkon qadar tez bosing.", 'Часть A: как можно быстрее нажимайте числа от 1 до 25 по порядку.')
      : L("B qismi: raqam va harflarni navbatma-navbat bosing: 1 → A → 2 → B → 3 → C … 13 gacha.", 'Часть B: нажимайте числа и буквы по очереди: 1 → А → 2 → Б → 3 → В … до 13.');
    document.getElementById('tm').innerHTML = `<h2 style="margin:0">${L('Qism', 'Часть')} ${part}</h2><p>${esc(txt)}</p><button class="btn" id="ready">${t('schReady')}</button>`;
    document.getElementById('ready').onclick = () => run(part);
  }
  function run(part) {
    const letters = lang === 'ru' ? lettersRu : lettersUz;
    const labels = part === 'A' ? Array.from({ length: 25 }, (_, i) => String(i + 1))
      : Array.from({ length: 25 }, (_, i) => (i % 2 === 0 ? String(i / 2 + 1) : letters[(i - 1) / 2]));
    const pts = placePoints(25);
    let next = 0, errs = 0;
    const stage = document.getElementById('tm');
    stage.innerHTML = `
      <div class="sch-head"><span>${L('Qism', 'Часть')} ${part}</span><span>${L('Keyingisi', 'Следующий')}: <strong id="nx">${labels[0]}</strong></span><span>${t('schErrors')}: <strong id="er">0</strong></span></div>
      <div class="tm-board"><svg viewBox="0 0 100 100" preserveAspectRatio="none" id="tmsvg"></svg>
        ${labels.map((l, i) => `<button class="tm-node" data-i="${i}" style="left:${pts[i][0]}%;top:${pts[i][1]}%">${l}</button>`).join('')}
      </div>`;
    const svg = document.getElementById('tmsvg');
    const start = performance.now();
    stage.querySelectorAll('.tm-node').forEach(b => b.addEventListener('click', () => {
      const i = Number(b.dataset.i);
      if (i === next) {
        b.classList.add('done');
        if (next > 0) {
          const p = pts[next - 1], q = pts[next];
          svg.insertAdjacentHTML('beforeend', `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#6366f1" stroke-width="0.6"/>`);
        }
        next++;
        if (next >= 25) {
          const sec = (performance.now() - start) / 1000;
          if (part === 'A') { res.a = sec; res.errA = errs; return intro('B'); }
          res.b = sec; res.errB = errs; return finish();
        }
        document.getElementById('nx').textContent = labels[next];
      } else if (i > next) {
        errs++;
        document.getElementById('er').textContent = errs;
        b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 300);
      }
    }));
  }
  function finish() {
    const ratio = res.b / res.a;
    const errors = res.errA + res.errB;
    saveResult({ type: 'exp', id: 'trail', value: Math.round(ratio * 100) / 100, a: Math.round(res.a * 10) / 10, b: Math.round(res.b * 10) / 10, errors });
    const ps = [ratio < 2.5 ? L("Diqqatni bir vazifadan ikkinchisiga o'tkazish (kognitiv moslashuvchanlik) yaxshi.", 'Хорошая когнитивная гибкость: вы легко переключаете внимание между задачами.')
      : ratio < 3 ? L("Diqqatni almashtirish qobiliyatingiz me'yor chegarasida.", 'Переключение внимания на границе нормы.')
      : L("B qismi A qismiga nisbatan ancha sekin bajarildi: diqqatni almashtirish siz uchun qiyinroq. Charchoq ham ta'sir qilishi mumkin, dam olib qayta urinib ko'ring.", 'Часть B выполнена значительно медленнее части A: переключение внимания даётся труднее. Может влиять усталость, отдохните и попробуйте снова.')];
    if (errors > 2) ps.push(L("Bir nechta xato bo'ldi: shoshilmasdan, keyingi belgini topib keyin bosing.", 'Было несколько ошибок: не спешите, сначала найдите следующий знак, затем нажимайте.'));
    document.getElementById('tm').innerHTML = `
      <div>${L('B/A nisbati', 'Отношение B/A')}</div><div class="score">${fmt(ratio, 2)}</div>
      <table>
        <tr><th>${L('A qismi vaqti', 'Время части A')}</th><td>${fmt(res.a, 1)} ${t('sec')}</td></tr>
        <tr><th>${L('B qismi vaqti', 'Время части B')}</th><td>${fmt(res.b, 1)} ${t('sec')}</td></tr>
        <tr><th>B − A</th><td>${fmt(res.b - res.a, 1)} ${t('sec')}</td></tr>
        <tr><th>${t('schErrors')}</th><td>${errors}</td></tr>
      </table>
      <p class="meta">${esc(L("B/A nisbati diqqatni almashtirishni o'lchaydi: 3 dan yuqori nisbat qiyinchilik belgisi hisoblanadi. Onlayn variantda bosish ishlatiladi, shuning uchun natijani qog'oz variant me'yorlari bilan to'g'ridan-to'g'ri solishtirib bo'lmaydi.", 'Отношение B/A отражает переключение внимания: отношение выше 3 считается признаком трудностей. В онлайн-варианте используются нажатия, поэтому результат нельзя напрямую сравнивать с нормами бумажного варианта.'))}</p>
      ${concl(ps)}${again()}`;
    document.getElementById('again').onclick = viewTrail;
  }
}

/* ===================== 4. Luriya: 10 so'z ===================== */
const WORDS = {
  uz: ["o'rmon", 'non', 'deraza', 'stul', 'suv', 'uka', "qo'ziqorin", 'igna', 'asal', 'ot'],
  ru: ['лес', 'хлеб', 'окно', 'стул', 'вода', 'брат', 'гриб', 'игла', 'мёд', 'конь']
};
const norm = s => s.toLowerCase().replace(/[ʻ’‘`ʼ´]/g, "'").replace(/ё/g, 'е').replace(/o'/g, "o'").trim();
function curveSvg(vals, max) {
  const W = 420, H = 190, P = 34;
  const x = i => P + i * (W - 2 * P) / (vals.length - 1);
  const y = v => H - P - v / max * (H - 2 * P);
  return `<svg viewBox="0 0 ${W} ${H}" class="curve" role="img">
    <line x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" stroke="#c9cfdb"/>
    <polyline points="${vals.map((v, i) => `${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="#6366f1" stroke-width="3" stroke-linejoin="round"/>
    ${vals.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="5" fill="#6366f1"/>
      <text x="${x(i)}" y="${y(v) - 10}" text-anchor="middle" font-size="13" fill="#1d2433">${v}</text>
      <text x="${x(i)}" y="${H - P + 18}" text-anchor="middle" font-size="12" fill="#5b6478">${i + 1}</text>`).join('')}
  </svg>`;
}
function viewWords() {
  const words = WORDS[lang] || WORDS.uz;
  const target = words.map(norm);
  const counts = [];
  let extra = 0;
  app.innerHTML = `${back()}<h1>${esc(t('lwTitle'))}</h1><p>${esc(t('lwDesc'))}</p>
    <div class="stage" id="lw">
      <p>${esc(L("Ekranda 10 ta so'z birin-ketin ko'rsatiladi. Ularni diqqat bilan eslab qoling. So'ng eslab qolgan so'zlaringizni istalgan tartibda yozasiz. Bu 5 marta takrorlanadi.", 'На экране по одному покажут 10 слов. Внимательно запоминайте их. Затем запишите запомненные слова в любом порядке. Это повторится 5 раз.'))}</p>
      <button class="btn" id="go">${t('start')}</button>
    </div>`;
  const alive = () => !!document.getElementById('lw');
  document.getElementById('go').onclick = () => trial(0);
  async function trial(k) {
    if (!alive()) return;
    const stage = document.getElementById('lw');
    stage.innerHTML = `<div class="meta">${L('Urinish', 'Попытка')} ${k + 1} / 5</div><div class="lw-word" id="wd"></div>`;
    await sleep(800);
    for (const w of words) {
      if (!alive()) return;
      document.getElementById('wd').textContent = w;
      await sleep(1300);
      if (!alive()) return;
      document.getElementById('wd').textContent = '';
      await sleep(250);
    }
    stage.innerHTML = `<div class="meta">${L('Urinish', 'Попытка')} ${k + 1} / 5</div>
      <p>${esc(L("Eslab qolgan so'zlaringizni yozing (bo'sh joy yoki vergul bilan ajrating):", 'Запишите запомненные слова (через пробел или запятую):'))}</p>
      <textarea id="ans" rows="3" class="lw-input" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
      <button class="btn" id="done">${L('Tayyor', 'Готово')}</button>`;
    const ta = document.getElementById('ans');
    ta.focus();
    document.getElementById('done').onclick = () => {
      const typed = [...new Set(ta.value.split(/[\s,;.]+/).map(norm).filter(Boolean))];
      const correct = typed.filter(w => target.includes(w)).length;
      extra += typed.length - correct;
      counts.push(correct);
      stage.innerHTML = `<div class="meta">${L('Urinish', 'Попытка')} ${k + 1} / 5</div><div class="score">${correct} / 10</div>`;
      setTimeout(() => (k < 4 ? trial(k + 1) : finish()), 1200);
    };
  }
  function finish() {
    if (!alive()) return;
    const last = counts[4], best = Math.max(...counts);
    saveResult({ type: 'exp', id: 'words', value: last, curve: counts.slice(), extra });
    const ps = [last >= 9 ? L("Eslab qolish qobiliyatingiz yaxshi: so'zlarni tez va mustahkam o'zlashtirdingiz.", 'Хорошая память: вы быстро и прочно запомнили слова.')
      : last >= 7 ? L("Eslab qolish qobiliyatingiz o'rtacha darajada.", 'Запоминание на среднем уровне.')
      : L("Eslab qolgan so'zlar soni o'rtachadan kam. Charchoq, xavotir yoki chalg'ish ta'sir qilgan bo'lishi mumkin. Dam olib, qayta urinib ko'ring. Natija takroran past bo'lsa, mutaxassis bilan maslahatlashing.", 'Количество запомненных слов ниже среднего. Возможно, повлияли усталость, тревога или отвлечение. Отдохните и попробуйте снова. Если результат повторно низкий, обратитесь к специалисту.')];
    if (counts[2] >= 9) ps.push(L("Uchinchi urinishdayoq deyarli barcha so'zlarni eslab qoldingiz, bu yaxshi belgi.", 'Уже к третьей попытке вы запомнили почти все слова, это хороший признак.'));
    if (last < best - 1) ps.push(L("Egri chiziq oxirida pasaygan: bu charchash yoki diqqat beqarorligi belgisi bo'lishi mumkin.", 'Кривая снижается к концу: это может говорить об утомлении или неустойчивости внимания.'));
    if (extra > 2) ps.push(L("Ro'yxatda bo'lmagan so'zlar ham yozildi. Eslashda aniqlikka e'tibor bering.", 'Были записаны слова, которых не было в списке. Обращайте внимание на точность воспроизведения.'));
    document.getElementById('lw').innerHTML = `
      <div>${L("Oxirgi urinishda eslab qolingan so'zlar", 'Запомнено слов в последней попытке')}</div><div class="score">${last} / 10</div>
      <div style="width:100%"><div class="meta">${esc(L("Eslab qolish egri chizig'i (har bir urinishda eslangan so'zlar)", 'Кривая запоминания (слов в каждой попытке)'))}</div>${curveSvg(counts, 10)}</div>
      <p class="meta">${esc(L("A.R. Luriya metodikasi. Sog'lom kattalarda odatda 3-urinishgacha 9–10 ta so'z eslab qolinadi.", 'Методика А.Р. Лурии. У здоровых взрослых обычно к 3-й попытке запоминается 9–10 слов.'))}</p>
      ${concl(ps)}${again()}`;
    document.getElementById('again').onclick = viewWords;
  }
}

/* ===================== 5. Xanoy minorasi ===================== */
function viewHanoi() {
  const D = 4, OPT = 15;
  const pegs = [[4, 3, 2, 1], [], []];
  let sel = null, moves = 0, start = 0, done = false;
  app.innerHTML = `${back()}<h1>${esc(t('hnTitle'))}</h1><p>${esc(t('hnDesc'))}</p>
    <div class="stage" id="hn">
      <p class="meta">${esc(L("Qoidalar: bir martada faqat bitta (eng ustidagi) diskni ko'chirish mumkin; katta diskni kichik disk ustiga qo'yish mumkin emas. Ustunni bosib diskni tanlang, keyin boshqa ustunni bosing.", 'Правила: за один ход можно переложить только один (верхний) диск; нельзя класть больший диск на меньший. Нажмите на стержень, чтобы взять диск, затем на другой стержень.'))}</p>
      <div class="hn-head"><span>${L('Yurishlar', 'Ходы')}: <strong id="mv">0</strong></span><span>${L('Eng kam', 'Минимум')}: ${OPT}</span></div>
      <div class="hanoi" id="board"></div>
    </div>`;
  const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899'];
  function render() {
    const b = document.getElementById('board');
    if (!b) return;
    b.innerHTML = pegs.map((p, i) => `<div class="peg${sel === i ? ' sel' : ''}" data-p="${i}">
      <div class="pole"></div>
      ${p.map((d, j) => `<div class="disk${sel === i && j === p.length - 1 ? ' up' : ''}" style="width:${30 + d * 16}%;background:${COLORS[d - 1]}"></div>`).join('')}
    </div>`).join('');
    b.querySelectorAll('.peg').forEach(el => el.addEventListener('click', () => click(Number(el.dataset.p))));
  }
  function click(i) {
    if (done) return;
    if (sel === null) { if (pegs[i].length) sel = i; render(); return; }
    if (sel === i) { sel = null; render(); return; }
    const d = pegs[sel][pegs[sel].length - 1];
    const top = pegs[i][pegs[i].length - 1];
    if (top !== undefined && top < d) {
      const el = document.querySelector(`.peg[data-p="${i}"]`);
      if (el) { el.classList.add('bad'); setTimeout(() => el.classList.remove('bad'), 300); }
      return;
    }
    if (!start) start = performance.now();
    pegs[i].push(pegs[sel].pop());
    sel = null; moves++;
    document.getElementById('mv').textContent = moves;
    render();
    if (pegs[2].length === D) { done = true; setTimeout(finish, 400); }
  }
  function finish() {
    if (!document.getElementById('hn')) return;
    const sec = Math.round((performance.now() - start) / 100) / 10;
    saveResult({ type: 'exp', id: 'hanoi', value: moves, time: sec, optimal: OPT });
    const ps = [moves <= 18 ? L("Rejalashtirish qobiliyatingiz a'lo: siz deyarli eng qisqa yo'lni topdingiz.", 'Отличное планирование: вы нашли почти кратчайший путь.')
      : moves <= 30 ? L("Masalani yechdingiz, lekin ortiqcha yurishlar bo'ldi. Bir necha qadam oldindan rejalashtirish natijani yaxshilaydi.", 'Вы решили задачу, но с лишними ходами. Планирование на несколько шагов вперёд улучшит результат.')
      : L("Masala ko'proq sinov-xato yo'li bilan yechildi. Har bir yurishdan oldin \"bu meni maqsadga yaqinlashtiradimi?\" deb o'ylash foydali.", 'Задача решалась в основном методом проб и ошибок. Полезно перед каждым ходом спрашивать себя: «приближает ли это меня к цели?».')];
    document.getElementById('hn').innerHTML = `
      <div>${L('Yurishlar soni', 'Количество ходов')}</div><div class="score">${moves} <span class="meta">/ ${OPT}</span></div>
      <table>
        <tr><th>${L('Eng kam mumkin bo\'lgan yurishlar', 'Минимально возможное число ходов')}</th><td>${OPT}</td></tr>
        <tr><th>${L('Ortiqcha yurishlar', 'Лишние ходы')}</th><td>${moves - OPT}</td></tr>
        <tr><th>${L('Vaqt', 'Время')}</th><td>${fmt(sec, 1)} ${t('sec')}</td></tr>
      </table>${concl(ps)}${again()}`;
    document.getElementById('again').onclick = viewHanoi;
  }
  render();
}

/* ---------- Dizayn ---------- */
const style = document.createElement('style');
style.textContent = `
.nb-letter{font-size:5rem;font-weight:800;min-height:6rem;line-height:6rem;color:var(--text);transition:transform .08s}
.nb-letter.pressed{transform:scale(.85);color:#6366f1}
.fl-stim{font-size:clamp(2rem,9vw,3.4rem);font-weight:700;letter-spacing:.15em;min-height:4.5rem;color:var(--text)}
.fl-btn{min-width:110px;font-size:1.8rem;padding:.5rem 1.4rem;touch-action:manipulation}
.tm-board{position:relative;width:min(100%,460px);aspect-ratio:1;background:#f8f9ff;border:1px solid var(--border);border-radius:var(--radius)}
.tm-board svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.tm-node{position:absolute;width:9%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:2px solid #6366f1;background:#fff;color:var(--text);font-weight:700;font-size:clamp(.7rem,2.8vw,1rem);cursor:pointer;padding:0;touch-action:manipulation}
.tm-node.done{background:#6366f1;color:#fff}
.tm-node.wrong{background:var(--danger);border-color:var(--danger-border)}
.lw-word{font-size:2.6rem;font-weight:800;min-height:4rem;color:var(--text)}
.lw-input{width:100%;max-width:460px;font-size:1.1rem;padding:.6rem .8rem;border-radius:10px;border:1px solid var(--border);font-family:inherit}
.hn-head{display:flex;gap:1.5rem;justify-content:center}
.hanoi{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;width:min(100%,520px)}
.peg{position:relative;height:190px;display:flex;flex-direction:column-reverse;align-items:center;gap:4px;padding-bottom:10px;border-bottom:6px solid #475569;border-radius:6px;cursor:pointer;background:rgba(99,102,241,.04)}
.peg.sel{background:rgba(99,102,241,.14)}
.peg.bad{background:var(--danger)}
.pole{position:absolute;bottom:0;top:20px;width:6px;background:#94a3b8;border-radius:3px;left:calc(50% - 3px);z-index:0}
.disk{height:26px;border-radius:8px;z-index:1;box-shadow:0 2px 4px rgba(0,0,0,.2);transition:transform .15s}
.disk.up{transform:translateY(-14px)}`;
document.head.appendChild(style);

/* ---------- Natijalar sahifasi uchun tavsif ---------- */
const _prevDescribe = describe;
describe = function (r) {
  if (r.type === 'exp') {
    if (r.id === 'nback') return { name: t('nbTitle'), result: `${r.value}%`, note: L(`Moslar: ${r.hits}/${r.targets}; noto'g'ri bosishlar: ${r.fa}`, `Совпадения: ${r.hits}/${r.targets}; ложные нажатия: ${r.fa}`) };
    if (r.id === 'flanker') return { name: t('flTitle'), result: `${r.value} ${t('ms')}`, note: `${L('Flanker effekti', 'Эффект фланкера')}; ${t('accuracy')} ${r.acc}%` };
    if (r.id === 'trail') return { name: t('tmTitle'), result: `B/A ${fmt(r.value, 2)}`, note: `A ${fmt(r.a, 1)} ${t('sec')}; B ${fmt(r.b, 1)} ${t('sec')}; ${t('schErrors')}: ${r.errors}` };
    if (r.id === 'words') return { name: t('lwTitle'), result: `${r.value} / 10`, note: `${L("Egri chiziq", 'Кривая')}: ${(r.curve || []).join('–')}` };
    if (r.id === 'hanoi') return { name: t('hnTitle'), result: `${r.value} ${L('yurish', 'ходов')}`, note: `${L('Eng kam', 'Минимум')}: ${r.optimal}; ${fmt(r.time, 1)} ${t('sec')}` };
  }
  return _prevDescribe(r);
};

/* ---------- Marshrut ---------- */
const _prevRoute = route;
window.removeEventListener('hashchange', _prevRoute);
route = function () {
  _prevRoute();
  const [page, arg] = (location.hash || '#home').slice(1).split('/');
  if (page !== 'exp') return;
  if (arg === 'nback') viewNback();
  else if (arg === 'flanker') viewFlanker();
  else if (arg === 'trail') viewTrail();
  else if (arg === 'words') viewWords();
  else if (arg === 'hanoi') viewHanoi();
  else return;
  window.scrollTo(0, 0);
};
window.addEventListener('hashchange', route);
route();

})();
