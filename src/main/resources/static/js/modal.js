let currentStep = 0;
let users = [];
let member = [];
let tasks = [];

document.getElementById("themDuAn").onclick = openModal;
const taskId = document.getElementById("task-id");
const inputName = document.getElementById("task-name");
const inputDesc = document.getElementById("task-desc");
const dueDate = document.getElementById("due-date");
const member_btn = document.getElementById("search-member_btn");
const input = document.getElementById("search-member");
const projectName = document.getElementById("project-name");
const projectDesc = document.getElementById("project-desc");
const startDate = document.getElementById("start-date");
const endDate = document.getElementById("end-date");

function openModal() {
  document.getElementById("modal").classList.remove("hidden");
  getStep();
}
function closeModal() {
  currentStep = -1;
  document.getElementById("modal").classList.add("hidden");
  document.querySelector(".stepper-line").style.width = "4%";
  document.getElementById("totalTask").classList.add("hidden");
  tasks = [];
  users = [];
  resetInput();
  getStep();
}
function renderSteper(currentStep = 1) {
  document.querySelectorAll(".step-icon").forEach((item, index) => {
    const trangThai = {
      activeIcon: [
        "shadow-indigo-200",
        "shadow-lg",
        "text-white",
        "bg-indigo-600",
      ],
      inactiveIcon: [
        "bg-white",
        "border-2",
        "border-gray-200",
        "text-gray-400",
      ],
      activeText: ["font-bold", "text-indigo-600"],
      inactiveText: ["font-medium", "text-gray-400"],
    };
    trangThai.activeIcon.forEach((cls) =>
      item.children[0].classList.toggle(cls, index + 1 === currentStep),
    );
    trangThai.inactiveIcon.forEach((cls) =>
      item.children[0].classList.toggle(cls, index + 1 !== currentStep),
    );
    trangThai.activeText.forEach((cls) =>
      item.children[1].classList.toggle(cls, index + 1 === currentStep),
    );
    trangThai.inactiveText.forEach((cls) =>
      item.children[1].classList.toggle(cls, index + 1 !== currentStep),
    );

    item.firstElementChild.classList.toggle(
      "bg-blue-100",
      index + 1 < currentStep,
    );
    let percent = (currentStep - 1) * 50 + 4;
    document.querySelector(".stepper-line").style.width = `${percent}%`;
  });
}
function getStep(step = 1) {
  if (currentStep >= 3) currentStep = 0;

  currentStep = step;
  const steps = ["firstStep", "secondStep", "lastStep"];
  if (currentStep == 2 || currentStep == 3) {
    const currentForm = document.getElementById(steps[0]).querySelector("form");

    if (!currentForm.checkValidity()) {
      currentForm.reportValidity();
      return;
    }
  }
  steps.forEach((item, index) => {
    document
      .getElementById(item)
      .classList.toggle("hidden", index + 1 !== currentStep);
  });

  const content = document.getElementById("content");
  content.scrollTo({
    top: 0,
    behavior: "auto",
  });
  renderSteper(currentStep);
  //hiển thi danh sách task vào modal ở bước 3
  if (currentStep === 3) renderListTask(tasks);
}

member_btn.addEventListener("click", async (e) => {
  e.preventDefault();
  // Hiện spinner
  member_btn.children[0].classList.remove("hidden");
  member_btn.children[0].classList.add("animate-spin");
  member_btn.children[1].classList.add("hidden");

  await new Promise((resolve) => setTimeout(resolve, 300));

  // Ẩn spinner
  member_btn.children[0].classList.add("hidden");
  member_btn.children[0].classList.remove("animate-spin");
  member_btn.children[1].classList.remove("hidden"); // Spinner quay

  const res = await fetch(`api/user?email=${encodeURIComponent(input.value)}`);
  if (!res.ok) {
    alert("Khoong thay usser");
    return;
  }
  const user = await res.json();

  if (member.findIndex((m) => m.id === user.id) === -1) {
    member.push(user);
    input.value = "";
    renderMember(member);
  } else alert("Đã có user này rồi!");
});
function deleteUser(id) {
  var index = member.findIndex((u) => u.id == id);
  member.splice(index, 1);
  renderMember(member);
}
function renderMember(users) {
  const temp = document.getElementById("member-assignment");
  let result = "";
  users.forEach((user) => {
    result += `<div
                    class="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full pl-1 pr-4 py-1"
                  >
                    <img
                      alt="Avatar"
                      class="w-8 h-8 rounded-full border border-white"
                      src="${user.avatar}"
                    />
                    <span class="text-xs font-medium text-slate-700"
                      >${user.fullName}</span
                    >
                    <button
                      class="text-slate-400 hover:text-slate-600"
                      type="button"
                      onclick=deleteUser(${user.id})
                    >
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewbox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                    </button>
                  </div>`;
  });
  temp.innerHTML = result;
}

function addTask() {
  const currentForm = document
    .getElementById("secondStep")
    .querySelector("form");

  if (!currentForm.checkValidity()) {
    currentForm.reportValidity();
    return;
  }
  const task = {
    title: inputName.value,
    description: inputDesc.value,
    dueDate: dueDate.value + "T23:59:59",
    assigneeIds: member.map((x) => x.id),
  };
  if (!taskId.value.trim()) {
    tasks.push(task);
  } else {
    const index = tasks.findIndex((t) => t.id == taskId.value);
    if (index != -1) tasks[index] = { ...tasks[index], ...task };
    else {
      console.error("Không tìm thấy task có ID để cập nhật:", taskId);
      return; // Dừng hàm nếu có lỗi xảy ra
    }
  }

  renderTotalTask(tasks);
  inputName.value = "";
  inputDesc.value = "";
  dueDate.value = "";
  input.value = "";
  taskId.value = "";
  users.push(...member);
  console.log(users);
  member = [];

  // users.splice(0, users.length);
  renderMember(member);
}
function renderTotalTask(tasks) {
  if (tasks.length > 0) {
    document.getElementById("totalTask").innerHTML = tasks.length;
  }
  document
    .getElementById("totalTask")
    .classList.toggle("hidden", tasks.length <= 0);
}
function resetInput() {
  taskId.value = "";
  inputName.value = "";
  inputDesc.value = "";
  dueDate.value = "";
  member_btn.value = "";
  input.value = "";
  projectName.value = "";
  projectDesc.value = "";
  startDate.value = "";
  endDate.value = "";
  myFiles = [];
}

function renderListTask(tasks) {
  let result = "";
  tasks.forEach((task) => {
    result += `<div
                    class="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    onclick="renderTask(${task.id})"
                  >
                    <div class="text-gray-400 cursor-move">
                      <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewbox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 9h8M8 15h8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                    </div>
                    <div class="w-2 h-8 bg-blue-600 rounded-full"></div>
                    <div class="flex-grow">
                      <h3 class="text-sm font-semibold text-gray-900 uppercase">
                        ${task.title}
                      </h3>
                      <p class="text-xs text-gray-500">
                       ${task.description}
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                   
                      <div class="flex -space-x-2">
                       ${task.assigneeIds
                         .slice(0, 2)
                         .map((assigneeId) => {
                           const user = users.find((u) => u.id === assigneeId);

                           if (!user) return "";

                           return `<img
                               alt="Avatar"
                               title="${user.fullName}"
                               class="w-8 h-8 rounded-full border-2 border-white"
                               src="${user.avatar}"
                           /> `;
                         })
                         .join("")}
                         ${
                           task.assigneeIds.length > 2
                             ? `<div
                          class="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-blue-600 cursor-pointer"
                        >
                          <span>+${task.assigneeIds.length - 2}</span>
                        </div>`
                             : ""
                         }
                        
                      </div>
                      <button
                        class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        onclick="deleteTask(event,${task.id})"
                      >
                        <svg
                          class="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewbox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>`;
  });
  document.getElementById("listTask").innerHTML = result;
}
function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);

  if (index !== -1) {
    const ok = confirm("Bạn có chắc muốn xóa task này?");

    if (!ok) {
      return;
    }

    tasks.splice(index, 1);
    renderListTask(tasks);
    renderTotalTask(tasks);
  }
}
async function renderTask(id) {
  const task = tasks.find((t) => t.id === id);

  if (!task) return; // Guard clause: Thoát sớm nếu không tìm thấy task, đỡ phải bọc cả block trong if lớn

  // 1. Đổ dữ liệu cơ bản lên form (Sử dụng Optional Chaining ?. để tránh crash nếu thiếu ngày tháng)
  taskId.value = task.id;

  inputName.value = task.title;
  inputDesc.value = task.description;
  dueDate.value = task.dueDate ? task.dueDate.split("T")[0] : "";

  // 2. Xử lý gọi API lấy danh sách thành viên
  const ids = task.assigneeIds || [];
  if (ids.length > 0) {
    try {
      const response = await fetch(`/api/user?ids=${ids.join(",")}`);
      if (!response.ok) throw new Error("Không thể tải thông tin thành viên");

      const data = await response.json();
      member = data;
      renderMember(member);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu member:", error);
      // Bạn có thể renderMember([]) để xóa danh sách cũ hoặc thông báo lỗi cho user ở đây
    }
  } else {
    renderMember([]); // Nếu không có ai, xóa danh sách member cũ trên giao diện
  }

  // 3. Chuyển đổi step giao diện
  currentStep--;
  getStep(currentStep);
}
async function saveProject() {
  const id = document.getElementById("project-id").value;
  const url = id ? `/api/project/${id}` : "/api/project";
  const method = id ? "PUT" : "POST";

  const formData = new FormData();

  const project = {
    name: projectName.value,
    description: projectDesc.value,
    status: "DANG_THUC_HIEN",
    deleted: false,
    startDate: startDate.value + "T00:00:00",
    dueDate: endDate.value + "T23:59:59",
    tasks: tasks,
    deleteFileIds:deletedFileIds
  };
  formData.append(
    "project",
    new Blob([JSON.stringify(project)], { type: "application/json" }),
  );

  for (const file of myFiles) {
    formData.append("files", file);
  }
  const response = await fetch(url, {
    method: method,
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    alert("Tạo thành công");
    closeModal();
  } else {
    console.log("Lỗi:", response.status);
    console.log(await response.text());
  }
}
// Update Project
document
  .querySelector("#projects")
  .addEventListener("click", async function (e) {
    const btn = e.target.closest(".btn-update");
    if (!btn) return;
    openModal();
    const url = `/api/project/${btn.dataset.id}`;
    const res = await fetch(url);
    if (!res.ok) {
      alert("có lỗi xảy ra trong quá trình tải dữ liệu");
      return;
    }

    const data = await res.json();
    console.log(data);

    if (data.attachments) {
      data.attachments.forEach((file) => {
        myFiles.push({
          id: file.id, // ID trong Database
          name: file.originalFileName, // Tên file hiển thị
          // url: file.fileUrl,       // Link tải/xem file
          isExisting: true, // Đánh dấu đây là file CŨ
        });
      });
    }
    renderFile(myFiles);

    document.getElementById("project-id").value = data.id;
    document.getElementById("list-file");
    projectName.value = data.name;
    projectDesc.value = data.description;
    startDate.value = data.startDate.split("T")[0];
    endDate.value = data.dueDate.split("T")[0];
    tasks = data.taskRes;
    let ids = [...new Set(tasks.flatMap((t) => t.assigneeIds))];

    users = await (await fetch(`/api/user?ids=${ids.join(",")}`)).json();
    renderListTask(tasks);
    renderTotalTask(tasks);
  });

let deletedFileIds = [];
let myFiles = [];
const listFile = document.getElementById("list-file");
const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (e) => {
  if (fileInput.files.length > 0) {
    const newFiles = Array.from(fileInput.files);
    newFiles.forEach((file) => {
      if (!myFiles.some((f) => f.name === file.name)) {
        myFiles.push(file);
      }
    });
    renderFile(myFiles);
  } else listFile.innerHTML = "";
});
function renderFile(files) {
  let result = "";
  // Dùng Array.from để ép kiểu về mảng chuẩn
  files.forEach((file, index) => {
    result += `
        <div class="flex items-center gap-2 w-28 bg-blue-50 rounded-full px-3 py-2 mb-2">
          <span class="truncate flex-1">
            📄 ${file.name}
          </span>
          <button class="shrink-0 text-gray-500 hover:text-red-500" onclick="removeFile(${index})" data-file-id=${file.id}>✕</button>
        </div>`;
  });

  listFile.innerHTML = result;
}
function removeFile(index) {
  if (myFiles === null || myFiles.length <= 0) return;

  const file = myFiles[index];

  if (!file) return;

  if (file.id) {
    deletedFileIds.push(parseInt(file.id));
  }

  myFiles.splice(index, 1);

  renderFile(myFiles);

  console.log(deletedFileIds);
}
