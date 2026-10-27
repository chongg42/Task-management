// ===== Cấu hình =====
const STATUS = {
  DANG_THUC_HIEN: {
    label: "Đang chạy",
    badge: "bg-success/15 text-success border-success/30",
  },
  TAM_DUNG: {
    label: "Tạm dừng",
    badge: "bg-warning/15 text-warning border-warning/30",
  },
  HOAN_THANH: {
    label: "Hoàn thành",
    badge: "bg-primary/15 text-primary border-primary/30",
  },
  DA_HUY: {
    label: "Đã hủy",
    badge: "bg-surface-container-highest text-outline border-outline-variant",
  },
};
const LATE_BADGE = "bg-danger/15 text-danger border-danger/30";
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e0e0ff'/%3E%3Ccircle cx='20' cy='15' r='7' fill='%23a5a8d6'/%3E%3Cpath d='M6 38c0-8 6-13 14-13s14 5 14 13z' fill='%23a5a8d6'/%3E%3C/svg%3E";

const filter = { key: "", status: "", page: 0, size: 9, view: "grid" };
let currentPage = 0;

// ===== Tiện ích =====
const $ = (id) => document.getElementById(id);
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const pad = (n) => String(n).padStart(2, "0");
const TODAY = new Date();
const TODAY_KEY = `${TODAY.getFullYear()}-${pad(TODAY.getMonth() + 1)}-${pad(TODAY.getDate())}`;
const fmtDate = (s) =>
  s ? s.slice(0, 10).split("-").reverse().join("/") : "—";
const daysBetween = (key) =>
  Math.round((new Date(key) - new Date(TODAY_KEY)) / 864e5);

const tasksOf = (p) => p.taskRes || [];
const progressOf = (p) => {
  const t = tasksOf(p);
  return t.length
    ? Math.round(t.reduce((s, x) => s + (x.progress || 0), 0) / t.length)
    : 0;
};
const isLate = (p) =>
  ["DANG_THUC_HIEN", "TAM_DUNG"].includes(p.status) &&
  p.dueDate &&
  p.dueDate.slice(0, 10) < TODAY_KEY;
const badge = (p) => {
  const s = isLate(p)
    ? { label: "Trễ hạn", badge: LATE_BADGE }
    : STATUS[p.status] || STATUS.DANG_THUC_HIEN;
  return `<span class="text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${s.badge}">${s.label}</span>`;
};
const people = (p) => {
  const map = new Map();
  [p.owner, ...(p.members || [])]
    .filter(Boolean)
    .forEach((u) => map.set(u.id, u));
  return [...map.values()];
};
const avatars = (p) => {
  const list = people(p);
  return `<div class="flex -space-x-2">
    ${list
      .slice(0, 3)
      .map(
        (u) =>
          `<img title="${esc(u.fullName)}" class="w-8 h-8 rounded-full border-2 border-white object-cover" src="${esc(u.avatar || DEFAULT_AVATAR)}" alt="">`,
      )
      .join("")}
    ${list.length > 3 ? `<div class="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-white flex items-center justify-center text-[10px] font-bold">+${list.length - 3}</div>` : ""}</div>`;
};
const actions = (
  p,
  cls,
) => `<div class="hidden items-center gap-2 absolute z-10 group-hover:flex ${cls}">
    <button data-id="${p.id}" title="Sửa" class="btn-update flex items-center rounded-lg border border-blue-500 bg-white/90 px-1.5 py-1 text-blue-500 transition hover:bg-blue-500 hover:text-white"><span class="material-symbols-outlined">edit</span></button>
    <button data-id="${p.id}" title="Xóa" class="btn-delete flex items-center rounded-lg border border-red-500 bg-white/90 px-1.5 py-1 text-red-500 transition hover:bg-red-500 hover:text-white"><span class="material-symbols-outlined">delete</span></button></div>`;
const progressBar = (pct) =>
  `<div class="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-primary to-secondary" style="width:${pct}%"></div></div>`;

// ===== Vẽ thẻ dự án =====
function cardGrid(p) {
  const t = tasksOf(p);
  const done = t.filter((x) => x.status === "HOAN_THANH").length;
  const pct = progressOf(p);
  return `<div class="relative group">
    ${actions(p, "top-2 right-2")}
    <a href="/projectdetail/${p.id}" class="project-card glass-card rounded-2xl overflow-hidden flex flex-col h-full">
      <div class="relative h-24 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 flex items-center justify-center">
        <span class="material-symbols-outlined text-6xl text-primary/30">folder_open</span>
        <div class="absolute top-4 left-4">${badge(p)}</div>
      </div>
      <div class="p-6 flex-1 flex flex-col">
        <h3 class="font-headline-md text-lg truncate mb-2">${esc(p.name)}</h3>
        <p class="text-body-sm text-on-surface-variant line-clamp-2 mb-6 min-h-[2.5rem]">${esc(p.description) || "Chưa có mô tả."}</p>
        <div class="mt-auto">
          <div class="flex justify-between text-xs mb-2"><span class="font-bold text-outline">Tiến độ · ${done}/${t.length} việc</span><span class="font-bold text-primary">${pct}%</span></div>
          <div class="mb-5">${progressBar(pct)}</div>
          <div class="flex items-center justify-between border-t border-glass-border pt-4">
            ${avatars(p)}
            <div class="flex items-center gap-1.5 text-xs ${isLate(p) ? "text-danger font-semibold" : "text-outline"}">
              <span class="material-symbols-outlined text-sm">calendar_month</span>${fmtDate(p.dueDate)}</div>
          </div>
        </div>
      </div>
    </a></div>`;
}

function cardList(p) {
  const t = tasksOf(p);
  const pct = progressOf(p);
  return `<div class="relative group">
    ${actions(p, "top-1/2 -translate-y-1/2 right-4")}
    <a href="/projectdetail/${p.id}" class="project-card glass-card rounded-2xl p-4 flex items-center gap-5">
      <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined">folder_open</span></div>
      <div class="flex-1 min-w-0"><h3 class="font-bold truncate">${esc(p.name)}</h3><p class="text-xs text-on-surface-variant truncate">${esc(p.description) || "Chưa có mô tả."}</p></div>
      <div class="hidden md:block w-40"><div class="flex justify-between text-[11px] mb-1"><span class="text-outline">${t.length} việc</span><span class="font-bold text-primary">${pct}%</span></div>${progressBar(pct)}</div>
      <div class="hidden lg:block">${avatars(p)}</div>
      <span class="hidden sm:block text-xs w-24 ${isLate(p) ? "text-danger font-semibold" : "text-outline"}">${fmtDate(p.dueDate)}</span>
      <div class="w-24 text-right pr-16 xl:pr-20">${badge(p)}</div>
    </a></div>`;
}

const addCard = `<div data-add class="border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-surface-container hover:border-primary transition-all group cursor-pointer min-h-[260px]">
  <div class="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 group-hover:bg-primary/10"><span class="material-symbols-outlined text-3xl text-outline group-hover:text-primary">add</span></div>
  <p class="font-headline-md text-lg text-outline group-hover:text-primary">Thêm dự án mới</p>
  <p class="text-body-sm text-outline-variant text-center mt-2">Bắt đầu một hành trình mới cùng đội ngũ của bạn.</p></div>`;

// ===== Tải danh sách (phân trang, lọc, tìm kiếm) =====
async function loadProjects(page = filter.page) {
  filter.page = currentPage = page;
  const q = new URLSearchParams({ page, size: filter.size });
  if (filter.key) q.set("key", filter.key);
  if (filter.status) q.set("status", filter.status);
  try {
    const res = await fetch(`/api/project/myproject?${q}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.content.length && data.number > 0)
      return loadProjects(data.number - 1); // trang cuối vừa bị xóa hết
    renderProjects(data);
  } catch (e) {
    console.error("Lỗi khi tải danh sách dự án:", e);
    $("projects").innerHTML =
      `<div class="col-span-full py-10 text-center"><p class="text-danger mb-3">Không tải được dự án: ${esc(e.message)}</p>
      <button data-retry class="px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container">Thử lại</button></div>`;
    $("pagination").innerHTML = "";
    $("range-text").textContent = "";
  }
}

function renderProjects(data) {
  const list = data.content;
  const grid = filter.view === "grid";
  $("projects").className = grid
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    : "flex flex-col gap-3";
  $("projects").innerHTML =
    (list.length
      ? list.map(grid ? cardGrid : cardList).join("")
      : `<p class="col-span-full py-8 text-center text-on-surface-variant">${filter.key || filter.status ? "Không có dự án nào khớp bộ lọc." : "Bạn chưa có dự án nào."}</p>`) +
    (grid ? addCard : "");
  const from = data.totalElements ? data.number * data.size + 1 : 0;
  $("range-text").innerHTML =
    `Hiển thị <b class="text-on-surface">${from}-${data.number * data.size + list.length}</b> trong số <b class="text-on-surface">${data.totalElements}</b> dự án`;
  renderPagination(data);
}

function renderPagination(data) {
  const total = data.totalPages;
  if (total <= 1) {
    $("pagination").innerHTML = "";
    return;
  }
  const cur = data.number;
  const start = Math.max(0, Math.min(cur - 2, total - 5));
  const end = Math.min(total, start + 5);
  const btn = (page, inner, extra = "", disabled = false) =>
    `<button data-page="${page}" ${disabled ? "disabled" : ""} class="w-10 h-10 flex items-center justify-center rounded-lg font-label-lg transition-colors hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none ${extra}">${inner}</button>`;
  let html = btn(
    cur - 1,
    `<span class="material-symbols-outlined">chevron_left</span>`,
    "text-outline",
    data.first,
  );
  for (let i = start; i < end; i++)
    html += btn(i, i + 1, i === cur ? "active-page" : "");
  html += btn(
    cur + 1,
    `<span class="material-symbols-outlined">chevron_right</span>`,
    "text-outline",
    data.last,
  );
  $("pagination").innerHTML = html;
}

// ===== Thống kê + sắp đến hạn + tiến độ trung bình (tải 1 lần, không phụ thuộc bộ lọc) =====
async function loadStats() {
  try {
    const res = await fetch("/api/project/myproject?size=200");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const all = data.content;
    $("stat-total").textContent = data.totalElements;
    $("stat-running").textContent = all.filter(
      (p) => p.status === "DANG_THUC_HIEN" && !isLate(p),
    ).length;
    $("stat-done").textContent = all.filter(
      (p) => p.status === "HOAN_THANH",
    ).length;
    $("stat-late").textContent = all.filter(isLate).length;

    const active = all.filter((p) =>
      ["DANG_THUC_HIEN", "TAM_DUNG"].includes(p.status),
    );
    const avg = active.length
      ? Math.round(
          active.reduce((s, p) => s + progressOf(p), 0) / active.length,
        )
      : 0;
    $("avg-progress").textContent = `${avg}%`;
    $("avg-bar").style.width = `${avg}%`;
    $("avg-note").textContent = active.length
      ? `Trung bình trên ${active.length} dự án chưa hoàn thành.`
      : "Không có dự án nào đang triển khai.";

    const soon = active
      .filter((p) => p.dueDate)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 4);
    $("upcoming").innerHTML = soon.length
      ? soon
          .map((p) => {
            const d = daysBetween(p.dueDate.slice(0, 10));
            const [label, cls] =
              d < 0
                ? [`Trễ ${-d} ngày`, "bg-danger/10 text-danger"]
                : d === 0
                  ? ["Hôm nay", "bg-warning/10 text-warning"]
                  : [`Còn ${d} ngày`, "bg-primary/10 text-primary"];
            return `<a href="/projectdetail/${p.id}" class="flex items-center gap-4 p-3 hover:bg-primary/5 rounded-xl transition-colors">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0">
              <span class="text-[10px] font-bold">T${+p.dueDate.slice(5, 7)}</span><span class="text-lg font-black leading-none">${p.dueDate.slice(8, 10)}</span></div>
            <div class="flex-1 min-w-0"><p class="font-label-lg truncate">${esc(p.name)}</p><p class="text-xs text-outline">Tiến độ ${progressOf(p)}%</p></div>
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${cls}">${label}</span></a>`;
          })
          .join("")
      : `<p class="text-sm text-on-surface-variant">Không có dự án nào sắp đến hạn.</p>`;
  } catch (e) {
    console.error("Lỗi khi tải thống kê:", e);
    $("upcoming").innerHTML =
      `<p class="text-sm text-danger">Không tải được thống kê.</p>`;
  }
}

const refresh = () => {
  loadStats();
  loadProjects(currentPage);
};
window.refreshProjects = refresh;

// ===== Xóa dự án =====
async function deleteProject(id) {
  if (!confirm("Bạn có chắc muốn xóa dự án này?")) return;
  try {
    const res = await fetch(`/api/project/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    refresh();
  } catch (e) {
    console.error(e);
    alert("Xóa dự án thất bại. Vui lòng thử lại.");
  }
}

// ===== Giao diện: tab trạng thái, chế độ xem =====
function markControls() {
  document.querySelectorAll("#status-tabs button").forEach((b) => {
    b.className = `px-5 py-2 rounded-lg font-label-lg transition-all ${b.dataset.status === filter.status ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:bg-white/50"}`;
  });
  document.querySelectorAll("[data-view]").forEach((b) => {
    b.className = `p-2 rounded-lg transition-colors ${b.dataset.view === filter.view ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:bg-white/50"}`;
  });
}

// ===== Khởi tạo =====
document.addEventListener("DOMContentLoaded", () => {
  markControls();

  $("status-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-status]");
    if (!b) return;
    filter.status = b.dataset.status;
    markControls();
    loadProjects(0);
  });
  document.querySelectorAll("[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      filter.view = b.dataset.view;
      markControls();
      loadProjects(currentPage);
    }),
  );
  $("page-size").addEventListener("change", (e) => {
    filter.size = +e.target.value;
    loadProjects(0);
  });
  $("pagination").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-page]");
    if (b && !b.disabled) loadProjects(+b.dataset.page);
  });

  // Nút sửa (.btn-update) do modal.js xử lý; ở đây chỉ xử lý xóa, thêm mới, thử lại
  $("projects").addEventListener("click", (e) => {
    const del = e.target.closest(".btn-delete");
    if (del) {
      e.preventDefault();
      deleteProject(del.dataset.id);
      return;
    }
    if (e.target.closest("[data-add]") && typeof openModal === "function")
      openModal();
    if (e.target.closest("[data-retry]")) refresh();
  });

  // Ô tìm kiếm nằm ở header chung (id="searchInput")
  window.liveSearch = true; // báo cho layout.js biết trang này tự xử lý tìm kiếm
  const search = $("searchInput");
  const initKey = new URLSearchParams(window.location.search).get("key"); // từ ô tìm kiếm ở trang khác
  if (initKey) {
    filter.key = initKey.trim();
    if (search) search.value = filter.key;
  }
  if (search) {
    let timer;
    search.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        filter.key = search.value.trim();
        loadProjects(0);
      }, 300);
    });
  }

  // Làm mới danh sách khi modal tạo/sửa dự án đóng lại (không cần sửa modal.js)
  const modal = $("modal");
  if (modal) {
    let wasHidden = modal.classList.contains("hidden");
    new MutationObserver(() => {
      const hidden = modal.classList.contains("hidden");
      if (hidden && !wasHidden) setTimeout(refresh, 300);
      wasHidden = hidden;
    }).observe(modal, { attributes: true, attributeFilter: ["class"] });
  }

  loadStats();
  loadProjects(0);
});
