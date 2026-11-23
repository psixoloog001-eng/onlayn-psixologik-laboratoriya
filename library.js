'use strict';
/* PsixoLab — Kutubxona, video darslar va amaliy mashqlar
   Yangi material yoki video qo'shish uchun pastdagi MATERIALS va VIDEOS ro'yxatlarini to'ldiring. */
(function () {

/* =====================================================================
   1) SIZNING MATERIALLARINGIZ (PDF, Word va h.k.)
   Faylni repozitoriydagi "kutubxona" papkasiga yuklang va shu yerga yozing:
   { title: { uz: '...', ru: '...' }, desc: { uz: '...', ru: '...' }, url: 'kutubxona/fayl.pdf' }
   ===================================================================== */
const MATERIALS = [];

/* =====================================================================
   2) VIDEO DARSLAR (YouTube)
   cat: 'guide' — saytdan foydalanish, 'lesson' — psixologiya darslari, 'practice' — amaliy mashqlar
   { cat: 'lesson', title: { uz: '...', ru: '...' }, url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' }
   ===================================================================== */
const VIDEOS = [];

/* ---------- Tarjimalar ---------- */
Object.assign(T.uz, {
  navLib: 'Kutubxona', navVideo: 'Video darslar',
  libTitle: 'Onlayn kutubxona', libLead: "Metodikalar tavsifi, ochiq darsliklar va o'quv materiallari.",
  libMethods: 'Metodikalar tavsifi', libOpen: 'Bepul ochiq darsliklar', libMine: "O'quv materiallari",
  libEmpty: "Bu bo'limga tez orada o'quv qo'llanmalari va ma'ruzalar qo'shiladi.",
  fPurpose: 'Maqsadi', fProc: "O'tkazish va hisoblash", fInterp: 'Talqin', fSource: 'Manba',
  open: 'Ochish', goTest: "Testni boshlash",
  vidTitle: 'Video darslar va mashqlar', vidLead: "Saytdan foydalanish bo'yicha ko'rsatmalar, psixologiya darslari va video bilan bajariladigan mashqlar.",
  catGuide: 'Saytdan foydalanish', catLesson: 'Psixologiya darslari', catPractice: 'Amaliy mashqlar',
  vidSoon: "Bu turkumga videolar tez orada qo'shiladi.",
  brTitle: 'Nafas mashqi: "kvadrat nafas" (4–4–4–4)',
  brDesc: "Xavotir va stressni kamaytirish uchun oddiy mashq. Doira bilan birga: 4 soniya nafas oling, 4 soniya ushlab turing, 4 soniya nafas chiqaring, 4 soniya ushlab turing.",
  brIn: 'Nafas oling', brHold: 'Ushlab turing', brOut: 'Nafas chiqaring', brStart: 'Boshlash', brStop: "To'xtatish",
  brCycles: 'Bajarilgan sikllar', brNote: "Bosh aylansa yoki noqulaylik sezsangiz, mashqni to'xtatib, odatdagidek nafas oling.",
  grTitle: 'Xotirjamlashish mashqi: 5–4–3–2–1',
  grSteps: ["Atrofingizdagi 5 ta narsani ko'ring va nomini ayting.", "Teginib turgan 4 ta narsani his qiling (kiyim, stul, pol...).", "Eshitayotgan 3 ta tovushni aniqlang.", "Sezayotgan 2 ta hidni toping.", "1 ta ta'mni his qiling yoki o'zingiz yoqtirgan ta'mni eslang."],
  grNote: "Bu mashq kuchli xavotir yoki vahima paytida e'tiborni hozirgi vaqtga qaytarishga yordam beradi."
});
Object.assign(T.ru, {
  navLib: 'Библиотека', navVideo: 'Видеоуроки',
  libTitle: 'Онлайн-библиотека', libLead: 'Описания методик, открытые учебники и учебные материалы.',
  libMethods: 'Описания методик', libOpen: 'Бесплатные открытые учебники', libMine: 'Учебные материалы',
  libEmpty: 'В этот раздел скоро будут добавлены учебные пособия и лекции.',
  fPurpose: 'Цель', fProc: 'Проведение и подсчёт', fInterp: 'Интерпретация', fSource: 'Источник',
  open: 'Открыть', goTest: 'Начать тест',
  vidTitle: 'Видеоуроки и упражнения', vidLead: 'Инструкции по работе с сайтом, уроки психологии и упражнения с видео.',
  catGuide: 'Как пользоваться сайтом', catLesson: 'Уроки психологии', catPractice: 'Практические упражнения',
  vidSoon: 'Видео в этой категории скоро появятся.',
  brTitle: 'Дыхательное упражнение «квадратное дыхание» (4–4–4–4)',
  brDesc: 'Простое упражнение для снижения тревоги и стресса. Вместе с кругом: 4 секунды вдох, 4 задержка, 4 выдох, 4 задержка.',
  brIn: 'Вдох', brHold: 'Задержка', brOut: 'Выдох', brStart: 'Начать', brStop: 'Остановить',
  brCycles: 'Выполнено циклов', brNote: 'Если закружится голова или станет некомфортно, прекратите упражнение и дышите как обычно.',
  grTitle: 'Упражнение на заземление: 5–4–3–2–1',
  grSteps: ['Найдите взглядом 5 предметов вокруг и назовите их.', 'Почувствуйте 4 вещи, которых касаетесь (одежда, стул, пол...).', 'Различите 3 звука вокруг.', 'Найдите 2 запаха.', 'Почувствуйте 1 вкус или вспомните любимый.'],
  grNote: 'Это упражнение помогает вернуть внимание в настоящий момент при сильной тревоге или панике.'
});

/* ---------- Metodikalar tavsifi ---------- */
const M = (link, uz, ru) => ({ link, uz, ru });
const METHODS = [
  M('#test/phq9',
    { t: 'PHQ-9 — depressiya skriningi', p: "Oxirgi 2 haftadagi depressiya belgilarini aniqlash va ularning og'irligini baholash.", c: "9 ta savol, har biri 0–3 ball (umuman yo'q — deyarli har kuni). Umumiy ball 0–27.", i: "0–4 minimal, 5–9 yengil, 10–14 o'rtacha, 15–19 o'rtachadan og'ir, 20–27 og'ir. 9-savolga har qanday ijobiy javob alohida e'tibor talab qiladi.", s: 'Kroenke, Spitzer, Williams (2001)' },
    { t: 'PHQ-9 — скрининг депрессии', p: 'Выявление признаков депрессии за последние 2 недели и оценка их тяжести.', c: '9 вопросов, каждый 0–3 балла (ни разу — почти каждый день). Общий балл 0–27.', i: '0–4 минимальная, 5–9 лёгкая, 10–14 умеренная, 15–19 умеренно тяжёлая, 20–27 тяжёлая. Любой положительный ответ на 9-й вопрос требует особого внимания.', s: 'Kroenke, Spitzer, Williams (2001)' }),
  M('#test/gad7',
    { t: 'GAD-7 — xavotir skriningi', p: "Umumlashgan xavotir belgilarini aniqlash va darajasini baholash.", c: "7 ta savol, har biri 0–3 ball. Umumiy ball 0–21.", i: "0–4 minimal, 5–9 yengil, 10–14 o'rtacha, 15–21 kuchli xavotir. 10 va undan yuqori ball mutaxassis bilan maslahatlashish uchun asos.", s: 'Spitzer, Kroenke, Williams, Löwe (2006)' },
    { t: 'GAD-7 — скрининг тревоги', p: 'Выявление признаков генерализованной тревоги и оценка её уровня.', c: '7 вопросов, каждый 0–3 балла. Общий балл 0–21.', i: '0–4 минимальная, 5–9 лёгкая, 10–14 умеренная, 15–21 выраженная тревога. Балл 10 и выше — повод обратиться к специалисту.', s: 'Spitzer, Kroenke, Williams, Löwe (2006)' }),
  M('#test/pss10',
    { t: "PSS-10 — idrok etilgan stress shkalasi", p: "Oxirgi bir oyda inson o'z hayotini qanchalik oldindan aytib bo'lmaydigan, nazoratsiz va og'ir deb his qilganini o'lchash.", c: "10 ta savol, 0–4 ball. 4, 5, 7, 8-savollar teskari hisoblanadi. Umumiy ball 0–40.", i: "0–13 past, 14–26 o'rtacha, 27–40 yuqori stress.", s: 'Cohen, Kamarck, Mermelstein (1983)' },
    { t: 'PSS-10 — шкала воспринимаемого стресса', p: 'Измерение того, насколько непредсказуемой, неконтролируемой и перегруженной человек ощущал свою жизнь за последний месяц.', c: '10 вопросов, 0–4 балла. Вопросы 4, 5, 7, 8 считаются в обратном порядке. Общий балл 0–40.', i: '0–13 низкий, 14–26 умеренный, 27–40 высокий стресс.', s: 'Cohen, Kamarck, Mermelstein (1983)' }),
  M('#test/rosenberg',
    { t: "Rozenberg o'z-o'zini baholash shkalasi", p: "Shaxsning o'ziga bo'lgan umumiy munosabati va o'z-o'zini hurmat darajasini o'lchash.", c: "10 ta fikr, 0–3 ball. 2, 5, 6, 8, 9-fikrlar teskari hisoblanadi. Umumiy ball 0–30.", i: "15 dan past — past o'z-o'zini baholash, 15–25 me'yoriy, 26–30 yuqori.", s: 'Rosenberg (1965)' },
    { t: 'Шкала самооценки Розенберга', p: 'Измерение общего отношения к себе и уровня самоуважения.', c: '10 утверждений, 0–3 балла. Утверждения 2, 5, 6, 8, 9 считаются в обратном порядке. Общий балл 0–30.', i: 'Ниже 15 — низкая самооценка, 15–25 нормальная, 26–30 высокая.', s: 'Rosenberg (1965)' }),
  M('#test/ipip',
    { t: 'Mini-IPIP — Big Five (Katta beshlik)', p: "Shaxsning beshta asosiy xususiyatini o'lchash: ekstraversiya, hamjihatlik, mas'uliyatlilik, neyrotizm, intellekt/tasavvur.", c: "20 ta fikr, 1–5 ball, har bir xususiyatga 4 tadan. Teskari fikrlar 6 dan ayirib hisoblanadi. Har bir xususiyat 4–20 ball.", i: "Taxminiy: 4–9 past, 10–14 o'rta, 15–20 yuqori. Xususiyatlarning yaxshi yoki yomon darajasi yo'q.", s: 'Donnellan et al. (2006); IPIP — ochiq foydalanishdagi savollar banki' },
    { t: 'Mini-IPIP — Большая пятёрка', p: 'Измерение пяти основных черт личности: экстраверсии, доброжелательности, добросовестности, нейротизма, интеллекта/воображения.', c: '20 утверждений, 1–5 баллов, по 4 на каждую черту. Обратные утверждения вычитаются из 6. Каждая черта 4–20 баллов.', i: 'Ориентировочно: 4–9 низкий, 10–14 средний, 15–20 высокий. У черт нет хорошего или плохого уровня.', s: 'Donnellan et al. (2006); IPIP — открытый банк утверждений' }),
  M('#exp/rt',
    { t: 'Oddiy reaksiya vaqti', p: "Signalga javob berish tezligini o'lchash.", c: "Ekran yashil bo'lishi bilan bosiladi, 5 urinish. Erta bosish hisobga olinmaydi. Natija — o'rtacha vaqt (ms).", i: "Onlayn sharoitda taxminan 270–400 ms me'yoriy. Charchoq, uyqusizlik va qurilma natijaga ta'sir qiladi.", s: 'Klassik psixofiziologik usul' },
    { t: 'Простая сенсомоторная реакция', p: 'Измерение скорости ответа на сигнал.', c: 'Нажать, как только экран станет зелёным, 5 попыток. Ранние нажатия не засчитываются. Результат — среднее время (мс).', i: 'В онлайн-условиях нормой считается примерно 270–400 мс. На результат влияют усталость, недосып и устройство.', s: 'Классический психофизиологический метод' }),
  M('#exp/stroop',
    { t: 'Stroop tajribasi', p: "Diqqatni boshqarish va chalg'ituvchi ma'lumotni to'xtatib turish qobiliyatini o'lchash.", c: "So'zning ma'nosi emas, rangi tanlanadi. Stroop effekti = nomos urinishlardagi o'rtacha vaqt − mos urinishlardagi o'rtacha vaqt.", i: "50–150 ms me'yoriy. Effekt kattaroq bo'lsa, chalg'ituvchi ma'lumot ko'proq ta'sir qilgan.", s: 'Stroop (1935)' },
    { t: 'Тест Струпа', p: 'Измерение контроля внимания и способности подавлять отвлекающую информацию.', c: 'Выбирается цвет, а не значение слова. Эффект Струпа = среднее время в несовпадающих пробах − среднее время в совпадающих.', i: 'Норма около 50–150 мс. Чем больше эффект, тем сильнее влияние отвлекающей информации.', s: 'Stroop (1935)' }),
  M('#exp/span',
    { t: 'Raqamlar xotirasi (digit span)', p: "Qisqa muddatli eshitish-og'zaki xotira hajmini o'lchash.", c: "Raqamlar ketma-ketligi 3 tadan boshlanadi va har to'g'ri javobdan keyin bittaga uzayadi. Ketma-ket 2 ta xatodan keyin tugaydi.", i: "Kattalarda odatda 5–9 ta raqam (Miller'ning \"7±2\" qoidasi).", s: 'Miller (1956)' },
    { t: 'Память на цифры (digit span)', p: 'Измерение объёма кратковременной памяти.', c: 'Ряд начинается с 3 цифр и после каждого верного ответа удлиняется на одну. Завершается после 2 ошибок подряд.', i: 'У взрослых обычно 5–9 цифр (правило Миллера «7±2»).', s: 'Miller (1956)' }),
  M('#exp/schulte',
    { t: 'Shulte jadvallari', p: "Diqqatning barqarorligi va ishchanlik dinamikasini aniqlash.", c: "5 ta jadvalda 1 dan 25 gacha raqamlar tartib bilan topiladi. IS = (t1+t2+t3+t4+t5)/5; ID = t1/IS; PB = t4/IS.", i: "IS yoshga ko'ra 1–5 ballga aylantiriladi. ID 1,0 dan past — ishga tez kirishish; PB 1,0 dan past — psixik barqarorlik yaxshi.", s: "\"Shulte jadvallari\" metodikasi; ko'rsatkichlar A.Y. Kozireva bo'yicha" },
    { t: 'Таблицы Шульте', p: 'Определение устойчивости внимания и динамики работоспособности.', c: 'В 5 таблицах по порядку находятся числа от 1 до 25. ЭР = (t1+t2+t3+t4+t5)/5; ВР = t1/ЭР; ПУ = t4/ЭР.', i: 'ЭР переводится в 1–5 баллов с учётом возраста. ВР ниже 1,0 — быстрая врабатываемость; ПУ ниже 1,0 — хорошая психическая устойчивость.', s: 'Методика «Таблицы Шульте»; показатели по А.Ю. Козыревой' }),
  M('#exp/gonogo',
    { t: 'Go/No-Go', p: "Impulsni to'xtatib turish (javobni ingibitsiya qilish) qobiliyatini o'lchash.", c: "40 urinish: 30 ta yashil (bosish kerak) va 10 ta qizil (bosmaslik kerak). Qizilga bosish — impulsiv xato, yashilni o'tkazib yuborish — diqqat xatosi.", i: "Impulsiv xatolar 0–1 — yaxshi nazorat, 2–4 — o'rtacha, 5 va undan ko'p — impulsivlikka moyillik.", s: 'Klassik neyropsixologik paradigma' },
    { t: 'Go/No-Go', p: 'Измерение способности сдерживать импульс (торможение ответа).', c: '40 проб: 30 зелёных (нажимать) и 10 красных (не нажимать). Нажатие на красный — импульсивная ошибка, пропуск зелёного — ошибка внимания.', i: 'Импульсивных ошибок 0–1 — хороший контроль, 2–4 — средний, 5 и более — склонность к импульсивности.', s: 'Классическая нейропсихологическая парадигма' }),
  M('#exp/corsi',
    { t: 'Corsi bloklari', p: "Ko'rish-fazoviy ishchi xotira hajmini o'lchash.", c: "Bloklar ketma-ket yonadi va xuddi shu tartibda bosiladi. Ketma-ketlik 2 tadan boshlanadi. Bir uzunlikda 2 marta xato qilinsa, test tugaydi.", i: "Kattalarda odatda 5–7 blok.", s: 'Corsi (1972); Kessels et al. (2000)' },
    { t: 'Блоки Корси', p: 'Измерение объёма зрительно-пространственной рабочей памяти.', c: 'Блоки загораются по очереди и нажимаются в том же порядке. Ряд начинается с 2 блоков. Две ошибки на одной длине завершают тест.', i: 'У взрослых обычно 5–7 блоков.', s: 'Corsi (1972); Kessels et al. (2000)' })
];

const OPEN_BOOKS = [
  { url: 'https://openstax.org/books/psychology-2e/pages/preface',
    uz: { t: 'Psychology 2e (OpenStax)', d: "Psixologiyaga kirish bo'yicha to'liq bepul darslik (ingliz tilida). CC BY 4.0 litsenziyasi ostida." },
    ru: { t: 'Psychology 2e (OpenStax)', d: 'Полный бесплатный учебник по введению в психологию (на английском). Лицензия CC BY 4.0.' } },
  { url: 'https://www.noba.to/',
    uz: { t: 'Noba Project', d: "Mutaxassislar yozgan 100 dan ortiq bepul psixologiya modullari (ingliz tilida)." },
    ru: { t: 'Noba Project', d: 'Более 100 бесплатных модулей по психологии, написанных экспертами (на английском).' } },
  { url: 'https://ipip.ori.org/',
    uz: { t: 'International Personality Item Pool (IPIP)', d: "Shaxs testlari uchun ochiq foydalanishdagi savollar banki. Mini-IPIP testi shu yerdan olingan." },
    ru: { t: 'International Personality Item Pool (IPIP)', d: 'Открытый банк утверждений для личностных тестов. Тест Mini-IPIP взят отсюда.' } }
];

/* ---------- Sahifalar ---------- */
function viewLibrary() {
  const methods = METHODS.map(m => {
    const x = m[lang];
    return `<details class="lib-item">
      <summary>${esc(x.t)}</summary>
      <p><strong>${t('fPurpose')}:</strong> ${esc(x.p)}</p>
      <p><strong>${t('fProc')}:</strong> ${esc(x.c)}</p>
      <p><strong>${t('fInterp')}:</strong> ${esc(x.i)}</p>
      <p class="meta"><strong>${t('fSource')}:</strong> ${esc(x.s)}</p>
      <a class="btn secondary" href="${m.link}">${t('goTest')}</a>
    </details>`;
  }).join('');
  const books = OPEN_BOOKS.map(b => `
    <div class="card"><h3>${esc(b[lang].t)}</h3><p>${esc(b[lang].d)}</p>
      <a class="btn" href="${b.url}" target="_blank" rel="noopener">${t('open')} ↗</a></div>`).join('');
  const mine = MATERIALS.length ? `<div class="grid">${MATERIALS.map(m => `
    <div class="card"><h3>${esc(m.title[lang] || m.title.uz)}</h3><p>${esc((m.desc && (m.desc[lang] || m.desc.uz)) || '')}</p>
      <a class="btn" href="${esc(m.url)}" target="_blank" rel="noopener">${t('open')}</a></div>`).join('')}</div>`
    : `<p class="meta">${esc(t('libEmpty'))}</p>`;
  app.innerHTML = `
    <h1>${esc(t('libTitle'))}</h1><p class="lead">${esc(t('libLead'))}</p>
    <h2>${esc(t('libMethods'))}</h2>${methods}
    <h2>${esc(t('libMine'))}</h2>${mine}
    <h2>${esc(t('libOpen'))}</h2><div class="grid">${books}</div>`;
}

function ytId(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}
function videoBlock(cat) {
  const list = VIDEOS.filter(v => v.cat === cat && ytId(v.url));
  if (!list.length) return `<p class="meta">${esc(t('vidSoon'))}</p>`;
  return `<div class="video-grid">${list.map(v => `
    <div class="video-card">
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${ytId(v.url)}" title="${esc(v.title[lang] || v.title.uz)}" loading="lazy" allowfullscreen allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe></div>
      <h3>${esc(v.title[lang] || v.title.uz)}</h3>
    </div>`).join('')}</div>`;
}
function viewVideos() {
  app.innerHTML = `
    <h1>${esc(t('vidTitle'))}</h1><p class="lead">${esc(t('vidLead'))}</p>
    <h2>${esc(t('catGuide'))}</h2>${videoBlock('guide')}
    <h2>${esc(t('catLesson'))}</h2>${videoBlock('lesson')}
    <h2>${esc(t('catPractice'))}</h2>${videoBlock('practice')}
    <div class="card" style="margin-top:1rem">
      <h3>${esc(t('brTitle'))}</h3><p>${esc(t('brDesc'))}</p>
      <div class="breath-stage">
        <div class="breath-circle" id="circle"><span id="phase">4</span></div>
        <div id="brInfo" class="meta"></div>
        <button class="btn" id="brBtn">${t('brStart')}</button>
      </div>
      <p class="meta">${esc(t('brNote'))}</p>
    </div>
    <div class="card" style="margin-top:1rem">
      <h3>${esc(t('grTitle'))}</h3>
      <ol class="steps">${T[lang].grSteps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <p class="meta">${esc(t('grNote'))}</p>
    </div>`;
  setupBreathing();
}

function setupBreathing() {
  const circle = document.getElementById('circle'), phase = document.getElementById('phase');
  const info = document.getElementById('brInfo'), btn = document.getElementById('brBtn');
  const PH = [['brIn', 1.0], ['brHold', 1.0], ['brOut', 0.55], ['brHold', 0.55]];
  let running = false, timer = null, step = 0, sec = 4, cycles = 0;
  const alive = () => document.body.contains(circle);
  function tick() {
    if (!alive() || !running) return;
    if (sec === 4) {
      const [k, scale] = PH[step];
      circle.style.transform = `scale(${scale})`;
      info.textContent = `${t(k)} · ${t('brCycles')}: ${cycles}`;
    }
    phase.textContent = sec;
    sec--;
    if (sec === 0) {
      sec = 4; step = (step + 1) % 4;
      if (step === 0) cycles++;
    }
    timer = setTimeout(tick, 1000);
  }
  btn.onclick = () => {
    running = !running;
    btn.textContent = running ? t('brStop') : t('brStart');
    if (running) { step = 0; sec = 4; circle.style.transform = 'scale(0.55)'; setTimeout(tick, 300); }
    else { clearTimeout(timer); circle.style.transform = 'scale(0.55)'; phase.textContent = '4'; info.textContent = `${t('brCycles')}: ${cycles}`; }
  };
}

/* ---------- Dizayn ---------- */
const style = document.createElement('style');
style.textContent = `
.lib-item{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:.8rem 1.1rem;margin-bottom:.6rem}
.lib-item summary{cursor:pointer;font-weight:600}
.lib-item p{margin:.5rem 0}
.video-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem}
.video-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.video-card h3{font-size:1rem;margin:.6rem .9rem .8rem}
.video-wrap{position:relative;aspect-ratio:16/9}
.video-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.breath-stage{display:flex;flex-direction:column;align-items:center;gap:.8rem;padding:1rem 0}
.breath-circle{width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,#91a7ff,#3b5bdb);display:flex;align-items:center;justify-content:center;transform:scale(.55);transition:transform 4s ease-in-out}
.breath-circle span{color:#fff;font-size:2.4rem;font-weight:700}
.steps li{margin:.3rem 0}`;
document.head.appendChild(style);

/* ---------- Menyu va marshrut ---------- */
const nav = document.querySelector('nav');
const results = nav.querySelector('a[href="#results"]');
[['#library', 'navLib'], ['#videos', 'navVideo']].forEach(([h, k]) => {
  if (nav.querySelector(`a[href="${h}"]`)) return;
  const a = document.createElement('a');
  a.href = h; a.dataset.i18n = k; a.textContent = t(k);
  nav.insertBefore(a, results);
});

const _prevRoute = route;
window.removeEventListener('hashchange', _prevRoute);
route = function () {
  _prevRoute();
  const page = (location.hash || '#home').slice(1).split('/')[0];
  if (page === 'library') viewLibrary();
  else if (page === 'videos') viewVideos();
  else return;
  window.scrollTo(0, 0);
};
window.addEventListener('hashchange', route);
route();

})();
