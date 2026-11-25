/* PsixoLab — Temperament testi (G. Ayzenk modeli: ekstraversiya × neyrotizm)
   Savollar: IPIP Big-Five Factor Markers (Goldberg, 1992) — Extraversion va Emotional Stability shkalalari,
   ommaviy foydalanishdagi (public domain) material, PsixoLab tarjimasi. Qo'shimcha: diqqat savoli va izchillik tekshiruvi. */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const $ = id => document.getElementById(id);

  // [uz, ru, shkala, kalit]: shkala E — ekstraversiya, S — emotsional barqarorlik; kalit +1 to'g'ri, -1 teskari
  const ITEMS = [
    ["Davralarda ko'pincha atrofdagilarni jonlantiradigan odam men bo'laman.", 'Я — душа компании.', 'E', 1],
    ["Ko'p vaqt xotirjam va bo'shashgan holatda bo'laman.", 'Большую часть времени я спокоен(на) и расслаблен(а).', 'S', 1],
    ['Kam gapiraman.', 'Я немногословен(на).', 'E', -1],
    ['Osonlikcha stressga tushaman.', 'Я легко поддаюсь стрессу.', 'S', -1],
    ["Odamlar orasida o'zimni erkin his qilaman.", 'Мне комфортно среди людей.', 'E', 1],
    ['Kamdan-kam hollarda g\'amgin bo\'laman.', 'Мне редко бывает грустно.', 'S', 1],
    ["Ko'pincha chetda, ko'zga tashlanmay turaman.", 'Я обычно держусь в тени.', 'E', -1],
    ["Ko'p narsalar haqida xavotirlanaman.", 'Я много о чём беспокоюсь.', 'S', -1],
    ['Suhbatni ko\'pincha o\'zim boshlayman.', 'Я часто первым(ой) начинаю разговор.', 'E', 1],
    ['Meni osongina bezovta qilish mumkin.', 'Меня легко выбить из колеи.', 'S', -1],
    ['Diqqat savoli: bu savolga «Rozi emasman» deb javob bering.', 'Проверка внимания: выберите здесь ответ «Не согласен(на)».', 'A', 0],
    ["Odatda aytadigan gapim kam bo'ladi.", 'Мне обычно почти нечего сказать.', 'E', -1],
    ["Tez xafa bo'lib qolaman.", 'Я легко расстраиваюсь.', 'S', -1],
    ["Bazm va yig'inlarda ko'p turli odamlar bilan gaplashaman.", 'На праздниках и встречах я общаюсь с множеством разных людей.', 'E', 1],
    ["Kayfiyatim tez-tez o'zgaradi.", 'Моё настроение часто меняется.', 'S', -1],
    ["O'zimga e'tibor qaratilishini yoqtirmayman.", 'Я не люблю привлекать к себе внимание.', 'E', -1],
    ["Kayfiyatim keskin ko'tarilib-tushib turadi.", 'У меня бывают резкие перепады настроения.', 'S', -1],
    ["Diqqat markazida bo'lishga qarshi emasman.", 'Я не против быть в центре внимания.', 'E', 1],
    ['Tez asabiylashaman.', 'Я легко раздражаюсь.', 'S', -1],
    ["Notanish odamlar orasida jim bo'lib qolaman.", 'С незнакомыми людьми я молчалив(а).', 'E', -1],
    ["Ko'pincha ko'nglim cho'kkan bo'ladi.", 'Мне часто бывает тоскливо.', 'S', -1]
  ];
  // Mazmunan zid juftliklar (ikkalasiga ham "roziman" deyilsa — izchillik buziladi)
  const PAIRS = [[0, 6], [17, 15], [1, 3], [5, 20]];
  const OPTS = () => L(['Mutlaqo rozi emasman', 'Rozi emasman', 'Betaraf', 'Roziman', "To'liq roziman"],
    ['Совсем не согласен(на)', 'Не согласен(на)', 'Нейтрально', 'Согласен(на)', 'Полностью согласен(на)']);

  const TYPES = () => ({
    sang: { n: L('Sangvinik', 'Сангвиник'), c: '#FFC857',
      d: L("Faol, quvnoq, muloqotga ochiq va hissiy jihatdan barqaror. Yangi muhitga tez moslashasiz, muvaffaqiyatsizlikni uzoq ko'tarmaysiz.", 'Активный, жизнерадостный, общительный и эмоционально устойчивый. Быстро адаптируетесь к новому, неудачи переживаете недолго.'),
      p: L("Tashabbuskorlik, optimizm, jamoada ishlash, tez qaror qabul qilish.", 'Инициативность, оптимизм, работа в команде, быстрые решения.'),
      r: L("Ishni oxiriga yetkazmaslik, bir xil ishdan tez zerikish, yuzakilik.", 'Незавершённые дела, быстрая скука от монотонной работы, поверхностность.'),
      a: L("Bir vaqtda kamroq ishni tanlang va ularni yakunlang; uzoq muddatli maqsadlarni kichik bosqichlarga bo'ling.", 'Берите меньше дел одновременно и доводите их до конца; разбивайте долгие цели на небольшие этапы.') },
    chol: { n: L('Xolerik', 'Холерик'), c: '#FF6F91',
      d: L("Serg'ayrat, tezkor, his-tuyg'ulari kuchli va ochiq namoyon bo'ladi. Qiyinchilikka shijoat bilan tashlanasiz, lekin tez qizishasiz.", 'Энергичный, быстрый, с сильными и открыто проявляемыми эмоциями. Бросаетесь на трудности со страстью, но быстро вспыхиваете.'),
      p: L("Yetakchilik, qat'iyat, ishga ishtiyoq, tez harakat qilish.", 'Лидерство, решительность, увлечённость делом, быстрота действий.'),
      r: L("Jahldorlik, sabrsizlik, ziddiyatlarga moyillik, charchab qolish.", 'Вспыльчивость, нетерпеливость, склонность к конфликтам, переутомление.'),
      a: L("Jahl kelganda pauza qiling (10 gacha sanash, nafas mashqi); muhim qarorni hissiyot pasaygach qabul qiling.", 'Когда вспыхиваете, делайте паузу (счёт до 10, дыхание); важные решения принимайте, когда эмоции улягутся.') },
    phleg: { n: L('Flegmatik', 'Флегматик'), c: '#4FE0C1',
      d: L("Vazmin, xotirjam, sabrli va hissiy jihatdan barqaror. Shoshilmaysiz, lekin boshlagan ishni puxta va oxirigacha bajarasiz.", 'Сдержанный, спокойный, терпеливый и эмоционально устойчивый. Не спешите, но доводите начатое до конца основательно.'),
      p: L("Ishonchlilik, sabr-toqat, puxtalik, stressga chidamlilik.", 'Надёжность, терпение, основательность, стрессоустойчивость.'),
      r: L("Yangilikka sekin moslashish, tashabbus kamligi, his-tuyg'ularni kam ifoda etish.", 'Медленная адаптация к новому, нехватка инициативы, сдержанность в выражении чувств.'),
      a: L("Yangi ishlarni oldindan rejalashtirib, ularga moslashishga vaqt bering; his-tuyg'ularingizni yaqinlarga so'z bilan aytishni mashq qiling.", 'Планируйте новое заранее и давайте себе время привыкнуть; тренируйтесь выражать чувства словами близким.') },
    mel: { n: L('Melanxolik', 'Меланхолик'), c: '#9B8CFF',
      d: L("Sezgir, chuqur his qiladigan, o'ychan va ehtiyotkor. Ichki dunyongiz boy, lekin stress va xafagarchilikni og'irroq kechirasiz.", 'Чувствительный, глубоко переживающий, вдумчивый и осторожный. Богатый внутренний мир, но стресс и обиды переносите тяжелее.'),
      p: L("Sezgirlik, hamdardlik, chuqur tahlil, ijodkorlik, mas'uliyat.", 'Чуткость, эмпатия, глубокий анализ, творческие способности, ответственность.'),
      r: L("Tez charchash, xavotir, o'ziga ishonchsizlik, tushkunlikka moyillik.", 'Быстрая утомляемость, тревожность, неуверенность в себе, склонность к унынию.'),
      a: L("Dam olish va tiklanish rejimiga e'tibor bering; stressni boshqarish mashqlari foydali. Kayfiyat uzoq vaqt past bo'lsa, PHQ-9 va GAD-7 testlarini topshirib, mutaxassis bilan maslahatlashing.", 'Следите за режимом отдыха и восстановления; полезны упражнения по управлению стрессом. Если настроение долго снижено, пройдите PHQ-9 и GAD-7 и посоветуйтесь со специалистом.') }
  });
  const typeOf = (E, N) => (E > 30 ? (N > 30 ? 'chol' : 'sang') : (N > 30 ? 'mel' : 'phleg'));

  TESTS.temper = {
    name: { uz: 'Temperament testi (Ayzenk modeli)', ru: 'Тест темперамента (модель Айзенка)' },
    desc: { uz: "Sangvinik, xolerik, flegmatik yoki melanxolik: ekstraversiya va emotsional barqarorlik o'lchovlari asosida temperamentingizni aniqlaydi.", ru: 'Сангвиник, холерик, флегматик или меланхолик: определяет темперамент по шкалам экстраверсии и эмоциональной устойчивости.' },
    instr: { uz: '', ru: '' }, minutes: 5,
    items: { uz: ITEMS.map(x => x[0]), ru: ITEMS.map(x => x[1]) },
    options: { uz: OPTS(), ru: OPTS() }, bands: [], reverse: [], source: 'IPIP (Goldberg, 1992)'
  };

  function viewTemper() {
    const opts = OPTS();
    app.innerHTML = `
      <a href="#tests">← ${t('back')}</a>
      <h1>${esc(TESTS.temper.name[lang])}</h1>
      <p><strong>${t('instructionPrefix')}</strong> ${esc(L("Har bir fikr sizga qanchalik mos kelishini belgilang. O'zingizni qanday bo'lishni xohlasangiz emas, odatda qanday bo'lsangiz, shunday baholang. To'g'ri yoki noto'g'ri javob yo'q.", 'Отметьте, насколько каждое утверждение вам подходит. Оценивайте себя таким, какой вы обычно, а не каким хотели бы быть. Правильных и неправильных ответов нет.'))}</p>
      <div class="progress"><div id="prog" style="width:0%"></div></div>
      <form id="tform">
        ${ITEMS.map((it, i) => `
          <div class="question"><p>${i + 1}. ${esc(lang === 'ru' ? it[1] : it[0])}</p>
            <div class="options">${opts.map((o, v) => `<label><input type="radio" name="q${i}" value="${v + 1}">${esc(o)}</label>`).join('')}</div>
          </div>`).join('')}
        <p id="terr" class="notice danger" hidden>${esc(t('answerAll'))}</p>
        <button class="btn" type="submit">${t('submit')}</button>
      </form>
      <p class="meta">${esc(L("Savollar manbasi: International Personality Item Pool (IPIP), Goldberg (1992) — ochiq foydalanishdagi ilmiy shkalalar; o'zbek va rus tillariga PsixoLab tarjimasi. Temperament tiplari G. Ayzenk modeli bo'yicha talqin qilinadi.", 'Источник вопросов: International Personality Item Pool (IPIP), Goldberg (1992) — открытые научные шкалы; перевод PsixoLab. Типы темперамента интерпретируются по модели Г. Айзенка.'))}</p>`;
    const form = $('tform'), t0 = Date.now();
    form.addEventListener('change', () => {
      const n = ITEMS.filter((_, i) => form.querySelector(`input[name=q${i}]:checked`)).length;
      $('prog').style.width = (n / ITEMS.length * 100) + '%';
    });
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const ans = ITEMS.map((_, i) => { const c = form.querySelector(`input[name=q${i}]:checked`); return c ? +c.value : null; });
      if (ans.includes(null)) { $('terr').hidden = false; form.querySelectorAll('.question')[ans.indexOf(null)].scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      let E = 0, S = 0;
      ITEMS.forEach((it, i) => { const v = it[3] > 0 ? ans[i] : 6 - ans[i]; if (it[2] === 'E') E += v; else if (it[2] === 'S') S += v; });
      const N = 60 - S; // neyrotizm = emotsional barqarorlikning teskarisi (10–50)
      const flags = [];
      if (ans[10] !== 2) flags.push('attention');
      if (PAIRS.filter(([a, b]) => ans[a] >= 4 && ans[b] >= 4).length >= 2) flags.push('contradict');
      const core = ans.filter((_, i) => ITEMS[i][2] !== 'A');
      if (new Set(core).size === 1) flags.push('same');
      const sec = Math.round((Date.now() - t0) / 1000);
      if (sec < 45) flags.push('fast');
      const type = typeOf(E, N);
      saveResult({ type: 'test', id: 'temper', E, N, temp: type, valid: flags.length ? 0 : 1, flags: flags.join(','), time: sec });
      showTemper(E, N, flags);
    });
  }

  function circleSvg(E, N, col) {
    const R = 150; let x = (E - 30) / 20 * R, y = -(N - 30) / 20 * R; const h = Math.hypot(x, y); if (h > R - 16) { x *= (R - 16) / h; y *= (R - 16) / h; }
    const q = (lx, ly, key, anchor) => `<text x="${lx}" y="${ly}" text-anchor="${anchor}" class="tq">${esc(TYPES()[key].n)}</text>`;
    return `<svg viewBox="-230 -210 460 420" class="temper-svg" role="img" aria-label="${L('Temperament doirasi', 'Круг темпераментов')}">
      <circle r="${R}" fill="#F4F1FF" stroke="#DED8F6" stroke-width="2"/>
      <path d="M0 0 L0 -${R} A${R} ${R} 0 0 1 ${R} 0Z" fill="#FF6F91" opacity=".10"/>
      <path d="M0 0 L${R} 0 A${R} ${R} 0 0 1 0 ${R}Z" fill="#FFC857" opacity=".14"/>
      <path d="M0 0 L0 ${R} A${R} ${R} 0 0 1 -${R} 0Z" fill="#4FE0C1" opacity=".14"/>
      <path d="M0 0 L-${R} 0 A${R} ${R} 0 0 1 0 -${R}Z" fill="#9B8CFF" opacity=".14"/>
      <line x1="-${R + 20}" y1="0" x2="${R + 20}" y2="0" stroke="#B9B0E6" stroke-width="2"/>
      <line x1="0" y1="-${R + 20}" x2="0" y2="${R + 20}" stroke="#B9B0E6" stroke-width="2"/>
      <text x="${R + 24}" y="5" class="ta">${L('Ekstravert', 'Экстраверт')}</text>
      <text x="-${R + 24}" y="5" class="ta" text-anchor="end">${L('Introvert', 'Интроверт')}</text>
      <text x="0" y="-${R + 28}" class="ta" text-anchor="middle">${L('Hissiy beqaror', 'Эмоционально нестабилен')}</text>
      <text x="0" y="${R + 40}" class="ta" text-anchor="middle">${L('Hissiy barqaror', 'Эмоционально стабилен')}</text>
      ${q(78, -70, 'chol', 'middle')}${q(78, 82, 'sang', 'middle')}${q(-78, 82, 'phleg', 'middle')}${q(-78, -70, 'mel', 'middle')}
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="${col}" stroke="#16123F" stroke-width="4"/>
    </svg>`;
  }

  function showTemper(E, N, flags) {
    const T = TYPES(), key = typeOf(E, N), tp = T[key];
    const dist = Math.hypot(E - 30, N - 30);
    const strength = dist < 5 ? L('kuchsiz ifodalangan', 'слабо выражен') : dist < 12 ? L("o'rtacha ifodalangan", 'умеренно выражен') : L('yaqqol ifodalangan', 'ярко выражен');
    // chegaraviy holat: ikkinchi yaqin tip
    let mix = '';
    if (Math.abs(E - 30) <= 3 || Math.abs(N - 30) <= 3) {
      const alt = Math.abs(E - 30) <= Math.abs(N - 30) ? typeOf(E > 30 ? 29 : 31, N) : typeOf(E, N > 30 ? 29 : 31);
      mix = L(`Natijangiz chegaraga yaqin: sizda ${T[alt].n.toLowerCase()} xususiyatlari ham sezilarli. Bunday aralash tiplar juda ko'p uchraydi.`, `Ваш результат близок к границе: заметны и черты типа «${T[alt].n.toLowerCase()}». Такие смешанные типы встречаются очень часто.`);
    }
    const warn = flags.length ? `<div class="notice warn"><strong>${L('Diqqat: natija ishonchliligi past bo\'lishi mumkin.', 'Внимание: надёжность результата может быть снижена.')}</strong> ${esc([
      flags.includes('attention') ? L("Diqqat savoliga ko'rsatilgan javob berilmadi.", 'На проверочный вопрос дан не тот ответ.') : '',
      flags.includes('contradict') ? L("Bir nechta bir-biriga zid fikrga birdaniga «roziman» deb javob berildi.", 'На несколько противоречащих друг другу утверждений вы ответили «согласен».') : '',
      flags.includes('same') ? L('Barcha savollarga bir xil javob berildi.', 'На все вопросы дан одинаковый ответ.') : '',
      flags.includes('fast') ? L('Test juda tez topshirildi.', 'Тест пройден слишком быстро.') : ''
    ].filter(Boolean).join(' '))} ${esc(L('Xotirjam holatda, har bir savolni o\'qib, qayta topshirib ko\'ring.', 'Пройдите тест ещё раз спокойно, внимательно читая каждый вопрос.'))}</div>` : '';
    app.innerHTML = `
      <h1>${esc(TESTS.temper.name[lang])}</h1>
      ${warn}
      <div class="card temper-card">
        <div class="temper-top">
          <div>${circleSvg(E, N, tp.c)}</div>
          <div>
            <p class="meta">${L('Sizning temperamentingiz', 'Ваш темперамент')}</p>
            <div class="score" style="color:${tp.c === '#FFC857' ? '#B7791F' : tp.c === '#4FE0C1' ? '#0F8F74' : tp.c}">${esc(tp.n)}</div>
            <p><strong>${esc(strength)}</strong></p>
            <div class="trait"><div class="trait-head"><strong>${L('Ekstraversiya', 'Экстраверсия')}</strong><span>${E} / 50</span></div><div class="bar"><div style="width:${(E - 10) / 40 * 100}%"></div></div><div class="meta">${L('10 — yaqqol introvert, 50 — yaqqol ekstravert', '10 — выраженный интроверт, 50 — выраженный экстраверт')}</div></div>
            <div class="trait"><div class="trait-head"><strong>${L('Neyrotizm (hissiy beqarorlik)', 'Нейротизм (эмоциональная нестабильность)')}</strong><span>${N} / 50</span></div><div class="bar"><div style="width:${(N - 10) / 40 * 100}%"></div></div><div class="meta">${L('10 — juda barqaror, 50 — juda ta\'sirchan', '10 — очень стабилен, 50 — очень впечатлителен')}</div></div>
          </div>
        </div>
        <div class="conclusion"><h2>${L('Xulosa', 'Заключение')}</h2>
          <p>${esc(tp.d)}</p>
          ${mix ? `<p>${esc(mix)}</p>` : ''}
          <p><strong>${L('Kuchli tomonlar', 'Сильные стороны')}:</strong> ${esc(tp.p)}</p>
          <p><strong>${L("E'tibor berish kerak", 'На что обратить внимание')}:</strong> ${esc(tp.r)}</p>
          <p><strong>${L('Maslahat', 'Совет')}:</strong> ${esc(tp.a)}</p>
          <p class="meta">${esc(L("Temperament — yaxshi yoki yomon bo'lmaydi: har birining o'z kuchli tomonlari bor. \"Sof\" tiplar kam uchraydi, ko'pchilikda ikki tipning xususiyatlari aralash bo'ladi. Natija o'zingiz haqingizdagi javoblarga asoslangan; aniqroq xulosa uchun testni bir necha kundan keyin qayta topshirib, natijalarni solishtiring.", 'Темперамент не бывает хорошим или плохим: у каждого свои сильные стороны. «Чистые» типы редки, у большинства черты двух типов смешаны. Результат основан на ваших ответах о себе; для точности пройдите тест повторно через несколько дней и сравните результаты.'))}</p>
        </div>
        <div class="row-actions"><a class="btn" href="#test/temper">${t('retake')}</a><a class="btn secondary" href="#results">${t('toResults')}</a></div>
      </div>`;
  }

  const _desc = describe;
  describe = function (r) {
    if (r.type === 'test' && r.id === 'temper') {
      const T = TYPES();
      return { name: TESTS.temper.name[lang], result: `${T[r.temp] ? T[r.temp].n : ''} (E ${r.E}, N ${r.N})`,
        note: r.valid ? L('Javoblar ishonchli', 'Ответы надёжные') : L('Ishonchliligi past — qayta topshirish tavsiya etiladi', 'Надёжность снижена — рекомендуется пройти заново') };
    }
    return _desc(r);
  };

  const st = document.createElement('style');
  st.textContent = `
  .temper-top{display:grid;grid-template-columns:minmax(260px,420px) 1fr;gap:1.5rem;align-items:center}
  .temper-svg{width:100%;height:auto;display:block}
  .temper-svg .tq{font:700 17px 'Inter Display','Inter',sans-serif;fill:#1E1A4D}
  .temper-svg .ta{font:600 13px 'Manrope','Inter',sans-serif;fill:#625D8F}
  .temper-card .trait{margin:.6rem 0;padding:.8rem 1rem}
  @media (max-width:760px){.temper-top{grid-template-columns:1fr}}`;
  document.head.appendChild(st);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    _route();
    const [pg, arg] = (location.hash || '#home').slice(1).split('/');
    if (pg === 'test' && arg === 'temper') { viewTemper(); window.scrollTo(0, 0); }
  };
  window.addEventListener('hashchange', route);
  route();
})();
