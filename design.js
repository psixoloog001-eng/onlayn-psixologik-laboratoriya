/* PsixoLab — yangi dizayn: bosh sahifa, test va tajriba kartalari, ikonkalar, siyoh dog'i (Rorschach) */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);

  /* Yo'nalishlar: rang + ikonka */
  const DOM = {
    mood: { c: '#FFC857', uz: 'Kayfiyat', ru: 'Настроение', i: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>' },
    stress: { c: '#5BC0EB', uz: 'Stress va xavotir', ru: 'Стресс и тревога', i: '<path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity=".55"/><path d="M3 7c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity=".55"/>' },
    self: { c: '#FF6F91', uz: "O'zini baholash", ru: 'Самооценка', i: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>' },
    persona: { c: '#B8A6FF', uz: 'Shaxsiyat', ru: 'Личность', i: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>' },
    attention: { c: '#4FE0C1', uz: 'Diqqat', ru: 'Внимание', i: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>' },
    memory: { c: '#9B8CFF', uz: 'Xotira', ru: 'Память', i: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor"/>' },
    control: { c: '#7BE495', uz: 'Fikrlash va nazorat', ru: 'Мышление и контроль', i: '<path d="M4 18 9 8l4 6 3-4 4 8"/><circle cx="9" cy="8" r="1.6"/><circle cx="16" cy="10" r="1.6"/>' },
    speed: { c: '#FF9F5A', uz: 'Reaksiya tezligi', ru: 'Скорость реакции', i: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>' },
    reason: { c: '#8FD3FF', uz: 'Mantiqiy fikrlash', ru: 'Логическое мышление', i: '<path d="M9 3h6v4a2 2 0 1 0 0 4v4h-4a2 2 0 1 1-4 0H3V9h4a2 2 0 1 0 0-4V3z" transform="translate(2 3)"/>' },
    body: { c: '#FF6F91', uz: 'Tana reaksiyasi', ru: 'Реакция тела', i: '<path d="M3 12h4l2-5 4 10 2-5h6"/>' }
  };
  const OF = {
    phq9: 'mood', gad7: 'stress', pss10: 'stress', rosenberg: 'self', ipip: 'persona', logic: 'reason', accent: 'persona',
    rt: 'speed', stroop: 'attention', span: 'memory', schulte: 'attention', gonogo: 'control', corsi: 'memory',
    nback: 'memory', flanker: 'attention', trail: 'control', words: 'memory', hanoi: 'control', pulse: 'body'
  };
  const dom = id => DOM[OF[id]] || DOM.persona;
  const icon = (d, size) => `<svg viewBox="0 0 24 24" width="${size || 24}" height="${size || 24}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d.i}</svg>`;
  window.PL_DOMAIN = dom; window.PL_ICON = icon;

  /* Testlar — keng qatorlar */
  testCards = function () {
    return `<div class="test-list">${Object.entries(TESTS).map(([id, ts]) => { const d = dom(id); return `
      <a class="test-row" href="#test/${id}" style="--dc:${d.c}">
        <span class="dot-ic">${icon(d)}</span>
        <span class="tr-main"><span class="tr-dom">${esc(d[lang])}</span><strong>${esc(ts.name[lang])}</strong><span class="tr-desc">${esc(ts.desc[lang])}</span></span>
        <span class="tr-meta"><span>${ts.items[lang].length} ${t('questions')}</span><span>~${ts.minutes} ${t('minutes')}</span></span>
        <span class="tr-go">${t('start')}</span>
      </a>`; }).join('')}</div>`;
  };

  /* Tajribalar — plitkalar */
  expCards = function () {
    return `<div class="exp-grid">${EXPERIMENTS.map(e => { const d = dom(e.id); return `
      <a class="exp-tile" href="#exp/${e.id}" style="--dc:${d.c}">
        <span class="et-top"><span class="dot-ic">${icon(d, 22)}</span><span class="et-min">~${e.minutes} ${t('minutes')}</span></span>
        <strong>${esc(t(e.title))}</strong>
        <span class="et-desc">${esc(t(e.desc))}</span>
        <span class="et-dom">${esc(d[lang])}</span>
      </a>`; }).join('')}</div>`;
  };

  /* Siyoh dog'i: o'ng yarmi tasodifiy nuqtalardan, chap yarmi — ko'zgu aksi */
  function blobPath(pts) {
    // pts: [ [x,y], ... ] o'ng tomonda (x>=0), yuqoridan pastga
    const right = pts, left = pts.slice().reverse().map(([x, y]) => [-x, y]);
    const all = right.concat(left);
    let d = `M ${all[0][0].toFixed(1)} ${all[0][1].toFixed(1)}`;
    for (let i = 0; i < all.length; i++) {
      const p0 = all[(i - 1 + all.length) % all.length], p1 = all[i], p2 = all[(i + 1) % all.length], p3 = all[(i + 2) % all.length];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d + ' Z';
  }
  const N = 15;
  // Har bir nuqta: burchak va radius; bir nechta to'lqin qo'shilib, notekis "qanot"lar hosil bo'ladi
  const seedShape = (amp, off) => Array.from({ length: N }, (_, i) => {
    const a = -Math.PI / 2 + (i / (N - 1)) * Math.PI; // yuqoridan pastga
    const base = 118 + amp * (46 * Math.sin(i * 1.15 + off) + 26 * Math.cos(i * 2.7 + off) + 14 * Math.sin(i * 4.9));
    return { a, r: Math.max(40, base), ph: Math.random() * 6.28, sp: .22 + Math.random() * .3 };
  });
  let shapes = null, raf = 0;
  function frame(tm) {
    const svg = document.getElementById('inkblot');
    if (!svg) { raf = 0; return; }
    const s = tm / 1000;
    svg.querySelectorAll('path[data-k]').forEach(p => {
      const k = +p.dataset.k, sh = shapes[k], sc = [1, .62, .3][k];
      const pts = sh.map(q => { const r = (q.r + 16 * Math.sin(s * q.sp + q.ph)) * sc; return [Math.max(4, Math.cos(q.a) * r * 1.12 + 4), Math.sin(q.a) * r * .95]; });
      p.setAttribute('d', blobPath(pts));
    });
    raf = requestAnimationFrame(frame);
  }
  function inkblotSvg() {
    return `<svg id="inkblot" viewBox="-240 -190 480 380" role="img" aria-label="${L("Simmetrik siyoh dog'i", 'Симметричная клякса')}">
      <defs><radialGradient id="ink1" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#C9BEFF"/><stop offset="1" stop-color="#6D5BE8"/></radialGradient>
      <radialGradient id="ink2" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#4FE0C1"/><stop offset="1" stop-color="#2BA88F"/></radialGradient></defs>
      <path data-k="0" fill="url(#ink1)"/><path data-k="1" fill="#16123F" opacity=".55"/><path data-k="2" fill="url(#ink2)"/>
      <g fill="#C9BEFF">${[[150, -120, 7], [175, 60, 5], [120, 150, 4], [190, -30, 3.5], [70, -170, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${-x}" cy="${y}" r="${r}"/>`).join('')}</g>
      <line x1="0" y1="-195" x2="0" y2="195" stroke="#C9BEFF" stroke-opacity=".18" stroke-dasharray="3 7"/>
    </svg>`;
  }
  function startInk() {
    shapes = shapes || [seedShape(1, .4), seedShape(.8, 2.1), seedShape(.6, 4.2)];
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { frame(4000); cancelAnimationFrame(raf); raf = 0; return; }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  /* Bosh sahifa */
  viewHome = function () {
    const nT = Object.keys(TESTS).length, nE = EXPERIMENTS.length;
    app.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <h1>${L("O'zingizni ilm bilan tanib oling", 'Узнайте себя с помощью науки')}</h1>
          <p class="hero-lead">${esc(L(`${nT} ta ilmiy so'rovnoma va ${nE} ta kognitiv tajriba: kayfiyat, stress, diqqat va xotirangizni o'lchang, keyin har kuni mashq qilib o'zgarishni kuzating.`, `${nT} научных опросников и ${nE} когнитивных экспериментов: измерьте настроение, стресс, внимание и память, а затем тренируйтесь каждый день и следите за изменениями.`))}</p>
          <div class="hero-cta"><a class="btn big" href="#tests">${L('Testni tanlash', 'Выбрать тест')}</a><a class="btn ghost big" href="#plan">${L('Rivojlanish xaritasi', 'Карта развития')}</a></div>
          <p class="hero-note">${esc(L("Bepul. O'zbek va rus tillarida. Ro'yxatdan o'tish ixtiyoriy.", 'Бесплатно. На узбекском и русском. Регистрация по желанию.'))}</p>
        </div>
        <div class="hero-art">${inkblotSvg()}<p class="art-cap">${esc(L("Siz bu dog'da nimani ko'ryapsiz? Har kim har xil — psixologiya shundan boshlanadi.", 'Что вы видите в этой кляксе? Каждый своё — с этого и начинается психология.'))}</p></div>
      </section>
      <section class="home-sec"><div class="sec-head"><h2>${esc(t('testsTitle'))}</h2><a href="#tests">${L('Barchasi', 'Все')}</a></div>${testCards()}</section>
      <section class="home-sec"><div class="sec-head"><h2>${esc(t('expTitle'))}</h2><a href="#experiments">${L('Barchasi', 'Все')}</a></div>${expCards()}</section>
      <section class="home-sec quiet">${disclaimerHtml()}</section>`;
    startInk();
  };

  /* Test sahifasi: savol raqamlari va javob tugmalari uchun belgi */
  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    _route();
    const pg = (location.hash || '#home').slice(1).split('/')[0] || 'home';
    document.body.dataset.page = pg;
    if (pg === 'tests' && typeof externalTestsHtml === 'function' && !app.querySelector('.ext-test')) app.insertAdjacentHTML('beforeend', externalTestsHtml());
    if (pg === 'test') {
      const id = location.hash.split('/')[1];
      const d = dom(id);
      app.style.setProperty('--dc', d.c);
      const h1 = app.querySelector('h1');
      if (h1 && !app.querySelector('.page-dom')) h1.insertAdjacentHTML('beforebegin', `<span class="page-dom" style="--dc:${d.c}">${icon(d, 18)} ${esc(d[lang])}</span>`);
      app.querySelectorAll('.question > p').forEach(p => {
        const m = p.textContent.match(/^(\d+)\.\s*(.*)$/s);
        if (m) p.innerHTML = `<span class="qn">${m[1]}</span><span>${esc(m[2])}</span>`;
      });
    } else app.style.removeProperty('--dc');
  };
  window.addEventListener('hashchange', route);
  route();
})();
