/* PsixoLab — Qobiliyatlar diagnostikasi: pedagogik, kommunikativ-tashkilotchilik, psixologik (konsultantlik), ijodiy.
   Har bir test 2 qismdan iborat:
   1) O'zini baholash shkalalari — International Personality Item Pool (ipip.ori.org), ochiq foydalanishdagi (public domain) shkalalar:
      VIA (Peterson & Seligman): Originality/Creativity α=.85, Curiosity α=.78, Leadership α=.78, Social Intelligence α=.76,
      Kindness α=.72, Love of Learning α=.77, Equity/Fairness α=.70; JPI-R: Social Confidence α=.87, Sociability α=.78. PsixoLab tarjimasi.
   2) Amaliy qism — PsixoLab tomonidan tuzilgan vaziyatli topshiriqlar (situational judgment test) yoki ijodiy topshiriq
      (J. P. Guilford "Muqobil foydalanish" topshirig'i tamoyilida). Bu qismning ishonchliligi ma'lumot to'plangach hisoblanadi. */
(function () {
  const L = (uz, ru) => (lang === 'ru' ? ru : uz);
  const $ = id => document.getElementById(id);

  // ---------- 1. IPIP shkalalari: [uz, ru, kalit] ----------
  const SC = {
    ori: { n: ['Ijodkorlik (originallik)', 'Креативность (оригинальность)'], a: .85, it: [
      ["Yangi va o'zgacha g'oyalar o'ylab topa olaman.", 'Я умею придумывать новые и необычные идеи.', 1],
      ["Ishni bajarishning yangi usullarini o'ylashni yoqtiraman.", 'Мне нравится придумывать новые способы что-то делать.', 1],
      ["Ishlarni bajarishning yangi yo'llarini topaman.", 'Я нахожу новые способы выполнения дел.', 1],
      ["O'ziga xos, original fikrlovchi odamman.", 'Я оригинально мыслящий человек.', 1],
      ["Tasavvurim do'stlarimnikidan ancha keng.", 'Моё воображение богаче, чем у моих друзей.', 1],
      ["O'ziga xosligim bilan faxrlanmayman.", 'Я не горжусь своей оригинальностью.', -1],
      ["Meni yangi va o'zgacha g'oyalar egasi deb bilishmaydi.", 'Меня не считают человеком с новыми, необычными идеями.', -1],
      ["Biror original ish qilishga alohida ishtiyoqim yo'q.", 'У меня нет особого стремления сделать что-то оригинальное.', -1]] },
    cur: { n: ['Qiziquvchanlik', 'Любознательность'], a: .78, it: [
      ['Dunyo men uchun juda qiziq joy.', 'Мир для меня — очень интересное место.', 1],
      ['Hech qachon zerikmayman.', 'Я никогда не скучаю.', 1],
      ['Doim biror qiziqarli ish bilan bandman.', 'Я всегда занят(а) чем-то интересным.', 1],
      ["Juda ko'p turli mashg'ulotlar meni ilhomlantiradi.", 'Меня увлекает множество разных занятий.', 1],
      ['Har qanday vaziyatda ham qiziq narsa topa olaman.', 'В любой ситуации могу найти что-то интересное.', 1],
      ["Hayotim juda qiziqarli deb o'ylayman.", 'Я считаю свою жизнь очень интересной.', 1],
      ["Boshqa mamlakatlar va madaniyatlar haqida eshitishni yaxshi ko'raman.", 'Люблю слушать о других странах и культурах.', 1],
      ['Dunyoga unchalik qiziqmayman.', 'Я не очень любопытен(на) к миру.', -1],
      ["O'zimni o'zim band qilish menga qiyin.", 'Мне трудно себя чем-то занять.', -1],
      ['Qiziqishlarim kam.', 'У меня мало интересов.', -1]] },
    lea: { n: ['Liderlik (tashkilotchilik)', 'Лидерство (организаторские)'], a: .78, it: [
      ["Guruhdagi har bir kishi o'zini chetda qolmagandek his qilishiga harakat qilaman.", 'Стараюсь, чтобы каждый в группе чувствовал себя включённым.', 1],
      ["Odamlarning birga yaxshi ishlashiga yordam bera olaman.", 'Я умею помогать людям хорошо работать вместе.', 1],
      ["Menga kuchli, lekin adolatli yetakchi ekanimni aytishadi.", 'Мне говорят, что я сильный, но справедливый лидер.', 1],
      ["Guruhim a'zolari mamnun bo'lishiga harakat qilaman.", 'Стараюсь, чтобы члены моей группы были довольны.', 1],
      ['Boshqalarni birga ishlashga undash menga qiyin.', 'Мне трудно добиться, чтобы другие работали сообща.', -1],
      ['Guruhni boshqarishni yaxshi uddalay olmayman.', 'Я плохо умею руководить группой.', -1],
      ["Guruh tadbirlarini rejalashtirishni yaxshi bilmayman.", 'Я не умею хорошо планировать групповые мероприятия.', -1]] },
    scf: { n: ['Muloqotdagi ishonch', 'Уверенность в общении'], a: .87, it: [
      ["Odamlar orasida o'zimni erkin his qilaman.", 'Мне комфортно среди людей.', 1],
      ['Diqqat markazida bo\'lishga qarshi emasman.', 'Я не против быть в центре внимания.', 1],
      ["Tayyorgarliksiz ham nutq so'zlay olaman.", 'Я хорошо выступаю экспромтом.', 1],
      ['Fikrimni oson ifodalayman.', 'Я легко выражаю свои мысли.', 1],
      ["Odamlarga ta'sir o'tkazish qobiliyatim tabiiy.", 'У меня природный талант влиять на людей.', 1],
      ["Diqqat markazida bo'lishni yomon ko'raman.", 'Ненавижу быть в центре внимания.', -1],
      ["Odamlarga ta'sir o'tkazish qobiliyatim yetishmaydi.", 'Мне не хватает умения влиять на людей.', -1],
      ["Ko'pincha odamlar orasida o'zimni noqulay his qilaman.", 'Мне часто неловко с людьми.', -1],
      ["O'zimga e'tibor tortishni yoqtirmayman.", 'Не люблю привлекать к себе внимание.', -1],
      ["Odatda aytadigan gapim kam bo'ladi.", 'Мне обычно почти нечего сказать.', -1]] },
    soc: { n: ['Kirishimlilik', 'Общительность'], a: .78, it: [
      ["Odamlarni bir joyga yig'ishni yoqtiraman.", 'Мне нравится собирать людей вместе.', 1],
      ["Guruh a'zosi bo'lishni yoqtiraman.", 'Мне нравится быть частью группы.', 1],
      ["Suhbatlashishni juda yaxshi ko'raman.", 'Обожаю поговорить.', 1],
      ["Kutilmagan bayram-syurprizlarni yaxshi ko'raman.", 'Люблю праздники-сюрпризы.', 1],
      ['Odamlarga qiziqaman.', 'Мне интересны люди.', 1],
      ["Yolg'iz bo'lishni afzal ko'raman.", 'Предпочитаю быть один(одна).', -1],
      ['Sokinlikka intilaman.', 'Стремлюсь к тишине.', -1],
      ['Odamlarni o\'zimdan uzoqroq tutaman.', 'Держу людей на расстоянии.', -1],
      ['Men juda yopiq odamman.', 'Я очень закрытый человек.', -1],
      ['Odam gavjum tadbirlarni yoqtirmayman.', 'Не люблю многолюдные мероприятия.', -1]] },
    si: { n: ['Ijtimoiy intellekt', 'Социальный интеллект'], a: .76, it: [
      ['Har qanday vaziyatga moslasha olaman.', 'Я могу вписаться в любую ситуацию.', 1],
      ["Suhbatdoshim o'zini qiziqarli odamdek his qilishiga erisha olaman.", 'Я умею дать человеку почувствовать себя интересным.', 1],
      ['Odamlarni nima harakatga keltirishini tushunaman.', 'Я понимаю, что движет людьми.', 1],
      ['Yangi tanishgan odamlar bilan yaxshi chiqisha olaman.', 'Я хорошо лажу с людьми, с которыми только что познакомился(ась).', 1],
      ['Boshqalar nimani his qilayotganini yaxshi sezaman.', 'Я хорошо чувствую, что испытывают другие.', 1],
      ["Odamlarning ko'nglini ko'tarish uchun nima deyishni bilaman.", 'Я знаю, что сказать, чтобы людям стало лучше.', 1],
      ["Yangi ijtimoiy vaziyatda o'zimni qanday tutishni bilmayman.", 'Я не знаю, как вести себя в новой социальной ситуации.', -1]] },
    kin: { n: ['Mehribonlik va g\'amxo\'rlik', 'Доброта и забота'], a: .72, it: [
      ["Do'stimga yordam berishga hech qachon bandlik qilmayman.", 'Я никогда не бываю слишком занят(а), чтобы помочь другу.', 1],
      ["Kayfiyati tushgan odamning ko'nglini ko'tarish uchun alohida harakat qilaman.", 'Стараюсь подбодрить тех, кто выглядит подавленным.', 1],
      ["Boshqalarni xursand qilishni yaxshi ko'raman.", 'Люблю радовать других.', 1],
      ["So'nggi bir oyda qo'shnimga yordam berdim.", 'За последний месяц я помог(ла) соседу.', 1],
      ["Boshqalarning omadidan o'zimnikidek quvonaman.", 'Радуюсь удачам других, как своим.', 1],
      ["Do'stlarim kasal bo'lsa, qo'ng'iroq qilib holidan xabar olaman.", 'Звоню друзьям, когда они болеют.', 1],
      ["Boshqalarga ham e'tibor markazida bo'lishga imkon beraman.", 'Охотно даю другим побыть в центре внимания.', 1],
      ["Boshqalar menga muammolarini gapirsa, sabrim tugaydi.", 'Меня раздражает, когда другие рассказывают о своих проблемах.', -1],
      ["Boshqalarga yaxshilik qilmaslikka harakat qilaman.", 'Стараюсь не делать одолжений другим.', -1],
      ["Faqat menga yaxshilik qilganlarga yaxshilik qilaman.", 'Я добр(а) только к тем, кто добр ко мне.', -1]] },
    lrn: { n: ["O'rganishga muhabbat", 'Любовь к учению'], a: .77, it: [
      ["Ta'limiy tadbirlarga borish uchun alohida vaqt va kuch sarflayman.", 'Я специально выбираюсь на образовательные мероприятия.', 1],
      ["Yangi narsa o'rgansam, juda xursand bo'laman.", 'Я в восторге, когда узнаю что-то новое.', 1],
      ["O'rganish va o'sish imkoniyatini intiqlik bilan kutaman.", 'С нетерпением жду возможности учиться и расти.', 1],
      ["Men umrbod o'rganuvchi odamman.", 'Я учусь всю жизнь.', 1],
      ['Doim kitob o\'qiyman.', 'Я постоянно читаю.', 1],
      ["Biror narsani bilmoqchi bo'lsam, darhol kutubxona yoki internetga murojaat qilaman.", 'Если хочу что-то узнать, сразу обращаюсь к библиотеке или интернету.', 1],
      ["Turli xil kitoblarni o'qiyman.", 'Я читаю самые разные книги.', 1],
      ["Yangi narsalarni o'rganishni yoqtirmayman.", 'Не люблю узнавать новое.', -1],
      ["Muzeylarga borishni yoqtirmayman.", 'Не люблю ходить в музеи.', -1],
      ["Ilmiy-ommabop kitoblarni zavq uchun o'qimayman.", 'Не читаю научно-популярные книги для удовольствия.', -1]] },
    fair: { n: ['Adolatlilik', 'Справедливость'], a: .70, it: [
      ['Xato qilsam, tan olaman.', 'Признаю, когда неправ(а).', 1],
      ["Hamma odamlarga teng munosabatda bo'laman.", 'Отношусь ко всем людям одинаково.', 1],
      ['Yaxshi tinglovchiman.', 'Я хороший слушатель.', 1],
      ["Har bir insonning huquqlari bir xil muhim deb hisoblayman.", 'Считаю, что права каждого одинаково важны.', 1],
      ['Har kimga imkoniyat beraman.', 'Даю шанс каждому.', 1],
      ["Adolat va tenglik tamoyillariga sodiqman.", 'Привержен(а) принципам справедливости и равенства.', 1],
      ["Har kim o'z fikrini aytishi kerak, deb hisoblayman.", 'Считаю, что каждый должен иметь право голоса.', 1],
      ["Boshqalardan o'z manfaatim uchun foydalanaman.", 'Пользуюсь другими в своих интересах.', -1],
      ["Kimnidir yoqtirmasam, unga boshqacha munosabatda bo'laman.", 'Отношусь к людям иначе, если они мне не нравятся.', -1]] }
  };

  // ---------- 2. Vaziyatli topshiriqlar: [savol uz, savol ru, [[uz,ru] x4], to'g'ri indeks] ----------
  const SJ = {
    ped: [
      ['Dars paytida bir talaba telefon bilan ovora.', 'Во время занятия студент занят телефоном.', [
        ["Darhol telefonini olib qo'yaman, dars oxirida qaytaraman — qoida hamma uchun bir", "Сразу забираю телефон, верну в конце занятия — правило для всех одно"],
        ["Butun guruh oldida unga qattiq tanbeh berib, ogohlantiraman", 'Делаю ему строгое замечание при всей группе'],
        ["Uni savol bilan darsga jalb qilaman, keyin yakka gaplashaman", 'Вовлекаю его вопросом, потом говорю с ним наедине'],
        ["E'tibor bermayman: o'qish kattalarning o'z mas'uliyati, majburlab bo'lmaydi", "Не обращаю внимания: учёба — ответственность взрослого, заставлять нельзя"]], 2],
      ['Mavzuni tushuntirdingiz, lekin ko\'pchilik tushunmaganini sezdingiz.', 'Вы объяснили тему, но видите, что большинство не поняло.', [
        ["Xuddi shu tushuntirishni sekinroq va balandroq takrorlayman", 'Повторяю то же объяснение медленнее и громче'],
        ["Boshqa yo'l bilan — misol yoki chizma orqali tushuntiraman", "Объясняю иначе — через пример или схему"],
        ["Mavzuni uyda mustaqil o'qib kelishni topshiraman, darslikda hammasi bor", "Задаю прочитать тему дома самостоятельно — в учебнике всё есть"],
        ["Rejadan qolmaslik uchun keyingi mavzuga o'taman, savollarga konsultatsiyada javob beraman", "Перехожу к следующей теме, чтобы не отстать, на вопросы отвечу на консультации"]], 1],
      ["Kuchsiz o'zlashtiradigan talaba birinchi marta to'g'ri javob berdi.", 'Слабо успевающий студент впервые ответил правильно.', [
        ["Aniq nimasi to'g'ri bo'lganini aytib, uni maqtayman", 'Хвалю его, называя, что именно было верно'],
        ["Bu oddiy savol edi; ortiqcha maqtov boshqalarga nisbatan adolatsiz bo'ladi", "Вопрос был простым; лишняя похвала несправедлива по отношению к другим"],
        ["«Nihoyat, siz ham bir narsa bildingiz» deb hazillashaman", 'Шучу: «Наконец-то и вы что-то знаете»'],
        ["Hech narsa demay, e'tiborni tortmaslik uchun keyingi talabadan so'rayman", "Ничего не говорю и, чтобы не привлекать внимания, спрашиваю следующего"]], 0],
      ['Yangi kursni boshlashdan oldin birinchi navbatda nima qilasiz?', 'Что вы сделаете в первую очередь перед началом нового курса?', [
        ["Darslikni boshidan oxirigacha ketma-ket o'tishni rejalayman, mualliflar shunday tuzgan", "Планирую пройти учебник подряд — авторы его так и выстроили"],
        ["Maqsad, talabalar darajasi va baholash usulini belgilab olaman", 'Определяю цели, уровень студентов и способ оценки'],
        ["Hamkasbimning o'tgan yilgi sinalgan rejasini o'zgarishsiz olaman", "Беру без изменений проверенный прошлогодний план коллеги"],
        ["Reja tuzmayman, har darsda talabalar kayfiyati va vaziyatga qarab ish tutaman", "Не составляю план, действую по настроению студентов и ситуации"]], 1],
      ['Ikki talaba darsda janjallashib qoldi.', 'Два студента поссорились на занятии.', [
        ["Ikkalasini ham darhol darsdan chiqarib yuboraman", 'Сразу выгоняю обоих с занятия'],
        ["Xotirjam to'xtatib, darsdan keyin ikkalasini alohida tinglayman", 'Спокойно останавливаю ссору, после занятия выслушиваю обоих отдельно'],
        ["Kim aybdorligini guruh oldida aniqlab, jazolayman", 'При группе выясняю виновного и наказываю'],
        ["O'zlari yarashishini kutib, darsni davom ettiraman", 'Продолжаю занятие, жду, пока помирятся сами']], 1],
      ['Talaba sizning xatongizni ko\'rsatdi — ma\'lumot haqiqatan noto\'g\'ri edi.', 'Студент указал на вашу ошибку — информация действительно была неверной.', [
        ["Obro'yim tushmasligi uchun boshqa mavzuga o'taman", 'Перевожу разговор, чтобы не уронить авторитет'],
        ["Xatoni tan olib, rahmat aytaman va to'g'risini tushuntiraman", 'Признаю ошибку, благодарю и объясняю верно'],
        ["Bu haqda darsdan keyin alohida gaplashishimizni aytib, darsni davom ettiraman", "Говорю, что обсудим это после занятия, и продолжаю урок"],
        ["Qayta tekshirib o'tirmay, o'z fikrimni himoya qilaman — manbam ishonchli", "Не перепроверяя, отстаиваю свою позицию — мой источник надёжный"]], 1],
      ['Guruhda bilim darajasi juda turlicha.', 'В группе очень разный уровень знаний.', [
        ["Adolatli bo'lishi uchun hammaga bir xil topshiriq va bir xil talab qo'yaman", "Ради справедливости даю всем одинаковые задания и требования"],
        ["Asosan kuchlilar bilan ishlayman, qolganlar ulardan o'rganadi", 'Работаю в основном с сильными, остальные учатся у них'],
        ["Turli darajadagi topshiriqlar berib, talabalarni juftlikda ishlataman", "Даю задания разного уровня и организую работу студентов в парах"],
        ["Kuchsiz talabalarga baholarni biroz oshirib qo'yaman", 'Слабым немного завышаю оценки']], 2],
      ['Talaba nazorat ishidan past baho olib, xafa bo\'ldi.', 'Студент получил низкую оценку за контрольную и расстроен.', [
        ["Xatolarini birga tahlil qilib, nimani o'rganishni rejalaymiz", 'Вместе разбираем ошибки и планируем, что подтянуть'],
        ["«Baho — baho, keyingi safar yaxshiroq tayyorlaning», deb qat'iy turib olaman", "Твёрдо говорю: «Оценка есть оценка, в следующий раз готовьтесь лучше»"],
        ["Uni xafa qilmaslik uchun bahoni o'zgartirib qo'yaman", 'Меняю оценку, чтобы не расстраивать его'],
        ["Boshqa talabalarning yuqori natijalarini unga namuna qilib ko'rsataman", "Показываю ему в пример высокие результаты других студентов"]], 0],
      ['Dars samarali o\'tganini qanday bilasiz?', 'Как вы узнаете, что занятие было эффективным?', [
        ["Talabalar darsda jim va intizomli o'tirgan bo'lsa, dars yaxshi o'tgan bo'ladi", "Если студенты сидели тихо и дисциплинированно — занятие прошло хорошо"],
        ["Rejadagi barcha material aytib bo'linganiga qarab bilaman", 'По тому, что весь материал плана рассказан'],
        ["Qisqa savol yoki topshiriq bilan nimani o'rganganini tekshiraman", 'Проверяю коротким вопросом или заданием, что усвоено'],
        ["Talabalar darsdan keyin minnatdorchilik bildirib, rahmat aytganiga qarab", "По тому, что студенты после занятия благодарят и говорят спасибо"]], 2],
      ['Talaba shaxsiy muammosi tufayli darslarga kelmay qo\'ydi.', 'Студент перестал ходить на занятия из-за личной проблемы.', [
        ["Qoidaga ko'ra, dekanatga xabar beraman, xolos", 'По правилам сообщаю в деканат, и всё'],
        ["U bilan muloyim gaplashib, sababini tushunib, yordam izlayman", 'Мягко говорю с ним, выясняю причину и ищу помощь'],
        ["Guruh oldida qoldirgan darslarini sanab beraman", 'Перечисляю при группе его пропуски'],
        ["Shaxsiy hayotiga aralashmayman, baholar o'zi ko'rsatadi", 'Не вмешиваюсь в личное, оценки всё покажут']], 1]
    ],
    kom: [
      ['Guruhga loyiha topshirildi, lekin hech kim tashabbus ko\'rsatmayapti.', 'Группе дали проект, но никто не проявляет инициативы.', [
        ["Vaqt ketmasin deb, hammasini o'zim bajarib, keyin guruhga ko'rsataman", "Чтобы не терять время, делаю всё сам(а), а потом показываю группе"],
        ["Uchrashuv o'tkazib, vazifa va muddatlarni taqsimlayman", 'Провожу встречу, распределяю задачи и сроки'],
        ["O'qituvchiga guruh a'zolari ishlamayotganini aytib, chora ko'rishini so'rayman", "Сообщаю преподавателю, что группа не работает, и прошу принять меры"],
        ["Kimdir boshlab berishini sabr bilan kutib turaman", 'Терпеливо жду, пока кто-нибудь начнёт']], 1],
      ["Jamoa a'zosi o'z vazifasini muddatida bajarmadi.", 'Член команды не выполнил свою часть в срок.', [
        ["Uni boshqalar oldida qattiq tanqid qilaman", 'Жёстко критикую его при всех'],
        ["Uning ishini indamay o'zim bajarib qo'yaman", 'Молча делаю его работу сам(а)'],
        ["Sababini so'rab, yordam taklif qilib, yangi muddat kelishamiz", 'Спрашиваю причину, предлагаю помощь, договариваемся о новом сроке'],
        ["Keyingi safar uni jamoaga umuman qo'shmayman", 'В следующий раз не беру его в команду']], 2],
      ['Notanish odamlar davrasiga tushib qoldingiz.', 'Вы оказались в компании незнакомых людей.', [
        ["Birinchi bo'lib salomlashib, umumiy mavzuda suhbat boshlayman", 'Первым(ой) здороваюсь и начинаю разговор на общую тему'],
        ["Kimdir menga murojaat qilmaguncha jim turaman, birinchi gapirish noqulay", "Молчу, пока ко мне не обратятся, — первым(ой) заговорить неловко"],
        ["Telefonimga qarab, vaqtni o'tkazib turaman", 'Смотрю в телефон, пережидаю время'],
        ["Tanish odam topib, faqat u bilan gaplashaman, shunda o'zimni erkin his qilaman", "Нахожу знакомого и общаюсь только с ним — так мне спокойнее"]], 0],
      ["Yig'ilishda ikki a'zo qizg'in bahslashib, ish to'xtab qoldi.", 'На собрании двое горячо спорят, работа встала.', [
        ["Ovozimni ko'tarib, ikkalasini jim bo'lishga va ishga qaytishga majbur qilaman", "Повышаю голос и заставляю обоих замолчать и вернуться к работе"],
        ["Bahsni to'xtatib, har birini qisqa tinglab, maqsadga qaytaman", 'Останавливаю спор, кратко выслушиваю каждого, возвращаю к цели'],
        ["Vaqtni tejash uchun ko'pchilik qaysi tomonda bo'lsa, o'sha tomonni yoqlayman", "Чтобы сэкономить время, поддерживаю ту сторону, где большинство"],
        ["Ular charchab, o'zlari to'xtaguncha kutib turaman", 'Жду, пока они устанут и сами остановятся']], 1],
      ['Siz bilan rozi bo\'lmagan suhbatdosh keskin gapirmoqda.', 'Несогласный с вами собеседник говорит резко.', [
        ["Unga xuddi shunday keskin javob qaytaraman, aks holda u meni hurmat qilmaydi", "Отвечаю так же резко, иначе он не будет меня уважать"],
        ["Suhbatni darhol to'xtatib, chiqib ketaman", 'Сразу прекращаю разговор и ухожу'],
        ["Xotirjam tinglab, fikrini aniqlab, so'ng dalilimni aytaman", 'Спокойно выслушиваю, уточняю его мысль, затем привожу довод'],
        ["Ziddiyat chiqmasin deb, uning gapiga qo'shilaman — munosabat muhimroq", "Соглашаюсь с ним, чтобы не было конфликта, — отношения важнее"]], 2],
      ['Tadbir tashkil qilishingiz kerak, vaqt esa kam.', 'Нужно организовать мероприятие, а времени мало.', [
        ["Darhol ishga kirishaman, reja ish jarayonida o'z-o'zidan shakllanib boradi", "Сразу берусь за дело — план сложится сам в процессе работы"],
        ["Asosiy vazifalar ro'yxatini tuzib, mas'ul va muddat belgilayman", 'Составляю список задач, назначаю ответственных и сроки'],
        ["Hamma ishni yolg'iz qilaman, chunki boshqalarga tushuntirishga vaqt ketadi", "Делаю всё сам(а), ведь объяснять другим — долго"],
        ["Sifatli o'tishi uchun tadbirni keyinroqqa qoldirishni so'rab ko'raman", "Ради качества прошу перенести мероприятие на более поздний срок"]], 1],
      ["Jamoaga yangi a'zo qo'shildi, u o'zini chetda his qilmoqda.", 'В команду пришёл новичок и чувствует себя чужим.', [
        ["U o'zi moslashib olishi kerak, deb hisoblayman", 'Считаю, что он должен освоиться сам'],
        ["Uni jamoa bilan tanishtirib, birinchi vazifada birga ishlayman", 'Знакомлю его с командой и работаю вместе над первой задачей'],
        ["Unga jamoa qoidalari yozilgan hujjatni beraman, xolos", 'Даю ему документ с правилами команды, и всё'],
        ["Unga faqat oddiy, kichik ishlarni berib turaman", 'Поручаю ему только мелкие простые дела']], 1],
      ["Guruh oldida chiqish qilishingiz kerak, siz hayajondasiz.", 'Вам нужно выступить перед группой, вы волнуетесь.', [
        ["Yaxshiroq gapiradigan boshqa birovdan men uchun chiqish qilishni so'rayman", "Прошу выступить вместо меня того, кто говорит лучше"],
        ["Xato qilmaslik uchun matnni to'liq yodlab, so'zma-so'z aytib beraman", "Чтобы не ошибиться, заучиваю текст и рассказываю слово в слово"],
        ["Asosiy fikrlarni rejalab, ovoz chiqarib mashq qilaman", 'Планирую ключевые мысли и репетирую вслух'],
        ["Tashkilotchilardan kechirim so'rab, chiqishimni bekor qildiraman", "Извиняюсь перед организаторами и прошу отменить выступление"]], 2]
    ],
    psy: [
      ['Mijoz: «Ishdan bo\'shatildim, endi oilamga nima deyishni bilmayman.»', 'Клиент: «Меня уволили, не знаю, что сказать семье».', [
        ["«Xavotir olmang, boshqa ish albatta topiladi.»", '«Не волнуйтесь, другая работа обязательно найдётся».'],
        ["«Siz sarosimadasiz va oilangiz oldida xijolat bo'lyapsiz.»", '«Вы растеряны, и вам неловко перед семьёй».'],
        ["«Sizni aynan nima uchun ishdan bo'shatishdi? Batafsil aytib bering-chi.»", "«А за что именно вас уволили? Расскажите подробнее»."],
        ["«Menimcha, oilangizga darhol hammasini aytishingiz kerak.»", '«По-моему, нужно сразу всё рассказать семье».']], 1],
      ['Talaba: «Hech kim meni tushunmaydi, hammasi befoyda.»', 'Студент: «Никто меня не понимает, всё бесполезно».', [
        ["«Unday demang, atrofingizda sizni yaxshi ko'radigan odamlar juda ko'p.»", "«Не говорите так, вокруг вас много людей, которые вас любят»."],
        ["«Bu juda yolg'iz va og'ir his. Ko'proq aytib bering.»", '«Это очень одинокое и тяжёлое чувство. Расскажите больше».'],
        ["«Hammaga shunday tuyuladi, bu vaqt o'tib o'tib ketadi.»", '«Всем так кажется, со временем пройдёт».'],
        ["«O'zingiz ochilmasangiz, odamlar sizni qanday tushunsin?»", '«Если вы сами не открываетесь, как вас поймут?»']], 1],
      ['Mijoz uzoq jim qoldi, ko\'zlarida yosh.', 'Клиент надолго замолчал, в глазах слёзы.', [
        ["Noqulaylik bo'lmasin deb, darhol keyingi savolga o'taman", 'Чтобы не было неловко, сразу перехожу к следующему вопросу'],
        ["«Yig'lamang, hammasi joyida bo'ladi», deb tinchlantiraman", 'Успокаиваю: «Не плачьте, всё будет хорошо»'],
        ["Shoshirmay jim kutaman, tayyor bo'lsa davom etamiz", 'Молча жду, не тороплю; продолжим, когда будет готов'],
        ["Mavzuni yengilroq narsaga burib, kayfiyatini ko'taraman", 'Перевожу разговор на лёгкую тему, чтобы поднять настроение']], 2],
      ['Mijoz: «Ota-onam meni doim akam bilan solishtiradi.»', 'Клиент: «Родители постоянно сравнивают меня со старшим братом».', [
        ["«Akangizdan aynan nimasi bilan farq qilasiz?»", '«А чем именно вы отличаетесь от брата?»'],
        ["«Ota-onalar shunaqa bo'ladi, ular yaxshilikni xohlaydi.»", '«Родители такие, они желают добра».'],
        ["«Ular uchun yetarlicha qadrli emasdek his qilasiz.»", '«Вы чувствуете себя недостаточно ценным для них».'],
        ["«Ularga bu sizga yoqmasligini ochiq aytishingiz kerak.»", '«Вам нужно прямо сказать им, что вам это неприятно».']], 2],
      ['Mijoz so\'radi: «Siz mening o\'rnimda bo\'lsangiz, nima qilardingiz?»', 'Клиент спрашивает: «А что бы вы сделали на моём месте?»', [
        ["«Men albatta ajrashgan bo'lardim», deb ochiq javob beraman", 'Прямо отвечаю: «Я бы точно развёлся(лась)»'],
        ["«Bu sizning qaroringiz, men unga aralasha olmayman», deb javob beraman", "Отвечаю: «Это ваше решение, я не могу в него вмешиваться»"],
        ["«Sizga qaysi yo'l yaqinroq, birga ko'rib chiqaylik», deyman", 'Говорю: «Давайте вместе посмотрим, какой путь ближе вам»'],
        ["Javob bermay, mavzuni o'zgartirib, boshqa savol beraman", 'Не отвечаю, меняю тему и задаю другой вопрос']], 2],
      ['Mijoz: «Imtihon oldidan juda qo\'rqaman, qo\'llarim titraydi.»', 'Клиент: «Перед экзаменом я очень боюсь, руки дрожат».', [
        ["«Qo'rqishga hojat yo'q, siz juda aqlli talabasiz.»", '«Бояться не нужно, вы очень умный студент».'],
        ["«Imtihon yaqinlashsa, xavotir tanangizda ham sezilyapti.»", '«Когда экзамен близко, тревога ощущается даже в теле».'],
        ["«Yaxshiroq tayyorlansangiz, qo'rquv o'z-o'zidan o'tib ketadi, ishoning.»", "«Подготовьтесь получше — и страх пройдёт сам, поверьте»."],
        ["«Men ham talabalikda xuddi shunday qo'rqardim.»", '«Я в студенчестве тоже так боялся(лась)».']], 1],
      ['Mijoz: «Boshlig\'im meni yomon ko\'radi, bu aniq.» (dalil keltirmayapti)', 'Клиент: «Начальник меня ненавидит, это точно». (без доводов)', [
        ["«Shunday deb o'ylashingizga nima sabab? Misol bera olasizmi?»", '«Что заставляет вас так думать? Можете привести пример?»'],
        ["«Siz noto'g'ri o'ylayapsiz, boshliqlar odatda xodimlarini yomon ko'rmaydi.»", "«Вы ошибаетесь: начальники обычно не ненавидят своих сотрудников»."],
        ["«Unday bo'lsa, boshqa ishga o'tishingiz kerak.»", '«Тогда вам стоит перейти на другую работу».'],
        ["«Boshlig'ingiz haqida yana nimalarni bilasiz?»", '«Что ещё вы знаете о своём начальнике?»']], 0],
      ["Birinchi uchrashuv: mijoz qisqa javob berib, ko'zini olib qochmoqda.", 'Первая встреча: клиент отвечает односложно и отводит взгляд.', [
        ["Gapirtirish uchun ketma-ket bir nechta aniq, yopiq savollar berib boraman", "Чтобы разговорить, задаю подряд несколько точных закрытых вопросов"],
        ["«Nega gapirmayapsiz?» deb to'g'ridan-to'g'ri so'rayman", 'Прямо спрашиваю: «Почему вы молчите?»'],
        ["Iliq muhit yaratib, ochiq savol beraman va shoshirmayman", 'Создаю тёплую атмосферу, задаю открытый вопрос и не тороплю'],
        ["Vaqtni tejash uchun avval batafsil anketani to'ldirib berishini so'rayman", "Чтобы сэкономить время, прошу сначала заполнить подробную анкету"]], 2],
      ["Mijoz o'z joniga qasd qilish haqida fikrlari borligini aytdi.", 'Клиент говорит, что у него бывают мысли о самоубийстве.', [
        ["Bu mavzuga to'xtalmay, kayfiyatini ko'tarishga urinaman", 'Не углубляюсь в тему, стараюсь поднять настроение'],
        ["Xotirjam tinglab, xavfni baholayman va yordamga yo'naltiraman", 'Спокойно выслушиваю, оцениваю риск и направляю за помощью'],
        ["Bunday fikrlar noto'g'ri ekanini aytib, uyaltiraman", 'Говорю, что такие мысли недопустимы, стыжу'],
        ["Maxfiylik uchun bu haqda hech kimga aytmay, kuzataman", 'Ради конфиденциальности никому не сообщаю и наблюдаю']], 1],
      ["Uchrashuv oxirida mijoz: «Rahmat, endi nima qilishni bilaman.»", 'В конце встречи клиент: «Спасибо, теперь я знаю, что делать».', [
        ["«Bu qarorga o'zingiz keldingiz. Birinchi qadam qachon?»", '«Вы сами пришли к этому решению. Когда первый шаг?»'],
        ["«Maslahatlarim foyda berganidan juda xursandman.»", '«Очень рад(а), что мои советы помогли».'],
        ["«Baribir yana bir necha marta kelishingiz shart, ish hali tugamagan.»", "«Всё равно вам нужно прийти ещё несколько раз, работа не закончена»."],
        ["«Yaxshi, demak, boshqa uchrashuvga hojat yo'q.»", '«Хорошо, значит, больше встречаться не нужно».']], 0]
    ]
  };

  // ---------- 3. Testlar ----------
  const DEF = {
    qob_ped: { sc: ['lrn', 'fair', 'lea'], sj: 'ped', min: 12,
      name: ['Pedagogik qobiliyat', 'Педагогические способности'],
      desc: ["O'qituvchilikka moyillik va tayyorgarlik: bilimga intilish, adolatlilik, tashkilotchilik hamda real pedagogik vaziyatlarda to'g'ri qaror qabul qilish.", 'Склонность и готовность к преподаванию: стремление к знаниям, справедливость, организаторские качества и верные решения в реальных педагогических ситуациях.'],
      sjn: ['Pedagogik vaziyatlar', 'Педагогические ситуации'],
      hi: ["Sizda pedagogik faoliyat uchun yaxshi asos bor: bilimga chanqoqlik, talabalarga adolatli munosabat va dars jarayonini tashkil eta olish. Pedagogik vaziyatlarda ko'pincha zamonaviy pedagogika tavsiya qiladigan yechimni tanlaysiz.", 'У вас хорошая основа для педагогической деятельности: жажда знаний, справедливое отношение к студентам и умение организовать учебный процесс. В педагогических ситуациях вы чаще выбираете решения, рекомендуемые современной педагогикой.'],
      mid: ["Pedagogik qobiliyatlaringiz o'rtacha darajada: ba'zi tarkibiy qismlar yaxshi rivojlangan, ba'zilari mashq talab qiladi. Bu qobiliyat tajriba va o'qish bilan tez o'sadi.", 'Педагогические способности на среднем уровне: одни компоненты развиты хорошо, другие требуют тренировки. Эта способность быстро растёт с опытом и обучением.'],
      lo: ["Hozircha pedagogik qobiliyatlar kuchsizroq ifodalangan. Bu sizning o'qituvchi bo'la olmasligingizni bildirmaydi — pedagogik mahorat ko'p jihatdan o'rganiladi. Ammo boshqa yo'nalishlar sizga osonroq bo'lishi mumkin.", 'Пока педагогические способности выражены слабее. Это не значит, что вы не сможете преподавать — мастерство во многом приобретается. Но другие направления могут даваться вам легче.'],
      tip: ["Tajribali o'qituvchilarning darslarini kuzating, o'z darsingizni videoga yozib tahlil qiling, \"formativ baholash\" va \"faol o'qitish\" usullarini o'rganing.", 'Посещайте занятия опытных преподавателей, записывайте и разбирайте свои уроки на видео, изучите методы формирующего оценивания и активного обучения.'],
      job: ["O'qituvchi, murabbiy (trener), tarbiyachi, korporativ trener, metodist, repetitor.", 'Преподаватель, тренер, воспитатель, корпоративный тренер, методист, репетитор.'] },
    qob_kom: { sc: ['scf', 'soc', 'lea'], sj: 'kom', min: 12,
      name: ['Kommunikativ va tashkilotchilik qobiliyati', 'Коммуникативные и организаторские способности'],
      desc: ["Odamlar bilan oson muloqot qilish, fikrni ishonch bilan ifodalash va guruhni maqsad sari uyushtira olish qobiliyati.", 'Способность легко общаться, уверенно выражать мысли и организовывать группу для достижения цели.'],
      sjn: ['Muloqot va tashkiliy vaziyatlar', 'Ситуации общения и организации'],
      hi: ["Siz odamlar bilan oson til topishasiz, o'z fikringizni ishonch bilan ifodalaysiz va guruh ishini uyushtira olasiz. Murakkab muloqot vaziyatlarida konstruktiv yo'lni tanlaysiz.", 'Вы легко находите общий язык с людьми, уверенно выражаете мысли и умеете организовать работу группы. В сложных ситуациях общения выбираете конструктивный путь.'],
      mid: ["Kommunikativ va tashkilotchilik qobiliyatlaringiz o'rtacha: tanish muhitda yaxshi ishlaysiz, lekin yangi yoki keskin vaziyatlarda o'zingizga ishonch kamayishi mumkin.", 'Коммуникативные и организаторские способности на среднем уровне: в привычной среде вы действуете хорошо, но в новых или острых ситуациях уверенность может снижаться.'],
      lo: ["Hozircha muloqot va tashkilotchilik sizga qiyinroq. Bu ko'nikmalar mashq bilan yaxshi rivojlanadi; ehtimol, mustaqil va chuqur diqqat talab qiladigan ishlar sizga ko'proq mos.", 'Пока общение и организация даются вам труднее. Эти навыки хорошо развиваются тренировкой; возможно, вам больше подходят самостоятельные задачи, требующие глубокой сосредоточенности.'],
      tip: ["Kichik guruh tadbirlarini tashkil qilishdan boshlang, nutq klubiga qatnashing, har uchrashuvdan keyin nima yaxshi o'tganini yozib boring.", 'Начните с организации небольших мероприятий, посещайте клуб публичных выступлений, после каждой встречи записывайте, что получилось.'],
      job: ["Menejer, loyiha rahbari, HR mutaxassisi, jurnalist, sotuv va mijozlar bilan ishlash, jamoat ishlari tashkilotchisi.", 'Менеджер, руководитель проектов, HR-специалист, журналист, продажи и работа с клиентами, организатор общественной работы.'] },
    qob_psy: { sc: ['si', 'kin', 'fair'], sj: 'psy', min: 12,
      name: ['Psixologik (konsultantlik) qobiliyat', 'Психологические (консультативные) способности'],
      desc: ["Odamni tushunish, empatiya, yaxshi tinglash va qiyin vaziyatdagi insonga to'g'ri javob bera olish — psixolog va konsultant uchun muhim qobiliyatlar.", 'Понимание людей, эмпатия, умение слушать и правильно отвечать человеку в трудной ситуации — ключевые способности психолога и консультанта.'],
      sjn: ['Konsultativ javoblar', 'Консультативные ответы'],
      hi: ["Siz odamlarning his-tuyg'ularini yaxshi sezasiz, ularga g'amxo'rlik qilasiz va qiyin vaziyatda maslahat yoki baho emas, tushunish va empatik javobni tanlaysiz — bu konsultantning asosiy mahorati.", 'Вы хорошо чувствуете эмоции людей, заботитесь о них и в трудной ситуации выбираете не совет или оценку, а понимание и эмпатический ответ — главное умение консультанта.'],
      mid: ["Odamlarni tushunish va empatiya qobiliyatingiz o'rtacha. Ko'pincha samimiy yordam berishga intilasiz, lekin ba'zan tayyor maslahat yoki tasalli berishga shoshilasiz.", 'Способность понимать людей и эмпатия на среднем уровне. Вы искренне стремитесь помочь, но иногда торопитесь дать готовый совет или утешение.'],
      lo: ["Hozircha konsultativ qobiliyatlar kuchsizroq. Qiyin vaziyatda ko'proq maslahat, baho yoki mavzuni o'zgartirishga moyilsiz. Faol tinglash va empatiya — o'rganiladigan ko'nikmalar.", 'Пока консультативные способности выражены слабее. В трудной ситуации вы чаще советуете, оцениваете или меняете тему. Активное слушание и эмпатия — навыки, которым можно научиться.'],
      tip: ["Faol tinglash (parafraz, his-tuyg'ularni aks ettirish) mashqlarini kundalik suhbatlarda qo'llang; K. Rojers va R. Kochyunas asarlarini o'qing; supervizor bilan ishlang.", 'Применяйте в повседневных разговорах приёмы активного слушания (перефразирование, отражение чувств); читайте К. Роджерса и Р. Кочюнаса; работайте с супервизором.'],
      job: ["Psixolog, psixolog-konsultant, ijtimoiy ishchi, HR, pedagog-psixolog, tibbiyot va xizmat ko'rsatish sohalari.", 'Психолог, психолог-консультант, социальный работник, HR, педагог-психолог, медицина и сфера услуг.'] },
    qob_ijod: { sc: ['ori', 'cur'], aut: true, min: 10,
      name: ['Ijodiy (kreativ) qobiliyat', 'Творческие (креативные) способности'],
      desc: ["Yangi va o'zgacha g'oyalar topish, nostandart fikrlash va qiziquvchanlik. O'zini baholash va vaqtli ijodiy topshiriqdan iborat.", 'Умение находить новые и необычные идеи, нестандартное мышление и любознательность. Самооценка и творческое задание на время.'],
      sjn: ["Ijodiy topshiriq (g'oyalar soni)", 'Творческое задание (число идей)'],
      hi: ["Siz g'oyalarga boy, qiziquvchan va nostandart fikrlaysiz. Qisqa vaqt ichida ko'p va turli xil g'oyalar topa olasiz.", 'Вы богаты идеями, любознательны и мыслите нестандартно. За короткое время находите много разнообразных идей.'],
      mid: ["Ijodiy qobiliyatingiz o'rtacha: kerak bo'lganda yangi yechim topasiz, lekin ko'pincha sinalgan yo'lni afzal ko'rasiz.", 'Творческие способности на среднем уровне: при необходимости находите новое решение, но чаще предпочитаете проверенный путь.'],
      lo: ["Hozircha ijodiy fikrlash kamroq namoyon bo'ladi — ehtimol, siz aniq qoidali, tartibli ishlarda kuchliroqsiz. Kreativlikni maxsus mashqlar bilan rivojlantirish mumkin.", 'Пока творческое мышление проявляется меньше — возможно, вы сильнее в чётких, упорядоченных задачах. Креативность можно развивать специальными упражнениями.'],
      tip: ["Har kuni 5 daqiqa \"bitta narsaning 10 ta qo'llanilishi\" mashqini qiling, aqliy hujum qoidalarini o'rganing, g'oyalar daftarini yuriting.", 'Каждый день 5 минут делайте упражнение «10 способов применить один предмет», изучите правила мозгового штурма, ведите блокнот идей.'],
      job: ["Dizayner, reklama va marketing, muhandis-ixtirochi, yozuvchi, jurnalist, tadbirkor, arxitektor, ilmiy tadqiqotchi.", 'Дизайнер, реклама и маркетинг, инженер-изобретатель, писатель, журналист, предприниматель, архитектор, исследователь.'] }
  };
  window.PL_QOB = DEF;
  const AUT = [
    { o: ["G'isht", 'Кирпич'], common: ['qur', 'uy', 'devor', 'bino', 'строи', 'дом', 'стен', 'здан'] },
    { o: ['Plastik shisha (butilka)', 'Пластиковая бутылка'], common: ['suv', 'ichimlik', 'quy', 'вод', 'напит', 'налив'] }
  ];
  const AUT_SEC = 120;

  const OPTS = () => lang === 'ru' ? ['Совсем не про меня', 'Скорее не про меня', 'Нечто среднее', 'Скорее про меня', 'Точно про меня'] : ["Menga umuman mos emas", "Ko'proq mos emas", "O'rtacha", "Ko'proq mos", "Menga to'liq mos"];
  const lv = p => p >= 85 ? 4 : p >= 70 ? 3 : p >= 50 ? 2 : 1;
  const lvName = l => [null, L('past', 'низкий'), L("o'rtacha", 'средний'), L('yuqori', 'высокий'), L('juda yuqori', 'очень высокий')][l];

  function itemsOf(id) {
    const d = DEF[id], out = [];
    const max = Math.max(...d.sc.map(s => SC[s].it.length));
    for (let k = 0; k < max; k++) d.sc.forEach(s => { const it = SC[s].it[k]; if (it) out.push([it[0], it[1], s, it[2]]); });
    return out;
  }
  // ---------- To'liq batareya: 4 qobiliyat bitta testda ----------
  const ALL_SC = ['lrn', 'fair', 'lea', 'scf', 'soc', 'si', 'kin', 'ori', 'cur'];
  const ALL_SJ = ['ped', 'kom', 'psy'];
  const ALL_AB = ['qob_ped', 'qob_kom', 'qob_psy', 'qob_ijod'];
  const ALLNAME = ['Qobiliyatlar diagnostikasi (to\'liq)', 'Диагностика способностей (полная)'];
  function allItems() {
    const out = [], max = Math.max(...ALL_SC.map(s => SC[s].it.length));
    for (let k = 0; k < max; k++) ALL_SC.forEach(s => { const it = SC[s].it[k]; if (it) out.push([it[0], it[1], s, it[2]]); });
    return out;
  }
  {
    const it = allItems();
    TESTS.qob_all = { name: { uz: ALLNAME[0], ru: ALLNAME[1] },
      desc: { uz: "Pedagogik, kommunikativ-tashkilotchilik, psixologik (konsultantlik) va ijodiy qobiliyatlaringizni bitta testda aniqlaydi va ularni o'zaro solishtirib, sizga eng mos yo'nalishni ko'rsatadi.", ru: 'Определяет педагогические, коммуникативно-организаторские, психологические (консультативные) и творческие способности в одном тесте, сравнивает их и показывает наиболее подходящее направление.' },
      instr: { uz: '', ru: '' }, minutes: 30,
      items: { uz: it.map(x => x[0]).concat(...ALL_SJ.map(k => SJ[k].map(x => x[0])), AUT.map(x => x.o[0])), ru: it.map(x => x[1]).concat(...ALL_SJ.map(k => SJ[k].map(x => x[1])), AUT.map(x => x.o[1])) },
      options: { uz: OPTS(), ru: OPTS() }, bands: [], reverse: [], source: 'IPIP (ipip.ori.org) + PsixoLab' };
  }
  Object.entries(DEF).forEach(([id, d]) => {
    const it = itemsOf(id);
    TESTS[id] = { name: { uz: d.name[0], ru: d.name[1] }, desc: { uz: d.desc[0], ru: d.desc[1] }, instr: { uz: '', ru: '' }, minutes: d.min,
      items: { uz: it.map(x => x[0]).concat(d.sj ? SJ[d.sj].map(x => x[0]) : AUT.map(x => x.o[0])), ru: it.map(x => x[1]).concat(d.sj ? SJ[d.sj].map(x => x[1]) : AUT.map(x => x.o[1])) },
      options: { uz: OPTS(), ru: OPTS() }, bands: [], reverse: [], source: 'IPIP (ipip.ori.org) + PsixoLab' };
  });

  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let S = null; // joriy urinish holati

  function view(id) {
    const d = DEF[id], items = itemsOf(id), opts = OPTS();
    S = { id, t0: Date.now(), likert: null, sj: d.sj ? SJ[d.sj].map(() => shuffle([0, 1, 2, 3])) : null, aut: [] };
    app.innerHTML = `
      <a href="#tests">← ${t('back')}</a>
      <h1>${esc(d.name[lang === 'ru' ? 1 : 0])}</h1>
      <p><strong>${t('instructionPrefix')}</strong> ${esc(L(`Test ikki qismdan iborat. 1-qism: ${items.length} ta fikr — har biri sizga qanchalik mos kelishini belgilang (qanday bo'lishni xohlashingizni emas, odatda qandayligingizni). 2-qism: ${d.aut ? "vaqtli ijodiy topshiriq" : SJ[d.sj].length + ' ta real vaziyat — har birida eng to\'g\'ri deb hisoblagan javobingizni tanlang'}.`, `Тест из двух частей. Часть 1: ${items.length} утверждений — отметьте, насколько каждое про вас (какой вы обычно, а не каким хотели бы быть). Часть 2: ${d.aut ? 'творческое задание на время' : SJ[d.sj].length + ' реальных ситуаций — выберите ответ, который считаете наилучшим'}.`))}</p>
      <div class="progress"><div id="prog" style="width:0%"></div></div>
      <form id="qform">
        <h2 class="qb-part">1. ${L("O'zini baholash", 'Самооценка')}</h2>
        ${items.map((it, i) => `<div class="question" data-k="l${i}"><p>${i + 1}. ${esc(lang === 'ru' ? it[1] : it[0])}</p>
          <div class="options">${opts.map((o, v) => `<label><input type="radio" name="l${i}" value="${v + 1}">${esc(o)}</label>`).join('')}</div></div>`).join('')}
        ${d.sj ? `<h2 class="qb-part">2. ${esc(d.sjn[lang === 'ru' ? 1 : 0])}</h2>
          <p class="meta">${esc(L("Har bir vaziyatda siz eng to'g'ri deb hisoblagan bitta javobni tanlang.", 'В каждой ситуации выберите один ответ, который считаете наилучшим.'))}</p>
          ${SJ[d.sj].map((q, i) => `<div class="question qb-sj" data-k="s${i}"><p><b>${i + 1}.</b> ${esc(lang === 'ru' ? q[1] : q[0])}</p>
            <div class="qb-opts">${S.sj[i].map((oi, j) => `<label><input type="radio" name="s${i}" value="${oi}"><span class="qb-l">${'ABCD'[j]}</span><span>${esc(q[2][oi][lang === 'ru' ? 1 : 0])}</span></label>`).join('')}</div></div>`).join('')}` : ''}
        <p id="qerr" class="notice danger" hidden>${esc(t('answerAll'))}</p>
        <button class="btn" type="submit">${d.aut ? L("Davom etish: ijodiy topshiriq →", 'Далее: творческое задание →') : t('submit')}</button>
      </form>
      <p class="meta">${esc(L("1-qism manbasi: International Personality Item Pool (ipip.ori.org) — ochiq foydalanishdagi ilmiy shkalalar, PsixoLab tarjimasi. 2-qism PsixoLab tomonidan tuzilgan.", 'Источник части 1: International Personality Item Pool (ipip.ori.org) — открытые научные шкалы, перевод PsixoLab. Часть 2 составлена PsixoLab.'))}</p>`;
    const form = $('qform'), keys = items.map((_, i) => 'l' + i).concat(d.sj ? SJ[d.sj].map((_, i) => 's' + i) : []);
    form.addEventListener('change', e => {
      $('prog').style.width = (keys.filter(k => form.querySelector(`input[name=${k}]:checked`)).length / keys.length * 100) + '%';
      const q = e.target.closest('.question'); if (q) q.classList.remove('miss');
    });
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const miss = keys.filter(k => !form.querySelector(`input[name=${k}]:checked`));
      if (miss.length) { $('qerr').hidden = false; miss.forEach(k => form.querySelector(`.question[data-k="${k}"]`).classList.add('miss')); form.querySelector(`.question[data-k="${miss[0]}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      S.likert = items.map((_, i) => +form.querySelector(`input[name=l${i}]:checked`).value);
      if (d.sj) { S.sjAns = SJ[d.sj].map((_, i) => +form.querySelector(`input[name=s${i}]:checked`).value); finish(); }
      else autTask(0);
    });
  }

  function autTask(n) {
    const a = AUT[n]; let left = AUT_SEC;
    app.innerHTML = `
      <h1>${esc((S.all ? ALLNAME : DEF[S.id].name)[lang === 'ru' ? 1 : 0])}</h1>
      <div class="card">
        <p class="meta">${S.all ? L('Ijodiy topshiriq', 'Творческое задание') : L('2-qism: ijodiy topshiriq', 'Часть 2: творческое задание')} · ${n + 1}/${AUT.length}</p>
        <h2>${esc(L(`«${a.o[0]}»ni qanday maqsadlarda ishlatish mumkin?`, `Как можно использовать предмет «${a.o[1]}»?`))}</h2>
        <p>${esc(L(`${AUT_SEC / 60} daqiqa ichida iloji boricha ko'p va turli xil, odatiy bo'lmagan qo'llanish usullarini yozing — har bir g'oyani yangi qatorga. G'oya qanchalik g'ayrioddiy bo'lsa, shuncha yaxshi.`, `За ${AUT_SEC / 60} минуты напишите как можно больше разных, необычных способов применения — каждую идею с новой строки. Чем необычнее идея, тем лучше.`))}</p>
        <div class="qb-aut-top"><span id="acnt">0 ${L("ta g'oya", 'идей')}</span><span class="qb-timer" id="atime">${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</span></div>
        <textarea id="aut" class="qb-aut" rows="10" placeholder="${esc(L('1-g\'oya\n2-g\'oya\n…', 'идея 1\nидея 2\n…'))}"></textarea>
        <div class="row-actions"><button class="btn" id="anext">${L('Tayyor', 'Готово')}</button></div>
      </div>`;
    const ta = $('aut'); ta.focus();
    const ideas = () => [...new Set(ta.value.split('\n').map(s => s.trim().toLowerCase().replace(/^[\d\-–•.)\s]+/, '')).filter(s => s.length >= 3))];
    ta.addEventListener('input', () => { $('acnt').textContent = `${ideas().length} ${L("ta g'oya", 'идей')}`; });
    const done = () => {
      clearInterval(iv); if (S.done) return;
      const list = ideas();
      const orig = list.filter(s => !a.common.some(c => s.includes(c))).length;
      S.aut[n] = { n: list.length, orig, list: list.slice(0, 40) };
      if (n + 1 < AUT.length) autTask(n + 1); else (S.all ? finishAll() : finish());
    };
    const iv = setInterval(() => {
      if (!$('aut')) { clearInterval(iv); return; }
      left--; $('atime').textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; $('atime').classList.toggle('low', left <= 15);
      if (left <= 0) done();
    }, 1000);
    $('anext').addEventListener('click', done);
  }

  function finish() {
    const id = S.id, d = DEF[id], items = itemsOf(id);
    const scales = d.sc.map(s => { let sum = 0, n = 0; items.forEach((it, i) => { if (it[2] === s) { sum += it[3] > 0 ? S.likert[i] : 6 - S.likert[i]; n++; } }); const m = sum / n; return { s, m: Math.round(m * 100) / 100, p: Math.round((m - 1) / 4 * 100) }; });
    const self = Math.round(scales.reduce((a, b) => a + b.p, 0) / scales.length);
    let prac, pracDet;
    if (d.sj) { const ok = S.sjAns.filter((a, i) => a === SJ[d.sj][i][3]).length; prac = Math.round(ok / SJ[d.sj].length * 100); pracDet = { ok, n: SJ[d.sj].length }; }
    else { const tot = S.aut.reduce((a, b) => a + b.n, 0), orig = S.aut.reduce((a, b) => a + b.orig, 0); const per = tot / AUT.length;
      // vaqtinchalik me'yor: 2 daqiqada ~4 g'oya — past, ~8 — o'rtacha, 12+ — yuqori (kattalar uchun xalqaro tadqiqotlarga yaqin)
      prac = Math.max(0, Math.min(100, Math.round(per / 14 * 85 + (tot ? orig / tot * 15 : 0)))); pracDet = { tot, orig, per: Math.round(per * 10) / 10 }; }
    const index = Math.round(self * 0.5 + prac * 0.5);
    const flags = []; if (new Set(S.likert).size === 1) flags.push('same'); const sec = Math.round((Date.now() - S.t0) / 1000); if (sec < items.length * 2) flags.push('fast');
    saveResult({ type: 'test', id, index, self, prac, sc: scales.map(x => [x.s, x.p]), pd: pracDet, valid: flags.length ? 0 : 1, flags: flags.join(','), time: sec });
    S.done = true;
    show(id, scales, self, prac, pracDet, index, flags);
  }

  function show(id, scales, self, prac, pd, index, flags) {
    const d = DEF[id], R = lang === 'ru' ? 1 : 0, l = lv(index);
    const txt = l >= 3 ? d.hi : l === 2 ? d.mid : d.lo;
    const bar = (name, p, extra, col) => `<div class="qb-row"><span>${esc(name)}</span><div class="qb-bar"><i style="width:${Math.max(2, p)}%;background:${col || 'var(--accent)'}"></i></div><b>${p}%</b><em>${esc(extra || lvName(lv(p)))}</em></div>`;
    const pracLabel = d.sj ? L(`${pd.ok}/${pd.n} to'g'ri`, `${pd.ok}/${pd.n} верно`) : L(`${pd.tot} ta g'oya, ${pd.orig} tasi odatiy emas`, `${pd.tot} идей, ${pd.orig} необычных`);
    app.innerHTML = `
      <h1>${esc(d.name[R])}</h1>
      ${flags.length ? `<div class="notice warn">${esc(L("Javoblar juda tez yoki bir xil berilgan — natija ishonchsiz bo'lishi mumkin. Shoshilmasdan qayta topshirib ko'ring.", 'Ответы даны слишком быстро или одинаково — результат может быть недостоверным. Попробуйте пройти ещё раз, не торопясь.'))}</div>` : ''}
      <div class="card qb-res">
        <div class="qb-index lv${l}"><b>${index}</b><span>${esc(lvName(l))}</span></div>
        <div class="qb-bars">
          <p class="meta">${L("Qobiliyat indeksi (0–100) — o'zini baholash va amaliy qism natijalarining o'rtachasi.", 'Индекс способности (0–100) — среднее самооценки и практической части.')}</p>
          ${scales.map(x => bar(SC[x.s].n[R], x.p)).join('')}
          ${bar(d.sjn[R], prac, pracLabel, '#2BA88F')}
        </div>
      </div>
      <div class="conclusion">
        <h2>${L('Xulosa', 'Заключение')}</h2>
        <p>${esc(txt[R])}</p>
        ${Math.abs(self - prac) >= 25 ? `<p><strong>${L("E'tibor bering", 'Обратите внимание')}:</strong> ${esc(self > prac ? L("O'zingizni baholashingiz amaliy natijadan ancha yuqori. Ehtimol, bu qobiliyatni amalda qo'llash ko'nikmasi hali shakllanmoqda — amaliy mashqlar foydali bo'ladi.", 'Ваша самооценка заметно выше практического результата. Возможно, навык применения способности ещё формируется — полезна практика.') : L("Amaliy natijangiz o'zingizni baholashingizdan yuqori — siz o'z imkoniyatlaringizni kamsitayotgan bo'lishingiz mumkin.", 'Практический результат выше вашей самооценки — возможно, вы недооцениваете свои возможности.'))}</p>` : ''}
        <p><strong>${L('Rivojlantirish uchun', 'Для развития')}:</strong> ${esc(d.tip[R])}</p>
        <p><strong>${L('Mos sohalar', 'Подходящие сферы')}:</strong> ${esc(d.job[R])}</p>
        ${d.sj ? sjReview(d) : autReview()}
        <p class="meta">${esc(L(`O'zini baholash shkalalari xalqaro tadqiqotlarda ishonchliligi tekshirilgan (Kronbax alfasi: ${scales.map(x => SC[x.s].a.toFixed(2).replace('0.', '0,')).join(', ')}). O'zbek aholisi uchun normalar hali yo'q, darajalar taxminiy. Amaliy qism ishonchliligi foydalanuvchilar ma'lumoti asosida hisoblanadi. Natija kasb tanlash bo'yicha yakuniy qaror emas — psixolog bilan muhokama qiling.`, `Шкалы самооценки проверены на надёжность в международных исследованиях (альфа Кронбаха: ${scales.map(x => SC[x.s].a.toFixed(2).replace('0.', '0,')).join(', ')}). Норм для населения Узбекистана пока нет, уровни ориентировочные. Надёжность практической части рассчитывается по данным пользователей. Результат не является окончательным решением о выборе профессии — обсудите его с психологом.`))}</p>
      </div>
      <div class="row-actions"><a class="btn" href="#test/${id}" onclick="setTimeout(route,0)">${t('retake')}</a><button class="btn secondary" onclick="window.print()">${L('Chop etish / PDF', 'Печать / PDF')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
    window.scrollTo(0, 0);
  }
  function sjReview(d) {
    const R = lang === 'ru' ? 1 : 0, Q = SJ[d.sj];
    return `<details class="qb-rev"><summary>${L("Vaziyatlar bo'yicha javoblaringiz tahlili", 'Разбор ваших ответов по ситуациям')}</summary><ol>${Q.map((q, i) => { const a = S.sjAns[i], ok = a === q[3]; return `<li class="${ok ? 'ok' : 'bad'}"><b>${ok ? '✓' : '✗'}</b> ${esc(q[R])}<br><small>${ok ? '' : `${L('Sizning javobingiz', 'Ваш ответ')}: ${esc(q[2][a][R])}<br>`}${L('Tavsiya etiladigan javob', 'Рекомендуемый ответ')}: ${esc(q[2][q[3]][R])}</small></li>`; }).join('')}</ol></details>`;
  }
  function autReview() {
    return `<details class="qb-rev"><summary>${L("G'oyalaringiz", 'Ваши идеи')}</summary>${S.aut.map((x, i) => `<p><b>${esc(AUT[i].o[lang === 'ru' ? 1 : 0])}</b> (${x.n}): ${esc(x.list.join('; ') || '—')}</p>`).join('')}</details>`;
  }

  // ===== To'liq batareya =====
  const PER = 21;
  function viewAll() {
    const items = allItems();
    S = { all: true, id: 'qob_all', t0: Date.now(), likert: Array(items.length).fill(0), sjOrd: {}, sjAns: {}, aut: [], page: 0 };
    ALL_SJ.forEach(k => { S.sjOrd[k] = SJ[k].map(() => shuffle([0, 1, 2, 3])); S.sjAns[k] = Array(SJ[k].length).fill(-1); });
    allPage();
  }
  function allPages() { const n = Math.ceil(allItems().length / PER); return { lik: n, total: n + ALL_SJ.length + 1 }; }
  function allPage() {
    const items = allItems(), P = allPages(), p = S.page, opts = OPTS(), Rr = lang === 'ru' ? 1 : 0;
    const head = `<a href="#tests">← ${t('back')}</a><h1>${esc(ALLNAME[Rr])}</h1>
      <div class="pf-top"><span>${L('Bosqich', 'Этап')} ${p + 1} / ${P.total}</span><span>${p < P.lik ? L("O'zini baholash", 'Самооценка') : p < P.lik + ALL_SJ.length ? L('Amaliy vaziyatlar', 'Практические ситуации') : L('Ijodiy topshiriq', 'Творческое задание')}</span></div>
      <div class="progress"><div style="width:${p / P.total * 100}%"></div></div>`;
    let body = '', keys = [];
    if (p < P.lik) {
      const from = p * PER, to = Math.min(items.length, from + PER);
      body = (p === 0 ? `<p><strong>${t('instructionPrefix')}</strong> ${esc(L(`Test 3 qismdan iborat: (1) ${items.length} ta fikr bo'yicha o'zini baholash, (2) ${ALL_SJ.reduce((a, k) => a + SJ[k].length, 0)} ta real vaziyat, (3) 4 daqiqalik ijodiy topshiriq. Jami taxminan 30 daqiqa. Odatda qanday ekanligingizni baholang, uzoq o'ylamang.`, `Тест из 3 частей: (1) самооценка по ${items.length} утверждениям, (2) ${ALL_SJ.reduce((a, k) => a + SJ[k].length, 0)} реальных ситуаций, (3) творческое задание на 4 минуты. Всего около 30 минут. Оценивайте, какой вы обычно, не раздумывайте долго.`))}</p>` : '') +
        items.slice(from, to).map((it, k) => { const i = from + k; keys.push('l' + i); return `<div class="question" data-k="l${i}"><p>${i + 1}. ${esc(it[Rr])}</p>
          <div class="options">${opts.map((o, v) => `<label><input type="radio" name="l${i}" value="${v + 1}" ${S.likert[i] === v + 1 ? 'checked' : ''}>${esc(o)}</label>`).join('')}</div></div>`; }).join('');
    } else if (p < P.lik + ALL_SJ.length) {
      const k = ALL_SJ[p - P.lik], d = DEF['qob_' + k];
      body = `<h2 class="qb-part">${esc(d.sjn[Rr])}</h2><p class="meta">${esc(L("Har bir vaziyatda siz eng to'g'ri deb hisoblagan bitta javobni tanlang.", 'В каждой ситуации выберите один ответ, который считаете наилучшим.'))}</p>` +
        SJ[k].map((q, i) => { keys.push(`s${k}${i}`); return `<div class="question qb-sj" data-k="s${k}${i}"><p><b>${i + 1}.</b> ${esc(q[Rr])}</p>
          <div class="qb-opts">${S.sjOrd[k][i].map((oi, j) => `<label><input type="radio" name="s${k}${i}" value="${oi}" ${S.sjAns[k][i] === oi ? 'checked' : ''}><span class="qb-l">${'ABCD'[j]}</span><span>${esc(q[2][oi][Rr])}</span></label>`).join('')}</div></div>`; }).join('');
    } else {
      app.innerHTML = head + `<div class="card"><h2>${L('Ijodiy topshiriq', 'Творческое задание')}</h2><p>${esc(L(`Keyingi ikki ekranda har biriga ${AUT_SEC / 60} daqiqa beriladi: berilgan narsaning iloji boricha ko'p va g'ayrioddiy qo'llanish usullarini yozasiz. Taymer "Boshlash"ni bosganingizda ishga tushadi.`, `На следующих двух экранах по ${AUT_SEC / 60} минуты: нужно написать как можно больше необычных способов применения предмета. Таймер запустится после нажатия «Начать».`))}</p>
        <div class="row-actions"><button class="btn secondary" id="aprev">← ${L('Oldingi', 'Назад')}</button><button class="btn" id="ago">${L('Boshlash', 'Начать')}</button></div></div>`;
      $('aprev').addEventListener('click', () => { S.page--; allPage(); window.scrollTo(0, 0); });
      $('ago').addEventListener('click', () => autTask(0));
      window.scrollTo(0, 0); return;
    }
    app.innerHTML = head + `<form id="aform">${body}<p id="aerr" class="notice danger" hidden>${esc(t('answerAll'))}</p>
      <div class="row-actions">${p > 0 ? `<button class="btn secondary" type="button" id="aprev">← ${L('Oldingi', 'Назад')}</button>` : ''}<button class="btn" type="submit">${L('Keyingi', 'Далее')} →</button></div></form>
      ${p === 0 ? `<p class="meta">${esc(L("O'zini baholash qismi: International Personality Item Pool (ipip.ori.org) ochiq shkalalari, PsixoLab tarjimasi. Vaziyatlar va ijodiy topshiriq PsixoLab tomonidan tuzilgan.", 'Самооценка: открытые шкалы International Personality Item Pool (ipip.ori.org), перевод PsixoLab. Ситуации и творческое задание составлены PsixoLab.'))}</p>` : ''}`;
    const form = $('aform');
    const store = () => keys.forEach(k => { const c = form.querySelector(`input[name=${k}]:checked`); if (!c) return; if (k[0] === 'l') S.likert[+k.slice(1)] = +c.value; else { const set = ALL_SJ.find(x => k.startsWith('s' + x)); S.sjAns[set][+k.slice(1 + set.length)] = +c.value; } });
    form.addEventListener('change', e => { const q = e.target.closest('.question'); if (q) q.classList.remove('miss'); });
    form.addEventListener('submit', ev => {
      ev.preventDefault(); store();
      const miss = keys.filter(k => !form.querySelector(`input[name=${k}]:checked`));
      if (miss.length) { $('aerr').hidden = false; miss.forEach(k => form.querySelector(`.question[data-k="${k}"]`).classList.add('miss')); form.querySelector(`.question[data-k="${miss[0]}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      S.page++; allPage(); window.scrollTo(0, 0);
    });
    if ($('aprev')) $('aprev').addEventListener('click', () => { store(); S.page--; allPage(); window.scrollTo(0, 0); });
  }

  function autScore(aut) {
    const tot = aut.reduce((a, b) => a + b.n, 0), orig = aut.reduce((a, b) => a + b.orig, 0), per = tot / AUT.length;
    return { p: Math.max(0, Math.min(100, Math.round(per / 14 * 85 + (tot ? orig / tot * 15 : 0)))), pd: { tot, orig, per: Math.round(per * 10) / 10 } };
  }
  function finishAll() {
    const items = allItems(), sec = Math.round((Date.now() - S.t0) / 1000);
    const sp = {}; ALL_SC.forEach(s => { let sum = 0, n = 0; items.forEach((it, i) => { if (it[2] === s) { sum += it[3] > 0 ? S.likert[i] : 6 - S.likert[i]; n++; } }); sp[s] = Math.round((sum / n - 1) / 4 * 100); });
    const flags = []; if (new Set(S.likert).size === 1) flags.push('same'); if (sec < items.length * 2 + 240) flags.push('fast');
    const ab = {};
    ALL_AB.forEach(id => {
      const d = DEF[id], self = Math.round(d.sc.reduce((a, s) => a + sp[s], 0) / d.sc.length);
      let prac, pd;
      if (d.sj) { const ok = S.sjAns[d.sj].filter((a, i) => a === SJ[d.sj][i][3]).length; prac = Math.round(ok / SJ[d.sj].length * 100); pd = { ok, n: SJ[d.sj].length }; }
      else { const a = autScore(S.aut); prac = a.p; pd = a.pd; }
      ab[id] = { index: Math.round(self * 0.5 + prac * 0.5), self, prac, pd, sc: d.sc.map(s => [s, sp[s]]) };
      saveResult({ type: 'test', id, ...ab[id], valid: flags.length ? 0 : 1, flags: flags.join(','), time: sec, fromAll: 1 });
    });
    saveResult({ type: 'test', id: 'qob_all', ab: Object.fromEntries(ALL_AB.map(id => [id, ab[id].index])), valid: flags.length ? 0 : 1, flags: flags.join(','), time: sec });
    S.done = true;
    showAll(ab, sp, flags);
  }
  function showAll(ab, sp, flags) {
    const Rr = lang === 'ru' ? 1 : 0, ord = ALL_AB.slice().sort((a, b) => ab[b].index - ab[a].index), top = ord[0], low = ord[ord.length - 1];
    const COL = { qob_ped: '#5B47E0', qob_kom: '#F5A524', qob_psy: '#2BA88F', qob_ijod: '#FF6F91' };
    const second = ord[1], close = ab[top].index - ab[second].index <= 5;
    const bar = (name, p, extra, col) => `<div class="qb-row"><span>${esc(name)}</span><div class="qb-bar"><i style="width:${Math.max(2, p)}%;background:${col || 'var(--accent)'}"></i></div><b>${p}%</b><em>${esc(extra || lvName(lv(p)))}</em></div>`;
    app.innerHTML = `
      <h1>${esc(ALLNAME[Rr])}</h1>
      ${flags.length ? `<div class="notice warn">${esc(L("Javoblar juda tez yoki bir xil berilgan — natija ishonchsiz bo'lishi mumkin.", 'Ответы даны слишком быстро или одинаково — результат может быть недостоверным.'))}</div>` : ''}
      <div class="card">
        <h2>${L('Qobiliyatlar profili', 'Профиль способностей')}</h2>
        <div class="qa-grid">${ord.map((id, i) => `<div class="qa-card ${i === 0 ? 'qa-first' : ''}" style="--c:${COL[id]}"><span class="qa-rank">${i + 1}</span><b>${ab[id].index}</b><span>${esc(DEF[id].name[Rr])}</span><em>${esc(lvName(lv(ab[id].index)))}</em></div>`).join('')}</div>
        <p class="meta">${L("Indeks (0–100) — o'zini baholash va amaliy qism natijalarining o'rtachasi.", 'Индекс (0–100) — среднее самооценки и практической части.')}</p>
      </div>
      <div class="conclusion">
        <h2>${L('Xulosa', 'Заключение')}</h2>
        <p>${close
          ? esc(L(`Sizda ikki qobiliyat deyarli teng darajada kuchli: «${DEF[top].name[0]}» (${ab[top].index}) va «${DEF[second].name[0]}» (${ab[second].index}). Bu ikkala yo'nalishni birlashtiradigan kasblar sizga ayniqsa mos keladi.`, `У вас почти одинаково сильны две способности: «${DEF[top].name[1]}» (${ab[top].index}) и «${DEF[second].name[1]}» (${ab[second].index}). Вам особенно подойдут профессии, объединяющие оба направления.`))
          : esc(L(`Eng kuchli qobiliyatingiz — «${DEF[top].name[0]}» (${ab[top].index}/100, ${lvName(lv(ab[top].index))}).`, `Ваша самая сильная способность — «${DEF[top].name[1]}» (${ab[top].index}/100, ${lvName(lv(ab[top].index))}).`))}</p>
        <p>${esc((lv(ab[top].index) >= 3 ? DEF[top].hi : lv(ab[top].index) === 2 ? DEF[top].mid : DEF[top].lo)[Rr])}</p>
        <p><b>${L('Mos sohalar', 'Подходящие сферы')}:</b> ${esc(DEF[top].job[Rr])}${close ? ' ' + esc(DEF[second].job[Rr]) : ''}</p>
        ${ab[low].index < 50 ? `<p><b>${L('Rivojlantirish kerak', 'Стоит развивать')} — ${esc(DEF[low].name[Rr])} (${ab[low].index}):</b> ${esc(DEF[low].tip[Rr])}</p>` : ''}
        <p class="meta">${esc(L("O'zini baholash shkalalari xalqaro tadqiqotlarda ishonchliligi tekshirilgan IPIP shkalalari (Kronbax alfasi 0,70–0,87). O'zbek normalari hali yo'q, darajalar taxminiy; amaliy qism ishonchliligi ma'lumot to'plangach hisoblanadi. Natija kasb tanlash bo'yicha yakuniy qaror emas.", 'Шкалы самооценки — шкалы IPIP с проверенной надёжностью (альфа Кронбаха 0,70–0,87). Узбекских норм пока нет, уровни ориентировочные; надёжность практической части будет рассчитана по накопленным данным. Результат не является окончательным решением о выборе профессии.'))}</p>
      </div>
      ${ord.map(id => { const a = ab[id], d = DEF[id]; return `<details class="card qa-det"><summary><b>${esc(d.name[Rr])}</b> — ${a.index}/100</summary>
        ${a.sc.map(([s, p]) => bar(SC[s].n[Rr], p)).join('')}
        ${bar(d.sjn[Rr], a.prac, d.sj ? L(`${a.pd.ok}/${a.pd.n} to'g'ri`, `${a.pd.ok}/${a.pd.n} верно`) : L(`${a.pd.tot} ta g'oya`, `${a.pd.tot} идей`), '#2BA88F')}
        <p>${esc((lv(a.index) >= 3 ? d.hi : lv(a.index) === 2 ? d.mid : d.lo)[Rr])}</p>
        ${d.sj ? `<ol class="qa-rev">${SJ[d.sj].map((q, i) => { const ans = S.sjAns[d.sj][i], ok = ans === q[3]; return ok ? '' : `<li><b>✗</b> ${esc(q[Rr])}<br><small>${L('Tavsiya etiladigan javob', 'Рекомендуемый ответ')}: ${esc(q[2][q[3]][Rr])}</small></li>`; }).join('')}</ol>` : ''}
      </details>`; }).join('')}
      <div class="row-actions"><a class="btn" href="#xulosa">${L('Umumiy xulosaga o\'tish', 'К общему заключению')}</a><a class="btn secondary" href="#test/qob_all" onclick="setTimeout(route,0)">${t('retake')}</a><button class="btn secondary" onclick="window.print()">${L('Chop etish / PDF', 'Печать / PDF')}</button></div>`;
    window.scrollTo(0, 0);
  }

  const _desc = describe;
  describe = function (r) {
    if (r.type === 'test' && r.id === 'qob_all' && r.ab) return { name: ALLNAME[lang === 'ru' ? 1 : 0], result: Object.entries(r.ab).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${DEF[k].name[lang === 'ru' ? 1 : 0].split(' ')[0]} ${v}`).join(', '), note: '' };
    if (r.type === 'test' && DEF[r.id] && r.index != null) return { name: DEF[r.id].name[lang === 'ru' ? 1 : 0], result: `${r.index}/100`, note: `${lvName(lv(r.index))} · ${L("o'zini baholash", 'самооценка')} ${r.self}%, ${L('amaliy', 'практика')} ${r.prac}%` };
    return _desc(r);
  };

  const css = document.createElement('style');
  css.textContent = `
  .qb-part{margin:1.6rem 0 .6rem;font-size:1.2rem}
  .question.miss{outline:2px solid #FF6F91;outline-offset:4px;border-radius:12px}
  .qb-opts{display:flex;flex-direction:column;gap:.45rem}
  .qb-opts label{display:flex;gap:.7rem;align-items:flex-start;padding:.65rem .9rem;border:1.5px solid var(--border);border-radius:12px;background:#fff;color:var(--text);cursor:pointer;line-height:1.4}
  .qb-opts input{position:absolute;opacity:0;pointer-events:none}
  .qb-opts label:has(input:checked){border-color:var(--accent);background:var(--accent-soft)}
  .qb-l{flex:none;width:24px;height:24px;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-weight:800;font-size:.8rem;display:inline-flex;align-items:center;justify-content:center}
  .qb-opts label:has(input:checked) .qb-l{background:var(--accent);color:#fff}
  .qb-aut{width:100%;box-sizing:border-box;border:1.5px solid var(--border);border-radius:12px;padding:.8rem;font:inherit;line-height:1.6;color:var(--text)}
  .qb-aut-top{display:flex;justify-content:space-between;align-items:center;margin:.6rem 0;font-weight:700;color:var(--text)}
  .qb-timer{font:800 1.5rem var(--display);font-variant-numeric:tabular-nums}.qb-timer.low{color:#E0466B}
  .card.qb-res{display:flex;flex-direction:row;justify-content:flex-start;text-align:left;gap:1.5rem;align-items:center}
  .qb-index{flex:none;width:130px;height:130px;border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;background:#5B47E0}
  .qb-index b{font:800 3.2rem/1 var(--display)}.qb-index span{font-weight:700;margin-top:.2rem}
  .qb-index.lv4{background:#1F9D7A}.qb-index.lv3{background:#5B47E0}.qb-index.lv2{background:#D98E04}.qb-index.lv1{background:#E0466B}
  .qb-bars{flex:1;min-width:0}
  .qb-row{display:grid;grid-template-columns:minmax(150px,220px) 1fr 48px minmax(110px,170px);gap:.7rem;align-items:center;margin:.5rem 0;font-size:.92rem;color:var(--text)}
  .qb-row b{font-family:var(--display)}.qb-row em{font-style:normal;color:var(--muted);font-size:.82rem}
  .qb-bar{height:14px;border-radius:7px;background:#EEEAFB;overflow:hidden}.qb-bar i{display:block;height:100%;border-radius:7px}
  .qb-rev{margin:1rem 0}.qb-rev summary{cursor:pointer;font-weight:700}.qb-rev li{margin:.5rem 0;line-height:1.4}.qb-rev li.ok b{color:#1F9D7A}.qb-rev li.bad b{color:#E0466B}.qb-rev small{color:#625D8F}
  .pf-top{display:flex;justify-content:space-between;font-weight:600;color:var(--muted);margin:.8rem 0 .3rem}
  .qa-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem;margin:.6rem 0}
  .qa-card{position:relative;border:2px solid var(--border);border-top:6px solid var(--c);border-radius:14px;padding:1rem .8rem;display:flex;flex-direction:column;gap:.2rem;color:var(--text);background:#fff}
  .qa-card.qa-first{box-shadow:0 10px 30px -12px var(--c);border-color:var(--c)}
  .qa-card b{font:800 2.2rem/1 var(--display);color:var(--c)}.qa-card span{font-weight:700;font-size:.9rem}.qa-card em{font-style:normal;color:var(--muted);font-size:.82rem}
  .qa-rank{position:absolute;top:.5rem;right:.7rem;color:var(--muted)!important;font-size:.8rem!important}
  .qa-det{margin:.8rem 0}.qa-det summary{cursor:pointer;font-size:1.02rem;color:var(--text)}.qa-rev{margin-top:.6rem}.qa-rev li{margin:.4rem 0}.qa-rev li b{color:#E0466B}.qa-rev small{color:#625D8F}
  @media (max-width:700px){.qa-grid{grid-template-columns:1fr 1fr}}
  @media (max-width:700px){.card.qb-res{flex-direction:column;align-items:stretch}.qb-index{margin:0 auto}.qb-row{grid-template-columns:1fr 46px}.qb-row .qb-bar{grid-column:1/3;grid-row:2}.qb-row em{grid-column:1/3}}`;
  document.head.appendChild(css);

  const _route = route;
  window.removeEventListener('hashchange', _route);
  route = function () {
    _route();
    const [pg, arg] = (location.hash || '#home').slice(1).split('/');
    if (pg === 'test' && DEF[arg]) { view(arg); window.scrollTo(0, 0); }
    else if (pg === 'test' && arg === 'qob_all') { viewAll(); window.scrollTo(0, 0); }
  };
  window.addEventListener('hashchange', route);
  route();
})();
