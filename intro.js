/**
 * =========================================================================
 * LEXIMATRIX - INTRO SPLASH SCREEN LOGIC (intro.js)
 * =========================================================================
 */

(function () {
  let introTimer = null;
  let isDismissed = false;

  /**
   * Hàm chuyển vào ứng dụng chính với hiệu ứng fade-out mượt mà
   */
  function goToApp() {
    if (isDismissed) return;
    isDismissed = true;

    // Hủy bộ đếm giờ tự động nếu đã kích hoạt chuyển trang thủ công
    if (introTimer) {
      clearTimeout(introTimer);
      introTimer = null;
    }

    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    // Bắt đầu hiệu ứng mờ dần (fade-out transition ~400ms)
    overlay.classList.add('intro-fade-out');

    // Sau khi kết thúc hiệu ứng 400ms, gỡ bỏ hoàn toàn phần tử khỏi DOM
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 400);
  }

  // Đăng ký toàn cục để các thành phần khác có thể gọi nếu cần
  window.goToApp = goToApp;

  /**
   * Xử lý phím tắt (Enter, Space, Escape) để bỏ qua Intro
   */
  function handleIntroKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      document.removeEventListener('keydown', handleIntroKeyDown);
      goToApp();
    }
  }

  document.addEventListener('keydown', handleIntroKeyDown);

  /**
   * Khởi tạo các sự kiện khi DOM đã sẵn sàng
   */
  function initIntro() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    // 1. Sự kiện nhấp nút "Vào trang tra cứu chính"
    const enterBtn = document.getElementById('btn-intro-enter');
    if (enterBtn) {
      enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToApp();
      });
    }

    // 2. Tự động chuyển cảnh sau 1.8 giây (1800ms)
    introTimer = setTimeout(() => {
      goToApp();
    }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntro);
  } else {
    initIntro();
  }
})();
