/* PsixoLab — Asab tizimi kuchini aniqlash: tepping-test (Ye. P. Ilin metodikasi)
   6 ta 5 soniyalik oraliqda maksimal tezlikda bosish; tezlik dinamikasi egri chizig'i shakliga qarab
   asab tizimi kuchi (qavariq, tekis, oraliq, botiq, pasayuvchi) aniqlanadi. */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const $ = id => document.getElementById(id);
  const PER = 5, NP = 6;

  Object.assign(T.uz, { tapTitle: 'Tepping-test (asab tizimi kuchi)', tapDesc: "30 soniya davomida imkon qadar tez bosing: tezlikning o'zgarishiga qarab asab tizimingiz kuchi va chidamliligi aniqlanadi (Ye. P. Ilin metodikasi)." });
  Object.assign(T.ru, { tapTitle: 'Теппинг-тест (сила нервной системы)', tapDesc: 'В течение 30 секунд нажимайте как можно быстрее: по динамике темпа определяется сила и выносливость нервной системы (методика Е. П. Ильина).' });
  EXPERIMENTS.push({ id: 'tapping', title: 'tapTitle', desc: 'tapDesc', minutes: 2 });

  const SHAPES = () => ({
    convex: { n: L("Qavariq egri chiziq", 'Выпуклая кривая'), s: L('Kuchli asab tizimi', 'Сильная нервная система'), lvl: 5,
      d: L("Tezlik dastlabki 10–15 soniyada oshdi, keyin pasaydi. Bu kuchli asab tizimiga xos: siz uzoq va jadal yuklamaga chidamlisiz, stress paytida safarbar bo'lasiz, qiyin vaziyatda ishchanligingiz pasaymaydi.", 'Темп вырос в первые 10–15 секунд, затем снизился. Это характерно для сильной нервной системы: вы выносливы к длительной и интенсивной нагрузке, мобилизуетесь в стрессе, в трудной ситуации работоспособность не падает.'),
      a: L("Kuchingizni bir xil ishga emas, qiyin va mas'uliyatli vazifalarga sarflang; dam olishni ham rejalashtiring — kuchli asab tizimi ham charchaydi.", 'Направляйте силы на сложные и ответственные задачи, а не на монотонные; планируйте и отдых — сильная нервная система тоже устаёт.') },
    even: { n: L('Tekis egri chiziq', 'Ровная кривая'), s: L("O'rtacha kuchli asab tizimi", 'Нервная система средней силы'), lvl: 4,
      d: L("Tezlik butun 30 soniya davomida deyarli bir xil saqlandi. Bu o'rtacha kuchli asab tizimini ko'rsatadi: bir maromda uzoq ishlay olasiz, ishchanligingiz barqaror.", 'Темп почти не менялся все 30 секунд. Это говорит о нервной системе средней силы: вы способны долго работать в ровном темпе, работоспособность стабильна.'),
      a: L("Bir maromli, rejali ish sizga mos; keskin, kutilmagan yuklamalar oldidan qisqa tayyorgarlik qiling.", 'Вам подходит ровная плановая работа; перед резкими, неожиданными нагрузками делайте короткую подготовку.') },
    mid: { n: L("Oraliq egri chiziq", 'Промежуточная кривая'), s: L("O'rtacha-kuchsiz asab tizimi", 'Средне-слабая нервная система'), lvl: 3,
      d: L("Dastlabki 10–15 soniyada tezlik saqlandi, keyin pasaydi. Bu o'rtacha-kuchsiz asab tizimiga xos: qisqa muddatli jadal ishni yaxshi bajarasiz, lekin uzoq yuklamada tez charchaysiz.", 'Первые 10–15 секунд темп держался, затем снизился. Это характерно для средне-слабой нервной системы: короткую интенсивную работу вы выполняете хорошо, но при длительной нагрузке быстро устаёте.'),
      a: L("Ishni qisqa bloklarga bo'lib, oraliqda tanaffus qiling (masalan, 25 daqiqa ish — 5 daqiqa dam).", 'Делите работу на короткие блоки с перерывами (например, 25 минут работы — 5 минут отдыха).') },
    concave: { n: L('Botiq egri chiziq', 'Вогнутая кривая'), s: L("O'rtacha-kuchsiz asab tizimi", 'Средне-слабая нервная система'), lvl: 3,
      d: L("Tezlik avval pasaydi, keyin qisqa muddatga yana ko'tarildi. Bu o'rtacha-kuchsiz asab tizimiga xos: siz qisqa muddat qayta safarbar bo'la olasiz, lekin bu ko'p kuch talab qiladi.", 'Темп сначала снизился, затем ненадолго снова вырос. Это характерно для средне-слабой нервной системы: вы способны кратковременно мобилизоваться, но это требует больших усилий.'),
      a: L("Muhim ishlardan oldin yaxshi dam oling, ish kunining eng samarali vaqtini aniqlab, qiyin vazifalarni shu vaqtga qo'ying.", 'Перед важными делами хорошо отдыхайте, определите своё самое продуктивное время дня и ставьте сложные задачи на него.') },
    desc: { n: L('Pasayuvchi egri chiziq', 'Нисходящая кривая'), s: L('Kuchsiz asab tizimi', 'Слабая нервная система'), lvl: 2,
      d: L("Tezlik ikkinchi oraliqdan boshlab pasayib bordi. Bu kuchsiz (lekin juda sezgir) asab tizimiga xos: siz nozik o'zgarishlarni sezasiz, puxta va ehtiyotkor ishlaysiz, ammo uzoq va kuchli yuklamada tez charchaysiz.", 'Темп снижался начиная со второго интервала. Это характерно для слабой (но очень чувствительной) нервной системы: вы замечаете тонкие изменения, работаете тщательно и осторожно, но быстро устаёте от длительной и сильной нагрузки.'),
      a: L("Kuchsiz asab tizimi — kamchilik emas: u yuqori sezgirlik bilan bog'liq. Ish va dam olish rejimiga, uyquga e'tibor bering, shovqinli va shoshilinch muhitdan iloji boricha saqlaning.", 'Слабая нервная система — не недостаток: она связана с высокой чувствительностью. Следите за режимом труда, отдыха и сна, по возможности избегайте шумной и спешной обстановки.') }
  });
  function classify(c) {
    const b = c[0] || 1, d = c.map(v => (v - b) / b), tol = 0.08;
    const rest = d.slice(1);
    if (rest.every(x => Math.abs(x) <= tol)) return 'even';
    const iMax = d.indexOf(Math.max(...d));
    if (d[iMax] > tol && iMax <= 3) return 'convex';
    const minEarly = Math.min(d[1], d[2], d[3]);
    if (minEarly < -tol && d[5] >= d[3] + tol / 2 && d[5] >= -tol) return 'concave';
    if (Math.abs(d[1]) <= tol && Math.abs(d[2]) <= tol && (d[4] < -tol || d[5] < -tol)) return 'mid';
    if (d[1] < -tol / 2 && d[5] < -tol) return 'desc';
    // aniq shaklga tushmasa — umumiy yo'nalishga qarab
    const slope = (d[4] + d[5]) / 2 - (d[1] + d[2]) / 2;
    return slope < -tol ? 'mid' : 'even';
  }
  function curveSvg(c) {
    const W = 520, H = 230, P = 40, mx = Math.max(...c) * 1.15, mn = Math.min(...c) * 0.8;
    const X = i => P + i * (W - 2 * P) / (NP - 1), Y = v => H - P - (v - mn) / (mx - mn || 1) * (H - 2 * P);
    const pts = c.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    return `<svg viewBox="0 0 ${W} ${H}" class="curve tap-curve">
      <line x1="${P}" y1="${Y(c[0])}" x2="${W - P}" y2="${Y(c[0])}" stroke="#B9B0E6" stroke-dasharray="6 6" stroke-width="2"/>
      <polyline points="${pts}" fill="none" stroke="#5B47E0" stroke-width="4" stroke-linejoin="round"/>
      ${c.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="6" fill="#5B47E0"/><text x="${X(i)}" y="${Y(v) - 12}" text-anchor="middle" font-size="14" font-weight="700" fill="#1E1A4D">${v}</text><text x="${X(i)}" y="${H - 12}" text-anchor="middle" font-size="12" fill="#625D8F">${(i + 1) * PER}s</text>`).join('')}
    </svg>`;
  }

  let run = null;
  function viewTap() {
    if (run) stopRun();
    app.innerHTML = `
      <a href="#experiments">← ${t('back')}</a>
      <h1>${esc(t('tapTitle'))}</h1>
      <div class="card">
        <p>${esc(L("Ishlaydigan qo'lingizning ko'rsatkich barmog'i bilan pastdagi maydonni 30 soniya davomida IMKON QADAR TEZ bosing (kompyuterda — sichqoncha yoki «Probel» tugmasi). Har 5 soniyada maydon o'zi keyingi bo'limga o'tadi — to'xtamang, butun 30 soniya davomida eng yuqori tezlikda bosing.", 'Указательным пальцем ведущей руки нажимайте на поле внизу КАК МОЖНО БЫСТРЕЕ в течение 30 секунд (на компьютере — мышью или клавишей «Пробел»). Каждые 5 секунд поле само переключается — не останавливайтесь, все 30 секунд нажимайте в максимальном темпе.'))}</p>
        <p class="meta">${esc(L("Bir xil sharoitda bajaring: bir xil qo'l, bir xil barmoq. Telefonda bajarish qulayroq.", 'Выполняйте в одинаковых условиях: одна и та же рука, один и тот же палец. Удобнее выполнять на телефоне.'))}</p>
        <div class="tap-cells">${Array.from({ length: NP }, (_, i) => `<div class="tap-cell" id="tc${i}"><b>${i + 1}</b><span id="tn${i}">—</span></div>`).join('')}</div>
        <button class="tap-pad" id="tpad" type="button">${L('Boshlash uchun bosing', 'Нажмите, чтобы начать')}</button>
        <p class="tap-time" id="ttime">30.0</p>
      </div>`;
    const pad = $('tpad');
    const press = ev => {
      if (ev) ev.preventDefault();
      if (!run) { start(); return; }
      if (run.done) return;
      const k = Math.min(NP - 1, Math.floor((performance.now() - run.t0) / (PER * 1000)));
      run.c[k]++; $('tn' + k).textContent = run.c[k];
      pad.classList.remove('hit'); void pad.offsetWidth; pad.classList.add('hit');
    };
    pad.addEventListener('pointerdown', press);
    pad.addEventListener('click', ev => ev.preventDefault());
    const key = ev => { if ((ev.code === 'Space' || ev.key === ' ') && !ev.repeat && $('tpad')) press(ev); };
    document.addEventListener('keydown', key);
    run = null;
    function start() {
      run = { c: Array(NP).fill(0), t0: performance.now(), done: false, key };
      pad.textContent = L('BOSING!', 'ЖМИТЕ!'); pad.classList.add('on');
      $('tn0').textContent = '0';
      run.iv = setInterval(() => {
        if (!$('tpad')) { stopRun(); return; }
        const el = (performance.now() - run.t0) / 1000, k = Math.min(NP - 1, Math.floor(el / PER));
        for (let i = 0; i < NP; i++) $('tc' + i).classList.toggle('cur', i === k);
        if ($('tn' + k).textContent === '—') $('tn' + k).textContent = '0';
        $('ttime').textContent = Math.max(0, 30 - el).toFixed(1);
        if (el >= PER * NP) finish();
      }, 50);
    }
    run = null;
    pad.dataset.ready = '1';
    viewTap._key = key;
  }
  function stopRun() { if (run) { clearInterval(run.iv); run.done = true; } if (viewTap._key) document.removeEventListener('keydown', viewTap._key); }
  function finish() {
    const c = run.c.slice(); stopRun(); run = null;
    const total = c.reduce((a, b) => a + b, 0);
    if (total < 30) {
      app.innerHTML = `<h1>${esc(t('tapTitle'))}</h1><div class="notice warn">${esc(L("Bosishlar juda kam bo'ldi — test to'g'ri bajarilmagan ko'rinadi. Butun 30 soniya davomida to'xtamasdan, imkon qadar tez bosing.", 'Слишком мало нажатий — похоже, тест выполнен неправильно. Нажимайте как можно быстрее, не останавливаясь все 30 секунд.'))}</div><p><a class="btn" href="#exp/tapping" onclick="setTimeout(route,0)">${t('retake')}</a></p>`;
      return;
    }
    const shape = classify(c), S = SHAPES()[shape], rate = Math.round(total / 30 * 10) / 10;
    saveResult({ type: 'exp', id: 'tapping', value: total, c, shape, rate });
    app.innerHTML = `
      <h1>${esc(t('tapTitle'))}</h1>
      <div class="card">
        <div class="score">${esc(S.s)}</div>
        <p><strong>${esc(S.n)}</strong> · ${L('jami', 'всего')} ${total} ${L('marta', 'нажатий')} · ${rate} ${L('marta/soniya', 'нажатий/сек')}</p>
        <div class="meta">${esc(L("Har 5 soniyadagi bosishlar soni (punktir — boshlang'ich daraja):", 'Число нажатий за каждые 5 секунд (пунктир — исходный уровень):'))}</div>
        ${curveSvg(c)}
        <div class="nsbar">${[1, 2, 3, 4, 5].map(i => `<span class="${i <= S.lvl ? 'on' : ''}"></span>`).join('')}<em>${L('kuchsiz', 'слабая')}</em><em>${L('kuchli', 'сильная')}</em></div>
        <div class="conclusion"><h2>${L('Xulosa', 'Заключение')}</h2>
          <p>${esc(S.d)}</p>
          <p><strong>${L('Maslahat', 'Совет')}:</strong> ${esc(S.a)}</p>
          <p>${esc(L("Asab tizimi kuchi temperamentning fiziologik asosi hisoblanadi: kuchli asab tizimi ko'proq sangvinik va xolerikka, kuchsizi melanxolikka xos. Natijani Temperament testi bilan solishtiring.", 'Сила нервной системы — физиологическая основа темперамента: сильная чаще у сангвиников и холериков, слабая — у меланхоликов. Сравните результат с тестом темперамента.'))} <a href="#test/temper">${L('Temperament testi', 'Тест темперамента')}</a></p>
          <p class="meta">${esc(L("Natijaga charchoq, uyqusizlik, kayfiyat va qurilma (ekran sezgirligi) ta'sir qiladi. Ishonchli xulosa uchun testni turli kunlarda 2–3 marta, dam olgan holatda takrorlang. Bu skrining vositasi, tibbiy tashxis emas.", 'На результат влияют усталость, недосып, настроение и устройство (чувствительность экрана). Для надёжного вывода повторите тест 2–3 раза в разные дни в отдохнувшем состоянии. Это скрининговый инструмент, а не медицинский диагноз.'))}</p>
          <p class="meta">${esc(L('Metodika: Ye. P. Ilin, tepping-test (1972).', 'Методика: Е. П. Ильин, теппинг-тест (1972).'))}</p>
        </div>
        <div class="row-actions"><a class="btn" href="#exp/tapping" onclick="setTimeout(route,0)">${t('retake')}</a><a class="btn secondary" href="#results">${t('toResults')}</a></div>
      </div>`;
  }

  const _desc = describe;
  describe = function (r) {
    if (r.type === 'exp' && r.id === 'tapping') {
      const S = SHAPES()[r.shape] || {};
      return { name: t('tapTitle'), result: `${r.value} (${(r.c || []).join('-')})`, note: `${S.s || ''}; ${S.n || ''}` };
    }
    return _desc(r);
  };

  const st = document.createElement('style');
  st.textContent = `
  .tap-cells{display:grid;grid-template-columns:repeat(6,1fr);gap:.4rem;margin:.6rem 0}
  .tap-cell{border:2px solid var(--border);border-radius:12px;padding:.5rem;text-align:center;color:var(--text);background:#fff}
  .tap-cell b{display:block;font-size:.75rem;color:var(--muted)}.tap-cell span{font-family:var(--display);font-size:1.4rem;font-weight:700}
  .tap-cell.cur{border-color:var(--accent);background:var(--accent-soft)}
  .tap-pad{width:100%;height:260px;border:0;border-radius:20px;background:#16123F;color:#fff;font:700 1.6rem var(--display);cursor:pointer;touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
  .tap-pad.on{background:linear-gradient(135deg,#5B47E0,#2BA88F)}
  .tap-pad.hit{animation:taphit .12s ease}@keyframes taphit{50%{transform:scale(.985)}}
  .tap-time{text-align:center;font:700 1.8rem var(--display);color:var(--text);margin:.6rem 0 0;font-variant-numeric:tabular-nums}
  .tap-curve{max-width:560px}
  .nsbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:.6rem 0 1rem;max-width:420px;position:relative;padding-bottom:1.2rem}
  .nsbar span{flex:1;height:12px;border-radius:6px;background:#E7E2FA}.nsbar span.on{background:var(--accent)}
  .nsbar em{position:absolute;bottom:0;font-style:normal;font-size:.78rem;color:var(--muted)}.nsbar em:last-child{right:0}
  @media (max-width:640px){.tap-pad{height:220px}.tap-cell span{font-size:1.1rem}}`;
  document.head.appendChild(st);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    if (run && !(location.hash || '').startsWith('#exp/tapping')) { stopRun(); run = null; }
    _route();
    const [pg, arg] = (location.hash || '#home').slice(1).split('/');
    if (pg === 'exp' && arg === 'tapping') { viewTap(); window.scrollTo(0, 0); }
  };
  window.addEventListener('hashchange', route);
  route();
})();
