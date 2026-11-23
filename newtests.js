/* PsixoLab — original testlar:
   1) Mantiqiy fikrlash testi (sonlar qatori, mantiqiy masalalar, shakl matritsalari) — 24 savol, 25 daqiqa
   2) Xarakter aksentuatsiyalari so'rovnomasi — K. Leongard tipologiyasi asosida PsixoLab tomonidan yozilgan 70 ta savol
   Ikkala test ham PsixoLab'ning o'z materiali; me'yorlar sayt ma'lumotlari asosida keyinchalik ishlab chiqiladi. */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const $ = id => document.getElementById(id);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ============ 1. Mantiqiy fikrlash testi ============ */
  const SH = ['circle', 'square', 'tri', 'diamond'];
  const POS = {
    1: [[50, 50]], 2: [[30, 50], [70, 50]], 3: [[22, 50], [50, 50], [78, 50]],
    4: [[32, 32], [68, 32], [32, 68], [68, 68]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[25, 33], [50, 33], [75, 33], [25, 67], [50, 67], [75, 67]]
  };
  const SEG = { h: [10, 50, 90, 50], v: [50, 10, 50, 90], d1: [15, 15, 85, 85], d2: [85, 15, 15, 85], t: [15, 15, 85, 15], b: [15, 85, 85, 85], l: [15, 15, 15, 85], r: [85, 15, 85, 85] };
  function shape(sh, x, y, r, fill) {
    const f = fill === 's' ? 'fill="#2A2370"' : fill === 'h' ? 'fill="url(#hatch)"' : 'fill="none"';
    const st = 'stroke="#2A2370" stroke-width="3" stroke-linejoin="round"';
    if (sh === 'circle') return `<circle cx="${x}" cy="${y}" r="${r}" ${f} ${st}/>`;
    if (sh === 'square') return `<rect x="${x - r * .85}" y="${y - r * .85}" width="${r * 1.7}" height="${r * 1.7}" ${f} ${st}/>`;
    if (sh === 'tri') return `<polygon points="${x},${y - r} ${x + r * .95},${y + r * .75} ${x - r * .95},${y + r * .75}" ${f} ${st}/>`;
    return `<polygon points="${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}" ${f} ${st}/>`;
  }
  function cellSvg(s) {
    if (!s) return '';
    if (s.lines) return s.lines.map(k => { const [a, b, c, d] = SEG[k]; return `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#2A2370" stroke-width="5" stroke-linecap="round"/>`; }).join('');
    if (s.arrow !== undefined) return `<g transform="rotate(${s.arrow} 50 50)"><path d="M50 14 L70 40 H57 V86 H43 V40 H30 Z" fill="#2A2370"/></g>`;
    const n = s.n || 1, r = s.sz ? [11, 19, 29][s.sz - 1] : (n === 1 ? 24 : n <= 3 ? 12 : 10);
    return POS[n].map(([x, y]) => shape(s.sh, x, y, r, s.fill || 'o')).join('');
  }
  const DEFS = '<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#2A2370" stroke-width="3"/></pattern></defs>';
  function gridSvg(cell) {
    let g = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const last = r === 2 && c === 2;
      g += `<g transform="translate(${c * 104} ${r * 104})"><rect x="1" y="1" width="100" height="100" rx="8" fill="${last ? '#ECE8FF' : '#fff'}" stroke="#DED8F6" stroke-width="2"/>${last ? '<text x="50" y="66" text-anchor="middle" font-size="44" font-family="Unbounded,sans-serif" fill="#5B47E0">?</text>' : cellSvg(cell(r, c))}</g>`;
    }
    return `<svg viewBox="-2 -2 316 316" class="mx-grid" role="img" aria-label="${L('Shakllar matritsasi', 'Матрица фигур')}">${DEFS}${g}</svg>`;
  }
  const optSvg = s => `<svg viewBox="0 0 100 100" class="mx-opt" aria-hidden="true">${DEFS}${cellSvg(s)}</svg>`;

  const ROT = (r, c) => ({ arrow: (r * 3 + c) * 45 });
  const MX = {
    m1: { cell: (r, c) => ({ sh: ['circle', 'square', 'tri'][r], n: c + 1, fill: 's' }), ans: { sh: 'tri', n: 3, fill: 's' },
      dis: [{ sh: 'tri', n: 2, fill: 's' }, { sh: 'tri', n: 4, fill: 's' }, { sh: 'square', n: 3, fill: 's' }, { sh: 'tri', n: 3, fill: 'o' }, { sh: 'circle', n: 3, fill: 's' }] },
    m2: { cell: (r, c) => ({ sh: ['circle', 'square', 'diamond'][c], n: 1, fill: ['o', 'h', 's'][r] }), ans: { sh: 'diamond', n: 1, fill: 's' },
      dis: [{ sh: 'diamond', n: 1, fill: 'o' }, { sh: 'diamond', n: 1, fill: 'h' }, { sh: 'square', n: 1, fill: 's' }, { sh: 'circle', n: 1, fill: 's' }, { sh: 'tri', n: 1, fill: 's' }] },
    m3: { cell: ROT, ans: { arrow: 0 }, dis: [{ arrow: 45 }, { arrow: 90 }, { arrow: 180 }, { arrow: 270 }, { arrow: 315 }] },
    m4: { cell: (r, c) => ({ sh: ['square', 'circle', 'tri'][r], sz: c + 1, fill: ['o', 's', 'o'][c] }), ans: { sh: 'tri', sz: 3, fill: 'o' },
      dis: [{ sh: 'tri', sz: 2, fill: 'o' }, { sh: 'tri', sz: 3, fill: 's' }, { sh: 'circle', sz: 3, fill: 'o' }, { sh: 'tri', sz: 1, fill: 'o' }, { sh: 'square', sz: 3, fill: 'o' }] },
    m5: { cell: (r, c) => ({ sh: [['circle', 'square', 'tri'], ['square', 'tri', 'circle'], ['tri', 'circle', 'square']][r][c], n: 1, fill: [['o', 's', 'h'], ['h', 'o', 's'], ['s', 'h', 'o']][r][c] }),
      ans: { sh: 'square', n: 1, fill: 'o' },
      dis: [{ sh: 'square', n: 1, fill: 's' }, { sh: 'square', n: 1, fill: 'h' }, { sh: 'circle', n: 1, fill: 'o' }, { sh: 'tri', n: 1, fill: 'o' }, { sh: 'diamond', n: 1, fill: 'o' }] },
    m6: { cell: (r, c) => { const A = [['h'], ['v'], ['d1']][r], B = [['t'], ['l'], ['r']][r]; return { lines: c === 0 ? A : c === 1 ? B : A.concat(B) }; },
      ans: { lines: ['d1', 'r'] }, dis: [{ lines: ['d1'] }, { lines: ['r'] }, { lines: ['d1', 'l'] }, { lines: ['d2', 'r'] }, { lines: ['d1', 'r', 'h'] }] },
    m7: { cell: (r, c) => ({ lines: [[['h', 'v'], ['v', 'd1'], ['h', 'd1']], [['t', 'b', 'l'], ['b', 'r'], ['t', 'l', 'r']], [['d1', 'd2', 'h'], ['d2', 'v'], null]][r][c] }),
      ans: { lines: ['d1', 'h', 'v'] }, dis: [{ lines: ['d1', 'd2', 'h', 'v'] }, { lines: ['d2'] }, { lines: ['d1', 'h'] }, { lines: ['d1', 'v', 'd2'] }, { lines: ['h', 'v'] }] },
    m8: { cell: (r, c) => ({ sh: ['circle', 'square', 'tri'][c], n: r + c + 1, fill: (r + c) % 2 ? 's' : 'o' }), ans: { sh: 'tri', n: 5, fill: 'o' },
      dis: [{ sh: 'tri', n: 4, fill: 'o' }, { sh: 'tri', n: 5, fill: 's' }, { sh: 'square', n: 5, fill: 'o' }, { sh: 'tri', n: 6, fill: 'o' }, { sh: 'circle', n: 5, fill: 'o' }] }
  };

  const SER = {
    s1: ['3, 7, 11, 15, ?', '19', ['17', '18', '20', '21']],
    s2: ['2, 6, 18, 54, ?', '162', ['108', '156', '216', '72']],
    s3: ['1, 4, 9, 16, 25, ?', '36', ['30', '32', '35', '49']],
    s4: ['2, 3, 5, 8, 12, 17, ?', '23', ['21', '22', '24', '25']],
    s5: ['1, 1, 2, 3, 5, 8, ?', '13', ['11', '12', '14', '16']],
    s6: ['5, 10, 8, 16, 14, 28, ?', '26', ['24', '30', '32', '56']],
    s7: ['81, 27, 9, 3, ?', '1', ['0', '2', '1,5', '6']],
    s8: ['2, 5, 11, 23, 47, ?', '95', ['94', '71', '96', '93']]
  };
  const VB = () => ({
    v1: [L('Issiq : sovuq = baland : ?', 'Горячий : холодный = высокий : ?'), L('past', 'низкий'), L(['uzun', 'katta', 'keng', "og'ir"], ['длинный', 'большой', 'широкий', 'тяжёлый'])],
    v2: [L("Shifokor : kasalxona = o'qituvchi : ?", 'Врач : больница = учитель : ?'), L('maktab', 'школа'), L(['dars', "o'quvchi", 'kitob', 'doska'], ['урок', 'ученик', 'книга', 'доска'])],
    v3: [L("Qaysi so'z ortiqcha?", 'Какое слово лишнее?'), L('sabzi', 'морковь'), L(['olma', 'nok', "o'rik", 'gilos'], ['яблоко', 'груша', 'абрикос', 'вишня'])],
    v4: [L("Qaysi so'z ortiqcha?", 'Какое слово лишнее?'), L('kub', 'куб'), L(['kvadrat', 'uchburchak', 'doira', 'romb'], ['квадрат', 'треугольник', 'круг', 'ромб'])],
    v5: [L("Barcha mushuklar sutemizuvchilar. Ba'zi sutemizuvchilar suzishni biladi. Qaysi xulosa to'g'ri?", 'Все кошки — млекопитающие. Некоторые млекопитающие умеют плавать. Какой вывод верен?'),
      L("Bu ma'lumotlardan mushuklarning suzishi haqida aniq xulosa chiqarib bo'lmaydi", 'Из этих данных нельзя сделать точный вывод о том, плавают ли кошки'),
      L(['Barcha mushuklar suzishni biladi', "Ba'zi mushuklar albatta suzishni biladi", 'Hech bir mushuk suzishni bilmaydi', 'Suzishni biladigan har qanday hayvon — mushuk'],
        ['Все кошки умеют плавать', 'Некоторые кошки обязательно умеют плавать', 'Ни одна кошка не умеет плавать', 'Любое плавающее животное — кошка'])],
    v6: [L('Aziz Botirdan baland. Botir Doniyordan baland. Eng past kim?', 'Азиз выше Ботира. Ботир выше Дониёра. Кто самый низкий?'), L('Doniyor', 'Дониёр'),
      L(['Aziz', 'Botir', "Aniqlab bo'lmaydi"], ['Азиз', 'Ботир', 'Определить нельзя'])],
    v7: [L('Malika Nilufardan katta, lekin Sevaradan kichik. Sevara Ozodadan kichik. Eng kattasi kim?', 'Малика старше Нилуфар, но младше Севары. Севара младше Озоды. Кто самая старшая?'), L('Ozoda', 'Озода'),
      L(['Malika', 'Nilufar', 'Sevara', "Aniqlab bo'lmaydi"], ['Малика', 'Нилуфар', 'Севара', 'Определить нельзя'])],
    v8: [L("Agar yomg'ir yog'sa, yo'l ho'l bo'ladi. Yo'l ho'l emas. Demak:", 'Если идёт дождь, дорога мокрая. Дорога не мокрая. Значит:'), L("Yomg'ir yog'magan", 'Дождя не было'),
      L(["Yomg'ir yog'gan", "Yo'l keyinroq ho'l bo'ladi", "Aniqlab bo'lmaydi"], ['Дождь был', 'Дорога намокнет позже', 'Определить нельзя'])]
  });
  const ORDER = ['s1', 'v1', 'm1', 's3', 'v3', 'm2', 's2', 'v2', 'm3', 's5', 'v4', 'm4', 's4', 'v6', 'm5', 's6', 'v5', 'm6', 's7', 'v8', 'm8', 's8', 'v7', 'm7'];
  const secName = k => ({ s: L('Sonlar qatori', 'Числовые ряды'), v: L('Mantiqiy masalalar', 'Логические задачи'), m: L('Shakl matritsalari', 'Матрицы фигур') })[k];
  const LIMIT = 25 * 60;

  TESTS.logic = {
    name: { uz: 'Mantiqiy fikrlash testi', ru: 'Тест логического мышления' },
    desc: { uz: "Sonlar qatori, mantiqiy masalalar va shakl matritsalari: abstrakt fikrlash va qonuniyatni topish qobiliyatini o'lchaydi.", ru: 'Числовые ряды, логические задачи и матрицы фигур: измеряет абстрактное мышление и умение находить закономерности.' },
    instr: { uz: '', ru: '' }, minutes: 25, items: { uz: ORDER, ru: ORDER }, options: { uz: [''], ru: [''] }, bands: [], reverse: [], source: 'PsixoLab'
  };

  let lg = null;
  function buildItems() {
    const V = VB();
    return ORDER.map(id => {
      const k = id[0];
      if (k === 'm') { const m = MX[id]; const opts = shuffle([{ s: m.ans, ok: true }].concat(m.dis.map(s => ({ s, ok: false })))); return { id, k, m, opts }; }
      const [q, a, d] = k === 's' ? SER[id] : V[id];
      return { id, k, q, opts: shuffle([{ t: a, ok: true }].concat(d.map(x => ({ t: x, ok: false })))) };
    });
  }
  function viewLogicIntro() {
    app.innerHTML = `
      <a href="#tests">← ${t('back')}</a>
      <h1>${esc(TESTS.logic.name[lang])}</h1>
      <div class="card logic-intro">
        <p>${esc(L("Test 24 ta savoldan iborat: sonlar qatori, mantiqiy masalalar va shakl matritsalari. Har bir savolda qonuniyatni toping va bitta to'g'ri javobni tanlang.", 'Тест состоит из 24 заданий: числовые ряды, логические задачи и матрицы фигур. В каждом найдите закономерность и выберите один правильный ответ.'))}</p>
        <ul>
          <li>${esc(L('Vaqt: 25 daqiqa. Vaqt tugasa, test avtomatik yakunlanadi.', 'Время: 25 минут. Когда время истечёт, тест завершится автоматически.'))}</li>
          <li>${esc(L("Savollarni o'tkazib yuborib, keyin qaytishingiz mumkin.", 'Можно пропускать задания и возвращаться к ним.'))}</li>
          <li>${esc(L("Qog'oz va ruchkadan foydalansangiz bo'ladi, kalkulyatordan — yo'q.", 'Можно пользоваться бумагой и ручкой, калькулятором — нет.'))}</li>
          <li>${esc(L("Tinch joyda, chalg'imasdan bajaring.", 'Выполняйте в тихом месте, не отвлекаясь.'))}</li>
        </ul>
        <p class="meta">${esc(L("Bu PsixoLab'ning original testi. Natija to'g'ri javoblar soni bilan ko'rsatiladi; IQ ballini aniq bermaydi. Yetarli ma'lumot yig'ilgach, me'yorlar qo'shiladi.", 'Это оригинальный тест PsixoLab. Результат показывается числом верных ответов; точный балл IQ он не даёт. Нормы будут добавлены, когда наберётся достаточно данных.'))}</p>
        <div class="row-actions"><button class="btn big" id="lgo">${L('Testni boshlash', 'Начать тест')}</button></div>
      </div>`;
    $('lgo').onclick = () => { lg = { items: buildItems(), ans: Array(24).fill(null), i: 0, start: Date.now() }; lg.timer = setInterval(tick, 1000); viewLogicQ(); };
  }
  function left() { return Math.max(0, LIMIT - Math.floor((Date.now() - lg.start) / 1000)); }
  function tick() {
    if (!lg) return;
    if (!$('ltime')) { clearInterval(lg.timer); lg = null; return; }
    const s = left(); $('ltime').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    $('ltime').classList.toggle('low', s <= 120);
    if (s <= 0) finishLogic();
  }
  function viewLogicQ() {
    const it = lg.items[lg.i], n = lg.items.length;
    const body = it.k === 'm'
      ? `<p class="lq-text">${esc(L("Qonuniyatni toping: savol belgisi o'rniga qaysi shakl keladi?", 'Найдите закономерность: какая фигура должна стоять вместо знака вопроса?'))}</p>${gridSvg(it.m.cell)}`
      : `<p class="lq-text ${it.k === 's' ? 'lq-series' : ''}">${esc(it.q)}</p>${it.k === 's' ? `<p class="meta">${esc(L("Qatorni davom ettiring: keyingi son qaysi?", 'Продолжите ряд: какое число следующее?'))}</p>` : ''}`;
    app.innerHTML = `
      <div class="lq-bar"><span>${lg.i + 1} / ${n} · ${esc(secName(it.k))}</span><span class="ltime" id="ltime"></span></div>
      <div class="lq-dots">${lg.items.map((_, j) => `<button class="lq-dot ${j === lg.i ? 'cur' : ''} ${lg.ans[j] !== null ? 'done' : ''}" data-j="${j}" aria-label="${j + 1}">${j + 1}</button>`).join('')}</div>
      <div class="card lq">
        ${body}
        <div class="lq-opts ${it.k === 'm' ? 'mx' : ''}">${it.opts.map((o, j) => `<button class="lq-opt ${lg.ans[lg.i] === j ? 'sel' : ''}" data-o="${j}">${it.k === 'm' ? optSvg(o.s) : esc(o.t)}</button>`).join('')}</div>
        <div class="row-actions lq-nav">
          <button class="btn secondary" id="lprev" ${lg.i === 0 ? 'disabled' : ''}>${L('Oldingi', 'Назад')}</button>
          ${lg.i < n - 1 ? `<button class="btn secondary" id="lnext">${L('Keyingi', 'Далее')}</button>` : ''}
          <button class="btn" id="lfin">${L('Yakunlash', 'Завершить')}</button>
        </div>
      </div>`;
    tick();
    app.querySelectorAll('.lq-opt').forEach(b => b.onclick = () => {
      lg.ans[lg.i] = +b.dataset.o;
      app.querySelectorAll('.lq-opt').forEach(x => x.classList.toggle('sel', x === b));
      setTimeout(() => { if (lg && lg.i < n - 1) { lg.i++; viewLogicQ(); } else if (lg) viewLogicQ(); }, 260);
    });
    app.querySelectorAll('.lq-dot').forEach(b => b.onclick = () => { lg.i = +b.dataset.j; viewLogicQ(); });
    $('lprev').onclick = () => { lg.i--; viewLogicQ(); };
    if ($('lnext')) $('lnext').onclick = () => { lg.i++; viewLogicQ(); };
    $('lfin').onclick = () => {
      const miss = lg.ans.filter(a => a === null).length;
      if (miss && !confirmBox(L(`${miss} ta savolga javob berilmagan. Baribir yakunlaysizmi?`, `Без ответа осталось заданий: ${miss}. Всё равно завершить?`))) return;
      finishLogic();
    };
    window.scrollTo(0, 0);
  }
  function confirmBox(msg) {
    // Brauzer dialogi o'rniga sahifa ichidagi tasdiq
    const nav = app.querySelector('.lq-nav');
    if (nav.dataset.ask) return true;
    nav.dataset.ask = '1';
    nav.insertAdjacentHTML('beforebegin', `<p class="notice warn">${esc(msg)} ${esc(L('Tasdiqlash uchun "Yakunlash"ni yana bosing.', 'Чтобы подтвердить, нажмите «Завершить» ещё раз.'))}</p>`);
    return false;
  }
  const levelLogic = p => p >= .8 ? L('Yuqori natija', 'Высокий результат') : p >= .55 ? L("O'rtacha natija", 'Средний результат') : p >= .35 ? L("O'rtachadan pastroq natija", 'Результат ниже среднего') : L('Past natija', 'Низкий результат');
  function finishLogic() {
    if (!lg) return;
    clearInterval(lg.timer);
    const res = lg.items.map((it, j) => (lg.ans[j] !== null && it.opts[lg.ans[j]].ok ? 1 : 0));
    const sec = { s: 0, v: 0, m: 0 };
    lg.items.forEach((it, j) => { sec[it.k] += res[j]; });
    const score = res.reduce((a, b) => a + b, 0);
    const time = Math.min(LIMIT, Math.round((Date.now() - lg.start) / 1000));
    const byId = {}; lg.items.forEach((it, j) => { byId[it.id] = res[j]; });
    const ansKey = ORDER.map(id => byId[id]); // savollar doimiy tartibda (s1, v1, m1, ...)
    const blank = lg.ans.filter(a => a === null).length;
    lg = null;
    saveResult({ type: 'test', id: 'logic', score, max: 24, s: sec.s, v: sec.v, m: sec.m, time, blank, ans: ansKey });
    showLogic({ score, sec, time, blank });
  }
  function showLogic({ score, sec, time, blank }) {
    const p = score / 24;
    app.innerHTML = `
      <h1>${esc(TESTS.logic.name[lang])}</h1>
      <div class="card">
        <div class="score">${score} / 24</div>
        <p><strong>${esc(levelLogic(p))}</strong> · ${L('sarflangan vaqt', 'затрачено времени')}: ${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}${blank ? ` · ${L('javobsiz', 'без ответа')}: ${blank}` : ''}</p>
        <div class="profile">${['s', 'v', 'm'].map(k => `
          <div class="trait"><div class="trait-head"><strong>${esc(secName(k))}</strong><span>${sec[k]} / 8</span></div><div class="bar"><div style="width:${sec[k] / 8 * 100}%"></div></div></div>`).join('')}</div>
        <div class="conclusion"><h2>${L('Xulosa', 'Заключение')}</h2>
          <p>${esc(logicText(p, sec))}</p>
          <p class="meta">${esc(L("Natija bitta urinishga asoslangan va kayfiyat, charchoq, chalg'ish kabi omillarga bog'liq. Bu test IQ ballini bermaydi: PsixoLab'ning o'zbek tanlanmasi bo'yicha me'yorlari tayyorlanmoqda.", 'Результат основан на одной попытке и зависит от настроения, усталости, отвлечений. Тест не даёт балл IQ: нормы PsixoLab по узбекской выборке готовятся.'))}</p></div>
        <div class="row-actions"><a class="btn" href="#plan">${L('Rivojlanish xaritasi', 'Карта развития')}</a><a class="btn secondary" href="#results">${t('toResults')}</a></div>
      </div>`;
  }
  function logicText(p, sec) {
    const best = Object.entries(sec).sort((a, b) => b[1] - a[1])[0][0], worst = Object.entries(sec).sort((a, b) => a[1] - b[1])[0][0];
    const base = p >= .8 ? L("Siz qonuniyatlarni tez va aniq topasiz: abstrakt fikrlashingiz kuchli.", 'Вы быстро и точно находите закономерности: у вас сильное абстрактное мышление.')
      : p >= .55 ? L("Abstrakt fikrlash va qonuniyatni topish qobiliyatingiz yaxshi darajada. Qiyin topshiriqlarda shoshilmaslik natijani oshiradi.", 'Способность к абстрактному мышлению и поиску закономерностей на хорошем уровне. На сложных заданиях помогает не спешить.')
        : L("Bu safar ko'p savollar qiyinlik qildi. Mantiqiy masalalar, sonli boshqotirmalar va shaxmat kabi o'yinlar bu ko'nikmani yaxshi rivojlantiradi; dam olib qayta urinib ko'ring.", 'В этот раз многие задания вызвали трудности. Логические задачи, числовые головоломки и игры вроде шахмат хорошо развивают этот навык; отдохните и попробуйте снова.');
    return best === worst ? base : `${base} ${L('Eng kuchli tomoningiz', 'Сильнее всего у вас')}: ${secName(best).toLowerCase()}; ${L("ko'proq mashq kerak", 'больше тренировки нужно')}: ${secName(worst).toLowerCase()}.`;
  }

  /* ============ 2. Xarakter aksentuatsiyalari (Leongard tipologiyasi asosida) ============ */
  const ACC = [
    ['hyper', 'Gipertim', 'Гипертимный', [
      ["Ko'pincha kayfiyatim ko'tarinki va quvnoq bo'ladi.", 'Обычно у меня бодрое и весёлое настроение.'],
      ['Yangi odamlar bilan tez tanishib ketaman.', 'Я быстро знакомлюсь с новыми людьми.'],
      ['Bir joyda uzoq jim o\'tirish men uchun qiyin.', 'Мне трудно долго сидеть спокойно на одном месте.'],
      ['Qiyinchiliklar odatda kayfiyatimni uzoq buzolmaydi.', 'Трудности обычно ненадолго портят мне настроение.'],
      ["Davrada ko'pincha men gapiraman va hammani gapga solaman.", 'В компании я часто больше всех говорю и всех расшевеливаю.'],
      ["Bir vaqtning o'zida bir nechta ishni boshlab yuborishni yoqtiraman.", 'Я люблю браться сразу за несколько дел.'],
      ["Charchoqni kam his qilaman, kuchim ko'p.", 'Я редко чувствую усталость, у меня много сил.']]],
    ['dysthym', 'Distim', 'Дистимный', [
      ["Ko'pincha jiddiy va o'ychan kayfiyatda bo'laman.", 'Чаще всего я серьёзен(на) и задумчив(а).'],
      ["Shovqinli bazm va ko'ngilochar tadbirlar menga unchalik yoqmaydi.", 'Шумные праздники и развлечения мне не очень нравятся.'],
      ["Kelajak haqida o'ylaganda ko'proq yomon tomonlarini ko'raman.", 'Думая о будущем, я чаще замечаю плохое.'],
      ["Kayfiyatim ko'pincha sababsiz tushkun bo'ladi.", 'Моё настроение часто бывает подавленным без причины.'],
      ["Gapirishdan ko'ra tinglashni afzal ko'raman.", 'Я предпочитаю слушать, а не говорить.'],
      ["Ertalab o'zimni ko'pincha holsiz va ishtiyoqsiz his qilaman.", 'По утрам я часто чувствую себя вялым(ой), без желания что-то делать.'],
      ['Hayotdan quvonish menga boshqalarga qaraganda qiyinroq.', 'Радоваться жизни мне труднее, чем другим.']]],
    ['cyclo', 'Siklotim', 'Циклотимный', [
      ["Kayfiyatim bir necha kun ko'tarinki, keyin bir necha kun tushkun bo'ladi.", 'У меня бывают периоды: несколько дней приподнятое настроение, затем несколько дней подавленное.'],
      ["Ba'zida juda faol va serg'ayrat bo'laman, ba'zida hech narsa qilgim kelmaydi.", 'Иногда я очень активен(на), а иногда ничего не хочется делать.'],
      ['Bir xil vaziyat bir kuni meni quvontiradi, boshqa kuni zeriktiradi.', 'Одна и та же ситуация в один день меня радует, в другой — утомляет.'],
      ["Do'stlarim kayfiyatim tez-tez o'zgarishini aytishadi.", 'Друзья говорят, что у меня часто меняется настроение.'],
      ["Ishtiyoqim to'lqinsimon keladi: goh ko'p, goh deyarli yo'q.", 'Мой энтузиазм приходит волнами: то много, то почти нет.'],
      ["Ba'zan sababsiz juda xursand, ba'zan sababsiz g'amgin bo'laman.", 'Иногда я без причины очень весел(а), иногда без причины грустен(на).'],
      ["Muloqotga ehtiyojim davrga qarab goh ko'p, goh kam bo'ladi.", 'Моя потребность в общении то большая, то маленькая — смотря по периоду.']]],
    ['emotive', 'Emotiv', 'Эмотивный', [
      ["Kino yoki kitobdagi ta'sirli voqealardan ko'zimga yosh keladi.", 'Трогательные сцены в фильмах или книгах вызывают у меня слёзы.'],
      ["Boshqalarning dardini o'zimnikidek his qilaman.", 'Я переживаю чужую боль как свою.'],
      ["Qo'pol so'z meni uzoq vaqt xafa qilib yuradi.", 'Грубое слово надолго меня ранит.'],
      ["Tabiat, musiqa yoki san'at meni chuqur hayajonlantiradi.", 'Природа, музыка или искусство глубоко меня трогают.'],
      ['Yaqinlarimning muammolari meni juda qattiq tashvishlantiradi.', 'Проблемы близких сильно меня тревожат.'],
      ['Hayvonlarga yoki ojizlarga nisbatan shafqatsizlik meni larzaga soladi.', 'Жестокость к животным или слабым меня потрясает.'],
      ["Ko'nglim yumshoq, meni osongina xafa qilish mumkin.", 'У меня мягкий характер, меня легко обидеть.']]],
    ['demonstr', 'Demonstrativ', 'Демонстративный', [
      ['Diqqat markazida bo\'lishni yoqtiraman.', 'Я люблю быть в центре внимания.'],
      ["Kerak bo'lsa, his-tuyg'ularimni boshqalarga ta'sirli qilib ko'rsata olaman.", 'Если нужно, я могу ярко показать свои чувства, чтобы произвести впечатление.'],
      ["Sahnada chiqish yoki ko'pchilik oldida gapirish menga zavq beradi.", 'Мне нравится выступать на сцене или перед публикой.'],
      ['Boshqalar meni maqtashi men uchun juda muhim.', 'Мне очень важно, чтобы меня хвалили.'],
      ['Noqulay vaziyatdan chiqish uchun hikoyani biroz "bezab" aytishim mumkin.', 'Чтобы выйти из неловкой ситуации, я могу немного «приукрасить» рассказ.'],
      ["Kiyim va tashqi ko'rinishim bilan e'tiborni tortishni yoqtiraman.", 'Мне нравится привлекать внимание одеждой и внешностью.'],
      ["Meni e'tiborsiz qoldirishsa, juda xafa bo'laman.", 'Меня сильно задевает, когда на меня не обращают внимания.']]],
    ['stuck', 'Qotib qoluvchi', 'Застревающий', [
      ['Menga qilingan nohaqlikni uzoq vaqt unutolmayman.', 'Я долго не могу забыть несправедливость по отношению ко мне.'],
      ['Boshlagan ishimni har qanday holatda oxiriga yetkazishga intilaman.', 'Я стремлюсь любой ценой довести начатое до конца.'],
      ['Haqligimni isbotlash uchun bahsda oxirigacha turaman.', 'В споре я стою на своём до конца, чтобы доказать свою правоту.'],
      ['Xafa qilgan odamni kechirishim qiyin.', 'Мне трудно простить того, кто меня обидел.'],
      ['Yutuqlarim boshqalar tomonidan tan olinishi men uchun juda muhim.', 'Мне очень важно, чтобы мои достижения признавали.'],
      ["Ba'zan atrofdagilar menga yomonlik o'ylayapti, deb gumon qilaman.", 'Иногда я подозреваю, что окружающие желают мне зла.'],
      ["Bir fikr xayolimga o'rnashib qolsa, undan uzoq qutula olmayman.", 'Если какая-то мысль засела в голове, я долго не могу от неё избавиться.']]],
    ['pedant', 'Pedantik', 'Педантичный', [
      ["Ishimni bir necha marta tekshirmasam, xotirjam bo'lolmayman.", 'Я не успокоюсь, пока несколько раз не проверю свою работу.'],
      ['Narsalarim doim tartib bilan o\'z joyida turishi kerak.', 'Мои вещи всегда должны лежать по порядку на своих местах.'],
      ['Uydan chiqqach, eshik yoki gazni yopganimni tekshirish uchun qaytib kelaman.', 'Выйдя из дома, я возвращаюсь проверить, закрыл(а) ли дверь или газ.'],
      ["Muhim qaror qabul qilishdan oldin uzoq o'ylanib qolaman.", 'Перед важным решением я долго колеблюсь.'],
      ['Rejadan chetga chiqish meni bezovta qiladi.', 'Отступление от плана меня беспокоит.'],
      ["Ishni puxta bajarish uchun ko'pincha boshqalardan ko'proq vaqt sarflayman.", 'Чтобы сделать дело тщательно, я часто трачу больше времени, чем другие.'],
      ['Kichik xatolar ham meni qattiq bezovta qiladi.', 'Даже мелкие ошибки меня сильно беспокоят.']]],
    ['anxious', 'Xavotirli', 'Тревожный', [
      ["Bolaligimda qorong'ilikdan, itlardan yoki yolg'iz qolishdan qo'rqardim.", 'В детстве я боялся(лась) темноты, собак или оставаться один(одна).'],
      ["Notanish vaziyatda o'zimni ishonchsiz his qilaman.", 'В незнакомой обстановке я чувствую себя неуверенно.'],
      ['Imtihon yoki muhim uchrashuv oldidan qattiq hayajonlanaman.', 'Перед экзаменом или важной встречей я сильно волнуюсь.'],
      ["Yaqinlarim kechiksa, darhol yomon narsalarni o'ylay boshlayman.", 'Если близкие задерживаются, я сразу начинаю думать о плохом.'],
      ['Boshqalarga "yo\'q" deyish men uchun qiyin.', 'Мне трудно сказать другим «нет».'],
      ["Janjal va to'qnashuvlardan iloji boricha qochaman.", 'Я по возможности избегаю ссор и конфликтов.'],
      ["Ko'pincha biror narsa noto'g'ri bo'lib qolishidan xavotirlanaman.", 'Я часто беспокоюсь, что что-то пойдёт не так.']]],
    ['excit', "Qo'zg'aluvchan", 'Возбудимый', [
      ['Jahlim tez chiqadi.', 'Я быстро выхожу из себя.'],
      ['Jahl ustida keyin afsuslanadigan gaplarni aytib qo\'yaman.', 'В гневе я говорю то, о чём потом жалею.'],
      ['Kutib turish yoki navbatda turish meni asabiylashtiradi.', 'Ждать или стоять в очереди меня раздражает.'],
      ["Kimdir menga e'tiroz bildirsa, darhol qizishib ketaman.", 'Когда мне возражают, я сразу вспыхиваю.'],
      ['Charchaganimda arzimas narsa ham jahlimni chiqaradi.', 'Когда я устал(а), меня раздражает любая мелочь.'],
      ["Ba'zan o'zimni tuta olmay, ovozimni ko'tarib yuboraman.", 'Иногда я не сдерживаюсь и повышаю голос.'],
      ["Ko'pincha o'ylamasdan, his-tuyg'u ta'sirida harakat qilaman.", 'Я часто действую под влиянием эмоций, не подумав.']]],
    ['exalt', 'Ekzaltirlangan', 'Экзальтированный', [
      ['Kichik quvonch ham meni haddan tashqari xursand qiladi.', 'Даже маленькая радость приводит меня в восторг.'],
      ['Kichik muvaffaqiyatsizlik ham meni chuqur umidsizlikka soladi.', 'Даже небольшая неудача приводит меня в отчаяние.'],
      ["Kayfiyatim bir zumda zavqdan tushkunlikka o'tishi mumkin.", 'Моё настроение может мгновенно переходить от восторга к унынию.'],
      ["Odamlarga tez ko'ngil qo'yaman va ulardan tez hafsalam pir bo'ladi.", 'Я быстро увлекаюсь людьми и так же быстро в них разочаровываюсь.'],
      ["Hayajonlanganimda nafasim qisilgandek yoki yuragim tez urayotgandek bo'ladi.", 'Когда я волнуюсь, у меня перехватывает дыхание или сильно бьётся сердце.'],
      ["Go'zal manzara yoki ajoyib musiqa meni hayratga solib, uzoq ta'sirida yuraman.", 'Красивый пейзаж или прекрасная музыка восхищают меня, и я долго под впечатлением.'],
      ['Boshqalar his-tuyg\'ularimni "juda kuchli" deb hisoblashadi.', 'Окружающие считают мои чувства «слишком сильными».']]]
  ];
  const ACC_TEXT = () => ({
    hyper: [L("Faol, quvnoq, muloqotga ochiq. Yangi ishlarni tez boshlaysiz, qiyinchilikda tez tiklanasiz.", 'Активный, жизнерадостный, общительный. Быстро берётесь за новое и быстро восстанавливаетесь после трудностей.'),
      L("Ishni oxiriga yetkazmaslik, haddan tashqari tavakkal qilish va tartibni yoqtirmaslik ehtimoli bor. Bir vaqtda kamroq ishni tanlab, ularni yakunlashga e'tibor bering.", 'Возможны незавершённые дела, лишний риск и нелюбовь к порядку. Берите меньше дел одновременно и доводите их до конца.')],
    dysthym: [L("Jiddiy, vijdonli, chuqur o'ylaydigan. Do'stlikda sodiq va adolatlisiz.", 'Серьёзный, добросовестный, вдумчивый. Верны и справедливы в дружбе.'),
      L("Tushkunlikka moyillik va hayotning yaxshi tomonlarini kam ko'rish xavfi bor. Kayfiyat uzoq vaqt past bo'lsa, PHQ-9 testini topshirib, mutaxassis bilan maslahatlashing.", 'Есть склонность к пониженному настроению и недооценке хорошего. Если настроение долго снижено, пройдите PHQ-9 и посоветуйтесь со специалистом.')],
    cyclo: [L("Kayfiyat va faollik davrlarga bo'linib almashadi: ko'tarinki davrda serg'ayrat, pasaygan davrda vazmin bo'lasiz.", 'Настроение и активность сменяются периодами: на подъёме вы энергичны, на спаде — сдержанны.'),
      L("Muhim ishlarni ko'tarinki davrga rejalashtirish va pasaygan davrda o'zingizga ko'proq dam berish foydali. Kayfiyat o'zgarishlari kuchli bo'lsa, mutaxassisga murojaat qiling.", 'Полезно планировать важное на периоды подъёма, а на спаде давать себе больше отдыха. Если перепады сильные, обратитесь к специалисту.')],
    emotive: [L("Sezgir, mehribon, hamdard. Boshqalarning holatini nozik his qilasiz, san'at va tabiatni chuqur qabul qilasiz.", 'Чувствительный, добрый, сопереживающий. Тонко чувствуете других, глубоко воспринимаете искусство и природу.'),
      L("Xafagarchilikni ichda uzoq saqlash va boshqalarning dardini haddan tashqari o'zingizga olish xavfi bor. His-tuyg'ularni ishonchli odam bilan bo'lishish yordam beradi.", 'Есть риск долго носить обиды в себе и слишком принимать чужую боль. Помогает делиться чувствами с близким человеком.')],
    demonstr: [L("Artistik, ishontira oladigan, muloqotda yorqin. Boshqalarni ilhomlantirasiz, sahna va jamoatchilik oldida o'zingizni erkin his qilasiz.", 'Артистичный, убедительный, яркий в общении. Вдохновляете других, свободно чувствуете себя на публике.'),
      L("E'tiborga ehtiyoj kuchli bo'lsa, maqtovsiz qolganda xafa bo'lish yoki voqealarni bo'rttirib aytish mumkin. O'z qadringizni boshqalarning bahosiga emas, o'z yutuqlaringizga bog'lashga harakat qiling.", 'При сильной потребности во внимании возможны обиды без похвалы и склонность приукрашивать. Старайтесь опираться на свои достижения, а не на оценку других.')],
    stuck: [L("Maqsadga intiluvchan, qat'iyatli, adolatga sezgir. Boshlagan ishni oxiriga yetkazasiz.", 'Целеустремлённый, настойчивый, чувствительный к справедливости. Доводите начатое до конца.'),
      L("Xafagarchilik va shubhalarni uzoq saqlash, bahsda yon bermaslik munosabatlarni qiyinlashtirishi mumkin. Vaziyatga boshqa odam nuqtai nazaridan qarab ko'rish foydali.", 'Долгие обиды, подозрительность и неуступчивость в спорах могут осложнять отношения. Полезно смотреть на ситуацию глазами другого человека.')],
    pedant: [L("Puxta, mas'uliyatli, ishonchli. Tartib va aniqlik talab qiladigan ishda kuchlisiz.", 'Тщательный, ответственный, надёжный. Сильны в работе, требующей порядка и точности.'),
      L("Ortiqcha tekshirish, qaror qabul qilishda ikkilanish va o'zgarishlarga qiyin moslashish mumkin. \"Yetarlicha yaxshi\" mezonini oldindan belgilab olish yordam beradi.", 'Возможны лишние перепроверки, колебания при решениях и трудности с изменениями. Помогает заранее определить критерий «достаточно хорошо».')],
    anxious: [L("Ehtiyotkor, do'stona, o'z-o'ziga tanqidiy. Mas'uliyatni his qilasiz, boshqalarga nisbatan muloyimsiz.", 'Осторожный, дружелюбный, самокритичный. Ответственны и мягки с другими.'),
      L("Xavotir va o'ziga ishonchsizlik qaror qabul qilish va o'z fikrini himoya qilishga xalaqit berishi mumkin. Nafas mashqlari va GAD-7 testi bilan holatingizni kuzatib boring.", 'Тревога и неуверенность могут мешать принимать решения и отстаивать своё мнение. Полезны дыхательные упражнения; следите за состоянием с помощью GAD-7.')],
    excit: [L("Faol, tezkor, his-tuyg'ularini ochiq ifoda etadi. Keskin vaziyatda tez harakat qilasiz.", 'Активный, быстрый, открыто выражает чувства. В острой ситуации действуете быстро.'),
      L("Jahl tez chiqishi va o'ylamasdan harakat qilish ziddiyatlarga olib kelishi mumkin. Jahl kelganda 10 gacha sanash yoki vaziyatdan bir oz uzoqlashish kabi to'xtash usullarini mashq qiling.", 'Вспыльчивость и импульсивность могут приводить к конфликтам. Тренируйте приёмы паузы: счёт до 10 или ненадолго выйти из ситуации.')],
    exalt: [L("Hissiyotlari yorqin, ijodkor, ilhomlana oladigan. Go'zallikni va do'stlikni chuqur his qilasiz.", 'Яркие эмоции, творческий, способный вдохновляться. Глубоко чувствуете красоту и дружбу.'),
      L("Zavqdan umidsizlikka tez o'tish charchatishi mumkin. Kayfiyatni kundalikda kuzatish va voqealarni bir oz masofadan baholash yordam beradi.", 'Быстрые переходы от восторга к отчаянию утомляют. Помогает вести дневник настроения и оценивать события с некоторой дистанции.')]
  });
  const ACC_N = 7;
  const accOrder = () => { const o = []; for (let i = 0; i < ACC_N; i++) ACC.forEach((sc, s) => o.push([s, i])); return o; };
  const accName = s => (lang === 'ru' ? ACC[s][2] : ACC[s][1]);
  const accLevel = v => v >= 5 ? L('aksentuatsiya belgisi', 'признак акцентуации') : v >= 3 ? L('tendensiya', 'тенденция') : L('ifodalanmagan', 'не выражено');

  TESTS.accent = {
    name: { uz: 'Xarakter aksentuatsiyalari (Leongard tipologiyasi)', ru: 'Акцентуации характера (типология Леонгарда)' },
    desc: { uz: "Xarakterning 10 ta yorqin ifodalangan qirrasini aniqlaydi: gipertim, distim, siklotim, emotiv, demonstrativ, qotib qoluvchi, pedantik, xavotirli, qo'zg'aluvchan va ekzaltirlangan.", ru: 'Выявляет 10 ярко выраженных черт характера: гипертимную, дистимную, циклотимную, эмотивную, демонстративную, застревающую, педантичную, тревожную, возбудимую и экзальтированную.' },
    instr: { uz: '', ru: '' }, minutes: 12,
    items: { uz: accOrder().map(([s, i]) => ACC[s][3][i][0]), ru: accOrder().map(([s, i]) => ACC[s][3][i][1]) },
    options: { uz: ['Ha', "Yo'q"], ru: ['Да', 'Нет'] }, bands: [], reverse: [], source: 'PsixoLab'
  };

  function viewAccent() {
    const ord = accOrder();
    app.innerHTML = `
      <a href="#tests">← ${t('back')}</a>
      <h1>${esc(TESTS.accent.name[lang])}</h1>
      <p><strong>${t('instructionPrefix')}</strong> ${esc(L("Har bir fikr sizga xos bo'lsa \"Ha\", xos bo'lmasa \"Yo'q\" deb javob bering. Uzoq o'ylamang: birinchi kelgan javob odatda eng to'g'risi.", 'Если утверждение вам свойственно, ответьте «Да», если нет — «Нет». Не раздумывайте долго: первый ответ обычно самый точный.'))}</p>
      <div class="progress"><div id="prog" style="width:0%"></div></div>
      <form id="tform">
        ${ord.map(([s, i], k) => `
          <div class="question"><p>${k + 1}. ${esc(ACC[s][3][i][lang === 'ru' ? 1 : 0])}</p>
            <div class="options"><label><input type="radio" name="q${k}" value="1">${L('Ha', 'Да')}</label><label><input type="radio" name="q${k}" value="0">${L("Yo'q", 'Нет')}</label></div>
          </div>`).join('')}
        <p id="terr" class="notice danger" hidden>${esc(t('answerAll'))}</p>
        <button class="btn" type="submit">${t('submit')}</button>
      </form>
      <p class="meta">${esc(L("So'rovnoma savollari K. Leongard tipologiyasi asosida PsixoLab tomonidan yozilgan; bu Shmishek so'rovnomasining aynan o'zi emas.", 'Вопросы составлены PsixoLab на основе типологии К. Леонгарда; это не опросник Шмишека.'))}</p>`;
    const form = $('tform');
    form.addEventListener('change', () => {
      const n = ord.filter((_, k) => form.querySelector(`input[name=q${k}]:checked`)).length;
      $('prog').style.width = (n / ord.length * 100) + '%';
    });
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const ans = ord.map((_, k) => { const c = form.querySelector(`input[name=q${k}]:checked`); return c ? +c.value : null; });
      if (ans.includes(null)) { $('terr').hidden = false; const first = ans.indexOf(null); form.querySelectorAll('.question')[first].scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const sc = {}; ACC.forEach(a => { sc[a[0]] = 0; });
      ord.forEach(([s], k) => { sc[ACC[s][0]] += ans[k]; });
      saveResult({ type: 'test', id: 'accent', sc });
      showAccent(sc);
    });
  }
  function showAccent(sc) {
    const TX = ACC_TEXT();
    const sorted = ACC.map((a, s) => ({ k: a[0], s, v: sc[a[0]] })).sort((a, b) => b.v - a.v);
    const marked = sorted.filter(x => x.v >= 5);
    app.innerHTML = `
      <h1>${esc(TESTS.accent.name[lang])}</h1>
      <div class="card">
        <div class="acc-chart">${ACC.map((a, s) => { const v = sc[a[0]]; return `
          <div class="acc-row ${v >= 5 ? 'hi' : v >= 3 ? 'mid' : ''}"><span class="acc-n">${esc(accName(s))}</span><div class="acc-bar"><div style="width:${Math.max(3, v / ACC_N * 100)}%"></div><i style="left:${3 / ACC_N * 100}%"></i><i style="left:${5 / ACC_N * 100}%"></i></div><span class="acc-v">${v}<small>/7</small></span><span class="acc-l">${esc(accLevel(v))}</span></div>`; }).join('')}</div>
        <p class="meta">${esc(L("Har bir shkala 0–7 ball: 5–7 — aksentuatsiya belgisi, 3–4 — tendensiya, 0–2 — ifodalanmagan.", 'Каждая шкала 0–7 баллов: 5–7 — признак акцентуации, 3–4 — тенденция, 0–2 — не выражено.'))}</p>
        <div class="conclusion"><h2>${L('Xulosa', 'Заключение')}</h2>
          ${marked.length ? marked.map(x => `<p><strong>${esc(accName(x.s))} (${x.v}/7).</strong> ${esc(TX[x.k][0])} ${esc(TX[x.k][1])}</p>`).join('')
            : `<p>${esc(L("Yaqqol ifodalangan aksentuatsiya aniqlanmadi: xarakteringizda turli qirralar muvozanatda.", 'Ярко выраженных акцентуаций не выявлено: черты характера у вас сбалансированы.'))} ${sorted[0].v >= 3 ? esc(L(`Nisbatan kuchliroq tendensiya: ${accName(sorted[0].s).toLowerCase()}.`, `Относительно более выраженная тенденция: ${accName(sorted[0].s).toLowerCase()}.`)) : ''}</p>`}
          <p class="meta">${esc(L("Aksentuatsiya — kasallik emas, balki xarakterning me'yor doirasidagi yorqin qirrasi. Bu test skrining vositasi bo'lib, original so'rovnoma hisoblanadi; me'yorlari hali tekshirilmoqda.", 'Акцентуация — не болезнь, а яркая черта характера в пределах нормы. Это скрининговый оригинальный опросник; его нормы ещё проверяются.'))}</p></div>
        <div class="row-actions"><a class="btn" href="#test/accent">${t('retake')}</a><a class="btn secondary" href="#results">${t('toResults')}</a></div>
      </div>`;
  }

  /* ============ Natijalar jadvali va marshrut ============ */
  const _desc = describe;
  describe = function (r) {
    if (r.type === 'test' && r.id === 'logic') return { name: TESTS.logic.name[lang], result: `${r.score} / 24`, note: `${secName('s')} ${r.s}/8; ${secName('v')} ${r.v}/8; ${secName('m')} ${r.m}/8` };
    if (r.type === 'test' && r.id === 'accent' && r.sc) {
      const top = ACC.map((a, s) => ({ s, v: r.sc[a[0]] || 0 })).sort((a, b) => b.v - a.v);
      const hi = top.filter(x => x.v >= 5);
      return { name: TESTS.accent.name[lang], result: top.slice(0, 3).map(x => `${accName(x.s)} ${x.v}`).join(', '),
        note: hi.length ? L('Aksentuatsiya belgilari: ', 'Признаки акцентуации: ') + hi.map(x => accName(x.s)).join(', ') : L("Yaqqol aksentuatsiya yo'q", 'Ярких акцентуаций нет') };
    }
    return _desc(r);
  };
  window.PL_LOGIC_ORDER = ORDER;

  const st = document.createElement('style');
  st.textContent = `
  .logic-intro ul{margin:.2rem 0 .6rem;padding-left:1.2rem;color:var(--text)}
  .lq-bar{display:flex;justify-content:space-between;align-items:center;font-weight:700;color:#ECE8FF;margin-bottom:.6rem}
  .ltime{font-family:var(--display);font-size:1.25rem;background:rgba(201,190,255,.14);padding:.25rem .8rem;border-radius:999px;font-variant-numeric:tabular-nums}
  .ltime.low{background:var(--rose);color:#fff}
  .lq-dots{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:1rem}
  .lq-dot{width:30px;height:30px;border-radius:8px;border:0;background:rgba(201,190,255,.14);color:#ECE8FF;font-weight:700;font-size:.78rem;cursor:pointer;font-family:var(--sans)}
  .lq-dot.done{background:var(--lilac);color:var(--night)}
  .lq-dot.cur{outline:2px solid var(--mint);outline-offset:1px}
  .lq{align-items:stretch}
  .lq-text{font-size:1.15rem;font-weight:700;color:var(--text);margin:.2rem 0 .6rem}
  .lq-series{font-family:var(--display);font-size:clamp(1.3rem,4vw,1.9rem);letter-spacing:.02em}
  .mx-grid{width:min(100%,340px);display:block;margin:.4rem auto 1rem}
  .lq-opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.55rem;margin:.6rem 0}
  .lq-opts.mx{grid-template-columns:repeat(3,minmax(0,110px));justify-content:center}
  .lq-opt{border:2px solid var(--border);background:#fff;color:var(--text);border-radius:14px;padding:.75rem 1rem;font:600 1rem var(--sans);cursor:pointer;text-align:left;transition:border-color .12s,background .12s}
  .lq-opts.mx .lq-opt{padding:.4rem;aspect-ratio:1}
  .lq-opt:hover{border-color:var(--accent)}
  .lq-opt.sel{border-color:var(--accent);background:var(--accent-soft);box-shadow:0 0 0 3px rgba(91,71,224,.25)}
  .mx-opt{width:100%;height:100%;display:block}
  .lq-nav{justify-content:space-between}
  .acc-chart{display:flex;flex-direction:column;gap:.55rem;margin:.3rem 0 .8rem}
  .acc-row{display:grid;grid-template-columns:9.5rem 1fr 3rem 9rem;align-items:center;gap:.8rem}
  .acc-n{font-weight:700;color:var(--text);font-size:.92rem}
  .acc-bar{position:relative;height:14px;background:#EEEBFB;border-radius:99px}
  .acc-bar div{height:100%;background:#B9B0E6;border-radius:99px}
  .acc-bar i{position:absolute;top:-3px;bottom:-3px;width:2px;background:rgba(30,26,77,.18)}
  .acc-row.mid .acc-bar div{background:#8B7BFF}.acc-row.hi .acc-bar div{background:var(--accent)}
  .acc-v{font-family:var(--display);font-weight:600;color:var(--text)}.acc-v small{color:var(--muted);font-family:var(--sans);font-weight:600}
  .acc-l{font-size:.82rem;color:var(--muted)}.acc-row.hi .acc-l{color:var(--accent);font-weight:700}
  @media (max-width:640px){.acc-row{grid-template-columns:1fr 2.6rem;row-gap:.25rem}.acc-bar{grid-column:1/-1;grid-row:2}.acc-l{display:none}.lq-opts.mx{grid-template-columns:repeat(3,1fr)}}`;
  document.head.appendChild(st);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    if (lg && !(location.hash || '').startsWith('#test/logic')) { clearInterval(lg.timer); lg = null; }
    _route();
    const [pg, arg] = (location.hash || '#home').slice(1).split('/');
    if (pg === 'test' && arg === 'logic') { if (lg) viewLogicQ(); else viewLogicIntro(); window.scrollTo(0, 0); }
    else if (pg === 'test' && arg === 'accent') { viewAccent(); window.scrollTo(0, 0); }
  };
  window.addEventListener('hashchange', route);
  route();
})();
