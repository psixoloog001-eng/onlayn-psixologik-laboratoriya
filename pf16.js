/* PsixoLab — 16 omilli shaxs so'rovnomasi (IPIP-16PF)
   Savollar: International Personality Item Pool — "16 Preliminary IPIP Scales Measuring Constructs Similar to Those in Cattell's 16PF"
   (ipip.ori.org/new16PFKey.htm), ochiq foydalanishdagi (public domain) material; o'zbek va rus tillariga PsixoLab tarjimasi.
   Bu Kettelning asl 16PF so'rovnomasi emas — o'sha 16 omilni o'lchaydigan ochiq analog. */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const $ = id => document.getElementById(id);
  const PER_PAGE = 20, KEY = 'psixolab-pf16-progress';

  // [uz, ru, kalit(+1/-1)] — shkala bo'yicha
  const S = {
    A: [
      ["Boshqalarga qanday tasalli berishni bilaman.", 'Я умею утешить других.', 1],
      ["Odamlarni bir joyga to'plashni yoqtiraman.", 'Мне нравится собирать людей вместе.', 1],
      ["Boshqalarning his-tuyg'ularini sezaman.", 'Я чувствую эмоции других людей.', 1],
      ["Boshqa odamlarning hayotiga qiziqaman.", 'Я интересуюсь жизнью других людей.', 1],
      ["Odamlarning kayfiyatini ko'tara olaman.", 'Я умею поднять людям настроение.', 1],
      ["Odamlar men bilan o'zini erkin his qiladi.", 'Рядом со мной людям спокойно и легко.', 1],
      ["Boshqalar uchun vaqt ajrataman.", 'Я нахожу время для других.', 1],
      ["Boshqalarning muammolariga aralashishni yoqtirmayman.", 'Я не люблю вникать в чужие проблемы.', -1],
      ["Boshqa odamlar menga unchalik qiziq emas.", 'Другие люди мне не особенно интересны.', -1],
      ["Muhtojlar haqida o'ylamaslikka harakat qilaman.", 'Я стараюсь не думать о нуждающихся.', -1]
    ],
    B: [
      ["Chuqur mulohazali fikrlar bildiraman.", 'Я делаю глубокие, проницательные замечания.', 1],
      ["Ko'p savollarga javob bilaman.", 'Я знаю ответы на многие вопросы.', 1],
      ["Narsalarni tahlil qilishga moyilman.", 'Я склонен(на) всё анализировать.', 1],
      ["Aqlimni ishlataman, o'ylab ish qilaman.", 'Я привык(ла) думать головой.', 1],
      ["Tez o'rganaman.", 'Я быстро учусь.', 1],
      ["Boshqalarning dalillariga qarshi dalil topa olaman.", 'Я умею находить контраргументы.', 1],
      ["Harakat qilishdan oldin yaxshilab o'ylab ko'raman.", 'Прежде чем действовать, я всё обдумываю.', 1],
      ["Qaror qilishdan oldin yaxshi va yomon tomonlarini o'lchab ko'raman.", 'Я взвешиваю все «за» и «против».', 1],
      ["O'zimni oddiy, o'rtacha odam deb hisoblayman.", 'Я считаю себя самым обычным, средним человеком.', -1],
      ["Tez chalkashib qolaman.", 'Я легко запутываюсь.', -1],
      ["O'zimning alohida odam emasligimni bilaman.", 'Я знаю, что я не какой-то особенный человек.', -1],
      ["So'z boyligim kam.", 'У меня бедный словарный запас.', -1],
      ["O'qiyotganda qiyin so'zlarni tashlab ketaman.", 'При чтении я пропускаю трудные слова.', -1]
    ],
    C: [
      ["Kamdan-kam hollarda ko'nglim cho'kadi.", 'Мне редко бывает тоскливо.', 1],
      ["O'zim bilan o'zimni yaxshi his qilaman.", 'Мне комфортно быть собой.', 1],
      ["Muvaffaqiyatsizliklarni osonlik bilan yengaman.", 'Я легко справляюсь с неудачами.', 1],
      ["Ko'p vaqt xotirjam bo'laman.", 'Большую часть времени я спокоен(на).', 1],
      ["Meni osonlikcha asabiylashtirib bo'lmaydi.", 'Меня нелегко вывести из себя.', 1],
      ["Kayfiyatim tez-tez o'zgarib turadi.", 'У меня часто меняется настроение.', -1],
      ["Ko'pincha ko'nglim cho'kkan bo'ladi.", 'Мне часто бывает тоскливо.', -1],
      ["O'zimni yoqtirmayman.", 'Я себе не нравлюсь.', -1],
      ["O'zimni umidsiz his qilaman.", 'Я испытываю отчаяние.', -1],
      ["Tez ruhim tushib qoladi.", 'Я легко падаю духом.', -1]
    ],
    E: [
      ["Mas'uliyatni o'z zimmamga olaman.", 'Я беру руководство на себя.', 1],
      ["Boshqaruvchi bo'lishni xohlayman.", 'Я хочу быть главным(ой).', 1],
      ["O'ylaganimni aytaman.", 'Я говорю то, что думаю.', 1],
      ["Tanqid qilishdan qo'rqmayman.", 'Я не боюсь критиковать.', 1],
      ["Vaziyatni nazoratga olaman.", 'Я беру ситуацию под контроль.', 1],
      ["Kerak bo'lsa, qat'iy choralar ko'ra olaman.", 'Я способен(на) на решительные меры.', 1],
      ["Boshqalar yo'l ko'rsatishini kutaman.", 'Я жду, пока другие поведут за собой.', -1],
      ["Hech qachon biror narsaga e'tiroz bildirmayman.", 'Я никогда ничего не оспариваю.', -1],
      ["Qarorlarni boshqalar qabul qilishiga yo'l qo'yaman.", 'Я позволяю другим принимать решения.', -1],
      ["Boshqalar meni o'z xohishicha boshqarishiga yo'l qo'yaman.", 'Я позволяю другим помыкать мной.', -1]
    ],
    F: [
      ["Davraning joni menman.", 'Я — душа компании.', 1],
      ["Katta bazmlarni yaxshi ko'raman.", 'Я обожаю большие праздники и вечеринки.', 1],
      ["Ko'p hazil qilaman.", 'Я много шучу.', 1],
      ["Shovqinli olomon ichida bo'lishni yoqtiraman.", 'Мне нравится быть в шумной толпе.', 1],
      ["Do'stlarimni kuldiraman.", 'Я смешу своих друзей.', 1],
      ["Ba'zan o'zimni juda erkin, \"telbanamo\" tutaman.", 'Иногда я веду себя безудержно и сумасбродно.', 1],
      ["Kamdan-kam hazil qilaman.", 'Я редко шучу.', -1],
      ["Odam gavjum tadbirlarni yoqtirmayman.", 'Я не люблю многолюдные мероприятия.', -1],
      ["Hazilga hammadan keyin kulaman.", 'Я последним(ей) смеюсь над шуткой.', -1],
      ["Baland ovozli musiqani yoqtirmayman.", 'Я не люблю громкую музыку.', -1]
    ],
    G: [
      ["Qonunlar qat'iy bajarilishi kerak, deb hisoblayman.", 'Я считаю, что законы должны строго соблюдаться.', 1],
      ["Qoidalarga amal qilishga harakat qilaman.", 'Я стараюсь следовать правилам.', 1],
      ["Yagona haqiqiy din borligiga ishonaman.", 'Я верю, что есть одна истинная религия.', 1],
      ["Hokimiyat va rahbariyatni hurmat qilaman.", 'Я уважаю власть и авторитеты.', 1],
      ["Davlat madhiyasi yangraganda o'rnimdan turishni yoqtiraman.", 'Мне нравится вставать во время исполнения государственного гимна.', 1],
      ["Rahbariyat ko'rsatmalariga qarshilik qilaman.", 'Я сопротивляюсь указаниям начальства.', -1],
      ["Qoidalarni buzaman.", 'Я нарушаю правила.', -1],
      ["So'kinish so'zlarini ishlataman.", 'Я употребляю бранные слова.', -1],
      ["Hokimiyatga qarshi chiqaman.", 'Я выступаю против власти.', -1],
      ["Qoidalarni qanday chetlab o'tishni bilaman.", 'Я знаю, как обходить правила.', -1]
    ],
    H: [
      ["Odamlar orasida o'zimni erkin his qilaman.", 'Мне комфортно среди людей.', 1],
      ["Yig'inlarda ko'plab turli odamlar bilan gaplashaman.", 'На вечеринках я общаюсь с множеством разных людей.', 1],
      ["Diqqat markazida bo'lishga qarshi emasman.", 'Я не против быть в центре внимания.', 1],
      ["Osonlikcha do'st orttiraman.", 'Я легко завожу друзей.', 1],
      ["Suhbatni o'zim boshlayman.", 'Я сам(а) начинаю разговор.', 1],
      ["Odamlarga yaqinlashish menga qiyin.", 'Мне трудно подойти к людям.', -1],
      ["Ko'pincha odamlar orasida o'zimni noqulay his qilaman.", 'Мне часто неловко в обществе других людей.', -1],
      ["Gapiradigan gapim kam bo'ladi.", 'Мне обычно почти нечего сказать.', -1],
      ["Notanishlar orasida jim bo'lib qolaman.", 'С незнакомыми людьми я молчалив(а).', -1],
      ["Ko'pincha chetda, ko'zga tashlanmay turaman.", 'Я держусь в тени.', -1]
    ],
    I: [
      ["O'qishni yaxshi ko'raman.", 'Я люблю читать.', 1],
      ["Kino va kitoblarni boshqalar bilan muhokama qilishni yoqtiraman.", 'Мне нравится обсуждать с другими фильмы и книги.', 1],
      ["Ko'p o'qiyman.", 'Я много читаю.', 1],
      ["Jangari (ekshn) filmlarni yoqtirmayman.", 'Я не люблю боевики.', 1],
      ["Kino ko'rayotib yig'lab yuboraman.", 'Я плачу во время фильмов.', 1],
      ["Gullarni yaxshi ko'raman.", 'Я люблю цветы.', 1],
      ["Raqs chiqishlarini tomosha qilish menga yoqmaydi.", 'Мне не нравится смотреть танцевальные выступления.', -1],
      ["She'riyatni yoqtirmayman.", 'Я не люблю поэзию.', -1],
      ["Badiiy adabiyotni yoqtirmayman.", 'Я не люблю художественную литературу.', -1],
      ["O'z hissiy reaksiyalarimni kamdan-kam payqayman.", 'Я редко замечаю свои эмоциональные реакции.', -1]
    ],
    L: [
      ["Boshqalarni kechirish menga qiyin.", 'Мне трудно прощать других.', 1],
      ["Boshqalarning xatti-harakatida yashirin niyat bor deb shubha qilaman.", 'Я подозреваю у других скрытые мотивы.', 1],
      ["Odamlarga ehtiyotkorlik bilan munosabatda bo'laman.", 'Я насторожен(а) с людьми.', 1],
      ["Odamlarga ishonmayman.", 'Я не доверяю людям.', 1],
      ["Odamlar kamdan-kam hollarda butun haqiqatni aytadi, deb hisoblayman.", 'Я считаю, что люди редко говорят всю правду.', 1],
      ["Odamlar aslida yomon, deb hisoblayman.", 'Я считаю, что люди по своей сути злы.', 1],
      ["Odamlarning gapiga ishonaman.", 'Я верю тому, что говорят люди.', -1],
      ["Boshqalarga ishonaman.", 'Я доверяю другим.', -1],
      ["Boshqalarning niyati yaxshi, deb hisoblayman.", 'Я считаю, что у других добрые намерения.', -1],
      ["Odamlar asosan axloqli, deb hisoblayman.", 'Я считаю, что люди в основном нравственны.', -1]
    ],
    M: [
      ["Boshqalarga g'alati tuyuladigan ishlarni qilaman.", 'Я делаю то, что другим кажется странным.', 1],
      ["Fikrlarga g'arq bo'lib ketishni yoqtiraman.", 'Мне нравится погружаться в свои мысли.', 1],
      ["Xayol olamida erkin parvoz qilishni yoqtiraman.", 'Я люблю безудержно фантазировать.', 1],
      ["Xayol surishni yaxshi ko'raman.", 'Я обожаю мечтать.', 1],
      ["Oqimga qarshi suzaman.", 'Я плыву против течения.', 1],
      ["Ko'pchilikdan farq qiladigan pozitsiyani egallayman.", 'Я занимаю позицию, отличную от общепринятой.', 1],
      ["Kutilmagan ishlarni qilaman.", 'Я совершаю неожиданные поступки.', 1],
      ["Hamma narsani qo'llanmaga qarab qilaman.", 'Я всё делаю строго по инструкции.', -1],
      ["Kamdan-kam xayol suraman.", 'Я редко мечтаю.', -1],
      ["Kamdan-kam fikrlarga berilib ketaman.", 'Я редко ухожу в свои мысли.', -1]
    ],
    N: [
      ["O'zim haqimda kam narsa aytaman.", 'Я мало рассказываю о себе.', 1],
      ["Meni yaqindan bilish qiyin.", 'Меня трудно узнать по-настоящему.', 1],
      ["Ko'p gapirmayman.", 'Я немногословен(на).', 1],
      ["His-tuyg'ularimni ichimga yutaman.", 'Я держу чувства в себе.', 1],
      ["Fikrlarimni o'zimda saqlayman.", 'Я держу свои мысли при себе.', 1],
      ["Boshqalarga o'zim haqimda ochiq gapiraman.", 'Я открыт(а) с другими в том, что касается меня.', -1],
      ["His-tuyg'ularim haqida ochiq gapiraman.", 'Я открыто говорю о своих чувствах.', -1],
      ["Eng ichki fikrlarimni ham boshqalarga ochaman.", 'Я делюсь своими сокровенными мыслями.', -1],
      ["His-tuyg'ularimni ko'rsataman.", 'Я показываю свои чувства.', -1],
      ["O'zim haqimda gapirishga tayyorman.", 'Я охотно рассказываю о себе.', -1]
    ],
    O: [
      ["Noto'g'ri ish qilib qo'yishdan qo'rqaman.", 'Я боюсь сделать что-то не так.', 1],
      ["O'zimni osonlikcha xavf ostida his qilaman.", 'Я легко ощущаю угрозу.', 1],
      ["Meni osongina ranjitish mumkin.", 'Меня легко обидеть.', 1],
      ["Ko'p narsalar haqida xavotirlanaman.", 'Я много о чём беспокоюсь.', 1],
      ["O'tmishdagi xatolarim haqida ko'p o'ylayman.", 'Я подолгу думаю о прошлых ошибках.', 1],
      ["\"Yo'q\" deganimda o'zimni aybdor his qilaman.", 'Я чувствую вину, когда говорю «нет».', 1],
      ["Muvaffaqiyatsizliklar meni butunlay ezib qo'yadi.", 'Неудачи меня просто раздавливают.', 1],
      ["Bo'lib o'tgan narsalar haqida qayg'urmayman.", 'Я не переживаю о том, что уже случилось.', -1],
      ["Meni narsalar osonlikcha bezovta qilmaydi.", 'Меня нелегко чем-то обеспокоить.', -1],
      ["Boshqalarning ruhimni tushirishiga yo'l qo'ymayman.", 'Я не позволяю другим лишать меня уверенности.', -1]
    ],
    Q1: [
      ["San'atning ahamiyatiga ishonaman.", 'Я верю в важность искусства.', 1],
      ["Ishni bajarishning yangi usullarini o'ylab topishni yaxshi ko'raman.", 'Я люблю придумывать новые способы что-то делать.', 1],
      ["Yangi g'oyalarni eshitishni yoqtiraman.", 'Мне нравится слышать новые идеи.', 1],
      ["Suhbatni yuqoriroq darajaga olib chiqaman.", 'Я поднимаю разговор на более высокий уровень.', 1],
      ["Bir xillikdan ko'ra xilma-xillikni afzal ko'raman.", 'Я предпочитаю разнообразие рутине.', 1],
      ["Falsafiy suhbatlardan qochaman.", 'Я избегаю философских разговоров.', -1],
      ["Narsalarning chuqur ma'nosini kamdan-kam izlayman.", 'Я редко ищу в вещах глубокий смысл.', -1],
      ["Nazariy muhokamalar menga qiziq emas.", 'Мне неинтересны теоретические дискуссии.', -1],
      ["Mavhum g'oyalar menga qiziq emas.", 'Мне неинтересны абстрактные идеи.', -1],
      ["Murakkab odamlardan uzoqroq yurishga harakat qilaman.", 'Я стараюсь избегать сложных людей.', -1]
    ],
    Q2: [
      ["Meni yolg'iz qoldirishlarini xohlayman.", 'Я хочу, чтобы меня оставили в покое.', 1],
      ["Ishlarni o'zim yakka bajarishni afzal ko'raman.", 'Я предпочитаю делать всё сам(а).', 1],
      ["Yolg'iz vaqt o'tkazishni yoqtiraman.", 'Мне нравится проводить время в одиночестве.', 1],
      ["Sokinlikka intilaman.", 'Я стремлюсь к тишине.', 1],
      ["Yolg'iz ovqatlanishga qarshi emasman.", 'Я не против поесть в одиночестве.', 1],
      ["Jimjitlikni yoqtiraman.", 'Мне нравится тишина.', 1],
      ["Shaxsiy hayotim daxlsiz bo'lishini qadrlayman.", 'Я ценю своё личное пространство.', 1],
      ["Guruh a'zosi bo'lishni yoqtiraman.", 'Мне нравится быть частью группы.', -1],
      ["Jamoa bo'lib ishlashni yoqtiraman.", 'Мне нравится работать в команде.', -1],
      ["Boshqalarning davrasisiz yashay olmayman.", 'Я не могу обходиться без общества других.', -1]
    ],
    Q3: [
      ["Hamma narsa \"aynan kerakli darajada\" bo'lishini xohlayman.", 'Я хочу, чтобы всё было «как надо».', 1],
      ["Uy yumushlarini darhol bajaraman.", 'Я сразу выполняю домашние дела.', 1],
      ["Tartibni yaxshi ko'raman.", 'Я люблю порядок.', 1],
      ["Hamma narsa mukammal bo'lmaguncha davom etaman.", 'Я продолжаю, пока всё не станет идеальным.', 1],
      ["Ishimda talabchan va aniqman.", 'Я требователен(на) и точен(на) в работе.', 1],
      ["Tartibsiz odamlar meni bezovta qilmaydi.", 'Меня не раздражают неряшливые люди.', -1],
      ["Tartibsizlik meni bezovta qilmaydi.", 'Меня не беспокоит беспорядок.', -1],
      ["Xonamni tartibsiz qoldiraman.", 'Я оставляю беспорядок в комнате.', -1],
      ["Narsalarimni har yerda qoldirib ketaman.", 'Я разбрасываю свои вещи.', -1],
      ["Yoqimsiz ishlarni keyinga qoldiraman.", 'Я откладываю неприятные дела.', -1]
    ],
    Q4: [
      ["Tez jahlim chiqadi.", 'Я легко раздражаюсь.', 1],
      ["Tez g'azablanaman.", 'Я легко злюсь.', 1],
      ["Boshqalar haqida shoshilib hukm chiqaraman.", 'Я скор(а) на суждения о других.', 1],
      ["Boshqalarning xatolari meni jahlimni chiqaradi.", 'Меня раздражают чужие ошибки.', 1],
      ["Tez ranjib, xafa bo'lib qolaman.", 'Меня легко задеть и вывести из равновесия.', 1],
      ["Menga e'tiroz bildirishlariga toqat qilolmayman.", 'Терпеть не могу, когда мне возражают.', 1],
      ["Odamlarga tashqi ko'rinishiga qarab baho beraman.", 'Я сужу о людях по внешности.', 1],
      ["Meni osonlikcha jahlini chiqarib bo'lmaydi.", 'Меня нелегко рассердить.', -1],
      ["Kechirib, unutishga harakat qilaman.", 'Я стараюсь простить и забыть.', -1],
      ["Har kim haqida yaxshi so'z topa olaman.", 'У меня для каждого найдётся доброе слово.', -1]
    ]
  };
  const ORDER = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];
  // Shkalalarni aralashtirib (navbatma-navbat) bitta ro'yxat
  const ITEMS = [];
  for (let k = 0; k < 13; k++) ORDER.forEach((sc, j) => { const it = S[sc][(k + j) % S[sc].length]; if (k < S[sc].length) ITEMS.push([it[0], it[1], sc, it[2]]); });
  // Takrorlanmasligini tekshirish — har shkaladan barcha savollar bir martadan
  ITEMS.splice(60, 0, ["Diqqat savoli: bu yerda «Ko'proq to'g'ri» javobini belgilang.", 'Проверка внимания: выберите здесь ответ «Скорее верно».', 'X', 4]);
  ITEMS.splice(130, 0, ["Diqqat savoli: bu yerda «Mutlaqo noto'g'ri» javobini belgilang.", 'Проверка внимания: выберите здесь ответ «Совершенно неверно».', 'X', 1]);
  const N = ITEMS.length;

  const F = () => ({
    A: [L('Iliqlik', 'Теплота'), L('Sovuqqon, odamlardan uzoq', 'Сдержанный, отстранённый'), L("Iliq, g'amxo'r, odamlarga qiziquvchi", 'Тёплый, заботливый, интересуется людьми'),
      L("Odamlar bilan munosabatda vazmin va masofa saqlaysiz; his-tuyg'ulardan ko'ra ish va dalillarga tayanasiz.", 'Вы сдержанны и держите дистанцию в отношениях, опираетесь больше на дело и факты, чем на чувства.'),
      L("Odamlarga samimiy qiziqasiz, ularga yordam berish va g'amxo'rlik qilishdan zavq olasiz; insonlar bilan ishlaydigan kasblarga mos.", 'Вы искренне интересуетесь людьми, с удовольствием помогаете и заботитесь; подходят профессии, связанные с людьми.')],
    B: [L('Intellektual faollik', 'Интеллектуальная активность'), L('Amaliy, aniq fikrlovchi', 'Конкретное, практичное мышление'), L('Tahliliy, mulohazali fikrlovchi', 'Аналитическое, абстрактное мышление'),
      L("Mavhum muhokamalardan ko'ra aniq, amaliy ishlarni afzal ko'rasiz. (Bu omil aql darajasini emas, o'zingizni qanday baholashingizni ko'rsatadi.)", 'Вы предпочитаете конкретные практические дела абстрактным рассуждениям. (Этот фактор отражает самооценку, а не уровень интеллекта.)'),
      L("O'zingizni tez o'rganuvchi, tahlilga moyil odam deb bilasiz. (Bu omil aql darajasini emas, o'zingizni qanday baholashingizni ko'rsatadi — aqliy qobiliyat uchun Mantiqiy fikrlash testini topshiring.)", 'Вы видите себя быстро обучающимся и склонным к анализу. (Фактор отражает самооценку, а не уровень интеллекта — для оценки способностей пройдите тест логического мышления.)')],
    C: [L('Emotsional barqarorlik', 'Эмоциональная устойчивость'), L("Hissiyotga beriluvchan, tez o'zgaruvchan", 'Эмоционально изменчивый'), L('Barqaror, vazmin, yetuk', 'Устойчивый, спокойный, зрелый'),
      L("Kayfiyatingiz vaziyatga tez bog'lanib qoladi, muvaffaqiyatsizliklar sizga og'ir ta'sir qiladi. Stressni boshqarish usullarini o'rganish foydali.", 'Ваше настроение сильно зависит от обстоятельств, неудачи переживаются тяжело. Полезно освоить способы управления стрессом.'),
      L("Qiyinchiliklarga xotirjam munosabatda bo'lasiz, his-tuyg'ularingizni yaxshi boshqarasiz.", 'Вы спокойно встречаете трудности и хорошо управляете своими эмоциями.')],
    E: [L('Dominantlik', 'Доминантность'), L("Yumshoq, kelishuvchan, bo'ysunuvchan", 'Мягкий, уступчивый, покладистый'), L("Qat'iyatli, o'z fikrini o'tkazuvchi", 'Напористый, настойчивый, властный'),
      L("Ziddiyatdan qochasiz, boshqalarning fikriga ko'nikasiz. Jamoada yoqimli hamkorsiz, lekin o'z manfaatingizni himoya qilishni ham mashq qiling.", 'Вы избегаете конфликтов и уступаете чужому мнению. Вы приятный партнёр, но стоит тренировать умение отстаивать свои интересы.'),
      L("Yetakchilikka intilasiz, fikringizni ochiq aytasiz va qaror qabul qilishdan qo'rqmaysiz. Boshqalarning fikrini ham tinglashni unutmang.", 'Вы стремитесь к лидерству, открыто высказываетесь и не боитесь принимать решения. Не забывайте выслушивать других.')],
    F: [L("Jo'shqinlik", 'Живость'), L('Jiddiy, vazmin, ehtiyotkor', 'Серьёзный, сдержанный, осторожный'), L("Jo'shqin, quvnoq, g'ayratli", 'Живой, весёлый, энергичный'),
      L("Jiddiy va o'ychansiz, shovqinli ko'ngilxushliklardan ko'ra sokin muhitni afzal ko'rasiz.", 'Вы серьёзны и вдумчивы, шумным развлечениям предпочитаете спокойную обстановку.'),
      L("Quvnoq, hazilkash va g'ayratlisiz, davraga jon kiritasiz; ba'zan shoshqaloqlik qilishingiz mumkin.", 'Вы весёлы, остроумны и энергичны, оживляете компанию; иногда можете быть импульсивны.')],
    G: [L('Qoidaga sodiqlik', 'Нормативность'), L('Erkin, qoidalarga befarq', 'Свободный от правил, гибкий'), L("Vijdonli, qoida va me'yorlarga sodiq", 'Добросовестный, следует нормам и правилам'),
      L("Qoidalarni har doim ham muhim deb bilmaysiz, o'z yo'lingizni tanlaysiz. Ijodiy ishlarda bu afzallik, rasmiy muhitda esa ziddiyat keltirishi mumkin.", 'Вы не всегда считаете правила обязательными и выбираете свой путь. В творчестве это плюс, в формальной среде может вызвать конфликты.'),
      L("Mas'uliyatli, intizomli, qonun va qoidalarni hurmat qilasiz; sizga ishonsa bo'ladi.", 'Вы ответственны, дисциплинированны, уважаете законы и правила; на вас можно положиться.')],
    H: [L('Ijtimoiy jasorat', 'Социальная смелость'), L('Tortinchoq, uyatchan', 'Застенчивый, робкий'), L('Dadil, kirishimli', 'Смелый в общении, общительный'),
      L("Yangi odamlar bilan tanishish, ko'pchilik oldida gapirish sizga qiyin. Bu mashq bilan rivojlanadigan ko'nikma.", 'Вам непросто знакомиться и выступать перед людьми. Это навык, который развивается тренировкой.'),
      L("Odamlar bilan osonlik bilan til topishasiz, diqqat markazida bo'lishdan qo'rqmaysiz.", 'Вы легко находите общий язык с людьми и не боитесь быть в центре внимания.')],
    I: [L('Sezgirlik', 'Чувствительность'), L('Amaliy, realist, qattiqqo\'l', 'Практичный, реалистичный, жёсткий'), L("Nozik, ta'sirchan, estetik", 'Чуткий, впечатлительный, эстетичный'),
      L("Amaliy va real fikrlaysiz, his-tuyg'ularga berilib ketmaysiz.", 'Вы мыслите практично и реалистично, не поддаётесь сентиментальности.'),
      L("San'at, adabiyot va go'zallikka ta'sirchansiz, his-tuyg'ularni chuqur sezasiz.", 'Вы восприимчивы к искусству, литературе и красоте, глубоко чувствуете.')],
    L: [L('Shubhaga moyillik', 'Подозрительность'), L('Ishonuvchan, ochiq', 'Доверчивый, открытый'), L("Shubhakor, ehtiyotkor", 'Подозрительный, настороженный'),
      L("Odamlarga ishonasiz va ularning yaxshi niyatiga ishonasiz; ba'zan bu sodda ishonuvchanlikka aylanishi mumkin.", 'Вы доверяете людям и верите в их добрые намерения; иногда это может переходить в наивность.'),
      L("Odamlarga nisbatan ehtiyotkorsiz, yashirin niyat izlaysiz. Bu himoya qiladi, ammo yaqin munosabatlarni qiyinlashtirishi mumkin.", 'Вы насторожены с людьми и ищете скрытые мотивы. Это защищает, но может затруднять близкие отношения.')],
    M: [L('Xayolparastlik', 'Мечтательность'), L("Amaliy, yerga mustahkam bosgan", 'Практичный, приземлённый'), L("Xayolparast, g'oyalarga berilgan", 'Мечтательный, погружённый в идеи'),
      L("E'tiboringiz aniq, amaliy narsalarga qaratilgan, ishni belgilangan tartibda bajarasiz.", 'Ваше внимание сосредоточено на конкретном и практическом, вы делаете всё по установленному порядку.'),
      L("Boy tasavvurga egasiz, g'oyalar va xayollar olamiga berilasiz, noodatiy yo'llarni tanlaysiz.", 'У вас богатое воображение, вы погружаетесь в мир идей и фантазий, выбираете нестандартные пути.')],
    N: [L('Yopiqlik', 'Закрытость'), L('Ochiq, samimiy', 'Открытый, искренний'), L("Yopiq, sirlarini saqlovchi", 'Сдержанный, скрытный'),
      L("O'zingiz va his-tuyg'ularingiz haqida ochiq gapirasiz, samimiysiz.", 'Вы открыто говорите о себе и своих чувствах, искренни.'),
      L("Ichki dunyongizni boshqalarga kam ochasiz, his-tuyg'ularni ichingizda saqlaysiz.", 'Вы мало раскрываете свой внутренний мир, держите чувства в себе.')],
    O: [L('Xavotirlilik', 'Тревожность'), L("O'ziga ishongan, xotirjam", 'Уверенный, безмятежный'), L("Xavotirli, o'zini ayblovchi", 'Тревожный, склонный к самообвинению'),
      L("O'zingizga ishonasiz, o'tgan xatolar haqida uzoq qayg'urmaysiz.", 'Вы уверены в себе и не переживаете подолгу о прошлых ошибках.'),
      L("Ko'p xavotirlanasiz, xatolaringiz uchun o'zingizni ayblashga moyilsiz. Xavotir uzoq davom etsa, GAD-7 testini topshirib ko'ring.", 'Вы много тревожитесь и склонны винить себя за ошибки. Если тревога длительная, пройдите тест GAD-7.')],
    Q1: [L("O'zgarishga ochiqlik", 'Открытость изменениям'), L("An'anaviy, tanish narsaga sodiq", 'Традиционный, привержен привычному'), L('Yangilikka ochiq, izlanuvchan', 'Открыт новому, любознателен'),
      L("Sinalgan, tanish usullarni afzal ko'rasiz, mavhum muhokamalarga qiziqishingiz kam.", 'Вы предпочитаете проверенные способы, мало интересуетесь абстрактными рассуждениями.'),
      L("Yangi g'oyalarni, falsafiy va nazariy masalalarni yoqtirasiz, o'zgarishlardan qo'rqmaysiz.", 'Вам нравятся новые идеи, философские и теоретические вопросы, вы не боитесь перемен.')],
    Q2: [L('Mustaqillik (yakkalikka moyillik)', 'Самодостаточность'), L("Guruhga yo'naltirilgan", 'Ориентирован на группу'), L("Mustaqil, yolg'izlikni qadrlovchi", 'Самостоятельный, ценит уединение'),
      L("Jamoa bilan ishlashni, odamlar davrasida bo'lishni afzal ko'rasiz.", 'Вы предпочитаете работать в команде и быть среди людей.'),
      L("Ishlarni o'zingiz bajarishni, sokinlik va yolg'izlikni qadrlaysiz.", 'Вы предпочитаете делать всё сами, цените тишину и уединение.')],
    Q3: [L('Tartibga intilish', 'Перфекционизм'), L('Erkin, tartibga befarq', 'Гибкий, терпим к беспорядку'), L("Tartibli, puxta, mukammallikka intiluvchi", 'Организованный, педантичный, перфекционист'),
      L("Tartib va rejaga qattiq bog'lanmaysiz, moslashuvchansiz; ba'zan ishlar keyinga qolib ketishi mumkin.", 'Вы не привязаны жёстко к порядку и планам, гибки; иногда дела откладываются.'),
      L("Tartibli, puxta va talabchansiz, ishni mukammal qilishga intilasiz; o'zingizga ortiqcha bosim qilmang.", 'Вы организованны, тщательны и требовательны, стремитесь всё делать идеально; не давите на себя слишком сильно.')],
    Q4: [L('Taranglik (asabiylik)', 'Напряжённость'), L('Bosiq, sabrli', 'Расслабленный, терпеливый'), L("Asabiy, tez jahli chiqadigan", 'Напряжённый, раздражительный'),
      L("Sabrli va bosiqsiz, boshqalarni osongina kechirasiz.", 'Вы терпеливы и спокойны, легко прощаете других.'),
      L("Tez jahlingiz chiqadi, boshqalarning xatolariga toqat qilish qiyin. Bo'shashish va nafas mashqlari foydali.", 'Вы легко раздражаетесь, вам трудно терпеть чужие ошибки. Полезны техники расслабления и дыхания.')]
  });
  const OPTS = () => lang === 'ru'
    ? ['Совершенно неверно', 'Скорее неверно', 'Ни то ни другое', 'Скорее верно', 'Совершенно верно']
    : ["Mutlaqo noto'g'ri", "Ko'proq noto'g'ri", "Na unisi, na bunisi", "Ko'proq to'g'ri", "Mutlaqo to'g'ri"];

  TESTS.pf16 = {
    name: { uz: "16 omilli shaxs so'rovnomasi (Kettel modeli)", ru: '16-факторный личностный опросник (модель Кеттелла)' },
    desc: { uz: "Shaxsingizni R. Kettelning 16 ta omili bo'yicha batafsil profil shaklida ko'rsatadi: iliqlik, dominantlik, xavotirlilik, mustaqillik va boshqalar (IPIP ochiq analogi).", ru: 'Подробный профиль личности по 16 факторам Р. Кеттелла: теплота, доминантность, тревожность, самодостаточность и др. (открытый аналог IPIP).' },
    instr: { uz: '', ru: '' }, minutes: 20,
    items: { uz: ITEMS.map(x => x[0]), ru: ITEMS.map(x => x[1]) },
    options: { uz: OPTS(), ru: OPTS() }, bands: [], reverse: [], source: 'IPIP-16PF (ipip.ori.org)'
  };

  const load = () => { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && Array.isArray(s.a) && s.a.length === N) return s; } catch (e) {} return null; };
  const store = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };

  let st;
  function viewPf(page) {
    st = st || load() || { a: Array(N).fill(0), t0: Date.now(), p: 0 };
    if (page != null) st.p = page;
    const pages = Math.ceil(N / PER_PAGE), p = st.p, from = p * PER_PAGE, to = Math.min(N, from + PER_PAGE);
    const opts = OPTS(), done = st.a.filter(Boolean).length;
    app.innerHTML = `
      <a href="#tests">← ${t('back')}</a>
      <h1>${esc(TESTS.pf16.name[lang])}</h1>
      ${p === 0 ? `<p><strong>${t('instructionPrefix')}</strong> ${esc(L(`${N} ta fikr bor, ${pages} ta sahifaga bo'lingan (taxminan 20 daqiqa). Har bir fikr sizga qanchalik mos kelishini belgilang — qanday bo'lishni xohlashingizni emas, odatda qanday ekanligingizni. Uzoq o'ylamang, birinchi kelgan javob odatda eng to'g'risi. Javoblaringiz shu brauzerda saqlanib boradi — to'xtab, keyin davom ettirishingiz mumkin.`, `${N} утверждений на ${pages} страницах (около 20 минут). Отметьте, насколько каждое утверждение верно для вас — какой вы обычно, а не каким хотели бы быть. Не раздумывайте долго: первый ответ обычно самый точный. Ответы сохраняются в этом браузере — можно прерваться и продолжить позже.`))}</p>` : ''}
      <div class="pf-top"><span>${L('Sahifa', 'Страница')} ${p + 1} / ${pages}</span><span>${done} / ${N}</span></div>
      <div class="progress"><div id="prog" style="width:${done / N * 100}%"></div></div>
      <form id="pform">
        ${ITEMS.slice(from, to).map((it, k) => { const i = from + k; return `
          <div class="question" data-i="${i}"><p>${i + 1}. ${esc(lang === 'ru' ? it[1] : it[0])}</p>
            <div class="options">${opts.map((o, v) => `<label><input type="radio" name="q${i}" value="${v + 1}" ${st.a[i] === v + 1 ? 'checked' : ''}>${esc(o)}</label>`).join('')}</div>
          </div>`; }).join('')}
        <p id="perr" class="notice danger" hidden>${esc(t('answerAll'))}</p>
        <div class="row-actions">
          ${p > 0 ? `<button class="btn secondary" type="button" id="pprev">← ${L('Oldingi', 'Назад')}</button>` : ''}
          <button class="btn" type="submit">${p < pages - 1 ? L('Keyingi sahifa', 'Следующая страница') + ' →' : t('submit')}</button>
          ${done > 0 ? `<button class="btn secondary" type="button" id="preset">${L('Boshidan boshlash', 'Начать заново')}</button>` : ''}
        </div>
      </form>
      <p class="meta">${esc(L("Savollar manbasi: International Personality Item Pool (ipip.ori.org) — Kettelning 16PF omillariga o'xshash konstruktlarni o'lchaydigan 16 ta ochiq IPIP shkalasi (public domain); o'zbek va rus tillariga PsixoLab tarjimasi. Bu Kettelning asl 16PF so'rovnomasi emas.", 'Источник утверждений: International Personality Item Pool (ipip.ori.org) — 16 открытых шкал IPIP, измеряющих конструкты, сходные с факторами 16PF Кеттелла (public domain); перевод PsixoLab. Это не оригинальный опросник 16PF.'))}</p>`;
    const form = $('pform');
    form.addEventListener('change', e => {
      const i = +e.target.name.slice(1); st.a[i] = +e.target.value; store(st);
      const d = st.a.filter(Boolean).length; $('prog').style.width = (d / N * 100) + '%';
      e.target.closest('.question').classList.remove('miss');
    });
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const miss = []; for (let i = from; i < to; i++) if (!st.a[i]) miss.push(i);
      if (miss.length) {
        $('perr').hidden = false;
        miss.forEach(i => form.querySelector(`.question[data-i="${i}"]`).classList.add('miss'));
        form.querySelector(`.question[data-i="${miss[0]}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' }); return;
      }
      if (p < pages - 1) { st.p = p + 1; store(st); viewPf(); window.scrollTo(0, 0); }
      else finish();
    });
    if ($('pprev')) $('pprev').addEventListener('click', () => { st.p = p - 1; store(st); viewPf(); window.scrollTo(0, 0); });
    if ($('preset')) $('preset').addEventListener('click', () => {
      if (!confirmReset()) return;
      st = { a: Array(N).fill(0), t0: Date.now(), p: 0 }; store(st); viewPf(); window.scrollTo(0, 0);
    });
  }
  function confirmReset() { const b = $('preset'); if (b.dataset.sure) return true; b.dataset.sure = 1; b.textContent = L('Ishonchingiz komilmi? Yana bosing', 'Уверены? Нажмите ещё раз'); return false; }

  const sten = m => Math.max(1, Math.min(10, Math.round(1 + (m - 1) / 4 * 9)));
  function score(a) {
    const r = {};
    ORDER.forEach(sc => { let s = 0, n = 0; ITEMS.forEach((it, i) => { if (it[2] === sc) { s += it[3] > 0 ? a[i] : 6 - a[i]; n++; } }); r[sc] = sten(s / n); });
    return r;
  }
  const inv = x => 11 - x, avg = (...x) => Math.round(x.reduce((a, b) => a + b, 0) / x.length * 10) / 10;
  function globals(s) {
    return [
      [L('Ekstraversiya', 'Экстраверсия'), avg(s.A, s.F, s.H, inv(s.N), inv(s.Q2)), L('introvert', 'интроверт'), L('ekstravert', 'экстраверт')],
      [L('Xavotir', 'Тревожность'), avg(inv(s.C), s.L, s.O, s.Q4), L('xotirjam', 'спокойный'), L('xavotirli', 'тревожный')],
      [L("Qat'iyat (realizm)", 'Жёсткость (реализм)'), avg(inv(s.A), inv(s.I), inv(s.M), inv(s.Q1)), L('ochiq, sezgir', 'открытый, чуткий'), L("qat'iy, amaliy", 'жёсткий, практичный')],
      [L('Mustaqillik', 'Независимость'), avg(s.E, s.H, s.L, s.Q1), L('kelishuvchan', 'уступчивый'), L('mustaqil', 'независимый')],
      [L("O'zini nazorat", 'Самоконтроль'), avg(inv(s.F), s.G, inv(s.M), s.Q3), L('erkin, impulsiv', 'импульсивный'), L('intizomli', 'дисциплинированный')]
    ];
  }

  function finish() {
    const a = st.a.slice(), s = score(a), sec = Math.round((Date.now() - (st.t0 || Date.now())) / 1000);
    const flags = [];
    ITEMS.forEach((it, i) => { if (it[2] === 'X' && a[i] !== it[3]) flags.push('attention'); });
    const core = a.filter((_, i) => ITEMS[i][2] !== 'X');
    const top = Math.max(...[1, 2, 3, 4, 5].map(v => core.filter(x => x === v).length));
    if (top / core.length > 0.6) flags.push('same');
    if (sec < 300) flags.push('fast');
    const fl = [...new Set(flags)];
    saveResult({ type: 'test', id: 'pf16', s, valid: fl.length ? 0 : 1, flags: fl.join(','), time: sec });
    try { localStorage.removeItem(KEY); } catch (e) {}
    st = null;
    showPf(s, fl);
  }

  function showPf(s, flags) {
    const Fx = F(), pronounced = ORDER.filter(k => s[k] <= 3 || s[k] >= 8);
    const warn = flags.length ? `<div class="notice warn"><strong>${L('Natija ishonchliligi pasaygan', 'Достоверность результата снижена')}:</strong> ${flags.map(f => ({
      attention: L("diqqat savollaridan biriga noto'g'ri javob berildi", 'неверный ответ на проверочный вопрос'),
      same: L("javoblarning aksariyati bir xil", 'большинство ответов одинаковые'),
      fast: L("so'rovnoma juda tez to'ldirildi", 'опросник заполнен слишком быстро')
    }[f])).join('; ')}. ${L("Imkon bo'lsa, shoshilmasdan qayta topshiring.", 'По возможности пройдите заново, не торопясь.')}</div>` : '';
    app.innerHTML = `
      <h1>${esc(TESTS.pf16.name[lang])}</h1>
      ${warn}
      <div class="card">
        <h2>${L('Shaxs profili', 'Профиль личности')}</h2>
        <p class="meta">${esc(L("Har bir omil 1–10 ballik shkalada (sten). 1–3 — past qutb, 4–7 — o'rtacha, 8–10 — yuqori qutb. Na past, na yuqori ball \"yaxshi\" yoki \"yomon\" emas — bular shunchaki xususiyatlar.", 'Каждый фактор — по шкале 1–10 (стены). 1–3 — низкий полюс, 4–7 — средний уровень, 8–10 — высокий полюс. Ни низкие, ни высокие значения не являются «хорошими» или «плохими» — это просто особенности.'))}</p>
        <div class="pf-prof">
          ${ORDER.map(k => `<div class="pf-row ${s[k] <= 3 ? 'lo' : s[k] >= 8 ? 'hi' : ''}">
            <div class="pf-lo">${esc(Fx[k][1])}</div>
            <div class="pf-mid"><div class="pf-name"><b>${k}</b> ${esc(Fx[k][0])}</div>
              <div class="pf-scale">${Array.from({ length: 10 }, (_, j) => `<span class="${j + 1 === s[k] ? 'on' : ''} ${j < 3 || j > 6 ? 'edge' : ''}">${j + 1 === s[k] ? s[k] : ''}</span>`).join('')}</div></div>
            <div class="pf-hi">${esc(Fx[k][2])}</div></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h2>${L('Umumlashgan omillar', 'Глобальные факторы')}</h2>
        <p class="meta">${esc(L("16 omildan hisoblangan 5 ta keng xususiyat (taxminiy).", '5 широких черт, рассчитанных из 16 факторов (приблизительно).'))}</p>
        ${globals(s).map(g => `<div class="pf-g"><b>${esc(g[0])}</b><span class="pf-gl">${esc(g[2])}</span><div class="pf-gbar"><i style="left:${(g[1] - 1) / 9 * 100}%"></i></div><span class="pf-gh">${esc(g[3])}</span><em>${g[1]}</em></div>`).join('')}
      </div>
      <div class="conclusion">
        <h2>${L('Xulosa', 'Заключение')}</h2>
        ${pronounced.length ? `<p>${esc(L('Sizda eng yaqqol namoyon bo\'lgan xususiyatlar:', 'Наиболее выраженные черты:'))}</p>
          <ul>${pronounced.map(k => `<li><strong>${esc(Fx[k][0])} — ${esc(s[k] >= 8 ? Fx[k][2] : Fx[k][1])} (${s[k]})</strong><br>${esc(s[k] >= 8 ? Fx[k][4] : Fx[k][3])}</li>`).join('')}</ul>`
        : `<p>${esc(L("Barcha omillar o'rtacha diapazonda (4–7): shaxsingiz muvozanatli, keskin ifodalangan qirralar yo'q — vaziyatga qarab turlicha harakat qila olasiz.", 'Все факторы в среднем диапазоне (4–7): профиль сбалансирован, без резко выраженных черт — вы способны вести себя по-разному в зависимости от ситуации.'))}</p>`}
        <p class="meta">${esc(L("Muhim: bu Kettelning asl 16PF testi emas, balki o'sha omillarni o'lchaydigan ochiq IPIP shkalalari. O'zbek aholisi uchun normalar hali yo'q, shuning uchun stenlar xom ballardan to'g'ridan-to'g'ri hisoblangan va taxminiy. Natija o'zingizni anglash uchun mo'ljallangan, kasbiy tanlov yoki klinik xulosa uchun psixolog bilan birga talqin qiling.", 'Важно: это не оригинальный 16PF Кеттелла, а открытые шкалы IPIP, измеряющие те же факторы. Норм для населения Узбекистана пока нет, поэтому стены рассчитаны напрямую из сырых баллов и приблизительны. Результат предназначен для самопознания; для профотбора или клинических выводов интерпретируйте вместе с психологом.'))}</p>
      </div>
      <div class="row-actions"><a class="btn" href="#test/pf16" onclick="setTimeout(route,0)">${t('retake')}</a><button class="btn secondary" onclick="window.print()">${L('Chop etish / PDF', 'Печать / PDF')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
    window.scrollTo(0, 0);
  }

  const _desc = describe;
  describe = function (r) {
    if (r.type === 'test' && r.id === 'pf16' && r.s) {
      return { name: TESTS.pf16.name[lang], result: ORDER.map(k => `${k}:${r.s[k]}`).join(' '), note: r.valid ? '' : L('Ishonchliligi past', 'Низкая достоверность') };
    }
    return _desc(r);
  };

  const css = document.createElement('style');
  css.textContent = `
  .pf-top{display:flex;justify-content:space-between;font-weight:600;color:var(--muted);margin:.8rem 0 .3rem}
  .question.miss{outline:2px solid #FF6F91;outline-offset:4px;border-radius:12px}
  .pf-prof{display:flex;flex-direction:column;gap:2px;margin-top:.6rem}
  .pf-row{display:grid;grid-template-columns:1fr minmax(240px,1.3fr) 1fr;gap:.8rem;align-items:center;padding:.45rem .5rem;border-radius:10px}
  .pf-row:nth-child(odd){background:#F6F4FE}
  .pf-lo{text-align:right;font-size:.82rem;color:var(--muted)}.pf-hi{font-size:.82rem;color:var(--muted)}
  .pf-row.lo .pf-lo,.pf-row.hi .pf-hi{color:var(--text);font-weight:700}
  .pf-name{font-size:.85rem;margin-bottom:.25rem;color:var(--text)}.pf-name b{display:inline-block;min-width:2.2em;color:var(--accent)}
  .pf-scale{display:grid;grid-template-columns:repeat(10,1fr);gap:3px}
  .pf-scale span{height:22px;border-radius:5px;background:#E7E2FA;font:700 .75rem/22px var(--display);text-align:center;color:#fff}
  .pf-scale span.edge{background:#DCD5F7}.pf-scale span.on{background:var(--accent)}
  .pf-g{display:grid;grid-template-columns:150px 90px 1fr 110px 36px;gap:.6rem;align-items:center;margin:.55rem 0;font-size:.88rem}
  .pf-gl{text-align:right;color:var(--muted)}.pf-gh{color:var(--muted)}.pf-g em{font-style:normal;font-weight:700;color:var(--accent)}
  .pf-gbar{height:10px;border-radius:5px;background:linear-gradient(90deg,#E7E2FA,#C9BEFF);position:relative}
  .pf-gbar i{position:absolute;top:-4px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:var(--accent);border:3px solid #fff;box-shadow:0 1px 4px rgba(42,35,112,.3)}
  @media (max-width:720px){
    .pf-row{grid-template-columns:1fr 1fr;gap:.2rem .6rem}.pf-mid{grid-column:1/3;grid-row:1}.pf-lo{text-align:left}.pf-hi{text-align:right}
    .pf-g{grid-template-columns:1fr auto;}.pf-g .pf-gbar{grid-column:1/3}.pf-gl,.pf-gh{display:none}}
  @media print{header,footer,.row-actions,nav{display:none!important}.pf-row{break-inside:avoid}}`;
  document.head.appendChild(css);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    _route();
    const [pg, arg] = (location.hash || '#home').slice(1).split('/');
    if (pg === 'test' && arg === 'pf16') { st = null; viewPf(); window.scrollTo(0, 0); }
  };
  window.addEventListener('hashchange', route);
  route();
})();
