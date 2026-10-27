// ===== Cấu hình =====
const PAGE_SIZE = 5;
const STATUS = {
  CAN_LAM:       { label: "Cần làm",       badge: "bg-surface-container text-on-surface-variant", dot: "bg-outline" },
  DANG_LAM:      { label: "Đang làm",      badge: "bg-warning/10 text-warning",                   dot: "bg-warning" },
  DANG_KIEM_TRA: { label: "Đang kiểm tra", badge: "bg-secondary/10 text-secondary",               dot: "bg-secondary" },
  QUA_HAN:       { label: "Quá hạn",       badge: "bg-danger/10 text-danger",                     dot: "bg-danger" },
  HOAN_THANH:    { label: "Hoàn thành",    badge: "bg-success/10 text-success",                   dot: "bg-success" },
};
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e0e0ff'/%3E%3Ccircle cx='20' cy='15' r='7' fill='%23a5a8d6'/%3E%3Cpath d='M6 38c0-8 6-13 14-13s14 5 14 13z' fill='%23a5a8d6'/%3E%3C/svg%3E";

// ===== Tiện ích =====
const $ = (id) => document.getElementById(id);
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (k) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
const TODAY = new Date();
const TODAY_KEY = ymd(TODAY);

const dayOf = (t) => t.dueDate.slice(0, 10);
const fmtDue = (t) => {
  if (!t.dueDate) return "Chưa đặt hạn";
  const [y, m, d] = dayOf(t).split("-");
  const h = t.dueDate.slice(11, 16);
  return `${d}/${m}/${y}${h && h !== "00:00" ? " " + h : ""}`;
};
const isOverdue = (t) =>
  t.status !== "HOAN_THANH" && (t.status === "QUA_HAN" || (t.dueDate && dayOf(t) < TODAY_KEY));
const effStatus = (t) => (isOverdue(t) ? "QUA_HAN" : t.status);
const badge = (t) => {
  const s = STATUS[effStatus(t)] || STATUS.CAN_LAM;
  return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.badge}">${s.label}</span>`;
};

const state = { all: [], page: 0, status: "", key: "", mini: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1) };
const users = new Map(); // cache người dùng theo id

// ===== Tải dữ liệu tổng hợp (lời chào, thống kê, tiến độ, lịch nhỏ) =====
async function loadSummary() {
  const [profile, tasks] = await Promise.allSettled([
    fetch("/api/user/profile").then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
    fetch("/api/tasks/kaban").then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
  ]);
  const name = profile.status === "fulfilled" ? profile.value.fullName : "";
  if (tasks.status === "fulfilled") state.all = Object.values(tasks.value).flat();
  else console.error("Không tải được thống kê:", tasks.reason);

  renderGreeting(name, tasks.status === "fulfilled");
  if (tasks.status === "fulfilled") {
    renderStats();
    renderRing();
    renderMini();
    renderUpcoming();
  } else {
    $("stat-total-sub").textContent = "Không tải được dữ liệu";
  }
}

function renderGreeting(name, ok) {
  const h = TODAY.getHours();
  const hello = h < 12 ? "Chào buổi sáng" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  $("greeting-title").textContent = `${hello}${name ? ", " + name : ""}! 👋`;
  if (!ok) { $("greeting-sub").textContent = "Chưa tải được công việc của bạn. Hãy thử tải lại trang."; return; }
  const active = state.all.filter((t) => t.status !== "HOAN_THANH");
  const today = active.filter((t) => t.dueDate && dayOf(t) === TODAY_KEY).length;
  const late = active.filter(isOverdue).length;
  $("greeting-sub").textContent =
    !today && !late ? "Hôm nay bạn không có công việc nào đến hạn. Hãy xem trước các việc sắp tới."
    : `Hôm nay có ${today} công việc đến hạn${late ? ` và ${late} việc đã quá hạn` : ""}.`;
}

function renderStats() {
  const t = state.all;
  const done = t.filter((x) => x.status === "HOAN_THANH");
  const weekAgo = Date.now() - 7 * 864e5;
  const doneWeek = done.filter((x) => x.updateAt && new Date(x.updateAt).getTime() >= weekAgo).length;
  const doing = t.filter((x) => ["DANG_LAM", "DANG_KIEM_TRA"].includes(effStatus(x))).length;
  const todo = t.filter((x) => effStatus(x) === "CAN_LAM").length;
  const late = t.filter(isOverdue).length;
  $("stat-total").textContent = t.length;
  $("stat-total-sub").textContent = `${t.length - done.length} việc chưa hoàn thành`;
  $("stat-done").textContent = done.length;
  $("stat-done-sub").textContent = doneWeek ? `${doneWeek} việc trong 7 ngày qua` : "";
  $("stat-doing").textContent = doing;
  $("stat-doing-sub").textContent = todo ? `${todo} việc đang chờ bắt đầu` : "";
  $("stat-late").textContent = late;
  $("stat-late-sub").textContent = late ? "Cần xử lý sớm" : "";
}

function renderRing() {
  const t = state.all;
  const total = t.length;
  const done = t.filter((x) => x.status === "HOAN_THANH").length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const C = 339.3;
  $("ring").setAttribute("stroke-dashoffset", C * (1 - pct / 100));
  $("ring-pct").textContent = `${pct}%`;
  const row = (dot, label, n) =>
    `<div class="flex items-center justify-between text-xs"><div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full ${dot}"></span><span>${label}</span></div><span class="font-bold">${n}</span></div>`;
  const count = (k) => t.filter((x) => effStatus(x) === k).length;
  $("legend").innerHTML = ["HOAN_THANH", "DANG_LAM", "DANG_KIEM_TRA", "CAN_LAM", "QUA_HAN"]
    .map((k) => row(STATUS[k].dot, STATUS[k].label, count(k))).join("");
  $("legend-total").innerHTML = `Tổng cộng <span class="font-bold">${total}</span> công việc`;
}

// ===== Lịch nhỏ + deadline sắp tới =====
function renderMini() {
  const c = state.mini;
  const y = c.getFullYear(), m = c.getMonth();
  const byDay = {};
  state.all.filter((t) => t.dueDate && t.status !== "HOAN_THANH").forEach((t) => (byDay[dayOf(t)] ||= []).push(t));
  $("mini-title").textContent = `Tháng ${m + 1}, ${y}`;
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;
  let html = "<span></span>".repeat(lead);
  for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
    const key = ymd(new Date(y, m, d));
    const items = byDay[key] || [];
    const isToday = key === TODAY_KEY;
    const dot = items.length ? `<i class="absolute bottom-0.5 w-1 h-1 rounded-full ${isToday ? "bg-white" : items.some(isOverdue) ? "bg-danger" : "bg-primary"}"></i>` : "";
    html += `<span title="${items.length ? items.length + " việc đến hạn" : ""}" class="relative h-7 w-7 mx-auto flex items-center justify-center text-[11px] font-medium rounded-lg ${isToday ? "bg-primary text-white font-bold" : ""}">${d}${dot}</span>`;
  }
  $("mini-grid").innerHTML = html;
}

function renderUpcoming() {
  const items = state.all
    .filter((t) => t.dueDate && t.status !== "HOAN_THANH" && dayOf(t) >= TODAY_KEY)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);
  $("upcoming").innerHTML = items.length
    ? items.map((t) => {
        const diff = Math.round((fromKey(dayOf(t)) - fromKey(TODAY_KEY)) / 864e5);
        const label = diff === 0 ? "Hôm nay" : diff === 1 ? "Ngày mai" : `${diff} ngày nữa`;
        return `<a href="/projectdetail/${t.projectId}" class="flex items-center justify-between gap-2 py-1.5 group">
          <span class="text-xs font-medium truncate group-hover:text-primary">${esc(t.title)}</span>
          <span class="text-[10px] font-bold text-on-surface-variant whitespace-nowrap">${label}</span></a>`;
      }).join("")
    : `<p class="text-xs text-on-surface-variant">Không có deadline sắp tới.</p>`;
}

// ===== Danh sách "Công việc của tôi" (phân trang, lọc, tìm kiếm qua API) =====
async function loadTasks() {
  const q = new URLSearchParams({ page: state.page, size: PAGE_SIZE });
  if (state.key) q.set("key", state.key);
  if (state.status && state.status !== "QUA_HAN") q.set("status", state.status);
  try {
    const res = await fetch(`/api/user/task/mytask?${q}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const page = await res.json();
    await loadUsers((page.content || []).flatMap((t) => t.assigneeIds || []));
    renderList(page);
  } catch (e) {
    console.error(e);
    $("listCongViecs").innerHTML = `<p class="py-6 text-center text-sm text-danger">Không tải được công việc: ${esc(e.message)}</p>`;
    $("task-pager").innerHTML = "";
  }
}

async function loadUsers(ids) {
  const missing = [...new Set(ids)].filter((id) => !users.has(id));
  if (!missing.length) return;
  try {
    const res = await fetch(`/api/user?ids=${missing.join(",")}`);
    if (res.ok) (await res.json()).forEach((u) => users.set(u.id, u));
  } catch (e) {
    console.warn("Không tải được thông tin người thực hiện", e);
  }
}

const avatars = (ids) => {
  const list = (ids || []).map((i) => users.get(i)).filter(Boolean);
  if (!list.length) return "";
  return `<div class="flex -space-x-2">${list.slice(0, 3).map((u) =>
    `<img title="${esc(u.fullName)}" class="w-8 h-8 rounded-full border-2 border-white object-cover" src="${esc(u.avatar || DEFAULT_AVATAR)}" alt="">`).join("")}
    ${list.length > 3 ? `<span class="w-8 h-8 rounded-full border-2 border-white bg-surface-container text-[10px] font-bold flex items-center justify-center">+${list.length - 3}</span>` : ""}</div>`;
};

function renderList(page) {
  let rows = page.content || [];
  if (state.status === "QUA_HAN") rows = rows.filter(isOverdue); // "Quá hạn" gồm cả việc trễ hạn theo ngày
  $("listCongViecs").innerHTML = rows.length
    ? rows.map((t) => {
        const done = t.status === "HOAN_THANH";
        return `<a href="/projectdetail/${t.projectId}" class="flex items-center gap-4 p-4 border border-glass-border rounded-2xl hover:bg-surface-container-low transition-colors group">
          <div class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${done ? "bg-success text-white" : "border-2 border-outline-variant"}">
            ${done ? `<span class="material-symbols-outlined text-[16px]">check</span>` : ""}</div>
          <div class="flex-1 min-w-0">
            <h4 class="font-label-lg text-label-lg truncate group-hover:text-primary transition-colors ${done ? "line-through text-on-surface-variant" : ""}">${esc(t.title)}</h4>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs text-on-surface-variant flex items-center gap-1 min-w-0"><span class="material-symbols-outlined text-[14px]">folder</span><span class="truncate">${esc(t.projectName)}</span></span>
              ${badge(t)}
            </div>
          </div>
          <div class="hidden sm:flex items-center gap-6 shrink-0">
            <span class="text-xs ${isOverdue(t) ? "text-danger font-semibold" : "text-on-surface-variant"}">${fmtDue(t)}</span>
            ${avatars(t.assigneeIds)}
            <span class="text-xs font-semibold w-9 text-right">${t.progress || 0}%</span>
          </div>
        </a>`;
      }).join("")
    : `<p class="py-8 text-center text-sm text-on-surface-variant">${state.key ? "Không tìm thấy công việc nào khớp từ khóa." : "Không có công việc nào."}</p>`;

  const total = page.totalPages || 0;
  $("task-pager").innerHTML = total > 1
    ? `<span>Trang ${page.number + 1}/${total} · ${page.totalElements} công việc</span>
       <div class="flex gap-2">
         <button id="pg-prev" ${page.number <= 0 ? "disabled" : ""} class="px-3 py-1.5 border border-glass-border rounded-lg disabled:opacity-40 hover:bg-surface-container">Trước</button>
         <button id="pg-next" ${page.number + 1 >= total ? "disabled" : ""} class="px-3 py-1.5 border border-glass-border rounded-lg disabled:opacity-40 hover:bg-surface-container">Sau</button>
       </div>`
    : `<span>${page.totalElements ?? rows.length} công việc</span>`;
  const prev = $("pg-prev"), next = $("pg-next");
  if (prev) prev.onclick = () => { state.page--; loadTasks(); };
  if (next) next.onclick = () => { state.page++; loadTasks(); };
}

function markTab() {
  document.querySelectorAll("#task-tabs button").forEach((b) => {
    const on = b.dataset.status === state.status;
    b.className = `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${on ? "bg-primary/5 text-primary" : "text-on-surface-variant hover:bg-surface-container"}`;
  });
}

// ===== Khởi tạo =====
document.addEventListener("DOMContentLoaded", () => {
  markTab();
  $("task-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-status]");
    if (!b) return;
    state.status = b.dataset.status;
    state.page = 0;
    markTab();
    loadTasks();
  });
  document.addEventListener("click", (e) => {
    const m = e.target.closest("[data-mini]");
    if (!m) return;
    state.mini = new Date(state.mini.getFullYear(), state.mini.getMonth() + (m.dataset.mini === "next" ? 1 : -1), 1);
    renderMini();
  });
  // Ô tìm kiếm nằm ở header chung (id="searchInput")
  window.liveSearch = true; // báo cho layout.js biết trang này tự xử lý tìm kiếm
  const search = $("searchInput");
  if (search) {
    let timer;
    search.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => { state.key = search.value.trim(); state.page = 0; loadTasks(); }, 300);
    });
  }
  loadSummary();
  loadTasks();
});