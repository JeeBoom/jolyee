/**
 * 快捷键管理工具
 */

export const shortcuts = {
  HELP: {
    key: "?",
    description: "显示快捷键帮助",
    ctrl: false,
  },
  SEARCH: {
    key: "s",
    description: "打开搜索框",
    ctrl: true,
    alt: false,
  },
  CLOSE_SEARCH: {
    key: "Escape",
    description: "关闭搜索框",
    ctrl: false,
  },
  FAVORITES: {
    key: "d",
    description: "一键收藏",
    ctrl: true,
    alt: false,
  },
  THEME: {
    key: "k",
    description: "切换深色/浅色主题",
    ctrl: true,
    alt: false,
  },
};

/**
 * 注册快捷键
 * @param {Function} callback - 快捷键触发的回调函数
 * @returns {Function} 卸载函数
 */
export function setupKeyboardShortcuts(callback) {
  const handleKeyDown = (e) => {
    // 忽略在输入框中的输入（除了ESC和一些特定快捷键）
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      // 只允许这些键在输入框中工作
      if (e.key !== "Escape" && !(e.ctrlKey || e.metaKey)) return;
    }

    callback(e);
  };

  window.addEventListener("keydown", handleKeyDown);

  // 返回卸载函数
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}
