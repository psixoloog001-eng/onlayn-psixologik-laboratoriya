'use strict';
/* PsixoLab — natijaga qarab xulosa / заключение по результату
   Har bir test yoki tajriba natijasi saqlangandan keyin "Xulosa" bloki chiqadi. */
(function () {

const L = (uz, ru) => (lang === 'ru' ? ru : uz);

/* ---------- Testlar ---------- */
const TEST_TEXT = () => ({
  phq9: [
    [L("Sizda depressiya belgilari deyarli yo'q. Kayfiyatingiz hozircha barqaror.",
       'Признаков депрессии практически нет. Ваше настроение сейчас стабильно.'),
     L("Uyqu, jismoniy faollik va yaqinlar bilan muloqot kabi sog'lom odatlarni davom ettiring.",
       'Продолжайте поддерживать здоровые привычки: сон, физическую активность, общение с близкими.')],
    [L("Sizda yengil depressiya belgilari bor. Bu charchoq, stress yoki hayotdagi qiyinchiliklar bilan bog'liq bo'lishi mumkin.",
       'У вас лёгкие признаки депрессии. Это может быть связано с усталостью, стрессом или жизненными трудностями.'),
     L("Kun tartibi, uyqu va jismoniy faollikka e'tibor bering, yoqtirgan ishlaringizga vaqt ajrating. 2–4 haftadan keyin testni qayta topshiring. Belgilar saqlansa yoki kuchaysa, mutaxassis bilan maslahatlashing.",
       'Обратите внимание на режим дня, сон и физическую активность, уделяйте время любимым занятиям. Пройдите тест повторно через 2–4 недели. Если симптомы сохранятся или усилятся, обратитесь к специалисту.')],
    [L("Sizda o'rtacha darajadagi depressiya belgilari bor. Ular kundalik hayotingiz va ish qobiliyatingizga ta'sir qilayotgan bo'lishi mumkin.",
       'У вас умеренные признаки депрессии. Они могут влиять на повседневную жизнь и работоспособность.'),
     L("Psixolog yoki shifokor bilan maslahatlashish tavsiya etiladi. O'z vaqtida yordam olish holatni sezilarli yaxshilaydi.",
       'Рекомендуется консультация психолога или врача. Своевременная помощь заметно улучшает состояние.')],
    [L("Sizda o'rtachadan og'irroq depressiya belgilari bor. Bu jiddiy holat, uni yolg'iz yengishga urinmang.",
       'У вас умеренно тяжёлые признаки депрессии. Это серьёзное состояние, не пытайтесь справиться с ним в одиночку.'),
     L("Yaqin kunlarda psixolog, psixoterapevt yoki shifokorga murojaat qilishingizni qat'iy tavsiya qilamiz.",
       'Настоятельно рекомендуем в ближайшие дни обратиться к психологу, психотерапевту или врачу.')],
    [L("Sizda og'ir darajadagi depressiya belgilari bor.",
       'У вас признаки тяжёлой депрессии.'),
     L("Iloji boricha tezroq mutaxassisga (psixiatr, psixoterapevt yoki shifokorga) murojaat qiling. Ishongan yaqin odamingizga ham ahvolingiz haqida ayting.",
       'Как можно скорее обратитесь к специалисту (психиатру, психотерапевту или врачу). Расскажите о своём состоянии близкому человеку, которому доверяете.')]
  ],
  gad7: [
    [L("Xavotir darajangiz past. Kundalik tashvishlaringiz me'yor doirasida.",
       'Уровень тревоги низкий. Повседневные волнения в пределах нормы.')],
    [L("Sizda yengil xavotir bor. Bu stressli davrlarda ko'pchilikda uchraydi.",
       'У вас лёгкая тревога. Это часто бывает в стрессовые периоды.'),
     L("Nafas mashqlari, muntazam jismoniy faollik, uyqu tartibi va kofeinni kamaytirish yordam beradi. Xavotir uzoq davom etsa, mutaxassis bilan gaplashing.",
       'Помогают дыхательные упражнения, регулярная физическая активность, режим сна и меньше кофеина. Если тревога длится долго, поговорите со специалистом.')],
    [L("Sizda o'rtacha darajadagi xavotir bor. U kundalik faoliyatingizga xalaqit berayotgan bo'lishi mumkin.",
       'У вас умеренная тревога. Она может мешать повседневной деятельности.'),
     L("Psixolog bilan maslahatlashish tavsiya etiladi. Kognitiv-xulq terapiyasi kabi usullar xavotirni kamaytirishda samarali.",
       'Рекомендуется консультация психолога. Методы вроде когнитивно-поведенческой терапии эффективно снижают тревогу.')],
    [L("Sizda kuchli xavotir belgilari bor.",
       'У вас признаки выраженной тревоги.'),
     L("Mutaxassisga (psixolog, psixoterapevt yoki shifokorga) murojaat qilishingizni qat'iy tavsiya qilamiz.",
       'Настоятельно рекомендуем обратиться к специалисту (психологу, психотерапевту или врачу).')]
  ],
  pss10: [
    [L("Stress darajangiz past. Siz hayotiy vaziyatlarni yaxshi boshqarayapsiz.",
       'Уровень стресса низкий. Вы хорошо справляетесь с жизненными ситуациями.')],
    [L("Stress darajangiz o'rtacha, bu ko'pchilik odamlarga xos.",
       'Уровень стресса умеренный, как у большинства людей.'),
     L("Dam olish, uyqu, jismoniy faollik va yaqinlar bilan muloqotga vaqt ajrating. Ishlarni rejalashtirish va muhimini birinchi bajarish yuklamani kamaytiradi.",
       'Уделяйте время отдыху, сну, физической активности и общению с близкими. Планирование дел и расстановка приоритетов снижают нагрузку.')],
    [L("Stress darajangiz yuqori. Uzoq davom etgan stress sog'liq va kayfiyatga salbiy ta'sir qiladi.",
       'Уровень стресса высокий. Длительный стресс негативно влияет на здоровье и настроение.'),
     L("Yuklamani kamaytirish, dam olish va stressni boshqarish usullarini o'rganish muhim. Holatni yolg'iz yengish qiyin bo'lsa, psixolog bilan maslahatlashing.",
       'Важно снизить нагрузку, отдыхать и освоить способы управления стрессом. Если справиться самостоятельно трудно, обратитесь к психологу.')]
  ],
  rosenberg: [
    [L("O'z-o'zingizni baholashingiz past. Siz o'zingizga nisbatan tanqidiy bo'lishingiz va yutuqlaringizni kam qadrlashingiz mumkin.",
       'Ваша самооценка низкая. Возможно, вы слишком критичны к себе и недооцениваете свои достижения.'),
     L("Kichik yutuqlaringizni yozib boring va o'zingiz bilan do'stingizga gapirgandek mehr bilan gaplashing. Bu holat uzoq davom etsa yoki kayfiyatga ta'sir qilsa, psixolog bilan ishlash yordam beradi.",
       'Записывайте даже небольшие успехи и говорите с собой так же бережно, как с другом. Если это состояние длится долго или влияет на настроение, поможет работа с психологом.')],
    [L("O'z-o'zingizni baholashingiz me'yoriy. Siz o'zingizni realistik baholaysiz: kuchli tomonlaringizni ko'rasiz va kamchiliklaringizni ham tan olasiz.",
       'Ваша самооценка в норме. Вы оцениваете себя реалистично: видите сильные стороны и признаёте недостатки.')],
    [L("O'z-o'zingizni baholashingiz yuqori. Siz o'zingizga ishonasiz va o'zingizni qadrlaysiz.",
       'Ваша самооценка высокая. Вы уверены в себе и цените себя.'),
     L("Bu ishonch boshqalarning fikrini tinglash va xatolarni tan olish bilan uyg'un bo'lsa, eng yaxshi natija beradi.",
       'Лучше всего, когда эта уверенность сочетается с умением слушать других и признавать ошибки.')]
  ]
});

const TRAIT_TEXT = () => ({
  E: [L("Siz ko'proq introvertsiz: tor davrada yoki yolg'iz o'zingizni qulay his qilasiz, gapirishdan oldin o'ylaysiz.", 'Вы скорее интроверт: комфортнее чувствуете себя в узком кругу или наедине, сначала думаете, потом говорите.'),
      L("Siz ambivertsiz: vaziyatga qarab ham muloqotga, ham yolg'izlikka moslasha olasiz.", 'Вы амбиверт: в зависимости от ситуации легко общаетесь или наслаждаетесь уединением.'),
      L("Siz ekstravertsiz: odamlar orasida quvvat olasiz, muloqotga ochiq va faolsiz.", 'Вы экстраверт: заряжаетесь энергией от людей, открыты к общению и активны.')],
  A: [L("Siz to'g'ridan-to'g'ri va mustaqil fikrlaysiz, o'z manfaatingizni himoya qila olasiz. Ba'zan boshqalarning his-tuyg'ulariga ko'proq e'tibor berish foydali bo'lishi mumkin.", 'Вы прямолинейны и независимы, умеете отстаивать свои интересы. Иногда полезно больше учитывать чувства других.'),
      L("Siz hamdardlik va o'z fikringizni himoya qilish o'rtasida muvozanat saqlaysiz.", 'Вы сохраняете баланс между сочувствием и отстаиванием своего мнения.'),
      L("Siz mehribon va hamdardsiz, boshqalar bilan hamkorlik qilishni yoqtirasiz.", 'Вы добры и отзывчивы, любите сотрудничать с другими.')],
  C: [L("Siz erkin va moslashuvchansiz, lekin tartib va rejalashtirishda qiyinchilik bo'lishi mumkin. Ro'yxatlar va eslatmalar yordam beradi.", 'Вы свободны и гибки, но вам может быть трудно с порядком и планированием. Помогут списки и напоминания.'),
      L("Siz kerak bo'lganda tartibli bo'la olasiz, lekin qat'iy reja bilan cheklanib qolmaysiz.", 'Вы умеете быть организованным, когда нужно, но не зацикливаетесь на жёстких планах.'),
      L("Siz tartibli, intizomli va mas'uliyatlisiz, boshlagan ishingizni oxiriga yetkazasiz.", 'Вы организованны, дисциплинированны и ответственны, доводите начатое до конца.')],
  N: [L("Siz emotsional jihatdan barqarorsiz: stressli vaziyatlarda ham xotirjam qolasiz.", 'Вы эмоционально устойчивы и сохраняете спокойствие даже в стрессовых ситуациях.'),
      L("Hissiy barqarorligingiz o'rtacha: odatda xotirjamsiz, lekin stress paytida asabiylashishingiz mumkin.", 'Ваша эмоциональная устойчивость средняя: обычно вы спокойны, но в стрессе можете нервничать.'),
      L("Siz hissiyotlarni kuchli his qilasiz, kayfiyatingiz tez o'zgarishi va xavotirga moyilligingiz bo'lishi mumkin. Stressni boshqarish usullari (nafas mashqlari, jismoniy faollik, dam olish) foydali.", 'Вы сильно переживаете эмоции, возможны перепады настроения и склонность к тревоге. Полезны способы управления стрессом: дыхание, физическая активность, отдых.')],
  I: [L("Siz amaliy va aniq narsalarni afzal ko'rasiz, mavhum nazariyalardan ko'ra real tajribaga tayanasiz.", 'Вы предпочитаете практичное и конкретное, больше опираетесь на опыт, чем на абстрактные теории.'),
      L("Siz yangi g'oyalarga ochiqsiz, lekin amaliylikni ham unutmaysiz.", 'Вы открыты новым идеям, но не забываете о практичности.'),
      L("Tasavvuringiz boy, yangi g'oyalar va mavhum fikrlashni yoqtirasiz.", 'У вас богатое воображение, вы любите новые идеи и абстрактное мышление.')]
});

/* ---------- Xulosa matnini tuzish ---------- */
function conclude(r) {
  if (r.type === 'test') {
    if (r.id === 'ipip' && r.profile) {
      const lvl = v => (v <= 9 ? 0 : v <= 14 ? 1 : 2);
      const TT = TRAIT_TEXT();
      return Object.entries(r.profile).map(([k, v]) => TT[k] ? TT[k][lvl(v)] : '')
        .filter(Boolean)
        .concat(L("Esda tuting: shaxs xususiyatlarining yaxshi yoki yomon darajasi yo'q. Har birining o'z afzalliklari bor.",
                  'Помните: у черт личности нет хорошего или плохого уровня. У каждой есть свои преимущества.'));
    }
    const set = TEST_TEXT()[r.id];
    if (!set || set[r.band] === undefined) return [];
    const out = set[r.band].slice();
    if (r.crisis) out.unshift(L("Eng muhimi: siz o'zingizga zarar yetkazish yoki o'lim haqidagi fikrlarni belgiladingiz. Iltimos, bugunoq yaqin odamingiz yoki mutaxassis bilan gaplashing.",
                               'Самое важное: вы отметили мысли о смерти или самоповреждении. Пожалуйста, сегодня же поговорите с близким человеком или специалистом.'));
    return out;
  }
  const v = r.value;
  switch (r.id) {
    case 'rt': return [
      v < 270 ? L('Reaksiya tezligingiz yuqori: signalga juda tez javob berasiz.', 'У вас высокая скорость реакции: вы очень быстро отвечаете на сигнал.')
      : v <= 400 ? L("Reaksiya tezligingiz me'yor doirasida.", 'Скорость реакции в пределах нормы.')
      : L("Reaksiya tezligingiz o'rtachadan sekinroq. Bu charchoq, uyqusizlik yoki chalg'ish bilan bog'liq bo'lishi mumkin. Dam olib, qayta urinib ko'ring.", 'Скорость реакции ниже средней. Это может быть связано с усталостью, недосыпом или отвлечением. Отдохните и попробуйте ещё раз.'),
      L("Onlayn o'lchovda qurilma (sichqoncha, ekran) kechikishi ham natijaga biroz ta'sir qiladi.", 'При онлайн-измерении на результат немного влияет задержка устройства (мышь, экран).')
    ];
    case 'stroop': return [
      v <= 50 ? L("Diqqatni boshqarish qobiliyatingiz yaxshi: chalg'ituvchi ma'lumot sizga deyarli ta'sir qilmadi.", 'Хороший контроль внимания: отвлекающая информация почти не повлияла на вас.')
      : v <= 150 ? L("Stroop effekti me'yor doirasida, bu ko'pchilik odamlarga xos.", 'Эффект Струпа в пределах нормы, как у большинства людей.')
      : L("Chalg'ituvchi ma'lumot sizga sezilarli ta'sir qildi. Bu charchoq yoki shoshilish bilan bog'liq bo'lishi mumkin. Diqqatni jamlash mashqlari (masalan, Shulte jadvallari) foydali.", 'Отвлекающая информация заметно повлияла на вас. Возможно, сказались усталость или спешка. Полезны упражнения на концентрацию (например, таблицы Шульте).'),
      ...(r.acc < 80 ? [L("Xatolar ko'p bo'ldi: tezlikdan ko'ra aniqlikka ko'proq e'tibor bering.", 'Было много ошибок: уделяйте больше внимания точности, а не скорости.')] : [])
    ];
    case 'span': return [
      v <= 4 ? L("Qisqa muddatli xotira hajmingiz o'rtachadan past. Charchoq yoki chalg'ish ta'sir qilgan bo'lishi mumkin, dam olib qayta urinib ko'ring. Raqamlarni guruhlab eslash (masalan, 3+3) yordam beradi.", 'Объём кратковременной памяти ниже среднего. Возможно, повлияли усталость или отвлечение, отдохните и попробуйте снова. Помогает запоминание группами (например, 3+3).')
      : v <= 8 ? L("Qisqa muddatli xotira hajmingiz me'yor doirasida (ko'pchilik kattalarda 5–9 ta raqam).", 'Объём кратковременной памяти в норме (у большинства взрослых 5–9 цифр).')
      : L('Qisqa muddatli xotira hajmingiz yuqori, bu juda yaxshi natija.', 'Объём кратковременной памяти высокий, это отличный результат.')
    ];
    case 'corsi': return [
      v <= 4 ? L("Ko'rish-fazoviy xotirangiz o'rtachadan past. Natija diqqat va charchoqqa ham bog'liq, dam olib qayta urinib ko'ring.", 'Зрительно-пространственная память ниже средней. Результат зависит и от внимания и усталости, отдохните и попробуйте снова.')
      : v <= 7 ? L("Ko'rish-fazoviy xotirangiz me'yor doirasida.", 'Зрительно-пространственная память в пределах нормы.')
      : L("Ko'rish-fazoviy xotirangiz yuqori.", 'Зрительно-пространственная память высокая.')
    ];
    case 'gonogo': return [
      v <= 1 ? L("O'zini tiyish qobiliyatingiz yaxshi: kerakli paytda harakatni to'xtata olasiz.", 'Хороший самоконтроль: вы умеете вовремя остановить действие.')
      : v <= 4 ? L("O'zini tiyish qobiliyatingiz o'rtacha: ba'zan shoshilib harakat qilasiz.", 'Самоконтроль средний: иногда вы действуете поспешно.')
      : L("Impulsiv xatolar ko'p bo'ldi: siz tez harakat qilishga moyilsiz va to'xtash qiyin bo'ldi. \"Avval o'yla, keyin harakat qil\" tamoyili foydali.", 'Много импульсивных ошибок: вы склонны действовать быстро, и остановиться было трудно. Полезен принцип «сначала подумай, потом действуй».'),
      ...(r.miss > 3 ? [L("Bir nechta yashil signalni o'tkazib yubordingiz. Bu diqqat pasayishi yoki charchoq belgisi bo'lishi mumkin.", 'Вы пропустили несколько зелёных сигналов. Это может говорить о снижении внимания или усталости.')] : [])
    ];
    case 'schulte': return [
      r.ball >= 4 ? L('Ish samaradorligingiz yuqori: diqqatingiz tez va barqaror ishlaydi.', 'Высокая эффективность работы: ваше внимание работает быстро и устойчиво.')
      : r.ball === 3 ? L("Ish samaradorligingiz o'rtacha.", 'Эффективность работы средняя.')
      : L("Ish samaradorligingiz yoshingiz me'yoridan past. Bu charchoq yoki diqqatning tarqoqligi bilan bog'liq bo'lishi mumkin. Shulte jadvallari bilan muntazam mashq qilish diqqatni rivojlantiradi.", 'Эффективность работы ниже возрастной нормы. Возможно, сказываются усталость или рассеянность внимания. Регулярные тренировки с таблицами Шульте развивают внимание.'),
      r.id1 < 1 ? L('Ishga tez kirishasiz.', 'Вы быстро включаетесь в работу.')
      : L('Ishga kirishish uchun vaqt kerak bo\'ldi: birinchi jadval sekinroq bajarildi.', 'Вам потребовалось время на врабатывание: первая таблица выполнена медленнее.'),
      r.pb < 1 ? L('Uzoq ishlaganda ham diqqatingiz barqaror qoladi.', 'Даже при длительной работе внимание остаётся устойчивым.')
      : L("To'rtinchi jadvalda sekinlashish kuzatildi. Bu tez charchashga moyillikni bildiradi, ish orasida qisqa tanaffuslar qiling.", 'На четвёртой таблице заметно замедление. Это говорит о склонности к утомлению, делайте короткие перерывы в работе.')
    ];
  }
  return [];
}

/* ---------- Ko'rsatish ---------- */
const style = document.createElement('style');
style.textContent = `.conclusion{background:#eef7ee;border:1px solid #8cc99a;border-radius:var(--radius);padding:1rem 1.25rem;margin:1rem 0;text-align:left;width:100%}
.conclusion h2{margin:0 0 .5rem;font-size:1.15rem}.conclusion p{margin:.35rem 0}`;
document.head.appendChild(style);

function showConclusion(r) {
  const paras = conclude(r);
  if (!paras.length) return;
  document.querySelectorAll('#app .notice.warn').forEach(n => { if (n.textContent === t('seeSpecialist')) n.remove(); });
  const box = document.createElement('div');
  box.className = 'conclusion';
  box.innerHTML = `<h2>${L('Xulosa', 'Заключение')}</h2>` + paras.map(p => `<p>${esc(p)}</p>`).join('');
  const rows = document.querySelectorAll('#app .row-actions');
  const anchor = rows[rows.length - 1];
  if (anchor) anchor.parentNode.insertBefore(box, anchor); else app.appendChild(box);
}

const _oldSave = saveResult;
saveResult = function (r) {
  _oldSave(r);
  setTimeout(() => showConclusion(r), 0);
};

})();
