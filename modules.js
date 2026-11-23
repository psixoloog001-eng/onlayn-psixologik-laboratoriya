'use strict';
/* PsixoLab — qo'shimcha modullar / дополнительные модули
   app.js dan keyin yuklanadi: TESTS, EXPERIMENTS, T, route, describe ni kengaytiradi. */
(function () {

/* ================= Tarjimalar ================= */
Object.assign(T.uz, {
  levelLow: 'Past', levelMid: "O'rta", levelHigh: 'Yuqori',
  ipipNote: "Natijalar taxminiy: 4–9 past, 10–14 o'rta, 15–20 yuqori. Shaxs xususiyatlarining \"yaxshi\" yoki \"yomon\" darajasi yo'q.",
  gngTitle: 'Go/No-Go (impuls nazorati)',
  gngDesc: "Yashil doira chiqsa — tez bosing, qizil doira chiqsa — bosmang. 40 urinish. O'zini tiyish qobiliyatini o'lchaydi.",
  gngInstr: 'Yashil ● — BOSING (yoki Probel tugmasi). Qizil ● — BOSMANG.',
  gngPress: 'BOSISH', gngHits: "To'g'ri bosishlar (yashil)", gngMiss: "O'tkazib yuborilgan (yashil)",
  gngComm: "Noto'g'ri bosishlar (qizil)", gngErr: 'xato',
  gngExplain: "Qizil doiraga bosish — impulsiv xato. Bunday xatolar qanchalik kam bo'lsa, o'zini tiyish qobiliyati shunchalik yaxshi.",
  corsiTitle: 'Corsi bloklari (fazoviy xotira)',
  corsiDesc: "Bloklar ketma-ket yonadi. Ularni xuddi shu tartibda bosing. Ko'rish-fazoviy xotirani o'lchaydi.",
  corsiWatch: 'Diqqat bilan kuzating…', corsiTurn: 'Endi siz: bloklarni shu tartibda bosing',
  corsiWrong: "Noto'g'ri", corsiResult: 'Corsi xotira hajmi', blocks: 'ta blok',
  corsiExplain: "Ko'pchilik kattalarda Corsi xotira hajmi taxminan 5–7 blokni tashkil qiladi.",
  schTitle: 'Shulte jadvallari (diqqat)',
  schDesc: "5 ta jadvalda 1 dan 25 gacha raqamlarni tartib bilan imkon qadar tez toping. Diqqatning barqarorligi va ishchanlikni o'lchaydi.",
  schAge: 'Yoshingiz:', schInstr: "Raqamlarni 1 dan 25 gacha tartib bilan bosing. Iloji boricha tez va xatosiz bajaring.",
  schTable: 'Jadval', schReady: 'Tayyorman', schFind: 'Topish kerak:', schTime: 'Vaqt', schErrors: 'Xatolar', sec: 's',
  schIS: 'Ish samaradorligi (IS)', schID: 'Ishchanlik darajasi (ID)', schPB: 'Psixik barqarorlik (PB)', ball: 'ball',
  schISnote: "IS bahosi yoshga ko'ra: 5 ball — eng yaxshi, 1 ball — eng past.",
  schIDgood: "1,0 dan past — ishga tez kirishadi", schIDbad: "1,0 dan yuqori — ishga kirishish uchun tayyorgarlik vaqti kerak",
  schPBgood: "1,0 dan past — psixik barqarorlik yaxshi", schPBbad: "1,0 dan yuqori — vazifaga nisbatan barqarorlik kuchsizroq",
  schCurve: "Charchash egri chizig'i (har bir jadvalga ketgan vaqt, soniya)",
  schSource: "Ko'rsatkichlar A.Y. Kozireva bo'yicha hisoblanadi. Onlayn variantda raqamlar ovoz chiqarib aytilmaydi, balki bosiladi.",
  schAgeErr: "Iltimos, yoshingizni kiriting (6 dan katta)."
});
Object.assign(T.ru, {
  levelLow: 'Низкий', levelMid: 'Средний', levelHigh: 'Высокий',
  ipipNote: 'Результаты ориентировочные: 4–9 низкий, 10–14 средний, 15–20 высокий. У черт личности нет «хорошего» или «плохого» уровня.',
  gngTitle: 'Go/No-Go (контроль импульсов)',
  gngDesc: 'Зелёный круг — быстро нажмите, красный круг — не нажимайте. 40 попыток. Измеряет способность сдерживать импульсы.',
  gngInstr: 'Зелёный ● — НАЖИМАЙТЕ (или Пробел). Красный ● — НЕ НАЖИМАЙТЕ.',
  gngPress: 'НАЖАТЬ', gngHits: 'Верные нажатия (зелёный)', gngMiss: 'Пропуски (зелёный)',
  gngComm: 'Ошибочные нажатия (красный)', gngErr: 'ошибок',
  gngExplain: 'Нажатие на красный круг — импульсивная ошибка. Чем меньше таких ошибок, тем лучше способность к самоконтролю.',
  corsiTitle: 'Блоки Корси (пространственная память)',
  corsiDesc: 'Блоки загораются по очереди. Нажмите их в том же порядке. Измеряет зрительно-пространственную память.',
  corsiWatch: 'Внимательно следите…', corsiTurn: 'Теперь вы: нажмите блоки в том же порядке',
  corsiWrong: 'Неверно', corsiResult: 'Объём памяти Корси', blocks: 'блоков',
  corsiExplain: 'У большинства взрослых объём памяти Корси составляет примерно 5–7 блоков.',
  schTitle: 'Таблицы Шульте (внимание)',
  schDesc: 'В 5 таблицах найдите числа от 1 до 25 по порядку как можно быстрее. Измеряет устойчивость внимания и работоспособность.',
  schAge: 'Ваш возраст:', schInstr: 'Нажимайте числа от 1 до 25 по порядку. Старайтесь делать это быстро и без ошибок.',
  schTable: 'Таблица', schReady: 'Я готов', schFind: 'Найдите:', schTime: 'Время', schErrors: 'Ошибки', sec: 'с',
  schIS: 'Эффективность работы (ЭР)', schID: 'Степень врабатываемости (ВР)', schPB: 'Психическая устойчивость (ПУ)', ball: 'балл',
  schISnote: 'Оценка ЭР с учётом возраста: 5 баллов — лучший результат, 1 балл — самый низкий.',
  schIDgood: 'ниже 1,0 — быстро включается в работу', schIDbad: 'выше 1,0 — нужно время на подготовку к основной работе',
  schPBgood: 'ниже 1,0 — хорошая психическая устойчивость', schPBbad: 'выше 1,0 — устойчивость к нагрузке слабее',
  schCurve: 'Кривая истощаемости (время на каждую таблицу, секунды)',
  schSource: 'Показатели рассчитываются по А.Ю. Козыревой. В онлайн-варианте числа не называются вслух, а нажимаются.',
  schAgeErr: 'Пожалуйста, укажите возраст (от 6 лет).'
});

/* ================= Yangi testlar ================= */
TESTS.rosenberg = {
  name: { uz: "O'z-o'zini baholash (Rozenberg)", ru: 'Самооценка (Розенберг)' },
  desc: { uz: "O'zingizga bo'lgan umumiy munosabat va o'z-o'zini hurmat darajasini baholaydi.", ru: 'Оценивает общее отношение к себе и уровень самоуважения.' },
  instr: { uz: "Har bir fikrga qanchalik qo'shilishingizni belgilang.", ru: 'Отметьте, насколько вы согласны с каждым утверждением.' },
  minutes: 2,
  options: {
    uz: ["Mutlaqo qo'shilmayman", "Qo'shilmayman", "Qo'shilaman", "To'liq qo'shilaman"],
    ru: ['Совершенно не согласен', 'Не согласен', 'Согласен', 'Полностью согласен']
  },
  items: {
    uz: [
      "Umuman olganda, o'zimdan mamnunman",
      "Ba'zan o'zimni hech narsaga yaramaydigandek his qilaman",
      "Menda bir qancha yaxshi fazilatlar bor deb hisoblayman",
      "Ko'pchilik odamlar kabi ishlarni yaxshi bajara olaman",
      "Menda faxrlanadigan narsa ko'p emasdek tuyuladi",
      "Ba'zan o'zimni keraksizdek his qilaman",
      "O'zimni qadrli inson, hech bo'lmaganda boshqalar bilan teng deb his qilaman",
      "O'zimni ko'proq hurmat qilishni istardim",
      "Umuman olganda, o'zimni omadsiz deb hisoblashga moyilman",
      "O'zimga ijobiy munosabatdaman"
    ],
    ru: [
      'В целом я доволен собой',
      'Временами мне кажется, что я ни на что не гожусь',
      'Мне кажется, что у меня есть ряд хороших качеств',
      'Я способен делать что-то не хуже большинства людей',
      'Мне кажется, мне особенно нечем гордиться',
      'Временами я чувствую себя бесполезным',
      'Я чувствую, что я ценный человек, по крайней мере не хуже других',
      'Мне хотелось бы больше уважать себя',
      'В целом я склонен считать себя неудачником',
      'Я отношусь к себе положительно'
    ]
  },
  reverse: [1, 4, 5, 7, 8],
  max: 30,
  bands: [
    [14, { uz: "Past o'z-o'zini baholash", ru: 'Низкая самооценка' }],
    [25, { uz: "Me'yoriy o'z-o'zini baholash", ru: 'Нормальная самооценка' }],
    [30, { uz: "Yuqori o'z-o'zini baholash", ru: 'Высокая самооценка' }]
  ],
  source: 'Rosenberg (1965)'
};

const TRAITS = {
  E: { uz: 'Ekstraversiya', ru: 'Экстраверсия',
       huz: "Yuqori ball: muloqotga ochiq, faol, odamlar orasida quvvat oladi.", hru: 'Высокий балл: общительность, активность, энергия в общении.' },
  A: { uz: 'Hamjihatlik (do\'stonalik)', ru: 'Доброжелательность',
       huz: "Yuqori ball: mehribon, hamdard, hamkorlikka moyil.", hru: 'Высокий балл: доброта, сочувствие, готовность к сотрудничеству.' },
  C: { uz: "Mas'uliyatlilik", ru: 'Добросовестность',
       huz: "Yuqori ball: tartibli, intizomli, ishni oxiriga yetkazadi.", hru: 'Высокий балл: организованность, дисциплина, доведение дел до конца.' },
  N: { uz: 'Neyrotizm', ru: 'Нейротизм',
       huz: "Yuqori ball: kayfiyat tez o'zgaradi, xavotir va asabiylikka moyillik.", hru: 'Высокий балл: частые перепады настроения, склонность к тревоге.' },
  I: { uz: 'Intellekt / tasavvur', ru: 'Интеллект / воображение',
       huz: "Yuqori ball: yangi g'oyalarga ochiq, tasavvuri boy.", hru: 'Высокий балл: открытость новым идеям, богатое воображение.' }
};
TESTS.ipip = {
  name: { uz: 'Shaxs xususiyatlari (Big Five, Mini-IPIP)', ru: 'Черты личности (Большая пятёрка, Mini-IPIP)' },
  desc: { uz: "Shaxsning beshta asosiy xususiyatini o'lchaydi: ekstraversiya, hamjihatlik, mas'uliyatlilik, neyrotizm va intellekt.", ru: 'Измеряет пять основных черт личности: экстраверсию, доброжелательность, добросовестность, нейротизм и интеллект.' },
  instr: { uz: "Har bir fikr sizga qanchalik mos kelishini belgilang. O'zingizni hozir qanday bo'lsangiz, shunday baholang.", ru: 'Отметьте, насколько каждое утверждение описывает вас. Оценивайте себя таким, какой вы сейчас.' },
  minutes: 4,
  options: {
    uz: ['Mutlaqo mos kelmaydi', 'Mos kelmaydi', "O'rtacha", 'Mos keladi', "To'liq mos keladi"],
    ru: ['Совсем не про меня', 'Скорее не про меня', 'Нечто среднее', 'Скорее про меня', 'Точно про меня']
  },
  items: {
    uz: [
      "Davralarda kayfiyat ulashadigan, diqqat markazidagi odamman",
      "Boshqalarning his-tuyg'ulariga hamdardlik bildiraman",
      "Uy yumushlarini darhol bajaraman",
      "Kayfiyatim tez-tez o'zgarib turadi",
      "Tasavvurim boy",
      "Ko'p gapirmayman",
      "Boshqalarning muammolari meni qiziqtirmaydi",
      "Narsalarni joyiga qaytarib qo'yishni ko'pincha unutaman",
      "Ko'pincha xotirjam bo'laman",
      "Mavhum g'oyalar meni qiziqtirmaydi",
      "Yig'inlarda ko'plab turli odamlar bilan suhbatlashaman",
      "Boshqalarning his-tuyg'ularini sezaman",
      "Tartibni yaxshi ko'raman",
      "Tez xafa bo'laman",
      "Mavhum g'oyalarni tushunishga qiynalaman",
      "Ko'pincha chetda, ko'zga tashlanmay turaman",
      "Boshqa odamlar meni unchalik qiziqtirmaydi",
      "Ishlarni chalkashtirib yuboraman",
      "Kamdan-kam ma'yus bo'laman",
      "Tasavvurim unchalik yaxshi emas"
    ],
    ru: [
      'Я душа компании',
      'Я сочувствую чувствам других',
      'Я сразу выполняю домашние дела',
      'У меня часто меняется настроение',
      'У меня богатое воображение',
      'Я немногословен',
      'Меня не интересуют чужие проблемы',
      'Я часто забываю класть вещи на место',
      'Большую часть времени я спокоен',
      'Меня не интересуют абстрактные идеи',
      'На встречах я общаюсь с множеством разных людей',
      'Я чувствую эмоции других людей',
      'Я люблю порядок',
      'Я легко расстраиваюсь',
      'Мне трудно понимать абстрактные идеи',
      'Я держусь в тени',
      'Мне не очень интересны другие люди',
      'Я всё запутываю',
      'Мне редко бывает грустно',
      'У меня не очень хорошее воображение'
    ]
  },
  // [xususiyat, +1 to'g'ri / -1 teskari]
  key: [['E', 1], ['A', 1], ['C', 1], ['N', 1], ['I', 1], ['E', -1], ['A', -1], ['C', -1], ['N', -1], ['I', -1],
        ['E', 1], ['A', 1], ['C', 1], ['N', 1], ['I', -1], ['E', -1], ['A', -1], ['C', -1], ['N', -1], ['I', -1]],
  scales: ['E', 'A', 'C', 'N', 'I'],
  reverse: [], max: 20, bands: [],
  source: 'Donnellan et al. (2006), IPIP'
};

/* ================= Yangi tajribalar ================= */
EXPERIMENTS.push(
  { id: 'schulte', title: 'schTitle', desc: 'schDesc', minutes: 4 },
  { id: 'gonogo', title: 'gngTitle', desc: 'gngDesc', minutes: 2 },
  { id: 'corsi', title: 'corsiTitle', desc: 'corsiDesc', minutes: 3 }
);

const sleep = ms => new Promise(r => setTimeout(r, ms));
const backLink = () => `<a href="#experiments">← ${t('back')}</a>`;
const againRow = id => `<div class="row-actions"><button class="btn" id="again">${t('retake')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = (x, d) => Number(x).toFixed(d).replace('.', ',');

/* ---------- Mini-IPIP (profil) ---------- */
function levelOf(v) { return v <= 9 ? t('levelLow') : v <= 14 ? t('levelMid') : t('levelHigh'); }
function viewProfileTest(id) {
  const ts = TESTS[id];
  const items = ts.items[lang], opts = ts.options[lang];
  app.innerHTML = `
    <a href="#tests">← ${t('back')}</a>
    <h1>${esc(ts.name[lang])}</h1>
    <p><strong>${t('instructionPrefix')}</strong> ${esc(ts.instr[lang])}</p>
    <div class="progress"><div id="prog" style="width:0%"></div></div>
    <form id="tform">
      ${items.map((q, i) => `
        <div class="question"><p>${i + 1}. ${esc(q)}</p>
          <div class="options">${opts.map((o, v) => `<label><input type="radio" name="q${i}" value="${v + 1}">${esc(o)}</label>`).join('')}</div>
        </div>`).join('')}
      <p id="terr" class="notice danger" hidden>${esc(t('answerAll'))}</p>
      <button class="btn" type="submit">${t('submit')}</button>
    </form>
    <p class="meta">${esc(t('translationNote'))} ${esc(ts.source)}</p>`;
  const form = document.getElementById('tform');
  form.addEventListener('change', () => {
    const n = items.filter((_, i) => form.querySelector(`input[name=q${i}]:checked`)).length;
    document.getElementById('prog').style.width = (n / items.length * 100) + '%';
  });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const ans = items.map((_, i) => { const c = form.querySelector(`input[name=q${i}]:checked`); return c ? Number(c.value) : null; });
    if (ans.includes(null)) { document.getElementById('terr').hidden = false; return; }
    const profile = {};
    ts.scales.forEach(s => { profile[s] = 0; });
    ans.forEach((a, i) => { const [s, dir] = ts.key[i]; profile[s] += dir > 0 ? a : 6 - a; });
    saveResult({ type: 'test', id, profile });
    showProfile(id, profile);
  });
}
function showProfile(id, profile) {
  const ts = TESTS[id];
  app.innerHTML = `
    <h1>${esc(ts.name[lang])}</h1>
    <div class="profile">
      ${ts.scales.map(s => `
        <div class="trait">
          <div class="trait-head"><strong>${esc(TRAITS[s][lang])}</strong><span>${profile[s]} / 20 · ${esc(levelOf(profile[s]))}</span></div>
          <div class="bar"><div style="width:${(profile[s] - 4) / 16 * 100}%"></div></div>
          <div class="meta">${esc(TRAITS[s][lang === 'ru' ? 'hru' : 'huz'])}</div>
        </div>`).join('')}
    </div>
    <p class="meta">${esc(t('ipipNote'))}</p>
    <div class="row-actions"><button class="btn" id="again">${t('retake')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
  document.getElementById('again').onclick = () => viewProfileTest(id);
  window.scrollTo(0, 0);
}

/* ---------- Go/No-Go ---------- */
function viewGoNoGo() {
  const N = 40;
  const trials = shuffle(Array.from({ length: N }, (_, i) => ({ go: i < 30 })));
  app.innerHTML = `${backLink()}
    <h1>${esc(t('gngTitle'))}</h1><p>${esc(t('gngDesc'))}</p>
    <div class="stage" id="gng">
      <p><strong>${esc(t('gngInstr'))}</strong></p>
      <button class="btn" id="go">${t('start')}</button>
    </div>`;
  let current = null, shownAt = 0;
  const alive = () => !!document.getElementById('gng');
  const respond = () => {
    if (!current || current.responded) return;
    current.responded = true;
    current.rt = performance.now() - shownAt;
    const st = document.getElementById('stim');
    if (st) st.classList.add('pressed');
  };
  const onKey = e => {
    if (!alive()) { document.removeEventListener('keydown', onKey); return; }
    if (e.code === 'Space') { e.preventDefault(); respond(); }
  };
  document.getElementById('go').onclick = async () => {
    document.addEventListener('keydown', onKey);
    const stage = document.getElementById('gng');
    stage.innerHTML = `<div class="meta" id="cnt"></div><div class="gng-stim" id="stim">+</div>
      <button class="btn gng-btn" id="press">${t('gngPress')}</button>`;
    document.getElementById('press').addEventListener('pointerdown', e => { e.preventDefault(); respond(); });
    for (let i = 0; i < N; i++) {
      if (!alive()) return;
      const st = document.getElementById('stim');
      document.getElementById('cnt').textContent = `${i + 1} / ${N}`;
      st.className = 'gng-stim'; st.textContent = '+';
      await sleep(500 + Math.random() * 500);
      if (!alive()) return;
      current = trials[i]; current.responded = false;
      st.textContent = '●'; st.className = 'gng-stim ' + (current.go ? 'go' : 'nogo');
      shownAt = performance.now();
      await sleep(800);
      current = null;
    }
    document.removeEventListener('keydown', onKey);
    const hits = trials.filter(x => x.go && x.responded);
    const miss = trials.filter(x => x.go && !x.responded).length;
    const comm = trials.filter(x => !x.go && x.responded).length;
    const rt = hits.length ? Math.round(hits.reduce((a, b) => a + b.rt, 0) / hits.length) : 0;
    saveResult({ type: 'exp', id: 'gonogo', value: comm, rt, miss, hits: hits.length });
    stage.innerHTML = `
      <div>${t('gngComm')}</div>
      <div class="score">${comm}</div>
      <table>
        <tr><th>${t('gngHits')}</th><td>${hits.length} / 30</td></tr>
        <tr><th>${t('gngMiss')}</th><td>${miss}</td></tr>
        <tr><th>${t('gngComm')}</th><td>${comm} / 10</td></tr>
        <tr><th>${t('meanRT')}</th><td>${rt} ${t('ms')}</td></tr>
      </table>
      <p class="meta">${esc(t('gngExplain'))}</p>${againRow()}`;
    document.getElementById('again').onclick = viewGoNoGo;
  };
}

/* ---------- Corsi bloklari ---------- */
const CORSI_POS = [[8, 66], [30, 12], [44, 50], [68, 8], [78, 42], [58, 76], [16, 34], [82, 78], [34, 82]];
function viewCorsi() {
  let len = 2, best = 0, tries = 0, okAtLen = false;
  app.innerHTML = `${backLink()}
    <h1>${esc(t('corsiTitle'))}</h1><p>${esc(t('corsiDesc'))}</p>
    <div class="stage" id="corsi"><button class="btn" id="go">${t('start')}</button></div>`;
  const alive = () => !!document.getElementById('corsi');
  document.getElementById('go').onclick = round;
  async function round() {
    if (!alive()) return;
    const stage = document.getElementById('corsi');
    stage.innerHTML = `<div id="cmsg" class="meta">${esc(t('corsiWatch'))} (${len} ${t('blocks')})</div>
      <div class="corsi-board">${CORSI_POS.map((p, i) => `<button class="corsi-block" data-i="${i}" style="left:${p[0]}%;top:${p[1]}%" disabled></button>`).join('')}</div>`;
    const blocks = [...stage.querySelectorAll('.corsi-block')];
    const seq = shuffle([...Array(9).keys()]).slice(0, len);
    await sleep(700);
    for (const i of seq) {
      if (!alive()) return;
      blocks[i].classList.add('lit'); await sleep(700);
      blocks[i].classList.remove('lit'); await sleep(300);
    }
    if (!alive()) return;
    document.getElementById('cmsg').textContent = t('corsiTurn');
    const input = [];
    blocks.forEach(b => {
      b.disabled = false;
      b.onclick = async () => {
        const i = Number(b.dataset.i);
        input.push(i);
        b.classList.add('lit'); setTimeout(() => b.classList.remove('lit'), 200);
        const pos = input.length - 1;
        const wrong = input[pos] !== seq[pos];
        if (wrong || input.length === seq.length) {
          blocks.forEach(x => { x.disabled = true; });
          tries++;
          const msg = document.getElementById('cmsg');
          if (!wrong) { okAtLen = true; best = len; msg.textContent = t('spanCorrect'); }
          else msg.textContent = t('corsiWrong');
          await sleep(1000);
          if (tries >= 2 || okAtLen) {
            if (!okAtLen || len >= 9) return finish();
            len++; tries = 0; okAtLen = false;
          }
          round();
        }
      };
    });
  }
  function finish() {
    if (!alive()) return;
    saveResult({ type: 'exp', id: 'corsi', value: best });
    document.getElementById('corsi').innerHTML = `
      <div>${t('corsiResult')}</div>
      <div class="score">${best} ${t('blocks')}</div>
      <p class="meta">${esc(t('corsiExplain'))}</p>${againRow()}`;
    document.getElementById('again').onclick = viewCorsi;
  }
}

/* ---------- Shulte jadvallari ---------- */
// IS bo'yicha ball chegaralari (soniya): [5 ball, 4 ball, 3 ball, 2 ball] uchun yuqori chegara
const SCH_NORMS = { 6: [60, 70, 80, 90], 7: [55, 65, 75, 85], 8: [50, 60, 70, 80], 9: [46, 55, 65, 75], 10: [40, 50, 60, 70], 11: [35, 45, 55, 65], 12: [30, 35, 45, 55] };
function isBall(is, age) {
  const b = SCH_NORMS[Math.min(12, Math.max(6, Math.floor(age)))];
  return is <= b[0] ? 5 : is <= b[1] ? 4 : is <= b[2] ? 3 : is <= b[3] ? 2 : 1;
}
function curveSvg(times) {
  const W = 420, H = 190, P = 34;
  const max = Math.max(...times) * 1.15, min = 0;
  const x = i => P + i * (W - 2 * P) / (times.length - 1);
  const y = v => H - P - (v - min) / (max - min) * (H - 2 * P);
  const pts = times.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" class="curve" role="img" aria-label="${esc(t('schCurve'))}">
    <line x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" stroke="#c9cfdb"/>
    <polyline points="${pts}" fill="none" stroke="#3b5bdb" stroke-width="3" stroke-linejoin="round"/>
    ${times.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="5" fill="#3b5bdb"/>
      <text x="${x(i)}" y="${y(v) - 10}" text-anchor="middle" font-size="12" fill="#1d2433">${fmt(v, 1)}</text>
      <text x="${x(i)}" y="${H - P + 18}" text-anchor="middle" font-size="12" fill="#5b6478">${i + 1}</text>`).join('')}
  </svg>`;
}
function viewSchulte() {
  const times = [], errors = [];
  let age = 0;
  app.innerHTML = `${backLink()}
    <h1>${esc(t('schTitle'))}</h1><p>${esc(t('schDesc'))}</p>
    <div class="stage" id="sch">
      <p>${esc(t('schInstr'))}</p>
      <label>${t('schAge')} <input type="number" id="age" min="6" max="99" style="width:90px"></label>
      <p id="ageErr" class="notice danger" hidden>${esc(t('schAgeErr'))}</p>
      <button class="btn" id="go">${t('start')}</button>
    </div>`;
  const alive = () => !!document.getElementById('sch');
  document.getElementById('go').onclick = () => {
    age = Number(document.getElementById('age').value);
    if (!age || age < 6) { document.getElementById('ageErr').hidden = false; return; }
    intro(0);
  };
  function intro(k) {
    if (!alive()) return;
    document.getElementById('sch').innerHTML = `
      <h2 style="margin:0">${t('schTable')} ${k + 1} / 5</h2>
      <button class="btn" id="ready">${t('schReady')}</button>`;
    document.getElementById('ready').onclick = () => table(k);
  }
  function table(k) {
    const nums = shuffle(Array.from({ length: 25 }, (_, i) => i + 1));
    let next = 1, errs = 0;
    const stage = document.getElementById('sch');
    stage.innerHTML = `
      <div class="sch-head"><span>${t('schTable')} ${k + 1} / 5</span><span>${t('schFind')} <strong id="nx">1</strong></span><span>${t('schErrors')}: <strong id="er">0</strong></span></div>
      <div class="sch-grid">${nums.map(n => `<button class="sch-cell" data-n="${n}">${n}</button>`).join('')}</div>`;
    const start = performance.now();
    stage.querySelectorAll('.sch-cell').forEach(c => c.addEventListener('click', () => {
      const n = Number(c.dataset.n);
      if (n === next) {
        c.classList.add('found');
        next++;
        if (next > 25) {
          times.push((performance.now() - start) / 1000);
          errors.push(errs);
          return k < 4 ? intro(k + 1) : finish();
        }
        document.getElementById('nx').textContent = next;
      } else if (n > next) {
        errs++;
        document.getElementById('er').textContent = errs;
        c.classList.add('wrong'); setTimeout(() => c.classList.remove('wrong'), 300);
      }
    }));
  }
  function finish() {
    const IS = times.reduce((a, b) => a + b, 0) / 5;
    const ID = times[0] / IS, PB = times[3] / IS;
    const ball = isBall(IS, age);
    const totalErr = errors.reduce((a, b) => a + b, 0);
    saveResult({ type: 'exp', id: 'schulte', value: Math.round(IS * 10) / 10, id1: Math.round(ID * 100) / 100, pb: Math.round(PB * 100) / 100, ball, age, times: times.map(x => Math.round(x * 10) / 10), errors: totalErr });
    document.getElementById('sch').innerHTML = `
      <div>${t('schIS')}</div>
      <div class="score">${fmt(IS, 1)} ${t('sec')} <span class="meta">· ${ball} ${t('ball')}</span></div>
      <p class="meta">${esc(t('schISnote'))}</p>
      <table>
        <tr><th>${t('schID')}</th><td>${fmt(ID, 2)} — ${esc(ID < 1 ? t('schIDgood') : t('schIDbad'))}</td></tr>
        <tr><th>${t('schPB')}</th><td>${fmt(PB, 2)} — ${esc(PB < 1 ? t('schPBgood') : t('schPBbad'))}</td></tr>
      </table>
      <table>
        <tr><th>${t('schTable')}</th>${times.map((_, i) => `<th>${i + 1}</th>`).join('')}</tr>
        <tr><td>${t('schTime')}, ${t('sec')}</td>${times.map(v => `<td>${fmt(v, 1)}</td>`).join('')}</tr>
        <tr><td>${t('schErrors')}</td>${errors.map(v => `<td>${v}</td>`).join('')}</tr>
      </table>
      <div style="width:100%"><div class="meta">${esc(t('schCurve'))}</div>${curveSvg(times)}</div>
      <p class="meta">${esc(t('schSource'))} ${t('schErrors')}: ${totalErr}.</p>${againRow()}`;
    document.getElementById('again').onclick = viewSchulte;
  }
}

/* ================= Natijalar va marshrut ================= */
const _oldDescribe = describe;
describe = function (r) {
  if (r.type === 'test' && r.id === 'ipip' && r.profile) {
    return { name: TESTS.ipip.name[lang], result: Object.entries(r.profile).map(([k, v]) => `${k} ${v}`).join(' · '),
      note: Object.entries(r.profile).map(([k, v]) => `${TRAITS[k][lang]}: ${levelOf(v)}`).join('; ') };
  }
  if (r.type === 'exp' && r.id === 'gonogo') return { name: t('gngTitle'), result: `${r.value} ${t('gngErr')}`, note: `${t('meanRT')} ${r.rt} ${t('ms')}; ${t('gngMiss')}: ${r.miss}` };
  if (r.type === 'exp' && r.id === 'corsi') return { name: t('corsiTitle'), result: `${r.value} ${t('blocks')}`, note: t('corsiResult') };
  if (r.type === 'exp' && r.id === 'schulte') return { name: t('schTitle'), result: `IS ${fmt(r.value, 1)} ${t('sec')} (${r.ball} ${t('ball')})`, note: `ID ${fmt(r.id1, 2)}; PB ${fmt(r.pb, 2)}; ${t('schErrors')}: ${r.errors}` };
  return _oldDescribe(r);
};

const _oldRoute = route;
window.removeEventListener('hashchange', _oldRoute);
route = function () {
  _oldRoute();
  const [page, arg] = (location.hash || '#home').slice(1).split('/');
  if (page === 'test' && TESTS[arg] && TESTS[arg].scales) viewProfileTest(arg);
  else if (page === 'exp' && arg === 'schulte') viewSchulte();
  else if (page === 'exp' && arg === 'gonogo') viewGoNoGo();
  else if (page === 'exp' && arg === 'corsi') viewCorsi();
  else return;
  window.scrollTo(0, 0);
};
window.addEventListener('hashchange', route);
route();

})();
