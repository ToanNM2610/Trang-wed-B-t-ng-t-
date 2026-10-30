/**
 * app.js — LexiMatrix Curriculum & 12-Tense Matrix Companion Controller
 * Integrates VERB_DATABASE and CURRICULUM_DATA (Grade 1 - 12) seamlessly.
 */

(function (window, document) {
  'use strict';

  // Exported Namespace
  const LexiMatrixApp = {
    version: '2.5.0',
    curriculumReady: false,
    
    // Quick helpers
    getCurriculumStats: function () {
      const data = window.CURRICULUM_DATA || [];
      const totalUnits = data.length;
      let totalVocab = 0;
      data.forEach(u => {
        totalVocab += (u.vocabulary ? u.vocabulary.length : 0);
      });
      return {
        totalUnits,
        totalVocab,
        gradesCount: 12
      };
    },

    // Get units by grade
    getUnitsByGrade: function (gradeName) {
      const data = window.CURRICULUM_DATA || [];
      return data.filter(u => u.grade === gradeName);
    },

    // Search across curriculum
    searchCurriculum: function (query) {
      const q = (query || '').trim().toLowerCase();
      if (!q) return [];
      const data = window.CURRICULUM_DATA || [];
      const results = [];
      data.forEach(unit => {
        (unit.vocabulary || []).forEach(vocab => {
          if (
            (vocab.word && vocab.word.toLowerCase().includes(q)) ||
            (vocab.meaning && vocab.meaning.toLowerCase().includes(q)) ||
            (vocab.ipa && vocab.ipa.toLowerCase().includes(q)) ||
            (vocab.collocation && vocab.collocation.toLowerCase().includes(q))
          ) {
            results.push({ ...vocab, unit: unit.unit, grade: unit.grade, unitTitle: unit.title });
          }
        });
      });
      return results;
    }
  };

  // Expose to window
  window.LexiMatrixApp = LexiMatrixApp;

  // Log on load
  if (typeof console !== 'undefined') {
    const stats = LexiMatrixApp.getCurriculumStats();
    console.log(`[LexiMatrix] Companion Engine Ready. ${stats.totalUnits} Units (${stats.totalVocab} Vocab items) available.`);
  }

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
