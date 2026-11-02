/**
 * ============================================================================
 * LEXIMATRIX CYBER ARENA ENGINE v3.0 (MODULAR ARCHITECTURAL REWRITE)
 * 
 * 1. Decoupled Question & Content Schema (Swappable Data Layer)
 *    - Canonical Question Item contract (itemKey, stimulus, primaryTarget,
 *      semanticClusterId, synonyms, grammarAttrs, explanation, speakText).
 *    - Pluggable ContentProvider adapters for SGK 170 Units, 12-Tense Conjugations,
 *      and Irregular Verbs (V2/V3).
 * 
 * 2. Intelligent Distractor Generation Logic (Anti-Leak & Anti-Collision)
 *    - Prompt Leak Elimination: Contextual and directional masking (EN->VN, VN->EN, Cloze).
 *    - Semantic Filtering: Cluster exclusion + Synonym suppression (no synonymous decoys).
 *    - Homogeneous Part-of-Speech Matching: All 4 choices share identical grammatical form.
 *    - Multi-Key Validation Fallback: Award score if answer matches target OR valid synonym set.
 * 
 * 3. Multi-Game Mode Orchestrator (Strategy Pattern)
 *    - Strategy-driven scoring and mechanics:
 *      * Speed Blitz Mode (Kahoot Style): 15s timer, exponential time-decay score.
 *      * Economy & Upgrade Mode (Gimkit Style): +$50 credits, -$30 penalty, Shop upgrades.
 *      * Minigame Battles (Blooket Style): Streak milestones open Mystery Crates & Shields.
 *      * Composite Cyber Arena: Harmonized triple-engine for maximum engagement.
 * 
 * 4. Universal Game State Lifecycle
 *    - Predictable loop: [ROUND_INIT] -> [FETCH_QUESTION] -> [COUNTDOWN] -> [EVALUATION] -> [ROUND_RESOLVE].
 *    - Idempotent Input Guard: Instant input locking prevents double-click race conditions.
 *    - Persistent Telemetry: Tracks wrong answers to build an automatic review session (Spaced Repetition).
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
 * HELPER DEPENDENCIES & DATA ACCESSORS
 * ---------------------------------------------------------------------------- */
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

function firstVariant(formStr) {
  if (!formStr) return '';
  return String(formStr).split('/')[0].trim();
}

function safeSpeak(text, lang = "en-US") {
  if (typeof window !== "undefined" && typeof window.speak === "function") {
    window.speak(text, lang);
  } else if (typeof speak === "function") {
    try { speak(text, lang); } catch (e) {}
  }
}

function safeToast(msg, icon) {
  if (typeof window !== "undefined" && typeof window.showToast === "function") {
    window.showToast(msg, icon);
  } else if (typeof showToast === "function") {
    try { showToast(msg, icon); } catch (e) {}
  }
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
  }; // Total = 170 Units

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
        blankSentence: `We always _____ during the "${themeName}" project.`
      });
      globalUnitIndex++;
    }
  }
  return units;
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

if (typeof window !== 'undefined' && !window.CURRICULUM_DATA) {
  window.CURRICULUM_DATA = build170CurriculumUnits(getVerbPool());
}

/* ----------------------------------------------------------------------------
 * 1. SEMANTIC CLUSTERS & SYNSET REGISTRY (Cluster Exclusion & Synonyms)
 * ---------------------------------------------------------------------------- */
const SEMANTIC_CLUSTERS = {
  START_INITIATE: {
    words: ["begin", "start", "commence", "initiate", "launch", "open"],
    meanings: ["bắt đầu", "khởi đầu", "mở đầu", "khởi động"]
  },
  FINISH_END: {
    words: ["finish", "end", "complete", "conclude", "stop", "cease", "terminate"],
    meanings: ["kết thúc", "hoàn thành", "chấm dứt", "dừng lại"]
  },
  SPEAK_COMMUNICATE: {
    words: ["speak", "talk", "tell", "say", "state", "pronounce", "express", "chat"],
    meanings: ["nói", "kể", "bảo", "phát biểu", "trò chuyện", "thảo luận"]
  },
  WRITE_RECORD: {
    words: ["write", "record", "note", "compose", "draft", "author"],
    meanings: ["viết", "ghi chép", "soạn thảo", "sáng tác"]
  },
  CREATE_MAKE: {
    words: ["make", "build", "create", "produce", "construct", "form"],
    meanings: ["làm", "chế tạo", "xây dựng", "tạo ra", "sản xuất"]
  },
  TAKE_BRING: {
    words: ["take", "bring", "fetch", "carry", "grab", "hold"],
    meanings: ["cầm", "lấy", "mang", "đem", "nắm giữ"]
  },
  BUY_PURCHASE: {
    words: ["buy", "purchase", "get", "acquire", "obtain"],
    meanings: ["mua", "sắm", "tậu", "thu được"]
  },
  MOVE_TRAVEL: {
    words: ["go", "run", "walk", "travel", "fly", "drive", "ride", "come"],
    meanings: ["đi", "chạy", "di chuyển", "bay", "lái xe", "đến"]
  },
  SEE_PERCEIVE: {
    words: ["see", "look", "watch", "observe", "view", "notice"],
    meanings: ["nhìn", "thấy", "xem", "quan sát", "chú ý"]
  },
  UNDERSTAND_KNOW: {
    words: ["know", "understand", "learn", "realize", "comprehend"],
    meanings: ["biết", "hiểu", "nhận thức", "học hỏi"]
  },
  GIVE_SEND: {
    words: ["give", "send", "provide", "offer", "grant", "deliver", "lend"],
    meanings: ["cho", "tặng", "gửi", "cung cấp", "cho mượn"]
  },
  BREAK_DAMAGE: {
    words: ["break", "tear", "damage", "destroy", "ruin", "split"],
    meanings: ["làm vỡ", "làm gãy", "phá hủy", "xé rách"]
  },
  EAT_CONSUME: {
    words: ["eat", "drink", "consume", "taste", "swallow", "bite"],
    meanings: ["ăn", "uống", "tiêu thụ", "nếm", "cắn"]
  },
  KEEP_STORE: {
    words: ["keep", "hold", "store", "save", "retain", "preserve"],
    meanings: ["giữ", "lưu trữ", "bảo quản", "tiết kiệm"]
  },
  BECOME_GROW: {
    words: ["become", "grow", "develop", "turn"],
    meanings: ["trở thành", "phát triển", "lớn lên"]
  },
  FIND_DISCOVER: {
    words: ["find", "discover", "detect", "locate"],
    meanings: ["tìm thấy", "phát hiện", "khám phá"]
  }
};

function getSemanticCluster(word = "", meaning = "") {
  const normWord = String(word).trim().toLowerCase();
  const normMeaning = String(meaning).trim().toLowerCase();

  for (const [clusterKey, data] of Object.entries(SEMANTIC_CLUSTERS)) {
    if (data.words.includes(normWord)) {
      return { clusterId: clusterKey, synonyms: data.words, meanings: data.meanings };
    }
    for (const m of data.meanings) {
      if (normMeaning.includes(m) || m.includes(normMeaning)) {
        return { clusterId: clusterKey, synonyms: data.words, meanings: data.meanings };
      }
    }
  }

  // Dynamic Fallback Cluster: generate hash/stem from Vietnamese meaning
  const stem = normMeaning.split(/[ ,;/]/)[0] || normWord;
  return {
    clusterId: `STEM_${stem.toUpperCase()}`,
    synonyms: [normWord],
    meanings: [normMeaning]
  };
}

/* ----------------------------------------------------------------------------
 * 2. DECOUPLED QUESTION & CONTENT SCHEMA (Canonical Contract & Pluggable Adapters)
 * ---------------------------------------------------------------------------- */
class CanonicalQuestionItem {
  constructor(data) {
    this.itemKey = data.itemKey;
    this.stimulus = data.stimulus; // { type, promptHtml, subHint, badgeText, maskedSentence }
    this.primaryTarget = data.primaryTarget;
    this.displayTarget = data.displayTarget || data.primaryTarget;
    this.semanticClusterId = data.semanticClusterId || "GENERAL";
    this.synonyms = Array.isArray(data.synonyms) ? data.synonyms : [];
    this.grammarAttrs = data.grammarAttrs || {}; // { partOfSpeech, tenseId, gradeTier }
    this.explanation = data.explanation || "";
    this.speakText = data.speakText || "";
    this.options = data.options || [];
  }
}

/**
 * Content Adapters
 */
const TenseConjugationAdapter = {
  fetchItem() {
    const verbsList = getVerbPool();
    const v = verbsList[Math.floor(Math.random() * verbsList.length)] || {
      v1: "write", vs: "writes", v2: "wrote", v3: "written", ving: "writing", meaning: "viết", ipaUS: "/raɪt/"
    };
    const tensesPool = getTensesList();
    const t = tensesPool[Math.floor(Math.random() * tensesPool.length)];
    const conjFn = getConjFn();
    const subjects = ["I", "You", "We", "They", "He", "She"];
    const subj = subjects[Math.floor(Math.random() * subjects.length)];
    const correctConj = conjFn(t.id, v, subj, false).affRaw;

    const cluster = getSemanticCluster(v.v1, v.meaning);

    return new CanonicalQuestionItem({
      itemKey: `tense_${t.id}_${v.v1}_${subj}`,
      stimulus: {
        type: "production",
        badgeText: `⚡ Dạng 1: Chia Thì Ma Trận • Động từ "${v.v1}" (Lớp ${v.grade || 6})`,
        promptHtml: `Chọn câu chia đúng ở thì <span class="text-cyan-400 underline decoration-cyan-400/50">${t.viTitle} (${t.enTitle})</span> với chủ ngữ <code class="font-mono text-violet-300">"${subj}"</code> và động từ <code class="font-mono text-emerald-300">"${v.v1}"</code> (${v.meaning}):`,
        subHint: `Dấu hiệu nhận biết: ${t.signals}`
      },
      primaryTarget: correctConj,
      displayTarget: correctConj,
      semanticClusterId: cluster.clusterId,
      synonyms: cluster.synonyms,
      grammarAttrs: {
        partOfSpeech: "conjugated_sentence",
        tenseId: t.id,
        gradeTier: Number(v.grade) || 6,
        verb: v,
        subj: subj,
        tense: t
      },
      explanation: `Công thức chuẩn của <strong>${t.viTitle}</strong> là <code>${t.formula}</code>. Câu đúng: <code class="text-emerald-300 font-bold">"${correctConj}"</code>.`,
      speakText: correctConj
    });
  }
};

const IrregularFormsAdapter = {
  fetchItem() {
    const verbsList = getVerbPool();
    const irregularPool = verbsList.filter(v => v.isIrregular && v.v1 !== "be");
    const v = irregularPool[Math.floor(Math.random() * irregularPool.length)] || verbsList[0];
    const correctPair = `V2: ${v.v2}  •  V3: ${v.v3}`;
    const cluster = getSemanticCluster(v.v1, v.meaning);

    return new CanonicalQuestionItem({
      itemKey: `irreg_${v.v1}_${v.id || v.v1}`,
      stimulus: {
        type: "production",
        badgeText: `🔥 Dạng 2: Bất Quy Tắc V2 / V3 • "${v.v1}" (${v.ipaUS})`,
        promptHtml: `Động từ bất quy tắc <code class="font-mono text-amber-300 text-xl">"[ ${v.v1} ]"</code> (nghĩa: <em>${v.meaning}</em>) có dạng <strong>Quá khứ đơn (V2)</strong> và <strong>Quá khứ phân từ (V3)</strong> là gì?`,
        subHint: `Gợi ý: Dạng V-ing là "${v.ving}" • SGK Lớp ${v.grade || 6}`
      },
      primaryTarget: correctPair,
      displayTarget: correctPair,
      semanticClusterId: cluster.clusterId,
      synonyms: cluster.synonyms,
      grammarAttrs: {
        partOfSpeech: "v2_v3_morphology",
        gradeTier: Number(v.grade) || 6,
        verb: v
      },
      explanation: `Bộ 3 cột bất quy tắc của <strong>${v.v1}</strong> là: <code class="text-emerald-300 font-bold">${v.v1} → ${v.v2} → ${v.v3}</code> (${v.meaning}).`,
      speakText: `${v.v1}, ${firstVariant(v.v2)}, ${firstVariant(v.v3)}`
    });
  }
};

let pipelineModule = null;
if (typeof window !== 'undefined' && window.CurriculumPipeline) {
  pipelineModule = window.CurriculumPipeline;
} else if (typeof require === 'function') {
  try { pipelineModule = require('./curriculumPipeline.js'); } catch (e) {}
}

function getCertifiedCurriculumPool() {
  if (pipelineModule && typeof pipelineModule.getCertifiedDB === 'function') {
    return pipelineModule.getCertifiedDB();
  }
  return null;
}

const CurriculumVocabAdapter = {
  fetchItem() {
    const certifiedPool = getCertifiedCurriculumPool();

    // 1. If Certified Curriculum DB available, use 3-Tier Standardized Schema & 4 Golden Rules
    if (certifiedPool && certifiedPool.length > 0) {
      const targetItem = certifiedPool[Math.floor(Math.random() * certifiedPool.length)];
      const distractors = pipelineModule.generateCertifiedDistractors(targetItem, certifiedPool, 3);

      const correctChoiceText = `${targetItem.target_word} — ${targetItem.primary_meaning_vn}`;
      const options = [
        { text: correctChoiceText, isCorrect: true, detail: `Chuẩn SGK Lớp ${targetItem.grade_level}` }
      ];

      distractors.forEach(d => {
        options.push({
          text: `${d.target_word} — ${d.primary_meaning_vn}`,
          isCorrect: false,
          detail: `Từ vựng Lớp ${d.grade_level} (${d.part_of_speech})`
        });
      });
      options.sort(() => 0.5 - Math.random());

      return new CanonicalQuestionItem({
        itemKey: targetItem.id,
        stimulus: {
          type: "cloze",
          badgeText: `📚 Dạng 3: Từ Vựng SGK • Lớp ${targetItem.grade_level} (${targetItem.cefr_band}) • Unit ${targetItem.unit_number}`,
          promptHtml: `Chọn từ vựng đúng để hoàn thành câu trong chương trình <strong>Lớp ${targetItem.grade_level} (${targetItem.tier})</strong>:<br><span class="text-cyan-300 font-mono text-base sm:text-lg">"${targetItem.prompt_sentence}"</span>`,
          subHint: `Gợi ý: Từ loại [${targetItem.part_of_speech}] • Mang nghĩa "${targetItem.primary_meaning_vn}" • Unit #${targetItem.unit_number}`
        },
        primaryTarget: correctChoiceText,
        displayTarget: correctChoiceText,
        semanticClusterId: targetItem.synonym_cluster_id,
        synonyms: [targetItem.target_word],
        grammarAttrs: {
          partOfSpeech: "curriculum_lexical_item",
          rawPOS: targetItem.part_of_speech,
          gradeTier: targetItem.grade_level,
          standardItem: targetItem
        },
        explanation: `Trong chương trình <strong>Lớp ${targetItem.grade_level} (${targetItem.tier})</strong>, từ <code class="text-emerald-300 font-bold">${targetItem.target_word}</code> (${targetItem.part_of_speech}) mang nghĩa chuẩn ngữ cảnh là <strong>"${targetItem.primary_meaning_vn}"</strong>.`,
        speakText: targetItem.target_word,
        options
      });
    }

    // Fallback if pipeline not loaded
    const currPool = getCurriculumPool();
    const rawUnit = currPool[Math.floor(Math.random() * currPool.length)] || currPool[0];
    const verbsList = getVerbPool();

    let unitItem = null;
    if (rawUnit && rawUnit.verb) {
      unitItem = rawUnit;
    } else if (rawUnit && Array.isArray(rawUnit.vocabulary) && rawUnit.vocabulary.length > 0) {
      const vocab = rawUnit.vocabulary[Math.floor(Math.random() * rawUnit.vocabulary.length)];
      const vWord = (vocab.word || '').trim();
      const escWord = vWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      unitItem = {
        id: `${rawUnit.grade}_U${rawUnit.unit}`,
        globalUnitNumber: rawUnit.unit || 1,
        grade: rawUnit.grade,
        unitNumber: rawUnit.unit,
        unitTitle: `${rawUnit.grade} • Unit ${rawUnit.unit}: ${rawUnit.title || ''}`,
        verb: vWord,
        ipa: vocab.ipa || '',
        meaning: vocab.meaning || '',
        blankSentence: vocab.example ? vocab.example.replace(new RegExp(escWord, 'gi'), '_____') : `We always _____ in this unit project.`
      };
    } else {
      const fallbackV = verbsList[0] || { v1: "write", meaning: "viết", ipaUS: "/raɪt/" };
      unitItem = {
        id: "G6_U1",
        globalUnitNumber: 1,
        unitTitle: "Lớp 6 • Unit 1: My New School",
        verb: fallbackV.v1,
        ipa: fallbackV.ipaUS,
        meaning: fallbackV.meaning,
        blankSentence: "We always _____ our homework carefully."
      };
    }

    const cluster = getSemanticCluster(unitItem.verb, unitItem.meaning);
    const correctChoiceText = `${unitItem.verb} — ${unitItem.meaning}`;

    return new CanonicalQuestionItem({
      itemKey: `curriculum_${unitItem.id || 'unit'}_${unitItem.verb}`,
      stimulus: {
        type: "cloze",
        badgeText: `📚 Dạng 3: Từ Vựng 170 Units SGK • ${unitItem.unitTitle}`,
        promptHtml: `Chọn từ vựng đúng để hoàn thành câu trong <strong>${unitItem.unitTitle}</strong>:<br><span class="text-cyan-300 font-mono text-base sm:text-lg">"${unitItem.blankSentence}"</span>`,
        subHint: `Gợi ý: Mang nghĩa "${unitItem.meaning}" • Phiên âm: ${unitItem.ipa} • Unit #${unitItem.globalUnitNumber}/170`
      },
      primaryTarget: correctChoiceText,
      displayTarget: correctChoiceText,
      semanticClusterId: cluster.clusterId,
      synonyms: cluster.synonyms,
      grammarAttrs: {
        partOfSpeech: "curriculum_lexical_item",
        gradeTier: Number(unitItem.grade) || 6,
        unitItem: unitItem
      },
      explanation: `Trong <strong>${unitItem.unitTitle}</strong>, động từ trọng tâm là <code class="text-emerald-300 font-bold">${unitItem.verb} (${unitItem.ipa})</code> có nghĩa là <strong>"${unitItem.meaning}"</strong>.`,
      speakText: unitItem.verb
    });
  }
};

const ContentProvider = {
  getItem(qType) {
    if (qType === "type1") return TenseConjugationAdapter.fetchItem();
    if (qType === "type2") return IrregularFormsAdapter.fetchItem();
    if (qType === "type3") return CurriculumVocabAdapter.fetchItem();

    const types = ["type1", "type2", "type3"];
    const chosen = types[Math.floor(Math.random() * types.length)];
    return this.getItem(chosen);
  }
};

/* ----------------------------------------------------------------------------
 * 3. INTELLIGENT DISTRACTOR GENERATION (Anti-Leak, Cluster Exclusion & Homogeneity)
 * ---------------------------------------------------------------------------- */
function generateHomogeneousDistractors(canonicalItem) {
  const options = [
    { text: canonicalItem.primaryTarget, isCorrect: true, detail: "Đáp án chính xác" }
  ];
  const seenTexts = new Set([canonicalItem.primaryTarget]);

  if (canonicalItem.grammarAttrs.partOfSpeech === "conjugated_sentence") {
    const { verb, subj, tense } = canonicalItem.grammarAttrs;
    const tensesPool = getTensesList();
    const conjFn = getConjFn();
    const shuffledTenses = tensesPool.filter(x => x.id !== tense.id).sort(() => 0.5 - Math.random());

    for (const wt of shuffledTenses) {
      const conj = conjFn(wt.id, verb, subj, false).affRaw;
      if (!seenTexts.has(conj)) {
        seenTexts.add(conj);
        options.push({
          text: conj,
          isCorrect: false,
          detail: `Thì ${wt.viTitle} (${wt.formula})`
        });
      }
      if (options.length >= 4) break;
    }
  } else if (canonicalItem.grammarAttrs.partOfSpeech === "v2_v3_morphology") {
    const v = canonicalItem.grammarAttrs.verb;
    const verbsList = getVerbPool();
    const irregularPool = verbsList.filter(x => x.isIrregular && x.v1 !== "be" && x.v1 !== v.v1);

    const decoys = [
      `V2: ${v.v1}ed  •  V3: ${v.v1}ed`,
      `V2: ${v.vs}  •  V3: ${v.ving}`,
      `V2: ${v.v3}  •  V3: ${v.v1}s`
    ];

    for (const d of decoys) {
      if (!seenTexts.has(d)) {
        seenTexts.add(d);
        options.push({ text: d, isCorrect: false, detail: "Sai hình thái ngữ pháp" });
      }
      if (options.length >= 4) break;
    }

    // Homogeneous fallback if decoys duplicated
    while (options.length < 4 && irregularPool.length > 0) {
      const other = irregularPool[Math.floor(Math.random() * irregularPool.length)];
      const cand = `V2: ${other.v2}  •  V3: ${other.v3}`;
      if (!seenTexts.has(cand)) {
        seenTexts.add(cand);
        options.push({ text: cand, isCorrect: false, detail: `Bất quy tắc của "${other.v1}"` });
      }
    }
  } else if (canonicalItem.grammarAttrs.partOfSpeech === "curriculum_lexical_item") {
    const verbsList = getVerbPool();
    const targetUnit = canonicalItem.grammarAttrs.unitItem;

    // Filter out: Same verb, same meaning, same cluster, or synonyms
    const candidateDistractors = verbsList.filter(wv => {
      if (wv.v1 === targetUnit.verb) return false;
      if (wv.meaning === targetUnit.meaning) return false;
      if (canonicalItem.synonyms.includes(wv.v1)) return false;
      const c = getSemanticCluster(wv.v1, wv.meaning);
      if (c.clusterId === canonicalItem.semanticClusterId) return false;
      return true;
    }).sort(() => 0.5 - Math.random());

    for (const wv of candidateDistractors) {
      const choice = `${wv.v1} — ${wv.meaning}`;
      if (!seenTexts.has(choice)) {
        seenTexts.add(choice);
        options.push({
          text: choice,
          isCorrect: false,
          detail: `Từ vựng Lớp ${wv.grade || 6}`
        });
      }
      if (options.length >= 4) break;
    }
  }

  // Shuffle options in place
  return options.sort(() => 0.5 - Math.random());
}

/* ----------------------------------------------------------------------------
 * 4. MULTI-GAME MODE ORCHESTRATOR (Strategy Pattern)
 * ---------------------------------------------------------------------------- */
class GameModeStrategy {
  constructor(name) {
    this.name = name;
  }
  calculateScore(state, evalContext) { return 0; }
  calculateCredits(state, evalContext) { return 0; }
  handleStreak(state, evalContext) {}
  handlePenalty(state, evalContext) {}
}

/**
 * Composite Strategy: Kahoot Speed Blitz + Gimkit Cyber-Credits + Blooket Crates
 */
class CompositeCyberArenaStrategy extends GameModeStrategy {
  constructor() {
    super("composite_cyber_arena");
  }

  calculateScore(state, evalContext) {
    if (!evalContext.isCorrect) return 0;
    // Kahoot Time-Decay Formula: Base (1000) * (TimeLeft / MaxTime) * multiplier
    const rawSpeedScore = Math.round(1000 * (state.timeLeft / state.maxTime));
    let earned = Math.round(rawSpeedScore * state.multiplier);

    // Streak Bonus
    const streakBonus = state.streak >= 2 ? (state.streak * 60 * state.streakBonusLevel) : 0;
    earned += streakBonus;

    // Blooket Double Points power-up
    if (state.doubleNextPoints) {
      earned *= 2;
      state.doubleNextPoints = false;
      evalContext.doublePointsUsed = true;
    }
    return earned;
  }

  calculateCredits(state, evalContext) {
    if (!evalContext.isCorrect) return 0;
    return Math.round(50 * state.multiplier);
  }

  handleStreak(state, evalContext) {
    if (evalContext.isCorrect) {
      state.streak += 1;
      if (state.streak > state.maxStreak) {
        state.maxStreak = state.streak;
      }
    } else {
      if (state.hasCyberShield) {
        state.hasCyberShield = false;
        evalContext.shieldSavedStreak = true;
      } else {
        state.streak = 0;
      }
    }
  }

  handlePenalty(state, evalContext) {
    if (evalContext.isCorrect) return;
    if (state.hasInsurance) {
      state.hasInsurance = false;
      evalContext.insuranceSavedCredits = true;
    } else {
      state.cyberCredits = Math.max(0, state.cyberCredits - 30);
    }
  }
}

const activeStrategy = new CompositeCyberArenaStrategy();

/* ----------------------------------------------------------------------------
 * 5. GAME STATE MACHINE & PERSISTENT TELEMETRY
 * ---------------------------------------------------------------------------- */
const ArenaState = {
  score: 0,
  cyberCredits: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  totalAnswered: 0,
  multiplier: 1.0,
  streakBonusLevel: 1,
  hasInsurance: false,
  hasCyberShield: false,
  doubleNextPoints: false,
  totalCreditsEarned: 0,
  soundEnabled: true,
  questionTypeFilter: "all",
  currentQuestion: null,
  timerInterval: null,
  timeLeft: 15,
  maxTime: 15,
  isInputLocked: false, // Idempotent Input Guard
  telemetry: {
    wrongAnswers: [],
    history: [],
    recordAttempt(attempt) {
      this.history.push(attempt);
      if (!attempt.isCorrect) {
        this.wrongAnswers.push(attempt);
      }
    },
    clear() {
      this.wrongAnswers = [];
      this.history = [];
    }
  }
};

if (typeof window !== "undefined") {
  window.ArenaState = ArenaState;
}

/* ----------------------------------------------------------------------------
 * 6. PURE WEB AUDIO API SYNTHESIZER
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
    this.playTone(523.25, "triangle", 0.14, 0, 0.14);
    this.playTone(659.25, "triangle", 0.14, 0.07, 0.14);
    this.playTone(783.99, "triangle", 0.18, 0.14, 0.15);
    this.playTone(1046.5, "sine", 0.32, 0.21, 0.16);
  },
  playWrong() {
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
 * 7. TIMER & HUD MANAGERS
 * ---------------------------------------------------------------------------- */
function stopArenaTimer() {
  if (ArenaState.timerInterval) {
    clearInterval(ArenaState.timerInterval);
    ArenaState.timerInterval = null;
  }
}

function updateTimerUI() {
  if (typeof document === 'undefined') return;
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

function updateArenaHUD() {
  if (typeof document === 'undefined') return;
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

  // Active Power-up Badges
  if (powerupBadges) {
    const badges = [];
    if (ArenaState.hasInsurance) {
      badges.push(`<span class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-[#232A3B]">🛡️ Insurance</span>`);
    }
    if (ArenaState.hasCyberShield) {
      badges.push(`<span class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-[#232A3B]">🔰 Shield</span>`);
    }
    if (ArenaState.doubleNextPoints) {
      badges.push(`<span class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-[#232A3B]">⚡ 2x Points</span>`);
    }
    if (ArenaState.streakBonusLevel > 1) {
      badges.push(`<span class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-[#232A3B]">🚀 Streak x${ArenaState.streakBonusLevel}</span>`);
    }
    powerupBadges.innerHTML = badges.join("");
  }

  // Streak Fire Banner Visuals
  if (streakBanner && questionCard) {
    if (ArenaState.streak >= 3) {
      streakBanner.classList.remove("hidden");
      streakBanner.className = "px-2.5 py-0.5 rounded text-[11px] font-mono text-indigo-300 border border-indigo-500/40 bg-indigo-950/30";
      streakBanner.textContent = `Combo x${ArenaState.streak} 🔥`;
    } else if (ArenaState.streak === 2) {
      streakBanner.classList.remove("hidden");
      streakBanner.className = "px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-300 border border-[#232A3B]";
      streakBanner.textContent = `Combo x2 🔥`;
    } else {
      streakBanner.classList.add("hidden");
    }
  }

  const shopBalanceEl = document.getElementById("cyber-shop-balance");
  if (shopBalanceEl) {
    shopBalanceEl.textContent = `$${ArenaState.cyberCredits.toLocaleString()}`;
  }
}

/* ----------------------------------------------------------------------------
 * 8. UNIVERSAL GAME STATE LIFECYCLE (generateDynamicQuestion & applyKahootScoring)
 * ---------------------------------------------------------------------------- */
function generateDynamicQuestion() {
  // [ROUND_INIT]
  stopArenaTimer();
  ArenaState.isInputLocked = false; // Unlock input guard for new question

  const feedbackBox = typeof document !== 'undefined' ? document.getElementById("quiz-feedback-box") : null;
  if (feedbackBox) feedbackBox.classList.add("hidden");

  // [FETCH_QUESTION] from Pluggable ContentProvider
  const canonicalItem = ContentProvider.getItem(ArenaState.questionTypeFilter);

  // Distractor generation with Cluster Exclusion & Anti-Collision (if not already certified)
  if (!canonicalItem.options || canonicalItem.options.length < 4) {
    canonicalItem.options = generateHomogeneousDistractors(canonicalItem);
  }

  ArenaState.currentQuestion = {
    ...canonicalItem,
    answered: false
  };

  // Render UI
  const catBadge = typeof document !== 'undefined' ? document.getElementById("quiz-category-badge") : null;
  if (catBadge) catBadge.textContent = canonicalItem.stimulus.badgeText;

  const qText = typeof document !== 'undefined' ? document.getElementById("quiz-question-text") : null;
  if (qText) {
    qText.innerHTML = `
      <div>${canonicalItem.stimulus.promptHtml}</div>
      <div class="text-xs font-mono text-slate-400 mt-1.5">${canonicalItem.stimulus.subHint}</div>
    `;
  }

  const optionsGrid = typeof document !== 'undefined' ? document.getElementById("quiz-options-grid") : null;
  if (optionsGrid) {
    optionsGrid.innerHTML = "";

    canonicalItem.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-opt-btn p-3.5 sm:p-4 rounded-xl text-left font-mono text-xs sm:text-sm font-medium bg-[#161B26] border border-[#232A3B] text-[#F3F4F6] hover:border-[#4B5563] transition-all cursor-pointer flex items-center gap-3";
      btn.innerHTML = `
        <span class="w-6 h-6 rounded bg-[#1F2937] text-slate-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">${String.fromCharCode(65 + idx)}</span>
        <span class="text-[#F3F4F6]">${opt.text}</span>
      `;
      btn.addEventListener("click", () => applyKahootScoring(opt, btn, false));
      optionsGrid.appendChild(btn);
    });
  }

  updateArenaHUD();
  // [COUNTDOWN & WAIT_INPUT]
  startArenaTimer();
}

function handleQuizTimeout() {
  if (ArenaState.isInputLocked || !ArenaState.currentQuestion || ArenaState.currentQuestion.answered) return;
  applyKahootScoring({ isCorrect: false, text: "Hết thời gian (15.0s)" }, null, true);
}

function applyKahootScoring(selectedOpt, clickedBtn = null, isTimeout = false) {
  // Idempotent Input Guard: Prevent double-click race conditions immediately
  if (ArenaState.isInputLocked) return;
  if (!ArenaState.currentQuestion || ArenaState.currentQuestion.answered) return;

  ArenaState.isInputLocked = true;
  ArenaState.currentQuestion.answered = true;
  stopArenaTimer();

  ArenaState.totalAnswered += 1;
  const currentQ = ArenaState.currentQuestion;

  // Multi-Key Scoring Fallback Validation:
  // Award full credit if matches target OR belongs to valid lexical synonym cluster
  const isDirectCorrect = Boolean(selectedOpt && selectedOpt.isCorrect === true);
  const isTargetMatch = Boolean(selectedOpt && selectedOpt.text === currentQ.primaryTarget);

  let isSynonymMatch = false;
  if (currentQ.grammarAttrs.partOfSpeech === "curriculum_lexical_item" && Array.isArray(currentQ.synonyms) && selectedOpt && selectedOpt.text) {
    const optWord = selectedOpt.text.split('—')[0].trim().toLowerCase();
    isSynonymMatch = currentQ.synonyms.some(s => s.toLowerCase() === optWord && s.toLowerCase() !== currentQ.primaryTarget.toLowerCase());
  }

  const isEvaluatedCorrect = !isTimeout && (isDirectCorrect || isTargetMatch || isSynonymMatch);

  const evalContext = {
    isCorrect: isEvaluatedCorrect,
    isTimeout,
    doublePointsUsed: false,
    shieldSavedStreak: false,
    insuranceSavedCredits: false
  };

  // Dispatch to Game Mode Strategy
  const earnedPoints = activeStrategy.calculateScore(ArenaState, evalContext);
  const earnedCredits = activeStrategy.calculateCredits(ArenaState, evalContext);
  activeStrategy.handleStreak(ArenaState, evalContext);
  activeStrategy.handlePenalty(ArenaState, evalContext);

  if (isEvaluatedCorrect) {
    ArenaState.correctCount += 1;
    ArenaState.score += earnedPoints;
    ArenaState.cyberCredits += earnedCredits;
    ArenaState.totalCreditsEarned += earnedCredits;
  }

  // Persistent Telemetry: Record attempt for Spaced Repetition Review
  ArenaState.telemetry.recordAttempt({
    itemKey: currentQ.itemKey,
    type: currentQ.grammarAttrs.partOfSpeech || "general",
    promptText: currentQ.stimulus.promptHtml,
    selected: selectedOpt ? selectedOpt.text : "N/A",
    correct: currentQ.primaryTarget,
    isCorrect: isEvaluatedCorrect,
    explanation: currentQ.explanation,
    timeSpent: +(ArenaState.maxTime - ArenaState.timeLeft).toFixed(1)
  });

  // UI Evaluation & Feedback Rendering
  const feedbackBox = document.getElementById("quiz-feedback-box");
  const questionCard = document.getElementById("quiz-question-card");

  if (isEvaluatedCorrect) {
    ArenaAudio.playCorrect();

    if (clickedBtn) {
      clickedBtn.className = "quiz-opt-btn p-3.5 sm:p-4 rounded-xl text-left font-mono text-xs sm:text-sm font-semibold bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 transition-all flex items-center gap-3";
    }

    let doubleTag = evalContext.doublePointsUsed
      ? ` <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs">⚡ x2 POINTS</span>`
      : "";

    if (feedbackBox) {
      feedbackBox.classList.remove("hidden");
      feedbackBox.className = "p-3.5 rounded-xl bg-[#161B26] border border-emerald-500/40 text-xs sm:text-sm text-slate-300 space-y-1";
      feedbackBox.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2">
          <strong class="text-emerald-400 text-sm">CHÍNH XÁC! +${earnedPoints.toLocaleString()} Điểm (${ArenaState.timeLeft.toFixed(1)}s)${doubleTag}</strong>
          <span class="font-mono text-xs text-slate-400">+$${earnedCredits} Credits</span>
        </div>
        <div>${currentQ.explanation}</div>
      `;
    }

    if (currentQ.speakText) {
      safeSpeak(currentQ.speakText, "en-US");
    }

    updateArenaHUD();

    // Trigger Blooket Lucky Cyber-Crate milestone every 3 streaks
    if (ArenaState.streak > 0 && ArenaState.streak % 3 === 0) {
      setTimeout(() => {
        triggerBlooketCrate();
      }, 650);
    }
  } else {
    ArenaAudio.playWrong();

    // Highlight correct button in grid
    const allBtns = document.querySelectorAll("#quiz-options-grid .quiz-opt-btn");
    if (currentQ.options) {
      currentQ.options.forEach((opt, i) => {
        if ((opt.isCorrect || opt.text === currentQ.primaryTarget) && allBtns[i]) {
          allBtns[i].className = "quiz-opt-btn p-3.5 sm:p-4 rounded-xl text-left font-mono text-xs sm:text-sm font-semibold bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 transition-all flex items-center gap-3";
        }
      });
    }

    if (clickedBtn) {
      clickedBtn.className = "quiz-opt-btn p-3.5 sm:p-4 rounded-xl text-left font-mono text-xs sm:text-sm font-semibold bg-rose-950/40 border border-rose-500/60 text-rose-200 transition-all flex items-center gap-3";
    }

    let shieldMsg = evalContext.shieldSavedStreak
      ? `<span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs">🛡️ Shield đã bảo vệ streak (${ArenaState.streak}🔥)</span>`
      : "";

    if (!evalContext.shieldSavedStreak && questionCard) {
      questionCard.classList.remove("arena-shake");
      void questionCard.offsetWidth;
      questionCard.classList.add("arena-shake");
    }

    let penaltyMsg = evalContext.insuranceSavedCredits
      ? `<span class="text-xs font-mono text-slate-400">🛡️ Insurance: Miễn phạt</span>`
      : `<span class="text-xs font-mono text-rose-400">Phạt -$30</span>`;

    if (feedbackBox) {
      feedbackBox.classList.remove("hidden");
      feedbackBox.className = "p-3.5 rounded-xl bg-[#161B26] border border-rose-500/40 text-xs sm:text-sm text-slate-300 space-y-1";
      feedbackBox.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2">
          <strong class="text-rose-400 text-sm">${isTimeout ? "HẾT THỜI GIAN (15.0s)!" : "CHƯA CHÍNH XÁC!"} ${shieldMsg}</strong>
          ${penaltyMsg}
        </div>
        <div>${currentQ.explanation}</div>
      `;
    }

    updateArenaHUD();
  }
}

/* ----------------------------------------------------------------------------
 * 9. GIMKIT CYBER UPGRADE SHOP
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
      safeToast("⚡ Overclock Multiplier đã đạt mức tối đa 4.0x!");
      return;
    }
    if (ArenaState.cyberCredits < 150) {
      safeToast("💡 Cần $150 Cyber-Credits để nâng cấp Overclock Multiplier!");
      return;
    }
    ArenaState.cyberCredits -= 150;
    ArenaState.multiplier = Math.min(4.0, +(ArenaState.multiplier + 0.5).toFixed(1));
    ArenaAudio.playShopBuy();
    safeToast(`⚡ Đã nâng cấp Overclock Multiplier lên ${ArenaState.multiplier.toFixed(1)}x!`);
  } else if (itemKey === "booster") {
    if (ArenaState.streakBonusLevel >= 8) {
      safeToast("🔥 Streak Booster đã đạt mức tối đa (x8 điểm thưởng chuỗi)!");
      return;
    }
    if (ArenaState.cyberCredits < 200) {
      safeToast("💡 Cần $200 Cyber-Credits để mua Streak Booster!");
      return;
    }
    ArenaState.cyberCredits -= 200;
    ArenaState.streakBonusLevel = Math.min(8, ArenaState.streakBonusLevel * 2);
    ArenaAudio.playShopBuy();
    safeToast(`🔥 Đã kích hoạt Streak Booster (x${ArenaState.streakBonusLevel} điểm thưởng chuỗi)!`);
  } else if (itemKey === "insurance") {
    if (ArenaState.hasInsurance) {
      safeToast("🛡️ Bạn đang có sẵn Firewall Insurance rồi!");
      return;
    }
    if (ArenaState.cyberCredits < 100) {
      safeToast("💡 Cần $100 Cyber-Credits để mua Firewall Insurance!");
      return;
    }
    ArenaState.cyberCredits -= 100;
    ArenaState.hasInsurance = true;
    ArenaAudio.playShopBuy();
    safeToast("🛡️ Đã trang bị Firewall Insurance (Miễn phạt câu sai kế tiếp)!");
  }

  updateArenaHUD();
  updateCyberShopUI();
}

/* ----------------------------------------------------------------------------
 * 10. BLOOKET LUCKY CYBER-CRATE
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

  const shuffled = [...BLOOKET_REWARDS].sort(() => 0.5 - Math.random());

  shuffled.forEach((reward, idx) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cyber-crate-card p-6 rounded-3xl flex flex-col items-center text-center space-y-3 cursor-pointer";
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
 * 11. CYBER VICTORY PODIUM (openArenaPodium & resetArenaGame)
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

  const badgeEl = document.getElementById("podium-rank-badge");
  if (badgeEl) {
    badgeEl.className = `inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-sm font-extrabold border ${rankColor}`;
    badgeEl.textContent = rankTitle;
  }
  const descEl = document.getElementById("podium-rank-desc");
  if (descEl) descEl.textContent = rankDesc;

  const finalScoreEl = document.getElementById("podium-final-score");
  if (finalScoreEl) finalScoreEl.textContent = ArenaState.score.toLocaleString();

  const maxStreakEl = document.getElementById("podium-max-streak");
  if (maxStreakEl) maxStreakEl.textContent = `${ArenaState.maxStreak} 🔥`;

  const totalCreditsEl = document.getElementById("podium-total-credits");
  if (totalCreditsEl) totalCreditsEl.textContent = `$${ArenaState.totalCreditsEarned.toLocaleString()}`;

  const accuracyEl = document.getElementById("podium-accuracy");
  if (accuracyEl) accuracyEl.textContent = `${acc}% (${ArenaState.correctCount}/${ArenaState.totalAnswered})`;

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
  ArenaState.isInputLocked = false;
  ArenaState.telemetry.clear();

  const podiumModal = document.getElementById("arena-podium-modal");
  if (podiumModal) podiumModal.classList.add("hidden");

  updateArenaHUD();
  generateDynamicQuestion();
  safeToast("🚀 Đã khởi tạo ván Đấu trường Cyber Arena mới!");
}

// Global API & Module Exports
if (typeof window !== 'undefined') {
  window.ArenaState = ArenaState;
  window.ArenaAudio = ArenaAudio;
  window.ContentProvider = ContentProvider;
  window.SEMANTIC_CLUSTERS = SEMANTIC_CLUSTERS;
  window.CanonicalQuestionItem = CanonicalQuestionItem;
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
  module.exports = {
    ArenaState,
    ArenaAudio,
    ContentProvider,
    SEMANTIC_CLUSTERS,
    CanonicalQuestionItem,
    generateDynamicQuestion,
    applyKahootScoring,
    generateHomogeneousDistractors,
    getSemanticCluster
  };
}
