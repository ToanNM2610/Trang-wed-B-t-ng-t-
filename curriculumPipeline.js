/**
 * ============================================================================
 * LEXIMATRIX CURRICULUM PIPELINE & QUALITY VERIFICATION ENGINE
 * 
 * 1. Three-Tier Educational Stage Segmentation (Grades 1-12 | CEFR Pre-A1 -> B2)
 * 2. Standardized Item Schema (Data Contract with 9 strict fields)
 * 3. Four Golden Rules for Question Generation (Scope, Parity, Cluster, Disambiguation)
 * 4. Pre-Compilation Verification & Quality Pipeline (with Distractor Pool Balance Audit >= 10)
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.CurriculumPipeline = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {

  /* ----------------------------------------------------------------------------
   * 1. THREE-TIER EDUCATIONAL STAGE SEGMENTATION
   * ---------------------------------------------------------------------------- */
  const EDUCATIONAL_TIERS = {
    PRIMARY: {
      name: "Primary Tier",
      grades: [1, 2, 3, 4, 5],
      cefrRange: ["Pre-A1", "A1"],
      description: "Concrete vocabulary (animals, family, school items, colors, basic actions) and elementary structures (Present Simple, Present Continuous, basic imperatives). Zero abstract terminology.",
      allowedPOS: ["NOUN", "VERB", "ADJ", "ADV"]
    },
    LOWER_SECONDARY: {
      name: "Lower Secondary Tier",
      grades: [6, 7, 8, 9],
      cefrRange: ["A1", "A2", "A2+"],
      description: "Tense expansion (Past Simple, Past Continuous, Present Perfect, Future forms), comparatives/superlatives, basic modal verbs, common prepositions. Strict morphological parity.",
      allowedPOS: ["NOUN", "VERB", "ADJ", "ADV", "PHRASAL_VERB"]
    },
    UPPER_SECONDARY: {
      name: "Upper Secondary Tier",
      grades: [10, 11, 12],
      cefrRange: ["B1", "B2"],
      description: "Complex syntax (relative clauses, conditionals, passive voice, inversions), academic collocations, and contextual phrasal verbs. Contextual nuance and complete sentence anchoring.",
      allowedPOS: ["NOUN", "VERB", "ADJ", "ADV", "PHRASAL_VERB"]
    }
  };

  function getEducationalTier(grade) {
    const g = Number(grade);
    if (g >= 1 && g <= 5) return EDUCATIONAL_TIERS.PRIMARY;
    if (g >= 6 && g <= 9) return EDUCATIONAL_TIERS.LOWER_SECONDARY;
    return EDUCATIONAL_TIERS.UPPER_SECONDARY;
  }

  function getCefrBand(grade) {
    const g = Number(grade);
    if (g <= 2) return "Pre-A1";
    if (g <= 5) return "A1";
    if (g <= 7) return "A2";
    if (g <= 9) return "A2+";
    if (g === 10) return "B1";
    return "B2";
  }

  /* ----------------------------------------------------------------------------
   * 2. SEMANTIC CLUSTER & SYNONYM REGISTRY
   * ---------------------------------------------------------------------------- */
  const CURRICULUM_CLUSTERS = {
    CLUSTER_CREATE_INVENT: {
      id: "CLUSTER_CREATE_INVENT",
      words: ["invent", "create", "make", "produce", "build", "design", "develop", "construct", "discover", "originate"],
      meanings: ["phát minh", "sáng chế", "tạo ra", "chế tạo", "xây dựng", "thiết kế"]
    },
    CLUSTER_START_BEGIN: {
      id: "CLUSTER_START_BEGIN",
      words: ["start", "begin", "commence", "initiate", "launch", "open"],
      meanings: ["bắt đầu", "khởi đầu", "mở đầu", "khởi động"]
    },
    CLUSTER_FINISH_END: {
      id: "CLUSTER_FINISH_END",
      words: ["finish", "end", "complete", "conclude", "stop", "cease"],
      meanings: ["kết thúc", "hoàn thành", "chấm dứt", "dừng lại"]
    },
    CLUSTER_SPEAK_TALK: {
      id: "CLUSTER_SPEAK_TALK",
      words: ["speak", "talk", "tell", "say", "discuss", "chat", "state", "pronounce"],
      meanings: ["nói", "kể", "bảo", "thảo luận", "trò chuyện", "phát biểu"]
    },
    CLUSTER_LOOK_WATCH: {
      id: "CLUSTER_LOOK_WATCH",
      words: ["look", "see", "watch", "observe", "view", "notice"],
      meanings: ["nhìn", "thấy", "xem", "quan sát", "chú ý"]
    },
    CLUSTER_STUDY_LEARN: {
      id: "CLUSTER_STUDY_LEARN",
      words: ["study", "learn", "review", "revise", "read", "practice"],
      meanings: ["học", "học tập", "nghiên cứu", "ôn tập", "luyện tập"]
    },
    CLUSTER_BIG_LARGE: {
      id: "CLUSTER_BIG_LARGE",
      words: ["big", "large", "huge", "giant", "enormous", "great"],
      meanings: ["to", "lớn", "khổng lồ"]
    },
    CLUSTER_SMALL_LITTLE: {
      id: "CLUSTER_SMALL_LITTLE",
      words: ["small", "little", "tiny", "mini", "short"],
      meanings: ["nhỏ", "bé", "tí hon", "ngắn"]
    },
    CLUSTER_HAPPY_GLAD: {
      id: "CLUSTER_HAPPY_GLAD",
      words: ["happy", "glad", "pleased", "joyful", "cheerful"],
      meanings: ["vui vẻ", "hạnh phúc", "hân hoan"]
    },
    CLUSTER_FAST_QUICK: {
      id: "CLUSTER_FAST_QUICK",
      words: ["fast", "quick", "rapid", "speedy", "swift"],
      meanings: ["nhanh", "nhanh chóng", "mau lẹ"]
    },
    CLUSTER_CLEAN_TIDY: {
      id: "CLUSTER_CLEAN_TIDY",
      words: ["clean", "tidy", "neat", "spotless"],
      meanings: ["sạch sẽ", "gọn gàng", "ngăn nắp"]
    },
    CLUSTER_FAMILY_RELATIVES: {
      id: "CLUSTER_FAMILY_RELATIVES",
      words: ["father", "mother", "parent", "brother", "sister", "sibling"],
      meanings: ["bố", "mẹ", "cha", "anh", "chị", "em"]
    },
    CLUSTER_SCHOOL_ITEMS: {
      id: "CLUSTER_SCHOOL_ITEMS",
      words: ["pen", "pencil", "ruler", "eraser", "book", "bag"],
      meanings: ["bút", "bút chì", "thước", "tẩy", "sách", "cặp"]
    }
  };

  function resolveClusterId(word = "", meaning = "") {
    const w = String(word).trim().toLowerCase();
    const m = String(meaning).trim().toLowerCase();

    for (const cluster of Object.values(CURRICULUM_CLUSTERS)) {
      if (cluster.words.includes(w)) return cluster.id;
      for (const cm of cluster.meanings) {
        if (m.includes(cm) || cm.includes(m)) return cluster.id;
      }
    }
    // Deterministic fallback cluster ID based on meaning stem
    const stem = m.split(/[ ,;/]/)[0].replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '');
    return stem ? `CLUSTER_${stem.toUpperCase()}` : `CLUSTER_${w.toUpperCase()}`;
  }

  /* ----------------------------------------------------------------------------
   * 3. STANDARDIZED ITEM SCHEMA & NORMALIZER
   * ---------------------------------------------------------------------------- */
  const ALLOWED_POS = new Set(["NOUN", "VERB", "ADJ", "ADV", "PHRASAL_VERB"]);

  function normalizePOS(posRaw = "") {
    const p = String(posRaw).trim().toLowerCase();
    if (p === "phrasal v" || p === "phrasal verb") return "PHRASAL_VERB";
    if (p.includes("phrasal")) return "PHRASAL_VERB";
    if (p.startsWith("n") || p.includes("noun")) return "NOUN";
    if (p.startsWith("v") || p.includes("verb") || p === "v phr") return "VERB";
    if (p.startsWith("adj")) return "ADJ";
    if (p.startsWith("adv")) return "ADV";
    return "NOUN"; // Safe foundational default
  }

  function formatSemester(gradeNum, unitNum) {
    const g = Number(gradeNum);
    const u = Number(unitNum);
    // Typical SGK breakdown: first half is S1, second half is S2
    const s1Limit = (g <= 2) ? 8 : (g <= 5) ? 10 : (g <= 9) ? 6 : 5;
    return u <= s1Limit ? "S1" : "S2";
  }

  function formatStandardId(grade, semester, unit, pos, index) {
    const gStr = String(grade).padStart(2, '0');
    const uStr = String(unit).padStart(2, '0');
    const idxStr = String(index).padStart(3, '0');
    return `G${gStr}_${semester}_U${uStr}_${pos}_${idxStr}`;
  }

  function buildMaskedSentence(sentence, targetWord) {
    if (!sentence || typeof sentence !== 'string') {
      return `We always _____ during our daily English lesson.`;
    }
    const cleanWord = String(targetWord).trim();
    const regex = new RegExp(`\\b${cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(sentence)) {
      return sentence.replace(regex, '_____');
    }
    // Partial boundary match fallback
    return sentence.replace(new RegExp(cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '_____');
  }

  /* ----------------------------------------------------------------------------
   * 4. FOUNDATIONAL BALANCE LEXICON (Ensuring >= 10 distractors for all Grades & POS)
   * ---------------------------------------------------------------------------- */
  const FOUNDATIONAL_CURRICULUM_LEXICON = [
    // Primary Foundational Verbs (Grades 1-2)
    { word: "run", meaning: "chạy", pos: "VERB", grade: 1, unit: 1, ex: "I _____ in the playground." },
    { word: "jump", meaning: "nhảy", pos: "VERB", grade: 1, unit: 1, ex: "Rabbits can _____ high." },
    { word: "walk", meaning: "đi bộ", pos: "VERB", grade: 1, unit: 2, ex: "We _____ to school every morning." },
    { word: "play", meaning: "chơi", pos: "VERB", grade: 1, unit: 2, ex: "Children _____ football at break." },
    { word: "eat", meaning: "ăn", pos: "VERB", grade: 1, unit: 3, ex: "They _____ apples in the garden." },
    { word: "drink", meaning: "uống", pos: "VERB", grade: 1, unit: 3, ex: "Please _____ some warm milk." },
    { word: "see", meaning: "nhìn thấy", pos: "VERB", grade: 1, unit: 4, ex: "I _____ a little brown bird." },
    { word: "look", meaning: "nhìn, xem", pos: "VERB", grade: 1, unit: 4, ex: "Look at the colorful picture." },
    { word: "sing", meaning: "hát", pos: "VERB", grade: 1, unit: 5, ex: "We _____ English songs together." },
    { word: "dance", meaning: "nhảy múa", pos: "VERB", grade: 1, unit: 5, ex: "She can _____ very beautifully." },
    { word: "read", meaning: "đọc", pos: "VERB", grade: 1, unit: 6, ex: "Open your book and _____ aloud." },
    { word: "draw", meaning: "vẽ", pos: "VERB", grade: 1, unit: 6, ex: "Can you _____ a friendly cat?" },
    { word: "open", meaning: "mở", pos: "VERB", grade: 1, unit: 7, ex: "Please _____ your notebook now." },
    { word: "close", meaning: "đóng", pos: "VERB", grade: 1, unit: 7, ex: "Remember to _____ the wooden door." },
    { word: "listen", meaning: "lắng nghe", pos: "VERB", grade: 1, unit: 8, ex: "Listen carefully to the teacher." },
    { word: "swim", meaning: "bơi", pos: "VERB", grade: 1, unit: 8, ex: "Fish can _____ in clear water." },
    { word: "touch", meaning: "chạm vào", pos: "VERB", grade: 1, unit: 9, ex: "Touch your nose and ears." },
    { word: "sleep", meaning: "ngủ", pos: "VERB", grade: 1, unit: 9, ex: "Babies _____ peacefully at night." },

    // Primary Foundational Adjectives (Grades 1-2)
    { word: "big", meaning: "to, lớn", pos: "ADJ", grade: 1, unit: 1, ex: "This is a _____ school building." },
    { word: "small", meaning: "nhỏ, bé", pos: "ADJ", grade: 1, unit: 1, ex: "A _____ bird is in the tree." },
    { word: "happy", meaning: "vui vẻ", pos: "ADJ", grade: 1, unit: 2, ex: "Students feel _____ on sunny days." },
    { word: "sad", meaning: "buồn bã", pos: "ADJ", grade: 1, unit: 2, ex: "Do not feel _____ about mistakes." },
    { word: "hot", meaning: "nóng", pos: "ADJ", grade: 1, unit: 3, ex: "Summer weather is very _____." },
    { word: "cold", meaning: "lạnh", pos: "ADJ", grade: 1, unit: 3, ex: "Winter mornings are quite _____." },
    { word: "tall", meaning: "cao", pos: "ADJ", grade: 1, unit: 4, ex: "Giraffes have very _____ necks." },
    { word: "short", meaning: "ngắn, thấp", pos: "ADJ", grade: 1, unit: 4, ex: "My little brother is still _____." },
    { word: "fast", meaning: "nhanh", pos: "ADJ", grade: 1, unit: 5, ex: "Cheetahs are extremely _____ animals." },
    { word: "slow", meaning: "chậm chạp", pos: "ADJ", grade: 1, unit: 5, ex: "Turtles walk with _____ steps." },
    { word: "new", meaning: "mới", pos: "ADJ", grade: 1, unit: 6, ex: "I received a _____ backpack today." },
    { word: "old", meaning: "cũ, già", pos: "ADJ", grade: 1, unit: 6, ex: "An _____ tree stands by the gate." },
    { word: "clean", meaning: "sạch sẽ", pos: "ADJ", grade: 1, unit: 7, ex: "Keep our classroom neat and _____." },
    { word: "good", meaning: "tốt, ngoan", pos: "ADJ", grade: 1, unit: 7, ex: "You did a _____ job on this quiz." },
    { word: "nice", meaning: "đẹp, dễ thương", pos: "ADJ", grade: 1, unit: 8, ex: "Have a _____ weekend with family." },
    { word: "sweet", meaning: "ngọt ngào", pos: "ADJ", grade: 1, unit: 8, ex: "Ripe mangoes taste delicious and _____." },

    // Primary Foundational Adverbs (Grades 4-5)
    { word: "slowly", meaning: "chậm chạp", pos: "ADV", grade: 4, unit: 1, ex: "The turtle moves _____ along the road." },
    { word: "quickly", meaning: "nhanh chóng", pos: "ADV", grade: 4, unit: 1, ex: "He finished his exercise _____." },
    { word: "carefully", meaning: "cẩn thận", pos: "ADV", grade: 4, unit: 2, ex: "Read the instructions _____ before writing." },
    { word: "loudly", meaning: "to tiếng", pos: "ADV", grade: 4, unit: 2, ex: "The choir sang _____ on the stage." },
    { word: "quietly", meaning: "yên lặng", pos: "ADV", grade: 4, unit: 3, ex: "Students read books _____ in the library." },
    { word: "well", meaning: "tốt, giỏi", pos: "ADV", grade: 4, unit: 3, ex: "She plays the piano remarkably _____." },
    { word: "hard", meaning: "chăm chỉ", pos: "ADV", grade: 4, unit: 4, ex: "We study _____ to pass the test." },
    { word: "early", meaning: "sớm", pos: "ADV", grade: 4, unit: 4, ex: "Farmers wake up _____ in the morning." },
    { word: "late", meaning: "muộn", pos: "ADV", grade: 4, unit: 5, ex: "Do not arrive _____ for school." },
    { word: "often", meaning: "thường xuyên", pos: "ADV", grade: 4, unit: 5, ex: "How _____ do you practice English?" },
    { word: "always", meaning: "luôn luôn", pos: "ADV", grade: 4, unit: 6, ex: "I _____ brush my teeth before sleeping." },
    { word: "sometimes", meaning: "đôi khi", pos: "ADV", grade: 4, unit: 6, ex: "We _____ go camping at the weekend." },
    { word: "never", meaning: "không bao giờ", pos: "ADV", grade: 4, unit: 7, ex: "Good students _____ cheat in exams." },
    { word: "easily", meaning: "dễ dàng", pos: "ADV", grade: 4, unit: 7, ex: "He solved the puzzle quite _____." },

    // Secondary Foundational Phrasal Verbs (Grades 8-12)
    { word: "look after", meaning: "chăm sóc", pos: "PHRASAL_VERB", grade: 8, unit: 1, ex: "Older siblings _____ younger brothers." },
    { word: "give up", meaning: "từ bỏ", pos: "PHRASAL_VERB", grade: 8, unit: 1, ex: "Never _____ your career dream." },
    { word: "turn on", meaning: "bật lên", pos: "PHRASAL_VERB", grade: 8, unit: 2, ex: "Please _____ the ceiling fan." },
    { word: "turn off", meaning: "tắt đi", pos: "PHRASAL_VERB", grade: 8, unit: 2, ex: "Remember to _____ lights before leaving." },
    { word: "find out", meaning: "tìm ra, khám phá", pos: "PHRASAL_VERB", grade: 8, unit: 3, ex: "Scientists _____ new solar planets." },
    { word: "carry out", meaning: "thực hiện", pos: "PHRASAL_VERB", grade: 8, unit: 3, ex: "We will _____ an environmental survey." },
    { word: "put on", meaning: "mặc vào", pos: "PHRASAL_VERB", grade: 8, unit: 4, ex: "Put on your warm coat in winter." },
    { word: "take off", meaning: "cất cánh / cởi ra", pos: "PHRASAL_VERB", grade: 8, unit: 4, ex: "The flight will _____ in ten minutes." },
    { word: "get over", meaning: "vượt qua", pos: "PHRASAL_VERB", grade: 8, unit: 5, ex: "He worked hard to _____ the illness." },
    { word: "set up", meaning: "thiết lập, thành lập", pos: "PHRASAL_VERB", grade: 8, unit: 5, ex: "They plan to _____ an eco-club." },
    { word: "grow up", meaning: "lớn lên, trưởng thành", pos: "PHRASAL_VERB", grade: 8, unit: 6, ex: "Children _____ fast in healthy conditions." },
    { word: "break down", meaning: "hỏng hóc", pos: "PHRASAL_VERB", grade: 8, unit: 6, ex: "The old bus broke down on the hill." },
    { word: "bring up", meaning: "nuôi nấng / đề cập", pos: "PHRASAL_VERB", grade: 8, unit: 7, ex: "Grandparents helped _____ the children." },
    { word: "look forward to", meaning: "trông chờ, mong mỏi", pos: "PHRASAL_VERB", grade: 8, unit: 7, ex: "We _____ visiting the national museum." }
  ];

  /* ----------------------------------------------------------------------------
   * 5. COMPILER: COMPILE CERTIFIED CURRICULUM DATABASE
   * ---------------------------------------------------------------------------- */
  function compileCertifiedCurriculumDB(rawUnits = [], verbDatabase = []) {
    const certifiedItems = [];
    const seenItemKeys = new Set();
    let globalIndex = 1;

    // Helper to register standard item
    const registerItem = (itemData) => {
      const pos = normalizePOS(itemData.pos || itemData.part_of_speech);
      const grade = Number(itemData.grade || itemData.grade_level || 6);
      const unit = Number(itemData.unit || 1);
      const semester = itemData.semester || formatSemester(grade, unit);
      const cleanWord = String(itemData.word || itemData.target_word).trim();
      const meaning = String(itemData.meaning || itemData.primary_meaning_vn).trim();

      const uniqueKey = `${grade}_${cleanWord.toLowerCase()}_${pos}`;
      if (seenItemKeys.has(uniqueKey)) return;
      seenItemKeys.add(uniqueKey);

      const id = formatStandardId(grade, semester, unit, pos, globalIndex++);
      const cefrBand = getCefrBand(grade);
      const clusterId = itemData.synonym_cluster_id || resolveClusterId(cleanWord, meaning);
      const poolTag = `G${String(grade).padStart(2, '0')}_${pos}`;

      const rawEx = itemData.example || itemData.prompt_sentence || `In Unit ${unit}, students learn to use "${cleanWord}" in daily communication.`;
      const maskedSentence = buildMaskedSentence(rawEx, cleanWord);

      certifiedItems.push({
        id,
        target_word: cleanWord,
        part_of_speech: pos,
        grade_level: grade,
        cefr_band: cefrBand,
        tier: getEducationalTier(grade).name,
        prompt_sentence: maskedSentence,
        primary_meaning_vn: meaning,
        synonym_cluster_id: clusterId,
        distractor_pool_tag: poolTag,
        unit_number: unit,
        semester,
        collocation: itemData.collocation || "",
        ipa: itemData.ipa || ""
      });
    };

    // 1. Process Raw Curriculum Units (170 SGK units)
    if (Array.isArray(rawUnits)) {
      rawUnits.forEach((unit, uIdx) => {
        const gMatch = String(unit.grade).match(/\d+/);
        const gradeNum = gMatch ? parseInt(gMatch[0], 10) : 6;
        const unitNum = unit.unit || (uIdx + 1);

        if (Array.isArray(unit.vocabulary)) {
          unit.vocabulary.forEach(v => {
            registerItem({
              word: v.word,
              pos: v.pos,
              meaning: v.meaning,
              example: v.example,
              ipa: v.ipa,
              collocation: v.collocation,
              grade: gradeNum,
              unit: unitNum
            });
          });
        }
      });
    }

    // 2. Process Foundational Lexicon (Guaranteeing Balance across all grades)
    FOUNDATIONAL_CURRICULUM_LEXICON.forEach(fv => {
      registerItem(fv);
    });

    // 3. Process Verb Database into respective Grade Levels
    if (Array.isArray(verbDatabase)) {
      verbDatabase.forEach(vb => {
        const vGrade = Number(vb.grade) || 6;
        registerItem({
          word: vb.v1,
          pos: "VERB",
          meaning: vb.meaning,
          example: vb.activeObject ? `Students regularly ${vb.v1} ${vb.activeObject}.` : `They always ${vb.v1} carefully.`,
          ipa: vb.ipaUS,
          grade: vGrade,
          unit: (vb.id ? (Number(vb.id) % 12) + 1 : 1)
        });
      });
    }

    return certifiedItems;
  }

  /* ----------------------------------------------------------------------------
   * 6. FOUR GOLDEN RULES ENGINE (Strict Distractor Generator)
   * ---------------------------------------------------------------------------- */
  function generateCertifiedDistractors(targetItem, certifiedDB = [], count = 3) {
    if (!targetItem || !Array.isArray(certifiedDB) || certifiedDB.length === 0) {
      return [];
    }

    // Rule 1: Scope Isolation: ONLY candidates from Grade 1 through targetItem.grade_level
    // Rule 2: Strict Morphological & POS Parity: cand.part_of_speech === targetItem.part_of_speech
    // Rule 3: Zero Cluster Collision: cand.synonym_cluster_id !== targetItem.synonym_cluster_id
    //         AND word and meaning distinct
    const targetWord = targetItem.target_word.toLowerCase();
    const targetMeaning = targetItem.primary_meaning_vn.toLowerCase();

    const eligibleCandidates = certifiedDB.filter(cand => {
      // Rule 1: Scope Isolation
      if (cand.grade_level > targetItem.grade_level) return false;

      // Rule 2: Part-of-speech Parity
      if (cand.part_of_speech !== targetItem.part_of_speech) return false;

      // Self-exclusion
      if (cand.target_word.toLowerCase() === targetWord) return false;
      if (cand.primary_meaning_vn.toLowerCase() === targetMeaning) return false;

      // Rule 3: Zero Cluster Collision
      if (cand.synonym_cluster_id === targetItem.synonym_cluster_id) return false;

      return true;
    });

    // Deduplicate candidates by target_word
    const uniquePool = [];
    const seenWords = new Set();
    for (const cand of eligibleCandidates) {
      const w = cand.target_word.toLowerCase();
      if (!seenWords.has(w)) {
        seenWords.add(w);
        uniquePool.push(cand);
      }
    }

    // Shuffle and pick desired count
    const shuffled = uniquePool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    // If pool fell short (should never happen with certified balance), borrow from same POS within allowed tier
    if (selected.length < count) {
      const tierFallback = certifiedDB.filter(c =>
        c.part_of_speech === targetItem.part_of_speech &&
        c.target_word.toLowerCase() !== targetWord &&
        !seenWords.has(c.target_word.toLowerCase())
      ).sort(() => 0.5 - Math.random());

      for (const fb of tierFallback) {
        selected.push(fb);
        if (selected.length >= count) break;
      }
    }

    return selected;
  }

  /* ----------------------------------------------------------------------------
   * 7. CURRICULUM VERIFICATION & QUALITY PIPELINE (Automated Audit >= 10)
   * ---------------------------------------------------------------------------- */
  function runCurriculumQualityPipeline(certifiedDB = []) {
    const report = {
      timestamp: new Date().toISOString(),
      totalItems: certifiedDB.length,
      tierBreakdown: {
        PRIMARY: 0,
        LOWER_SECONDARY: 0,
        UPPER_SECONDARY: 0
      },
      posBreakdown: {
        NOUN: 0,
        VERB: 0,
        ADJ: 0,
        ADV: 0,
        PHRASAL_VERB: 0
      },
      schemaValidCount: 0,
      schemaErrorCount: 0,
      balanceAuditPassedCount: 0,
      balanceAuditFailedCount: 0,
      auditPassed: false,
      issues: []
    };

    // 1. Schema & Syntax Validation
    certifiedDB.forEach((item, idx) => {
      let isValid = true;
      const requiredFields = [
        "id", "target_word", "part_of_speech", "grade_level",
        "cefr_band", "prompt_sentence", "primary_meaning_vn",
        "synonym_cluster_id", "distractor_pool_tag"
      ];

      for (const field of requiredFields) {
        if (item[field] === undefined || item[field] === null || String(item[field]).trim() === "") {
          report.issues.push(`Item #${idx} (${item.id || 'N/A'}) missing required field: ${field}`);
          isValid = false;
        }
      }

      if (!ALLOWED_POS.has(item.part_of_speech)) {
        report.issues.push(`Item ${item.id} has invalid POS: ${item.part_of_speech}`);
        isValid = false;
      }

      if (isValid) report.schemaValidCount++;
      else report.schemaErrorCount++;

      // Track breakdowns
      if (item.grade_level <= 5) report.tierBreakdown.PRIMARY++;
      else if (item.grade_level <= 9) report.tierBreakdown.LOWER_SECONDARY++;
      else report.tierBreakdown.UPPER_SECONDARY++;

      if (report.posBreakdown[item.part_of_speech] !== undefined) {
        report.posBreakdown[item.part_of_speech]++;
      }
    });

    // 2. Distractor Pool Balance Check (Every item has >= 10 eligible distractors)
    certifiedDB.forEach(item => {
      const eligible = certifiedDB.filter(cand =>
        cand.grade_level <= item.grade_level &&
        cand.part_of_speech === item.part_of_speech &&
        cand.target_word.toLowerCase() !== item.target_word.toLowerCase() &&
        cand.primary_meaning_vn.toLowerCase() !== item.primary_meaning_vn.toLowerCase() &&
        cand.synonym_cluster_id !== item.synonym_cluster_id
      );

      // Deduplicate words
      const uniqueWords = new Set(eligible.map(c => c.target_word.toLowerCase()));

      if (uniqueWords.size >= 10) {
        report.balanceAuditPassedCount++;
      } else {
        report.balanceAuditFailedCount++;
        report.issues.push(`[Distractor Balance Warning] ${item.id} (${item.target_word} - ${item.part_of_speech} Grade ${item.grade_level}) has only ${uniqueWords.size} eligible distractors (required >= 10)`);
      }
    });

    report.auditPassed = (report.schemaErrorCount === 0 && report.balanceAuditFailedCount === 0);
    return report;
  }

  /* ----------------------------------------------------------------------------
   * 8. SINGLETON INSTANCE & EXPORTS
   * ---------------------------------------------------------------------------- */
  let activeCertifiedDB = null;

  function initCertifiedDB(rawCurriculum = null, verbDb = null) {
    let curr = rawCurriculum;
    let verbs = verbDb;

    if (!curr && typeof window !== 'undefined' && window.CURRICULUM_DATA) {
      curr = window.CURRICULUM_DATA;
    }
    if (!verbs && typeof window !== 'undefined' && window.VERB_DATABASE) {
      verbs = window.VERB_DATABASE;
    }

    activeCertifiedDB = compileCertifiedCurriculumDB(curr, verbs);
    if (typeof window !== 'undefined') {
      window.CERTIFIED_CURRICULUM_DB = activeCertifiedDB;
    }
    return activeCertifiedDB;
  }

  function getCertifiedDB() {
    if (!activeCertifiedDB) {
      initCertifiedDB();
    }
    return activeCertifiedDB;
  }

  return {
    EDUCATIONAL_TIERS,
    CURRICULUM_CLUSTERS,
    getEducationalTier,
    getCefrBand,
    normalizePOS,
    formatSemester,
    formatStandardId,
    buildMaskedSentence,
    resolveClusterId,
    compileCertifiedCurriculumDB,
    generateCertifiedDistractors,
    runCurriculumQualityPipeline,
    initCertifiedDB,
    getCertifiedDB
  };
});
