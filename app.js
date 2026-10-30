/**
 * =========================================================================
 * LEXIMATRIX ULTRA — CORE APPLICATION ENGINE (v3.0.0)
 * Cyber-Dashboard Architecture: 12-Tense Matrix | SGK 1-12 | Quiz & 3D Flashcard
 * =========================================================================
 */

(function (window, document) {
  'use strict';

  // =========================================================================
  // 1. DATA SOURCE NORMALIZATION & HELPERS
  // =========================================================================
  function formatPassiveSubject(objStr) {
    const cleaned = (objStr || '').trim();
    if (!cleaned) return 'It';
    const noPrep = cleaned.replace(/^(to|at|in|on|with|for|from|by|into|onto|around|through)\s+/i, '');
    const target = noPrep || cleaned;
    return target.charAt(0).toUpperCase() + target.slice(1);
  }

  function normalizeVerb(item) {
    if (!item) return null;
    const v1 = (item.v1 || '').trim();
    if (!v1) return null;
    const vs = item.vs || item.v_s_es || (v1.endsWith('s') || v1.endsWith('ch') || v1.endsWith('sh') || v1.endsWith('x') || v1.endsWith('o') ? v1 + 'es' : v1 + 's');
    const v2 = item.v2 || v1;
    const v3 = item.v3 || v1;
    const ving = item.ving || item.v_ing || (v1.endsWith('e') && !v1.endsWith('ee') ? v1.slice(0, -1) + 'ing' : v1 + 'ing');
    const ipaUS = item.ipaUS || item.ipa || `/${v1}/`;
    const meaning = item.meaning || '';
    const isIrregular = item.isIrregular !== undefined ? Boolean(item.isIrregular) : true;
    const isTransitive = item.isTransitive !== undefined
      ? Boolean(item.isTransitive)
      : (item.transitive !== undefined ? Boolean(item.transitive) : true);
    const activeObject = item.activeObject !== undefined
      ? item.activeObject
      : (item.object_sample !== undefined ? item.object_sample : '');
    const passiveSubject = item.passiveSubject || formatPassiveSubject(activeObject);
    const grade = item.grade || 6;

    return {
      ...item,
      v1,
      vs,
      v2,
      v3,
      ving,
      ipaUS,
      meaning,
      isIrregular,
      isTransitive,
      activeObject,
      passiveSubject,
      grade
    };
  }

  function removeVietnameseTones(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  }

  // Raw Verbs Store
  const RAW_VERBS = (typeof window !== 'undefined' && Array.isArray(window.VERB_DATABASE))
    ? window.VERB_DATABASE
    : [];

  const VERB_STORE = RAW_VERBS.map(normalizeVerb).filter(Boolean);

  function findOrBuildVerb(query) {
    if (!query) return null;
    const clean = query.trim().toLowerCase();
    
    // Exact search in database
    const exact = VERB_STORE.find(v => 
      v.v1.toLowerCase() === clean ||
      v.v2.toLowerCase() === clean ||
      v.v3.toLowerCase() === clean ||
      v.vs.toLowerCase() === clean ||
      v.ving.toLowerCase() === clean
    );
    if (exact) return exact;

    // Meaning search
    const cleanNoTone = removeVietnameseTones(clean);
    const meaningMatch = VERB_STORE.find(v => {
      const vMeaningNoTone = removeVietnameseTones(v.meaning);
      return vMeaningNoTone.includes(cleanNoTone);
    });
    if (meaningMatch) return meaningMatch;

    // Regular Verb Fallback
    const vs = clean.endsWith('s') || clean.endsWith('ch') || clean.endsWith('sh') || clean.endsWith('x') || clean.endsWith('o') ? clean + 'es' : clean + 's';
    const v2 = clean.endsWith('e') ? clean + 'd' : clean + 'ed';
    const v3 = v2;
    const ving = clean.endsWith('e') && !clean.endsWith('ee') ? clean.slice(0, -1) + 'ing' : clean + 'ing';

    return {
      v1: clean,
      vs: vs,
      v2: v2,
      v3: v3,
      ving: ving,
      ipaUS: `/${clean}/`,
      meaning: 'động từ hợp quy tắc (tự động tạo)',
      isIrregular: false,
      isTransitive: true,
      activeObject: 'the task',
      passiveSubject: 'The task',
      grade: 6
    };
  }

  // =========================================================================
  // 2. 12-TENSES DEFINITIONS & GRAMMATICAL RULES
  // =========================================================================
  const TENSES = [
    // PRESENT TIMEFRAME
    {
      id: 'present_simple',
      name: 'Hiện tại đơn',
      en: 'Present Simple',
      timeframe: 'present',
      aspect: 'simple',
      themeClass: 'theme-present',
      timeframeColor: 'emerald',
      tag: '01 • SIMPLE',
      aspectLabel: 'Trạng thái Đơn',
      formula: 'S + V1/Vs-es',
      formulaPassive: 'S + am/is/are + V3',
      usage: 'Diễn tả thói quen lặp đi lặp lại hàng ngày, chân lý khoa học bất biến, lịch trình cố định hoặc sự thật hiển nhiên.',
      signals: 'always, usually, often, sometimes, rarely, never, every day/week, on Mondays',
      markerPosition: 50,
      markerType: 'point'
    },
    {
      id: 'present_continuous',
      name: 'Hiện tại tiếp diễn',
      en: 'Present Continuous',
      timeframe: 'present',
      aspect: 'continuous',
      themeClass: 'theme-future',
      timeframeColor: 'cyan',
      tag: '02 • CONTINUOUS',
      aspectLabel: 'Trạng thái Tiếp diễn',
      formula: 'S + am/is/are + V-ing',
      formulaPassive: 'S + am/is/are + being + V3',
      usage: 'Diễn tả hành động đang diễn ra ngay tại thời điểm nói, hoặc xu hướng thay đổi tạm thời trong hiện tại.',
      signals: 'now, right now, at the moment, currently, at present, Look!, Listen!',
      markerPosition: 50,
      markerType: 'wave'
    },
    {
      id: 'present_perfect',
      name: 'Hiện tại hoàn thành',
      en: 'Present Perfect',
      timeframe: 'present',
      aspect: 'perfect',
      themeClass: 'theme-violet',
      timeframeColor: 'violet',
      tag: '03 • PERFECT',
      aspectLabel: 'Trạng thái Hoàn thành',
      formula: 'S + have/has + V3',
      formulaPassive: 'S + have/has + been + V3',
      usage: 'Diễn tả hành động đã xảy ra trong quá khứ không rõ thời điểm cụ thể, trải nghiệm cuộc đời, hoặc kết quả còn liên hệ tới hiện tại.',
      signals: 'already, just, yet, ever, never, recently, so far, since [mốc], for [khoảng]',
      markerPosition: 45,
      markerType: 'flag'
    },
    {
      id: 'present_perfect_continuous',
      name: 'Hiện tại HT tiếp diễn',
      en: 'Present Perfect Continuous',
      timeframe: 'present',
      aspect: 'perfect_continuous',
      themeClass: 'theme-past',
      timeframeColor: 'amber',
      tag: '04 • PERFECT CONT.',
      aspectLabel: 'Hoàn thành Tiếp diễn',
      formula: 'S + have/has been + V-ing',
      formulaPassive: 'S + have/has been being + V3',
      usage: 'Nhấn mạnh tính liên tục kéo dài của hành động bắt đầu từ quá khứ và vẫn đang tiếp diễn tới tận bây giờ.',
      signals: 'all day, all morning, for the past 3 hours, since 8 AM, how long',
      markerPosition: 48,
      markerType: 'span'
    },

    // PAST TIMEFRAME
    {
      id: 'past_simple',
      name: 'Quá khứ đơn',
      en: 'Past Simple',
      timeframe: 'past',
      aspect: 'simple',
      themeClass: 'theme-present',
      timeframeColor: 'emerald',
      tag: '01 • SIMPLE',
      aspectLabel: 'Trạng thái Đơn',
      formula: 'S + V2/ed',
      formulaPassive: 'S + was/were + V3',
      usage: 'Diễn tả một hành động đã xảy ra và chấm dứt hoàn toàn tại một thời điểm xác định trong quá khứ.',
      signals: 'yesterday, last night/week/year, ago, in 1995, when I was young',
      markerPosition: 20,
      markerType: 'point'
    },
    {
      id: 'past_continuous',
      name: 'Quá khứ tiếp diễn',
      en: 'Past Continuous',
      timeframe: 'past',
      aspect: 'continuous',
      themeClass: 'theme-future',
      timeframeColor: 'cyan',
      tag: '02 • CONTINUOUS',
      aspectLabel: 'Trạng thái Tiếp diễn',
      formula: 'S + was/were + V-ing',
      formulaPassive: 'S + was/were + being + V3',
      usage: 'Diễn tả hành động đang diễn ra tại một thời điểm chính xác trong quá khứ, hoặc một hành động đang diễn ra thì hành động khác xen vào.',
      signals: 'at 8 PM yesterday, at that moment, while, when, as',
      markerPosition: 20,
      markerType: 'wave'
    },
    {
      id: 'past_perfect',
      name: 'Quá khứ hoàn thành',
      en: 'Past Perfect',
      timeframe: 'past',
      aspect: 'perfect',
      themeClass: 'theme-violet',
      timeframeColor: 'violet',
      tag: '03 • PERFECT',
      aspectLabel: 'Trạng thái Hoàn thành',
      formula: 'S + had + V3',
      formulaPassive: 'S + had been + V3',
      usage: 'Diễn tả một hành động đã hoàn tất trước một hành động khác hoặc trước một mốc thời gian cụ thể trong quá khứ.',
      signals: 'before, after, by the time, as soon as, prior to, already',
      markerPosition: 12,
      markerType: 'flag'
    },
    {
      id: 'past_perfect_continuous',
      name: 'Quá khứ HT tiếp diễn',
      en: 'Past Perfect Continuous',
      timeframe: 'past',
      aspect: 'perfect_continuous',
      themeClass: 'theme-past',
      timeframeColor: 'amber',
      tag: '04 • PERFECT CONT.',
      aspectLabel: 'Hoàn thành Tiếp diễn',
      formula: 'S + had been + V-ing',
      formulaPassive: 'S + had been being + V3',
      usage: 'Nhấn mạnh khoảng thời gian kéo dài liên tục của một hành động xảy ra trước khi một hành động quá khứ khác diễn ra.',
      signals: 'for 2 hours before, until then, had been doing... when',
      markerPosition: 16,
      markerType: 'span'
    },

    // FUTURE TIMEFRAME
    {
      id: 'future_simple',
      name: 'Tương lai đơn',
      en: 'Future Simple',
      timeframe: 'future',
      aspect: 'simple',
      themeClass: 'theme-present',
      timeframeColor: 'emerald',
      tag: '01 • SIMPLE',
      aspectLabel: 'Trạng thái Đơn',
      formula: 'S + will + V1',
      formulaPassive: 'S + will be + V3',
      usage: 'Diễn tả một quyết định được đưa ra tức thời ngay tại lúc nói, một lời hứa, lời cảnh báo hoặc dự đoán không có căn cứ rõ rệt.',
      signals: 'tomorrow, next week/month, in 2030, soon, I think, I promise, probably',
      markerPosition: 80,
      markerType: 'point'
    },
    {
      id: 'future_continuous',
      name: 'Tương lai tiếp diễn',
      en: 'Future Continuous',
      timeframe: 'future',
      aspect: 'continuous',
      themeClass: 'theme-future',
      timeframeColor: 'cyan',
      tag: '02 • CONTINUOUS',
      aspectLabel: 'Trạng thái Tiếp diễn',
      formula: 'S + will be + V-ing',
      formulaPassive: 'S + will be being + V3',
      usage: 'Diễn tả một hành động sẽ đang diễn ra tại một thời điểm hoặc khoảng thời gian xác định trong tương lai.',
      signals: 'at this time tomorrow, at 10 AM next Monday, during next week',
      markerPosition: 80,
      markerType: 'wave'
    },
    {
      id: 'future_perfect',
      name: 'Tương lai hoàn thành',
      en: 'Future Perfect',
      timeframe: 'future',
      aspect: 'perfect',
      themeClass: 'theme-violet',
      timeframeColor: 'violet',
      tag: '03 • PERFECT',
      aspectLabel: 'Trạng thái Hoàn thành',
      formula: 'S + will have + V3',
      formulaPassive: 'S + will have been + V3',
      usage: 'Diễn tả một hành động sẽ được hoàn tất trước một mốc thời gian hoặc trước một hành động khác trong tương lai.',
      signals: 'by tomorrow, by next year, by the time you arrive, before next Monday',
      markerPosition: 88,
      markerType: 'flag'
    },
    {
      id: 'future_perfect_continuous',
      name: 'Tương lai HT tiếp diễn',
      en: 'Future Perfect Continuous',
      timeframe: 'future',
      aspect: 'perfect_continuous',
      themeClass: 'theme-past',
      timeframeColor: 'amber',
      tag: '04 • PERFECT CONT.',
      aspectLabel: 'Hoàn thành Tiếp diễn',
      formula: 'S + will have been + V-ing',
      formulaPassive: 'S + will have been being + V3',
      usage: 'Nhấn mạnh tính liên tục kéo dài của một hành động tính tới một mốc thời điểm xác định trong tương lai.',
      signals: 'by next year... for 5 years, by the end of this month',
      markerPosition: 85,
      markerType: 'span'
    }
  ];

  // =========================================================================
  // 3. CONJUGATION ENGINE
  // =========================================================================
  function conjugateTense(verb, tenseId, subject, polarity, activeObject) {
    const s = subject || 'I';
    const pol = polarity || 'affirmative';
    const obj = activeObject !== undefined ? activeObject : verb.activeObject;
    const objPart = obj ? ` ${obj}` : '';

    const isPlural = ['I', 'You', 'We', 'They'].includes(s);
    const is3rdSingular = ['He', 'She', 'It'].includes(s);

    let verbChunk = '';
    let fullSentence = '';

    switch (tenseId) {
      case 'present_simple':
        if (pol === 'affirmative') {
          verbChunk = is3rdSingular ? verb.vs : verb.v1;
          fullSentence = `${s} ${verbChunk}${objPart}.`;
        } else if (pol === 'negative') {
          const aux = is3rdSingular ? "doesn't" : "don't";
          verbChunk = `${aux} ${verb.v1}`;
          fullSentence = `${s} ${verbChunk}${objPart}.`;
        } else {
          const aux = is3rdSingular ? 'Does' : 'Do';
          verbChunk = `${aux} ... ${verb.v1}`;
          fullSentence = `${aux} ${s.toLowerCase()} ${verb.v1}${objPart}?`;
        }
        break;

      case 'present_continuous':
        const bePres = s === 'I' ? 'am' : (is3rdSingular ? 'is' : 'are');
        if (pol === 'affirmative') {
          verbChunk = `${bePres} ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} right now.`;
        } else if (pol === 'negative') {
          const negBe = s === 'I' ? 'am not' : (is3rdSingular ? "isn't" : "aren't");
          verbChunk = `${negBe} ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} at the moment.`;
        } else {
          verbChunk = `${bePres} ... ${verb.ving}`;
          fullSentence = `${bePres.charAt(0).toUpperCase() + bePres.slice(1)} ${s.toLowerCase()} ${verb.ving}${objPart} right now?`;
        }
        break;

      case 'present_perfect':
        const havePres = is3rdSingular ? 'has' : 'have';
        if (pol === 'affirmative') {
          verbChunk = `${havePres} already ${verb.v3}`;
          fullSentence = `${s} ${havePres} already ${verb.v3}${objPart}.`;
        } else if (pol === 'negative') {
          const negHave = is3rdSingular ? "hasn't" : "haven't";
          verbChunk = `${negHave} ${verb.v3}`;
          fullSentence = `${s} ${negHave} ${verb.v3}${objPart} yet.`;
        } else {
          verbChunk = `${havePres} ... ${verb.v3}`;
          fullSentence = `${havePres.charAt(0).toUpperCase() + havePres.slice(1)} ${s.toLowerCase()} ${verb.v3}${objPart} yet?`;
        }
        break;

      case 'present_perfect_continuous':
        const havePresC = is3rdSingular ? 'has' : 'have';
        if (pol === 'affirmative') {
          verbChunk = `${havePresC} been ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} for two hours.`;
        } else if (pol === 'negative') {
          const negHaveC = is3rdSingular ? "hasn't" : "haven't";
          verbChunk = `${negHaveC} been ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} lately.`;
        } else {
          verbChunk = `${havePresC} ... been ${verb.ving}`;
          fullSentence = `${havePresC.charAt(0).toUpperCase() + havePresC.slice(1)} ${s.toLowerCase()} been ${verb.ving}${objPart} all morning?`;
        }
        break;

      case 'past_simple':
        if (pol === 'affirmative') {
          verbChunk = verb.v2;
          fullSentence = `${s} ${verbChunk}${objPart} yesterday.`;
        } else if (pol === 'negative') {
          verbChunk = `didn't ${verb.v1}`;
          fullSentence = `${s} ${verbChunk}${objPart} yesterday.`;
        } else {
          verbChunk = `Did ... ${verb.v1}`;
          fullSentence = `Did ${s.toLowerCase()} ${verb.v1}${objPart} yesterday?`;
        }
        break;

      case 'past_continuous':
        const wasPast = (s === 'I' || is3rdSingular) ? 'was' : 'were';
        if (pol === 'affirmative') {
          verbChunk = `${wasPast} ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} at 8 PM yesterday.`;
        } else if (pol === 'negative') {
          const negWas = (s === 'I' || is3rdSingular) ? "wasn't" : "weren't";
          verbChunk = `${negWas} ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} when the phone rang.`;
        } else {
          verbChunk = `${wasPast} ... ${verb.ving}`;
          fullSentence = `${wasPast.charAt(0).toUpperCase() + wasPast.slice(1)} ${s.toLowerCase()} ${verb.ving}${objPart} at that time?`;
        }
        break;

      case 'past_perfect':
        if (pol === 'affirmative') {
          verbChunk = `had already ${verb.v3}`;
          fullSentence = `${s} had already ${verb.v3}${objPart} before midnight.`;
        } else if (pol === 'negative') {
          verbChunk = `hadn't ${verb.v3}`;
          fullSentence = `${s} hadn't ${verb.v3}${objPart} prior to that event.`;
        } else {
          verbChunk = `Had ... ${verb.v3}`;
          fullSentence = `Had ${s.toLowerCase()} ${verb.v3}${objPart} before they arrived?`;
        }
        break;

      case 'past_perfect_continuous':
        if (pol === 'affirmative') {
          verbChunk = `had been ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} for hours before stopping.`;
        } else if (pol === 'negative') {
          verbChunk = `hadn't been ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} long before the storm hit.`;
        } else {
          verbChunk = `Had ... been ${verb.ving}`;
          fullSentence = `Had ${s.toLowerCase()} been ${verb.ving}${objPart} prior to that moment?`;
        }
        break;

      case 'future_simple':
        if (pol === 'affirmative') {
          verbChunk = `will ${verb.v1}`;
          fullSentence = `${s} ${verbChunk}${objPart} tomorrow.`;
        } else if (pol === 'negative') {
          verbChunk = `won't ${verb.v1}`;
          fullSentence = `${s} ${verbChunk}${objPart} next week.`;
        } else {
          verbChunk = `Will ... ${verb.v1}`;
          fullSentence = `Will ${s.toLowerCase()} ${verb.v1}${objPart} tomorrow?`;
        }
        break;

      case 'future_continuous':
        if (pol === 'affirmative') {
          verbChunk = `will be ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} at this time tomorrow.`;
        } else if (pol === 'negative') {
          verbChunk = `won't be ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} during the meeting.`;
        } else {
          verbChunk = `Will ... be ${verb.ving}`;
          fullSentence = `Will ${s.toLowerCase()} be ${verb.ving}${objPart} at 10 AM tomorrow?`;
        }
        break;

      case 'future_perfect':
        if (pol === 'affirmative') {
          verbChunk = `will have ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${objPart} by next month.`;
        } else if (pol === 'negative') {
          verbChunk = `won't have ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${objPart} before Friday.`;
        } else {
          verbChunk = `Will ... have ${verb.v3}`;
          fullSentence = `Will ${s.toLowerCase()} have ${verb.v3}${objPart} by the deadline?`;
        }
        break;

      case 'future_perfect_continuous':
        if (pol === 'affirmative') {
          verbChunk = `will have been ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} for three years by 2028.`;
        } else if (pol === 'negative') {
          verbChunk = `won't have been ${verb.ving}`;
          fullSentence = `${s} ${verbChunk}${objPart} long enough by then.`;
        } else {
          verbChunk = `Will ... have been ${verb.ving}`;
          fullSentence = `Will ${s.toLowerCase()} have been ${verb.ving}${objPart} for five years?`;
        }
        break;
    }

    return { verbChunk, fullSentence };
  }

  function conjugatePassiveTense(verb, tenseId, passiveSubject, polarity, activeSubject) {
    if (!verb.isTransitive) {
      return {
        verbChunk: '(Nội động từ)',
        fullSentence: `Động từ "${verb.v1}" là nội động từ (Intransitive), không có tân ngữ trực tiếp nên không chuyển thành thể bị động.`,
        isIntransitive: true
      };
    }

    const s = passiveSubject || verb.passiveSubject || 'The work';
    const pol = polarity || 'affirmative';
    const byAgent = (activeSubject && activeSubject.toLowerCase() !== 'it') ? ` by ${activeSubject.toLowerCase()}` : '';

    const isPlural = s.endsWith('s') && !s.endsWith('ss');
    const bePresent = isPlural ? 'are' : 'is';
    const bePast = isPlural ? 'were' : 'was';

    let verbChunk = '';
    let fullSentence = '';

    switch (tenseId) {
      case 'present_simple':
        if (pol === 'affirmative') {
          verbChunk = `${bePresent} ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} every day.`;
        } else if (pol === 'negative') {
          const neg = isPlural ? "aren't" : "isn't";
          verbChunk = `${neg} ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} regularly.`;
        } else {
          verbChunk = `${bePresent} ... ${verb.v3}`;
          fullSentence = `${bePresent.charAt(0).toUpperCase() + bePresent.slice(1)} ${s.toLowerCase()} ${verb.v3}${byAgent} every day?`;
        }
        break;

      case 'present_continuous':
        if (pol === 'affirmative') {
          verbChunk = `${bePresent} being ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} right now.`;
        } else if (pol === 'negative') {
          const neg = isPlural ? "aren't" : "isn't";
          verbChunk = `${neg} being ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} at present.`;
        } else {
          verbChunk = `${bePresent} ... being ${verb.v3}`;
          fullSentence = `${bePresent.charAt(0).toUpperCase() + bePresent.slice(1)} ${s.toLowerCase()} being ${verb.v3}${byAgent}?`;
        }
        break;

      case 'present_perfect':
        const havePres = isPlural ? 'have' : 'has';
        if (pol === 'affirmative') {
          verbChunk = `${havePres} been ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} recently.`;
        } else if (pol === 'negative') {
          const negHave = isPlural ? "haven't" : "hasn't";
          verbChunk = `${negHave} been ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} yet.`;
        } else {
          verbChunk = `${havePres} ... been ${verb.v3}`;
          fullSentence = `${havePres.charAt(0).toUpperCase() + havePres.slice(1)} ${s.toLowerCase()} been ${verb.v3}${byAgent}?`;
        }
        break;

      case 'present_perfect_continuous':
        const havePresC = isPlural ? 'have' : 'has';
        verbChunk = `${havePresC} been being ${verb.v3}`;
        fullSentence = `${s} ${verbChunk}${byAgent} for two hours. (Hiếm dùng dạng bị động)`;
        break;

      case 'past_simple':
        if (pol === 'affirmative') {
          verbChunk = `${bePast} ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} yesterday.`;
        } else if (pol === 'negative') {
          const negWas = isPlural ? "weren't" : "wasn't";
          verbChunk = `${negWas} ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} yesterday.`;
        } else {
          verbChunk = `${bePast} ... ${verb.v3}`;
          fullSentence = `${bePast.charAt(0).toUpperCase() + bePast.slice(1)} ${s.toLowerCase()} ${verb.v3}${byAgent} yesterday?`;
        }
        break;

      case 'past_continuous':
        if (pol === 'affirmative') {
          verbChunk = `${bePast} being ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} at 8 PM yesterday.`;
        } else if (pol === 'negative') {
          const negWas = isPlural ? "weren't" : "wasn't";
          verbChunk = `${negWas} being ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} at that time.`;
        } else {
          verbChunk = `${bePast} ... being ${verb.v3}`;
          fullSentence = `${bePast.charAt(0).toUpperCase() + bePast.slice(1)} ${s.toLowerCase()} being ${verb.v3}${byAgent}?`;
        }
        break;

      case 'past_perfect':
        if (pol === 'affirmative') {
          verbChunk = `had been ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} before midnight.`;
        } else if (pol === 'negative') {
          verbChunk = `hadn't been ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} prior to that.`;
        } else {
          verbChunk = `Had ... been ${verb.v3}`;
          fullSentence = `Had ${s.toLowerCase()} been ${verb.v3}${byAgent} before they left?`;
        }
        break;

      case 'past_perfect_continuous':
        verbChunk = `had been being ${verb.v3}`;
        fullSentence = `${s} ${verbChunk}${byAgent} for hours. (Hiếm dùng dạng bị động)`;
        break;

      case 'future_simple':
        if (pol === 'affirmative') {
          verbChunk = `will be ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} tomorrow.`;
        } else if (pol === 'negative') {
          verbChunk = `won't be ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} next week.`;
        } else {
          verbChunk = `Will ... be ${verb.v3}`;
          fullSentence = `Will ${s.toLowerCase()} be ${verb.v3}${byAgent} tomorrow?`;
        }
        break;

      case 'future_continuous':
        verbChunk = `will be being ${verb.v3}`;
        fullSentence = `${s} ${verbChunk}${byAgent} at this time tomorrow. (Hiếm dùng dạng bị động)`;
        break;

      case 'future_perfect':
        if (pol === 'affirmative') {
          verbChunk = `will have been ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} by next Monday.`;
        } else if (pol === 'negative') {
          verbChunk = `won't have been ${verb.v3}`;
          fullSentence = `${s} ${verbChunk}${byAgent} before Friday.`;
        } else {
          verbChunk = `Will ... have been ${verb.v3}`;
          fullSentence = `Will ${s.toLowerCase()} have been ${verb.v3}${byAgent} by then?`;
        }
        break;

      case 'future_perfect_continuous':
        verbChunk = `will have been being ${verb.v3}`;
        fullSentence = `${s} ${verbChunk}${byAgent} for a long time. (Hiếm dùng dạng bị động)`;
        break;
    }

    return { verbChunk, fullSentence, isIntransitive: false };
  }

  // =========================================================================
  // 4. TIMELINE SVG GENERATOR
  // =========================================================================
  function generateTimelineSVG(tenseId, timeframe) {
    const isPast = timeframe === 'past';
    const isPresent = timeframe === 'present';
    const isFuture = timeframe === 'future';

    const accentColor = isPresent ? '#10B981' : (isFuture ? '#06B6D4' : '#F59E0B');
    const xPast = 40;
    const xNow = 150;
    const xFuture = 260;

    let markerElement = '';
    switch (tenseId) {
      case 'present_simple':
        markerElement = `
          <circle cx="${xNow}" cy="30" r="6" fill="${accentColor}" />
          <line x1="${xNow}" y1="18" x2="${xNow}" y2="42" stroke="${accentColor}" stroke-width="2" />
        `;
        break;
      case 'present_continuous':
        markerElement = `
          <path d="M 130 30 Q 140 22 150 30 T 170 30" fill="none" stroke="${accentColor}" stroke-width="3" stroke-linecap="round" />
          <circle cx="${xNow}" cy="30" r="4" fill="${accentColor}" />
        `;
        break;
      case 'present_perfect':
        markerElement = `
          <path d="M 80 30 C 110 15, 140 15, ${xNow} 30" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="4,3" />
          <polygon points="146,26 154,30 146,34" fill="${accentColor}" />
          <circle cx="80" cy="30" r="4" fill="#94A3B8" />
        `;
        break;
      case 'present_perfect_continuous':
        markerElement = `
          <rect x="80" y="26" width="70" height="8" rx="4" fill="${accentColor}" opacity="0.4" />
          <line x1="80" y1="30" x2="${xNow}" y2="30" stroke="${accentColor}" stroke-width="3" />
          <circle cx="${xNow}" cy="30" r="5" fill="${accentColor}" />
        `;
        break;
      case 'past_simple':
        markerElement = `
          <circle cx="${xPast}" cy="30" r="6" fill="${accentColor}" />
          <line x1="${xPast}" y1="18" x2="${xPast}" y2="42" stroke="${accentColor}" stroke-width="2" />
        `;
        break;
      case 'past_continuous':
        markerElement = `
          <path d="M 20 30 Q 30 22 40 30 T 60 30" fill="none" stroke="${accentColor}" stroke-width="3" stroke-linecap="round" />
          <circle cx="${xPast}" cy="30" r="4" fill="${accentColor}" />
        `;
        break;
      case 'past_perfect':
        markerElement = `
          <line x1="20" y1="30" x2="${xPast}" y2="30" stroke="${accentColor}" stroke-width="2" stroke-dasharray="3,3" />
          <polygon points="36,26 44,30 36,34" fill="${accentColor}" />
          <circle cx="20" cy="30" r="4" fill="#94A3B8" />
        `;
        break;
      case 'past_perfect_continuous':
        markerElement = `
          <rect x="15" y="26" width="35" height="8" rx="4" fill="${accentColor}" opacity="0.4" />
          <line x1="15" y1="30" x2="50" y2="30" stroke="${accentColor}" stroke-width="3" />
        `;
        break;
      case 'future_simple':
        markerElement = `
          <circle cx="${xFuture}" cy="30" r="6" fill="${accentColor}" />
          <line x1="${xFuture}" y1="18" x2="${xFuture}" y2="42" stroke="${accentColor}" stroke-width="2" />
        `;
        break;
      case 'future_continuous':
        markerElement = `
          <path d="M 240 30 Q 250 22 260 30 T 280 30" fill="none" stroke="${accentColor}" stroke-width="3" stroke-linecap="round" />
          <circle cx="${xFuture}" cy="30" r="4" fill="${accentColor}" />
        `;
        break;
      case 'future_perfect':
        markerElement = `
          <line x1="${xNow}" y1="30" x2="${xFuture}" y2="30" stroke="${accentColor}" stroke-width="2" stroke-dasharray="3,3" />
          <polygon points="256,26 264,30 256,34" fill="${accentColor}" />
        `;
        break;
      case 'future_perfect_continuous':
        markerElement = `
          <rect x="220" y="26" width="45" height="8" rx="4" fill="${accentColor}" opacity="0.4" />
          <line x1="220" y1="30" x2="265" y2="30" stroke="${accentColor}" stroke-width="3" />
        `;
        break;
      default:
        markerElement = `<circle cx="${xNow}" cy="30" r="5" fill="${accentColor}" />`;
    }

    return `
      <svg viewBox="0 0 300 60" class="w-full max-w-[280px] h-12" xmlns="http://www.w3.org/2000/svg">
        <!-- Base Timeline Axis -->
        <line x1="20" y1="30" x2="280" y2="30" stroke="#475569" stroke-width="1.5" stroke-dasharray="2,2" />
        
        <!-- Mốc Quá khứ -->
        <circle cx="${xPast}" cy="30" r="3" fill="#64748B" />
        <text x="${xPast}" y="48" font-size="9" fill="#94A3B8" font-family="monospace" text-anchor="middle">QUÁ KHỨ</text>

        <!-- Mốc Hiện tại (NOW) -->
        <line x1="${xNow}" y1="15" x2="${xNow}" y2="45" stroke="#CBD5E1" stroke-width="1.5" />
        <text x="${xNow}" y="56" font-size="10" font-weight="bold" fill="#F8FAFC" font-family="monospace" text-anchor="middle">NOW</text>

        <!-- Mốc Tương lai -->
        <circle cx="${xFuture}" cy="30" r="3" fill="#64748B" />
        <text x="${xFuture}" y="48" font-size="9" fill="#94A3B8" font-family="monospace" text-anchor="middle">TƯƠNG LAI</text>

        <!-- Dynamic Action Indicator -->
        ${markerElement}
      </svg>
    `;
  }

  // =========================================================================
  // 5. AUDIO & TEXT-TO-SPEECH (TTS) ENGINE
  // =========================================================================
  let speechVoices = [];
  function loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechVoices = window.speechSynthesis.getVoices();
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  function speakText(text, lang = 'en-US', triggerBtn = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const clean = (text || '').trim();
    if (!clean) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Pick best voice
    if (speechVoices.length > 0) {
      const match = speechVoices.find(v => v.lang.replace('_', '-') === lang && !v.name.includes('eSpeak')) ||
                    speechVoices.find(v => v.lang.startsWith(lang.split('-')[0]));
      if (match) utterance.voice = match;
    }

    if (triggerBtn) {
      triggerBtn.classList.add('audio-playing-pulse');
      utterance.onend = () => triggerBtn.classList.remove('audio-playing-pulse');
      utterance.onerror = () => triggerBtn.classList.remove('audio-playing-pulse');
    }

    window.speechSynthesis.speak(utterance);
  }

  function showToast(msg, duration = 2500) {
    const existing = document.getElementById('lexi-global-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'lexi-global-toast';
    toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 text-white border border-violet-500/40 shadow-2xl text-xs font-mono flex items-center gap-2 transform transition-all duration-300 translate-y-3 opacity-0';
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> <span>${msg}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function copyToClipboard(text, notify = true) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (notify) showToast(`Đã sao chép: "${text.slice(0, 32)}..."`);
      }).catch(() => fallbackCopy(text, notify));
    } else {
      fallbackCopy(text, notify);
    }
  }

  function fallbackCopy(text, notify = true) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (notify) showToast(`Đã sao chép thành công`);
    } catch (e) {}
    document.body.removeChild(ta);
  }

  // =========================================================================
  // 6. GLOBAL APPLICATION STATE
  // =========================================================================
  const State = {
    activeModule: 'matrix', // 'matrix' | 'sgk' | 'arena'
    verb: findOrBuildVerb('write') || {
      v1: 'write', vs: 'writes', v2: 'wrote', v3: 'written', ving: 'writing',
      ipaUS: '/raɪt/', meaning: 'viết, sáng tác', isIrregular: true, isTransitive: true,
      activeObject: 'the letter', passiveSubject: 'The letter', grade: 3
    },
    subject: 'I',
    polarity: 'affirmative',
    isPassive: false,
    customObject: '',
    layoutMode: 'grid', // 'grid' | 'timeline' | 'aspect'
    timeframeFilter: 'all', // 'all' | 'present' | 'past' | 'future'
    activeVoiceLang: 'en-US',

    // SGK Sub-State
    sgkGrade: 'Lớp 1',
    sgkUnitIndex: 0,

    // Arena Sub-State
    arenaMode: 'quiz', // 'quiz' | 'flashcard'
    quiz: {
      score: 0,
      streak: 0,
      total: 0,
      correct: 0,
      currentQuestion: null
    },
    flashcard: {
      currentIndex: 0,
      isFlipped: false
    }
  };

  // =========================================================================
  // 7. MODULE SWITCHER CONTROLLER
  // =========================================================================
  function switchModule(targetModule) {
    State.activeModule = targetModule;

    const navTabs = {
      matrix: document.getElementById('nav-tab-matrix'),
      sgk: document.getElementById('nav-tab-sgk'),
      arena: document.getElementById('nav-tab-arena')
    };

    const views = {
      matrix: document.getElementById('module-view-matrix'),
      sgk: document.getElementById('module-view-sgk'),
      arena: document.getElementById('module-view-arena')
    };

    Object.keys(navTabs).forEach(k => {
      const tab = navTabs[k];
      const view = views[k];
      if (tab) {
        if (k === targetModule) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      }
      if (view) {
        if (k === targetModule) {
          view.classList.remove('hidden');
        } else {
          view.classList.add('hidden');
        }
      }
    });

    if (targetModule === 'sgk') {
      renderSgkModule();
    } else if (targetModule === 'arena') {
      renderArenaModule();
    }

    try {
      window.location.hash = targetModule;
    } catch (e) {}
  }

  // =========================================================================
  // 8. MODULE 1: MATRIX UI CONTROLLER
  // =========================================================================
  function renderHeroVerb(verb) {
    if (!verb) return;

    const titleEl = document.getElementById('hero-verb-title');
    const ipaEl = document.getElementById('verb-ipa');
    const meaningEl = document.getElementById('hero-verb-meaning');
    const contextEl = document.getElementById('hero-verb-context');
    const typePill = document.getElementById('verb-type-pill');
    const transPill = document.getElementById('verb-transitivity-pill');
    const gradePill = document.getElementById('verb-grade-pill');

    const cellV1 = document.getElementById('cell-v1');
    const cellVs = document.getElementById('cell-vs');
    const cellV2 = document.getElementById('cell-v2');
    const cellV3 = document.getElementById('cell-v3');
    const cellVing = document.getElementById('cell-ving');

    if (titleEl) titleEl.textContent = verb.v1;
    if (ipaEl) ipaEl.textContent = verb.ipaUS || `/${verb.v1}/`;
    if (meaningEl) meaningEl.textContent = verb.meaning || 'Đang cập nhật nghĩa';
    if (contextEl) {
      contextEl.textContent = verb.isTransitive 
        ? `Tân ngữ mẫu: "${verb.activeObject || 'an object'}"`
        : 'Nội động từ: Không nhận tân ngữ trực tiếp';
    }

    if (typePill) {
      typePill.textContent = verb.isIrregular ? 'Bất quy tắc' : 'Có quy tắc';
      typePill.className = verb.isIrregular
        ? 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-500 dark:text-amber-300 border border-amber-400/35'
        : 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500 dark:text-emerald-300 border border-emerald-400/35';
    }

    if (transPill) {
      transPill.textContent = verb.isTransitive ? 'Ngoại động từ (Transitive)' : 'Nội động từ (Intransitive)';
    }

    if (gradePill) {
      gradePill.textContent = `Lớp ${verb.grade || 6}`;
    }

    // Morphology cards (Zero truncation)
    if (cellV1) cellV1.textContent = verb.v1;
    if (cellVs) cellVs.textContent = verb.vs;
    if (cellV2) cellV2.textContent = verb.v2;
    if (cellV3) cellV3.textContent = verb.v3;
    if (cellVing) cellVing.textContent = verb.ving;

    // Passive Switch availability
    const passiveToggleBtn = document.getElementById('btn-passive-toggle');
    const passiveStatusBadge = document.getElementById('passive-status-badge');
    if (!verb.isTransitive) {
      State.isPassive = false;
      updatePassiveToggleUI();
      if (passiveToggleBtn) passiveToggleBtn.disabled = true;
      if (passiveStatusBadge) passiveStatusBadge.textContent = 'Khóa (Nội động từ)';
    } else {
      if (passiveToggleBtn) passiveToggleBtn.disabled = false;
      updatePassiveToggleUI();
    }
  }

  function updatePassiveToggleUI() {
    const track = document.getElementById('passive-switch-track');
    const thumb = document.getElementById('passive-switch-thumb');
    const badge = document.getElementById('passive-status-badge');
    const legendPassiveBe = document.getElementById('legend-passive-be');

    if (State.isPassive) {
      if (track) track.className = 'w-9 h-5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-colors relative';
      if (thumb) thumb.className = 'w-4 h-4 bg-white rounded-full transition-transform translate-x-4 shadow-sm';
      if (badge) badge.textContent = 'BẬT (Bị động)';
      if (legendPassiveBe) legendPassiveBe.classList.remove('hidden');
    } else {
      if (track) track.className = 'w-9 h-5 bg-slate-300 dark:bg-slate-700 rounded-full transition-colors relative';
      if (thumb) thumb.className = 'w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 shadow-sm';
      if (badge) badge.textContent = 'TẮT (Chủ động)';
      if (legendPassiveBe) legendPassiveBe.classList.add('hidden');
    }
  }

  function createTenseCardElement(tense, verb) {
    const card = document.createElement('div');
    card.className = `tense-card ${tense.themeClass} rounded-2xl p-4 flex flex-col justify-between space-y-3 cursor-pointer group`;
    card.dataset.tenseId = tense.id;

    // Conjugation
    const effectiveObject = State.customObject || verb.activeObject;
    const activeResult = conjugateTense(verb, tense.id, State.subject, State.polarity, effectiveObject);
    const passiveResult = conjugatePassiveTense(verb, tense.id, verb.passiveSubject, State.polarity, State.subject);

    const isCurrentPassive = State.isPassive && verb.isTransitive;
    const resultSentence = isCurrentPassive ? passiveResult.fullSentence : activeResult.fullSentence;
    const resultChunk = isCurrentPassive ? passiveResult.verbChunk : activeResult.verbChunk;
    const currentFormula = isCurrentPassive ? tense.formulaPassive : tense.formula;

    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2 border-b border-slate-200/50 dark:border-violet-500/20 pb-2">
          <div class="space-y-0.5">
            <span class="font-mono text-[10px] font-bold text-${tense.timeframeColor}-600 dark:text-${tense.timeframeColor}-400">${tense.tag}</span>
            <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">${tense.name}</h4>
          </div>
          <span class="tense-formula-badge font-mono text-[11px] px-2 py-0.5 rounded-md font-semibold">${currentFormula}</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-950/70 border border-slate-200 dark:border-violet-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed hover:border-cyan-500/40 transition-colors">
          <span>"${resultSentence}"</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-violet-500/20 text-xs">
        <div class="flex items-center gap-1.5">
          <button type="button" class="btn-card-speak p-1.5 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 transition-colors" title="Nghe phát âm">
            <i class="fa-solid fa-volume-high text-xs"></i>
          </button>
          <button type="button" class="btn-card-copy p-1.5 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 transition-colors" title="Sao chép câu">
            <i class="fa-regular fa-copy text-xs"></i>
          </button>
        </div>

        <button type="button" class="btn-card-detail px-2.5 py-1 rounded-lg text-[11px] font-bold text-violet-600 dark:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 transition-all flex items-center gap-1">
          <span>Chi tiết</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    `;

    // Audio click
    const speakBtn = card.querySelector('.btn-card-speak');
    if (speakBtn) {
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakText(resultSentence, State.activeVoiceLang, speakBtn);
      });
    }

    // Copy click
    const copyBtn = card.querySelector('.btn-card-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(resultSentence);
      });
    }

    // Detail modal click
    card.addEventListener('click', () => {
      openTenseDetailModal(tense, verb);
    });

    return card;
  }

  function renderMatrix() {
    const stage = document.getElementById('matrix-stage');
    if (!stage) return;
    stage.innerHTML = '';

    // Filter tenses
    let filteredTenses = TENSES;
    if (State.timeframeFilter !== 'all') {
      filteredTenses = TENSES.filter(t => t.timeframe === State.timeframeFilter);
    }

    if (State.layoutMode === 'grid') {
      // 3x4 Desktop Grid
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5';
      filteredTenses.forEach(tense => {
        grid.appendChild(createTenseCardElement(tense, State.verb));
      });
      stage.appendChild(grid);
    } else if (State.layoutMode === 'timeline') {
      // Group by Timeline (Past -> Present -> Future)
      const timeframes = ['past', 'present', 'future'];
      timeframes.forEach(tf => {
        const groupTenses = filteredTenses.filter(t => t.timeframe === tf);
        if (groupTenses.length === 0) return;

        const tfNames = { past: 'Quá khứ (Past)', present: 'Hiện tại (Present)', future: 'Tương lai (Future)' };
        const tfSec = document.createElement('div');
        tfSec.className = 'space-y-3';
        tfSec.innerHTML = `
          <div class="flex items-center gap-2 border-b border-slate-200 dark:border-violet-500/25 pb-1.5">
            <span class="w-3 h-3 rounded-full bg-${groupTenses[0].timeframeColor}-500"></span>
            <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white">${tfNames[tf]}</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"></div>
        `;
        const innerGrid = tfSec.querySelector('.grid');
        groupTenses.forEach(t => innerGrid.appendChild(createTenseCardElement(t, State.verb)));
        stage.appendChild(tfSec);
      });
    } else if (State.layoutMode === 'aspect') {
      // Group by 4 Aspects (Simple, Continuous, Perfect, Perfect Continuous)
      const aspects = ['simple', 'continuous', 'perfect', 'perfect_continuous'];
      aspects.forEach(asp => {
        const groupTenses = filteredTenses.filter(t => t.aspect === asp);
        if (groupTenses.length === 0) return;

        const aspSec = document.createElement('div');
        aspSec.className = 'space-y-3';
        aspSec.innerHTML = `
          <div class="flex items-center gap-2 border-b border-slate-200 dark:border-violet-500/25 pb-1.5">
            <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white">${groupTenses[0].aspectLabel}</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5"></div>
        `;
        const innerGrid = aspSec.querySelector('.grid');
        groupTenses.forEach(t => innerGrid.appendChild(createTenseCardElement(t, State.verb)));
        stage.appendChild(aspSec);
      });
    }
  }

  function openTenseDetailModal(tense, verb) {
    const modal = document.getElementById('detail-modal');
    if (!modal) return;

    const titleEl = document.getElementById('modal-title');
    const badgeEl = document.getElementById('modal-badge');
    const aspectBadgeEl = document.getElementById('modal-aspect-badge');
    const usageEl = document.getElementById('modal-usage');
    const timelineSvgEl = document.getElementById('modal-timeline-svg');
    const currentVerbTag = document.getElementById('modal-current-verb-tag');
    const sentencesContainer = document.getElementById('modal-sentences');
    const formulasContainer = document.getElementById('modal-sec1-formulas');

    if (titleEl) titleEl.textContent = `${tense.name} (${tense.en})`;
    if (badgeEl) {
      badgeEl.textContent = tense.timeframe.toUpperCase();
      badgeEl.className = `inline-block font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-${tense.timeframeColor}-500/20 text-${tense.timeframeColor}-600 dark:text-${tense.timeframeColor}-400`;
    }
    if (aspectBadgeEl) aspectBadgeEl.textContent = tense.aspectLabel;
    if (usageEl) usageEl.textContent = tense.usage;
    if (currentVerbTag) currentVerbTag.textContent = `Động từ: ${verb.v1}`;

    // Timeline SVG
    if (timelineSvgEl) {
      timelineSvgEl.innerHTML = generateTimelineSVG(tense.id, tense.timeframe);
    }

    // Sentences across 3 polarities (Affirmative, Negative, Interrogative)
    if (sentencesContainer) {
      sentencesContainer.innerHTML = '';
      const pols = [
        { key: 'affirmative', label: 'Khẳng định (+)' },
        { key: 'negative', label: 'Phủ định (-)' },
        { key: 'interrogative', label: 'Nghi vấn (?)' }
      ];

      pols.forEach(p => {
        const row = document.createElement('div');
        row.className = 'p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-violet-500/30 flex items-center justify-between gap-3 text-xs sm:text-sm';
        
        const conj = State.isPassive && verb.isTransitive
          ? conjugatePassiveTense(verb, tense.id, verb.passiveSubject, p.key, State.subject)
          : conjugateTense(verb, tense.id, State.subject, p.key, verb.activeObject);

        row.innerHTML = `
          <div>
            <span class="font-mono text-[10px] uppercase font-bold text-slate-400 block">${p.label}</span>
            <span class="font-semibold text-slate-900 dark:text-white">"${conj.fullSentence}"</span>
          </div>
          <button type="button" class="btn-modal-speak p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition-colors" title="Nghe phát âm">
            <i class="fa-solid fa-volume-high text-xs"></i>
          </button>
        `;

        const spk = row.querySelector('.btn-modal-speak');
        if (spk) {
          spk.addEventListener('click', () => speakText(conj.fullSentence, State.activeVoiceLang, spk));
        }

        sentencesContainer.appendChild(row);
      });
    }

    // Formulas
    if (formulasContainer) {
      formulasContainer.innerHTML = `
        <div class="space-y-1">
          <span class="text-slate-400">Chủ động:</span>
          <div class="p-2 rounded bg-slate-200/70 dark:bg-slate-950/70 text-cyan-600 dark:text-cyan-300 font-bold">${tense.formula}</div>
        </div>
        <div class="space-y-1">
          <span class="text-slate-400">Bị động:</span>
          <div class="p-2 rounded bg-slate-200/70 dark:bg-slate-950/70 text-violet-600 dark:text-violet-300 font-bold">${tense.formulaPassive}</div>
        </div>
        <div class="space-y-1 pt-1">
          <span class="text-slate-400">Dấu hiệu nhận biết:</span>
          <div class="text-slate-700 dark:text-slate-300 text-[11px] italic">${tense.signals}</div>
        </div>
      `;
    }

    modal.classList.remove('hidden');
  }

  function closeTenseDetailModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('hidden');
  }

  // =========================================================================
  // 9. MODULE 2: SGK LỚP 1–12 CONTROLLER
  // =========================================================================
  const SGK_GRADES = [
    'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
    'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
    'Lớp 10', 'Lớp 11', 'Lớp 12'
  ];

  function renderSgkModule() {
    const gradeSelector = document.getElementById('sgk-grade-selector');
    const summaryEl = document.getElementById('sgk-grade-summary');
    const verbsGrid = document.getElementById('sgk-verbs-grid');
    const headingEl = document.getElementById('sgk-verbs-heading');

    if (!gradeSelector) return;

    // Render Grade Selector Buttons
    gradeSelector.innerHTML = '';
    SGK_GRADES.forEach(g => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = g;
      const isSel = State.sgkGrade === g;
      btn.className = isSel
        ? 'py-2 px-3 rounded-xl font-mono text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg border border-cyan-400/50 cursor-pointer'
        : 'py-2 px-3 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-slate-200/80 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:border-violet-500/50 border border-transparent transition-all cursor-pointer';

      btn.addEventListener('click', () => {
        State.sgkGrade = g;
        State.sgkUnitIndex = 0;
        renderSgkModule();
      });
      gradeSelector.appendChild(btn);
    });

    // Curriculum Data Source
    const allUnits = (typeof window !== 'undefined' && Array.isArray(window.CURRICULUM_DATA))
      ? window.CURRICULUM_DATA
      : [];

    const gradeUnits = allUnits.filter(u => u.grade === State.sgkGrade);

    // Summary Card
    if (summaryEl) {
      let totalVocabInGrade = 0;
      const allTenses = new Set();
      const allGrammar = new Set();

      gradeUnits.forEach(u => {
        totalVocabInGrade += (u.vocabulary ? u.vocabulary.length : 0);
        (u.tenses_focus || []).forEach(t => allTenses.add(t));
        (u.grammar_topics || []).forEach(g => allGrammar.add(g));
      });

      summaryEl.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-violet-500/25 pb-3">
          <div>
            <span class="text-xs font-mono uppercase text-cyan-600 dark:text-cyan-400 font-bold">TỔNG QUAN CHƯƠNG TRÌNH</span>
            <h4 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">${State.sgkGrade} • ${gradeUnits.length} Units học</h4>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-400/30 text-xs font-mono font-bold">
              ${totalVocabInGrade} Từ vựng trọng tâm
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="space-y-1.5">
            <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <i class="fa-solid fa-clock text-cyan-500"></i> Các Thì trọng tâm:
            </span>
            <div class="flex flex-wrap gap-1.5">
              ${Array.from(allTenses).map(t => `<span class="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-mono text-[11px] border border-cyan-400/20">${t}</span>`).join('') || '<span class="text-slate-400">Hiện tại đơn cơ bản</span>'}
            </div>
          </div>
          <div class="space-y-1.5">
            <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <i class="fa-solid fa-book text-emerald-500"></i> Điểm ngữ pháp cốt lõi:
            </span>
            <div class="flex flex-wrap gap-1.5">
              ${Array.from(allGrammar).slice(0, 6).map(g => `<span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] border border-emerald-400/20">${g}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // Verbs / Vocab Grid
    if (verbsGrid) {
      verbsGrid.innerHTML = '';
      if (headingEl) headingEl.textContent = `Danh mục Động từ & Từ vựng cốt lõi — ${State.sgkGrade}`;

      const allVocabInGrade = [];
      gradeUnits.forEach(u => {
        (u.vocabulary || []).forEach(v => {
          allVocabInGrade.push({ ...v, unitNum: u.unit, unitTitle: u.title });
        });
      });

      if (allVocabInGrade.length === 0) {
        verbsGrid.innerHTML = `<div class="col-span-full py-8 text-center text-slate-400">Đang đồng bộ dữ liệu cho ${State.sgkGrade}...</div>`;
        return;
      }

      allVocabInGrade.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bento-card rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-violet-500/25 hover:border-cyan-500/50 transition-all';

        const cleanWord = (item.word || '').trim().toLowerCase();
        const matchedVerb = VERB_STORE.find(v => v.v1.toLowerCase() === cleanWord);

        card.innerHTML = `
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white">${item.word}</h4>
                  <span class="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-400/25">${item.pos || 'v'}</span>
                </div>
                <div class="font-mono text-xs text-slate-400 mt-0.5">${item.ipa || ''}</div>
              </div>

              <button type="button" class="btn-sgk-speak w-8 h-8 rounded-lg bg-slate-100 hover:bg-cyan-500/15 dark:bg-slate-800 dark:hover:bg-cyan-500/25 text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400 flex items-center justify-center transition-colors cursor-pointer" title="Nghe phát âm">
                <i class="fa-solid fa-volume-high text-xs"></i>
              </button>
            </div>

            <div class="space-y-1 pt-1 border-t border-slate-100 dark:border-violet-500/20">
              <div class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">${item.meaning || ''}</div>
              ${item.collocation ? `<div class="text-[11px] font-mono text-violet-600 dark:text-violet-400"><span class="text-slate-400">Cụm:</span> ${item.collocation}</div>` : ''}
            </div>

            ${item.example ? `
              <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-violet-500/20 text-xs text-slate-600 dark:text-slate-300 italic flex items-center justify-between gap-2 group cursor-pointer btn-sgk-example" title="Nhấp để nghe">
                <span>"${item.example}"</span>
                <i class="fa-solid fa-play text-[10px] text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0"></i>
              </div>
            ` : ''}
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-violet-500/20 flex items-center justify-between gap-2 text-xs">
            <span class="text-[10px] font-mono text-slate-400">Unit ${item.unitNum}</span>
            <button type="button" class="btn-sgk-jump-matrix px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 flex items-center gap-1 transition-all cursor-pointer">
              <i class="fa-solid fa-bolt text-[10px]"></i>
              <span>Chia 12 Thì</span>
            </button>
          </div>
        `;

        // Listeners
        const spkBtn = card.querySelector('.btn-sgk-speak');
        if (spkBtn) {
          spkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speakText(item.word, 'en-US', spkBtn);
          });
        }

        const exBtn = card.querySelector('.btn-sgk-example');
        if (exBtn && item.example) {
          exBtn.addEventListener('click', () => speakText(item.example, 'en-US', exBtn));
        }

        const jumpBtn = card.querySelector('.btn-sgk-jump-matrix');
        if (jumpBtn) {
          jumpBtn.addEventListener('click', () => {
            const verbToLoad = matchedVerb || findOrBuildVerb(cleanWord);
            State.verb = verbToLoad;
            renderHeroVerb(verbToLoad);
            renderMatrix();
            switchModule('matrix');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast(`Đã nạp động từ "${verbToLoad.v1}" vào Ma trận 12 Thì`);
          });
        }

        verbsGrid.appendChild(card);
      });
    }
  }

  // =========================================================================
  // 10. MODULE 3: ĐẤU TRƯỜNG QUIZ & FLASHCARD 3D
  // =========================================================================
  function renderArenaModule() {
    const btnQuiz = document.getElementById('btn-arena-mode-quiz');
    const btnFlashcard = document.getElementById('btn-arena-mode-flashcard');
    const stageQuiz = document.getElementById('arena-quiz-stage');
    const stageFlashcard = document.getElementById('arena-flashcard-stage');

    if (State.arenaMode === 'quiz') {
      if (btnQuiz) btnQuiz.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md transition-all cursor-pointer';
      if (btnFlashcard) btnFlashcard.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-white transition-all cursor-pointer';
      if (stageQuiz) stageQuiz.classList.remove('hidden');
      if (stageFlashcard) stageFlashcard.classList.add('hidden');
      generateNextQuizQuestion();
    } else {
      if (btnFlashcard) btnFlashcard.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md transition-all cursor-pointer';
      if (btnQuiz) btnQuiz.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-white transition-all cursor-pointer';
      if (stageQuiz) stageQuiz.classList.add('hidden');
      if (stageFlashcard) stageFlashcard.classList.remove('hidden');
      renderFlashcard();
    }
  }

  // Quiz Logic
  function generateNextQuizQuestion() {
    const qText = document.getElementById('quiz-question-text');
    const optGrid = document.getElementById('quiz-options-grid');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const catBadge = document.getElementById('quiz-category-badge');

    if (!qText || !optGrid) return;
    if (feedbackBox) feedbackBox.classList.add('hidden');

    // Pick random verb from VERB_STORE
    const v = VERB_STORE[Math.floor(Math.random() * VERB_STORE.length)] || State.verb;
    const types = ['v2', 'v3', 'tense_present', 'tense_past'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    let question = '';
    let correctAnswer = '';
    let wrongPool = [];
    let explanation = '';

    if (chosenType === 'v2') {
      question = `Dạng Quá khứ đơn (V2) của động từ "${v.v1}" (${v.meaning}) là gì?`;
      correctAnswer = v.v2;
      explanation = `Động từ "${v.v1}" có dạng quá khứ V2 là "${v.v2}" (V3 là "${v.v3}").`;
      wrongPool = [v.v1 + 'ed', v.v3, v.v1 + 'd', v.ving, 'went', 'took', 'made'];
    } else if (chosenType === 'v3') {
      question = `Dạng Phân từ hai (V3 / Past Participle) của động từ "${v.v1}" là gì?`;
      correctAnswer = v.v3;
      explanation = `Động từ "${v.v1}" có dạng phân từ hai V3 là "${v.v3}".`;
      wrongPool = [v.v2, v.v1 + 'ed', v.v1 + 'en', v.ving, 'done', 'seen'];
    } else if (chosenType === 'tense_present') {
      const subject = ['He', 'She', 'The student'][Math.floor(Math.random() * 3)];
      question = `Chia động từ "${v.v1}" ở thì Hiện tại đơn với chủ ngữ "${subject}":\n"${subject} _____ ${v.activeObject || 'every day'}."`;
      correctAnswer = v.vs;
      explanation = `Với chủ ngữ ngôi thứ 3 số ít (${subject}) ở thì Hiện tại đơn, động từ "${v.v1}" chia thành "${v.vs}".`;
      wrongPool = [v.v1, v.v2, v.ving, 'is ' + v.v1];
    } else {
      question = `Chọn câu đúng ở thì Quá khứ đơn với động từ "${v.v1}":`;
      correctAnswer = `I ${v.v2} ${v.activeObject || ''} yesterday.`;
      explanation = `Thì Quá khứ đơn dùng dạng V2 (${v.v2}) đi kèm với trạng từ chỉ thời gian quá khứ "yesterday".`;
      wrongPool = [
        `I ${v.v1} ${v.activeObject || ''} yesterday.`,
        `I ${v.v3} ${v.activeObject || ''} yesterday.`,
        `I will ${v.v1} ${v.activeObject || ''} yesterday.`
      ];
    }

    // Prepare 4 options
    const uniqueWrongs = [...new Set(wrongPool.filter(w => w !== correctAnswer))].slice(0, 3);
    while (uniqueWrongs.length < 3) {
      uniqueWrongs.push('none of these');
    }

    const options = [correctAnswer, ...uniqueWrongs].sort(() => Math.random() - 0.5);

    State.quiz.currentQuestion = {
      question,
      correctAnswer,
      options,
      explanation
    };

    qText.textContent = question;
    if (catBadge) catBadge.textContent = 'Thử thách Chia Động Từ & 12 Thì';

    optGrid.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt-btn p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-violet-500/25 text-slate-800 dark:text-slate-100 font-mono text-sm sm:text-base font-bold text-left hover:border-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer flex items-center justify-between';
      btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle text-slate-400"></i>`;

      btn.addEventListener('click', () => handleQuizAnswer(opt, btn));
      optGrid.appendChild(btn);
    });
  }

  function handleQuizAnswer(selectedOption, clickedBtn) {
    const q = State.quiz.currentQuestion;
    if (!q) return;

    const optButtons = document.querySelectorAll('.quiz-opt-btn');
    optButtons.forEach(b => b.disabled = true);

    const feedbackBox = document.getElementById('quiz-feedback-box');
    const scoreEl = document.getElementById('quiz-score');
    const streakEl = document.getElementById('quiz-streak');
    const accuracyEl = document.getElementById('quiz-accuracy');
    const totalEl = document.getElementById('quiz-total');

    State.quiz.total++;

    const isCorrect = selectedOption === q.correctAnswer;
    if (isCorrect) {
      State.quiz.score += 10;
      State.quiz.streak++;
      State.quiz.correct++;

      clickedBtn.className = 'quiz-opt-btn p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-mono text-sm sm:text-base font-bold text-left flex items-center justify-between';
      clickedBtn.innerHTML = `<span>${selectedOption}</span> <i class="fa-solid fa-circle-check text-emerald-500"></i>`;

      if (feedbackBox) {
        feedbackBox.className = 'p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm leading-relaxed';
        feedbackBox.innerHTML = `<strong>Chính xác! 🎉</strong> ${q.explanation}`;
        feedbackBox.classList.remove('hidden');
      }
    } else {
      State.quiz.streak = 0;

      clickedBtn.className = 'quiz-opt-btn p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-700 dark:text-rose-300 font-mono text-sm sm:text-base font-bold text-left flex items-center justify-between';
      clickedBtn.innerHTML = `<span>${selectedOption}</span> <i class="fa-solid fa-circle-xmark text-rose-500"></i>`;

      // Highlight the correct answer
      optButtons.forEach(b => {
        if (b.textContent.trim().startsWith(q.correctAnswer)) {
          b.className = 'quiz-opt-btn p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-mono text-sm sm:text-base font-bold text-left flex items-center justify-between';
          b.innerHTML = `<span>${q.correctAnswer}</span> <i class="fa-solid fa-circle-check text-emerald-500"></i>`;
        }
      });

      if (feedbackBox) {
        feedbackBox.className = 'p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm leading-relaxed';
        feedbackBox.innerHTML = `<strong>Chưa đúng rồi! 💡</strong> Đáp án đúng là <strong>${q.correctAnswer}</strong>. ${q.explanation}`;
        feedbackBox.classList.remove('hidden');
      }
    }

    // Update Score Board
    if (scoreEl) scoreEl.textContent = State.quiz.score;
    if (streakEl) streakEl.textContent = State.quiz.streak;
    if (totalEl) totalEl.textContent = State.quiz.total;
    if (accuracyEl) {
      const acc = Math.round((State.quiz.correct / State.quiz.total) * 100);
      accuracyEl.textContent = `${acc}%`;
    }
  }

  // 3D Flashcard Logic
  function renderFlashcard() {
    const v = VERB_STORE[State.flashcard.currentIndex] || State.verb;
    const inner = document.getElementById('flashcard-inner');
    const counter = document.getElementById('fc-counter');
    const frontWord = document.getElementById('fc-front-word');
    const frontIpa = document.getElementById('fc-front-ipa');
    const frontBadge = document.getElementById('fc-front-badge');
    const backMeaning = document.getElementById('fc-back-meaning');
    const backForms = document.getElementById('fc-back-forms');

    if (counter) counter.textContent = `${State.flashcard.currentIndex + 1} / ${VERB_STORE.length}`;
    if (frontWord) frontWord.textContent = v.v1;
    if (frontIpa) frontIpa.textContent = v.ipaUS || `/${v.v1}/`;
    if (frontBadge) {
      frontBadge.textContent = v.isIrregular ? 'Irregular Verb' : 'Regular Verb';
      frontBadge.className = v.isIrregular
        ? 'px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-400/30'
        : 'px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-400/30';
    }

    if (backMeaning) backMeaning.textContent = v.meaning || 'Đang cập nhật nghĩa';
    if (backForms) {
      backForms.innerHTML = `
        <div class="p-2 rounded-xl bg-slate-200 dark:bg-slate-800"><span class="text-[10px] text-slate-400 block">V1</span><span class="font-bold text-slate-900 dark:text-white">${v.v1}</span></div>
        <div class="p-2 rounded-xl bg-slate-200 dark:bg-slate-800"><span class="text-[10px] text-slate-400 block">V-s/es</span><span class="font-bold text-emerald-500">${v.vs}</span></div>
        <div class="p-2 rounded-xl bg-slate-200 dark:bg-slate-800"><span class="text-[10px] text-slate-400 block">V2</span><span class="font-bold text-amber-500">${v.v2}</span></div>
        <div class="p-2 rounded-xl bg-slate-200 dark:bg-slate-800"><span class="text-[10px] text-slate-400 block">V3</span><span class="font-bold text-purple-500">${v.v3}</span></div>
        <div class="p-2 rounded-xl bg-slate-200 dark:bg-slate-800"><span class="text-[10px] text-slate-400 block">V-ing</span><span class="font-bold text-cyan-500">${v.ving}</span></div>
      `;
    }

    if (inner) {
      if (State.flashcard.isFlipped) {
        inner.classList.add('is-flipped');
      } else {
        inner.classList.remove('is-flipped');
      }
    }
  }

  function flipFlashcard() {
    State.flashcard.isFlipped = !State.flashcard.isFlipped;
    const inner = document.getElementById('flashcard-inner');
    if (inner) inner.classList.toggle('is-flipped', State.flashcard.isFlipped);
  }

  // =========================================================================
  // 11. INITIALIZATION & EVENT BINDINGS
  // =========================================================================
  function initApp() {
    // 1. Update Verb Count Badges
    const badgeCount = document.getElementById('hero-total-verbs-inline');
    if (badgeCount) badgeCount.textContent = `${VERB_STORE.length} Động từ`;

    // 2. Render Initial Matrix & Hero
    renderHeroVerb(State.verb);
    renderMatrix();

    // 3. Quick Chips
    const chipsContainer = document.getElementById('quick-chips');
    const chipsList = ['write', 'make', 'build', 'take', 'eat', 'go', 'come', 'run', 'speak', 'know', 'see', 'do', 'have', 'be', 'find', 'think'];
    if (chipsContainer) {
      chipsContainer.innerHTML = '';
      chipsList.forEach(word => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = word;
        btn.className = 'quick-chip-btn px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-violet-500/25 text-slate-700 dark:text-slate-300 hover:border-cyan-400 transition-colors cursor-pointer shrink-0';
        btn.addEventListener('click', () => {
          const found = findOrBuildVerb(word);
          if (found) {
            State.verb = found;
            renderHeroVerb(found);
            renderMatrix();
            showToast(`Đã chọn động từ: ${word}`);
          }
        });
        chipsContainer.appendChild(btn);
      });
    }

    // 4. Search Bar & Autocomplete
    const searchInput = document.getElementById('verb-input');
    const btnSearch = document.getElementById('btn-search');
    const btnClear = document.getElementById('btn-clear');
    const dropdown = document.getElementById('suggestions-dropdown');

    function performSearch() {
      const q = (searchInput ? searchInput.value : '').trim();
      if (!q) return;
      const found = findOrBuildVerb(q);
      if (found) {
        State.verb = found;
        renderHeroVerb(found);
        renderMatrix();
        if (dropdown) dropdown.classList.add('hidden');
        showToast(`Đã chọn động từ: ${found.v1}`);
      }
    }

    if (btnSearch) btnSearch.addEventListener('click', performSearch);
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
      });

      searchInput.addEventListener('input', () => {
        const val = searchInput.value.trim().toLowerCase();
        if (!val || val.length < 1) {
          if (dropdown) dropdown.classList.add('hidden');
          return;
        }

        const matches = VERB_STORE.filter(v => 
          v.v1.toLowerCase().startsWith(val) ||
          v.meaning.toLowerCase().includes(val) ||
          removeVietnameseTones(v.meaning).includes(removeVietnameseTones(val))
        ).slice(0, 8);

        if (matches.length > 0 && dropdown) {
          dropdown.innerHTML = '';
          matches.forEach(m => {
            const row = document.createElement('div');
            row.className = 'p-2.5 hover:bg-violet-500/10 cursor-pointer flex items-center justify-between text-xs transition-colors border-b border-slate-100 dark:border-violet-500/15';
            row.innerHTML = `
              <div>
                <strong class="font-mono text-sm text-slate-900 dark:text-white">${m.v1}</strong>
                <span class="font-mono text-slate-400 text-[11px] ml-1.5">${m.ipaUS}</span>
              </div>
              <span class="text-slate-500 dark:text-slate-300 truncate max-w-[180px]">${m.meaning}</span>
            `;
            row.addEventListener('click', () => {
              State.verb = m;
              renderHeroVerb(m);
              renderMatrix();
              searchInput.value = m.v1;
              dropdown.classList.add('hidden');
              showToast(`Đã nạp động từ: ${m.v1}`);
            });
            dropdown.appendChild(row);
          });
          dropdown.classList.remove('hidden');
        } else if (dropdown) {
          dropdown.classList.add('hidden');
        }
      });
    }

    if (btnClear && searchInput) {
      btnClear.addEventListener('click', () => {
        searchInput.value = '';
        if (dropdown) dropdown.classList.add('hidden');
        searchInput.focus();
      });
    }

    // 5. Subject Buttons
    const subjectContainer = document.getElementById('subject-selector');
    if (subjectContainer) {
      const subjectBtns = subjectContainer.querySelectorAll('button');
      subjectBtns.forEach(b => {
        b.addEventListener('click', () => {
          subjectBtns.forEach(btn => {
            btn.className = 'px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-white transition-all';
          });
          b.className = 'px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-violet-600 text-white shadow-sm transition-all';
          State.subject = b.dataset.subject || b.textContent.trim();
          renderMatrix();
        });
      });
    }

    // 6. Polarity Buttons
    const polarityContainer = document.getElementById('polarity-selector');
    if (polarityContainer) {
      const polBtns = polarityContainer.querySelectorAll('button');
      polBtns.forEach(b => {
        b.addEventListener('click', () => {
          polBtns.forEach(btn => {
            btn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-white transition-all';
          });
          b.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-600 text-white shadow-sm transition-all';
          State.polarity = b.dataset.polarity || 'affirmative';
          renderMatrix();
        });
      });
    }

    // 7. Passive Voice Toggle
    const passiveBtn = document.getElementById('btn-passive-toggle');
    if (passiveBtn) {
      passiveBtn.addEventListener('click', () => {
        if (!State.verb.isTransitive) {
          showToast('Nội động từ không có dạng bị động');
          return;
        }
        State.isPassive = !State.isPassive;
        updatePassiveToggleUI();
        renderMatrix();
      });
    }

    // 8. Custom Object Input
    const customObjInput = document.getElementById('custom-object-input');
    if (customObjInput) {
      customObjInput.addEventListener('input', () => {
        State.customObject = customObjInput.value.trim();
        renderMatrix();
      });
    }

    // 9. Timeframe Tabs
    const timeframeTabs = document.getElementById('timeframe-tabs');
    if (timeframeTabs) {
      const tfBtns = timeframeTabs.querySelectorAll('button');
      tfBtns.forEach(b => {
        b.addEventListener('click', () => {
          tfBtns.forEach(btn => {
            btn.className = 'px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-white transition-all';
          });
          b.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm transition-all';
          State.timeframeFilter = b.dataset.timeframe || 'all';
          renderMatrix();
        });
      });
    }

    // 10. Layout Mode Selector
    const layoutSelector = document.getElementById('layout-selector');
    if (layoutSelector) {
      const layBtns = layoutSelector.querySelectorAll('button');
      layBtns.forEach(b => {
        b.addEventListener('click', () => {
          layBtns.forEach(btn => {
            btn.className = 'px-2.5 py-1 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-white transition-all';
          });
          b.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-violet-600 text-white shadow-sm transition-all';
          State.layoutMode = b.dataset.layout || 'grid';
          renderMatrix();
        });
      });
    }

    // 11. US/UK Audio Voice Pills
    const btnSpeakUS = document.getElementById('btn-speak-us');
    const btnSpeakUK = document.getElementById('btn-speak-uk');
    if (btnSpeakUS) {
      btnSpeakUS.addEventListener('click', () => {
        State.activeVoiceLang = 'en-US';
        speakText(State.verb.v1, 'en-US', btnSpeakUS);
      });
    }
    if (btnSpeakUK) {
      btnSpeakUK.addEventListener('click', () => {
        State.activeVoiceLang = 'en-GB';
        speakText(State.verb.v1, 'en-GB', btnSpeakUK);
      });
    }

    // 12. Topbar Navigation Tabs
    const tabMatrix = document.getElementById('nav-tab-matrix');
    const tabSgk = document.getElementById('nav-tab-sgk');
    const tabArena = document.getElementById('nav-tab-arena');

    if (tabMatrix) tabMatrix.addEventListener('click', () => switchModule('matrix'));
    if (tabSgk) tabSgk.addEventListener('click', () => switchModule('sgk'));
    if (tabArena) tabArena.addEventListener('click', () => switchModule('arena'));

    // 13. Arena Mode Buttons (Quiz vs Flashcard)
    const btnQuizMode = document.getElementById('btn-arena-mode-quiz');
    const btnFcMode = document.getElementById('btn-arena-mode-flashcard');
    if (btnQuizMode) {
      btnQuizMode.addEventListener('click', () => {
        State.arenaMode = 'quiz';
        renderArenaModule();
      });
    }
    if (btnFcMode) {
      btnFcMode.addEventListener('click', () => {
        State.arenaMode = 'flashcard';
        renderArenaModule();
      });
    }

    // Quiz Next Button
    const btnQuizNext = document.getElementById('btn-quiz-next');
    if (btnQuizNext) {
      btnQuizNext.addEventListener('click', generateNextQuizQuestion);
    }

    // Flashcard Buttons
    const innerCard = document.getElementById('flashcard-inner');
    const btnFcFlip = document.getElementById('btn-fc-flip');
    const btnFcNext = document.getElementById('btn-fc-next');
    const btnFcPrev = document.getElementById('btn-fc-prev');
    const btnFcRandom = document.getElementById('btn-fc-random');
    const btnFcSpeak = document.getElementById('btn-fc-speak');
    const btnFcLoadMatrix = document.getElementById('btn-fc-load-matrix');

    if (innerCard) innerCard.addEventListener('click', flipFlashcard);
    if (btnFcFlip) btnFcFlip.addEventListener('click', flipFlashcard);

    if (btnFcNext) {
      btnFcNext.addEventListener('click', () => {
        State.flashcard.currentIndex = (State.flashcard.currentIndex + 1) % VERB_STORE.length;
        State.flashcard.isFlipped = false;
        renderFlashcard();
      });
    }

    if (btnFcPrev) {
      btnFcPrev.addEventListener('click', () => {
        State.flashcard.currentIndex = (State.flashcard.currentIndex - 1 + VERB_STORE.length) % VERB_STORE.length;
        State.flashcard.isFlipped = false;
        renderFlashcard();
      });
    }

    if (btnFcRandom) {
      btnFcRandom.addEventListener('click', () => {
        State.flashcard.currentIndex = Math.floor(Math.random() * VERB_STORE.length);
        State.flashcard.isFlipped = false;
        renderFlashcard();
      });
    }

    if (btnFcSpeak) {
      btnFcSpeak.addEventListener('click', (e) => {
        e.stopPropagation();
        const v = VERB_STORE[State.flashcard.currentIndex];
        if (v) speakText(v.v1, 'en-US', btnFcSpeak);
      });
    }

    if (btnFcLoadMatrix) {
      btnFcLoadMatrix.addEventListener('click', (e) => {
        e.stopPropagation();
        const v = VERB_STORE[State.flashcard.currentIndex];
        if (v) {
          State.verb = v;
          renderHeroVerb(v);
          renderMatrix();
          switchModule('matrix');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast(`Đã mở "${v.v1}" trong Ma trận 12 Thì`);
        }
      });
    }

    // 14. Detail Modal Close
    const btnCloseDetail = document.getElementById('btn-close-detail');
    if (btnCloseDetail) btnCloseDetail.addEventListener('click', closeTenseDetailModal);

    // 15. Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        switchModule('matrix');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
        closeTenseDetailModal();
        if (dropdown) dropdown.classList.add('hidden');
      } else if (e.code === 'Space' && State.activeModule === 'arena' && State.arenaMode === 'flashcard' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        flipFlashcard();
      }
    });

    // Check URL Hash for initial tab
    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (['matrix', 'sgk', 'arena'].includes(hash)) {
      switchModule(hash);
    }
  }

  // Auto-init on DOMContentLoaded or immediate
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Export Global API
  window.LexiMatrix = {
    version: '3.0.0',
    State,
    VERB_STORE,
    switchModule,
    renderHeroVerb,
    renderMatrix,
    speakText,
    showToast,
    copyToClipboard
  };

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
