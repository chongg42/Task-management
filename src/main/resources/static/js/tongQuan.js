currentPage = 0;
pageSize = 3;
console.log("tongQuan.js đã được load");
function init() {
  console.log("chạy đượcc");
  
  getTask();
}

async function getTask(page = 0, id = null) {
  currentPage = page;
  id = 1;
  const keyword = document.getElementById("searchInput").value;
  const url = `/api/user/task/mytask?key=${keyword}&page=${currentPage}&size=${pageSize}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    renderTable(data.content);
  } catch (e) {
    console.error("Lỗi khi tải danh sách công việc:", e);
  }
}
function renderTable(congViecs) {
  const tbody = document.getElementById("listCongViecs");
  tbody.innerHTML = "";
  if (congViecs.length == 0 || congViecs == null) {
    tbody.innerHTML = `
      <h4 class="font-label-lg text-label-lg group-hover:text-primary transition-colors center">
        Không tìm thấy công việc
      </h4>
    `;
    return;
  }
  var result = "";
  congViecs.forEach((cv) => {
    result += `<div class="flex items-center gap-4 p-4 border border-glass-border rounded-2xl hover:bg-surface-container-low transition-colors group">
    <div class="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center cursor-pointer hover:border-primary transition-colors"></div>
    <div class="flex-1">
      <h4 class="font-label-lg text-label-lg group-hover:text-primary transition-colors">
        ${cv.title}
      </h4>
      <div class="flex items-center gap-3 mt-1">
        <span class="text-xs text-on-surface-variant flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">folder</span>
          Dự án Website
        </span>
        <span class="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
          Thiết kế
        </span>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <span class="text-xs text-on-surface-variant">${cv.dueDate}</span>
      <div class="flex -space-x-2">
        <img
          class="w-8 h-8 rounded-full border-2 border-white"
          data-alt="Portrait of a female creative professional, bright and airy lighting, neutral studio background."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDClVw746zc0beEIlt1hE9w0y398vnKSEIf3ZUpJUDvKgapbuXrt-Im2Y1bZxEmiK_Y5U87rH4j3DoOK-HH0CA7HKFVI_Re8zh_YeSItbYeQwyf0D28hlXEZVsYREDpukoqscBJcnZrlyKnpDHYgFLY0UNf9uIBKsBp0wywe8i9hT5WuJgQo83JjQtoT8VIL0nbNqeq2bC5mFJ509zJOSem8G3bFbsyWD3BKMoK7e9uhgeP9uy1E_jB9LjADsduKLtbvfUKQp2malM"
        />
      </div>
      <span class="px-3 py-1 bg-danger/10 text-danger rounded-lg text-[10px] font-bold uppercase tracking-wider">
        Cao
      </span>
      <button class="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
        more_vert
      </button>
    </div>
  </div>`;
  });
  tbody.innerHTML =
    result +
    `<button class="w-full py-4 text-center text-primary font-label-lg hover:underline transition-all">  Xem tất cả công việc →</button>`;
}
init();
