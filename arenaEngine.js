
function getTensesList() {
  if (typeof window !== 'undefined' && Array.isArray(window.TENSES) && window.TENSES.length > 0) return window.TENSES;
  if (typeof TENSES !== 'undefined' && Array.isArray(TENSES) && TENSES.length > 0) return TENSES;
  return [
    { id: 'present_simple', viTitle: 'Hiện tại đơn', enTitle: 'Present Simple', formula: 'S + V1/Vs', signals: 'every day, always' },
    { id: 'past_simple', viTitle: 'Quá khứ đơn', enTitle: 'Past Simple', formula: 'S + V2/ed', signals: 'yesterday, ago' },
    { id: 'future_simple', viTitle: 'Tương lai đơn', enTitle: 'Future Simple', formula: 'S + will + V1', signals: 'tomorrow, soon' },
    { id: 'present_continuous', viTitle: 'Hiện tại tiếp diễn', enTitle: 'Present Continuous', formula: 'S + am/is/are + V-ing', signals: 'now, right now' }
  ];
}

function getConjFn() {
  if (typeof window !== 'undefined' && typeof window.conjugateTense === 'function') return window.conjugateTense;
  if (typeof conjugateTense === 'function') return conjugateTense;
  return function(tenseId, verb, subj) {
    return { affRaw: `${subj} ${verb.v1}`, negRaw: `${subj} do not ${verb.v1}`, intRaw: `Do ${subj} ${verb.v1}?` };
  };
}

/**
 * ============================================================================
 * LEXIMATRIX CYBER ARENA ENGINE (KAHOOT! + GIMKIT + BLOOKET GAMIFICATION)
 * Connected to: VERB_DATABASE (388 Verbs) & CURRICULUM_DATA (170 SGK Units)
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
 * 1. BUILD 170 SGK UNITS DATASET (CHƯƠNG TRÌNH GDPT 2018 LỚP 1 - 12)
 * ---------------------------------------------------------------------------- */
const SGK_UNIT_THEMES = [
  "My School & Classroom", "Family & Friends", "Daily Routines", "Hobbies & Music",
  "Outdoor Sports", "Healthy Food & Drinks", "Festival & Celebrations", "Our Green Planet",
  "Community Service", "Science & Inventions", "Space & Future Cities", "Cultural Heritage",
  "Eco-Tourism", "Digital Citizenship", "Artificial Intelligence", "Career Orientation",
  "Global Warming", "Renewable Energy", "Wildlife Conservation", "Smart Transportation"
];

function build170CurriculumUnits(verbsList) {
  const units = [];
  const gradeUnitCounts = {
    1: 14, 2: 14, 3: 15, 4: 15, 5: 15,
    6: 14, 7: 14, 8: 14, 9: 14,
    10: 14, 11: 14, 12: 13
  }; // Total = 14+14+15+15+15 + 14*4 + 14+14+13 = 170 Units

  let globalUnitIndex = 1;
  for (let grade = 1; grade <= 12; grade++) {
    const count = gradeUnitCounts[grade];
    const gradeVerbs = verbsList.filter(v => Number(v.grade) === grade);
    const pool = gradeVerbs.length > 0 ? gradeVerbs : verbsList;

    for (let u = 1; u <= count; u++) {
      const targetVerb = pool[(u - 1) % pool.length] || verbsList[globalUnitIndex % verbsList.length];
      const themeName = SGK_UNIT_THEMES[(globalUnitIndex - 1) % SGK_UNIT_THEMES.length];
      const objPhrase = targetVerb.activeObject ? ` ${targetVerb.activeObject}` : "";
      units.push({
        id: `G${grade}_U${u}`,
        globalUnitNumber: globalUnitIndex,
        grade: grade,
        unitNumber: u,
        unitTitle: `Lớp ${grade} • Unit ${u}: ${themeName}`,
        verb: targetVerb.v1,
        vs: targetVerb.vs,
        v2: targetVerb.v2,
        v3: targetVerb.v3,
        ving: targetVerb.ving,
        ipa: targetVerb.ipaUS,
        meaning: targetVerb.meaning,
        contextSentence: `In Unit ${u} (${themeName}), students learn how to "${targetVerb.v1}${objPhrase}" in daily communication.`,
        blankSentence: `We always ____${objPhrase} during the "${themeName}" project.`
      });
      globalUnitIndex++;
    }
  }
  return units;
}



function firstVariant(formStr) {
  if (!formStr) return '';
  return String(formStr).split('/')[0].trim();
}


function getCurriculumPool() {
  if (typeof window !== 'undefined' && Array.isArray(window.CURRICULUM_DATA) && window.CURRICULUM_DATA.length > 0) {
    return window.CURRICULUM_DATA;
  }
  if (typeof CURRICULUM_DATA !== 'undefined' && Array.isArray(CURRICULUM_DATA) && CURRICULUM_DATA.length > 0) {
    return CURRICULUM_DATA;
  }
  const fallbackVerbs = getVerbPool();
  return build170CurriculumUnits(fallbackVerbs);
}

function getVerbPool() {
  if (typeof window !== 'undefined' && Array.isArray(window.VERB_DATABASE) && window.VERB_DATABASE.length > 0) {
    return window.VERB_DATABASE;
  }
  if (typeof VERB_DATABASE !== 'undefined' && Array.isArray(VERB_DATABASE) && VERB_DATABASE.length > 0) {
    return VERB_DATABASE;
  }
  return [];
}

// Fallback initialization if CURRICULUM_DATA not yet loaded
if (typeof window !== 'undefined' && !window.CURRICULUM_DATA) {
  window.CURRICULUM_DATA = build170CurriculumUnits(getVerbPool());
}


/* ----------------------------------------------------------------------------
 * 2. GAME STATE MACHINE (ArenaState)
 * ---------------------------------------------------------------------------- */
const ArenaState = {
  score: 0,
  cyberCredits: 0,        // Đơn vị tiền tệ in-game (Gimkit)
  streak: 0,              // Chuỗi trả lời đúng (Kahoot)
  maxStreak: 0,
  correctCount: 0,
  totalAnswered: 0,
  multiplier: 1.0,        // Hệ số nhân điểm nâng cấp từ Shop (tối đa 4.0x)
  streakBonusLevel: 1,    // Cấp độ thưởng chuỗi
  hasInsurance: false,    // Bảo hiểm chống phạt tiền (Gimkit)
  hasCyberShield: false,  // Khiên bảo vệ Streak (Blooket Crate)
  doubleNextPoints: false,// Nhân đôi điểm ở câu hỏi tiếp theo (Blooket Crate)
  totalCreditsEarned: 0,  // Tổng Cyber-Credits tích lũy
  soundEnabled: true,     // Trạng thái âm thanh Web Audio API
  questionTypeFilter: "all", // 'all' | 'type1' | 'type2' | 'type3'
  currentQuestion: null,
  timerInterval: null,
  timeLeft: 15,           // Đếm ngược 15s mỗi câu (Kahoot)
  maxTime: 15
};
if (typeof window !== "undefined") {
  window.ArenaState = ArenaState;
}

/* ----------------------------------------------------------------------------
 * 3. PURE WEB AUDIO API SYNTHESIZER (NO EXTERNAL MP3 REQUIRED)
 * ---------------------------------------------------------------------------- */
const ArenaAudio = {
  ctx: null,
  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  },
  playTone(freq, type, duration, startTimeOffset = 0, gainVal = 0.12) {
    if (!ArenaState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime + startTimeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  },
  playTick(urgent = false) {
    this.playTone(urgent ? 880 : 620, "sine", 0.07, 0, urgent ? 0.1 : 0.05);
  },
  playCorrect() {
    // Bright "Ting!" ascending chord
    this.playTone(523.25, "triangle", 0.14, 0, 0.14);
    this.playTone(659.25, "triangle", 0.14, 0.07, 0.14);
    this.playTone(783.99, "triangle", 0.18, 0.14, 0.15);
    this.playTone(1046.5, "sine", 0.32, 0.21, 0.16);
  },
  playWrong() {
    // Low buzzer
    this.playTone(165, "sawtooth", 0.22, 0, 0.14);
    this.playTone(120, "sawtooth", 0.34, 0.16, 0.16);
  },
  playShopBuy() {
    this.playTone(587.33, "sine", 0.1, 0, 0.14);
    this.playTone(880, "sine", 0.22, 0.09, 0.16);
  },
  playCrateOpen() {
    this.playTone(440, "triangle", 0.1, 0, 0.14);
    this.playTone(554.37, "triangle", 0.1, 0.08, 0.14);
    this.playTone(659.25, "triangle", 0.12, 0.16, 0.15);
    this.playTone(880, "sine", 0.35, 0.24, 0.18);
  },
  playVictory() {
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) => {
      this.playTone(f, "triangle", 0.18, i * 0.1, 0.15);
    });
  }
};

/* ----------------------------------------------------------------------------
 * 4. TIMER MANAGEMENT (KAHOOT 15s TIME-DECAY)
 * ---------------------------------------------------------------------------- */
function stopArenaTimer() {
  if (ArenaState.timerInterval) {
    clearInterval(ArenaState.timerInterval);
    ArenaState.timerInterval = null;
  }
}

function updateTimerUI() {
  const barEl = document.getElementById("quiz-timer-bar");
  const textEl = document.getElementById("quiz-timer-text");
  if (!barEl || !textEl) return;

  const pct = Math.max(0, Math.min(100, (ArenaState.timeLeft / ArenaState.maxTime) * 100));
  barEl.style.width = `${pct}%`;
  textEl.textContent = `${ArenaState.timeLeft.toFixed(1)}s`;

  barEl.classList.remove("timer-warning", "timer-danger");
  if (ArenaState.timeLeft <= 4) {
    barEl.classList.add("timer-danger");
  } else if (ArenaState.timeLeft <= 8) {
    barEl.classList.add("timer-warning");
  }
}

function startArenaTimer() {
  stopArenaTimer();
  ArenaState.timeLeft = ArenaState.maxTime;
  updateTimerUI();

  let lastWholeSec = ArenaState.maxTime;
  ArenaState.timerInterval = setInterval(() => {
    if (!ArenaState.currentQuestion || ArenaState.currentQuestion.answered) {
      stopArenaTimer();
      return;
    }
    ArenaState.timeLeft = Math.max(0, +(ArenaState.timeLeft - 0.1).toFixed(1));
    updateTimerUI();

    const ceilSec = Math.ceil(ArenaState.timeLeft);
    if (ceilSec < lastWholeSec && ceilSec <= 5 && ceilSec > 0) {
      lastWholeSec = ceilSec;
      ArenaAudio.playTick(ceilSec <= 3);
    }

    if (ArenaState.timeLeft <= 0) {
      stopArenaTimer();
      handleQuizTimeout();
    }
  }, 100);
}

/* ----------------------------------------------------------------------------
 * 5. DYNAMIC QUESTION GENERATOR (3 QUESTION TYPES: MATRIX, V2/V3, 170 UNITS SGK)
 * ---------------------------------------------------------------------------- */
function generateDynamicQuestion() {
  stopArenaTimer();

  const feedbackBox = document.getElementById("quiz-feedback-box");
  if (feedbackBox) feedbackBox.classList.add("hidden");

  const types = ["type1", "type2", "type3"];
  const chosenType = (ArenaState.questionTypeFilter !== "all" && types.includes(ArenaState.questionTypeFilter))
    ? ArenaState.questionTypeFilter
    : types[Math.floor(Math.random() * types.length)];

  let qData = null;

  if (chosenType === "type1") {
    // Dạng 1: Chia thì ma trận 12 Thì (388 Động từ)
    const verbsList = getVerbPool(); const v = verbsList[Math.floor(Math.random() * verbsList.length)] || { v1: "write", vs: "writes", v2: "wrote", v3: "written", ving: "writing", meaning: "viết", ipaUS: "/raɪt/" };
    const tensesPool = getTensesList(); const t = tensesPool[Math.floor(Math.random() * tensesPool.length)]; const conjFn = getConjFn();
    const subjects = ["I", "You", "We", "They", "He", "She"];
    const subj = subjects[Math.floor(Math.random() * subjects.length)];
    const correctConj = conjFn(t.id, v, subj, false).affRaw;

    const wrongTenses = tensesPool.filter(x => x.id !== t.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [
      { text: correctConj, isCorrect: true, detail: `Thì ${t.viTitle} (${t.formula})` },
      ...wrongTenses.map(wt => ({
        text: conjFn(wt.id, v, subj, false).affRaw,
        isCorrect: false,
        detail: `Thì ${wt.viTitle} (${wt.formula})`
      }))
    ].sort(() => 0.5 - Math.random());

    qData = {
      type: "type1",
      badgeText: `⚡ Dạng 1: Chia Thì Ma Trận • Động từ "${v.v1}" (Lớp ${v.grade || 6})`,
      questionHtml: `Chọn câu chia đúng ở thì <span class="text-cyan-400 underline decoration-cyan-400/50">${t.viTitle} (${t.enTitle})</span> với chủ ngữ <code class="font-mono text-violet-300">"${subj}"</code> và động từ <code class="font-mono text-emerald-300">"${v.v1}"</code> (${v.meaning}):`,
      subHint: `Dấu hiệu nhận biết: ${t.signals}`,
      correctAnswer: correctConj,
      explanation: `Công thức chuẩn của <strong>${t.viTitle}</strong> là <code>${t.formula}</code>. Câu đúng: <code class="text-emerald-300 font-bold">"${correctConj}"</code>.`,
      speakText: correctConj,
      options
    };
  } else if (chosenType === "type2") {
    // Dạng 2: Điền dạng quá khứ V2 / phân từ V3 của động từ bất quy tắc
    const verbsList = getVerbPool(); const irregularPool = verbsList.filter(v => v.isIrregular && v.v1 !== "be");
    const v = irregularPool[Math.floor(Math.random() * irregularPool.length)] || VERB_DATABASE[0];
    const correctPair = `V2: ${v.v2}  •  V3: ${v.v3}`;

    const decoys = [
      `V2: ${v.v1}ed  •  V3: ${v.v1}ed`,
      `V2: ${v.vs}  •  V3: ${v.ving}`,
      `V2: ${v.v3}  •  V3: ${v.v1}s`
    ];
    // Ensure unique decoys
    const uniqueDecoys = [];
    for (const d of decoys) {
      if (d !== correctPair && !uniqueDecoys.includes(d)) uniqueDecoys.push(d);
    }
    while (uniqueDecoys.length < 3) {
      const other = irregularPool[Math.floor(Math.random() * irregularPool.length)];
      const cand = `V2: ${other.v2}  •  V3: ${other.v3}`;
      if (cand !== correctPair && !uniqueDecoys.includes(cand)) uniqueDecoys.push(cand);
    }

    const options = [
      { text: correctPair, isCorrect: true, detail: `Chuẩn bất quy tắc của "${v.v1}"` },
      ...uniqueDecoys.slice(0, 3).map(d => ({
        text: d,
        isCorrect: false,
        detail: `Sai hình thái bất quy tắc`
      }))
    ].sort(() => 0.5 - Math.random());

    qData = {
      type: "type2",
      badgeText: `🔥 Dạng 2: Bất Quy Tắc V2 / V3 • "${v.v1}" (${v.ipaUS})`,
      questionHtml: `Động từ bất quy tắc <code class="font-mono text-amber-300 text-xl">"[ ${v.v1} ]"</code> (nghĩa: <em>${v.meaning}</em>) có dạng <strong>Quá khứ đơn (V2)</strong> và <strong>Quá khứ phân từ (V3)</strong> là gì?`,
      subHint: `Gợi ý: Dạng V-ing là "${v.ving}" • SGK Lớp ${v.grade || 6}`,
      correctAnswer: correctPair,
      explanation: `Bộ 3 cột bất quy tắc của <strong>${v.v1}</strong> là: <code class="text-emerald-300 font-bold">${v.v1} → ${v.v2} → ${v.v3}</code> (${v.meaning}).`,
      speakText: `${v.v1}, ${firstVariant(v.v2)}, ${firstVariant(v.v3)}`,
      options
    };
  } else {
    // Dạng 3: Đoán nghĩa từ vựng SGK theo ngữ cảnh 170 Units
    const currPool = getCurriculumPool();
    const rawUnit = currPool[Math.floor(Math.random() * currPool.length)] || currPool[0];
    const verbsList = getVerbPool();
    
    // Normalize unitItem for both data formats
    let unitItem = null;
    if (rawUnit && rawUnit.verb) {
      unitItem = rawUnit;
    } else if (rawUnit && Array.isArray(rawUnit.vocabulary) && rawUnit.vocabulary.length > 0) {
      const vocab = rawUnit.vocabulary[Math.floor(Math.random() * rawUnit.vocabulary.length)];
      const vWord = (vocab.word || '').trim();
      unitItem = {
        id: `${rawUnit.grade}_U${rawUnit.unit}`,
        globalUnitNumber: rawUnit.unit || 1,
        grade: rawUnit.grade,
        unitNumber: rawUnit.unit,
        unitTitle: `${rawUnit.grade} • Unit ${rawUnit.unit}: ${rawUnit.title || ''}`,
        verb: vWord,
        ipa: vocab.ipa || '',
        meaning: vocab.meaning || '',
        blankSentence: vocab.example ? vocab.example.replace(new RegExp(vWord, 'gi'), '_____') : `We always _____ in this unit project.`
      };
    } else {
      const fallbackV = verbsList[0] || { v1: "write", meaning: "viết", ipaUS: "/raɪt/" };
      unitItem = {
        globalUnitNumber: 1,
        unitTitle: "Lớp 6 • Unit 1: My New School",
        verb: fallbackV.v1,
        ipa: fallbackV.ipaUS,
        meaning: fallbackV.meaning,
        blankSentence: "We always _____ our homework carefully."
      };
    }
    const wrongVerbs = verbsList.filter(x => x.v1 !== unitItem.verb).sort(() => 0.5 - Math.random()).slice(0, 3);

    const options = [
      { text: `${unitItem.verb} — ${unitItem.meaning}`, isCorrect: true, detail: unitItem.unitTitle },
      ...wrongVerbs.map(wv => ({
        text: `${wv.v1} — ${wv.meaning}`,
        isCorrect: false,
        detail: `Từ vựng Lớp ${wv.grade || 6}`
      }))
    ].sort(() => 0.5 - Math.random());

    qData = {
      type: "type3",
      badgeText: `📚 Dạng 3: Từ Vựng 170 Units SGK • ${unitItem.unitTitle}`,
      questionHtml: `Trong ngữ cảnh <strong>${unitItem.unitTitle}</strong>:<br><span class="text-cyan-300 font-mono text-base sm:text-lg">"${unitItem.blankSentence}"</span><br>Động từ và nghĩa tiếng Việt nào phù hợp nhất để điền vào chỗ trống (mang nghĩa: <em class="text-amber-300">"${unitItem.meaning}"</em>)?`,
      subHint: `Phiên âm gợi ý: ${unitItem.ipa} • Unit #${unitItem.globalUnitNumber}/170`,
      correctAnswer: `${unitItem.verb} — ${unitItem.meaning}`,
      explanation: `Trong <strong>${unitItem.unitTitle}</strong>, động từ trọng tâm là <code class="text-emerald-300 font-bold">${unitItem.verb} (${unitItem.ipa})</code> có nghĩa là <strong>"${unitItem.meaning}"</strong>.`,
      speakText: unitItem.verb,
      options
    };
  }

  ArenaState.currentQuestion = { ...qData, answered: false };

  const catBadge = document.getElementById("quiz-category-badge");
  if (catBadge) catBadge.textContent = qData.badgeText;

  const qText = document.getElementById("quiz-question-text");
  if (qText) {
    qText.innerHTML = `
      <div>${qData.questionHtml}</div>
      <div class="text-xs font-mono text-slate-400 mt-1.5">${qData.subHint}</div>
    `;
  }

  const optionsGrid = document.getElementById("quiz-options-grid");
  if (optionsGrid) {
    optionsGrid.innerHTML = "";
    const colorBorders = [
      "border-cyan-500/40 hover:border-cyan-400",
      "border-violet-500/40 hover:border-violet-400",
      "border-emerald-500/40 hover:border-emerald-400",
      "border-amber-500/40 hover:border-amber-400"
    ];
    qData.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `quiz-opt-btn p-4 rounded-2xl text-left font-mono text-xs sm:text-sm font-bold bg-white dark:bg-slate-900/95 border-2 ${colorBorders[idx % 4]} text-slate-800 dark:text-slate-100 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-sm`;
      btn.innerHTML = `
        <span class="flex items-center gap-2.5">
          <span class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span>${opt.text}</span>
        </span>
      `;
      btn.addEventListener("click", () => applyKahootScoring(opt, btn, false));
      optionsGrid.appendChild(btn);
    });
  }

  updateArenaHUD();
  startArenaTimer();
}

/* ----------------------------------------------------------------------------
 * 6. KAHOOT SCORING + STREAK FIRE + GIMKIT CREDITS + BLOOKET CRATE TRIGGER
 * ---------------------------------------------------------------------------- */
function handleQuizTimeout() {
  if (!ArenaState.currentQuestion || ArenaState.currentQuestion.answered) return;
  applyKahootScoring({ isCorrect: false, text: "Hết thời gian (15.0s)" }, null, true);
}

function applyKahootScoring(selectedOpt, clickedBtn = null, isTimeout = false) {
  if (!ArenaState.currentQuestion || ArenaState.currentQuestion.answered) return;
  ArenaState.currentQuestion.answered = true;
  stopArenaTimer();

  ArenaState.totalAnswered += 1;
  const feedbackBox = document.getElementById("quiz-feedback-box");
  const questionCard = document.getElementById("quiz-question-card");

  if (selectedOpt && selectedOpt.isCorrect) {
    ArenaAudio.playCorrect();
    ArenaState.correctCount += 1;
    ArenaState.streak += 1;
    if (ArenaState.streak > ArenaState.maxStreak) {
      ArenaState.maxStreak = ArenaState.streak;
    }

    // Kahoot Time-Decay Formula: Math.round(1000 * (timeLeft / maxTime)) * multiplier
    const rawSpeedScore = Math.round(1000 * (ArenaState.timeLeft / ArenaState.maxTime));
    let earnedPoints = Math.round(rawSpeedScore * ArenaState.multiplier);

    // Streak Bonus
    const streakBonus = ArenaState.streak >= 2
      ? (ArenaState.streak * 60 * ArenaState.streakBonusLevel)
      : 0;
    earnedPoints += streakBonus;

    // Blooket Double Points Power-up check
    let doubleTag = "";
    if (ArenaState.doubleNextPoints) {
      earnedPoints *= 2;
      ArenaState.doubleNextPoints = false;
      doubleTag = ` <span class="px-2 py-0.5 rounded bg-amber-500/25 text-amber-300 font-mono text-xs">⚡ x2 DOUBLE POINTS!</span>`;
    }

    ArenaState.score += earnedPoints;

    // Gimkit Cyber-Credits Economy: +$50 x Multiplier
    const earnedCredits = Math.round(50 * ArenaState.multiplier);
    ArenaState.cyberCredits += earnedCredits;
    ArenaState.totalCreditsEarned += earnedCredits;

    if (clickedBtn) {
      clickedBtn.className = "quiz-opt-btn p-4 rounded-2xl text-left font-mono text-xs sm:text-sm font-extrabold bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200 transition-all flex items-center justify-between gap-2 shadow-lg shadow-emerald-500/20";
    }

    if (feedbackBox) {
      feedbackBox.classList.remove("hidden");
      feedbackBox.className = "p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/45 text-emerald-200 text-xs sm:text-sm space-y-1 animate-card-in";
      feedbackBox.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2">
          <strong class="text-emerald-300 text-sm">🎉 CHÍNH XÁC! +${earnedPoints.toLocaleString()} Điểm (Tốc độ ${ArenaState.timeLeft.toFixed(1)}s)${doubleTag}</strong>
          <span class="font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-400/40">+$${earnedCredits} Cyber-Credits</span>
        </div>
        <div>${ArenaState.currentQuestion.explanation}</div>
      `;
    }

    // Speak correct English phrase
    if (ArenaState.currentQuestion.speakText) {
      speak(ArenaState.currentQuestion.speakText, "en-US");
    }

    updateArenaHUD();

    // Check Blooket Lucky Cyber-Crate trigger: Every 3 consecutive correct answers!
    if (ArenaState.streak > 0 && ArenaState.streak % 3 === 0) {
      setTimeout(() => {
        triggerBlooketCrate();
      }, 650);
    }
  } else {
    // Wrong Answer or Timeout
    ArenaAudio.playWrong();

    // Highlight correct button in options grid
    const allBtns = document.querySelectorAll("#quiz-options-grid .quiz-opt-btn");
    if (ArenaState.currentQuestion.options) {
      ArenaState.currentQuestion.options.forEach((opt, i) => {
        if (opt.isCorrect && allBtns[i]) {
          allBtns[i].className = "quiz-opt-btn p-4 rounded-2xl text-left font-mono text-xs sm:text-sm font-extrabold bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 transition-all";
        }
      });
    }

    if (clickedBtn) {
      clickedBtn.className = "quiz-opt-btn p-4 rounded-2xl text-left font-mono text-xs sm:text-sm font-extrabold bg-rose-500/25 border-2 border-rose-400 text-rose-200 transition-all";
    }

    // Check Blooket Cyber Shield (protects Streak)
    let shieldMsg = "";
    if (ArenaState.hasCyberShield) {
      ArenaState.hasCyberShield = false;
      shieldMsg = `<span class="px-2 py-0.5 rounded bg-cyan-500/25 text-cyan-300 font-mono text-xs">🛡️ CYBER SHIELD ĐÃ BẢO VỆ CHUỖI STREAK (${ArenaState.streak}🔥)!</span>`;
    } else {
      ArenaState.streak = 0;
      if (questionCard) {
        questionCard.classList.remove("arena-shake");
        void questionCard.offsetWidth;
        questionCard.classList.add("arena-shake");
      }
    }

    // Check Gimkit Firewall Insurance (protects -$30 penalty)
    let penaltyMsg = "";
    if (ArenaState.hasInsurance) {
      ArenaState.hasInsurance = false;
      penaltyMsg = `<span class="px-2.5 py-0.5 rounded-lg bg-violet-500/25 text-violet-200 font-mono font-bold text-xs border border-violet-400/40">🛡️ FIREWALL INSURANCE: Miễn phạt $0</span>`;
    } else {
      ArenaState.cyberCredits = Math.max(0, ArenaState.cyberCredits - 30);
      penaltyMsg = `<span class="px-2.5 py-0.5 rounded-lg bg-rose-500/25 text-rose-300 font-mono font-bold text-xs border border-rose-400/40">Phạt -$30 Cyber-Credits</span>`;
    }

    if (feedbackBox) {
      feedbackBox.classList.remove("hidden");
      feedbackBox.className = "p-4 rounded-2xl bg-rose-500/15 border border-rose-400/45 text-rose-200 text-xs sm:text-sm space-y-1 animate-card-in";
      feedbackBox.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2">
          <strong class="text-rose-300 text-sm">${isTimeout ? "⏰ HẾT THỜI GIAN (15s)!" : "💡 CHƯA CHÍNH XÁC!"} ${shieldMsg}</strong>
          ${penaltyMsg}
        </div>
        <div>${ArenaState.currentQuestion.explanation}</div>
      `;
    }

    updateArenaHUD();
  }
}

/* ----------------------------------------------------------------------------
 * 7. UPDATE ARENA HUD & STREAK FIRE VISUALS
 * ---------------------------------------------------------------------------- */
function updateArenaHUD() {
  const scoreEl = document.getElementById("quiz-score");
  const creditsEl = document.getElementById("quiz-credits");
  const streakEl = document.getElementById("quiz-streak");
  const accEl = document.getElementById("quiz-accuracy");
  const totalEl = document.getElementById("quiz-total");
  const multEl = document.getElementById("quiz-multiplier-badge");
  const streakBanner = document.getElementById("quiz-streak-fire-banner");
  const questionCard = document.getElementById("quiz-question-card");
  const powerupBadges = document.getElementById("quiz-active-powerups");

  if (scoreEl) scoreEl.textContent = ArenaState.score.toLocaleString();
  if (creditsEl) creditsEl.textContent = `$${ArenaState.cyberCredits.toLocaleString()}`;
  if (streakEl) streakEl.textContent = `${ArenaState.streak} 🔥`;
  if (totalEl) totalEl.textContent = String(ArenaState.totalAnswered + (ArenaState.currentQuestion && !ArenaState.currentQuestion.answered ? 1 : 0));

  const acc = ArenaState.totalAnswered > 0
    ? Math.round((ArenaState.correctCount / ArenaState.totalAnswered) * 100)
    : 100;
  if (accEl) accEl.textContent = `${acc}%`;
  if (multEl) multEl.textContent = `${ArenaState.multiplier.toFixed(1)}x`;

  // Active Power-up Status Pills
  if (powerupBadges) {
    const badges = [];
    if (ArenaState.hasInsurance) {
      badges.push(`<span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">🛡️ Insurance Active</span>`);
    }
    if (ArenaState.hasCyberShield) {
      badges.push(`<span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">🔰 Streak Shield</span>`);
    }
    if (ArenaState.doubleNextPoints) {
      badges.push(`<span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">⚡ Next 2x Points</span>`);
    }
    if (ArenaState.streakBonusLevel > 1) {
      badges.push(`<span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-400/40">🚀 Streak Boost x${ArenaState.streakBonusLevel}</span>`);
    }
    powerupBadges.innerHTML = badges.join("");
  }

  // Kahoot Streak Fire Visuals
  if (streakBanner && questionCard) {
    if (ArenaState.streak >= 3) {
      streakBanner.classList.remove("hidden");
      streakBanner.className = "px-3.5 py-1 rounded-full text-xs font-mono font-extrabold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/40 animate-pulse";
      streakBanner.textContent = `Combo x${ArenaState.streak} 🔥🔥 SUPER CHARGED`;
      questionCard.classList.add("super-charged-fire");
    } else if (ArenaState.streak === 2) {
      streakBanner.classList.remove("hidden");
      streakBanner.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/25 text-amber-300 border border-amber-400/50";
      streakBanner.textContent = `Combo x2 🔥`;
      questionCard.classList.remove("super-charged-fire");
    } else {
      streakBanner.classList.add("hidden");
      questionCard.classList.remove("super-charged-fire");
    }
  }

  // Update shop modal balance if open
  const shopBalanceEl = document.getElementById("cyber-shop-balance");
  if (shopBalanceEl) {
    shopBalanceEl.textContent = `$${ArenaState.cyberCredits.toLocaleString()}`;
  }
}

/* ----------------------------------------------------------------------------
 * 8. GIMKIT CYBER UPGRADE SHOP (openCyberShop & buyShopUpgrade)
 * ---------------------------------------------------------------------------- */
function openCyberShop() {
  const shopModal = document.getElementById("cyber-shop-modal");
  if (!shopModal) return;
  updateCyberShopUI();
  shopModal.classList.remove("hidden");
}

function closeCyberShop() {
  const shopModal = document.getElementById("cyber-shop-modal");
  if (shopModal) shopModal.classList.add("hidden");
}

function updateCyberShopUI() {
  const shopBalanceEl = document.getElementById("cyber-shop-balance");
  if (shopBalanceEl) shopBalanceEl.textContent = `$${ArenaState.cyberCredits.toLocaleString()}`;

  const multStatus = document.getElementById("shop-mult-status");
  if (multStatus) {
    multStatus.textContent = `Hiện tại: ${ArenaState.multiplier.toFixed(1)}x / Tối đa 4.0x`;
  }
  const boostStatus = document.getElementById("shop-boost-status");
  if (boostStatus) {
    boostStatus.textContent = `Cấp thưởng chuỗi hiện tại: x${ArenaState.streakBonusLevel}`;
  }
  const insStatus = document.getElementById("shop-ins-status");
  if (insStatus) {
    insStatus.textContent = ArenaState.hasInsurance ? "Trạng thái: ĐÃ KÍCH HOẠT 🛡️" : "Trạng thái: Chưa có bảo hiểm";
  }
}

function buyShopUpgrade(itemKey) {
  if (itemKey === "multiplier") {
    if (ArenaState.multiplier >= 4.0) {
      showToast("⚡ Overclock Multiplier đã đạt mức tối đa 4.0x!");
      return;
    }
    if (ArenaState.cyberCredits < 150) {
      showToast("💡 Cần $150 Cyber-Credits để nâng cấp Overclock Multiplier!");
      return;
    }
    ArenaState.cyberCredits -= 150;
    ArenaState.multiplier = Math.min(4.0, +(ArenaState.multiplier + 0.5).toFixed(1));
    ArenaAudio.playShopBuy();
    showToast(`⚡ Đã nâng cấp Overclock Multiplier lên ${ArenaState.multiplier.toFixed(1)}x!`);
  } else if (itemKey === "booster") {
    if (ArenaState.cyberCredits < 200) {
      showToast("💡 Cần $200 Cyber-Credits để mua Streak Booster!");
      return;
    }
    ArenaState.cyberCredits -= 200;
    ArenaState.streakBonusLevel *= 2;
    ArenaAudio.playShopBuy();
    showToast(`🔥 Đã kích hoạt Streak Booster (x${ArenaState.streakBonusLevel} điểm thưởng chuỗi)!`);
  } else if (itemKey === "insurance") {
    if (ArenaState.hasInsurance) {
      showToast("🛡️ Bạn đang có sẵn Firewall Insurance rồi!");
      return;
    }
    if (ArenaState.cyberCredits < 100) {
      showToast("💡 Cần $100 Cyber-Credits để mua Firewall Insurance!");
      return;
    }
    ArenaState.cyberCredits -= 100;
    ArenaState.hasInsurance = true;
    ArenaAudio.playShopBuy();
    showToast("🛡️ Đã trang bị Firewall Insurance (Miễn phạt câu sai kế tiếp)!");
  }

  updateArenaHUD();
  updateCyberShopUI();
}

/* ----------------------------------------------------------------------------
 * 9. BLOOKET LUCKY CYBER-CRATE (triggerBlooketCrate)
 * ---------------------------------------------------------------------------- */
const BLOOKET_REWARDS = [
  {
    id: "jackpot",
    title: "💰 Cyber Jackpot (+$300 Credits)",
    desc: "Cộng nóng +$300 Cyber-Credits vào tài khoản để mua sắm trong Cyber Shop!",
    icon: "fa-sack-dollar text-amber-400",
    apply() {
      ArenaState.cyberCredits += 300;
      ArenaState.totalCreditsEarned += 300;
    }
  },
  {
    id: "double",
    title: "⚡ Double Points (x2 Điểm Câu Kế)",
    desc: "Nhân đôi toàn bộ số điểm tốc độ & chuỗi ở câu hỏi tiếp theo!",
    icon: "fa-bolt text-cyan-400",
    apply() {
      ArenaState.doubleNextPoints = true;
    }
  },
  {
    id: "shield",
    title: "🛡️ Cyber Shield (Khiên Bảo Vệ Streak)",
    desc: "Tặng 1 Khiên bảo vệ chuỗi Streak không bị mất kể cả khi trả lời sai!",
    icon: "fa-shield-halved text-emerald-400",
    apply() {
      ArenaState.hasCyberShield = true;
    }
  }
];

function triggerBlooketCrate() {
  stopArenaTimer();
  const crateModal = document.getElementById("blooket-crate-modal");
  const cratesGrid = document.getElementById("blooket-crates-grid");
  const crateResult = document.getElementById("blooket-crate-result");
  if (!crateModal || !cratesGrid || !crateResult) return;

  crateResult.classList.add("hidden");
  cratesGrid.innerHTML = "";

  // Shuffle the 3 rewards across the 3 mystery crates
  const shuffled = [...BLOOKET_REWARDS].sort(() => 0.5 - Math.random());

  shuffled.forEach((reward, idx) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cyber-crate-card p-6 rounded-3xl flex flex-col items-center text-center space-y-3";
    card.innerHTML = `
      <div class="w-16 h-16 rounded-2xl bg-violet-500/20 border border-cyan-400/40 flex items-center justify-center text-3xl text-cyan-300 shadow-inner">
        <i class="fa-solid fa-box-open"></i>
      </div>
      <div class="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">HÒM BÍ MẬT #${idx + 1}</div>
      <div class="text-sm font-extrabold text-white">Nhấn để mở Hòm</div>
      <span class="text-[11px] text-slate-400">Chứa 1 trong 3 siêu vật phẩm Blooket</span>
    `;
    card.addEventListener("click", () => {
      if (!crateResult.classList.contains("hidden")) return;
      ArenaAudio.playCrateOpen();
      reward.apply();
      updateArenaHUD();

      card.innerHTML = `
        <div class="w-16 h-16 rounded-2xl bg-emerald-500/25 border-2 border-emerald-400 flex items-center justify-center text-3xl">
          <i class="fa-solid ${reward.icon}"></i>
        </div>
        <div class="font-mono text-xs uppercase tracking-widest text-emerald-300 font-bold">ĐÃ MỞ TRÚNG!</div>
        <div class="text-sm font-extrabold text-white">${reward.title}</div>
      `;

      crateResult.classList.remove("hidden");
      crateResult.innerHTML = `
        <div class="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-center space-y-2 animate-card-in">
          <div class="text-base sm:text-lg font-extrabold text-emerald-300">🎁 Chúc mừng! Bạn nhận được: ${reward.title}</div>
          <p class="text-xs text-slate-200">${reward.desc}</p>
          <button id="btn-crate-continue" type="button" class="mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-extrabold shadow-lg cursor-pointer">
            Tiếp tục chinh phục Câu tiếp theo →
          </button>
        </div>
      `;
      const contBtn = document.getElementById("btn-crate-continue");
      if (contBtn) {
        contBtn.addEventListener("click", () => {
          crateModal.classList.add("hidden");
          generateDynamicQuestion();
        });
      }
    });
    cratesGrid.appendChild(card);
  });

  crateModal.classList.remove("hidden");
}

/* ----------------------------------------------------------------------------
 * 10. CYBER VICTORY PODIUM (openArenaPodium & resetArenaGame)
 * ---------------------------------------------------------------------------- */
function openArenaPodium() {
  stopArenaTimer();
  ArenaAudio.playVictory();

  const podiumModal = document.getElementById("arena-podium-modal");
  if (!podiumModal) return;

  const acc = ArenaState.totalAnswered > 0
    ? Math.round((ArenaState.correctCount / ArenaState.totalAnswered) * 100)
    : 100;

  let rankTitle = "🛡️ CYBER ROOKIE";
  let rankDesc = "Khởi đầu vững chắc! Hãy nâng cấp Multiplier trong Shop để bứt phá điểm số.";
  let rankColor = "text-cyan-300 border-cyan-400/40 bg-cyan-500/15";

  if (ArenaState.score >= 5000 || ArenaState.maxStreak >= 6) {
    rankTitle = "👑 CYBER MASTER";
    rankDesc = "Đỉnh cao tốc độ & ngữ pháp! Bạn đã làm chủ hoàn toàn Ma trận 12 Thì & 388 Động từ.";
    rankColor = "text-amber-300 border-amber-400/50 bg-amber-500/20";
  } else if (ArenaState.score >= 2000 || ArenaState.maxStreak >= 3) {
    rankTitle = "⚡ NEON HACKER";
    rankDesc = "Phản xạ cực nhạy! Chuỗi Combo và chiến thuật Cyber Shop của bạn rất sắc bén.";
    rankColor = "text-violet-300 border-violet-400/50 bg-violet-500/20";
  }

  document.getElementById("podium-rank-badge").className = `inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-sm font-extrabold border ${rankColor}`;
  document.getElementById("podium-rank-badge").textContent = rankTitle;
  document.getElementById("podium-rank-desc").textContent = rankDesc;
  document.getElementById("podium-final-score").textContent = ArenaState.score.toLocaleString();
  document.getElementById("podium-max-streak").textContent = `${ArenaState.maxStreak} 🔥`;
  document.getElementById("podium-total-credits").textContent = `$${ArenaState.totalCreditsEarned.toLocaleString()}`;
  document.getElementById("podium-accuracy").textContent = `${acc}% (${ArenaState.correctCount}/${ArenaState.totalAnswered})`;

  podiumModal.classList.remove("hidden");
}

function resetArenaGame() {
  stopArenaTimer();
  ArenaState.score = 0;
  ArenaState.cyberCredits = 0;
  ArenaState.streak = 0;
  ArenaState.maxStreak = 0;
  ArenaState.correctCount = 0;
  ArenaState.totalAnswered = 0;
  ArenaState.multiplier = 1.0;
  ArenaState.streakBonusLevel = 1;
  ArenaState.hasInsurance = false;
  ArenaState.hasCyberShield = false;
  ArenaState.doubleNextPoints = false;
  ArenaState.totalCreditsEarned = 0;
  ArenaState.currentQuestion = null;

  const podiumModal = document.getElementById("arena-podium-modal");
  if (podiumModal) podiumModal.classList.add("hidden");

  updateArenaHUD();
  generateDynamicQuestion();
  showToast("🚀 Đã khởi tạo ván Đấu trường Cyber Arena mới!");
}

// Export global Arena API
if (typeof window !== 'undefined') {
  window.ArenaState = ArenaState;
  window.ArenaAudio = ArenaAudio;
  window.startArenaTimer = startArenaTimer;
  window.stopArenaTimer = stopArenaTimer;
  window.updateTimerUI = updateTimerUI;
  window.generateDynamicQuestion = generateDynamicQuestion;
  window.handleQuizTimeout = handleQuizTimeout;
  window.applyKahootScoring = applyKahootScoring;
  window.updateArenaHUD = updateArenaHUD;
  window.openCyberShop = openCyberShop;
  window.closeCyberShop = closeCyberShop;
  window.updateCyberShopUI = updateCyberShopUI;
  window.buyShopUpgrade = buyShopUpgrade;
  window.triggerBlooketCrate = triggerBlooketCrate;
  window.openArenaPodium = openArenaPodium;
  window.resetArenaGame = resetArenaGame;
  window.build170CurriculumUnits = build170CurriculumUnits;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ArenaState, ArenaAudio, generateDynamicQuestion, applyKahootScoring };
}
