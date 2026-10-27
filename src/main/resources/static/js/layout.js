// layout.js — nạp tự động bởi fragment sidebar (fragments/layout.html).
// Bọc trong IIFE để không đụng tên biến toàn cục của các script khác trong trang.
(function () {
  "use strict";
  if (window.__wfLayout) return; // tránh nạp 2 lần
  window.__wfLayout = true;

  const DEFAULT_AVATAR =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e0e0ff'/%3E%3Ccircle cx='20' cy='15' r='7' fill='%23a5a8d6'/%3E%3Cpath d='M6 38c0-8 6-13 14-13s14 5 14 13z' fill='%23a5a8d6'/%3E%3C/svg%3E";
  const PROFILE_KEY = "wf_profile";
  const $ = (id) => document.getElementById(id);
  const rawFetch = window.fetch.bind(window);

  // ===== Phiên đăng nhập =====
  // login.js lưu token ở sessionStorage (access_token, refresh_token) và ở cookie jwt_token.
  // AuthFillter ưu tiên header Authorization, nếu không có thì đọc cookie jwt_token,
  // nên khi đăng xuất BẮT BUỘC phải xóa cả cookie, nếu không người dùng vẫn đang đăng nhập.
  function clearSession() {
    sessionStorage.clear();
    document.cookie = "jwt_token=; path=/; max-age=0";
  }
  function toLogin() {
    clearSession();
    window.location.replace("/login");
  }

  // Hết phiên (401, hoặc bị chuyển hướng về trang login) -> tự về /login thay vì để trang báo lỗi khó hiểu.
  window.fetch = async (...args) => {
    const res = await rawFetch(...args);
    try {
      const input = args[0];
      const url = typeof input === "string" ? input : input && input.url ? input.url : "";
      const isApi = url.startsWith("/api/") && !url.startsWith("/api/auth/");
      if (isApi && (res.status === 401 || (res.redirected && new URL(res.url).pathname === "/login"))) toLogin();
    } catch (e) {
      /* bỏ qua, không làm hỏng request gốc */
    }
    return res;
  };

  async function logout(btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    const token = sessionStorage.getItem("access_token");
    if (token) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3000); // không để người dùng chờ mãi nếu server chậm
      try {
        const res = await rawFetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        });
        if (!res.ok) console.warn(`Server từ chối đăng xuất (HTTP ${res.status}), vẫn xóa phiên phía trình duyệt.`);
      } catch (e) {
        console.warn("Không gọi được API đăng xuất:", e);
      } finally {
        clearTimeout(timer);
      }
    }
    toLogin(); // luôn xóa phiên và về trang đăng nhập, dù server có phản hồi hay không
  }

  // ===== Thông tin người dùng (sidebar + header) =====
  function useAvatar(img, src) {
    if (!img) return;
    img.onerror = () => { img.onerror = null; img.src = DEFAULT_AVATAR; };
    img.src = src || DEFAULT_AVATAR;
  }
  function paint(u) {
    if (!u) return;
    const name = u.fullName || "Người dùng";
    if ($("sbName")) $("sbName").textContent = name;
    if ($("sbEmail")) $("sbEmail").textContent = u.email || "";
    if ($("hdName")) $("hdName").textContent = name;
    useAvatar($("sbAvatar"), u.avatar);
    useAvatar($("hdAvatar"), u.avatar);
  }
  async function loadUser() {
    try { paint(JSON.parse(sessionStorage.getItem(PROFILE_KEY))); } catch (e) { /* chưa có cache */ }
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) return;
      const u = await res.json();
      sessionStorage.setItem(PROFILE_KEY, JSON.stringify(u));
      paint(u);
    } catch (e) {
      console.warn("Không tải được hồ sơ người dùng:", e);
    }
  }

  // ===== Ô tìm kiếm trên header =====
  // Trang có tìm kiếm trực tiếp (Tổng quan, Dự án) đặt window.liveSearch = true.
  // Ở các trang còn lại, nhấn Enter sẽ chuyển sang trang Dự án với từ khóa đã nhập.
  function initSearch() {
    const input = $("searchInput");
    if (!input) return;
    const hint = $("searchHint");
    if (hint && !/Mac|iPhone|iPad/i.test(navigator.userAgent)) hint.textContent = "Ctrl K";

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.focus();
        input.select();
      } else if (e.key === "Escape" && document.activeElement === input) {
        input.blur();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || window.liveSearch) return;
      const q = input.value.trim();
      if (q) window.location.href = `/duan?key=${encodeURIComponent(q)}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = $("btnLogout");
    if (btn) btn.addEventListener("click", () => logout(btn));
    initSearch();
    loadUser();
  });
})();