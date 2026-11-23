'use strict';

/* ================= Tarjimalar / Переводы ================= */
const T = {
  uz: {
    brand: '🧠 PsixoLab',
    navHome: 'Bosh sahifa', navTests: 'Testlar', navExp: 'Tajribalar', navResults: 'Natijalarim',
    footer: "Natijalar sizning brauzeringizda saqlanadi; profilga kirgan bo'lsangiz — himoyalangan bulutda ham. Bu sayt tibbiy tashxis qo'ymaydi.",
    heroTitle: 'Onlayn psixologik laboratoriya',
    heroText: "Ilmiy asoslangan so'rovnomalar va kognitiv tajribalar yordamida o'zingizni sinab ko'ring. Bepul, ro'yxatdan o'tish shart emas.",
    important: 'Muhim',
    disclaimer: "Testlar faqat dastlabki baholash (skrining) vositasi bo'lib, tashxis o'rnini bosmaydi. Natijalar sizni tashvishga solsa, psixolog yoki shifokorga murojaat qiling.",
    testsTitle: 'Psixologik testlar', expTitle: 'Kognitiv tajribalar',
    start: 'Boshlash', questions: 'ta savol', minutes: 'daqiqa',
    instructionPrefix: "Ko'rsatma:",
    submit: 'Natijani ko\'rish', answerAll: 'Iltimos, barcha savollarga javob bering.',
    yourScore: 'Sizning ballingiz', outOf: 'dan',
    retake: 'Qayta topshirish', back: 'Orqaga', toResults: 'Barcha natijalarim',
    translationNote: "Eslatma: bu savollarning tarjimasi norasmiy. Rasmiy tadqiqot uchun tasdiqlangan versiyadan foydalaning.",
    crisis: "Siz o'zingizga zarar yetkazish yoki o'lim haqidagi fikrlarni belgiladingiz. Bu jiddiy holat va siz yolg'iz emassiz. Iltimos, bugunoq ishongan yaqin odamingiz, psixolog yoki shifokor bilan gaplashing. Xavf yaqin bo'lsa, darhol 103 (tez yordam) raqamiga qo'ng'iroq qiling.",
    seeSpecialist: "Natijangiz mutaxassis bilan maslahatlashish foydali bo'lishini ko'rsatmoqda.",
    // Tajribalar
    rtTitle: 'Reaksiya vaqti', rtDesc: "Ekran yashil rangga o'zgarganda imkon qadar tez bosing. 5 urinish.",
    rtIdle: 'Boshlash uchun bosing', rtWait: 'Kuting… yashil bo\'lishini', rtGo: 'BOSING!',
    rtEarly: 'Juda erta! Bu urinish qayta o\'tkaziladi.', rtTrial: 'Urinish', rtAvg: "O'rtacha reaksiya vaqti",
    rtNext: 'Davom etish uchun bosing',
    stroopTitle: 'Stroop tajribasi', stroopDesc: "So'z qaysi rangda yozilganini tanlang (so'zning ma'nosiga emas, rangiga qarang). 24 ta urinish.",
    stroopInstr: "So'zning RANGINI tanlang, ma'nosini emas.",
    stroopCong: 'Mos (so\'z = rang)', stroopIncong: 'Nomos (so\'z ≠ rang)',
    stroopEffect: 'Stroop effekti', accuracy: 'Aniqlik', meanRT: "O'rtacha vaqt",
    stroopExplain: "Stroop effekti — nomos urinishlarda qancha ko'proq vaqt ketganini ko'rsatadi. Odatda u 50–150 ms atrofida bo'ladi va diqqatni boshqarish qobiliyatini aks ettiradi.",
    spanTitle: 'Raqamlar xotirasi', spanDesc: "Ekranda raqamlar ketma-ket ko'rsatiladi. Ularni xuddi shu tartibda yozing. Qisqa muddatli xotirani o'lchaydi.",
    spanWatch: 'Diqqat bilan qarang…', spanType: 'Raqamlarni tartib bilan yozing:', spanCheck: 'Tekshirish',
    spanCorrect: "To'g'ri! Keyingi daraja.", spanWrong: "Noto'g'ri. To'g'ri javob:",
    spanResult: 'Raqamlar xotirasi hajmi', spanExplain: "Ko'pchilik kattalar 5–9 ta raqamni eslab qoladi (o'rtacha taxminan 7).",
    ms: 'ms', digits: 'ta raqam',
    // Natijalar
    resultsTitle: 'Natijalarim', noResults: "Hali natijalar yo'q. Test yoki tajribani boshlang!",
    date: 'Sana', test: 'Test / tajriba', result: 'Natija', interpretation: 'Izoh',
    exportCsv: 'CSV yuklab olish', clearAll: "Hammasini o'chirish", confirmClear: "Barcha natijalar o'chirilsinmi?",
    storageOff: "Brauzeringiz ma'lumot saqlashga ruxsat bermayapti, natijalar faqat shu sahifada ko'rinadi."
  },
  ru: {
    brand: '🧠 PsixoLab',
    navHome: 'Главная', navTests: 'Тесты', navExp: 'Эксперименты', navResults: 'Мои результаты',
    footer: 'Результаты хранятся в вашем браузере, а если вы вошли в профиль — и в защищённом облаке. Сайт не ставит медицинских диагнозов.',
    heroTitle: 'Онлайн психологическая лаборатория',
    heroText: 'Проверьте себя с помощью научно обоснованных опросников и когнитивных экспериментов. Бесплатно и без регистрации.',
    important: 'Важно',
    disclaimer: 'Тесты — это инструмент первичной оценки (скрининга) и не заменяют диагноз. Если результаты вас беспокоят, обратитесь к психологу или врачу.',
    testsTitle: 'Психологические тесты', expTitle: 'Когнитивные эксперименты',
    start: 'Начать', questions: 'вопросов', minutes: 'мин',
    instructionPrefix: 'Инструкция:',
    submit: 'Показать результат', answerAll: 'Пожалуйста, ответьте на все вопросы.',
    yourScore: 'Ваш балл', outOf: 'из',
    retake: 'Пройти снова', back: 'Назад', toResults: 'Все мои результаты',
    translationNote: 'Примечание: перевод вопросов неофициальный. Для научных исследований используйте валидированную версию.',
    crisis: 'Вы отметили мысли о смерти или о том, чтобы причинить себе вред. Это серьёзно, и вы не одиноки. Пожалуйста, сегодня же поговорите с близким человеком, психологом или врачом. Если опасность близка, сразу звоните 103 (скорая помощь).',
    seeSpecialist: 'Ваш результат говорит о том, что консультация специалиста может быть полезной.',
    rtTitle: 'Время реакции', rtDesc: 'Нажмите как можно быстрее, когда экран станет зелёным. 5 попыток.',
    rtIdle: 'Нажмите, чтобы начать', rtWait: 'Ждите… пока не станет зелёным', rtGo: 'ЖМИТЕ!',
    rtEarly: 'Слишком рано! Попытка будет повторена.', rtTrial: 'Попытка', rtAvg: 'Среднее время реакции',
    rtNext: 'Нажмите, чтобы продолжить',
    stroopTitle: 'Тест Струпа', stroopDesc: 'Выберите цвет, которым написано слово (смотрите на цвет, а не на смысл). 24 попытки.',
    stroopInstr: 'Выберите ЦВЕТ слова, а не его значение.',
    stroopCong: 'Совпадает (слово = цвет)', stroopIncong: 'Не совпадает (слово ≠ цвет)',
    stroopEffect: 'Эффект Струпа', accuracy: 'Точность', meanRT: 'Среднее время',
    stroopExplain: 'Эффект Струпа показывает, насколько дольше вы отвечаете в несовпадающих попытках. Обычно он около 50–150 мс и отражает способность управлять вниманием.',
    spanTitle: 'Память на цифры', spanDesc: 'На экране по очереди появляются цифры. Введите их в том же порядке. Измеряет кратковременную память.',
    spanWatch: 'Смотрите внимательно…', spanType: 'Введите цифры по порядку:', spanCheck: 'Проверить',
    spanCorrect: 'Верно! Следующий уровень.', spanWrong: 'Неверно. Правильный ответ:',
    spanResult: 'Объём памяти на цифры', spanExplain: 'Большинство взрослых запоминают 5–9 цифр (в среднем около 7).',
    ms: 'мс', digits: 'цифр',
    resultsTitle: 'Мои результаты', noResults: 'Пока нет результатов. Начните тест или эксперимент!',
    date: 'Дата', test: 'Тест / эксперимент', result: 'Результат', interpretation: 'Пояснение',
    exportCsv: 'Скачать CSV', clearAll: 'Удалить всё', confirmClear: 'Удалить все результаты?',
    storageOff: 'Браузер не разрешает сохранять данные, результаты видны только на этой странице.'
  }
};

/* ================= Testlar / Тесты ================= */
const FREQ4 = {
  uz: ["Umuman yo'q", 'Bir necha kun', 'Kunlarning yarmidan ko\'pi', 'Deyarli har kuni'],
  ru: ['Ни разу', 'Несколько дней', 'Более половины дней', 'Почти каждый день']
};
const FREQ5 = {
  uz: ['Hech qachon', 'Deyarli hech qachon', 'Ba\'zan', 'Ancha tez-tez', 'Juda tez-tez'],
  ru: ['Никогда', 'Почти никогда', 'Иногда', 'Довольно часто', 'Очень часто']
};

const TESTS = {
  phq9: {
    name: { uz: 'Depressiya skriningi (PHQ-9)', ru: 'Скрининг депрессии (PHQ-9)' },
    desc: { uz: "Oxirgi 2 haftadagi kayfiyat va depressiya belgilarini baholaydi.", ru: 'Оценивает настроение и признаки депрессии за последние 2 недели.' },
    instr: { uz: "Oxirgi 2 hafta davomida quyidagi muammolar sizni qanchalik tez-tez bezovta qildi?", ru: 'Как часто за последние 2 недели вас беспокоили следующие проблемы?' },
    minutes: 3,
    options: FREQ4,
    items: {
      uz: [
        "Biror ish qilishga qiziqish yoki undan zavq olishning kamligi",
        "Kayfiyatning tushkunligi, ruhiy siqilish yoki umidsizlik",
        "Uxlab qolish yoki uyquni saqlashda qiyinchilik, yoki haddan ortiq ko'p uxlash",
        "Charchoq yoki kuch-quvvatning kamligi",
        "Ishtahaning pasayishi yoki haddan ortiq ko'p ovqatlanish",
        "O'zingiz haqingizda yomon fikrda bo'lish — o'zingizni muvaffaqiyatsiz deb hisoblash yoki o'zingizni/oilangizni umidsizlantirgandek his qilish",
        "Diqqatni jamlashda qiyinchilik (masalan, kitob o'qish yoki televizor ko'rishda)",
        "Boshqalar sezadigan darajada sekin harakat qilish yoki gapirish; yoki aksincha, odatdagidan ko'proq bezovtalanib, tinch o'tira olmaslik",
        "O'lib qolsam yaxshiroq bo'lardi yoki o'zimga biror zarar yetkazsam degan fikrlar"
      ],
      ru: [
        'Мало интереса или удовольствия от занятий',
        'Подавленность, депрессия или чувство безнадёжности',
        'Трудности с засыпанием, прерывистый сон или слишком долгий сон',
        'Усталость или упадок сил',
        'Плохой аппетит или переедание',
        'Плохое мнение о себе — чувство, что вы неудачник или подвели себя/семью',
        'Трудности с концентрацией внимания (например, при чтении или просмотре телевизора)',
        'Движения или речь настолько медленные, что это заметно окружающим; или наоборот — беспокойство и непоседливость больше обычного',
        'Мысли о том, что лучше было бы умереть, или о том, чтобы причинить себе вред'
      ]
    },
    reverse: [],
    max: 27,
    crisisItem: 8,
    bands: [
      [4, { uz: 'Minimal belgilar', ru: 'Минимальные симптомы' }],
      [9, { uz: 'Yengil darajadagi belgilar', ru: 'Лёгкая степень' }],
      [14, { uz: "O'rtacha darajadagi belgilar", ru: 'Умеренная степень' }, true],
      [19, { uz: "O'rtachadan og'irroq belgilar", ru: 'Умеренно тяжёлая степень' }, true],
      [27, { uz: "Og'ir darajadagi belgilar", ru: 'Тяжёлая степень' }, true]
    ],
    source: 'Kroenke, Spitzer & Williams (2001)'
  },
  gad7: {
    name: { uz: 'Xavotir skriningi (GAD-7)', ru: 'Скрининг тревоги (GAD-7)' },
    desc: { uz: "Oxirgi 2 haftadagi xavotir va bezovtalik darajasini baholaydi.", ru: 'Оценивает уровень тревоги и беспокойства за последние 2 недели.' },
    instr: { uz: "Oxirgi 2 hafta davomida quyidagi muammolar sizni qanchalik tez-tez bezovta qildi?", ru: 'Как часто за последние 2 недели вас беспокоили следующие проблемы?' },
    minutes: 2,
    options: FREQ4,
    items: {
      uz: [
        "Asabiylik, xavotir yoki o'zini juda tarang his qilish",
        "Xavotirlanishni to'xtata olmaslik yoki uni nazorat qila olmaslik",
        "Turli narsalar haqida haddan ortiq xavotirlanish",
        "Bo'shashish (dam olish) qiyinligi",
        "Shunchalik bezovtalanishki, bir joyda o'tirish qiyin bo'lishi",
        "Tez jahl chiqishi yoki asabiylashish",
        "Go'yo nimadir yomon voqea sodir bo'ladigandek qo'rquv"
      ],
      ru: [
        'Нервозность, тревога или сильное напряжение',
        'Неспособность остановить или контролировать беспокойство',
        'Чрезмерное беспокойство по разным поводам',
        'Трудности с расслаблением',
        'Такое беспокойство, что трудно усидеть на месте',
        'Лёгкая раздражительность',
        'Страх, будто может случиться что-то ужасное'
      ]
    },
    reverse: [],
    max: 21,
    bands: [
      [4, { uz: 'Minimal xavotir', ru: 'Минимальная тревога' }],
      [9, { uz: 'Yengil xavotir', ru: 'Лёгкая тревога' }],
      [14, { uz: "O'rtacha xavotir", ru: 'Умеренная тревога' }, true],
      [21, { uz: "Kuchli xavotir", ru: 'Выраженная тревога' }, true]
    ],
    source: 'Spitzer et al. (2006)'
  },
  pss10: {
    name: { uz: 'Stress darajasi (PSS-10)', ru: 'Уровень стресса (PSS-10)' },
    desc: { uz: "Oxirgi bir oyda hayotingizni qanchalik stressli deb his qilganingizni o'lchaydi.", ru: 'Измеряет, насколько стрессовой вы ощущали свою жизнь за последний месяц.' },
    instr: { uz: "Oxirgi bir oy davomida quyidagi holatlar qanchalik tez-tez bo'ldi?", ru: 'Как часто за последний месяц с вами происходило следующее?' },
    minutes: 3,
    options: FREQ5,
    items: {
      uz: [
        "Kutilmagan voqea tufayli xafa bo'ldingiz",
        "Hayotingizdagi muhim narsalarni nazorat qila olmayotgandek his qildingiz",
        "O'zingizni asabiy va stress holatida his qildingiz",
        "Shaxsiy muammolaringizni hal qila olishingizga ishondingiz",
        "Ishlar siz xohlagandek ketayotganini his qildingiz",
        "Qilishingiz kerak bo'lgan barcha ishlarga ulgura olmasligingizni sezdingiz",
        "Hayotingizdagi asabiylashtiruvchi narsalarni nazorat qila oldingiz",
        "Vaziyatni to'liq boshqarayotgandek his qildingiz",
        "Nazoratingizdan tashqaridagi narsalar tufayli jahlingiz chiqdi",
        "Qiyinchiliklar shunchalik ko'payib ketdiki, ularni yengib o'ta olmaydigandek his qildingiz"
      ],
      ru: [
        'Вы расстраивались из-за чего-то неожиданного',
        'Вы чувствовали, что не можете контролировать важные вещи в своей жизни',
        'Вы чувствовали нервозность и стресс',
        'Вы были уверены, что справитесь со своими личными проблемами',
        'Вы чувствовали, что всё идёт так, как вы хотите',
        'Вы понимали, что не успеваете со всеми делами, которые нужно сделать',
        'Вы могли контролировать то, что вас раздражает',
        'Вы чувствовали, что держите ситуацию под контролем',
        'Вы злились из-за того, что было вне вашего контроля',
        'Вы чувствовали, что трудностей накопилось столько, что их не преодолеть'
      ]
    },
    reverse: [3, 4, 6, 7],
    max: 40,
    bands: [
      [13, { uz: 'Past stress', ru: 'Низкий стресс' }],
      [26, { uz: "O'rtacha stress", ru: 'Умеренный стресс' }],
      [40, { uz: 'Yuqori stress', ru: 'Высокий стресс' }, true]
    ],
    source: 'Cohen, Kamarck & Mermelstein (1983)'
  }
};

/* ================= Holat / Состояние ================= */
let lang = 'uz';
let memoryStore = [];
let storageOk = true;
const app = document.getElementById('app');
const t = k => (T[lang][k] !== undefined ? T[lang][k] : k);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

try { const l = localStorage.getItem('psixolab-lang'); if (l === 'uz' || l === 'ru') lang = l; } catch (e) { storageOk = false; }

function loadResults() {
  try { return JSON.parse(localStorage.getItem('psixolab-results') || '[]'); }
  catch (e) { storageOk = false; return memoryStore; }
}
function saveResult(r) {
  r.date = new Date().toISOString();
  const all = loadResults();
  all.push(r);
  try { localStorage.setItem('psixolab-results', JSON.stringify(all)); }
  catch (e) { storageOk = false; memoryStore = all; }
}
function clearResults() {
  memoryStore = [];
  try { localStorage.removeItem('psixolab-results'); } catch (e) { /* ignore */ }
}

/* ================= Umumiy / Общее ================= */
function applyStatic() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.title = 'PsixoLab — ' + t('heroTitle');
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  try { localStorage.setItem('psixolab-lang', lang); } catch (e) { /* ignore */ }
  route();
}));

const EXPERIMENTS = [
  { id: 'rt', title: 'rtTitle', desc: 'rtDesc', minutes: 1 },
  { id: 'stroop', title: 'stroopTitle', desc: 'stroopDesc', minutes: 2 },
  { id: 'span', title: 'spanTitle', desc: 'spanDesc', minutes: 3 }
];

function testCards() {
  return Object.entries(TESTS).map(([id, ts]) => `
    <div class="card">
      <h3>${esc(ts.name[lang])}</h3>
      <p>${esc(ts.desc[lang])}</p>
      <div class="meta">${ts.items[lang].length} ${t('questions')} · ~${ts.minutes} ${t('minutes')}</div>
      <a class="btn" href="#test/${id}">${t('start')}</a>
    </div>`).join('');
}
function expCards() {
  return EXPERIMENTS.map(e => `
    <div class="card">
      <h3>${esc(t(e.title))}</h3>
      <p>${esc(t(e.desc))}</p>
      <div class="meta">~${e.minutes} ${t('minutes')}</div>
      <a class="btn" href="#exp/${e.id}">${t('start')}</a>
    </div>`).join('');
}
const disclaimerHtml = () => `<div class="notice warn"><strong>${t('important')}:</strong> ${esc(t('disclaimer'))}</div>`;

/* ================= Sahifalar / Страницы ================= */
function viewHome() {
  app.innerHTML = `
    <h1>${esc(t('heroTitle'))}</h1>
    <p class="lead">${esc(t('heroText'))}</p>
    ${disclaimerHtml()}
    <h2>${esc(t('testsTitle'))}</h2><div class="grid">${testCards()}</div>
    <h2>${esc(t('expTitle'))}</h2><div class="grid">${expCards()}</div>`;
}
function viewTests() {
  app.innerHTML = `<h1>${esc(t('testsTitle'))}</h1>${disclaimerHtml()}<div class="grid">${testCards()}</div>`;
}
function viewExperiments() {
  app.innerHTML = `<h1>${esc(t('expTitle'))}</h1><div class="grid">${expCards()}</div>`;
}

function viewTest(id) {
  const ts = TESTS[id];
  if (!ts) return viewHome();
  const items = ts.items[lang];
  const opts = ts.options[lang];
  app.innerHTML = `
    <a href="#tests">← ${t('back')}</a>
    <h1>${esc(ts.name[lang])}</h1>
    <p><strong>${t('instructionPrefix')}</strong> ${esc(ts.instr[lang])}</p>
    <div class="progress"><div id="prog" style="width:0%"></div></div>
    <form id="tform">
      ${items.map((q, i) => `
        <div class="question">
          <p>${i + 1}. ${esc(q)}</p>
          <div class="options">
            ${opts.map((o, v) => `<label><input type="radio" name="q${i}" value="${v}">${esc(o)}</label>`).join('')}
          </div>
        </div>`).join('')}
      <p id="terr" class="notice danger" hidden>${esc(t('answerAll'))}</p>
      <button class="btn" type="submit">${t('submit')}</button>
    </form>
    <p class="meta">${esc(t('translationNote'))} ${esc(ts.source)}</p>`;
  const form = document.getElementById('tform');
  form.addEventListener('change', () => {
    const answered = items.filter((_, i) => form.querySelector(`input[name=q${i}]:checked`)).length;
    document.getElementById('prog').style.width = (answered / items.length * 100) + '%';
  });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const answers = items.map((_, i) => {
      const c = form.querySelector(`input[name=q${i}]:checked`);
      return c ? Number(c.value) : null;
    });
    if (answers.includes(null)) { document.getElementById('terr').hidden = false; return; }
    const maxOpt = opts.length - 1;
    const score = answers.reduce((s, a, i) => s + (ts.reverse.includes(i) ? maxOpt - a : a), 0);
    const band = ts.bands.find(b => score <= b[0]);
    const crisis = ts.crisisItem !== undefined && answers[ts.crisisItem] > 0;
    saveResult({ type: 'test', id, score, max: ts.max, band: ts.bands.indexOf(band), crisis });
    showTestResult(id, score, band, crisis);
  });
}

function showTestResult(id, score, band, crisis) {
  const ts = TESTS[id];
  app.innerHTML = `
    <h1>${esc(ts.name[lang])}</h1>
    <div class="stage">
      <div>${t('yourScore')}</div>
      <div class="score">${score} <span class="meta">/ ${ts.max}</span></div>
      <h2 style="margin:0">${esc(band[1][lang])}</h2>
    </div>
    ${crisis ? `<div class="notice danger">${esc(t('crisis'))}</div>` : ''}
    ${band[2] && !crisis ? `<div class="notice warn">${esc(t('seeSpecialist'))}</div>` : ''}
    ${disclaimerHtml()}
    <div class="row-actions">
      <a class="btn" href="#test/${id}" onclick="setTimeout(route,0)">${t('retake')}</a>
      <a class="btn secondary" href="#results">${t('toResults')}</a>
    </div>`;
  window.scrollTo(0, 0);
}

/* ---------- Reaksiya vaqti ---------- */
function viewRT() {
  const TRIALS = 5;
  const times = [];
  let state = 'idle', timer = null, shownAt = 0;
  app.innerHTML = `
    <a href="#experiments">← ${t('back')}</a>
    <h1>${esc(t('rtTitle'))}</h1><p>${esc(t('rtDesc'))}</p>
    <div class="stage"><div id="box" class="rt-box rt-idle">${esc(t('rtIdle'))}</div><div id="info" class="meta"></div></div>`;
  const box = document.getElementById('box');
  const info = document.getElementById('info');
  const set = (cls, txt) => { box.className = 'rt-box ' + cls; box.textContent = txt; };
  function arm() {
    state = 'wait'; set('rt-wait', t('rtWait'));
    timer = setTimeout(() => { state = 'go'; shownAt = performance.now(); set('rt-go', t('rtGo')); }, 1200 + Math.random() * 2300);
  }
  box.addEventListener('pointerdown', () => {
    if (state === 'idle' || state === 'between') return arm();
    if (state === 'wait') {
      clearTimeout(timer); state = 'between';
      set('rt-idle', t('rtEarly') + ' ' + t('rtNext'));
      return;
    }
    if (state === 'go') {
      const rt = Math.round(performance.now() - shownAt);
      times.push(rt);
      info.textContent = times.map((x, i) => `${t('rtTrial')} ${i + 1}: ${x} ${t('ms')}`).join(' · ');
      if (times.length >= TRIALS) {
        state = 'done';
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        saveResult({ type: 'exp', id: 'rt', value: avg });
        set('rt-idle', `${t('rtAvg')}: ${avg} ${t('ms')}`);
        box.insertAdjacentHTML('afterend', `<div class="row-actions"><button class="btn" id="again">${t('retake')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`);
        document.getElementById('again').onclick = viewRT;
      } else {
        state = 'between';
        set('rt-idle', `${rt} ${t('ms')} — ${t('rtNext')}`);
      }
    }
  });
}

/* ---------- Stroop ---------- */
const COLORS = [
  { key: 'red', hex: '#d62828', uz: 'QIZIL', ru: 'КРАСНЫЙ' },
  { key: 'green', hex: '#2a9d4b', uz: 'YASHIL', ru: 'ЗЕЛЁНЫЙ' },
  { key: 'blue', hex: '#1d4ed8', uz: "KO'K", ru: 'СИНИЙ' },
  { key: 'yellow', hex: '#d4a106', uz: 'SARIQ', ru: 'ЖЁЛТЫЙ' }
];
function viewStroop() {
  const N = 24;
  const trials = [];
  for (let i = 0; i < N; i++) {
    const word = COLORS[Math.floor(Math.random() * 4)];
    let ink = word;
    if (i % 2 === 1) { do { ink = COLORS[Math.floor(Math.random() * 4)]; } while (ink === word); }
    trials.push({ word, ink, cong: word === ink });
  }
  trials.sort(() => Math.random() - 0.5);
  let idx = -1, shownAt = 0;
  app.innerHTML = `
    <a href="#experiments">← ${t('back')}</a>
    <h1>${esc(t('stroopTitle'))}</h1><p>${esc(t('stroopDesc'))}</p>
    <div class="stage" id="stage">
      <p><strong>${esc(t('stroopInstr'))}</strong></p>
      <button class="btn" id="go">${t('start')}</button>
    </div>`;
  document.getElementById('go').onclick = () => {
    document.getElementById('stage').innerHTML = `
      <div class="meta" id="cnt"></div>
      <div class="stroop-word" id="word"></div>
      <div class="color-buttons">${COLORS.map(c => `<button class="btn" style="background:${c.hex}" data-c="${c.key}">${c[lang]}</button>`).join('')}</div>`;
    document.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => answer(b.dataset.c)));
    next();
  };
  function next() {
    idx++;
    if (idx >= N) return finish();
    const tr = trials[idx];
    const w = document.getElementById('word');
    w.textContent = '';
    document.getElementById('cnt').textContent = `${idx + 1} / ${N}`;
    setTimeout(() => { w.textContent = tr.word[lang]; w.style.color = tr.ink.hex; shownAt = performance.now(); }, 400);
  }
  function answer(key) {
    if (idx < 0 || idx >= N || !shownAt) return;
    const tr = trials[idx];
    tr.rt = performance.now() - shownAt;
    tr.correct = key === tr.ink.key;
    shownAt = 0;
    next();
  }
  function finish() {
    const mean = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const ok = trials.filter(x => x.correct);
    const c = mean(ok.filter(x => x.cong).map(x => x.rt));
    const ic = mean(ok.filter(x => !x.cong).map(x => x.rt));
    const acc = Math.round(ok.length / N * 100);
    const effect = ic - c;
    saveResult({ type: 'exp', id: 'stroop', value: effect, cong: c, incong: ic, acc });
    document.getElementById('stage').innerHTML = `
      <div>${t('stroopEffect')}</div>
      <div class="score">${effect} ${t('ms')}</div>
      <table>
        <tr><th>${t('stroopCong')}</th><td>${c} ${t('ms')}</td></tr>
        <tr><th>${t('stroopIncong')}</th><td>${ic} ${t('ms')}</td></tr>
        <tr><th>${t('accuracy')}</th><td>${acc}%</td></tr>
      </table>
      <p class="meta">${esc(t('stroopExplain'))}</p>
      <div class="row-actions"><button class="btn" id="again">${t('retake')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
    document.getElementById('again').onclick = viewStroop;
  }
}

/* ---------- Raqamlar xotirasi ---------- */
function viewSpan() {
  let len = 3, fails = 0, best = 0;
  app.innerHTML = `
    <a href="#experiments">← ${t('back')}</a>
    <h1>${esc(t('spanTitle'))}</h1><p>${esc(t('spanDesc'))}</p>
    <div class="stage" id="stage"><button class="btn" id="go">${t('start')}</button></div>`;
  const stage = () => document.getElementById('stage');
  document.getElementById('go').onclick = round;
  function round() {
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
    stage().innerHTML = `<div class="meta">${esc(t('spanWatch'))} (${len} ${t('digits')})</div><div class="digit" id="d"></div>`;
    let i = 0;
    const d = document.getElementById('d');
    const tick = () => {
      if (i >= seq.length) { d.textContent = ''; return setTimeout(() => ask(seq), 300); }
      d.textContent = seq[i++];
      setTimeout(() => { d.textContent = ''; setTimeout(tick, 250); }, 750);
    };
    setTimeout(tick, 600);
  }
  function ask(seq) {
    stage().innerHTML = `
      <div>${esc(t('spanType'))}</div>
      <input type="text" id="inp" inputmode="numeric" autocomplete="off" maxlength="${seq.length + 2}">
      <button class="btn" id="chk">${t('spanCheck')}</button>
      <div id="fb" class="meta"></div>`;
    const inp = document.getElementById('inp');
    inp.focus();
    const check = () => {
      const ansr = inp.value.replace(/\D/g, '');
      const fb = document.getElementById('fb');
      document.getElementById('chk').disabled = true;
      inp.disabled = true;
      if (ansr === seq.join('')) {
        best = len; fails = 0; len++;
        fb.textContent = t('spanCorrect');
        setTimeout(round, 1000);
      } else {
        fails++;
        fb.textContent = `${t('spanWrong')} ${seq.join('')}`;
        setTimeout(fails >= 2 ? finish : round, 1600);
      }
    };
    document.getElementById('chk').onclick = check;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  }
  function finish() {
    saveResult({ type: 'exp', id: 'span', value: best });
    stage().innerHTML = `
      <div>${t('spanResult')}</div>
      <div class="score">${best} ${t('digits')}</div>
      <p class="meta">${esc(t('spanExplain'))}</p>
      <div class="row-actions"><button class="btn" id="again">${t('retake')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
    document.getElementById('again').onclick = viewSpan;
  }
}

/* ---------- Natijalar ---------- */
function describe(r) {
  if (r.type === 'test') {
    const ts = TESTS[r.id];
    if (!ts) return null;
    const band = ts.bands[r.band];
    return { name: ts.name[lang], result: `${r.score} / ${r.max}`, note: band ? band[1][lang] : '' };
  }
  const e = EXPERIMENTS.find(x => x.id === r.id);
  if (!e) return null;
  if (r.id === 'rt') return { name: t(e.title), result: `${r.value} ${t('ms')}`, note: t('rtAvg') };
  if (r.id === 'stroop') return { name: t(e.title), result: `${r.value} ${t('ms')}`, note: `${t('stroopEffect')}; ${t('accuracy')} ${r.acc}%` };
  return { name: t(e.title), result: `${r.value} ${t('digits')}`, note: t('spanResult') };
}
function viewResults() {
  const all = loadResults().slice().reverse();
  const rows = all.map(r => ({ r, d: describe(r) })).filter(x => x.d);
  app.innerHTML = `
    <h1>${esc(t('resultsTitle'))}</h1>
    ${storageOk ? '' : `<div class="notice warn">${esc(t('storageOff'))}</div>`}
    ${rows.length ? `
      <div class="row-actions">
        <button class="btn" id="csv">${t('exportCsv')}</button>
        <button class="btn secondary" id="clr">${t('clearAll')}</button>
      </div>
      <table>
        <tr><th>${t('date')}</th><th>${t('test')}</th><th>${t('result')}</th><th>${t('interpretation')}</th></tr>
        ${rows.map(({ r, d }) => `<tr><td>${esc(new Date(r.date).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ'))}</td><td>${esc(d.name)}</td><td>${esc(d.result)}</td><td>${esc(d.note)}</td></tr>`).join('')}
      </table>` : `<p class="lead">${esc(t('noResults'))}</p><a class="btn" href="#home">${t('start')}</a>`}`;
  if (!rows.length) return;
  document.getElementById('csv').onclick = () => {
    const q = s => '"' + String(s).replace(/"/g, '""') + '"';
    const csv = [[t('date'), t('test'), t('result'), t('interpretation')].map(q).join(',')]
      .concat(rows.map(({ r, d }) => [r.date, d.name, d.result, d.note].map(q).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'psixolab-natijalar.csv';
    a.click();
  };
  document.getElementById('clr').onclick = () => {
    const btn = document.getElementById('clr');
    if (btn.dataset.confirm) { clearResults(); viewResults(); return; }
    btn.dataset.confirm = '1';
    btn.textContent = t('confirmClear');
  };
}

/* ================= Marshrutlash / Маршрутизация ================= */
function route() {
  applyStatic();
  const h = (location.hash || '#home').slice(1);
  const [page, arg] = h.split('/');
  document.querySelectorAll('nav a').forEach(a => {
    const target = a.getAttribute('href').slice(1);
    a.classList.toggle('active', target === page || (page === 'test' && target === 'tests') || (page === 'exp' && target === 'experiments'));
  });
  if (page === 'tests') viewTests();
  else if (page === 'experiments') viewExperiments();
  else if (page === 'results') viewResults();
  else if (page === 'test') viewTest(arg);
  else if (page === 'exp' && arg === 'rt') viewRT();
  else if (page === 'exp' && arg === 'stroop') viewStroop();
  else if (page === 'exp' && arg === 'span') viewSpan();
  else viewHome();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();
