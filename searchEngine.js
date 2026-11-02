/**
 * ============================================================================
 * LEXIMATRIX MULTI-FIELD FUZZY SEARCH ENGINE
 * 
 * Production-grade 4-Stage Search Pipeline:
 * 1. Bidirectional Normalization & Canonical Representation (Diacritic Shadow Indexing)
 * 2. Multi-Field Data Schema & Field Weighting (V1=1.0, V2=0.9, V3=0.9, VN_exact=0.85, VN_folded=0.70)
 * 3. Tiered Multi-Pass Matching Pipeline (Pass 1: Exact, Pass 2: Prefix, Pass 3: Infix, Pass 4: Damerau-Levenshtein)
 * 4. Mathematical Scoring & Ranking Formulation S(r, q) = max(W_f * MatchConfidence * LengthPenalty)
 * 5. Deduplication & Cross-Form Consolidation (+10% Multi-Hit Reinforcement Bonus)
 * ============================================================================
 */

(function (root, factory) {
  const engine = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = engine;
  }
  if (root) root.LexiSearchEngine = engine;
  if (typeof window !== 'undefined') window.LexiSearchEngine = engine;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {

  /* ----------------------------------------------------------------------------
   * 1. BIDIRECTIONAL NORMALIZATION & CANONICAL REPRESENTATION
   * ---------------------------------------------------------------------------- */

  /**
   * De-accent / strip tone marks and non-Latin glyphs down to base Latin equivalents
   * e.g. "bắt đầu" -> "bat dau", "đ" -> "d"
   */
  function removeVietnameseTones(str) {
    if (!str) return '';
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .toLowerCase();
  }

  /**
   * Tokenize English verb forms into clean canonical tokens
   * Strips irregular punctuation, slashes, or parentheses
   * e.g. "hang / hung / hung" -> ["hang", "hung"]
   */
  function tokenizeEnglish(str) {
    if (!str) return [];
    return String(str)
      .toLowerCase()
      .split(/[\/,\(\)\s]+/)
      .map(t => t.replace(/[^a-z0-9'-]/g, '').trim())
      .filter(t => t.length > 0);
  }

  /**
   * Tokenize Vietnamese definition into:
   * - clauses: comma/semicolon/slash separated phrases
   * - words: individual words
   * - full: normalized string
   */
  function tokenizeVietnamese(str, isFolded = false) {
    if (!str) return { full: '', clauses: [], words: [] };
    let raw = isFolded ? removeVietnameseTones(str) : String(str).toLowerCase().trim();
    // Normalize Unicode NFC
    raw = raw.normalize('NFC');

    const clauses = raw
      .split(/[,;\/\(\)]+/)
      .map(c => c.replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s'-]/g, '').trim())
      .filter(Boolean);

    const words = raw
      .split(/[\s,;\/\(\)\.\-]+/)
      .map(w => w.replace(/[^a-zA-Z0-9\u00C0-\u1EF9'-]/g, '').trim())
      .filter(Boolean);

    return { full: raw, clauses, words };
  }

  /* ----------------------------------------------------------------------------
   * 2. FIELD WEIGHTS & CONFIGURATION
   * ---------------------------------------------------------------------------- */
  const FIELD_WEIGHTS = {
    v1: 1.0,         // Base Form: Primary lookup anchor
    v2: 0.9,         // Past Simple: Forgotten past tense forms
    v3: 0.9,         // Past Participle: Passive/perfect constructions
    vn_exact: 0.85,  // Accented Vietnamese: High-precision conceptual lookup
    vn_folded: 0.70  // Unaccented Vietnamese: Fast-typing shadow index
  };

  /* ----------------------------------------------------------------------------
   * 3. DAMERAU-LEVENSHTEIN EDIT DISTANCE (PASS 4 FUZZY ENGINE)
   * 
   * Computes true edit distance accounting for:
   * - Insertions (+1)
   * - Deletions (+1)
   * - Substitutions (+1)
   * - Adjacent character transpositions (+1)
   * ---------------------------------------------------------------------------- */
  function damerauLevenshtein(source, target) {
    if (source === target) return 0;
    const sLen = source.length;
    const tLen = target.length;
    if (sLen === 0) return tLen;
    if (tLen === 0) return sLen;

    const matrix = [];
    for (let i = 0; i <= sLen; i++) {
      matrix[i] = new Array(tLen + 1);
      matrix[i][0] = i;
    }
    for (let j = 0; j <= tLen; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= sLen; i++) {
      const sChar = source.charAt(i - 1);
      for (let j = 1; j <= tLen; j++) {
        const tChar = target.charAt(j - 1);
        const cost = sChar === tChar ? 0 : 1;

        let min = Math.min(
          matrix[i - 1][j] + 1,       // Deletion
          matrix[i][j - 1] + 1,       // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );

        // Transposition check
        if (
          i > 1 &&
          j > 1 &&
          sChar === target.charAt(j - 2) &&
          source.charAt(i - 2) === tChar
        ) {
          min = Math.min(min, matrix[i - 2][j - 2] + 1);
        }

        matrix[i][j] = min;
      }
    }

    return matrix[sLen][tLen];
  }

  /* ----------------------------------------------------------------------------
   * 4. INVERTED MULTI-FIELD INDEX STORE
   * ---------------------------------------------------------------------------- */
  let indexedRecords = [];
  let indexMap = new Map();

  /**
   * Build indexed representation for a single lexicon item (verb, noun, adj, adv, etc.)
   */
  function indexVerbRecord(verb) {
    const headword = (verb.v1 || verb.word || '').trim();
    const v1Tokens = tokenizeEnglish(headword);
    const v2Tokens = tokenizeEnglish(verb.v2);
    const v3Tokens = tokenizeEnglish(verb.v3);
    const vnExact = tokenizeVietnamese(verb.meaning, false);
    const vnFolded = tokenizeVietnamese(verb.meaning, true);

    // Morphological pattern classification
    const v1Clean = headword.toLowerCase();
    const v2First = (verb.v2 || '').toLowerCase().split('/')[0].trim();
    const v3First = (verb.v3 || '').toLowerCase().split('/')[0].trim();
    let pattern = 'REGULAR';
    if (verb.isIrregular) {
      if (v1Clean === v2First && v2First === v3First) pattern = 'A-A-A';
      else if (v2First === v3First && v1Clean !== v2First) pattern = 'A-B-B';
      else if (v1Clean === v3First && v1Clean !== v2First) pattern = 'A-B-A';
      else pattern = 'A-B-C';
    }

    const posTag = (verb.pos || 'v').toLowerCase();
    const uniqueId = `${v1Clean}_${posTag}`;

    return {
      id: uniqueId,
      record: verb,
      pattern: pattern,
      fields: {
        v1: { tokens: v1Tokens, raw: v1Clean },
        v2: { tokens: v2Tokens, raw: (verb.v2 || '').toLowerCase().trim() },
        v3: { tokens: v3Tokens, raw: (verb.v3 || '').toLowerCase().trim() },
        vn_exact: vnExact,
        vn_folded: vnFolded
      }
    };
  }

  function initIndex(lexiconDatabase) {
    if (!Array.isArray(lexiconDatabase)) return;
    indexedRecords = [];
    indexMap.clear();

    lexiconDatabase.forEach(item => {
      if (!item || (!item.v1 && !item.word)) return;
      const indexed = indexVerbRecord(item);
      indexedRecords.push(indexed);
      indexMap.set(indexed.id, indexed);
    });

    return indexedRecords.length;
  }

  /* ----------------------------------------------------------------------------
   * 5. TIERED MULTI-PASS MATCHING EVALUATION FOR A SINGLE FIELD
   * 
   * Returns: { match: boolean, confidence: number, matchedString: string, pass: number }
   * ---------------------------------------------------------------------------- */
  function evaluateFieldMatch(queryNorm, fieldKey, fieldData, qLen) {
    if (!queryNorm || !fieldData) return null;

    const isEnglishField = fieldKey === 'v1' || fieldKey === 'v2' || fieldKey === 'v3';

    if (isEnglishField) {
      const tokens = fieldData.tokens || [];
      const raw = fieldData.raw || '';

      // --- Pass 1: Exact Equality Match (Confidence: 1.0) ---
      for (const t of tokens) {
        if (t === queryNorm) {
          return { match: true, confidence: 1.0, matchedString: t, pass: 1 };
        }
      }

      // --- Pass 2: Prefix Matching (Confidence: 0.90 - 0.95) ---
      for (const t of tokens) {
        if (t.startsWith(queryNorm)) {
          return { match: true, confidence: 0.95, matchedString: t, pass: 2 };
        }
      }

      // --- Pass 3: Infix / Word-Boundary Substring Match (Confidence: 0.65 - 0.75) ---
      for (const t of tokens) {
        const idx = t.indexOf(queryNorm);
        if (idx !== -1) {
          const confidence = idx === 0 ? 0.90 : 0.65;
          return { match: true, confidence, matchedString: t, pass: 3 };
        }
      }
      if (raw.includes(queryNorm)) {
        return { match: true, confidence: 0.60, matchedString: raw, pass: 3 };
      }

      // --- Pass 4: Bounded Edit-Distance / Fuzzy Match (Confidence: 0.20 - 0.55) ---
      // Length-Adaptive Thresholding:
      // Length <= 3: max distance = 0 (disabled)
      // Length 4 - 6: max distance = 1
      // Length > 6: max distance = 2
      if (qLen >= 4) {
        const maxDist = qLen <= 6 ? 1 : 2;
        let bestDist = Infinity;
        let bestToken = '';

        for (const t of tokens) {
          // Optimization: skip strings whose length difference already exceeds maxDist
          if (Math.abs(t.length - qLen) > maxDist) continue;
          const dist = damerauLevenshtein(queryNorm, t);
          if (dist <= maxDist && dist < bestDist) {
            bestDist = dist;
            bestToken = t;
          }
        }

        if (bestDist === 1) {
          const initialMatch = bestToken.charAt(0) === queryNorm.charAt(0);
          const confidence = initialMatch ? 0.55 : 0.45;
          return { match: true, confidence, matchedString: bestToken, pass: 4 };
        } else if (bestDist === 2) {
          const initialMatch = bestToken.charAt(0) === queryNorm.charAt(0);
          const confidence = initialMatch ? 0.40 : 0.30;
          return { match: true, confidence, matchedString: bestToken, pass: 4 };
        }
      }

    } else {
      // Vietnamese Field (vn_exact or vn_folded)
      const { full, clauses, words } = fieldData;

      // --- Pass 1: Exact Equality Match (Confidence: 1.0) ---
      // Checks if query strictly equals any clause or any distinct word
      for (const w of words) {
        if (w === queryNorm) {
          return { match: true, confidence: 1.0, matchedString: w, pass: 1 };
        }
      }
      for (const c of clauses) {
        if (c === queryNorm) {
          return { match: true, confidence: 1.0, matchedString: c, pass: 1 };
        }
      }

      // --- Pass 2: Prefix Matching (Confidence: 0.85 - 0.95) ---
      // Prefixes anchored at word boundaries receive higher rank
      for (const c of clauses) {
        if (c.startsWith(queryNorm)) {
          return { match: true, confidence: 0.95, matchedString: c, pass: 2 };
        }
      }
      for (const w of words) {
        if (w.startsWith(queryNorm)) {
          return { match: true, confidence: 0.90, matchedString: w, pass: 2 };
        }
      }

      // --- Pass 3: Infix / Word-Boundary Substring Match (Confidence: 0.60 - 0.75) ---
      for (const c of clauses) {
        const idx = c.indexOf(queryNorm);
        if (idx !== -1) {
          // Word boundary check: preceded by space or start of string
          const isWordBoundary = idx === 0 || c.charAt(idx - 1) === ' ';
          const confidence = isWordBoundary ? 0.75 : 0.60;
          return { match: true, confidence, matchedString: c, pass: 3 };
        }
      }
      if (full.includes(queryNorm)) {
        return { match: true, confidence: 0.60, matchedString: full, pass: 3 };
      }

      // --- Pass 4: Bounded Edit-Distance / Fuzzy Match for Vietnamese words ---
      if (qLen >= 4) {
        const maxDist = qLen <= 6 ? 1 : 2;
        let bestDist = Infinity;
        let bestWord = '';

        for (const w of words) {
          if (Math.abs(w.length - qLen) > maxDist) continue;
          const dist = damerauLevenshtein(queryNorm, w);
          if (dist <= maxDist && dist < bestDist) {
            bestDist = dist;
            bestWord = w;
          }
        }

        if (bestDist === 1) {
          return { match: true, confidence: 0.45, matchedString: bestWord, pass: 4 };
        } else if (bestDist === 2) {
          return { match: true, confidence: 0.30, matchedString: bestWord, pass: 4 };
        }
      }
    }

    return null;
  }

  /* ----------------------------------------------------------------------------
   * 6. MATHEMATICAL SCORING & DEDUPLICATION PIPELINE
   * 
   * Composite Formula:
   * S(r, q) = max_{f in Fields} ( W_f * MatchConfidence(q, r_f) * LengthPenalty(q, r_f) )
   * LengthPenalty(q, r_f) = min(1.0, Length(q) / Length(r_f))
   * Multi-Hit Bonus: S_final = S(r, q) * 1.10 (if hitCount > 1)
   * ---------------------------------------------------------------------------- */
  function search(rawQuery, options = {}) {
    const qRaw = String(rawQuery || '').trim();
    if (!qRaw) return [];

    const {
      patternFilter = 'all',
      limit = null,
      minScore = 0.15,
      includeScoreDetails = false
    } = options;

    // Dual lexical projections
    const qLower = qRaw.toLowerCase();
    const qFolded = removeVietnameseTones(qRaw);
    const qLen = qLower.length;
    const qFoldedLen = qFolded.length;

    const hasDiacritics = qLower !== qFolded;

    const results = [];

    // If records have not been indexed yet, index now
    if (indexedRecords.length === 0) {
      if (typeof window !== 'undefined' && Array.isArray(window.universalLexicon) && window.universalLexicon.length > 0) {
        initIndex(window.universalLexicon);
      } else if (typeof window !== 'undefined' && Array.isArray(window.VERB_DATABASE)) {
        initIndex(window.VERB_DATABASE);
      }
    }

    for (let i = 0; i < indexedRecords.length; i++) {
      const entity = indexedRecords[i];

      // Pattern filtering
      if (patternFilter !== 'all' && entity.pattern !== patternFilter) {
        continue;
      }

      let maxFieldScore = 0;
      let bestField = '';
      let bestPass = 0;
      let bestMatchedStr = '';
      let hitCount = 0;

      // Evaluate English fields (v1, v2, v3)
      const englishFields = ['v1', 'v2', 'v3'];
      for (const fKey of englishFields) {
        const fieldMatch = evaluateFieldMatch(qLower, fKey, entity.fields[fKey], qLen);
        if (fieldMatch && fieldMatch.match) {
          hitCount++;
          const wf = FIELD_WEIGHTS[fKey];
          const matchedTarget = fieldMatch.matchedString || entity.fields[fKey].raw;
          const targetLen = matchedTarget.length || qLen;
          const lengthPenalty = Math.min(1.0, qLen / Math.max(1, targetLen));
          const score = wf * fieldMatch.confidence * lengthPenalty;

          if (score > maxFieldScore) {
            maxFieldScore = score;
            bestField = fKey;
            bestPass = fieldMatch.pass;
            bestMatchedStr = fieldMatch.matchedString;
          }
        }
      }

      // Evaluate Vietnamese fields:
      // If query has tone marks (e.g. "bắt"), prioritize vn_exact;
      // otherwise, evaluate vn_folded as well.
      if (hasDiacritics) {
        const vnExactMatch = evaluateFieldMatch(qLower, 'vn_exact', entity.fields.vn_exact, qLen);
        if (vnExactMatch && vnExactMatch.match) {
          hitCount++;
          const wf = FIELD_WEIGHTS.vn_exact;
          const targetLen = (vnExactMatch.matchedString || '').length || qLen;
          const lengthPenalty = Math.min(1.0, qLen / Math.max(1, targetLen));
          const score = wf * vnExactMatch.confidence * lengthPenalty;

          if (score > maxFieldScore) {
            maxFieldScore = score;
            bestField = 'vn_exact';
            bestPass = vnExactMatch.pass;
            bestMatchedStr = vnExactMatch.matchedString;
          }
        }
      } else {
        // Evaluate vn_folded shadow index
        const vnFoldedMatch = evaluateFieldMatch(qFolded, 'vn_folded', entity.fields.vn_folded, qFoldedLen);
        if (vnFoldedMatch && vnFoldedMatch.match) {
          hitCount++;
          const wf = FIELD_WEIGHTS.vn_folded;
          const targetLen = (vnFoldedMatch.matchedString || '').length || qFoldedLen;
          const lengthPenalty = Math.min(1.0, qFoldedLen / Math.max(1, targetLen));
          const score = wf * vnFoldedMatch.confidence * lengthPenalty;

          if (score > maxFieldScore) {
            maxFieldScore = score;
            bestField = 'vn_folded';
            bestPass = vnFoldedMatch.pass;
            bestMatchedStr = vnFoldedMatch.matchedString;
          }
        }

        // Also check if matches vn_exact (e.g. if definition has Latin words)
        const vnExactMatch = evaluateFieldMatch(qLower, 'vn_exact', entity.fields.vn_exact, qLen);
        if (vnExactMatch && vnExactMatch.match) {
          hitCount++;
          const wf = FIELD_WEIGHTS.vn_exact;
          const targetLen = (vnExactMatch.matchedString || '').length || qLen;
          const lengthPenalty = Math.min(1.0, qLen / Math.max(1, targetLen));
          const score = wf * vnExactMatch.confidence * lengthPenalty;

          if (score > maxFieldScore) {
            maxFieldScore = score;
            bestField = 'vn_exact';
            bestPass = vnExactMatch.pass;
            bestMatchedStr = vnExactMatch.matchedString;
          }
        }
      }

      if (maxFieldScore >= minScore) {
        // Multi-hit reinforcement bonus: +10% to composite score if matching multiple forms/fields
        const multiHitBonus = hitCount > 1 ? 1.10 : 1.0;
        const finalScore = maxFieldScore * multiHitBonus;

        const resultItem = {
          verb: entity.record,
          score: finalScore,
          hitCount,
          bestField,
          bestPass,
          matchedString: bestMatchedStr
        };

        if (includeScoreDetails) {
          resultItem.rawScore = maxFieldScore;
          resultItem.bonus = multiHitBonus;
        }

        results.push(resultItem);
      }
    }

    // Sort descending by composite score, then alphabetical by headword
    results.sort((a, b) => {
      if (Math.abs(b.score - a.score) > 0.001) {
        return b.score - a.score;
      }
      const aWord = (a.verb.v1 || a.verb.word || '').toLowerCase();
      const bWord = (b.verb.v1 || b.verb.word || '').toLowerCase();
      return aWord.localeCompare(bWord);
    });

    if (limit && limit > 0) {
      return results.slice(0, limit);
    }

    return results;
  }

  /* ----------------------------------------------------------------------------
   * 7. PUBLIC API CONTRACT
   * ---------------------------------------------------------------------------- */
  return {
    initIndex,
    search,
    damerauLevenshtein,
    removeVietnameseTones,
    tokenizeEnglish,
    tokenizeVietnamese,
    FIELD_WEIGHTS,
    getIndexedCount: () => indexedRecords.length
  };
});

