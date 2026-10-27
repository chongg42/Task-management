// ===== Cấu hình =====
const PAGE_SIZE = 8;
const STATUS = {
  CAN_LAM: {
    label: "Cần làm",
    badge: "bg-gray-100 text-gray-700",
    col: "bg-gray-100",
  },
  DANG_LAM: {
    label: "Đang làm",
    badge: "bg-amber-50 text-amber-700",
    col: "bg-amber-50",
  },
  DANG_KIEM_TRA: {
    label: "Đang kiểm tra",
    badge: "bg-blue-50 text-blue-700",
    col: "bg-blue-50",
  },
  HOAN_THANH: {
    label: "Hoàn thành",
    badge: "bg-emerald-50 text-emerald-700",
    col: "bg-emerald-50",
  },
  QUA_HAN: {
    label: "Quá hạn",
    badge: "bg-rose-50 text-rose-700",
    col: "bg-rose-50",
  },
};
const PROJECT_STATUS = {
  DANG_THUC_HIEN: "Đang thực hiện",
  TAM_DUNG: "Tạm dừng",
  HOAN_THANH: "Hoàn thành",
  DA_HUY: "Đã hủy",
};
const DEFAULT_AVATAR = "/images/default-avatar.png";

let state = { project: null, members: new Map(), page: 0, key: "", status: "" };

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
const projectId = () =>
  window.location.pathname.split("/").filter(Boolean).pop();
const fmtDate = (s) => (s ? new Date(s).toLocaleDateString("vi-VN") : "—");
const avatar = (u) => esc(u?.avatar || DEFAULT_AVATAR);
const statusBadge = (s) => {
  const st = STATUS[s] || {
    label: s || "—",
    badge: "bg-gray-100 text-gray-700",
  };
  return `<span class="px-2 py-0.5 rounded text-xs font-semibold ${st.badge}">${st.label}</span>`;
};
function timeAgo(s) {
  if (!s) return "";
  const sec = Math.max(0, (Date.now() - new Date(s).getTime()) / 1000);
  if (sec < 60) return "Vừa xong";
  if (sec < 3600) return `${Math.floor(sec / 60)} phút trước`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} giờ trước`;
  if (sec < 86400 * 30) return `${Math.floor(sec / 86400)} ngày trước`;
  return fmtDate(s);
}
const fmtSize = (kb) =>
  kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb ?? 0} KB`;
const empty = (icon, text) =>
  `<div class="p-10 text-center text-gray-400 border border-dashed rounded-2xl bg-white">
     <span class="material-symbols-outlined text-4xl">${icon}</span><p class="mt-2 text-sm">${text}</p></div>`;
const avatarStack = (ids) => {
  const users = (ids || []).map((i) => state.members.get(i)).filter(Boolean);
  if (!users.length) return `<span class="text-gray-400">Chưa giao</span>`;
  return `<div class="flex items-center gap-2">
    <div class="flex -space-x-2">${users
      .slice(0, 3)
      .map(
        (u) =>
          `<img title="${esc(u.fullName)}" class="w-6 h-6 rounded-full border-2 border-white object-cover" src="${avatar(u)}" alt="">`,
      )
      .join("")}</div>
    <span class="truncate max-w-[120px]">${esc(users[0].fullName)}${users.length > 1 ? ` +${users.length - 1}` : ""}</span></div>`;
};

// ===== Tải dữ liệu =====
async function getProject() {
  const id = projectId();
  try {
    const [pRes, aRes] = await Promise.all([
      fetch(`/api/project/${id}`),
      fetch(`/api/activity?id=${id}`),
    ]);
    if (!pRes.ok) throw new Error(`Không tải được dự án (HTTP ${pRes.status})`);
    const project = await pRes.json();
    const activity = aRes.ok ? await aRes.json() : [];

    project.taskRes = project.taskRes || [];
    project.attachments = project.attachments || [];
    project.members = project.members || [];
    state.project = project;
    [project.owner, ...project.members]
      .filter(Boolean)
      .forEach((u) => state.members.set(u.id, u));

    renderHeader(project);
    renderOverview(project, activity);
    renderBoard(project.taskRes);
    renderFiles(project.attachments);
    renderMembers(project);
    renderActivity(activity);
    $("count-tasks").textContent = `(${project.taskRes.length})`;
    $("count-files").textContent = `(${project.attachments.length})`;
    $("count-members").textContent = `(${state.members.size})`;
    loadTasks();
  } catch (e) {
    console.error(e);
    $("project-header").innerHTML = empty("error", esc(e.message));
  }
}

const avgProgress = (tasks) =>
  tasks.length
    ? Math.round(
        tasks.reduce((s, t) => s + (t.progress || 0), 0) / tasks.length,
      )
    : 0;
const countBy = (tasks, s) => tasks.filter((t) => t.status === s).length;

// ===== Đầu trang =====
function renderHeader(p) {
  const progress = avgProgress(p.taskRes);
  const people = [...state.members.values()];
  $("project-header").innerHTML = `
    <div class="flex items-center gap-3 mb-2 text-xs text-on-surface-variant">
      <span class="px-2 py-0.5 bg-primary/10 text-primary font-bold rounded">Dự án #${p.id}</span>
      <span>${PROJECT_STATUS[p.status] || ""}</span>
      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">event</span>
        ${fmtDate(p.startDate)} – ${fmtDate(p.dueDate)}</span>
    </div>
    <h2 class="text-3xl font-bold mb-2">${esc(p.name)}</h2>
    <p class="text-on-surface-variant max-w-2xl mb-4">${esc(p.description) || "Chưa có mô tả."}</p>
    <div class="flex items-center gap-6">
      <div class="flex -space-x-3">
        ${people
          .slice(0, 4)
          .map(
            (u) =>
              `<img title="${esc(u.fullName)}" class="w-8 h-8 rounded-full border-2 border-white object-cover" src="${avatar(u)}" alt="">`,
          )
          .join("")}
        ${people.length > 4 ? `<div class="w-8 h-8 rounded-full border-2 border-white bg-primary-container text-white flex items-center justify-center text-[10px] font-bold">+${people.length - 4}</div>` : ""}
      </div>
      <div class="w-56">
        <div class="flex justify-between text-xs mb-1"><span class="font-semibold">Tiến độ tổng thể</span><span class="font-bold text-primary">${progress}%</span></div>
        <div class="h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-primary to-success rounded-full" style="width:${progress}%"></div>
        </div>
      </div>
    </div>`;
}

// ===== Tổng quan =====
function statCard(icon, color, label, value) {
  return `<div class="col-span-6 md:col-span-3 glass-card p-5 rounded-2xl">
    <div class="w-10 h-10 rounded-xl bg-${color}/10 text-${color} flex items-center justify-center mb-4">
      <span class="material-symbols-outlined">${icon}</span></div>
    <p class="text-sm text-on-surface-variant">${label}</p>
    <h3 class="text-3xl font-bold">${value}</h3></div>`;
}

function renderOverview(p, activity) {
  const t = p.taskRes;
  const progress = avgProgress(t);
  const C = 2 * Math.PI * 70;
  const legend = [
    "HOAN_THANH",
    "DANG_LAM",
    "DANG_KIEM_TRA",
    "CAN_LAM",
    "QUA_HAN",
  ]
    .map(
      (s) =>
        `<div class="flex justify-between text-sm"><span class="text-on-surface-variant">${STATUS[s].label}</span><span class="font-bold">${countBy(t, s)}</span></div>`,
    )
    .join("");
  $("content-overview").innerHTML = `
    ${statCard("assignment", "primary", "Tổng công việc", t.length)}
    ${statCard("check_circle", "success", "Hoàn thành", countBy(t, "HOAN_THANH"))}
    ${statCard("schedule", "warning", "Đang thực hiện", countBy(t, "DANG_LAM") + countBy(t, "DANG_KIEM_TRA"))}
    ${statCard("error", "error", "Quá hạn", countBy(t, "QUA_HAN"))}

    <div class="col-span-12 lg:col-span-8 glass-card p-6 rounded-2xl">
      <h3 class="text-lg font-bold mb-4">Hoạt động gần đây</h3>
      <div class="space-y-5">${activityItems(activity.slice(0, 6))}</div>
    </div>

    <div class="col-span-12 lg:col-span-4 space-y-6">
      <div class="glass-card p-6 rounded-2xl">
        <h3 class="text-sm font-semibold text-on-surface-variant mb-4">Hiệu suất dự án</h3>
        <div class="relative w-40 h-40 mx-auto">
          <svg viewBox="0 0 160 160" class="w-full h-full -rotate-90">
            <circle cx="80" cy="80" r="70" fill="none" stroke="#e7e8e9" stroke-width="12"></circle>
            <circle cx="80" cy="80" r="70" fill="none" stroke="#3525cd" stroke-width="12" stroke-linecap="round"
              stroke-dasharray="${C}" stroke-dashoffset="${C - (progress / 100) * C}"></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl font-black">${progress}%</span>
            <span class="text-xs text-on-surface-variant">hoàn thành</span>
          </div>
        </div>
        <div class="mt-6 space-y-2">${legend}</div>
      </div>
      <div class="glass-card p-6 rounded-2xl">
        <h3 class="text-sm font-semibold text-on-surface-variant mb-3">Tài liệu mới nhất</h3>
        <div class="space-y-2">${fileRows(p.attachments.slice(0, 4)) || `<p class="text-sm text-gray-400">Chưa có tài liệu.</p>`}</div>
      </div>
    </div>`;
}

// ===== Công việc (phân trang + lọc qua API) =====
async function loadTasks() {
  const q = new URLSearchParams({ page: state.page, size: PAGE_SIZE });
  if (state.key) q.set("key", state.key);
  if (state.status) q.set("status", state.status);
  try {
    const res = await fetch(`/api/tasks/project/${projectId()}?${q}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    renderTaskTable(await res.json());
  } catch (e) {
    $("table-task").innerHTML =
      `<tr><td colspan="5" class="p-6 text-center text-rose-600">Không tải được công việc: ${esc(e.message)}</td></tr>`;
  }
}

function renderTaskTable(page) {
  const rows = page.content || [];
  $("table-task").innerHTML = rows.length
    ? rows
        .map(
          (t) => `<tr class="hover:bg-gray-50">
        <td class="py-3.5 px-6 font-medium text-gray-900">${esc(t.title)}</td>
        <td class="py-3.5 px-6">${avatarStack(t.assigneeIds)}</td>
        <td class="py-3.5 px-6 whitespace-nowrap">${fmtDate(t.dueDate)}</td>
        <td class="py-3.5 px-6">${statusBadge(t.status)}</td>
        <td class="py-3.5 px-6"><div class="flex items-center gap-2">
          <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-primary" style="width:${t.progress || 0}%"></div></div>
          <span class="text-xs w-8 text-right">${t.progress || 0}%</span></div></td></tr>`,
        )
        .join("")
    : `<tr><td colspan="5" class="p-10 text-center text-gray-400">Không có công việc nào phù hợp.</td></tr>`;

  const total = page.totalPages || 0;
  $("task-pager").innerHTML = `
    <span>${page.totalElements ?? 0} công việc${total > 1 ? ` · Trang ${page.number + 1}/${total}` : ""}</span>
    <div class="flex gap-2">
      <button id="pg-prev" ${page.number <= 0 ? "disabled" : ""} class="px-3 py-1.5 border rounded-lg disabled:opacity-40">Trước</button>
      <button id="pg-next" ${page.number + 1 >= total ? "disabled" : ""} class="px-3 py-1.5 border rounded-lg disabled:opacity-40">Sau</button>
    </div>`;
  $("pg-prev").onclick = () => {
    state.page--;
    loadTasks();
  };
  $("pg-next").onclick = () => {
    state.page++;
    loadTasks();
  };
}

// ===== Kanban =====
function renderBoard(tasks) {
  const cols = Object.keys(STATUS).map((s) => {
    const items = tasks.filter((t) => t.status === s);
    return `<div class="${STATUS[s].col} p-4 rounded-xl min-h-[320px]">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-bold text-sm text-gray-700">${STATUS[s].label}</h4>
        <span class="bg-white/70 text-xs font-bold px-2 py-0.5 rounded-full">${items.length}</span></div>
      <div class="space-y-3">${items
        .map(
          (t) => `
        <div class="bg-white p-3.5 rounded-lg shadow-sm border border-gray-100" data-id="${esc(t.id)}"
                data-status="${esc(t.status)}">
          <h5 class="font-semibold text-sm text-gray-900 mb-2">${esc(t.title)}</h5>
          <div class="h-1 bg-gray-100 rounded-full overflow-hidden mb-3"><div class="h-full bg-primary" style="width:${t.progress || 0}%"></div></div>
          <div class="flex justify-between items-center text-xs text-gray-500">
            <span>${fmtDate(t.dueDate)}</span>${avatarStack(t.assigneeIds)}</div></div>`,
        )
        .join("")}</div></div>`;
  });
  $("content-board").innerHTML = tasks.length
    ? `<div class="grid grid-flow-col auto-cols-[270px] gap-4 overflow-x-auto pb-2">${cols.join("")}</div>`
    : empty("view_kanban", "Dự án chưa có công việc nào.");
}

// ===== Tài liệu =====
function fileRows(files) {
  return files
    .map(
      (
        f,
      ) => `<div class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60">
    <div class="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined">description</span></div>
    <div class="min-w-0"><p class="text-sm font-semibold truncate">${esc(f.originalFileName)}</p>
      <p class="text-[11px] text-on-surface-variant">${fmtSize(f.fileSize)} · ${timeAgo(f.uploadAt)}</p></div></div>`,
    )
    .join("");
}
function renderFiles(files) {
  $("content-files").innerHTML = files.length
    ? `<div class="glass-card p-4 rounded-2xl grid md:grid-cols-2 gap-1">${fileRows(files)}</div>`
    : empty("folder_open", "Dự án chưa có tài liệu nào.");
}

// ===== Thành viên =====
function renderMembers(p) {
  const list = [...state.members.values()];
  $("content-members").innerHTML = list.length
    ? `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${list
        .map(
          (u) => `
        <div class="glass-card p-4 rounded-2xl flex items-center gap-3">
          <img class="w-12 h-12 rounded-full object-cover" src="${avatar(u)}" alt="">
          <div class="min-w-0"><p class="font-semibold truncate">${esc(u.fullName)}</p>
            <p class="text-xs text-on-surface-variant truncate">${esc(u.email)}</p>
            ${p.owner?.id === u.id ? `<span class="text-[11px] font-semibold text-primary">Chủ dự án</span>` : ""}</div></div>`,
        )
        .join("")}</div>`
    : empty("group", "Chưa có thành viên nào.");
}

// ===== Hoạt động =====
function activityItems(list) {
  if (!list.length)
    return `<p class="text-sm text-gray-400">Chưa có hoạt động nào.</p>`;
  return list
    .map((a) => {
      const m = a.metadata || {};
      const target = m.taskTitle || m.fileName || "";
      const icon =
        a.resource === "TASK"
          ? "task_alt"
          : a.resource === "FILE"
            ? "attachment"
            : "folder";
      return `<div class="flex gap-3">
      <img class="w-9 h-9 rounded-full object-cover shrink-0" src="${avatar(a.user)}" alt="">
      <div class="min-w-0"><p class="text-sm"><span class="font-bold">${esc(a.user?.fullName || "Hệ thống")}</span>
        ${esc((a.description || "").toLowerCase())}
        ${target ? `<span class="inline-flex items-center gap-1 text-primary font-semibold"><span class="material-symbols-outlined text-[14px]">${icon}</span>${esc(target)}</span>` : ""}</p>
        <p class="text-[12px] text-on-surface-variant mt-0.5">${timeAgo(a.createdAt)}</p></div></div>`;
    })
    .join("");
}
function renderActivity(list) {
  $("content-activity").innerHTML =
    `<div class="glass-card p-6 rounded-2xl space-y-5">${activityItems(list)}</div>`;
}

// ===== Sự kiện =====
function switchTab(name) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  $(`content-${name}`).classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  $("tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab-btn");
    if (b) switchTab(b.dataset.tab);
  });
  let timer;
  $("task-search").addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.key = e.target.value.trim();
      state.page = 0;
      loadTasks();
    }, 300);
  });
  $("task-status").addEventListener("change", (e) => {
    state.status = e.target.value;
    state.page = 0;
    loadTasks();
  });
  getProject();
});
