'use strict';
/* PsixoLab — Kamera orqali puls (fotopletizmografiya) bilan emotsional reaksiya testi */
(function () {

const L = (uz, ru) => (lang === 'ru' ? ru : uz);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmt = (x, d) => Number(x).toFixed(d).replace('.', ',');
const back = () => `<a href="#experiments">← ${t('back')}</a>`;
const again = () => `<div class="row-actions"><button class="btn" id="again">${t('retake')}</button><a class="btn secondary" href="#results">${t('toResults')}</a></div>`;
const concl = ps => `<div class="conclusion"><h2>${L('Xulosa', 'Заключение')}</h2>${ps.map(p => `<p>${esc(p)}</p>`).join('')}</div>`;

Object.assign(T.uz, { puTitle: 'Emotsional reaksiya (puls, kamera orqali)', puDesc: "Barmoqni telefon kamerasiga qo'yasiz, sayt pulsingizni o'lchaydi va neytral hamda hayajonli so'zlarga yuragingiz qanday javob berishini ko'rsatadi. Telefonda ishlating." });
Object.assign(T.ru, { puTitle: 'Эмоциональная реакция (пульс через камеру)', puDesc: 'Вы прикладываете палец к камере телефона, сайт измеряет пульс и показывает, как сердце реагирует на нейтральные и эмоциональные слова. Используйте телефон.' });
EXPERIMENTS.push({ id: 'pulse', title: 'puTitle', desc: 'puDesc', minutes: 3 });

const STIM = {
  uz: [['stol', 0], ['imtihon', 1], ['bulut', 0], ['jarima', 1], ['qalam', 0], ["yolg'on", 1]],
  ru: [['стол', 0], ['экзамен', 1], ['облако', 0], ['штраф', 1], ['карандаш', 0], ['ложь', 1]]
};
const BASE_SEC = 30, STIM_SEC = 10, REST_SEC = 8;

/* ---------- Signalni qayta ishlash ---------- */
function detectBeats(S) {
  const n = S.length;
  if (n < 60) return [];
  const fps = (n - 1) / ((S[n - 1].t - S[0].t) / 1000);
  const w = Math.max(4, Math.round(fps * 0.75));
  const v = S.map(s => s.v);
  const pre = [0]; for (let i = 0; i < n; i++) pre.push(pre[i] + v[i]);
  const avg = (a, b) => { a = Math.max(0, a); b = Math.min(n - 1, b); return (pre[b + 1] - pre[a]) / (b - a + 1); };
  const det = v.map((x, i) => x - avg(i - w, i + w));
  const pre2 = [0]; for (let i = 0; i < n; i++) pre2.push(pre2[i] + det[i]);
  const sm = det.map((_, i) => { const a = Math.max(0, i - 2), b = Math.min(n - 1, i + 2); return (pre2[b + 1] - pre2[a]) / (b - a + 1); });
  const mean = sm.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(sm.reduce((a, b) => a + (b - mean) ** 2, 0) / n) || 1;
  const peaks = [];
  for (let i = 1; i < n - 1; i++) {
    if (!S[i].ok) continue;
    if (sm[i] > sm[i - 1] && sm[i] >= sm[i + 1] && sm[i] > mean + 0.3 * sd) {
      const last = peaks[peaks.length - 1];
      if (!last || S[i].t - last.t > 330) peaks.push({ t: S[i].t, a: sm[i] });
      else if (sm[i] > last.a) { last.t = S[i].t; last.a = sm[i]; }
    }
  }
  return peaks.map(p => p.t);
}
function bpmIn(beats, from, to) {
  const ibi = [];
  for (let i = 1; i < beats.length; i++) {
    if (beats[i - 1] >= from && beats[i] <= to) {
      const d = beats[i] - beats[i - 1];
      if (d >= 333 && d <= 1500) ibi.push(d);
    }
  }
  if (ibi.length < 3) return null;
  ibi.sort((a, b) => a - b);
  return 60000 / ibi[Math.floor(ibi.length / 2)];
}

/* ---------- Sahifa ---------- */
function viewPulse() {
  app.innerHTML = `${back()}<h1>${esc(t('puTitle'))}</h1><p>${esc(t('puDesc'))}</p>
    <div class="stage" id="pu">
      <ol class="pu-steps">
        <li>${esc(L("Telefonda oching (Android'da Chrome tavsiya etiladi). Kamera ruxsatini bering.", 'Откройте на телефоне (на Android рекомендуется Chrome). Разрешите доступ к камере.'))}</li>
        <li>${esc(L("Ko'rsatkich barmog'ingiz uchini orqa kamera va chiroqni to'liq yopadigan qilib, bosmasdan, yengil qo'ying.", 'Приложите кончик указательного пальца так, чтобы он полностью закрыл заднюю камеру и вспышку, не надавливая.'))}</li>
        <li>${esc(L("Tinch o'tiring, gapirmang va qimirlamang. Ekrandagi so'zlarni shunchaki o'qing.", 'Сидите спокойно, не разговаривайте и не двигайтесь. Просто читайте слова на экране.'))}</li>
      </ol>
      <p class="meta">${esc(L("Test taxminan 2,5 daqiqa davom etadi. Video hech qayerga yuborilmaydi, faqat sizning qurilmangizda qayta ishlanadi.", 'Тест длится около 2,5 минут. Видео никуда не отправляется и обрабатывается только на вашем устройстве.'))}</p>
      <button class="btn" id="go">${esc(L('Kamerani yoqish', 'Включить камеру'))}</button>
      <p id="perr" class="notice danger" hidden></p>
    </div>`;
  document.getElementById('go').onclick = start;
}

async function start() {
  const stage = document.getElementById('pu');
  const err = document.getElementById('perr');
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 320 }, height: { ideal: 240 } }, audio: false });
  } catch (e) {
    err.hidden = false;
    err.textContent = L("Kameraga ruxsat berilmadi yoki kamera topilmadi. Brauzer sozlamalarida kamera ruxsatini yoqing va qayta urinib ko'ring.", 'Нет доступа к камере или камера не найдена. Разрешите доступ к камере в настройках браузера и попробуйте снова.');
    return;
  }
  const track = stream.getVideoTracks()[0];
  stage.innerHTML = `
    <div class="pu-top">
      <video id="pv" playsinline muted autoplay></video>
      <div><div class="pu-bpm"><span id="bpm">--</span> <small>${esc(L('urish/daq', 'уд/мин'))}</small></div>
      <div id="pst" class="meta"></div></div>
    </div>
    <canvas id="wave" width="600" height="110" class="pu-wave"></canvas>
    <div id="phase" class="pu-phase"></div>
    <div class="meta" id="ptime"></div>
    <button class="btn secondary" id="stop">${esc(L("To'xtatish", 'Остановить'))}</button>`;
  const video = document.getElementById('pv');
  video.srcObject = stream;
  try { await video.play(); } catch (e) { /* ignore */ }
  let torch = false;
  try {
    const caps = track.getCapabilities ? track.getCapabilities() : {};
    if (caps.torch) { await track.applyConstraints({ advanced: [{ torch: true }] }); torch = true; }
  } catch (e) { /* torch yo'q */ }

  const cv = document.createElement('canvas'); cv.width = 40; cv.height = 30;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const S = [];
  let running = true;
  const alive = () => running && !!document.getElementById('pu');
  const stopAll = () => {
    running = false;
    try { if (torch) track.applyConstraints({ advanced: [{ torch: false }] }); } catch (e) { /* ignore */ }
    stream.getTracks().forEach(tr => tr.stop());
  };
  document.getElementById('stop').onclick = () => { stopAll(); viewPulse(); };

  const sampler = setInterval(() => {
    if (!alive()) { clearInterval(sampler); stopAll(); return; }
    if (video.readyState < 2) return;
    cx.drawImage(video, 0, 0, 40, 30);
    const d = cx.getImageData(0, 0, 40, 30).data;
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    const px = d.length / 4; r /= px; g /= px; b /= px;
    const ok = r > 60 && r > g * 1.4 && r > b * 1.4;
    S.push({ t: performance.now(), v: -r, ok });
  }, 33);

  // Jonli ko'rsatkichlar
  const wave = document.getElementById('wave').getContext('2d');
  const ui = setInterval(() => {
    if (!alive()) { clearInterval(ui); return; }
    const now = performance.now();
    const recent = S.filter(s => now - s.t < 8000);
    const okShare = recent.length ? recent.filter(s => s.ok).length / recent.length : 0;
    const pst = document.getElementById('pst');
    if (okShare < 0.7) {
      pst.textContent = L("Barmoqni kamera va chiroq ustiga to'liq qo'ying", 'Полностью закройте пальцем камеру и вспышку');
      pst.className = 'meta pu-warn';
    } else {
      pst.textContent = torch ? L('Signal yaxshi', 'Сигнал хороший') : L("Signal bor (chiroq yoqilmadi — yorug' joyda o'tiring)", 'Сигнал есть (вспышка не включилась — сядьте у света)');
      pst.className = 'meta';
    }
    const beats = detectBeats(recent);
    const bpm = bpmIn(beats, now - 8000, now);
    document.getElementById('bpm').textContent = bpm && okShare >= 0.7 ? Math.round(bpm) : '--';
    // to'lqin
    const last = S.slice(-150);
    wave.clearRect(0, 0, 600, 110);
    if (last.length > 10) {
      const vals = last.map(s => s.v);
      const mn = Math.min(...vals), mx = Math.max(...vals), rg = mx - mn || 1;
      wave.strokeStyle = '#ec4899'; wave.lineWidth = 2.5; wave.beginPath();
      vals.forEach((v, i) => { const x = i / (last.length - 1) * 600, y = 100 - (v - mn) / rg * 90; i ? wave.lineTo(x, y) : wave.moveTo(x, y); });
      wave.stroke();
    }
  }, 500);

  // Protokol
  const phase = document.getElementById('phase'), ptime = document.getElementById('ptime');
  const countdown = async (sec, label) => {
    for (let s = sec; s > 0; s--) { if (!alive()) return false; ptime.textContent = `${label} · ${s} ${t('sec')}`; await sleep(1000); }
    return true;
  };
  phase.innerHTML = `<div class="meta">${esc(L("Barmoqni qo'ying va signal barqarorlashishini kuting…", 'Приложите палец и дождитесь стабилизации сигнала…'))}</div>`;
  // signal tayyor bo'lishini kutish (eng ko'pi 40 s)
  let waited = 0;
  while (alive() && waited < 40) {
    await sleep(1000); waited++;
    const now = performance.now();
    const recent = S.filter(s => now - s.t < 5000);
    if (recent.length > 60 && recent.filter(s => s.ok).length / recent.length > 0.85 && waited >= 5) break;
  }
  if (!alive()) return;
  const marks = [];
  phase.innerHTML = `<div class="pu-word" style="color:var(--muted)">+</div><div class="meta">${esc(L("Tinch o'tiring va '+' belgisiga qarang", "Сидите спокойно и смотрите на «+»"))}</div>`;
  let t0 = performance.now();
  if (!await countdown(BASE_SEC, L('Tinch holat', 'Покой'))) return;
  marks.push({ kind: 'base', from: t0, to: performance.now() });
  const stim = STIM[lang] || STIM.uz;
  for (let k = 0; k < stim.length; k++) {
    const [w, emo] = stim[k];
    phase.innerHTML = `<div class="pu-word">${esc(w)}</div><div class="meta">${esc(L("So'zni o'qing va u haqida o'ylang", 'Прочитайте слово и подумайте о нём'))}</div>`;
    t0 = performance.now();
    if (!await countdown(STIM_SEC, `${L("So'z", 'Слово')} ${k + 1} / ${stim.length}`)) return;
    marks.push({ kind: emo ? 'emo' : 'neu', word: w, from: t0, to: performance.now() });
    phase.innerHTML = `<div class="pu-word" style="color:var(--muted)">+</div>`;
    if (!await countdown(REST_SEC, L('Dam', 'Отдых'))) return;
  }
  stopAll();
  clearInterval(sampler); clearInterval(ui);
  finish(S, marks);
}

function finish(S, marks) {
  const stage = document.getElementById('pu');
  if (!stage) return;
  const beats = detectBeats(S);
  const quality = Math.round(S.filter(s => s.ok).length / Math.max(1, S.length) * 100);
  const base = bpmIn(beats, marks[0].from, marks[0].to);
  // har bir so'z uchun: 2 s kechikish bilan + 4 s keyingi dam ham hisobga olinadi
  const rows = marks.slice(1).map(m => ({ ...m, bpm: bpmIn(beats, m.from + 1500, m.to + 4000) }));
  const avgOf = arr => { const v = arr.map(r => r.bpm).filter(x => x); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const neu = avgOf(rows.filter(r => r.kind === 'neu'));
  const emo = avgOf(rows.filter(r => r.kind === 'emo'));
  const reaction = neu && emo ? emo - neu : null;
  if (!base || reaction === null || quality < 50) {
    stage.innerHTML = `<div class="notice danger">${esc(L("Signal sifati yetarli bo'lmadi, natijani hisoblab bo'lmadi. Barmoqni kamera va chiroqni to'liq yopadigan qilib, qimirlamasdan qo'yib, qayta urinib ko'ring.", 'Качество сигнала недостаточное, результат рассчитать не удалось. Приложите палец так, чтобы он полностью закрывал камеру и вспышку, не двигайтесь и попробуйте снова.'))}</div>${again()}`;
    document.getElementById('again').onclick = viewPulse;
    return;
  }
  saveResult({ type: 'exp', id: 'pulse', value: Math.round(reaction * 10) / 10, base: Math.round(base), neutral: Math.round(neu), emo: Math.round(emo), quality });
  const ps = [reaction >= 5 ? L("Hayajonli so'zlarga yuragingiz sezilarli javob berdi: pulsingiz neytral so'zlarga nisbatan ancha tezlashdi. Bu emotsional sezgirlik yuqoriligini ko'rsatadi.", 'Сердце заметно отреагировало на эмоциональные слова: пульс ощутимо ускорился по сравнению с нейтральными. Это говорит о высокой эмоциональной чувствительности.')
    : reaction >= 2 ? L("Hayajonli so'zlarga o'rtacha darajada javob bo'ldi: puls biroz tezlashdi. Bu odatiy emotsional reaksiya.", 'Умеренная реакция на эмоциональные слова: пульс немного ускорился. Это обычная эмоциональная реакция.')
    : L("Neytral va hayajonli so'zlar orasida puls deyarli farq qilmadi. Bu emotsional barqarorlik yoki so'zlarning siz uchun ahamiyatsizligini bildirishi mumkin.", 'Пульс почти не различался на нейтральных и эмоциональных словах. Это может говорить об эмоциональной устойчивости или о том, что слова не были для вас значимы.')];
  if (base > 100) ps.push(L("Tinch holatdagi pulsingiz yuqori (100 dan ortiq). Bu hayajon, kofe yoki jismoniy faollikdan keyin bo'lishi mumkin. Agar dam olgan holatda ham tez-tez takrorlansa, shifokorga murojaat qiling.", 'Пульс в покое высокий (более 100). Так бывает после волнения, кофе или нагрузки. Если это часто повторяется в покое, обратитесь к врачу.'));
  if (base < 50) ps.push(L("Tinch holatdagi pulsingiz past (50 dan kam). Sportchilarda bu me'yor bo'lishi mumkin. Bosh aylanishi yoki holsizlik bo'lsa, shifokorga murojaat qiling.", 'Пульс в покое низкий (менее 50). У спортсменов это может быть нормой. Если бывают головокружение или слабость, обратитесь к врачу.'));
  if (quality < 80) ps.push(L("Signal sifati o'rtacha bo'ldi, natijalar taxminiy.", 'Качество сигнала среднее, результаты ориентировочные.'));
  // grafik
  const W = 460, H = 200, P = 30, maxB = Math.max(base, ...rows.map(r => r.bpm || 0)) + 10, minB = Math.max(30, Math.min(base, ...rows.map(r => r.bpm || 999)) - 15);
  const y = v => H - P - (v - minB) / (maxB - minB) * (H - 2 * P);
  const bw = (W - 2 * P) / rows.length;
  const chart = `<svg viewBox="0 0 ${W} ${H}" class="curve" role="img">
    <line x1="${P}" y1="${y(base)}" x2="${W - P}" y2="${y(base)}" stroke="#94a3b8" stroke-dasharray="5 4"/>
    <text x="${W - P}" y="${y(base) - 6}" text-anchor="end" font-size="11" fill="#5b6478">${esc(L('tinch holat', 'покой'))} ${Math.round(base)}</text>
    ${rows.map((r, i) => r.bpm ? `<rect x="${P + i * bw + 8}" y="${y(r.bpm)}" width="${bw - 16}" height="${H - P - y(r.bpm)}" rx="6" fill="${r.kind === 'emo' ? '#ec4899' : '#94a3b8'}"/>
      <text x="${P + i * bw + bw / 2}" y="${y(r.bpm) - 6}" text-anchor="middle" font-size="12" fill="#1d2433">${Math.round(r.bpm)}</text>` : '').join('')}
    ${rows.map((r, i) => `<text x="${P + i * bw + bw / 2}" y="${H - P + 16}" text-anchor="middle" font-size="11" fill="#5b6478">${esc(r.word)}</text>`).join('')}
  </svg>`;
  stage.innerHTML = `
    <div>${L("Hayajonli so'zlarga reaksiya", 'Реакция на эмоциональные слова')}</div>
    <div class="score">${reaction >= 0 ? '+' : ''}${fmt(reaction, 1)} <span class="meta">${esc(L('urish/daq', 'уд/мин'))}</span></div>
    <table>
      <tr><th>${L('Tinch holatdagi puls', 'Пульс в покое')}</th><td>${Math.round(base)}</td></tr>
      <tr><th>${L("Neytral so'zlarda", 'На нейтральных словах')}</th><td>${Math.round(neu)}</td></tr>
      <tr><th>${L("Hayajonli so'zlarda", 'На эмоциональных словах')}</th><td>${Math.round(emo)}</td></tr>
      <tr><th>${L('Signal sifati', 'Качество сигнала')}</th><td>${quality}%</td></tr>
    </table>
    <div style="width:100%"><div class="meta">${esc(L("Har bir so'zdagi puls (pushti — hayajonli, kulrang — neytral)", 'Пульс на каждом слове (розовые — эмоциональные, серые — нейтральные)'))}</div>${chart}</div>
    <p class="meta">${esc(L("Bu tibbiy asbob emas: kamera orqali o'lchangan puls taxminiy. Usul terining galvanik reaksiyasi (TGR) o'rniga emotsional qo'zg'alishni yurak urishi orqali baholaydi.", 'Это не медицинский прибор: пульс, измеренный камерой, ориентировочный. Метод оценивает эмоциональное возбуждение по пульсу вместо кожно-гальванической реакции (КГР).'))}</p>
    ${concl(ps)}${again()}`;
  document.getElementById('again').onclick = viewPulse;
}

/* ---------- Dizayn ---------- */
const style = document.createElement('style');
style.textContent = `
.pu-steps{text-align:left;max-width:520px;margin:0 auto;padding-left:1.2rem}
.pu-steps li{margin:.35rem 0}
.pu-top{display:flex;gap:1rem;align-items:center;justify-content:center}
#pv{width:72px;height:72px;object-fit:cover;border-radius:50%;border:3px solid #ec4899;background:#000}
.pu-bpm{font-size:2.6rem;font-weight:800;color:#ec4899;line-height:1}
.pu-bpm small{font-size:.9rem;color:var(--muted);font-weight:600}
.pu-warn{color:#c2410c !important;font-weight:600}
.pu-wave{width:100%;max-width:520px;height:90px;background:#fff5f9;border-radius:10px}
.pu-phase{min-height:5.5rem;display:flex;flex-direction:column;justify-content:center}
.pu-word{font-size:2.8rem;font-weight:800;color:var(--text)}`;
document.head.appendChild(style);

/* ---------- Natijalar va marshrut ---------- */
const _prevDescribe = describe;
describe = function (r) {
  if (r.type === 'exp' && r.id === 'pulse') {
    return { name: t('puTitle'), result: `${r.value >= 0 ? '+' : ''}${fmt(r.value, 1)} ${L('urish/daq', 'уд/мин')}`, note: L(`Tinch holat: ${r.base}; neytral: ${r.neutral}; hayajonli: ${r.emo}; sifat ${r.quality}%`, `Покой: ${r.base}; нейтральные: ${r.neutral}; эмоциональные: ${r.emo}; качество ${r.quality}%`) };
  }
  return _prevDescribe(r);
};
const _prevRoute = route;
window.removeEventListener('hashchange', _prevRoute);
route = function () {
  _prevRoute();
  const [page, arg] = (location.hash || '#home').slice(1).split('/');
  if (page === 'exp' && arg === 'pulse') { viewPulse(); window.scrollTo(0, 0); }
};
window.addEventListener('hashchange', route);
route();

})();
