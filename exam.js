/* PsixoLab — Bilim testlari (fanlar bo'yicha nazorat): har urinishda mavzular bo'yicha mutanosib 30 ta tasodifiy savol,
   variantlar aralashtiriladi, vaqt cheklangan, oxirida baho va har savolning to'g'ri javobi ko'rsatiladi. */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const $ = id => document.getElementById(id);
  const COUNT = 30, MINUTES = 30, KEY = 'psixolab-exam-run';
  const EX = window.EXAMS || {};

  Object.assign(T.uz, { navExams: 'Bilim testlari' });
  Object.assign(T.ru, { navExams: 'Тесты знаний' });

  // Navigatsiyaga havola
  const nav = document.querySelector('header nav');
  if (nav && !nav.querySelector('a[href="#exams"]')) {
    const a = document.createElement('a'); a.href = '#exams'; a.dataset.i18n = 'navExams'; a.textContent = t('navExams');
    const after = nav.querySelector('a[href="#experiments"]'); after ? after.after(a) : nav.appendChild(a);
  }

  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function pick(ex) {
    const nT = ex.topics.length, by = Array.from({ length: nT }, () => []);
    ex.qs.forEach((q, i) => by[q[0]].push(i));
    const n = Math.min(COUNT, ex.qs.length), raw = by.map(b => b.length / ex.qs.length * n);
    const quota = raw.map(Math.floor);
    let rest = n - quota.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0 && quota[i] < by[i].length) { quota[i]++; rest--; } });
    const ids = [];
    by.forEach((b, i) => ids.push(...shuffle(b.slice()).slice(0, quota[i])));
    return shuffle(ids).map(i => ({ i, o: shuffle([0, 1, 2, 3]) }));
  }
  const loadRun = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const saveRun = r => { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {} };
  const clearRun = () => { try { localStorage.removeItem(KEY); } catch (e) {} };
  const grade = p => p >= 86 ? ['5', L("a'lo", 'отлично')] : p >= 71 ? ['4', L('yaxshi', 'хорошо')] : p >= 55 ? ['3', L('qoniqarli', 'удовлетворительно')] : ['2', L('qoniqarsiz', 'неудовлетворительно')];

  function viewList() {
    app.innerHTML = `
      <h1>${t('navExams')}</h1>
      <p class="hero-lead" style="color:inherit">${esc(L("Fanlar bo'yicha bilimingizni tekshiring: har kirishda savollar bazasidan tasodifiy 30 ta savol tushadi, oxirida bahongiz va har bir savolning to'g'ri javobi ko'rsatiladi.", 'Проверьте знания по дисциплинам: при каждом входе из базы выбираются 30 случайных вопросов, в конце — оценка и правильные ответы на каждый вопрос.'))}</p>
      <div class="exam-list">${Object.entries(EX).map(([id, e]) => `
        <a class="card exam-card" href="#exam/${id}">
          <h3>${esc(e.title)}</h3>
          <p>${e.qs.length} ${L("ta savol bazasi", 'вопросов в базе')} · ${COUNT} ${L('ta savol', 'вопросов')} · ${MINUTES} ${L('daqiqa', 'минут')}</p>
          <ol>${e.topics.map(tp => `<li>${esc(tp)}</li>`).join('')}</ol>
          <span class="btn">${L('Testni boshlash', 'Начать тест')}</span>
        </a>`).join('')}</div>`;
  }

  let run, tick;
  function viewStart(id) {
    const e = EX[id]; if (!e) { location.hash = '#exams'; return; }
    const prev = loadRun();
    if (prev && prev.id === id && !prev.done) { run = prev; viewQ(); return; }
    let me = {}; try { me = JSON.parse(localStorage.getItem('psixolab-exam-me')) || {}; } catch (x) {}
    app.innerHTML = `
      <a href="#exams">← ${t('back')}</a>
      <h1>${esc(e.title)}</h1>
      <div class="card">
        <p>${esc(L(`Testda ${COUNT} ta savol bo'ladi, ular ${e.qs.length} ta savollik bazadan barcha mavzular bo'yicha mutanosib ravishda tasodifiy tanlanadi. Har bir savolda 4 ta javob varianti bor, faqat bittasi to'g'ri. Vaqt — ${MINUTES} daqiqa; vaqt tugasa, test avtomatik yakunlanadi. Savollar orasida bemalol oldinga-orqaga o'tishingiz mumkin.`, `В тесте ${COUNT} вопросов, они случайно выбираются из базы в ${e.qs.length} вопросов пропорционально по всем темам. В каждом вопросе 4 варианта, верный только один. Время — ${MINUTES} минут; по истечении тест завершится автоматически. Между вопросами можно свободно переходить.`))}</p>
        <label class="exam-f">${L('Ism va familiya', 'Имя и фамилия')}<input id="xname" maxlength="80" value="${esc(me.n || '')}" autocomplete="name"></label>
        <label class="exam-f">${L('Guruh (ixtiyoriy)', 'Группа (необязательно)')}<input id="xgroup" maxlength="40" value="${esc(me.g || '')}"></label>
        <p id="xerr" class="notice danger" hidden>${L('Ism va familiyangizni kiriting.', 'Введите имя и фамилию.')}</p>
        <div class="row-actions"><button class="btn big" id="xgo">${L('Testni boshlash', 'Начать тест')}</button></div>
      </div>`;
    $('xgo').addEventListener('click', () => {
      const n = $('xname').value.trim(), g = $('xgroup').value.trim();
      if (n.length < 3) { $('xerr').hidden = false; $('xname').focus(); return; }
      try { localStorage.setItem('psixolab-exam-me', JSON.stringify({ n, g })); } catch (x) {}
      run = { id, name: n, group: g, items: pick(e), ans: [], cur: 0, t0: Date.now(), done: false };
      run.ans = Array(run.items.length).fill(-1);
      saveRun(run); viewQ();
    });
  }

  function left() { return Math.max(0, MINUTES * 60 - Math.floor((Date.now() - run.t0) / 1000)); }
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  function viewQ() {
    const e = EX[run.id], k = run.cur, it = run.items[k], q = e.qs[it.i], n = run.items.length;
    const answered = run.ans.filter(x => x >= 0).length;
    app.innerHTML = `
      <div class="exam-bar"><b>${esc(e.title)}</b><span class="exam-timer" id="xtime">${fmt(left())}</span></div>
      <div class="progress"><div style="width:${answered / n * 100}%"></div></div>
      <div class="exam-dots">${run.items.map((_, j) => `<button type="button" data-j="${j}" class="${j === k ? 'cur' : ''} ${run.ans[j] >= 0 ? 'ok' : ''}">${j + 1}</button>`).join('')}</div>
      <div class="card exam-q">
        <p class="meta">${L('Savol', 'Вопрос')} ${k + 1} / ${n} · ${esc(e.topics[q[0]])}</p>
        <h2>${esc(q[1])}</h2>
        <div class="exam-opts">${it.o.map((oi, j) => `<button type="button" data-o="${oi}" class="${run.ans[k] === oi ? 'on' : ''}"><span>${'ABCD'[j]}</span>${esc(q[2][oi])}</button>`).join('')}</div>
      </div>
      <div class="row-actions exam-nav">
        <button class="btn secondary" id="xprev" ${k === 0 ? 'disabled' : ''}>← ${L('Oldingi', 'Назад')}</button>
        ${k < n - 1 ? `<button class="btn" id="xnext">${L('Keyingi', 'Далее')} →</button>` : ''}
        <button class="btn ${k === n - 1 ? '' : 'secondary'}" id="xfin">${L('Testni yakunlash', 'Завершить тест')}</button>
      </div>
      <div id="xconf"></div>`;
    app.querySelectorAll('.exam-opts button').forEach(b => b.addEventListener('click', () => {
      run.ans[k] = +b.dataset.o; saveRun(run);
      if (k < n - 1) { run.cur = k + 1; saveRun(run); setTimeout(viewQ, 180); app.querySelectorAll('.exam-opts button').forEach(x => x.classList.toggle('on', x === b)); }
      else viewQ();
    }));
    app.querySelectorAll('.exam-dots button').forEach(b => b.addEventListener('click', () => { run.cur = +b.dataset.j; saveRun(run); viewQ(); }));
    $('xprev').addEventListener('click', () => { run.cur = k - 1; saveRun(run); viewQ(); });
    if ($('xnext')) $('xnext').addEventListener('click', () => { run.cur = k + 1; saveRun(run); viewQ(); });
    $('xfin').addEventListener('click', () => {
      const miss = run.ans.filter(x => x < 0).length;
      if (!miss) { finish(); return; }
      $('xconf').innerHTML = `<div class="notice warn">${L(`${miss} ta savolga javob berilmagan — ular xato hisoblanadi. Baribir yakunlaysizmi?`, `Без ответа: ${miss} — они будут засчитаны как неверные. Всё равно завершить?`)}
        <div class="row-actions"><button class="btn" id="xyes">${L('Ha, yakunlash', 'Да, завершить')}</button><button class="btn secondary" id="xno">${L('Javob berishga qaytish', 'Вернуться к ответам')}</button></div></div>`;
      $('xyes').addEventListener('click', () => finish());
      $('xno').addEventListener('click', () => { run.cur = run.ans.indexOf(-1); saveRun(run); viewQ(); });
      $('xconf').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    clearInterval(tick);
    tick = setInterval(() => {
      if (!$('xtime')) { clearInterval(tick); return; }
      const s = left(); $('xtime').textContent = fmt(s); $('xtime').classList.toggle('low', s < 120);
      if (s <= 0) { clearInterval(tick); finish(true); }
    }, 1000);
    window.scrollTo(0, 0);
  }

  function finish(timeout) {
    clearInterval(tick);
    const e = EX[run.id], n = run.items.length;
    const ok = run.items.map((it, k) => run.ans[k] === e.qs[it.i][3]);
    const score = ok.filter(Boolean).length, pct = Math.round(score / n * 100), sec = Math.min(MINUTES * 60, Math.round((Date.now() - run.t0) / 1000));
    run.done = true; clearRun();
    saveResult({ type: 'exam', id: run.id, name: run.name, group: run.group, value: score, max: n, pct, time: sec, q: run.items.map((it, k) => [it.i, run.ans[k]]) });
    showResult(run, ok, score, pct, sec, timeout);
  }

  function showResult(r, ok, score, pct, sec, timeout) {
    const e = EX[r.id], n = r.items.length, [g, gw] = grade(pct);
    const byT = e.topics.map((tp, ti) => { const ks = r.items.map((it, k) => k).filter(k => e.qs[r.items[k].i][0] === ti); return [tp, ks.filter(k => ok[k]).length, ks.length]; });
    const d = new Date();
    app.innerHTML = `
      <h1>${esc(e.title)}: ${L('natija', 'результат')}</h1>
      ${timeout ? `<div class="notice warn">${L('Vaqt tugadi, test avtomatik yakunlandi.', 'Время истекло, тест завершён автоматически.')}</div>` : ''}
      <div class="card exam-res">
        <div class="exam-grade g${g}"><b>${g}</b><span>${esc(gw)}</span></div>
        <div>
          <p class="exam-who"><strong>${esc(r.name)}</strong>${r.group ? ` · ${esc(r.group)}` : ''}</p>
          <div class="score">${score} / ${n} <small>(${pct}%)</small></div>
          <p class="meta">${d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ')} ${d.toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', { hour: '2-digit', minute: '2-digit' })} · ${L('sarflangan vaqt', 'затрачено')} ${fmt(sec)}</p>
          <p class="meta">${L("Baholash: 86% va yuqori — 5, 71–85% — 4, 55–70% — 3, 55% dan past — 2.", 'Шкала: от 86% — 5, 71–85% — 4, 55–70% — 3, ниже 55% — 2.')}</p>
        </div>
      </div>
      <div class="card">
        <h2>${L("Mavzular bo'yicha", 'По темам')}</h2>
        ${byT.filter(x => x[2]).map(([tp, a, b]) => `<div class="exam-tp"><span>${esc(tp)}</span><div class="exam-tpbar"><i style="width:${a / b * 100}%"></i></div><b>${a}/${b}</b></div>`).join('')}
      </div>
      <h2>${L("Javoblar tahlili", 'Разбор ответов')}</h2>
      <div class="exam-review">${r.items.map((it, k) => { const q = e.qs[it.i], a = r.ans[k]; return `
        <div class="card exam-rv ${ok[k] ? 'right' : 'wrong'}">
          <p class="meta">${k + 1}. ${ok[k] ? '✓ ' + L("To'g'ri", 'Верно') : a < 0 ? '✗ ' + L('Javob berilmagan', 'Нет ответа') : '✗ ' + L("Noto'g'ri", 'Неверно')}</p>
          <p><strong>${esc(q[1])}</strong></p>
          <ul>${it.o.map((oi, j) => `<li class="${oi === q[3] ? 'c' : oi === a ? 'x' : ''}"><span>${'ABCD'[j]}</span>${esc(q[2][oi])}${oi === q[3] ? ` <em>— ${L("to'g'ri javob", 'верный ответ')}</em>` : oi === a ? ` <em>— ${L('sizning javobingiz', 'ваш ответ')}</em>` : ''}</li>`).join('')}</ul>
        </div>`; }).join('')}</div>
      <div class="row-actions"><a class="btn" href="#exam/${r.id}" onclick="setTimeout(route,0)">${L('Qayta topshirish (yangi savollar)', 'Пройти снова (новые вопросы)')}</a><button class="btn secondary" onclick="window.print()">${L('Chop etish / PDF', 'Печать / PDF')}</button><a class="btn secondary" href="#exams">${t('navExams')}</a></div>`;
    window.scrollTo(0, 0);
  }

  const _desc = describe;
  describe = function (r) {
    if (r.type === 'exam') {
      const e = EX[r.id] || { title: r.id };
      return { name: `${e.title} (${L('bilim testi', 'тест знаний')})`, result: `${r.value} / ${r.max} (${r.pct}%)`, note: `${L('Baho', 'Оценка')}: ${grade(r.pct)[0]}${r.name ? ' · ' + r.name : ''}` };
    }
    return _desc(r);
  };

  const css = document.createElement('style');
  css.textContent = `
  .exam-list{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));margin-top:1rem}
  .exam-card{display:block;color:var(--text);text-decoration:none}.exam-card h3{margin:0 0 .3rem}
  .exam-card ol{color:var(--muted);font-size:.9rem;padding-left:1.2rem;margin:.6rem 0 1rem}
  .exam-f{display:block;font-weight:600;margin:.8rem 0}.exam-f input{display:block;width:100%;max-width:420px;margin-top:.3rem;padding:.6rem .8rem;border:1.5px solid var(--border);border-radius:10px;font:inherit;box-sizing:border-box}
  .exam-bar{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin:.5rem 0}
  .exam-timer{font:700 1.4rem var(--display);font-variant-numeric:tabular-nums;color:inherit}.exam-timer.low{color:#FF6F91}
  .exam-dots{display:flex;flex-wrap:wrap;gap:5px;margin:.8rem 0}
  .exam-dots button{width:34px;height:34px;border-radius:9px;border:1.5px solid rgba(201,190,255,.45);background:transparent;color:inherit;font-weight:700;cursor:pointer}
  .exam-dots button.ok{background:#C9BEFF;color:#16123F;border-color:#C9BEFF}.exam-dots button.cur{outline:3px solid #4FE0C1;outline-offset:1px}
  .exam-q h2{font-size:1.2rem;line-height:1.45;margin:.4rem 0 1rem}
  .exam-opts{display:flex;flex-direction:column;gap:.55rem}
  .exam-opts button{display:flex;gap:.8rem;align-items:flex-start;text-align:left;padding:.8rem 1rem;border:1.5px solid var(--border);border-radius:12px;background:#fff;color:var(--text);font:inherit;cursor:pointer;line-height:1.45}
  .exam-opts button:hover{border-color:var(--accent)}
  .exam-opts button span,.exam-rv li span{flex:none;width:26px;height:26px;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:.85rem}
  .exam-opts button.on{border-color:var(--accent);background:var(--accent-soft)}.exam-opts button.on span{background:var(--accent);color:#fff}
  .card.exam-res{display:flex;flex-direction:row;text-align:left;justify-content:flex-start;gap:1.5rem;align-items:center;margin-bottom:1rem}.exam-res>div:last-child{flex:1;min-width:0}
  @media (max-width:560px){.card.exam-res{flex-direction:column;align-items:flex-start}}
  .exam-grade{width:120px;height:120px;border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;background:#5B47E0}
  .exam-grade b{font:800 3.4rem/1 var(--display)}.exam-grade span{font-weight:700}
  .exam-grade.g5{background:#1F9D7A}.exam-grade.g4{background:#5B47E0}.exam-grade.g3{background:#D98E04}.exam-grade.g2{background:#E0466B}
  .exam-who{font-size:1.1rem;margin:0}.score small{font-size:.5em;color:var(--muted)}
  .exam-tp{display:grid;grid-template-columns:minmax(0,1fr) 160px 48px;gap:.8rem;align-items:center;margin:.5rem 0;font-size:.92rem}
  .exam-tpbar{height:10px;border-radius:5px;background:#E7E2FA;overflow:hidden}.exam-tpbar i{display:block;height:100%;background:var(--accent)}
  .exam-review{display:flex;flex-direction:column;gap:.7rem}
  .exam-rv{border-left:6px solid #E0466B}.exam-rv.right{border-left-color:#1F9D7A}
  .exam-rv ul{list-style:none;padding:0;margin:.5rem 0 0;display:flex;flex-direction:column;gap:.35rem}
  .exam-rv li{display:flex;gap:.6rem;align-items:flex-start;padding:.4rem .6rem;border-radius:8px;line-height:1.4}
  .exam-rv li.c{background:#E3F6EF;font-weight:600}.exam-rv li.c span{background:#1F9D7A;color:#fff}
  .exam-rv li.x{background:#FDE7EC}.exam-rv li.x span{background:#E0466B;color:#fff}.exam-rv li em{font-style:normal;color:var(--muted);font-weight:500}
  @media (max-width:640px){.exam-tp{grid-template-columns:1fr 48px}.exam-tpbar{grid-column:1/3;grid-row:2}.exam-dots button{width:30px;height:30px}}
  @media print{header,footer,.row-actions,nav{display:none!important}.exam-rv{break-inside:avoid}}`;
  document.head.appendChild(css);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    const [pg, arg] = (location.hash || '#home').slice(1).split('/');
    if (pg !== 'exam') clearInterval(tick);
    _route();
    if (pg === 'exams') { document.body.dataset.page = 'exams'; viewList(); window.scrollTo(0, 0); }
    else if (pg === 'exam') { document.body.dataset.page = 'exams'; viewStart(arg); }
    document.querySelectorAll('header nav a').forEach(a => { if (a.getAttribute('href') === '#exams') a.classList.toggle('active', pg === 'exams' || pg === 'exam'); });
  };
  window.addEventListener('hashchange', route);
  route();
})();
