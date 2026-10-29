/**
 * intro.js — LexiMatrix v2.0 Ultra Cyber-Luxury Splash Screen Controller
 * Kiến trúc module khép kín, tối ưu 60fps, khử rò rỉ RAM/Event Listeners
 */
const LexiMatrixIntroEngine = (() => {
  let isExited = false;
  let animationFrameId = null;
  let keyHandlerRef = null;

  const STATUS_STAGES = [
    { threshold: 35, text: "Initializing 388 Irregular Verbs Database..." },
    { threshold: 75, text: "Calibrating 12 Tenses Active/Passive Matrix..." },
    { threshold: 100, text: "Engine Ready. Entering LexiMatrix..." }
  ];

  const createIntroDOM = () => {
    const mountPoint = document.getElementById('lexi-intro-mount');
    if (mountPoint) {
      mountPoint.innerHTML = `
        <div id="lexi-intro-overlay" role="dialog" aria-modal="true" aria-label="Khởi động LexiMatrix">
          <div class="cyber-ambient-stage">
            <div class="cyber-orb cyber-orb--violet"></div>
            <div class="cyber-orb cyber-orb--cyan"></div>
            <div class="cyber-orb cyber-orb--core"></div>
            <div class="cyber-grid-mesh"></div>
          </div>

          <div class="cyber-core-shell">
            <div class="cyber-emblem-dock">
              <div class="cyber-cube-badge">
                <svg class="cyber-cube-svg" viewBox="0 0 40 40" fill="none" stroke="currentColor">
                  <polygon points="20,4 36,13 36,29 20,38 4,29 4,13" stroke-width="1.6" stroke-dasharray="3 2" />
                </svg>
                <div class="cyber-monogram">
                  <span class="cyber-monogram-v">V</span>
                  <span class="cyber-monogram-lm">LM</span>
                </div>
              </div>
              <div class="cyber-emblem-divider"></div>
              <div class="cyber-matrix-grid">
                <div class="cyber-matrix-row">
                  <div class="cyber-node cyber-node--present" style="animation-delay: 0.1s"></div>
                  <div class="cyber-node cyber-node--present" style="animation-delay: 0.3s"></div>
                  <div class="cyber-node cyber-node--present" style="animation-delay: 0.5s"></div>
                  <div class="cyber-node cyber-node--present" style="animation-delay: 0.7s"></div>
                </div>
                <div class="cyber-matrix-row">
                  <div class="cyber-node cyber-node--past" style="animation-delay: 0.2s"></div>
                  <div class="cyber-node cyber-node--past" style="animation-delay: 0.4s"></div>
                  <div class="cyber-node cyber-node--past" style="animation-delay: 0.6s"></div>
                  <div class="cyber-node cyber-node--past" style="animation-delay: 0.8s"></div>
                </div>
                <div class="cyber-matrix-row">
                  <div class="cyber-node cyber-node--future" style="animation-delay: 0.15s"></div>
                  <div class="cyber-node cyber-node--future" style="animation-delay: 0.35s"></div>
                  <div class="cyber-node cyber-node--future" style="animation-delay: 0.55s"></div>
                  <div class="cyber-node cyber-node--future" style="animation-delay: 0.75s"></div>
                </div>
              </div>
            </div>

            <div class="cyber-version-pill">
              <span class="cyber-version-dot"></span>
              <span>v2.0 • 388+ Verbs Database Loaded</span>
            </div>

            <h1 class="cyber-brand-title">LexiMatrix<span class="cyber-brand-title-sub">Engine</span></h1>
            <p class="cyber-tech-subtitle">HỆ THỐNG TRA CỨU ĐỘNG TỪ & MA TRẬN 12 THÌ TIẾNG ANH</p>

            <div class="cyber-telemetry-box">
              <div class="cyber-telemetry-header">
                <span class="cyber-status-text" id="lexi-status-text">Initializing 388 Irregular Verbs Database...</span>
                <span class="cyber-percent-counter" id="lexi-percent-counter">0%</span>
              </div>
              <div class="cyber-progress-track">
                <div class="cyber-progress-fill" id="lexi-progress-fill"></div>
              </div>
            </div>

            <div class="cyber-skip-footer">
              <span>Chạm bất kỳ đâu hoặc bấm</span>
              <span class="cyber-skip-badge">Space / Esc</span>
              <span>để vào ngay</span>
            </div>
          </div>
        </div>
      `;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('intro-active');
      return document.getElementById('lexi-intro-overlay');
    }

    // Direct DOM overlay fallback (e.g. index.html static markup)
    const existingOverlay = document.getElementById('intro-overlay') || document.getElementById('lexi-intro-overlay');
    if (existingOverlay) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('intro-active');
      return existingOverlay;
    }

    return null;
  };

  const exitIntro = () => {
    if (isExited) return;
    isExited = true;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    if (keyHandlerRef) {
      window.removeEventListener('keydown', keyHandlerRef);
      keyHandlerRef = null;
    }

    const overlay = document.getElementById('lexi-intro-overlay') || document.getElementById('intro-overlay');
    const mountPoint = document.getElementById('lexi-intro-mount');

    document.body.classList.remove('intro-active');

    if (overlay) {
      overlay.removeEventListener('click', exitIntro);
      overlay.classList.add('is-exiting');
      overlay.classList.add('intro-fade-out');

      setTimeout(() => {
        document.body.style.overflow = '';
        if (mountPoint) {
          mountPoint.innerHTML = '';
          mountPoint.remove();
        } else if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        window.dispatchEvent(new CustomEvent('leximatrix:ready'));
      }, 450);
    } else {
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('leximatrix:ready'));
    }
  };

  const startLoadingLoop = () => {
    const fillEl = document.getElementById('lexi-progress-fill') || document.querySelector('.intro-progress-bar');
    const percentEl = document.getElementById('lexi-percent-counter');
    const statusEl = document.getElementById('lexi-status-text');

    const duration = 1800;
    const startTime = performance.now();

    // Easing function (easeOutCubic) for ultra-smooth 60fps non-linear motion
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const updateFrame = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const percent = Math.floor(progress * 100);

      if (fillEl) fillEl.style.transform = `scaleX(${easedProgress})`;
      if (percentEl) percentEl.textContent = `${percent}%`;

      if (statusEl) {
        for (const stage of STATUS_STAGES) {
          if (percent <= stage.threshold) {
            if (statusEl.textContent !== stage.text) {
              statusEl.textContent = stage.text;
            }
            break;
          }
        }
      }

      if (progress < 1 && !isExited) {
        animationFrameId = requestAnimationFrame(updateFrame);
      } else {
        exitIntro();
      }
    };

    animationFrameId = requestAnimationFrame(updateFrame);
  };

  return {
    launch: () => {
      const overlay = createIntroDOM();
      if (!overlay) return;

      overlay.addEventListener('click', exitIntro, { once: true });

      const enterBtn = document.getElementById('btn-intro-enter');
      if (enterBtn) {
        enterBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          exitIntro();
        }, { once: true });
      }

      keyHandlerRef = (e) => {
        if (['Escape', 'Space', 'Enter'].includes(e.code) || ['Escape', ' ', 'Enter'].includes(e.key)) {
          if (e.code === 'Space' || e.key === ' ') e.preventDefault();
          exitIntro();
        }
      };
      window.addEventListener('keydown', keyHandlerRef);

      startLoadingLoop();
    },
    exitIntro
  };
})();

// Expose globally for cross-module integration
window.LexiMatrixIntroEngine = LexiMatrixIntroEngine;
window.goToApp = LexiMatrixIntroEngine.exitIntro;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', LexiMatrixIntroEngine.launch);
} else {
  LexiMatrixIntroEngine.launch();
}
