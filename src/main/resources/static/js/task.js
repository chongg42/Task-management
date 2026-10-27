/**
 * 1. CẤU HÌNH HỆ THỐNG & API
 */
const API_URL = "api/tasks/kaban";
const STATUS_API = (id) => `api/tasks/${id}/status-progress`; // API đổi trạng thái khi kéo thả (đổi theo backend)

// id cột <-> status backend trả về
const COLUMN_STATUS = {
  "kanban-todo": "CAN_LAM",
  "kanban-inprogress": "DANG_LAM",
  "kanban-review": "DANG_KIEM_TRA",
  "kanban-done": "HOAN_THANH",
};
const STATUS_COLUMN = Object.fromEntries(
  Object.entries(COLUMN_STATUS).map(([col, st]) => [st, col]),
);
const CARD_SELECTOR = ".glass-card[data-task-id]";

/**
 * 2. CÁC HÀM RENDER HTML
 */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Render ảnh người thực hiện (1 hoặc nhiều người)
function renderAssigneesHTML(assignees = []) {
  if (!assignees || assignees.length === 0) return "";
  const avatars = assignees
    .map(
      (user) => `
      <img
        class="w-7 h-7 rounded-full ring-2 ring-white"
        src="${escapeHtml(user.avatar)}"
        alt="${escapeHtml(user.name || "Assignee")}"
        draggable="false"
      />`,
    )
    .join("");
  return `<div class="flex -space-x-2">${avatars}</div>`;
}

// Render thanh tiến độ 
function renderProgressHTML(progress, id) {
  if (progress === undefined || progress === null) return "";
  return `
    <div class="progress-container w-full">
      <div class="flex justify-between text-[11px] text-outline mb-1.5">
        <span>Tiến độ</span>
        <span class="progress-value">${progress}%</span>
      </div>
      <input type="range"
        class="progress-input w-full h-2 rounded-full accent-primary cursor-pointer"
        min="0"
        max="100"
        data-id="${id}"
        data-saved="${progress}"
        value="${progress}" />
    </div>
  `;
}

// Render thẻ Task (dùng chung cho mọi cột, giao diện theo status xử lý ở applyStatusStyle)
function createStandardCardHTML(task) {
  return `
    <div
      class="glass-card p-6 rounded-[24px] shadow-lg shadow-shadow-tint hover:shadow-xl hover:-translate-y-1 transition-all group cursor-grab active:cursor-grabbing"
      data-task-id="${task.id}"
      data-status="${task.status}"
      draggable="true"
    >
      <h3 class="font-headline-md text-[18px] text-on-surface mb-2 group-hover:text-primary transition-colors">
        ${escapeHtml(task.title)}
      </h3>

      ${task.description ? `<p class="text-body-sm text-on-surface-variant mb-4 line-clamp-2">${escapeHtml(task.description)}</p>` : ""}

      <div class="space-y-4">
        ${renderProgressHTML(task.progress, task.id)}

        <div class="flex items-center justify-between pt-2 border-t border-glass-border">
          <div class="flex items-center gap-3">
            ${
              task.dueDate
                ? `<div class="flex items-center gap-1 text-[11px] text-outline">
                     <span class="material-symbols-outlined text-sm">schedule</span>
                     <span>${escapeHtml(task.dueDate)}</span>
                   </div>`
                : ""
            }
            ${
              task.commentsCount !== undefined
                ? `<div class="flex items-center gap-1 text-[11px] text-outline">
                     <span class="material-symbols-outlined text-sm">comment</span>
                     <span>${task.commentsCount}</span>
                   </div>`
                : ""
            }
            ${
              task.attachmentsCount !== undefined
                ? `<div class="flex items-center gap-1 text-[11px] text-outline">
                     <span class="material-symbols-outlined text-sm">attach_file</span>
                     <span>${task.attachmentsCount}</span>
                   </div>`
                : ""
            }
          </div>
          ${renderAssigneesHTML(task.assignees)}
        </div>
      </div>
    </div>
  `;
}

// Áp style theo status (gọi lúc render và mỗi khi kéo sang cột mới)
function applyStatusStyle(card) {
  const status = card.dataset.status;
  const isDoing = status === "DANG_LAM";
  const isDone = status === "HOAN_THANH";
  card.classList.toggle("border-l-4", isDoing);
  card.classList.toggle("border-secondary", isDoing);
  card.classList.toggle("opacity-70", isDone);
  card.querySelector("h3")?.classList.toggle("line-through", isDone);
}

/**
 * 3. RENDER BOARD
 */
function renderKanbanBoard(tasks) {
  Object.entries(STATUS_COLUMN).forEach(([status, columnId]) => {
    const container = document.getElementById(columnId);
    const list = tasks[status];
    if (!container || !list) return;
    container.insertAdjacentHTML(
      "beforeend",
      list.map((t) => createStandardCardHTML({ ...t, status })).join(""),
    );
  });

  document.querySelectorAll(CARD_SELECTOR).forEach(applyStatusStyle);
  Object.keys(COLUMN_STATUS).forEach((id) =>
    updateCount(document.getElementById(id)),
  );
}

// Cập nhật badge số lượng ở tiêu đề cột
function updateCount(column) {
  if (!column) return;
  const badge = column.querySelector("h2 + span");
  if (badge) badge.textContent = column.querySelectorAll(CARD_SELECTOR).length;
}

/**
 * 4. GỌI API
 */
async function fetchKanbanTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const tasks = await response.json();
    renderKanbanBoard(tasks);
  } catch (error) {
    console.warn("Không thể tải API:", error);
  }
}

// function csrfHeaders() {
//   const headers = { "Content-Type": "application/json" };
//   const token = document.querySelector('meta[name="_csrf"]')?.content;
//   const header = document.querySelector('meta[name="_csrf_header"]')?.content;
//   if (token && header) headers[header] = token;
//   return headers;
// }

async function saveStatusOrProgress(taskId, status = null, progress = null) {
  const url = `api/tasks/${taskId}/status-progress`;

  try {
    const formData = new FormData();
    const taskData = {};

    // Chỉ kiểm tra null, vì progress = 0 là giá trị hợp lệ
    if (status !== null) {
      taskData.status = status;
      if (status === "CAN_LAM") taskData.progress = 0;
    }

    if (progress !== null) {
      taskData.progress = progress;
    }

    // Hoàn thành task -> bắt buộc upload file
    if (
      progress === 100 ||
      status === "HOAN_THANH" ||
      status === "DANG_KIEM_TRA"
    ) {
      taskData.progress = 100;
      const file = await openFilePickerModern();

      if (!file) {
        // Người dùng hủy chọn file
        revert();
        return false;
      }

      formData.append("file", file);
    }
    formData.append(
      "req",
      new Blob([JSON.stringify(taskData)], {
        type: "application/json",
      }),
    );
    const res = await fetch(url, {
      method: "PATCH",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    // Thành công
    return true;
  } catch (error) {
    console.error("Cập nhật tiến độ thất bại:", error);

    // API lỗi -> đưa UI về trạng thái cũ
    revert();

    return false;
  }
}
/**
 * 5. KÉO THẢ (event delegation -> card render động vẫn hoạt động)
 */
function initDragAndDrop() {
  let dragging = null;
  let fromColumn = null;
  let fromNext = null;
  let lockedCard = null;

  const columns = () =>
    Object.keys(COLUMN_STATUS)
      .map((id) => document.getElementById(id))
      .filter(Boolean);

  // Cột rỗng vẫn cần vùng để thả
  columns().forEach((c) => (c.style.minHeight = "200px"));

  const clearHighlight = () =>
    columns().forEach((c) =>
      c.classList.remove(
        "ring-2",
        "ring-primary/30",
        "bg-primary/5",
        "rounded-2xl",
      ),
    );

  const getColumn = (el) => {
    const col = el.closest?.("[id^='kanban-']");
    return col && COLUMN_STATUS[col.id] ? col : null;
  };

  const getInsertBefore = (column, y) =>
    [...column.querySelectorAll(CARD_SELECTOR)]
      .filter((c) => c !== dragging)
      .find((c) => {
        const box = c.getBoundingClientRect();
        return y < box.top + box.height / 2;
      }) || null;

  // Không cho kéo card khi người dùng đang thao tác slider / nút / link trong card
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest("input, button, a, select, textarea")) {
      const card = e.target.closest(CARD_SELECTOR);
      if (card) {
        card.draggable = false;
        lockedCard = card;
      }
    }
  });
  const unlock = () => {
    if (lockedCard) lockedCard.draggable = true;
    lockedCard = null;
  };
  document.addEventListener("pointerup", unlock);
  document.addEventListener("pointercancel", unlock);

  document.addEventListener("dragstart", (e) => {
    const card = e.target.closest?.(CARD_SELECTOR);
    if (!card) return;
    dragging = card;
    fromColumn = card.parentElement;
    fromNext = card.nextElementSibling;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.dataset.taskId);
    setTimeout(() => card.classList.add("opacity-40", "scale-[0.98]"), 0);
  });

  document.addEventListener("dragend", () => {
    dragging?.classList.remove("opacity-40", "scale-[0.98]");
    clearHighlight();
    dragging = fromColumn = fromNext = null;
    unlock();
  });

  document.addEventListener("dragover", (e) => {
    if (!dragging) return;
    const column = getColumn(e.target);
    if (!column) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    clearHighlight();
    column.classList.add(
      "ring-2",
      "ring-primary/30",
      "bg-primary/5",
      "rounded-2xl",
    );

    const before = getInsertBefore(column, e.clientY);
    if (before) column.insertBefore(dragging, before);
    else column.appendChild(dragging);
  });

  document.addEventListener("drop", async (e) => {
    if (!dragging) return;
    const column = getColumn(e.target);
    if (!column) return;
    e.preventDefault();
    clearHighlight();

    const card = dragging;
    const oldColumn = fromColumn;
    const oldNext = fromNext;
    const oldStatus = card.dataset.status;
    const newStatus = COLUMN_STATUS[column.id];

    updateCount(column);
    updateCount(oldColumn);
    if (oldColumn === column) return; // chỉ sắp xếp lại trong cùng cột

    card.dataset.status = newStatus;
    applyStatusStyle(card);

    try {
      await saveStatusOrProgress(card.dataset.taskId, newStatus);
    } catch (err) {
      console.error("Cập nhật trạng thái thất bại:", err);
      // Rollback
      if (oldNext && oldNext.parentElement === oldColumn)
        oldColumn.insertBefore(card, oldNext);
      else oldColumn.appendChild(card);
      card.dataset.status = oldStatus;
      applyStatusStyle(card);
      updateCount(column);
      updateCount(oldColumn);
      alert("Không thể cập nhật trạng thái công việc. Vui lòng thử lại.");
    }
  });
}

/**
 * 6. KHỞI TẠO
 */
document.addEventListener("DOMContentLoaded", () => {
  initDragAndDrop();
  fetchKanbanTasks();

  // Cập nhật số % realtime khi đang kéo slider
  document.addEventListener("input", (e) => {
    if (!e.target.classList.contains("progress-input")) return;
    e.target
      .closest(".progress-container")
      .querySelector(".progress-value").textContent = `${e.target.value}%`;
  });

  // Khi thả slider -> gọi API cập nhật tiến độ
  document.addEventListener("change", async (e) => {
    const input = e.target;
    if (!input.classList.contains("progress-input")) return;

    const value = input.value;
    const oldValue = input.dataset.saved; // giá trị đã lưu thành công gần nhất
    const label = input
      .closest(".progress-container")
      .querySelector(".progress-value");

    const revert = () => {
      input.value = oldValue;
      label.textContent = `${oldValue}%`;
    };

    input.disabled = true; // tránh kéo tiếp khi đang gửi request

    const url = `api/tasks/${input.dataset.id}/status-progress`;
    try {
      const formData = new FormData();
      formData.append(
        "req",
        new Blob([JSON.stringify({ progress: value })], {
          type: "application/json",
        }),
      );

      if (value == 100) {
        const file = await openFilePickerModern();
        if (!file) {
          // Người dùng hủy chọn file -> trả về tiến độ cũ
          revert();
          return;
        }
        formData.append("file", file);
      }

      const res = await fetch(url, { method: "PATCH", body: formData });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      input.dataset.saved = value; // lưu thành công -> cập nhật mốc mới
    } catch (error) {
      console.error("Cập nhật tiến độ thất bại:", error);
      revert();
      alert("Không thể cập nhật tiến độ. Vui lòng thử lại.");
    } finally {
      input.disabled = false;
    }
  });
});

async function openFilePickerModern() {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Tài liệu & Hình ảnh",
          accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
          },
        },
      ],
      multiple: false,
    });
    return await fileHandle.getFile();
  } catch (err) {
    if (err.name !== "AbortError") console.error("Lỗi:", err);
  }
}
