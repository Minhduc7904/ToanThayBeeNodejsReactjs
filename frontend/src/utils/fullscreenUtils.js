/**
 * Tiện ích xử lý fullscreen trên nhiều trình duyệt khác nhau
 */

/**
 * Yêu cầu chế độ toàn màn hình cho một phần tử
 * @param {HTMLElement} element - Phần tử cần chuyển sang chế độ toàn màn hình
 * @returns {Promise} - Promise được giải quyết khi chế độ toàn màn hình được kích hoạt hoặc bị từ chối
 */
export const requestFullscreen = async (element) => {
  // Nếu không có element, sử dụng documentElement
  const targetElement = element || document.documentElement;

  try {
    // Kiểm tra các phương thức khác nhau của API fullscreen
    if (targetElement.requestFullscreen) {
      await targetElement.requestFullscreen();
    } else if (targetElement.webkitRequestFullscreen) {
      // Safari
      await targetElement.webkitRequestFullscreen();
    } else if (targetElement.msRequestFullscreen) {
      // IE11
      await targetElement.msRequestFullscreen();
    } else if (targetElement.mozRequestFullScreen) {
      // Firefox
      await targetElement.mozRequestFullScreen();
    } else {
      // Không hỗ trợ fullscreen
      console.warn("Trình duyệt không hỗ trợ chế độ toàn màn hình");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Lỗi khi bật chế độ toàn màn hình:", error);
    return false;
  }
};

/**
 * Thoát khỏi chế độ toàn màn hình
 * @returns {Promise} - Promise được giải quyết khi thoát khỏi chế độ toàn màn hình hoặc bị từ chối
 */
export const exitFullscreen = async () => {
  try {
    // Kiểm tra các phương thức khác nhau của API fullscreen
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      await document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE11
      await document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      await document.mozCancelFullScreen();
    } else {
      // Không hỗ trợ fullscreen
      console.warn("Trình duyệt không hỗ trợ thoát khỏi chế độ toàn màn hình");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Lỗi khi thoát khỏi chế độ toàn màn hình:", error);
    return false;
  }
};

/**
 * Kiểm tra xem trình duyệt có đang ở chế độ toàn màn hình không
 * @returns {boolean} - true nếu đang ở chế độ toàn màn hình, false nếu không
 */
export const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

/**
 * Kiểm tra xem trình duyệt có hỗ trợ chế độ toàn màn hình không
 * @returns {boolean} - true nếu hỗ trợ, false nếu không
 */
export const isFullscreenEnabled = () => {
  return !!(
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
  );
};
