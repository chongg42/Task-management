async function getProject() {
  try {
    const path = window.location.pathname;

    // Tách chuỗi thành mảng dựa trên dấu "/"
    const pathParts = path.split("/");

    // Lấy phần tử cuối cùng của mảng
    const id = pathParts[pathParts.length - 1];

    // 1. Định nghĩa danh sách các lời hứa (Promises) nhưng chưa kích hoạt await riêng lẻ
    const projectPromise =await fetch(`/api/project/${id}`);
    const tasksPromise =  await fetch(`/api/tasks/project/${id}`);
    const activityPromise= fetch(`/api/activity?id=${id}`);
    // 2. Kích hoạt gọi TẤT CẢ các API cùng một lúc
    const [projectRes, tasksRes,activityRes] = await Promise.all([
      projectPromise,
      tasksPromise,
      activityPromise
    ]);

    // 3. Parse dữ liệu JSON
    const project = await projectRes.json();
    const tasks = await tasksRes.json();
    const activity=await activityRes.json();

    projectDetailHeader(project);
    overview(project);
    contentTasks(tasks.content);
   
    console.log(tasks);
  } catch (error) {
    console.error("Đã xảy ra lỗi rồi:", error.message);
  }
}

function contentTasks(tasks) {
  let result = "";
  tasks.forEach((task) => {
    result += `<tr>
                    <td class="py-4 px-6 font-medium text-gray-900">${task.title}</td>
                    <td class="py-4 px-6 flex items-center gap-2">
                        <img class="w-6 h-6 rounded-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt="">
                        <span>Nguyễn Văn An</span>
                    </td>
                    <td class="py-4 px-6">15/08/2024</td>
                    <td class="py-4 px-6"><span class="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-600">Cao</span></td>
                    <td class="py-4 px-6 text-right text-gray-400 hover:text-gray-600 cursor-pointer"><i class="fa-solid fa-ellipsis"></i></td>
                </tr>
               `;
               document.getElementById("table-task").innerHTML=result?result:"Chưa có công việc nào được tải lên"
  });

}

function projectDetailHeader(project) {
  let progress = project.taskRes.reduce((acc, current, index, array) => {
    acc += current.progress;

    if (index === array.length - 1) {
      return acc / array.length;
    }
    return acc;
  }, 0);
  let result = "";
  result += ` <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span
                class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider"
                >Project ID: #${project.id}</span
              >
              <span
                class="flex items-center gap-1 text-[12px] text-on-surface-variant"
              >
                <span class="material-symbols-outlined text-[14px]">event</span>
                Hạn: ${project.dueDate.split("T")[0]}
              </span>
            </div>
            <h2 class="font-display-lg text-display-lg text-on-surface mb-2">
              ${project.name}
            </h2>
            <p
              class="font-body-md text-body-md text-on-surface-variant max-w-2xl mb-4"
            >
              ${project.description}
            </p>
            <div class="flex items-center gap-6">
              <div class="flex -space-x-3">
                <img
                  class="w-8 h-8 rounded-full border-2 border-white object-cover"
                  data-alt="Close up portrait of a female UI designer with glasses, vibrant modern aesthetic, soft office lighting."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBkF7Nsi0y7znJp6iccQdb_FeToBYF00l70IFwJM_x-RegPVXtjMhi937vbyrMziXOXCnm0rZOVKDI6RP-SDOOa5O-Ha53SHVMY1jG1EiQhKs73U6zqiXNuseHqDv4jyarSVlPKmPNPEUIy__OhKtT1ZJ9qsr1x74wGj0SmNyM9Bx0mVYveSE-LxIEBP_lVoODGqLh2QqXPkDqBTPetI0E5EqnSikLN6QI-FCVsHIQY1a6s8jTyozcvKCiAmooxJSpL8KuERvcr3c"
                />
                <div
                  class="w-8 h-8 rounded-full border-2 border-white bg-primary-container text-white flex items-center justify-center text-[10px] font-bold"
                >
                  +12
                </div>
              </div>
              <div class="h-6 w-[1px] bg-outline-variant"></div>
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[12px] font-semibold text-on-surface"
                    >Tiến độ tổng thể</span
                  >
                  <span class="text-[12px] font-bold text-primary">${progress}%</span>
                </div>
                <div
                  class="w-48 h-2 bg-surface-container-highest rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-primary to-success w-[${progress}%] rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              class="ripple-btn px-6 py-3 border border-primary text-primary font-label-lg text-label-lg rounded-xl hover:bg-primary/5 transition-all flex items-center gap-2"
            >
              <span class="material-symbols-outlined">share</span> Chia sẻ
            </button>
            <button
              class="ripple-btn px-6 py-3 bg-primary text-white font-label-lg text-label-lg rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
            >
              <span class="material-symbols-outlined">add</span> Thêm công việc
            </button>
          </div>`;
  document.getElementById("project-detail-header").innerHTML = result;
}
function overview(project) {
  let progress = project.taskRes.reduce((acc, current, index, array) => {
    acc += current.progress;

    if (index === array.length - 1) {
      return acc / array.length;
    }
    return acc;
  }, 0);
  let result = "";
  result += ` <!-- Stats Row -->
          <div class="col-span-12 md:col-span-3">
            <div
              class="glass-card p-6 rounded-2xl h-full flex flex-col justify-between"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
                >
                  <span class="material-symbols-outlined">assignment</span>
                </div>
                <span
                  class="text-success text-[12px] font-bold flex items-center"
                  >+12% ↑</span
                >
              </div>
              <div>
                <p class="text-on-surface-variant text-[14px]">
                  Tổng công việc
                </p>
                <h3 class="text-[32px] font-bold text-on-surface">${project.taskRes.length}</h3>
              </div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div
              class="glass-card p-6 rounded-2xl h-full flex flex-col justify-between"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success"
                >
                  <span class="material-symbols-outlined">check_circle</span>
                </div>
                <span
                  class="text-success text-[12px] font-bold flex items-center"
                  >+18% ↑</span
                >
              </div>
              <div>
                <p class="text-on-surface-variant text-[14px]">Hoàn thành</p>
                <h3 class="text-[32px] font-bold text-on-surface">${project.taskRes.filter((task) => task.status === "HOAN_THANH").length}</h3>
              </div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div
              class="glass-card p-6 rounded-2xl h-full flex flex-col justify-between"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning"
                >
                  <span class="material-symbols-outlined">schedule</span>
                </div>
                <span
                  class="text-on-surface-variant text-[12px] font-medium italic"
                  >Không đổi</span
                >
              </div>
              <div>
                <p class="text-on-surface-variant text-[14px]">
                  Đang thực hiện
                </p>
                <h3 class="text-[32px] font-bold text-on-surface">${project.taskRes.filter((task) => task.status === "DANG_LAM").length}</h3>
              </div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div
              class="glass-card p-6 rounded-2xl h-full flex flex-col justify-between"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error"
                >
                  <span class="material-symbols-outlined">error</span>
                </div>
                <span class="text-error text-[12px] font-bold flex items-center"
                  >+5% ↓</span
                >
              </div>
              <div>
                <p class="text-on-surface-variant text-[14px]">Quá hạn</p>
                <h3 class="text-[32px] font-bold text-on-surface">${project.taskRes.filter((task) => task.status === "QUA_HAN").length}</h3>
              </div>
            </div>
          </div>
          <!-- Team Activity & Timeline -->
         <div  class=" max-h-screen col-span-12 lg:col-span-8 overflow-y-auto [scrollbar-width:none] ">
            <div class="glass-card p-6 rounded-2xl">
              <h3
                class="font-headline-md text-headline-md text-on-surface mb-stack-md"
              >
                Hoạt động gần đây
              </h3>
              <div id="activity" class="space-y-6">


              </div>
            </div>
         </div>


          <!-- Progress Chart & Quick Files -->
          <div class="max-h-screen col-span-12 lg:col-span-4 space-y-gutter">
            <!-- Progress Chart -->
            <div class="glass-card p-6 rounded-2xl">
              <h3
                class="font-label-lg text-label-lg text-on-surface-variant mb-6 uppercase tracking-widest"
              >
                Hiệu suất dự án
              </h3>
              <div class="flex items-center justify-center py-4">
                <div class="relative w-40 h-40">
                  <svg class="w-full h-full transform -rotate-90">
                    <circle
                      class="text-surface-container-highest"
                      cx="80"
                      cy="80"
                      fill="transparent"
                      r="70"
                      stroke="currentColor"
                      stroke-width="12"
                    ></circle>
                    <circle
                      class="text-primary transition-all duration-1000"
                      cx="80"
                      cy="80"
                      fill="transparent"
                      r="70"
                      stroke="currentColor"
                      stroke-dasharray="440"
                      stroke-dashoffset="${440 - (progress / 100) * 440}"
                      stroke-linecap="round"
                      stroke-width="12"
                    ></circle>
                  </svg>
                  <div
                    class="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <span class="text-[36px] font-black text-on-surface"
                      >${progress}%</span
                    >
                    <span
                      class="text-[10px] font-bold text-on-surface-variant uppercase"
                      >Completed</span
                    >
                  </div>
                </div>
              </div>
              <div class="mt-6 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-primary"></span>
                    <span class="text-body-sm text-on-surface-variant"
                      >Hoàn thành</span
                    >
                  </div>
                  <span class="text-body-sm font-bold">78</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-warning"></span>
                    <span class="text-body-sm text-on-surface-variant"
                      >Đang xử lý</span
                    >
                    <span class="text-body-sm font-bold">32</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Recent Files -->
            <div class="glass-card p-6 rounded-2xl">
              <div class="flex justify-between items-center mb-4">
                <h3
                  class="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest"
                >
                  Tài liệu dự án
                </h3>
                <span
                  class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary"
                  >more_horiz</span
                >
              </div>
              <div class="space-y-3">
              ${project.attachments.map((attachment) => {
                return `<div
                  class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group"
                >
                  <div
                    class="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center"
                  >
                    <span class="material-symbols-outlined">description</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-label-lg font-semibold truncate">
                     ${attachment.originalFileName}
                    </p>
                    <p class="text-[10px] text-on-surface-variant">
                      ${attachment.fileSize} • ${attachment.uploadAt} ngày trước
                    </p>
                  </div>
                  <span
                    class="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant"
                    >download</span
                  >
                </div>`;
              })}
                
              </div>
            </div>
          </div>`;
  document.getElementById("content-overview").innerHTML = result;
}

function activitiLog(activitys){
  let result='';
  activitys.forEach(activity=>{
    result+=`
                <div class="flex gap-4 relative">
                  <div
                    class="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-outline-variant"
                  ></div>
                  <img
                    class="w-10 h-10 rounded-full z-10 border-2 border-white"
                    data-alt="Avatar 2"
                    src="${activity.user.avatar()}"
                  />
                  <div class="flex-1">
                    <p class="text-body-md text-on-surface">
                      <span class="font-bold">${activity.user.fullName()}</span> đã bình luận
                      trong
                      <span class="text-primary font-bold"
                        >Thiết kế UI Mobile</span
                      >
                    </p>
                    <div
                      class="mt-2 p-3 bg-surface-container rounded-xl text-body-sm text-on-surface-variant italic"
                    >
                      "Màu sắc nút CTA nên được điều chỉnh sang tone Indigo đậm
                      hơn một chút để nổi bật trên nền trắng."
                    </div>
                    <p class="text-[12px] text-on-surface-variant mt-1">
                      1 giờ trước
                    </p>
                  </div>
                </div>
                
              </div>
           `
  })
  return `
                <div class="flex gap-4 relative">
                  <div
                    class="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-outline-variant"
                  ></div>
                  <img
                    class="w-10 h-10 rounded-full z-10 border-2 border-white"
                    data-alt="Avatar 2"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0-qO9kxCCHCMCalJlDjIQW7aUQgr944hUGqqtsEPigqOgcedPX6dPC3ojCTQIFs3XTzBPuNfWmhwOxkhxquU0wLf45ASLG_FhJlzNZ0nhCBjKTJwGMGghD4aNobhqsztiYvqUINmPObqTjRQXdcnrsv_l_AS5Ck8JrnVNcZicMErYR5hMrUqcbMyy6lG08-bVliP4lWFeHlAynJ6iAZe-hUEVcqWL1kF_0sLUpO3Xl7-IwcEa5b5kGq763bxYnhlFx77L2oNCDZg"
                  />
                  <div class="flex-1">
                    <p class="text-body-md text-on-surface">
                      <span class="font-bold">Lê Thị Hoa</span> đã bình luận
                      trong
                      <span class="text-primary font-bold"
                        >Thiết kế UI Mobile</span
                      >
                    </p>
                    <div
                      class="mt-2 p-3 bg-surface-container rounded-xl text-body-sm text-on-surface-variant italic"
                    >
                      "Màu sắc nút CTA nên được điều chỉnh sang tone Indigo đậm
                      hơn một chút để nổi bật trên nền trắng."
                    </div>
                    <p class="text-[12px] text-on-surface-variant mt-1">
                      1 giờ trước
                    </p>
                  </div>
                </div>
                
              </div>
           
          `
}
getProject();
/*
 <div class="flex gap-4 relative">
                  <div
                    class="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-outline-variant"
                  ></div>
                  <img
                    class="w-10 h-10 rounded-full z-10 border-2 border-white"
                    data-alt="Avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvsrdMaorSu3kXzBYaVi6wteNomZaoRln4GH8-C7PVd1eVMd3NNQZTayA3OZi7ooSs293UiW4Q6njrv2Tk9sihmF9LrbipjDqULZ9BCvNMKk-5Z6pVdENkhSbmTt-K2KNLBno4RJyyR3buuCYPQzIH1xiqs5B77Hhg60kGkuJJ50hsW8GHcHlki8rNc_1a02cj2JqCgbfaRYEe4QhTqtCxHfXSH-8Ts9vU30ZOxiL02m2tiaZZiT_fr0N5AOMwLYKIzfqgWmscpCM"
                  />
                  <div class="flex-1">
                    <p class="text-body-md text-on-surface">
                      <span class="font-bold">Nguyễn Văn An</span> đã hoàn thành
                      công việc
                      <span class="text-primary font-bold"
                        >Xây dựng API xác thực</span
                      >
                    </p>
                    <p class="text-[12px] text-on-surface-variant mt-1">
                      2 phút trước
                    </p>
                  </div>
                </div>
                

                <div class="flex gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary z-10 border-2 border-white"
                  >
                    <span class="material-symbols-outlined">attachment</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-body-md text-on-surface">
                      <span class="font-bold">Trần Minh Quân</span> đã tải lên
                      tài liệu mới
                      <span class="text-primary font-bold"
                        >API_Documentation_v2.pdf</span
                      >
                    </p>
                    <p class="text-[12px] text-on-surface-variant mt-1">
                      3 giờ trước
                    </p>
                  </div>
                </div>
                */