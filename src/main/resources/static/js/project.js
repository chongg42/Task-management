let currentPage = 0;
let pageSize = 5;

const filter = {
  keyword: "",
  status: "",
};
console.log("duAn.js đã được load");
function init() {
  console.log("chạy đượcc");

  getProject();
}

const statuses = document.querySelectorAll('input[name="status"]');
statuses.forEach((status) => {
  status.addEventListener("change", () => {
    filter.status = status.value;
    filter.page = 0;

    getProject();
  });
});

async function getProject(page = 0) {
  console.log(filter.status + "status");
  currentPage = page;
  filter.keyword = document.getElementById("searchInput").value;

  const url = `/api/project/myproject?key=${filter.keyword}&status=${filter.status}&page=${currentPage}&size=${pageSize}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.content);
    renderProject(data.content);
    renderPagination(data);
  } catch (e) {
    console.error("Lỗi khi tải danh sách dự án:", e);
  }
}

function renderProject(projects) {
  const tbody = document.getElementById("projects");
  let result = "";
  projects.forEach((project) => {
    result += ` <div class="relative group">
    <div
              class="hidden items-center gap-2 absolute top-0 right-0 z-50 p-2 group-hover:flex"
            >
              <button
                data-id=${project.id}
                class="btn-update flex items-center gap-2 rounded-lg border border-blue-500 px-1.5 py-1 text-blue-500 transition hover:bg-blue-500 hover:text-white"
               
              >
                <span class="material-symbols-outlined">edit</span>
              </button>

              <button
                class="flex items-center gap-2 rounded-lg border border-red-500 px-1.5 py-1 text-red-500 transition hover:bg-red-500 hover:text-white"
                onclick="deleted(event,${project.id})"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          <a href="/projectdetail/${project.id}"
            class="project-card glass-card rounded-2xl overflow-hidden flex flex-col  relative group"
          >
           
            <div class="relative h-48">
              <div
                class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                data-alt="A high-resolution interface design prototype for a mobile e-commerce application displayed on a sleek smartphone. The design features a vibrant purple and blue gradient background with glassmorphism elements. Soft lighting from the top-right creates a professional, high-end digital design studio atmosphere."
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuD7aob7zm8yslUKUl-RNhl7-yEdq8fFCiLlbpxJUb5Rr9RxtBR_-xtnDliUT29YdjljcMZfcSBhewCu3CEhLCbNLon6Q7EaN9txGz1clBxHh0Ot2wp0awuuOU7zPH6hW6vcNnKIp6X0VP2US06noLeDMNb0Of9cEO09XBLF__HEtuZjy6tsnCafSL9zQ0ho3xdMXcalLCOTUQhmJvUmT14XwmQV-8EFvJPYK8Zh9lpWVBxIKN8o7otBTt0L8xPgQjfNfWT5C3R_jss&quot;);
                "
              ></div>
              <div class="absolute top-4 left-4">
                <span
                  class="bg-success/20 backdrop-blur-md text-success text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-success/30"
                  >Đang chạy</span
                >
              </div>
            </div>
            <div class="p-6 flex-1 flex flex-col">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-headline-md text-lg truncate pr-2">
                  ${project.name}
                </h3>
                <button
                  class="material-symbols-outlined text-outline hover:text-primary transition-colors"
                >
                  more_vert
                </button>
              </div>
              <p class="text-body-sm text-on-surface-variant line-clamp-2 mb-6">
               ${project.description}
              </p>
              <div class="mt-auto">
                <div class="flex justify-between text-xs mb-2">
                  <span class="font-bold text-outline">Tiến độ</span>
                  <span class="font-bold text-primary">75%</span>
                </div>
                <div
                  class="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-6"
                >
                  <div
                    class="h-full bg-gradient-to-r from-primary to-secondary"
                    style="width: 75%"
                  ></div>
                </div>
                <div
                  class="flex items-center justify-between border-t border-glass-border pt-4"
                >
                  <div class="flex -space-x-2">
                    <img
                      class="w-8 h-8 rounded-full border-2 border-white"
                      data-alt="A portrait of a female software engineer smiling warmly. She is in a contemporary tech office with a bright, airy feel. The lighting is soft and natural, emphasizing a modern, professional light-mode aesthetic. Her appearance is professional and friendly, ideal for a collaborative team environment."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgKU9Hd5kZIrxN3LpIJYgxVeUCfRm1av6pkA7xp-PbiATd8cmrsxOzOl449LcL6v4m2bmrhFBl_qoJvZnSd-MvKeuEiIm2oijG-5XQHtLuLR2RBwRxA_veLw6vW-4nPdgzVOgt0PYD4Pp6F2TYC044IfnH0t9d-Ag8mHMNhviz1rr8LqU__1PsZkhlgR19PLj0FX6LRoJ737Qo2stXn1jGQ5AsC256LbiI2IuxdeRTqb6CSDIIBPdwneD4LJ7CgwxZSWHZ9dgXHPI"
                    />
                    <img
                      class="w-8 h-8 rounded-full border-2 border-white"
                      data-alt="A portrait of a male product designer with a thoughtful expression. He is positioned in a creative workspace filled with soft, diffused morning light. The background features high-end minimalist furniture and subtle tech accents. The overall mood is focused and innovative, fitting a premium SaaS brand."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqBXcXENV3SzDJkXdYVOhvnwBDuFm4dnges3OXZiIg5GPY_X2MZgry3TxDnV-iHkKPwM7_d8a64DWAM4l5U7TfAZ2R_qqNle5M595YukE1hGczq4cFoJ0ucXRl8_gBYEbi9Hho_3BEPicvBztbsGpExKsK23YEDAjv1o3XrKvB0szgot-YOP_uUWx9T34sxVGJD63DJJbm6acB2Zd5vGhJkZ-g15lYNlQlLF-LriGgR7iWKFySE9BgL7p-Xxgy02LzJPnv8wT1LKE"
                    />
                    <div
                      class="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-white flex items-center justify-center text-[10px] font-bold"
                    >
                      +3
                    </div>
                  </div>
                  <div class="flex items-center gap-2 text-outline">
                    <span class="material-symbols-outlined text-sm"
                      >calendar_month</span
                    >
                    <span class="text-xs">25/08/2024</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
          </div>`
          ;
  });
  result += ` <div
            class="border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-surface-container hover:border-primary transition-all group cursor-pointer h-full min-h-[400px]"
          >
            <div
              class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors"
            >
              <span
                class="material-symbols-outlined text-3xl text-outline group-hover:text-primary"
                >add</span
              >
            </div>
            <p
              class="font-headline-md text-lg text-outline group-hover:text-primary"
            >
              Thêm dự án mới
            </p>
            <p class="text-body-sm text-outline-variant text-center mt-2 px-8">
              Bắt đầu một hành trình mới cùng đội ngũ của bạn ngay hôm nay.
            </p>
          </div>`;
  tbody.innerHTML = result;
}
function renderPagination(projects) {
  console.log(projects);
  const pagination = document.querySelector("#pagination");
  if (projects.totalPages > 0) {
    let result = `<button
              class="p-2 ${projects.first ? "disabled" : ""} hover:bg-surface-container rounded-lg transition-colors text-outline hover:text-primary"
              onclick=getProject (${projects.number - 1})
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <div class="flex items-center gap-1">`;
    for (let i = 0; i < projects.totalPages; i++) {
      result += ` <button
               class="${i === projects.number ? "active-page" : ""} w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors font-label-lg"
                onclick=getProject(${i})
              >
                ${i + 1}
              </button>`;
    }
    result += `</div>
            <button
            onclick=getProject(${projects.number + 1})
              class="p-2 ${projects.last ? "disabled" : ""} hover:bg-surface-container rounded-lg transition-colors text-outline hover:text-primary"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>`;
    pagination.innerHTML = result;
  } else pagination.innerHTML = "";
}
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) return res.text();
  } catch (e) {
    console.error("Lỗi upload:", e);
  }
  return null;
}

async function deleted(event, id) {

  const ok = confirm("Bạn có chắc muốn xóa task này?");

  if (!ok) {
    return;
  }

  try {
    const res = await fetch(`/api/project/${id}`, { method: "DELETE" });
    alert("Xóa Thành Công");
    getProject();
  } catch (error) {
    console.log(error);
  }
}

async function update(id) {
  openModal();
}
init();
