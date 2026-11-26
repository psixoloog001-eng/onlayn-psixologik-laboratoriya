/* PsixoLab — "Temperament formulasi" (A. A. Belov metodikasi asosida, 1971).
   Har bir temperament tipi uchun 20 tadan xususiyat (jami 80), "Ha / Yo'q" javobi.
   Natija: har tip bo'yicha "ha" javoblari soni jami "ha"larga nisbatan foizda — temperament formulasi, masalan T = 0,40X + 0,30S + 0,20F + 0,10M.
   Bandlar foydalanuvchi yuborgan o'quv materiali (Temperament turlari) asosida PsixoLab tomonidan qayta ishlangan va tuzatilgan. */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const $ = id => document.getElementById(id);

  const T4 = {
    X: [
      ['Bir joyda uzoq o\'tira olmayman, betoqatman.', 'Мне трудно долго усидеть на месте, я суетлив(а).'],
      ['Tez jahlim chiqadi, o\'zimni tutolmay qolaman.', 'Я вспыльчив(а) и бываю несдержан(а).'],
      ['Sabrsizman.', 'Я нетерпелив(а).'],
      ['Odamlar bilan munosabatda to\'g\'riso\'z va keskinman.', 'В общении с людьми я прям(а) и резок(а).'],
      ['Qat\'iyatli va tashabbuskorman.', 'Я решителен(на) и инициативен(на).'],
      ['O\'jarman.', 'Я упрям(а).'],
      ['Bahslarda topqirman, javobni tez topaman.', 'В спорах я находчив(а), быстро нахожу ответ.'],
      ['Bir tekis emas, to\'lqinsimon — goh shiddat bilan, goh sust ishlayman.', 'Работаю неравномерно — то рывком, то спадом.'],
      ['Tavakkal qilishga moyilman.', 'Я склонен(на) к риску.'],
      ['Kek saqlamayman va tez arazlamayman.', 'Я не злопамятен(на) и не обидчив(а).'],
      ['Nutqim tez va ehtirosli, ohanglari o\'zgarib turadi.', 'Моя речь быстрая и страстная, с меняющимися интонациями.'],
      ['Muvozanatsizman, tez qizishib ketaman.', 'Я неуравновешен(на) и легко загораюсь.'],
      ['Ba\'zan tajovuzkor bo\'lib, janjal chiqarib qo\'yaman.', 'Иногда бываю агрессивен(на) и задирист(а).'],
      ['Kamchiliklarga toqat qilolmayman.', 'Я нетерпим(а) к недостаткам.'],
      ['Yuz ifodalarim va imo-ishoralarim juda ifodali.', 'У меня очень выразительная мимика и жесты.'],
      ['Tez harakat qilib, tez qaror chiqara olaman.', 'Я способен(на) быстро действовать и решать.'],
      ['Doim yangilikka intilaman.', 'Я неустанно стремлюсь к новому.'],
      ['Harakatlarim keskin va shiddatli.', 'Мои движения резкие и порывистые.'],
      ['Maqsadga erishishda qat\'iyatliman.', 'Я настойчив(а) в достижении цели.'],
      ['Kayfiyatim keskin o\'zgarib turadi.', 'У меня бывают резкие перепады настроения.']
    ],
    S: [
      ['Quvnoq va xushchaqchaqman.', 'Я весел(а) и жизнерадостен(на).'],
      ['G\'ayratli va ishbilarmonman.', 'Я энергичен(на) и деловит(а).'],
      ['Ko\'pincha boshlagan ishimni oxiriga yetkazmayman.', 'Я часто не довожу начатое до конца.'],
      ['O\'zimni ortiqcha baholashga moyilman.', 'Я склонен(на) переоценивать себя.'],
      ['Yangilikni tez ilg\'ab olaman.', 'Я быстро схватываю новое.'],
      ['Qiziqish va moyilliklarim tez o\'zgaradi.', 'Мои интересы и увлечения неустойчивы.'],
      ['Omadsizlik va ko\'ngilsizliklarni yengil o\'tkazaman.', 'Неудачи и неприятности я переживаю легко.'],
      ['Turli sharoitlarga oson moslashaman.', 'Я легко приспосабливаюсь к разным обстоятельствам.'],
      ['Har qanday yangi ishga ishtiyoq bilan kirishaman.', 'Я с увлечением берусь за любое новое дело.'],
      ['Ish qiziqarli bo\'lmay qolsa, tez soviyman.', 'Я быстро остываю, если дело перестаёт быть интересным.'],
      ['Yangi ishga tez kirishaman va bir ishdan boshqasiga oson o\'taman.', 'Я быстро включаюсь в новую работу и легко переключаюсь.'],
      ['Bir xil, mayda va qunt talab qiladigan ish meni zeriktiradi.', 'Однообразная кропотливая работа меня тяготит.'],
      ['Kirishimliman, notanish odamlar orasida ham o\'zimni erkin his qilaman.', 'Я общителен(на), с новыми людьми не чувствую скованности.'],
      ['Chidamli va ishchanman.', 'Я вынослив(а) и работоспособен(на).'],
      ['Nutqim baland, tez va ravshan, jonli imo-ishoralar bilan.', 'Моя речь громкая, быстрая, чёткая, с живыми жестами.'],
      ['Kutilmagan, murakkab vaziyatda o\'zimni yo\'qotmayman.', 'В неожиданной сложной ситуации я не теряю самообладания.'],
      ['Kayfiyatim deyarli doim tetik.', 'У меня почти всегда бодрое настроение.'],
      ['Tez uxlab qolaman va tez uyg\'onaman.', 'Я быстро засыпаю и быстро просыпаюсь.'],
      ['Ko\'pincha yig\'ilmaganman, qaror qabul qilishda shoshilaman.', 'Я часто несобран(а) и тороплюсь с решениями.'],
      ['Ba\'zan narsalarni yuzaki qilaman, tez chalg\'iyman.', 'Иногда я поверхностен(на) и легко отвлекаюсь.']
    ],
    F: [
      ['Xotirjam va sovuqqonman.', 'Я спокоен(на) и хладнокровен(на).'],
      ['Ishlarni izchil va puxta bajaraman.', 'В делах я последователен(на) и обстоятелен(на).'],
      ['Ehtiyotkor va mulohazaliman.', 'Я осторожен(на) и рассудителен(на).'],
      ['Kuta olaman.', 'Я умею ждать.'],
      ['Kamgapman, behuda gapirishni yoqtirmayman.', 'Я немногословен(на) и не люблю пустых разговоров.'],
      ['Nutqim sokin va bir maromda, keskin hissiyot va imo-ishorasiz.', 'Моя речь спокойная, размеренная, без ярких эмоций и жестов.'],
      ['Vazmin va sabr-toqatliman.', 'Я сдержан(а) и терпелив(а).'],
      ['Boshlagan ishimni oxiriga yetkazaman.', 'Я довожу начатое дело до конца.'],
      ['Kuchimni behuda sarflamayman.', 'Я не трачу силы попусту.'],
      ['O\'zim tuzgan kun tartibi va ish tizimiga qat\'iy amal qilaman.', 'Я строго придерживаюсь своего распорядка и системы в работе.'],
      ['Hissiy turtkilarni osongina jilovlayman.', 'Я легко сдерживаю свои порывы.'],
      ['Maqtov va tanbehga kam ta\'sirlanaman.', 'Я мало восприимчив(а) к похвале и порицанию.'],
      ['Menga qaratilgan piching gaplarga kek saqlamay, kechirimli munosabatda bo\'laman.', 'На колкости в свой адрес я реагирую снисходительно, без злобы.'],
      ['Qiziqish va munosabatlarimda doimiyman.', 'Я постоянен(на) в своих интересах и отношениях.'],
      ['Ishga sekin kirishaman va bir ishdan boshqasiga sekin o\'taman.', 'Я медленно включаюсь в работу и медленно переключаюсь.'],
      ['Hamma bilan bir tekis munosabatdaman.', 'Я ровен(на) в отношениях со всеми.'],
      ['Hamma narsada ozodalik va tartibni yoqtiraman.', 'Я люблю аккуратность и порядок во всём.'],
      ['Yangi sharoitga qiyinchilik bilan moslashaman.', 'Я с трудом приспосабливаюсь к новой обстановке.'],
      ['Chidamliman, o\'zimni tuta bilaman.', 'Я выдержан(а) и владею собой.'],
      ['Biroz sekin harakat qilaman.', 'Я несколько медлителен(на).']
    ],
    M: [
      ['Tortinchoq va uyatchanman.', 'Я стеснителен(на) и застенчив(а).'],
      ['Yangi sharoitda o\'zimni yo\'qotib qo\'yaman.', 'В новой обстановке я теряюсь.'],
      ['Notanish odamlar bilan aloqa o\'rnatish menga qiyin.', 'Мне трудно устанавливать контакт с незнакомыми людьми.'],
      ['O\'z kuchimga ishonmayman.', 'Я не верю в свои силы.'],
      ['Yolg\'izlikka oson chidayman.', 'Я легко переношу одиночество.'],
      ['Muvaffaqiyatsizlikda tushkunlik va sarosimaga tushaman.', 'При неудачах я впадаю в уныние и растерянность.'],
      ['O\'z ichimga berilib ketishga moyilman.', 'Я склонен(на) уходить в себя.'],
      ['Tez charchayman.', 'Я быстро утомляюсь.'],
      ['Nutqim past va kuchsiz, ba\'zan shivirlashgacha tushadi.', 'Моя речь тихая и слабая, иногда почти шёпот.'],
      ['Suhbatdoshimning xarakteriga beixtiyor moslashib qolaman.', 'Я невольно подстраиваюсь под характер собеседника.'],
      ['Juda ta\'sirchanman, tez ko\'zimga yosh keladi.', 'Я впечатлителен(на) до слёз.'],
      ['Maqtov va tanbehga haddan tashqari ta\'sirchanman.', 'Я чрезвычайно чувствителен(на) к похвале и порицанию.'],
      ['O\'zimga va atrofdagilarga yuqori talablar qo\'yaman.', 'Я предъявляю высокие требования к себе и окружающим.'],
      ['Shubhalanish va gumonsirashga moyilman.', 'Я склонен(на) к подозрительности и мнительности.'],
      ['Juda sezgirman, ko\'nglim tez og\'riydi.', 'Я очень чувствителен(на) и легко раним(а).'],
      ['Tez xafa bo\'laman, arazchiman.', 'Я очень обидчив(а).'],
      ['Ichimdagini aytmayman, fikrlarimni hech kim bilan bo\'lishmayman.', 'Я скрытен(на) и не делюсь ни с кем своими мыслями.'],
      ['Kam faol va jur\'atsizman.', 'Я малоактивен(на) и робок(ка).'],
      ['E\'tiroz bildirmay, bo\'ysunib ketaveraman.', 'Я безропотно подчиняюсь.'],
      ['Atrofdagilarning hamdardligi va yordamini kutaman.', 'Я стремлюсь вызвать сочувствие и помощь окружающих.']
    ]
  };
  const KEYS = ['X', 'S', 'F', 'M'];
  // Aralash tartib: tiplar navbatma-navbat, har tip ichida bandlar sakrab olinadi — o'xshash bandlar yonma-yon tushmaydi
  const ITEMS = [];
  for (let k = 0; k < 20; k++) KEYS.forEach((t, j) => { const i = (k * 7 + j * 5) % 20; ITEMS.push([T4[t][i][0], T4[t][i][1], t]); });
  for (let k = 1; k < ITEMS.length; k += 3) { const j = (k * 11) % ITEMS.length; [ITEMS[k], ITEMS[j]] = [ITEMS[j], ITEMS[k]]; }

  const NAMES = () => ({ X: L('Xolerik', 'Холерик'), S: L('Sangvinik', 'Сангвиник'), F: L('Flegmatik', 'Флегматик'), M: L('Melanxolik', 'Меланхолик') });
  const COL = { X: '#FF6F91', S: '#F5A524', F: '#2BA88F', M: '#7B6CF6' };
  const DESC = () => ({
    X: { d: L("Juda g'ayratli, ishga ehtiros bilan beriladigan, tez va shiddatli, hissiy \"portlash\"larga va kayfiyatning keskin o'zgarishiga moyil, harakatlari ildam odam. Asab tizimi kuchli, harakatchan, lekin muvozanatsiz (qo'zg'alish tormozlanishdan ustun).", 'Очень энергичный, страстно увлекающийся делом, быстрый и порывистый человек, склонный к эмоциональным «взрывам» и резким сменам настроения. Нервная система сильная, подвижная, но неуравновешенная (возбуждение преобладает над торможением).'),
      p: L("Tashabbuskorlik, qat'iyat, tez qaror qabul qilish, yetakchilik, g'ayrat.", 'Инициативность, решительность, быстрота решений, лидерство, энергия.'),
      a: L("Hissiyot avjiga chiqqanda qaror qabul qilmang, \"10 gacha sanash\" va nafas mashqlarini qo'llang; kuchingizni bir tekis taqsimlashni o'rganing.", 'Не принимайте решений на пике эмоций, используйте «счёт до 10» и дыхательные упражнения; учитесь распределять силы равномерно.') },
    S: { d: L("Faol, atrofdagi voqealarga tez munosabat bildiradigan, taassurotlarini tez-tez yangilashga intiladigan, muvaffaqiyatsizliklarni nisbatan yengil o'tkazadigan, jonli, harakatchan, mimikasi ifodali odam. Asab tizimi kuchli, muvozanatli va harakatchan.", 'Активный, живо откликающийся на происходящее человек, стремящийся к смене впечатлений, сравнительно легко переживающий неудачи, подвижный, с выразительной мимикой. Нервная система сильная, уравновешенная и подвижная.'),
      p: L("Kirishimlilik, moslashuvchanlik, optimizm, yangi ishga tez kirishish.", 'Общительность, гибкость, оптимизм, быстрое включение в новое дело.'),
      a: L("Boshlagan ishni oxiriga yetkazish uchun ishni kichik bosqichlarga bo'ling va har birini belgilab boring; bir xil ishlarda tanaffus va o'zgarish qo'shing.", 'Чтобы доводить дела до конца, делите их на небольшие этапы и отмечайте выполненное; в монотонной работе добавляйте перерывы и разнообразие.') },
    F: { d: L("Bosiq, barqaror intilish va kayfiyatlarga, doimiy va chuqur his-tuyg'ularga ega, harakatlari va nutqi bir maromda, ichki holatini tashqariga kam chiqaradigan odam. Asab tizimi kuchli, muvozanatli, lekin sust (inert).", 'Спокойный человек с устойчивыми стремлениями и настроением, постоянными и глубокими чувствами, размеренными движениями и речью, мало проявляющий внешне своё состояние. Нервная система сильная, уравновешенная, но инертная.'),
      p: L("Puxtalik, sabr-toqat, ishonchlilik, xotirjamlik, boshlagan ishni oxiriga yetkazish.", 'Основательность, терпение, надёжность, спокойствие, доведение дел до конца.'),
      a: L("Tez o'zgaradigan vaziyatlarga oldindan tayyorlaning; yangi ishga kirishishdan oldin qisqa \"isinish\" vaqtini rejalashtiring; his-tuyg'ularingizni yaqinlaringizga so'z bilan ham bildiring.", 'Готовьтесь заранее к быстро меняющимся ситуациям; перед новым делом планируйте короткую «раскачку»; выражайте чувства близким и словами.') },
    M: { d: L("Ta'sirchan, chuqur kechinmali, tez charchaydigan, tanqid va tanbehga juda sezgir, harakatlari vazmin va ovozi past odam. Asab tizimi kuchsiz, lekin juda sezgir (yuqori sensitivlik).", 'Впечатлительный, глубоко переживающий, быстро устающий человек, очень чувствительный к критике, со сдержанными движениями и тихим голосом. Нервная система слабая, но очень чувствительная (высокая сензитивность).'),
      p: L("Sezgirlik, empatiya, chuqur tahlil, puxtalik, ijodkorlik.", 'Чуткость, эмпатия, глубокий анализ, тщательность, творческие способности.'),
      a: L("Dam olish va uyqu rejimiga e'tibor bering, yuklamani bosqichma-bosqich oshiring; muvaffaqiyatlaringizni yozib boring. Tushkunlik uzoq davom etsa, PHQ-9 testini topshirib, mutaxassis bilan maslahatlashing.", 'Следите за режимом отдыха и сна, повышайте нагрузку постепенно; записывайте свои успехи. При длительном унынии пройдите PHQ-9 и посоветуйтесь со специалистом.') }
  });
  const level = p => p >= 40 ? L('yetakchi (dominant)', 'доминирующий') : p >= 30 ? L('yaqqol ifodalangan', 'ярко выражен') : p >= 20 ? L("o'rtacha ifodalangan", 'умеренно выражен') : p >= 10 ? L('kuchsiz ifodalangan', 'слабо выражен') : L('deyarli namoyon bo\'lmaydi', 'почти не проявляется');

  TESTS.belov = {
    name: { uz: 'Temperament formulasi (A. Belov)', ru: 'Формула темперамента (А. Белов)' },
    desc: { uz: "80 ta xususiyatdan o'zingizga moslarini belgilang: to'rt temperament tipining sizdagi ulushi foizda — shaxsiy \"temperament formulangiz\" chiqadi.", ru: 'Отметьте подходящие вам из 80 характеристик: получите долю каждого из четырёх типов в процентах — свою «формулу темперамента».' },
    instr: { uz: '', ru: '' }, minutes: 10,
    items: { uz: ITEMS.map(x => x[0]), ru: ITEMS.map(x => x[1]) },
    options: { uz: ['Ha', "Yo'q"], ru: ['Да', 'Нет'] }, bands: [], reverse: [], source: 'A. A. Belov (1971)'
  };

  function viewBelov() {
    app.innerHTML = `
      <a href="#tests">← ${t('back')}</a>
      <h1>${esc(TESTS.belov.name[lang])}</h1>
      <p><strong>${t('instructionPrefix')}</strong> ${esc(L("Har bir odamda to'rtala temperament xususiyatlari aralash holda uchraydi, faqat ulushi har xil. Quyidagi 80 ta xususiyatni o'qing va har biri sizga xosmi-yo'qmi, belgilang. O'zingizni qanday bo'lishni xohlashingizni emas, odatda qanday ekanligingizni baholang. Uzoq o'ylamang.", 'У каждого человека черты всех четырёх темпераментов присутствуют в смешанном виде, различается лишь их доля. Прочитайте 80 характеристик и отметьте, свойственна ли вам каждая. Оценивайте, какой вы обычно, а не каким хотели бы быть. Не раздумывайте долго.'))}</p>
      <div class="progress"><div id="prog" style="width:0%"></div></div>
      <form id="bform">
        ${ITEMS.map((it, i) => `<div class="question bel-q" data-i="${i}"><p>${i + 1}. ${esc(lang === 'ru' ? it[1] : it[0])}</p>
          <div class="options bel-yn"><label><input type="radio" name="q${i}" value="1">${L('Ha', 'Да')}</label><label><input type="radio" name="q${i}" value="0">${L("Yo'q", 'Нет')}</label></div></div>`).join('')}
        <p id="berr" class="notice danger" hidden>${esc(t('answerAll'))}</p>
        <button class="btn" type="submit">${t('submit')}</button>
      </form>
      <p class="meta">${esc(L("Metodika: A. A. Belov \"Temperament formulasi\" (1971). Xususiyatlar ro'yxati o'zbek tilidagi o'quv materiali asosida PsixoLab tomonidan tuzatilgan va to'ldirilgan.", 'Методика: А. А. Белов «Формула темперамента» (1971). Список характеристик исправлен и дополнен PsixoLab на основе узбекского учебного материала.'))}</p>`;
    const form = $('bform'), t0 = Date.now();
    form.addEventListener('change', e => {
      const n = ITEMS.filter((_, i) => form.querySelector(`input[name=q${i}]:checked`)).length;
      $('prog').style.width = (n / ITEMS.length * 100) + '%';
      const q = e.target.closest('.question'); if (q) q.classList.remove('miss');
    });
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const ans = ITEMS.map((_, i) => { const c = form.querySelector(`input[name=q${i}]:checked`); return c ? +c.value : null; });
      const miss = ans.map((a, i) => a === null ? i : -1).filter(i => i >= 0);
      if (miss.length) { $('berr').hidden = false; miss.forEach(i => form.querySelector(`.question[data-i="${i}"]`).classList.add('miss')); form.querySelector(`.question[data-i="${miss[0]}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const c = { X: 0, S: 0, F: 0, M: 0 }; ITEMS.forEach((it, i) => { if (ans[i]) c[it[2]]++; });
      const tot = c.X + c.S + c.F + c.M;
      const p = {}; KEYS.forEach(k => p[k] = tot ? Math.round(c[k] / tot * 100) : 0);
      const sec = Math.round((Date.now() - t0) / 1000);
      const flags = []; if (tot < 12) flags.push('few'); if (tot > 68) flags.push('many'); if (sec < 90) flags.push('fast');
      saveResult({ type: 'test', id: 'belov', c, p, total: tot, valid: flags.length ? 0 : 1, flags: flags.join(','), time: sec });
      showBelov(c, p, tot, flags);
    });
  }

  function showBelov(c, p, tot, flags) {
    const N = NAMES(), D = DESC();
    const order = KEYS.slice().sort((a, b) => p[b] - p[a]);
    const top = order.filter(k => p[k] >= 30 || k === order[0]).slice(0, 2);
    const formula = 'T = ' + order.map(k => `${(p[k] / 100).toFixed(2).replace('.', ',')}${k === 'X' ? L('X', 'Х') : k === 'S' ? L('S', 'С') : k === 'F' ? L('F', 'Ф') : 'M'}`).join(' + ');
    const mixed = p[order[0]] - p[order[1]] <= 5;
    const warn = flags.length ? `<div class="notice warn">${flags.map(f => ({
      few: L(`Juda kam xususiyat belgilandi (${tot} ta) — natija ishonchsiz bo'lishi mumkin.`, `Отмечено слишком мало характеристик (${tot}) — результат может быть недостоверным.`),
      many: L(`Juda ko'p xususiyat belgilandi (${tot} ta) — ehtimol, hammasiga «ha» deyilgan.`, `Отмечено слишком много характеристик (${tot}) — возможно, на всё отвечено «да».`),
      fast: L("So'rovnoma juda tez to'ldirildi.", 'Опросник заполнен слишком быстро.')
    }[f])).join(' ')} ${L("Shoshilmasdan qayta topshirib ko'ring.", 'Попробуйте пройти ещё раз, не торопясь.')}</div>` : '';
    app.innerHTML = `
      <h1>${esc(TESTS.belov.name[lang])}</h1>
      ${warn}
      <div class="card">
        <p class="meta">${L('Sizning temperament formulangiz', 'Ваша формула темперамента')}:</p>
        <div class="bel-formula">${formula}</div>
        <div class="bel-bars">${order.map(k => `
          <div class="bel-row"><span class="bel-n">${esc(N[k])}</span>
            <div class="bel-bar"><i style="width:${Math.max(2, p[k])}%;background:${COL[k]}"></i></div>
            <b>${p[k]}%</b><em>${c[k]}/20 · ${esc(level(p[k]))}</em></div>`).join('')}</div>
        <p class="meta">${esc(L(`Jami ${tot} ta xususiyat belgilandi. Foiz — har tip bo'yicha "ha" javoblarining jami "ha"larga nisbati.`, `Всего отмечено ${tot} характеристик. Процент — доля «да» по каждому типу от общего числа «да».`))}</p>
      </div>
      <div class="conclusion">
        <h2>${L('Xulosa', 'Заключение')}</h2>
        <p>${mixed
          ? esc(L(`Sizda ${N[order[0]].toLowerCase()} va ${N[order[1]].toLowerCase()} xususiyatlari deyarli teng — temperamentingiz aralash tipda. Bu eng ko'p uchraydigan holat: sof temperament tiplari hayotda kam uchraydi.`, `У вас почти поровну черт типов «${N[order[0]].toLowerCase()}» и «${N[order[1]].toLowerCase()}» — смешанный темперамент. Это самый частый случай: чистые типы в жизни встречаются редко.`))
          : esc(L(`Sizda ${N[order[0]].toLowerCase()} temperamenti xususiyatlari ustunlik qiladi (${p[order[0]]}%), ammo boshqa tiplarning xususiyatlari ham mavjud — sof temperament tiplari hayotda kam uchraydi.`, `У вас преобладают черты типа «${N[order[0]].toLowerCase()}» (${p[order[0]]}%), но есть и черты других типов — чистые типы в жизни встречаются редко.`))}</p>
        ${top.map(k => `<div class="trait"><h3 style="color:${COL[k]}">${esc(N[k])} — ${p[k]}%</h3><p>${esc(D[k].d)}</p><p><strong>${L('Kuchli tomonlar', 'Сильные стороны')}:</strong> ${esc(D[k].p)}</p><p><strong>${L('Maslahat', 'Совет')}:</strong> ${esc(D[k].a)}</p></div>`).join('')}
        <p>${esc(L("Har bir temperamentning o'z ijobiy va salbiy tomonlari bor — \"yaxshi\" yoki \"yomon\" temperament yo'q. Temperament tug'ma bo'lsa-da, tarbiya, faoliyat va o'z-o'zini tarbiyalash orqali uning salbiy ko'rinishlarini boshqarish mumkin.", 'У каждого темперамента есть свои плюсы и минусы — «хорошего» или «плохого» темперамента нет. Хотя темперамент врождён, его отрицательные проявления можно контролировать через воспитание, деятельность и самовоспитание.'))}</p>
        <p>${esc(L("Natijani boshqa usul bilan solishtiring:", 'Сравните результат с другим методом:'))} <a href="#test/temper">${L('Temperament testi (Ayzenk modeli)', 'Тест темперамента (модель Айзенка)')}</a> · <a href="#exp/tapping">${L('Tepping-test (asab tizimi kuchi)', 'Теппинг-тест (сила нервной системы)')}</a></p>
        <p class="meta">${esc(L("Bu metodika o'zini kuzatish va ta'lim maqsadlari uchun mo'ljallangan, standartlashtirilgan normalarga ega emas. Natija hozirgi holatingiz va o'zingiz haqingizdagi tasavvuringizga ham bog'liq.", 'Методика предназначена для самонаблюдения и учебных целей и не имеет стандартизированных норм. Результат зависит и от текущего состояния и представлений о себе.'))}</p>
      </div>
      <div class="row-actions"><a class="btn" href="#test/belov" onclick="setTimeout(route,0)">${t('retake')}</a><button class="btn secondary" onclick="window.print()">${L('Chop etish / PDF', 'Печать / PDF')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
    window.scrollTo(0, 0);
  }

  const _desc = describe;
  describe = function (r) {
    if (r.type === 'test' && r.id === 'belov' && r.p) {
      const N = NAMES();
      return { name: TESTS.belov.name[lang], result: KEYS.map(k => `${N[k][0]}${r.p[k]}%`).join(' '), note: KEYS.slice().sort((a, b) => r.p[b] - r.p[a]).slice(0, 1).map(k => N[k]).join('') + (r.valid ? '' : ' · ' + L('ishonchliligi past', 'низкая достоверность')) };
    }
    return _desc(r);
  };

  const css = document.createElement('style');
  css.textContent = `
  .bel-yn label{min-width:90px;justify-content:center}
  .question.miss{outline:2px solid #FF6F91;outline-offset:4px;border-radius:12px}
  .bel-formula{font:800 clamp(1.3rem,3.5vw,2rem) var(--display);color:var(--accent);margin:.2rem 0 1rem;letter-spacing:.01em}
  .bel-bars{display:flex;flex-direction:column;gap:.7rem;margin-bottom:.8rem}
  .bel-row{display:grid;grid-template-columns:120px 1fr 52px 200px;gap:.8rem;align-items:center}
  .bel-n{font-weight:700;color:var(--text)}.bel-row b{font:800 1.1rem var(--display);color:var(--text)}.bel-row em{font-style:normal;font-size:.82rem;color:var(--muted)}
  .bel-bar{height:16px;border-radius:8px;background:#EEEAFB;overflow:hidden}.bel-bar i{display:block;height:100%;border-radius:8px}
  @media (max-width:640px){.bel-row{grid-template-columns:100px 1fr 46px}.bel-row em{grid-column:1/4;margin-top:-.4rem}}`;
  document.head.appendChild(css);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    _route();
    const [pg, arg] = (location.hash || '#home').slice(1).split('/');
    if (pg === 'test' && arg === 'belov') { viewBelov(); window.scrollTo(0, 0); }
  };
  window.addEventListener('hashchange', route);
  route();
})();
