/* PsixoLab — Hayot muvozanati g'ildiragi (Wheel of Life): 8 soha bo'yicha qoniqishni 1–10 ballda baholash */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const $ = id => document.getElementById(id);
  const AREAS = [
    ['Ish', 'Работа', '#5B47E0'],
    ["O'z ustida ishlash", 'Саморазвитие', '#2BA88F'],
    ["Do'stlar", 'Друзья', '#F59E0B'],
    ['Dam olish va qiziqishlar', 'Отдых и хобби', '#EC4899'],
    ['Ota-ona va qarindoshlar', 'Родители и родственники', '#A16207'],
    ['Farzand tarbiyasi', 'Воспитание детей', '#06B6D4'],
    ["Sport va sog'liq", 'Спорт и здоровье', '#84CC16'],
    ["Oila (uy-ro'zg'or)", 'Семья (домашние дела)', '#F97316']
  ];
  const TIPS = [
    ["Ishingizda sizni nima qoniqtirmayapti: vazifa, jamoa, maosh yoki rivojlanish imkoniyati? Eng muhim bittasini tanlab, rahbaringiz bilan suhbat yoki yangi ko'nikma bo'yicha aniq qadam belgilang.", 'Что именно не устраивает в работе: задачи, коллектив, доход или возможности роста? Выберите главное и наметьте конкретный шаг — разговор с руководителем или освоение нового навыка.'],
    ["Haftasiga kamida 2–3 soatni o'qish, kurs yoki yangi ko'nikmaga ajrating. Kichik, lekin muntazam qadam katta o'zgarish beradi.", 'Выделяйте хотя бы 2–3 часа в неделю на чтение, курс или новый навык. Небольшие, но регулярные шаги дают большие перемены.'],
    ["Bir-ikki yaqin do'stingiz bilan aloqani tiklang: qo'ng'iroq qiling yoki shu hafta uchrashuv belgilang.", 'Восстановите связь с одним-двумя близкими друзьями: позвоните или назначьте встречу на этой неделе.'],
    ["Dam olishni ham reja qiling: haftada kamida bir marta faqat o'zingizga yoqqan mashg'ulotga vaqt ajrating.", 'Планируйте и отдых: хотя бы раз в неделю выделяйте время только на любимое занятие.'],
    ["Ota-onangiz va qarindoshlaringiz bilan muntazam aloqa jadvalini tuzing — qisqa qo'ng'iroq ham muhim.", 'Составьте график регулярного общения с родителями и родственниками — даже короткий звонок важен.'],
    ["Har kuni farzandingiz bilan 15–20 daqiqa telefonsiz, to'liq e'tibor bilan vaqt o'tkazing.", 'Каждый день проводите с ребёнком 15–20 минут без телефона, с полным вниманием.'],
    ["Uyqu, ovqatlanish va harakatdan boshlang: kuniga 30 daqiqa yurish va muntazam uyqu — eng oson birinchi qadam.", 'Начните со сна, питания и движения: 30 минут ходьбы в день и режим сна — самый простой первый шаг.'],
    ["Uydagi vazifalarni oila a'zolari bilan qayta taqsimlang va haftada bir marta birga vaqt o'tkazishni rejalashtiring.", 'Перераспределите домашние обязанности с членами семьи и запланируйте раз в неделю совместное время.']
  ];
  Object.assign(T.uz, { lwTitle: "Hayot muvozanati g'ildiragi", lwDesc: "Hayotingizning 8 ta sohasidan qoniqishingizni baholang: g'ildirak qaysi soha \"cho'kib\" qolganini va nimadan boshlash kerakligini ko'rsatadi." });
  Object.assign(T.ru, { lwTitle: 'Колесо жизненного баланса', lwDesc: 'Оцените удовлетворённость 8 сферами жизни: колесо покажет, какая сфера «проседает» и с чего начать.' });
  EXPERIMENTS.push({ id: 'lifewheel', title: 'lwTitle', desc: 'lwDesc', minutes: 5 });

  function wheelSvg(v) {
    const S = 360, C = S / 2, R = 140, n = AREAS.length;
    const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
    let g = '';
    for (let k = 2; k <= 10; k += 2) g += `<circle cx="${C}" cy="${C}" r="${R * k / 10}" fill="none" stroke="#E4DFF7"/>`;
    const sec = (i, r) => { const [x1, y1] = pt(i - 0.5, r), [x2, y2] = pt(i + 0.5, r); return `M${C},${C} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`; };
    let s = '';
    AREAS.forEach((a, i) => {
      s += `<path d="${sec(i, R * (v[i] || 0) / 10)}" fill="${a[2]}" fill-opacity=".78" stroke="#fff" stroke-width="1.5"/>`;
      const [x, y] = pt(i - 0.5, R); s += `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}" stroke="#D6D0F0"/>`;
      const [tx, ty] = pt(i, R * 0.5 > R * (v[i] || 0) / 10 - 18 ? R * (v[i] || 0) / 10 + 14 : R * (v[i] || 0) / 10 - 16);
      s += `<text x="${tx}" y="${ty + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#1E1A4D">${v[i] || ''}</text>`;
    });
    return `<svg viewBox="0 0 ${S} ${S}" class="lw-svg" role="img" aria-label="${esc(t('lwTitle'))}">${g}${s}<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#B9B0E6" stroke-width="2"/></svg>`;
  }
  const legend = () => `<div class="lw-legend">${AREAS.map(a => `<span><i style="background:${a[2]}"></i>${esc(L(a[0], a[1]))}</span>`).join('')}</div>`;

  let vals, why;
  function viewForm() {
    vals = vals || Array(8).fill(0); why = why || Array(8).fill('');
    app.innerHTML = `
      <a href="#experiments">← ${t('back')}</a>
      <h1>${esc(t('lwTitle'))}</h1>
      <p class="meta">${esc(L("Hayotni tahlil qilish va to'g'ri rejalashtirish metodikasi", 'Методика анализа и правильного планирования жизни'))}</p>
      <div class="card lw-grid">
        <div>
          <p>${esc(L("Hayotingizning har bir sohasidan hozir qanchalik qoniqqaningizni belgilang: 1 — juda yomon, 10 — a'lo. Ixtiyoriy ravishda \"Nega?\" maydoniga sababini qisqacha yozing — bu xulosa uchun juda foydali.", 'Отметьте, насколько вы сейчас удовлетворены каждой сферой жизни: 1 — очень плохо, 10 — отлично. По желанию кратко напишите причину в поле «Почему?» — это очень полезно для вывода.'))}</p>
          ${AREAS.map((a, i) => `
            <div class="lw-row">
              <div class="lw-h"><i style="background:${a[2]}"></i><b>${esc(L(a[0], a[1]))}</b><span class="lw-v" id="lv${i}">${vals[i] || '—'}</span></div>
              <div class="lw-sc">${Array.from({ length: 10 }, (_, k) => `<button type="button" data-i="${i}" data-v="${k + 1}" class="${vals[i] === k + 1 ? 'on' : ''}">${k + 1}</button>`).join('')}</div>
              <input type="text" id="lw${i}" maxlength="200" placeholder="${esc(L('Nega? (ixtiyoriy)', 'Почему? (необязательно)'))}" value="${esc(why[i])}">
            </div>`).join('')}
          <div class="row-actions"><button class="btn" id="lwgo" ${vals.every(x => x) ? '' : 'disabled'}>${esc(L("Natijani ko'rish", 'Посмотреть результат'))}</button></div>
          <p class="meta" id="lwleft"></p>
        </div>
        <div class="lw-side">${wheelSvg(vals)}${legend()}</div>
      </div>`;
    const upd = () => {
      app.querySelector('.lw-side').innerHTML = wheelSvg(vals) + legend();
      const left = vals.filter(x => !x).length;
      $('lwgo').disabled = left > 0;
      $('lwleft').textContent = left ? L(`Yana ${left} ta sohani baholang`, `Осталось оценить сфер: ${left}`) : '';
    };
    app.querySelectorAll('.lw-sc button').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.i; vals[i] = +b.dataset.v;
      b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      $('lv' + i).textContent = vals[i]; upd();
    }));
    AREAS.forEach((_, i) => $('lw' + i).addEventListener('input', e => { why[i] = e.target.value; }));
    $('lwgo').addEventListener('click', viewResult);
    upd();
  }

  function viewResult() {
    const v = vals.slice(), avg = Math.round(v.reduce((a, b) => a + b, 0) / 8 * 10) / 10;
    const max = Math.max(...v), min = Math.min(...v), spread = max - min;
    const sd = Math.sqrt(v.reduce((s, x) => s + (x - avg) ** 2, 0) / 8);
    const balance = Math.max(0, Math.round(100 - sd / 4.5 * 100));
    const order = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const low = order.filter(([x]) => x <= Math.min(6, avg)).slice(0, 3);
    const focus = low.length ? low : order.slice(0, 2);
    const strong = order.slice().reverse().filter(([x]) => x >= 8).slice(0, 3);
    const lvl = avg >= 8 ? L("Umumiy qoniqish yuqori", 'Общая удовлетворённость высокая') : avg >= 6 ? L("Umumiy qoniqish o'rtacha", 'Общая удовлетворённость средняя') : avg >= 4 ? L("Umumiy qoniqish o'rtachadan past", 'Общая удовлетворённость ниже средней') : L('Umumiy qoniqish past', 'Общая удовлетворённость низкая');
    const shape = spread <= 2 ? L("G'ildiragingiz deyarli tekis — sohalar o'rtasida muvozanat yaxshi.", 'Колесо почти ровное — между сферами хороший баланс.')
      : spread <= 4 ? L("G'ildirak biroz notekis: ayrim sohalar boshqalaridan orqada qolmoqda.", 'Колесо немного неровное: некоторые сферы отстают от других.')
      : L("G'ildirak ancha notekis — bunday g'ildirak \"silkinib\" aylanadi. Ba'zi sohalarga e'tibor boshqalari hisobiga ortiqcha ketayotgan bo'lishi mumkin.", 'Колесо заметно неровное — такое колесо катится «с тряской». Возможно, внимание к одним сферам идёт за счёт других.');
    saveResult({ type: 'exp', id: 'lifewheel', value: avg, v, balance, why: why.slice() });
    app.innerHTML = `
      <h1>${esc(t('lwTitle'))}</h1>
      <div class="card lw-grid">
        <div>
          <div class="score">${avg} / 10</div>
          <p><strong>${esc(lvl)}</strong></p>
          <p>${esc(L('Muvozanat indeksi', 'Индекс баланса'))}: <strong>${balance}%</strong> · ${esc(L('farq', 'разброс'))} ${min}–${max}</p>
          <p>${esc(shape)}</p>
        </div>
        <div class="lw-side">${wheelSvg(v)}${legend()}</div>
      </div>
      <div class="conclusion">
        <h2>${L('Xulosa', 'Заключение')}</h2>
        ${strong.length ? `<p><strong>${L('Kuchli tomonlaringiz', 'Ваши опоры')}:</strong> ${strong.map(([x, i]) => `${esc(L(AREAS[i][0], AREAS[i][1]))} (${x})`).join(', ')}. ${esc(L("Bu sohalar sizga kuch beradi — ulardan boshqa sohalarni ko'tarish uchun tayanch sifatida foydalaning.", 'Эти сферы дают вам силы — используйте их как опору для подъёма остальных.'))}</p>` : ''}
        <p><strong>${L("Birinchi navbatdagi e'tibor", 'Приоритет внимания')}:</strong></p>
        <ul>${focus.map(([x, i]) => `<li><strong>${esc(L(AREAS[i][0], AREAS[i][1]))} (${x})</strong>${why[i] ? ` — <em>«${esc(why[i])}»</em>` : ''}<br>${esc(L(TIPS[i][0], TIPS[i][1]))}</li>`).join('')}</ul>
        <p>${esc(L("Hammasini birdaniga o'zgartirishga urinmang. Bitta sohani tanlang va keyingi 7 kunda uni 1 ballga ko'tarish uchun nima qilishingizni yozing. Shu natijani bir oydan keyin takrorlab, g'ildiraklarni solishtiring.", 'Не пытайтесь изменить всё сразу. Выберите одну сферу и запишите, что сделаете за 7 дней, чтобы поднять её на 1 балл. Повторите оценку через месяц и сравните колёса.'))}</p>
        <p><a href="#plan">${esc(L("Rivojlanish xaritasida maqsad va kunlik topshiriqlar tuzish →", 'Составить цели и ежедневные задания в карте развития →'))}</a></p>
        <p class="meta">${esc(L("Bu o'zini baholash va rejalashtirish vositasi (coaching amaliyotidagi «Wheel of Life», P. J. Meyer), standartlashtirilgan psixologik test yoki tashxis emas. Natija hozirgi kayfiyatingizga ham bog'liq.", 'Это инструмент самооценки и планирования («Колесо баланса», P. J. Meyer, практика коучинга), а не стандартизированный психологический тест или диагноз. Результат зависит и от текущего настроения.'))}</p>
      </div>
      <div class="row-actions"><button class="btn" id="lwagain">${esc(L("Baholarni o'zgartirish", 'Изменить оценки'))}</button><button class="btn secondary" onclick="window.print()">${esc(L('Chop etish / PDF', 'Печать / PDF'))}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
    $('lwagain').addEventListener('click', () => { viewForm(); window.scrollTo(0, 0); });
    window.scrollTo(0, 0);
  }

  const _desc = describe;
  describe = function (r) {
    if (r.type === 'exp' && r.id === 'lifewheel') {
      return { name: t('lwTitle'), result: `${r.value} / 10`, note: AREAS.map((a, i) => `${L(a[0], a[1])}: ${(r.v || [])[i]}`).join('; ') };
    }
    return _desc(r);
  };

  const st = document.createElement('style');
  st.textContent = `
  .lw-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:1.5rem;align-items:start}
  .lw-side{position:sticky;top:90px}.lw-svg{width:100%;max-width:380px;display:block;margin:0 auto}
  .lw-legend{display:flex;flex-wrap:wrap;gap:.3rem .8rem;justify-content:center;font-size:.8rem;color:var(--muted);margin-top:.5rem}
  .lw-legend i,.lw-h i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:middle}
  .lw-row{padding:.75rem 0;border-bottom:1px solid var(--border)}
  .lw-h{display:flex;align-items:center;gap:.2rem;margin-bottom:.4rem}.lw-h b{flex:1}
  .lw-v{font-family:var(--display);font-weight:700;color:var(--accent);min-width:2ch;text-align:right}
  .lw-sc{display:grid;grid-template-columns:repeat(10,1fr);gap:4px;margin-bottom:.4rem}
  .lw-sc button{padding:.45rem 0;border:1.5px solid var(--border);border-radius:8px;background:#fff;color:var(--text);font-weight:600;cursor:pointer}
  .lw-sc button:hover{border-color:var(--accent)}.lw-sc button.on{background:var(--accent);border-color:var(--accent);color:#fff}
  .lw-row input{width:100%;padding:.45rem .6rem;border:1.5px solid var(--border);border-radius:8px;font:inherit;font-size:.9rem;box-sizing:border-box}
  .conclusion li{margin-bottom:.6rem}
  .conclusion a{color:var(--accent)!important}.conclusion .meta{color:#5E5A80!important}
  @media (max-width:760px){.lw-grid{grid-template-columns:1fr}.lw-side{position:static;order:-1}}
  @media print{header,footer,.row-actions,nav{display:none!important}}`;
  document.head.appendChild(st);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    _route();
    const [pg, arg] = (location.hash || '#home').slice(1).split('/');
    if (pg === 'exp' && arg === 'lifewheel') { vals = null; why = null; viewForm(); window.scrollTo(0, 0); }
  };
  window.addEventListener('hashchange', route);
  route();
})();
