// ===== Cấu hình =====
const STATUS = {
  CAN_LAM: {
    label: "Cần làm",
    chip: "bg-surface-container text-on-surface-variant border-outline",
    dot: "bg-outline",
  },
  DANG_LAM: {
    label: "Đang làm",
    chip: "bg-warning/10 text-warning border-warning",
    dot: "bg-warning",
  },
  DANG_KIEM_TRA: {
    label: "Đang kiểm tra",
    chip: "bg-secondary/10 text-secondary border-secondary",
    dot: "bg-secondary",
  },
  QUA_HAN: {
    label: "Quá hạn",
    chip: "bg-danger/10 text-danger border-danger",
    dot: "bg-danger",
  },
  HOAN_THANH: {
    label: "Hoàn thành",
    chip: "bg-success/10 text-success border-success",
    dot: "bg-success",
  },
};
const WEEKDAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];
const HEAD = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CHỦ NHẬT"];

// ===== Tiện ích ngày giờ =====
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
const ymd = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (k) =>
  new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
const addDays = (d, n) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7));
const fmt = (d) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const fmtShort = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;

const TODAY = new Date();
const TODAY_KEY = ymd(TODAY);

const state = {
  tasks: [],
  view: "month",
  cur: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()),
  sel: TODAY_KEY,
  hiddenProj: new Set(),
  hiddenStatus: new Set(),
};

// ===== Dữ liệu công việc =====
const dayOf = (t) => t.dueDate.slice(0, 10);
const timeOf = (t) => {
  const h = t.dueDate.slice(11, 16);
  return h && h !== "00:00" ? h : "";
};
const isOverdue = (t) =>
  t.status !== "HOAN_THANH" && (t.status === "QUA_HAN" || dayOf(t) < TODAY_KEY);
const effStatus = (t) => (isOverdue(t) ? "QUA_HAN" : t.status);
const withDue = () => state.tasks.filter((t) => t.dueDate);
const visible = () =>
  withDue().filter(
    (t) =>
      !state.hiddenProj.has(t.projectId) &&
      !state.hiddenStatus.has(effStatus(t)),
  );
const groupByDay = (list) => {
  const map = {};
  list.forEach((t) => (map[dayOf(t)] ||= []).push(t));
  Object.values(map).forEach((a) =>
    a.sort((x, y) => x.dueDate.localeCompare(y.dueDate)),
  );
  return map;
};

// ===== Thành phần giao diện nhỏ =====
const badge = (t) => {
  const s = STATUS[effStatus(t)] || STATUS.CAN_LAM;
  return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.chip.split(" ").slice(0, 2).join(" ")}">${s.label}</span>`;
};
const chip = (t) => {
  const s = STATUS[effStatus(t)] || STATUS.CAN_LAM;
  return `<a href="/projectdetail/${t.projectId}" title="${esc(t.title)} · ${esc(t.projectName)}"
    class="block truncate text-[11px] font-semibold px-1.5 py-1 mb-1 rounded border-l-2 hover:opacity-80 ${s.chip}">${timeOf(t) ? timeOf(t) + " " : ""}${esc(t.title)}</a>`;
};
const emptyMsg = (text) =>
  `<p class="text-sm text-on-surface-variant py-2">${text}</p>`;

// ===== Phạm vi hiển thị =====
function range() {
  const c = state.cur;
  if (state.view === "month")
    return [
      new Date(c.getFullYear(), c.getMonth(), 1),
      new Date(c.getFullYear(), c.getMonth() + 1, 0),
    ];
  if (state.view === "week") {
    const m = mondayOf(c);
    return [m, addDays(m, 6)];
  }
  return [c, c];
}

function renderTitle(list) {
  const c = state.cur;
  const [from, to] = range();
  $("cal-title").textContent =
    state.view === "month"
      ? `Tháng ${c.getMonth() + 1}, ${c.getFullYear()}`
      : state.view === "week"
        ? `${fmtShort(from)} – ${fmt(to)}`
        : `${WEEKDAYS[c.getDay()]}, ${fmt(c)}`;
  const n = list.filter(
    (t) => dayOf(t) >= ymd(from) && dayOf(t) <= ymd(to),
  ).length;
  $("cal-sub").textContent =
    `Hôm nay là ${WEEKDAYS[TODAY.getDay()].toLowerCase()}, ${fmt(TODAY)} • ${n} công việc đến hạn trong khoảng này`;
}

// ===== Lịch chính =====
const dayNum = (d, inMonth) => {
  const key = ymd(d);
  const cls =
    key === TODAY_KEY
      ? "bg-primary text-white"
      : !inMonth
        ? "text-outline"
        : d.getDay() === 0
          ? "text-secondary"
          : "";
  return `<span class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${cls}">${d.getDate()}</span>`;
};

function renderMonth(map) {
  const c = state.cur;
  const first = new Date(c.getFullYear(), c.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7;
  const weeks = Math.ceil(
    (lead + new Date(c.getFullYear(), c.getMonth() + 1, 0).getDate()) / 7,
  );
  let cells = "";
  for (let i = 0; i < weeks * 7; i++) {
    const d = addDays(first, i - lead);
    const key = ymd(d);
    const items = map[key] || [];
    const inMonth = d.getMonth() === c.getMonth();
    cells += `<div data-day="${key}" class="min-h-[7.5rem] p-2 border-r border-b border-glass-border cursor-pointer ${inMonth ? "" : "bg-surface-container-low/60"} ${key === state.sel ? "ring-2 ring-primary ring-inset bg-primary/5" : "hover:bg-surface-container-low"}">
      <div class="mb-1">${dayNum(d, inMonth)}</div>
      ${items.slice(0, 3).map(chip).join("")}
      ${items.length > 3 ? `<div class="text-[11px] text-on-surface-variant px-1">+${items.length - 3} việc khác</div>` : ""}
    </div>`;
  }
  return `<div class="calendar-grid bg-surface-container-low border-b border-glass-border">
      ${HEAD.map((h, i) => `<div class="py-3 text-center text-xs font-semibold ${i === 6 ? "text-secondary" : "text-on-surface-variant"}">${h}</div>`).join("")}
    </div><div class="calendar-grid">${cells}</div>`;
}

function renderWeek(map) {
  const m = mondayOf(state.cur);
  let cols = "";
  for (let i = 0; i < 7; i++) {
    const d = addDays(m, i);
    const key = ymd(d);
    cols += `<div data-day="${key}" class="min-h-[22rem] p-2 border-r border-glass-border cursor-pointer ${key === state.sel ? "bg-primary/5" : "hover:bg-surface-container-low"}">
      <div class="flex items-center gap-2 mb-3"><span class="text-xs font-semibold text-on-surface-variant">${HEAD[i].replace("THỨ ", "T").replace("CHỦ NHẬT", "CN")}</span>${dayNum(d, true)}</div>
      ${(map[key] || []).map(chip).join("") || `<p class="text-[11px] text-outline">Trống</p>`}
    </div>`;
  }
  return `<div class="calendar-grid">${cols}</div>`;
}

function renderDayView(map) {
  const items = map[ymd(state.cur)] || [];
  if (!items.length)
    return `<p class="p-10 text-center text-sm text-on-surface-variant">Không có công việc nào đến hạn trong ngày này.</p>`;
  return `<div class="divide-y divide-glass-border">${items
    .map(
      (t) => `
    <a href="/projectdetail/${t.projectId}" class="flex gap-4 p-4 hover:bg-surface-container-low">
      <div class="w-14 text-center shrink-0"><p class="text-lg font-bold text-primary">${timeOf(t) || "—"}</p></div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-3"><h4 class="font-semibold truncate">${esc(t.title)}</h4>${badge(t)}</div>
        <p class="text-xs text-on-surface-variant mt-1">${esc(t.projectName)}</p>
        ${t.description ? `<p class="text-sm text-on-surface-variant mt-2 line-clamp-2">${esc(t.description)}</p>` : ""}
        <div class="mt-3 flex items-center gap-2"><div class="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden"><div class="h-full bg-primary" style="width:${t.progress || 0}%"></div></div><span class="text-xs">${t.progress || 0}%</span></div>
      </div></a>`,
    )
    .join("")}</div>`;
}

// ===== Lịch nhỏ =====
function renderMini(map) {
  const c = state.cur;
  const first = new Date(c.getFullYear(), c.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(c.getFullYear(), c.getMonth() + 1, 0).getDate();
  $("mini-title").textContent = `Tháng ${c.getMonth() + 1}, ${c.getFullYear()}`;
  let html = "<span></span>".repeat(lead);
  for (let d = 1; d <= days; d++) {
    const date = new Date(c.getFullYear(), c.getMonth(), d);
    const key = ymd(date);
    const items = map[key] || [];
    const dot = items.length
      ? `<i class="absolute bottom-0.5 w-1 h-1 rounded-full ${items.some(isOverdue) ? "bg-danger" : key === state.sel ? "bg-white" : "bg-primary"}"></i>`
      : "";
    const cls =
      key === state.sel
        ? "bg-primary text-white font-bold"
        : key === TODAY_KEY
          ? "ring-1 ring-primary text-primary font-bold"
          : date.getDay() === 0
            ? "text-secondary"
            : "";
    html += `<button data-mini-day="${key}" class="relative h-7 w-7 mx-auto flex items-center justify-center text-[11px] font-medium rounded-lg hover:bg-surface-container ${cls}">${d}${dot}</button>`;
  }
  $("mini-grid").innerHTML = html;
}

// ===== Danh sách bên dưới =====
function renderDay(map) {
  const items = map[state.sel] || [];
  $("day-title").textContent =
    state.sel === TODAY_KEY
      ? "Công việc hôm nay"
      : `Công việc ngày ${fmt(fromKey(state.sel))}`;
  $("day-list").innerHTML = items.length
    ? items
        .map(
          (
            t,
          ) => `<a href="/projectdetail/${t.projectId}" class="flex gap-4 p-3 rounded-2xl border border-glass-border hover:bg-surface-container transition-colors">
        <div class="min-w-[50px] text-center"><p class="text-sm font-bold text-primary">${timeOf(t) || "Cả ngày"}</p></div>
        <div class="flex-1 min-w-0"><h4 class="text-sm font-bold truncate">${esc(t.title)}</h4><p class="text-xs text-on-surface-variant mt-0.5 truncate">${esc(t.projectName)}</p></div>
        ${badge(t)}</a>`,
        )
        .join("")
    : emptyMsg("Không có công việc nào đến hạn trong ngày này.");
}

function renderUpcoming(list) {
  const limit = ymd(addDays(TODAY, 7));
  const items = list
    .filter((t) => t.status !== "HOAN_THANH" && dayOf(t) <= limit)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 8);
  $("upcoming").innerHTML = items.length
    ? items
        .map((t) => {
          const diff = Math.round(
            (fromKey(dayOf(t)) - fromKey(TODAY_KEY)) / 864e5,
          );
          const [label, cls] =
            diff < 0
              ? [`Quá hạn ${-diff} ngày`, "bg-danger/10 text-danger"]
              : diff === 0
                ? ["Hôm nay", "bg-warning/10 text-warning"]
                : diff === 1
                  ? ["Ngày mai", "bg-success/10 text-success"]
                  : [`${diff} ngày nữa`, "bg-primary/10 text-primary"];
          return `<a href="/projectdetail/${t.projectId}" class="flex items-center justify-between gap-3 p-3 border-b border-glass-border group">
          <div class="flex items-center gap-3 min-w-0"><i class="w-2 h-2 rounded-full shrink-0 ${(STATUS[effStatus(t)] || STATUS.CAN_LAM).dot}"></i>
            <p class="text-sm font-medium truncate group-hover:text-primary">${esc(t.title)}</p></div>
          <span class="text-[10px] px-2 py-1 rounded-full font-bold whitespace-nowrap ${cls}">${label}</span></a>`;
        })
        .join("")
    : emptyMsg("Không có deadline nào trong 7 ngày tới.");
}

// ===== Bộ lọc =====
function renderFilters() {
  const all = withDue();
  const projects = new Map();
  all.forEach((t) => {
    const p = projects.get(t.projectId) || { name: t.projectName, n: 0 };
    p.n++;
    projects.set(t.projectId, p);
  });
  const row = (attr, val, checked, label, n, dot = "") =>
    `<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" ${attr}="${esc(val)}" ${checked ? "checked" : ""} class="rounded text-primary focus:ring-primary" />
      ${dot ? `<i class="w-2 h-2 rounded-full ${dot}"></i>` : ""}<span class="flex-1 truncate">${esc(label)}</span><span class="text-xs text-on-surface-variant">${n}</span></label>`;
  $("filter-projects").innerHTML = projects.size
    ? [...projects]
        .map(([id, p]) =>
          row("data-proj", id, !state.hiddenProj.has(id), p.name, p.n),
        )
        .join("")
    : emptyMsg("Chưa có dự án nào.");
  $("filter-status").innerHTML = Object.entries(STATUS)
    .map(([k, s]) =>
      row(
        "data-stat",
        k,
        !state.hiddenStatus.has(k),
        s.label,
        all.filter((t) => effStatus(t) === k).length,
        s.dot,
      ),
    )
    .join("");
}

// ===== Vẽ lại toàn bộ =====
function render(error) {
  const list = visible();
  const map = groupByDay(list);
  renderTitle(list);
  $("cal-body").innerHTML = error
    ? `<p class="p-10 text-center text-sm text-danger">Không tải được lịch: ${esc(error)}</p>`
    : state.view === "month"
      ? renderMonth(map)
      : state.view === "week"
        ? renderWeek(map)
        : renderDayView(map);
  renderMini(map);
  renderDay(map);
  renderUpcoming(list);
  renderFilters();
  document
    .querySelectorAll(".view-btn")
    .forEach((b) => b.classList.toggle("on", b.dataset.view === state.view));
}

// ===== Điều hướng =====
function syncSel() {
  const c = state.cur;
  const sameMonthAsToday =
    c.getFullYear() === TODAY.getFullYear() &&
    c.getMonth() === TODAY.getMonth();
  state.sel = state.view === "month" && sameMonthAsToday ? TODAY_KEY : ymd(c);
}
function move(dir) {
  const c = state.cur;
  state.cur =
    state.view === "month"
      ? new Date(c.getFullYear(), c.getMonth() + dir, 1)
      : addDays(c, (state.view === "week" ? 7 : 1) * dir);
  syncSel();
}

document.addEventListener("click", (e) => {
  const t = e.target;
  const view = t.closest("[data-view]");
  const nav = t.closest("[data-nav]");
  const mini = t.closest("[data-mini]");
  const miniDay = t.closest("[data-mini-day]");
  const cell = t.closest("[data-day]");
  if (view) {
    state.view = view.dataset.view;
    if (state.view === "day") state.cur = fromKey(state.sel);
  } else if (nav) {
    if (nav.dataset.nav === "today") {
      state.cur = new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        TODAY.getDate(),
      );
      state.sel = TODAY_KEY;
    } else move(nav.dataset.nav === "next" ? 1 : -1);
  } else if (mini) {
    const c = state.cur;
    state.cur = new Date(
      c.getFullYear(),
      c.getMonth() + (mini.dataset.mini === "next" ? 1 : -1),
      1,
    );
    syncSel();
  } else if (miniDay) {
    state.sel = miniDay.dataset.miniDay;
    state.cur = fromKey(state.sel);
  } else if (cell && !t.closest("a")) {
    state.sel = cell.dataset.day;
    if (state.view === "day") state.cur = fromKey(state.sel);
  } else return;
  render();
});

document.addEventListener("change", (e) => {
  const p = e.target.closest("[data-proj]");
  const s = e.target.closest("[data-stat]");
  const toggle = (set, v) => (set.has(v) ? set.delete(v) : set.add(v));
  if (p) toggle(state.hiddenProj, Number(p.dataset.proj));
  else if (s) toggle(state.hiddenStatus, s.dataset.stat);
  else return;
  render();
});

// ===== Khởi tạo =====
async function load() {
  render();
  try {
    const res = await fetch("/api/tasks/kaban");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.tasks = Object.values(await res.json()).flat();
    render();
  } catch (err) {
    console.error(err);
    render(err.message);
  }
}
document.addEventListener("DOMContentLoaded", load);
