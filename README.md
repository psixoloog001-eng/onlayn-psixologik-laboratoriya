# 🧠 PsixoLab — Onlayn psixologik laboratoriya

O'zbek va rus tillaridagi bepul onlayn psixologik laboratoriya. Ro'yxatdan o'tish shart emas, natijalar faqat foydalanuvchining brauzerida saqlanadi.

*Бесплатная онлайн психологическая лаборатория на узбекском и русском языках.*

## Imkoniyatlar

**Psixologik testlar (skrining)**
- PHQ-9 — depressiya belgilari (Kroenke, Spitzer & Williams, 2001)
- GAD-7 — xavotir darajasi (Spitzer va boshq., 2006)
- PSS-10 — stress darajasi (Cohen, Kamarck & Mermelstein, 1983)
- Rozenberg shkalasi — o'z-o'zini baholash (Rosenberg, 1965)
- Mini-IPIP — Big Five shaxs xususiyatlari (Donnellan va boshq., 2006)

**Kognitiv tajribalar**
- Reaksiya vaqti — 5 urinish, o'rtacha vaqt (ms)
- Stroop tajribasi — 24 urinish, Stroop effekti va aniqlik
- Raqamlar xotirasi (digit span) — qisqa muddatli xotira hajmi
- Shulte jadvallari — 5 jadval; IS, ID, PB ko'rsatkichlari (A.Y. Kozireva), yoshga ko'ra ball, charchash egri chizig'i
- Go/No-Go — impulsni nazorat qilish (40 urinish)
- Corsi bloklari — ko'rish-fazoviy xotira hajmi

**Kutubxona va video darslar**
- Har bir metodikaning tavsifi (maqsadi, o'tkazish tartibi, talqini, manbasi)
- O'quv materiallari va bepul ochiq darsliklar
- YouTube video darslar: saytdan foydalanish, psixologiya darslari, amaliy mashqlar
- Interaktiv "kvadrat nafas" va 5–4–3–2–1 xotirjamlashish mashqlari

**Natijalar**
- Barcha natijalar tarixi
- CSV formatida yuklab olish (Excel, SPSS, R uchun)

## Ishga tushirish

Hech narsa o'rnatish shart emas: `index.html` faylini brauzerda oching yoki GitHub Pages orqali e'lon qiling (Settings → Pages → Branch: `main`, papka: `/root`).

## Fayllar

| Fayl | Vazifasi |
|---|---|
| `index.html` | Sahifa tuzilishi |
| `style.css` | Dizayn |
| `app.js` | Asosiy testlar, tajribalar, tarjimalar va natijalar |
| `modules.js` | Qo'shimcha testlar va tajribalar (Rozenberg, Mini-IPIP, Shulte, Go/No-Go, Corsi) |
| `modules.css` | Qo'shimcha modullar dizayni |
| `conclusions.js` | Har bir natijadan keyingi xulosa matnlari |
| `library.js` | Kutubxona, video darslar va mashqlar |

## Material yoki video qo'shish

`library.js` faylining boshida ikkita ro'yxat bor:

- `MATERIALS` — o'quv materiallari. Faylni `kutubxona/` papkasiga yuklang va ro'yxatga yozing:
  `{ title: { uz: 'Nomi', ru: 'Название' }, desc: { uz: 'Tavsif', ru: 'Описание' }, url: 'kutubxona/fayl.pdf' }`
- `VIDEOS` — YouTube videolar. `cat`: `guide` (saytdan foydalanish), `lesson` (darslar), `practice` (mashqlar):
  `{ cat: 'lesson', title: { uz: 'Nomi', ru: 'Название' }, url: 'https://www.youtube.com/watch?v=...' }`

## Muhim eslatma

Testlar faqat dastlabki baholash (skrining) vositasidir va tibbiy tashxis o'rnini bosmaydi. Savollar tarjimasi norasmiy; ilmiy tadqiqotlar uchun tasdiqlangan (validatsiyadan o'tgan) versiyalardan foydalaning.
