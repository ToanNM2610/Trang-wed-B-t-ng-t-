/**
 * LexiMatrix Core Application Logic
 * Integrates VERB_DATABASE with Autocomplete search, Quick Tags & 12-Tense Matrix
 */

import { VERB_DATABASE } from './verbsData.js';

// Application State
const state = {
  verbs: Array.isArray(VERB_DATABASE) ? VERB_DATABASE : [],
  currentVerb: null,
  currentSubject: 'I',
  currentVoice: 'active', // 'active' | 'passive'
  searchDebounceTimer: null,
  activeDropdownIndex: -1,
  quickTagVerbs: ['write', 'go', 'be', 'have', 'do', 'see', 'take', 'make', 'run', 'speak', 'build', 'know']
};

// DOM Elements
const elements = {
  verbCountBadge: document.getElementById('verb-count-badge'),
  verbSearch: document.getElementById('verb-search'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  searchDropdown: document.getElementById('search-dropdown'),
  searchResultsList: document.getElementById('search-results-list'),
  resultsCountText: document.getElementById('results-count-text'),
  quickTagsContainer: document.getElementById('quick-tags-container'),
  
  // Overview
  currentV1: document.getElementById('current-v1'),
  currentIpa: document.getElementById('current-ipa'),
  currentTypeBadge: document.getElementById('current-type-badge'),
  currentMeaning: document.getElementById('current-meaning'),
  currentObject: document.getElementById('current-object'),
  pronounceBtn: document.getElementById('pronounce-btn'),
  
  // 5 Forms
  formV1: document.getElementById('form-v1'),
  formSEs: document.getElementById('form-s-es'),
  formV2: document.getElementById('form-v2'),
  formV3: document.getElementById('form-v3'),
  formIng: document.getElementById('form-ing'),
  
  // Controls
  subjectSelect: document.getElementById('subject-select'),
  voiceActiveBtn: document.getElementById('voice-active-btn'),
  voicePassiveBtn: document.getElementById('voice-passive-btn'),
  
  // Theme
  themeToggle: document.getElementById('theme-toggle'),
  themeIconDark: document.getElementById('theme-icon-dark'),
  themeIconLight: document.getElementById('theme-icon-light')
};

/**
 * 12 Tenses Configuration & Definition
 */
const TENSES = [
  // PRESENT
  {
    id: 'present-simple',
    containerId: 'card-present-simple',
    time: 'present',
    nameVi: 'Hiện tại đơn',
    nameEn: 'Present Simple',
    activeFormula: 'S + V1 / V_s/es + O',
    passiveFormula: 'S_obj + am/is/are + V3 (+ by O)',
    render: (verb, subject, voice) => generatePresentSimple(verb, subject, voice)
  },
  {
    id: 'present-continuous',
    containerId: 'card-present-continuous',
    time: 'present',
    nameVi: 'Hiện tại tiếp diễn',
    nameEn: 'Present Continuous',
    activeFormula: 'S + am/is/are + V_ing + O',
    passiveFormula: 'S_obj + am/is/are + being + V3 (+ by O)',
    render: (verb, subject, voice) => generatePresentContinuous(verb, subject, voice)
  },
  {
    id: 'present-perfect',
    containerId: 'card-present-perfect',
    time: 'present',
    nameVi: 'Hiện tại hoàn thành',
    nameEn: 'Present Perfect',
    activeFormula: 'S + have/has + V3 + O',
    passiveFormula: 'S_obj + have/has been + V3 (+ by O)',
    render: (verb, subject, voice) => generatePresentPerfect(verb, subject, voice)
  },
  {
    id: 'present-perfect-continuous',
    containerId: 'card-present-perfect-continuous',
    time: 'present',
    nameVi: 'Hiện tại hoàn thành tiếp diễn',
    nameEn: 'Present Perfect Continuous',
    activeFormula: 'S + have/has been + V_ing + O',
    passiveFormula: 'S_obj + have/has been being + V3 (+ by O)',
    render: (verb, subject, voice) => generatePresentPerfectContinuous(verb, subject, voice)
  },

  // PAST
  {
    id: 'past-simple',
    containerId: 'card-past-simple',
    time: 'past',
    nameVi: 'Quá khứ đơn',
    nameEn: 'Past Simple',
    activeFormula: 'S + V2 + O',
    passiveFormula: 'S_obj + was/were + V3 (+ by O)',
    render: (verb, subject, voice) => generatePastSimple(verb, subject, voice)
  },
  {
    id: 'past-continuous',
    containerId: 'card-past-continuous',
    time: 'past',
    nameVi: 'Quá khứ tiếp diễn',
    nameEn: 'Past Continuous',
    activeFormula: 'S + was/were + V_ing + O',
    passiveFormula: 'S_obj + was/were + being + V3 (+ by O)',
    render: (verb, subject, voice) => generatePastContinuous(verb, subject, voice)
  },
  {
    id: 'past-perfect',
    containerId: 'card-past-perfect',
    time: 'past',
    nameVi: 'Quá khứ hoàn thành',
    nameEn: 'Past Perfect',
    activeFormula: 'S + had + V3 + O',
    passiveFormula: 'S_obj + had been + V3 (+ by O)',
    render: (verb, subject, voice) => generatePastPerfect(verb, subject, voice)
  },
  {
    id: 'past-perfect-continuous',
    containerId: 'card-past-perfect-continuous',
    time: 'past',
    nameVi: 'Quá khứ hoàn thành tiếp diễn',
    nameEn: 'Past Perfect Continuous',
    activeFormula: 'S + had been + V_ing + O',
    passiveFormula: 'S_obj + had been being + V3 (+ by O)',
    render: (verb, subject, voice) => generatePastPerfectContinuous(verb, subject, voice)
  },

  // FUTURE
  {
    id: 'future-simple',
    containerId: 'card-future-simple',
    time: 'future',
    nameVi: 'Tương lai đơn',
    nameEn: 'Future Simple',
    activeFormula: 'S + will + V1 + O',
    passiveFormula: 'S_obj + will be + V3 (+ by O)',
    render: (verb, subject, voice) => generateFutureSimple(verb, subject, voice)
  },
  {
    id: 'future-continuous',
    containerId: 'card-future-continuous',
    time: 'future',
    nameVi: 'Tương lai tiếp diễn',
    nameEn: 'Future Continuous',
    activeFormula: 'S + will be + V_ing + O',
    passiveFormula: 'S_obj + will be being + V3 (+ by O)',
    render: (verb, subject, voice) => generateFutureContinuous(verb, subject, voice)
  },
  {
    id: 'future-perfect',
    containerId: 'card-future-perfect',
    time: 'future',
    nameVi: 'Tương lai hoàn thành',
    nameEn: 'Future Perfect',
    activeFormula: 'S + will have + V3 + O',
    passiveFormula: 'S_obj + will have been + V3 (+ by O)',
    render: (verb, subject, voice) => generateFuturePerfect(verb, subject, voice)
  },
  {
    id: 'future-perfect-continuous',
    containerId: 'card-future-perfect-continuous',
    time: 'future',
    nameVi: 'Tương lai hoàn thành tiếp diễn',
    nameEn: 'Future Perfect Continuous',
    activeFormula: 'S + will have been + V_ing + O',
    passiveFormula: 'S_obj + will have been being + V3 (+ by O)',
    render: (verb, subject, voice) => generateFuturePerfectContinuous(verb, subject, voice)
  }
];

/**
 * Vietnamese character normalization for search
 */
function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
}

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getObjectAgent(subject) {
  const map = {
    'I': 'me',
    'He': 'him',
    'She': 'her',
    'They': 'them',
    'We': 'us',
    'You': 'you'
  };
  return map[subject] || 'them';
}

function getPassiveSubject(objectSample) {
  if (!objectSample) return 'The object';
  return capitalize(objectSample.trim());
}

/**
 * 12-TENSE SENTENCE GENERATORS
 */
function generatePresentSimple(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-brand-400 font-bold">is ${verb.v3}</strong> (by ${agent}).`;
  }
  // Active
  const isSingular = ['He', 'She', 'It'].includes(S);
  if (verb.v1 === 'be') {
    const beForm = S === 'I' ? 'am' : (isSingular ? 'is' : 'are');
    return `${S} <strong class="text-brand-400 font-bold">${beForm}</strong> ${verb.object_sample}.`;
  }
  const verbForm = isSingular ? (verb.v_s_es || verb.v1 + 's') : verb.v1;
  return `${S} <strong class="text-brand-400 font-bold">${verbForm}</strong> ${verb.object_sample}.`;
}

function generatePresentContinuous(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-brand-400 font-bold">is being ${verb.v3}</strong> (by ${agent}).`;
  }
  const isSingular = ['He', 'She', 'It'].includes(S);
  const beForm = S === 'I' ? 'am' : (isSingular ? 'is' : 'are');
  return `${S} <strong class="text-brand-400 font-bold">${beForm} ${verb.v_ing}</strong> ${verb.object_sample}.`;
}

function generatePresentPerfect(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-brand-400 font-bold">has been ${verb.v3}</strong> (by ${agent}).`;
  }
  const isSingular = ['He', 'She', 'It'].includes(S);
  const haveForm = isSingular ? 'has' : 'have';
  return `${S} <strong class="text-brand-400 font-bold">${haveForm} ${verb.v3}</strong> ${verb.object_sample}.`;
}

function generatePresentPerfectContinuous(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-brand-400 font-bold">has been being ${verb.v3}</strong> (by ${agent}).`;
  }
  const isSingular = ['He', 'She', 'It'].includes(S);
  const haveForm = isSingular ? 'has' : 'have';
  return `${S} <strong class="text-brand-400 font-bold">${haveForm} been ${verb.v_ing}</strong> ${verb.object_sample}.`;
}

function generatePastSimple(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-purple-400 font-bold">was ${verb.v3}</strong> (by ${agent}).`;
  }
  let pastForm = verb.v2;
  if (verb.v1 === 'be') {
    pastForm = ['I', 'He', 'She', 'It'].includes(S) ? 'was' : 'were';
  }
  return `${S} <strong class="text-purple-400 font-bold">${pastForm}</strong> ${verb.object_sample}.`;
}

function generatePastContinuous(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-purple-400 font-bold">was being ${verb.v3}</strong> (by ${agent}).`;
  }
  const wasWere = ['I', 'He', 'She', 'It'].includes(S) ? 'was' : 'were';
  return `${S} <strong class="text-purple-400 font-bold">${wasWere} ${verb.v_ing}</strong> ${verb.object_sample}.`;
}

function generatePastPerfect(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-purple-400 font-bold">had been ${verb.v3}</strong> (by ${agent}).`;
  }
  return `${S} <strong class="text-purple-400 font-bold">had ${verb.v3}</strong> ${verb.object_sample}.`;
}

function generatePastPerfectContinuous(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-purple-400 font-bold">had been being ${verb.v3}</strong> (by ${agent}).`;
  }
  return `${S} <strong class="text-purple-400 font-bold">had been ${verb.v_ing}</strong> ${verb.object_sample}.`;
}

function generateFutureSimple(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-amber-400 font-bold">will be ${verb.v3}</strong> (by ${agent}).`;
  }
  return `${S} <strong class="text-amber-400 font-bold">will ${verb.v1}</strong> ${verb.object_sample}.`;
}

function generateFutureContinuous(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-amber-400 font-bold">will be being ${verb.v3}</strong> (by ${agent}).`;
  }
  return `${S} <strong class="text-amber-400 font-bold">will be ${verb.v_ing}</strong> ${verb.object_sample}.`;
}

function generateFuturePerfect(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-amber-400 font-bold">will have been ${verb.v3}</strong> (by ${agent}).`;
  }
  return `${S} <strong class="text-amber-400 font-bold">will have ${verb.v3}</strong> ${verb.object_sample}.`;
}

function generateFuturePerfectContinuous(verb, S, voice) {
  if (voice === 'passive') {
    if (!verb.transitive) return null;
    const P_Subj = getPassiveSubject(verb.object_sample);
    const agent = getObjectAgent(S);
    return `${P_Subj} <strong class="text-amber-400 font-bold">will have been being ${verb.v3}</strong> (by ${agent}).`;
  }
  return `${S} <strong class="text-amber-400 font-bold">will have been ${verb.v_ing}</strong> ${verb.object_sample}.`;
}

/**
 * Render the 12-Tense Matrix
 */
function renderTenseMatrix() {
  if (!state.currentVerb) return;

  const verb = state.currentVerb;
  const S = state.currentSubject;
  const voice = state.currentVoice;

  TENSES.forEach((tense) => {
    const cardEl = document.getElementById(tense.containerId);
    if (!cardEl) return;

    const formula = voice === 'passive' ? tense.passiveFormula : tense.activeFormula;
    const sentenceHtml = tense.render(verb, S, voice);

    if (voice === 'passive' && !verb.transitive) {
      // Intransitive verb in passive mode
      cardEl.className = 'tense-card passive-warning-card';
      cardEl.innerHTML = `
        <div class="flex items-start justify-between gap-2 mb-2">
          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-amber-400">${tense.nameVi}</h5>
            <span class="text-[11px] text-slate-400">${tense.nameEn}</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
            ${formula}
          </span>
        </div>
        <div class="mt-3 py-3 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-200">
          <svg class="w-5 h-5 flex-shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-xs font-bold leading-tight">Nội động từ – không chia ở thể bị động</p>
            <p class="text-[11px] text-amber-300/80 mt-0.5">"${verb.v1}" không tác động trực tiếp lên tân ngữ</p>
          </div>
        </div>
      `;
    } else {
      // Normal sentence rendering
      cardEl.className = 'tense-card';
      cardEl.innerHTML = `
        <div class="flex items-start justify-between gap-2 mb-2">
          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-200">${tense.nameVi}</h5>
            <span class="text-[11px] text-slate-400">${tense.nameEn}</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            ${formula}
          </span>
        </div>
        <div class="mt-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <p class="text-sm text-slate-100 font-sans leading-relaxed">
            ${sentenceHtml}
          </p>
        </div>
      `;
    }
  });
}

/**
 * Select and display a verb
 */
function selectVerb(verb) {
  if (!verb) return;
  state.currentVerb = verb;

  // Overview updates
  elements.currentV1.textContent = verb.v1;
  elements.currentIpa.textContent = verb.ipa || '';
  elements.currentMeaning.textContent = verb.meaning || '';
  elements.currentObject.textContent = `"${verb.object_sample || ''}"`;

  // Transitive Badge
  if (verb.transitive) {
    elements.currentTypeBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    elements.currentTypeBadge.textContent = 'Ngoại động từ (Transitive)';
  } else {
    elements.currentTypeBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20';
    elements.currentTypeBadge.textContent = 'Nội động từ (Intransitive)';
  }

  // 5 Forms
  elements.formV1.textContent = verb.v1 || '';
  elements.formSEs.textContent = verb.v_s_es || '';
  elements.formV2.textContent = verb.v2 || '';
  elements.formV3.textContent = verb.v3 || '';
  elements.formIng.textContent = verb.v_ing || '';

  // Update Active Quick Tag styling
  updateActiveQuickTag();

  // Render 12 tenses
  renderTenseMatrix();

  // Close dropdown & reset search
  closeSearchDropdown();
}

/**
 * Autocomplete Search Engine (Debounce 200ms)
 */
function handleSearchInput() {
  const query = elements.verbSearch.value.trim();

  if (query.length > 0) {
    elements.clearSearchBtn.classList.remove('hidden');
  } else {
    elements.clearSearchBtn.classList.add('hidden');
    closeSearchDropdown();
    return;
  }

  clearTimeout(state.searchDebounceTimer);
  state.searchDebounceTimer = setTimeout(() => {
    executeSearch(query);
  }, 200);
}

function executeSearch(rawQuery) {
  const query = rawQuery.toLowerCase();
  const queryNoAccent = removeVietnameseTones(query);

  const matched = [];

  for (const item of state.verbs) {
    const v1 = (item.v1 || '').toLowerCase();
    const v2 = (item.v2 || '').toLowerCase();
    const v3 = (item.v3 || '').toLowerCase();
    const meaning = (item.meaning || '').toLowerCase();
    const meaningNoAccent = removeVietnameseTones(meaning);

    let score = 0;

    // Exact matches
    if (v1 === query) score += 100;
    else if (v2 === query) score += 90;
    else if (v3 === query) score += 85;
    // Prefix matches
    else if (v1.startsWith(query)) score += 70;
    else if (v2.startsWith(query)) score += 60;
    else if (v3.startsWith(query)) score += 55;
    // Substring in verbs
    else if (v1.includes(query) || v2.includes(query) || v3.includes(query)) score += 40;
    // Meaning matches (both raw & without tone)
    else if (meaning.includes(query) || meaningNoAccent.includes(queryNoAccent)) score += 30;

    if (score > 0) {
      matched.push({ verb: item, score });
    }
  }

  // Sort by highest relevance
  matched.sort((a, b) => b.score - a.score);

  // Limit to maximum 8 results
  const top8 = matched.slice(0, 8).map(m => m.verb);
  renderSearchDropdown(top8, rawQuery);
}

function renderSearchDropdown(results, query) {
  elements.searchResultsList.innerHTML = '';
  state.activeDropdownIndex = -1;

  if (results.length === 0) {
    elements.searchResultsList.innerHTML = `
      <li class="px-4 py-6 text-center text-slate-400 text-sm">
        Không tìm thấy động từ nào khớp với "<span class="text-white font-medium">${query}</span>"
      </li>
    `;
    elements.resultsCountText.textContent = '0 kết quả';
    elements.searchDropdown.classList.remove('hidden');
    return;
  }

  elements.resultsCountText.textContent = `Hiển thị ${results.length} kết quả`;

  results.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'px-4 py-3 cursor-pointer hover:bg-slate-800/80 transition-colors flex items-center justify-between text-left';
    li.setAttribute('data-index', index);

    const typeBadge = item.transitive 
      ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ngoại ĐT</span>'
      : '<span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Nội ĐT</span>';

    li.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-base font-bold text-white font-mono min-w-[70px]">${item.v1}</span>
        <span class="text-xs text-slate-400 font-mono hidden sm:inline">${item.ipa || ''}</span>
        <div class="flex items-center gap-1.5 text-xs text-slate-400">
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">${item.v2}</span>
          <span>→</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">${item.v3}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-300 max-w-[160px] truncate sm:max-w-[220px]">${item.meaning || ''}</span>
        ${typeBadge}
      </div>
    `;

    li.addEventListener('click', () => {
      selectVerb(item);
    });

    elements.searchResultsList.appendChild(li);
  });

  elements.searchDropdown.classList.remove('hidden');
}

function closeSearchDropdown() {
  elements.searchDropdown.classList.add('hidden');
  state.activeDropdownIndex = -1;
}

/**
 * Keyboard Navigation for Dropdown (Arrow Up/Down, Enter, Escape)
 */
function handleSearchKeydown(e) {
  const items = elements.searchResultsList.querySelectorAll('li[data-index]');
  if (!items || items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    state.activeDropdownIndex = (state.activeDropdownIndex + 1) % items.length;
    highlightDropdownItem(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    state.activeDropdownIndex = (state.activeDropdownIndex - 1 + items.length) % items.length;
    highlightDropdownItem(items);
  } else if (e.key === 'Enter') {
    if (state.activeDropdownIndex >= 0 && state.activeDropdownIndex < items.length) {
      e.preventDefault();
      items[state.activeDropdownIndex].click();
    }
  } else if (e.key === 'Escape') {
    closeSearchDropdown();
  }
}

function highlightDropdownItem(items) {
  items.forEach((item, index) => {
    if (index === state.activeDropdownIndex) {
      item.classList.add('bg-slate-800');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('bg-slate-800');
    }
  });
}

/**
 * Quick Tags Setup
 */
function setupQuickTags() {
  elements.quickTagsContainer.innerHTML = '';

  state.quickTagVerbs.forEach((v1Name) => {
    const verbObj = state.verbs.find(v => v.v1.toLowerCase() === v1Name.toLowerCase());
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quick-tag-btn px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-all font-mono';
    btn.textContent = v1Name;
    btn.setAttribute('data-verb', v1Name);

    btn.addEventListener('click', () => {
      if (verbObj) {
        selectVerb(verbObj);
      } else {
        // Fallback search
        const found = state.verbs.find(v => v.v1.toLowerCase() === v1Name.toLowerCase());
        if (found) selectVerb(found);
      }
    });

    elements.quickTagsContainer.appendChild(btn);
  });
}

function updateActiveQuickTag() {
  if (!state.currentVerb) return;
  const current = state.currentVerb.v1.toLowerCase();

  const buttons = elements.quickTagsContainer.querySelectorAll('.quick-tag-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-verb') === current) {
      btn.className = 'quick-tag-btn px-2.5 py-1 text-xs font-bold rounded-lg border border-brand-500/40 bg-brand-600/20 text-brand-300 shadow-sm transition-all font-mono';
    } else {
      btn.className = 'quick-tag-btn px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-all font-mono';
    }
  });
}

/**
 * Text-to-Speech Pronunciation
 */
function pronounceCurrentVerb() {
  if (!state.currentVerb || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(state.currentVerb.v1);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/**
 * Voice Toggle Setup (Active vs Passive)
 */
function setVoice(voice) {
  state.currentVoice = voice;

  if (voice === 'active') {
    elements.voiceActiveBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all bg-brand-600 text-white shadow-md';
    elements.voicePassiveBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all';
  } else {
    elements.voicePassiveBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all bg-brand-600 text-white shadow-md';
    elements.voiceActiveBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all';
  }

  renderTenseMatrix();
}

/**
 * Theme Toggle (Dark / Light)
 */
function setupTheme() {
  const isDark = localStorage.getItem('leximatrix_theme') !== 'light';
  applyTheme(isDark);

  elements.themeToggle.addEventListener('click', () => {
    const willBeDark = !document.documentElement.classList.contains('dark');
    applyTheme(willBeDark);
    localStorage.setItem('leximatrix_theme', willBeDark ? 'dark' : 'light');
  });
}

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    elements.themeIconDark.classList.remove('hidden');
    elements.themeIconLight.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    elements.themeIconDark.classList.add('hidden');
    elements.themeIconLight.classList.remove('hidden');
  }
}

/**
 * Event Listeners Initialization
 */
function initEvents() {
  // Search
  elements.verbSearch.addEventListener('input', handleSearchInput);
  elements.verbSearch.addEventListener('keydown', handleSearchKeydown);
  elements.clearSearchBtn.addEventListener('click', () => {
    elements.verbSearch.value = '';
    elements.clearSearchBtn.classList.add('hidden');
    closeSearchDropdown();
    elements.verbSearch.focus();
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!elements.verbSearch.contains(e.target) && !elements.searchDropdown.contains(e.target)) {
      closeSearchDropdown();
    }
  });

  // Subject Select
  elements.subjectSelect.addEventListener('change', (e) => {
    state.currentSubject = e.target.value;
    renderTenseMatrix();
  });

  // Voice Buttons
  elements.voiceActiveBtn.addEventListener('click', () => setVoice('active'));
  elements.voicePassiveBtn.addEventListener('click', () => setVoice('passive'));

  // Audio Pronounce
  elements.pronounceBtn.addEventListener('click', pronounceCurrentVerb);
}

/**
 * Main App Startup
 */
function initApp() {
  console.log(`[LexiMatrix] Loaded ${state.verbs.length} verbs from VERB_DATABASE.`);
  
  // Update Header Badge
  elements.verbCountBadge.textContent = `${state.verbs.length} Động từ`;

  // Setup Theme
  setupTheme();

  // Setup Quick Tags
  setupQuickTags();

  // Setup Events
  initEvents();

  // Select Default Verb: write (or go, or first item)
  let defaultVerb = state.verbs.find(v => v.v1.toLowerCase() === 'write');
  if (!defaultVerb) {
    defaultVerb = state.verbs.find(v => v.v1.toLowerCase() === 'go') || state.verbs[0];
  }
  if (defaultVerb) {
    selectVerb(defaultVerb);
  }
}

// Start
document.addEventListener('DOMContentLoaded', initApp);

