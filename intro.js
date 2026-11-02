/**
 * intro.js — LexiMatrix v2.0 Ultra Cyber-Luxury Splash Screen Controller
 * Kiến trúc phòng vệ & Tái khởi tạo bền vững (Persistent Self-Healing Architecture)
 * 
 * 1. Persistent Container Pattern:
 *    - Giữ container #lexi-intro-mount thường trực trên DOM suốt phiên làm việc.
 *    - Khi đóng Intro, không bao giờ xóa node container, chỉ chuyển trạng thái visual sang ẩn
 *      (opacity: 0, pointer-events: none, visibility: hidden) và dọn sạch các node con tạm thời.
 *    - Giúp nút bấm trên thanh topbar ("V") có thể kích hoạt phát lại (replay) bất cứ lúc nào.
 * 2. Self-Healing Mount Factory:
 *    - Tự động kiểm tra #lexi-intro-mount trước khi chạy; nếu tồn tại thì dọn sạch để chuẩn bị canvas mới.
 *    - Nếu chưa có (hoặc bị script khác xóa), tự động tạo mới qua DOM API, áp dụng tầng fixed/inset-0/z-99999
 *      và gắn vào document.body. Đảm bảo chạy độc lập không phụ thuộc markup tĩnh.
 * 3. Replay State Reset & Mutex Protection:
 *    - Mutex Guard (isRunning): Bỏ qua các cú click liên tiếp/dồn dập vào nút icon "V" khi intro đang chạy.
 *    - Khôi phục trạng thái hoàn chỉnh: reset thanh tiến trình và số đếm về 0%, cờ hoàn tất về false,
 *      hủy toàn bộ frame/timer còn sót lại, lấy mốc thời gian performance.now() mới tinh.
 *    - Kích hoạt lại khóa cuộn (lockScroll) trên cả documentElement và body khi replay.
 * 4. Coordinated Re-Exit Lifecycle:
 *    - Tái sử dụng cùng một hàm thoát tập trung (exitIntro) an toàn, mượt mà và nhịp nhàng.
 *    - Khi đạt 100% (hoặc người dùng bấm bỏ qua), chuyển cảnh fade-out, mở khóa cuộn, dọn sạch node con
 *      và đưa cờ isRunning về idle (false), sẵn sàng cho các lần phát lại tiếp theo.
 */

const LexiMatrixIntroEngine = (() => {
  let isRunning = false;
  let isExited = false;
  let animationFrameId = null;
  let watchdogTimerId = null;
  let keyHandlerRef = null;
  let visibilityHandlerRef = null;

  const DURATION_MS = 1800; // Thời lượng chuẩn của Intro
  const WATCHDOG_BUFFER_MS = 500; // Buffer đồng hồ khẩn cấp

  const STATUS_STAGES = [
    { threshold: 35, text: "Initializing 388 Irregular Verbs Database..." },
    { threshold: 75, text: "Calibrating 12 Tenses Active/Passive Matrix..." },
    { threshold: 100, text: "Engine Ready. Entering LexiMatrix..." }
  ];

  /**
   * Giải phóng khóa cuộn trang vô điều kiện (Idempotent cleanup)
   */
  const unlockScroll = () => {
    try {
      if (typeof document !== 'undefined') {
        if (document.body) {
          document.body.style.overflow = '';
          document.body.classList.remove('intro-active');
        }
        if (document.documentElement) {
          document.documentElement.style.overflow = '';
          document.documentElement.classList.remove('intro-active');
        }
      }
    } catch (e) {
      console.warn('[Intro] Unlock scroll warning:', e);
    }
  };

  /**
   * Khóa cuộn trang khi Intro đang hiển thị
   */
  const lockScroll = () => {
    try {
      if (typeof document !== 'undefined') {
        if (document.body) {
          document.body.style.overflow = 'hidden';
          document.body.classList.add('intro-active');
        }
        if (document.documentElement) {
          document.documentElement.style.overflow = 'hidden';
          document.documentElement.classList.add('intro-active');
        }
      }
    } catch (e) {
      console.warn('[Intro] Lock scroll warning:', e);
    }
  };

  /**
   * 2. Self-Healing Mount Factory
   * Đảm bảo container #lexi-intro-mount luôn hiện diện và sẵn sàng tiếp nhận animation
   */
  const ensureMountPoint = () => {
    if (typeof document === 'undefined') return null;

    let mount = document.getElementById('lexi-intro-mount');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'lexi-intro-mount';
      if (document.body) {
        document.body.appendChild(mount);
      } else if (document.documentElement) {
        document.documentElement.appendChild(mount);
      }
    }

    // Thiết lập tầng định vị toàn màn hình chuẩn
    mount.style.position = 'fixed';
    mount.style.inset = '0';
    mount.style.zIndex = '99999';
    mount.setAttribute('aria-live', 'polite');

    return mount;
  };

  /**
   * 1 & 2. Khởi tạo cây DOM màn hình chào bên trong persistent container
   */
  const createIntroDOM = () => {
    const mountPoint = ensureMountPoint();
    if (!mountPoint) return null;

    // Lau sạch nội dung bên trong để chuẩn bị một canvas mới tinh
    mountPoint.innerHTML = '';
    mountPoint.classList.remove('is-exiting');
    mountPoint.classList.add('is-active');
    mountPoint.style.pointerEvents = 'auto';
    mountPoint.style.opacity = '1';
    mountPoint.style.visibility = 'visible';

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
              <div class="cyber-progress-fill" id="lexi-progress-fill" style="transform: scaleX(0);"></div>
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

    // 3. Scroll-Lock Re-engagement
    lockScroll();
    return document.getElementById('lexi-intro-overlay');
  };

  /**
   * 4. Coordinated Re-Exit Lifecycle (Quy trình thoát tập trung & dọn dẹp visual)
   */
  const exitIntro = () => {
    if (isExited) return;
    isExited = true;

    // 1. Hủy bỏ frame request và watchdog timer
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (watchdogTimerId) {
      clearTimeout(watchdogTimerId);
      watchdogTimerId = null;
    }

    // 2. Gỡ bỏ toàn bộ Event Listeners
    if (keyHandlerRef) {
      window.removeEventListener('keydown', keyHandlerRef);
      keyHandlerRef = null;
    }
    if (visibilityHandlerRef) {
      document.removeEventListener('visibilitychange', visibilityHandlerRef);
      visibilityHandlerRef = null;
    }

    // 3. Giải phóng khóa cuộn trang ngay lập tức
    unlockScroll();

    // 4. Smooth Transition & Purge Transient Nodes (Persistent Container Pattern)
    const mountPoint = document.getElementById('lexi-intro-mount');
    const dynamicOverlay = document.getElementById('lexi-intro-overlay');
    const staticOverlay = document.getElementById('intro-overlay');

    if (dynamicOverlay) {
      dynamicOverlay.classList.add('is-exiting', 'intro-fade-out');
    }
    if (staticOverlay) {
      staticOverlay.classList.add('is-exiting', 'intro-fade-out');
    }

    if (mountPoint) {
      mountPoint.classList.remove('is-active');
      mountPoint.classList.add('is-exiting');
      mountPoint.style.opacity = '0';
      mountPoint.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      // Giữ lại container #lexi-intro-mount, chỉ dọn sạch các node con tạm thời
      if (mountPoint) {
        mountPoint.innerHTML = '';
        mountPoint.style.visibility = 'hidden';
        mountPoint.classList.remove('is-exiting');
      }
      if (staticOverlay) {
        staticOverlay.classList.add('intro-hidden');
      }

      unlockScroll();

      // Đưa trạng thái về Idle, giải phóng Mutex để sẵn sàng cho lần Replay kế tiếp
      isRunning = false;
      isExited = false;

      window.dispatchEvent(new CustomEvent('leximatrix:ready'));
    }, 350);
  };

  /**
   * Vòng lặp tiến trình dựa trên Elapsed Time (Delta Calculation)
   */
  const startLoadingLoop = () => {
    const fillEl = document.getElementById('lexi-progress-fill') || document.querySelector('.intro-progress-bar');
    const percentEl = document.getElementById('lexi-percent-counter');
    const statusEl = document.getElementById('lexi-status-text');

    // Reset giao diện trước khi bắt đầu
    if (fillEl) fillEl.style.transform = 'scaleX(0)';
    if (percentEl) percentEl.textContent = '0%';
    if (statusEl && STATUS_STAGES[0]) statusEl.textContent = STATUS_STAGES[0].text;

    // Record a brand-new start timestamp from the system high-resolution clock
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const updateFrame = (now) => {
      if (isExited) return;

      const currentTime = typeof now === 'number' ? now : performance.now();
      const elapsed = Math.max(0, currentTime - startTime);
      const progress = Math.min(elapsed / DURATION_MS, 1);
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

    // Khởi chạy frame đầu tiên
    animationFrameId = requestAnimationFrame(updateFrame);

    // Watchdog Timer độc lập (Emergency Exit): Đảm bảo thoát ngay cả khi tab ngầm
    watchdogTimerId = setTimeout(() => {
      if (!isExited) {
        exitIntro();
      }
    }, DURATION_MS + WATCHDOG_BUFFER_MS);
  };

  /**
   * 3. Replay State Reset & Mutex Protection
   */
  const launch = () => {
    // Re-entrance Guard (Mutex): Bỏ qua nếu Intro đang chạy
    if (isRunning) {
      return;
    }

    // 1. Immediate Background State Bypass: Nếu tab đang mở ngầm khi tải trang, bỏ qua visual hoàn toàn
    if (typeof document !== 'undefined' && (document.hidden || document.visibilityState === 'hidden')) {
      unlockScroll();
      window.dispatchEvent(new CustomEvent('leximatrix:ready'));
      return;
    }

    // Xác lập Mutex & Reset toàn bộ trạng thái chạy
    isRunning = true;
    isExited = false;

    // Hủy bỏ frame/timer còn sót lại nếu có
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (watchdogTimerId) {
      clearTimeout(watchdogTimerId);
      watchdogTimerId = null;
    }

    // Gỡ bỏ event listeners cũ nếu còn
    if (keyHandlerRef) {
      window.removeEventListener('keydown', keyHandlerRef);
      keyHandlerRef = null;
    }
    if (visibilityHandlerRef) {
      document.removeEventListener('visibilitychange', visibilityHandlerRef);
      visibilityHandlerRef = null;
    }

    const overlay = createIntroDOM();
    if (!overlay) {
      isRunning = false;
      unlockScroll();
      return;
    }

    // 2. Chạm hoặc click để đóng
    overlay.addEventListener('click', exitIntro, { once: true });

    const enterBtn = document.getElementById('btn-intro-enter');
    if (enterBtn) {
      enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        exitIntro();
      }, { once: true });
    }

    // 3. Phím tắt Space / Esc / Enter
    keyHandlerRef = (e) => {
      if (['Escape', 'Space', 'Enter'].includes(e.code) || ['Escape', ' ', 'Enter'].includes(e.key)) {
        if (e.code === 'Space' || e.key === ' ') e.preventDefault();
        exitIntro();
      }
    };
    window.addEventListener('keydown', keyHandlerRef);

    // 4. Mid-Run Tab Switch: Hoàn tất ngay nếu chuyển tab
    visibilityHandlerRef = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        exitIntro();
      }
    };
    document.addEventListener('visibilitychange', visibilityHandlerRef);

    // 5. Khởi chạy vòng lặp hoạt ảnh
    startLoadingLoop();
  };

  return {
    launch,
    exitIntro,
    isRunning: () => isRunning
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
