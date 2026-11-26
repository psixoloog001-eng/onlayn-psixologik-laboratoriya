/* PsixoLab — Umumiy psixologik xulosa (#xulosa): foydalanuvchi topshirgan barcha test va tajribalarning so'nggi natijalarini
   bitta yaxlit hisobotga birlashtiradi: emotsional holat, temperament va asab tizimi, shaxs xususiyatlari, qobiliyatlar,
   kognitiv funksiyalar, hayot muvozanati, umumiy xulosa va tavsiyalar. Ma'lumotlar faqat brauzerda qayta ishlanadi. */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const R = () => (lang === 'ru' ? 1 : 0);

  Object.assign(T.uz, { navSummary: 'Umumiy xulosa' });
  Object.assign(T.ru, { navSummary: 'Общее заключение' });
  const nav = document.querySelector('header nav');
  if (nav && !nav.querySelector('a[href="#xulosa"]')) {
    const a = document.createElement('a'); a.href = '#xulosa'; a.dataset.i18n = 'navSummary'; a.textContent = t('navSummary');
    const after = nav.querySelector('a[href="#results"]'); after ? after.after(a) : nav.appendChild(a);
  }

  // So'nggi natija (id bo'yicha)
  function latest() {
    const m = {};
    loadResults().forEach(r => { if (r.type === 'exam') return; const k = r.id; if (!m[k] || (r.date || '') >= (m[k].date || '')) m[k] = r; });
    return m;
  }
  const nm = id => (TESTS[id] ? TESTS[id].name[lang] : (() => { const e = EXPERIMENTS.find(x => x.id === id); return e ? t(e.title) : id; })());
  const link = id => (TESTS[id] ? `#test/${id}` : `#exp/${id}`);
  const fmtD = d => { try { return new Date(d).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ'); } catch (e) { return ''; } };
  const bar = (label, p, note, col) => `<div class="sm-row"><span>${label}</span><div class="sm-bar"><i style="width:${Math.max(2, Math.min(100, p))}%;${col ? 'background:' + col : ''}"></i></div><b>${Math.round(p)}</b><em>${note || ''}</em></div>`;
  const lvTxt = p => p >= 85 ? L('juda yuqori', 'очень высокий') : p >= 70 ? L('yuqori', 'высокий') : p >= 50 ? L("o'rtacha", 'средний') : L('past', 'низкий');

  const TEMP = { chol: 'X', sang: 'S', phleg: 'F', mel: 'M' };
  const TNAME = () => ({ X: L('xolerik', 'холерик'), S: L('sangvinik', 'сангвиник'), F: L('flegmatik', 'флегматик'), M: L('melanxolik', 'меланхолик') });
  const TAPS = () => ({ convex: [L('kuchli', 'сильная'), 4], even: [L("o'rtacha kuchli", 'средняя'), 3], mid: [L("o'rtacha-kuchsiz", 'средне-слабая'), 2], concave: [L("o'rtacha-kuchsiz", 'средне-слабая'), 2], desc: [L('kuchsiz (sezgir)', 'слабая (чувствительная)'), 1] });
  const BIG5 = () => ({ E: [L('Ekstraversiya', 'Экстраверсия'), L('kirishimli, faol', 'общительность, активность'), L('vazmin, yolg\'izlikni afzal ko\'radi', 'сдержанность, любовь к уединению')],
    A: [L('Hamjihatlik', 'Доброжелательность'), L('mehribon, hamkorlikka moyil', 'доброта, склонность к сотрудничеству'), L("tanqidiy, o'z manfaatini himoya qiladi", 'критичность, отстаивание своих интересов')],
    C: [L("Mas'uliyatlilik", 'Добросовестность'), L('tartibli, intizomli', 'организованность, дисциплина'), L('erkin, rejaga kam bog\'lanadi', 'спонтанность, слабая привязка к планам')],
    N: [L('Neyrotizm', 'Нейротизм'), L("hissiy beqaror, xavotirga moyil", 'эмоциональная неустойчивость, тревожность'), L('hissiy barqaror, xotirjam', 'эмоциональная устойчивость, спокойствие')],
    I: [L('Intellekt / tasavvur', 'Интеллект / воображение'), L("tasavvuri boy, g'oyalarga qiziquvchan", 'богатое воображение, интерес к идеям'), L('amaliy, aniq narsalarga yo\'naltirilgan', 'практичность, ориентация на конкретное')] });

  function view() {
    document.body.dataset.page = 'xulosa';
    const M = latest();
    const has = id => !!M[id];
    const strengths = [], growth = [], recs = [], warn = [];
    const sec = [];

    // ---- 1. Emotsional holat ----
    const emo = ['phq9', 'gad7', 'pss10', 'rosenberg'].filter(has);
    if (emo.length) {
      let rows = '';
      emo.forEach(id => {
        const r = M[id], ts = TESTS[id], b = ts && ts.bands && ts.bands[r.band];
        const concern = id === 'rosenberg' ? r.band === 0 : !!(b && b[2]);
        rows += `<li class="${concern ? 'bad' : 'ok'}"><b>${esc(nm(id))}:</b> ${r.score}/${r.max || ts.max} — ${esc(b ? b[1][lang] : '')} <small>(${fmtD(r.date)})</small></li>`;
        if (concern) growth.push(id === 'rosenberg' ? L("o'z-o'zini baholash pastroq", 'сниженная самооценка') : id === 'phq9' ? L('kayfiyat pasayishi belgilari', 'признаки сниженного настроения') : id === 'gad7' ? L('xavotir darajasi yuqori', 'повышенная тревожность') : L('stress darajasi yuqori', 'высокий уровень стресса'));
        if (r.crisis) warn.push(L("PHQ-9 ning 9-savoliga ijobiy javob berilgan. Agar o'zingizga zarar yetkazish haqida fikrlar bo'lsa, iltimos, bugunoq mutaxassis yoki ishonchli odam bilan gaplashing.", 'В PHQ-9 дан положительный ответ на вопрос 9. Если есть мысли о причинении себе вреда, пожалуйста, сегодня же поговорите со специалистом или близким человеком.'));
      });
      const bad = emo.filter(id => { const r = M[id], b = TESTS[id].bands[r.band]; return id === 'rosenberg' ? r.band === 0 : !!(b && b[2]); }).length;
      if (!bad) strengths.push(L('emotsional holatingiz barqaror', 'эмоциональное состояние стабильно'));
      else recs.push(L("Emotsional holatingizga e'tibor bering: kunlik rejim, uyqu, jismoniy faollik va yaqinlar bilan muloqot muhim. Belgilar 2 haftadan ortiq saqlansa, psixolog bilan maslahatlashing.", 'Уделите внимание эмоциональному состоянию: важны режим, сон, физическая активность и общение с близкими. Если симптомы сохраняются более 2 недель, обратитесь к психологу.'));
      sec.push(`<section class="card sm-sec"><h2>1. ${L('Emotsional holat', 'Эмоциональное состояние')}</h2><ul class="sm-list">${rows}</ul></section>`);
    }

    // ---- 2. Temperament va asab tizimi ----
    if (has('temper') || has('belov') || has('tapping')) {
      const TN = TNAME(); let rows = '', types = [];
      if (has('temper')) { const k = TEMP[M.temper.temp]; types.push(k); rows += `<li><b>${esc(nm('temper'))}:</b> ${esc(TN[k])} (E=${M.temper.E}, N=${M.temper.N})${M.temper.valid === 0 ? ' — ' + L('ishonchliligi past', 'низкая достоверность') : ''}</li>`; }
      if (has('belov')) { const p = M.belov.p; const ord = Object.keys(p).sort((a, b) => p[b] - p[a]); types.push(ord[0]); rows += `<li><b>${esc(nm('belov'))}:</b> ${ord.map(k => `${esc(TN[k])} ${p[k]}%`).join(', ')}</li>`; }
      let strength = null;
      if (has('tapping')) { strength = (TAPS()[M.tapping.shape] || [])[1]; rows += `<li><b>${esc(nm('tapping'))}:</b> ${L('asab tizimi', 'нервная система')} — ${esc((TAPS()[M.tapping.shape] || ['?'])[0])}</li>`; }
      let concl = '';
      if (types.length === 2) concl = types[0] === types[1]
        ? L(`Ikki mustaqil usul bir xil natija berdi — sizda <b>${TN[types[0]]}</b> temperamenti ustun. Bu xulosa ancha ishonchli.`, `Два независимых метода дали одинаковый результат — у вас преобладает <b>${TN[types[0]]}</b>. Этот вывод достаточно надёжен.`)
        : L(`Ikki usul turlicha natija berdi (<b>${TN[types[0]]}</b> va <b>${TN[types[1]]}</b>) — temperamentingiz aralash tipda. Bu ko'p uchraydigan holat.`, `Методы дали разные результаты (<b>${TN[types[0]]}</b> и <b>${TN[types[1]]}</b>) — у вас смешанный темперамент. Это частый случай.`);
      else if (types.length === 1) concl = L(`Temperamentingizda <b>${TN[types[0]]}</b> xususiyatlari ustun.`, `В вашем темпераменте преобладают черты типа «<b>${TN[types[0]]}</b>».`);
      if (strength && types.length) {
        const exp = { X: 3, S: 3, F: 3, M: 1 }[types[0]];
        concl += ' ' + ((strength >= 3) === (exp >= 3)
          ? L('Tepping-test natijasi ham bunga mos keladi (asab tizimi kuchi temperamentning fiziologik asosi).', 'Теппинг-тест это подтверждает (сила нервной системы — физиологическая основа темперамента).')
          : L("Tepping-test natijasi bunga to'liq mos emas — testni dam olgan holatda takrorlab ko'ring.", 'Теппинг-тест не вполне согласуется с этим — повторите его в отдохнувшем состоянии.'));
      }
      sec.push(`<section class="card sm-sec"><h2>2. ${L('Temperament va asab tizimi', 'Темперамент и нервная система')}</h2><ul class="sm-list">${rows}</ul>${concl ? `<p>${concl}</p>` : ''}</section>`);
    }

    // ---- 3. Shaxs xususiyatlari ----
    if (has('ipip') || has('pf16') || has('accent')) {
      let html = '';
      if (has('ipip') && M.ipip.profile) {
        const B = BIG5(), P = M.ipip.profile;
        html += `<h3>${esc(nm('ipip'))}</h3>` + ['E', 'A', 'C', 'N', 'I'].filter(k => P[k] != null).map(k => { const p = (P[k] - 4) / 16 * 100; return bar(esc(B[k][0]), p, esc(p >= 70 ? B[k][1] : p <= 30 ? B[k][2] : L("o'rtacha", 'средне'))); }).join('');
        const p = k => (P[k] - 4) / 16 * 100;
        if (p('C') >= 70) strengths.push(L("mas'uliyatlilik va tartiblilik", 'добросовестность и организованность'));
        if (p('A') >= 70) strengths.push(L('odamlarga mehribonlik va hamkorlik', 'доброжелательность и готовность к сотрудничеству'));
        if (p('I') >= 70) strengths.push(L("boy tasavvur va g'oyalarga qiziqish", 'богатое воображение и интерес к идеям'));
        if (p('N') >= 70) growth.push(L('hissiy beqarorlik va xavotirga moyillik', 'эмоциональная неустойчивость и тревожность'));
        if (p('C') <= 30) growth.push(L("rejalashtirish va intizom", 'планирование и самодисциплина'));
      }
      if (has('pf16') && M.pf16.s && window.PL_PF16) {
        const F = window.PL_PF16.F(), S = M.pf16.s;
        const pr = Object.keys(S).filter(k => S[k] <= 3 || S[k] >= 8);
        html += `<h3>${esc(nm('pf16'))}</h3><p>${pr.length ? L('Yaqqol ifodalangan omillar: ', 'Ярко выраженные факторы: ') + pr.map(k => `<b>${esc(F[k][0])}</b> — ${esc(S[k] >= 8 ? F[k][2] : F[k][1])} (${S[k]})`).join('; ') : L("Barcha omillar o'rtacha diapazonda — profil muvozanatli.", 'Все факторы в среднем диапазоне — профиль сбалансирован.')}</p>`;
      }
      if (has('accent')) { const d = describe(M.accent); html += `<h3>${esc(nm('accent'))}</h3><p>${esc(d.result)}. ${esc(d.note || '')}</p>`; }
      sec.push(`<section class="card sm-sec"><h2>3. ${L('Shaxs xususiyatlari', 'Черты личности')}</h2>${html}</section>`);
    }

    // ---- 4. Qobiliyatlar ----
    const Q = window.PL_QOB || {};
    const abil = Object.keys(Q).filter(has).map(id => ({ id, p: M[id].index, name: nm(id) }));
    if (has('logic')) abil.push({ id: 'logic', p: Math.round(M.logic.score / (M.logic.max || 24) * 100), name: nm('logic') });
    let topAb = null, lowAb = null;
    if (abil.length) {
      abil.sort((a, b) => b.p - a.p); topAb = abil[0]; lowAb = abil.length > 1 ? abil[abil.length - 1] : null;
      const COLS = ['#1F9D7A', '#5B47E0', '#D98E04', '#E0466B', '#7B6CF6'];
      let html = abil.map((a, i) => bar(esc(a.name), a.p, esc(lvTxt(a.p)), i === 0 ? COLS[0] : null)).join('');
      html += `<p>${L('Eng kuchli qobiliyatingiz', 'Ваша самая сильная способность')}: <b>${esc(topAb.name)}</b> (${topAb.p}/100, ${esc(lvTxt(topAb.p))}).`;
      if (lowAb && topAb.p - lowAb.p >= 15) html += ` ${L('Nisbatan kuchsizroq', 'Относительно слабее')}: <b>${esc(lowAb.name)}</b> (${lowAb.p}).`;
      html += '</p>';
      if (Q[topAb.id]) html += `<p><b>${L('Mos sohalar', 'Подходящие сферы')}:</b> ${esc(Q[topAb.id].job[R()])}</p>`;
      if (topAb.p >= 70) strengths.push(L(`${topAb.name.toLowerCase()} yuqori`, `высокие ${topAb.name.toLowerCase()}`));
      if (lowAb && lowAb.p < 50 && Q[lowAb.id]) { growth.push(lowAb.name.toLowerCase()); recs.push(`${lowAb.name}: ${Q[lowAb.id].tip[R()]}`); }
      const missing = Object.keys(Q).filter(id => !has(id));
      if (missing.length) html += `<p class="meta">${L("To'liq qobiliyatlar profili uchun topshiring", 'Для полного профиля способностей пройдите')}: ${missing.map(id => `<a href="${link(id)}">${esc(nm(id))}</a>`).join(', ')}</p>`;
      sec.push(`<section class="card sm-sec"><h2>4. ${L('Qobiliyatlar profili', 'Профиль способностей')}</h2>${html}</section>`);
    }

    // ---- 5. Kognitiv funksiyalar ----
    const cog = ['rt', 'stroop', 'span', 'schulte', 'gonogo', 'corsi', 'nback', 'flanker', 'trail', 'words', 'hanoi', 'pulse'].filter(has);
    if (cog.length) {
      sec.push(`<section class="card sm-sec"><h2>5. ${L('Kognitiv funksiyalar (diqqat, xotira, tezlik)', 'Когнитивные функции (внимание, память, скорость)')}</h2>
        <table class="sm-tab">${cog.map(id => { const d = describe(M[id]); return `<tr><td>${esc(d.name)}</td><td><b>${esc(String(d.result))}</b></td><td>${esc(d.note || '')}</td></tr>`; }).join('')}</table></section>`);
    }

    // ---- 6. Hayot muvozanati ----
    if (has('lifewheel') && M.lifewheel.v) {
      const AR = [['Ish', 'Работа'], ["O'z ustida ishlash", 'Саморазвитие'], ["Do'stlar", 'Друзья'], ['Dam olish', 'Отдых'], ['Ota-ona', 'Родители'], ['Farzand tarbiyasi', 'Воспитание детей'], ["Sport va sog'liq", 'Спорт и здоровье'], ['Oila', 'Семья']];
      const v = M.lifewheel.v, ord = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
      const low = ord.filter(([x]) => x <= 5).slice(0, 3);
      if (low.length) { growth.push(L('hayot sohalari: ', 'сферы жизни: ') + low.map(([, i]) => AR[i][R()].toLowerCase()).join(', ')); }
      sec.push(`<section class="card sm-sec"><h2>6. ${L('Hayot muvozanati', 'Жизненный баланс')}</h2>
        <p>${L("O'rtacha qoniqish", 'Средняя удовлетворённость')}: <b>${M.lifewheel.value}/10</b>, ${L('muvozanat indeksi', 'индекс баланса')} ${M.lifewheel.balance}%.
        ${low.length ? L("E'tibor talab qiladigan sohalar: ", 'Сферы, требующие внимания: ') + low.map(([x, i]) => `<b>${esc(AR[i][R()])}</b> (${x})`).join(', ') + '.' : L("Barcha sohalarda qoniqish yetarli.", 'Удовлетворённость во всех сферах достаточная.')}</p></section>`);
    }

    // ---- Topshirilmagan asosiy testlar ----
    const CORE = ['ipip', 'temper', 'belov', 'tapping', 'phq9', 'gad7', 'rosenberg', 'qob_ped', 'qob_kom', 'qob_psy', 'qob_ijod', 'logic', 'lifewheel'].filter(id => TESTS[id] || EXPERIMENTS.find(e => e.id === id));
    const done = CORE.filter(has).length, todo = CORE.filter(id => !has(id));

    // ---- Umumiy xulosa ----
    let summ = '';
    if (!sec.length) {
      app.innerHTML = `<h1>${t('navSummary')}</h1><div class="card"><p>${esc(L("Hali birorta test topshirilmagan. Umumiy xulosa tuzish uchun quyidagi asosiy testlardan boshlang — har biri 2–15 daqiqa oladi.", 'Вы ещё не прошли ни одного теста. Чтобы составить общее заключение, начните с основных тестов — каждый занимает 2–15 минут.'))}</p>
        <ul class="sm-todo">${CORE.map(id => `<li><a href="${link(id)}">${esc(nm(id))}</a></li>`).join('')}</ul></div>`;
      return;
    }
    const uniq = a => [...new Set(a)];
    summ += `<p>${L(`Ushbu xulosa siz topshirgan ${Object.keys(M).length} ta test va tajribaning so'nggi natijalari asosida tuzildi.`, `Заключение составлено по последним результатам ${Object.keys(M).length} пройденных тестов и экспериментов.`)}</p>`;
    if (strengths.length) summ += `<p><b>${L('Kuchli tomonlaringiz', 'Ваши сильные стороны')}:</b> ${esc(uniq(strengths).join('; '))}.</p>`;
    if (growth.length) summ += `<p><b>${L("E'tibor va rivojlantirish talab qiladigan jihatlar", 'Что требует внимания и развития')}:</b> ${esc(uniq(growth).join('; '))}.</p>`;
    if (topAb && Q[topAb.id]) summ += `<p><b>${L("Kasbiy yo'nalish bo'yicha", 'По профессиональной направленности')}:</b> ${esc(L(`qobiliyatlaringiz profili bo'yicha sizga eng mos yo'nalish — "${topAb.name}" talab qiladigan sohalar: ${Q[topAb.id].job[0]}`, `по профилю способностей вам больше всего подходят сферы, где нужны «${topAb.name}»: ${Q[topAb.id].job[1]}`))}</p>`;
    if (recs.length) summ += `<p><b>${L('Tavsiyalar', 'Рекомендации')}:</b></p><ul>${uniq(recs).map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    summ += `<p>${L('Rivojlanish uchun aniq maqsad va kunlik topshiriqlar tuzing:', 'Составьте конкретные цели и ежедневные задания:')} <a href="#plan">${L('Rivojlanish xaritasi', 'Карта развития')}</a></p>`;

    app.innerHTML = `
      <div class="sm-head"><div><h1>${t('navSummary')}</h1><p class="meta">${fmtD(new Date())} · ${L('topshirilgan asosiy testlar', 'пройдено основных тестов')}: ${done}/${CORE.length}</p></div>
        <div class="row-actions"><button class="btn secondary" onclick="window.print()">${L('Chop etish / PDF', 'Печать / PDF')}</button></div></div>
      <div class="sm-progress"><i style="width:${done / CORE.length * 100}%"></i></div>
      ${warn.map(w => `<div class="notice danger">${esc(w)}</div>`).join('')}
      <section class="conclusion sm-main"><h2>${L('Umumiy xulosa', 'Общее заключение')}</h2>${summ}</section>
      ${sec.join('')}
      ${todo.length ? `<section class="card sm-sec sm-todo-sec"><h2>${L("Xulosani to'ldirish uchun", 'Чтобы дополнить заключение')}</h2><p class="meta">${L("Quyidagi testlarni topshirsangiz, xulosa aniqroq bo'ladi:", 'Пройдите эти тесты, чтобы заключение стало точнее:')}</p><ul class="sm-todo">${todo.map(id => `<li><a href="${link(id)}">${esc(nm(id))}</a></li>`).join('')}</ul></section>` : ''}
      <p class="meta">${esc(L("Bu avtomatik tuzilgan o'z-o'zini anglash hisoboti, tibbiy yoki psixologik tashxis emas. Natijalar faqat sizning brauzeringizda qayta ishlanadi. Muhim qarorlar (kasb tanlash, davolanish) uchun hisobotni psixolog bilan muhokama qiling.", 'Это автоматический отчёт для самопознания, а не медицинский или психологический диагноз. Результаты обрабатываются только в вашем браузере. Для важных решений (выбор профессии, лечение) обсудите отчёт с психологом.'))}</p>`;
  }

  const css = document.createElement('style');
  css.textContent = `
  .sm-head{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;flex-wrap:wrap}
  .sm-progress{height:8px;border-radius:4px;background:rgba(201,190,255,.25);margin:.4rem 0 1.2rem;overflow:hidden}.sm-progress i{display:block;height:100%;background:#4FE0C1}
  .sm-main{margin-bottom:1rem}.sm-main p{margin:.5rem 0}
  .card.sm-sec{margin:1rem 0}.sm-sec h2{font-size:1.15rem;margin:0 0 .7rem}.sm-sec h3{font-size:.98rem;margin:1rem 0 .4rem;color:var(--muted)}
  .sm-list{list-style:none;padding:0;margin:0}.sm-list li{padding:.45rem .6rem;border-left:4px solid #C9BEFF;margin:.35rem 0;background:#F8F6FF;border-radius:6px}
  .sm-list li.ok{border-left-color:#1F9D7A}.sm-list li.bad{border-left-color:#E0466B}.sm-list small{color:var(--muted)}
  .sm-row{display:grid;grid-template-columns:minmax(150px,240px) 1fr 40px minmax(120px,240px);gap:.7rem;align-items:center;margin:.45rem 0;font-size:.9rem;color:var(--text)}
  .sm-row b{font-family:var(--display)}.sm-row em{font-style:normal;color:var(--muted);font-size:.82rem}
  .sm-bar{height:12px;border-radius:6px;background:#EEEAFB;overflow:hidden}.sm-bar i{display:block;height:100%;background:var(--accent);border-radius:6px}
  .sm-tab{width:100%;border-collapse:collapse;font-size:.9rem;color:var(--text)}.sm-tab td{padding:.45rem .5rem;border-top:1px solid var(--border)}
  .sm-todo{columns:2;padding-left:1.2rem}.sm-todo li{margin:.25rem 0}
  @media (max-width:640px){.sm-row{grid-template-columns:1fr 40px}.sm-row .sm-bar{grid-column:1/3;grid-row:2}.sm-row em{grid-column:1/3}.sm-todo{columns:1}}
  @media print{header,footer,.row-actions,nav,.sm-todo-sec{display:none!important}.sm-sec{break-inside:avoid}}`;
  document.head.appendChild(css);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    _route();
    const pg = (location.hash || '#home').slice(1).split('/')[0];
    if (pg === 'xulosa') { view(); window.scrollTo(0, 0); }
    if (pg === 'results' && !app.querySelector('.sm-cta')) app.insertAdjacentHTML('afterbegin', `<a class="card sm-cta" href="#xulosa" style="display:block;margin-bottom:1rem;text-decoration:none;color:var(--text)"><b>📋 ${t('navSummary')}</b> — ${esc(L("barcha natijalaringizni bitta yaxlit hisobotga birlashtiring", 'объедините все результаты в один целостный отчёт'))} →</a>`);
    document.querySelectorAll('header nav a').forEach(a => { if (a.getAttribute('href') === '#xulosa') a.classList.toggle('active', pg === 'xulosa'); });
  };
  window.addEventListener('hashchange', route);
  route();
})();
