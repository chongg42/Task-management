<!doctype html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
      rel="stylesheet"
    />
<body>
    <div th:fragment="taskModal">
       <div id="secondStep" class="hidden">
               
                <div class="mb-8">
                  <h1 class="text-2xl font-bold text-slate-800">
                    Thêm công việc mới
                  </h1>
                  <p class="text-gray-500 mt-1">
                    Lên kế hoạch và giao nhiệm vụ cho đội ngũ của bạn.
                  </p>
                </div>
                <!-- BEGIN: Task Form -->
                <form class="space-y-6">
                  <!-- Task Title -->
                  <div data-purpose="input-group">
                    <label
                      class="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2"
                      for="project-name"
                      >TÊN DỰ ÁN</label
                    >
                    <input
                      class="w-full bg-[#f3f6f9] border-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-4 text-slate-700 placeholder-gray-400 transition-shadow"
                      id="project-name"
                      placeholder="Ví dụ: Tái cấu trúc Website 2024"
                      type="text"
                    />
                  </div>
                  <!-- Short Description -->
                  <div data-purpose="input-group">
                    <label
                      class="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2"
                      for="project-desc"
                      >MÔ TẢ NGẮN GỌN</label
                    >
                    <textarea
                      class="w-full bg-[#f3f6f9] border-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-4 text-slate-700 placeholder-gray-400 transition-shadow resize-none"
                      id="project-desc"
                      placeholder="Dự án tập trung vào việc cải thiện trải nghiệm người dùng..."
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Priority Levels -->
                    <div class="space-y-3">
                      <label class="text-sm font-semibold text-slate-700"
                        >Mức độ ưu tiên</label
                      >
                      <div class="flex flex-wrap gap-2">
                        <button
                          class="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                          type="button"
                        >
                          Thấp
                        </button>
                        <button
                          class="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                          type="button"
                        >
                          Trung bình
                        </button>
                        <button
                          class="px-4 py-1.5 rounded-full border-2 border-red-400 bg-red-50 text-xs font-bold text-red-500"
                          type="button"
                        >
                          Cao
                        </button>
                        <button
                          class="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                          type="button"
                        >
                          Khẩn cấp
                        </button>
                      </div>
                    </div>
                    <!-- Deadline -->
                    <div class="space-y-3">
                      <label class="text-sm font-semibold text-slate-700"
                        >Hạn hoàn thành</label
                      >
                      <div class="relative">
                        <span
                          class="absolute inset-y-0 left-4 flex items-center text-slate-400"
                        >
                          <svg
                            class="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewbox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                            ></path>
                          </svg>
                        </span>
                        <input
                                class="w-full bg-[#f3f6f9] border-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-4 pl-12 text-slate-700 transition-shadow"
                                id="start-date"
                                type="date"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- Category Dropdown -->
                  <div class="space-y-2 flex gap-10">

                    <div class="relative group">
                      <label class="text-sm font-semibold text-slate-700 block"
                      >Nhãn</label
                      >
                      <input type="text"
                        class="bg-[#f3f6f9] border-none rounded-lg focus:ring-2"
                      />
                      <ul class="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden hidden group-focus-within:block hover:block" aria-labelledby="categoryDropdown">
                        <li class=""><button type="button" class="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Thiết kế UI/UX</button></li>
                        <li class=""><button type="button" class="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Phát triển Frontend</button></li>
                        <li class=""><button type="button" class="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Backend API</button></li>
                        <li class=""><button type="button" class="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Kiểm thử &amp; QA</button></li>
                        <li class=""><button type="button" class="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Marketing</button></li>
                      </ul>
                    </div>
                    <div class="relative">
                      <label class="text-sm font-semibold text-slate-700 block"
                      >Màu sắc</label
                      >
                      <input type="color" id="colorPicker" />
                    </div>
                  </div>
                  <!-- Member Assignment -->





<!--                  ===========================================================================================-->
                  <div class="space-y-3">
                    <label class="text-sm font-semibold text-slate-700"
                      >Người thực hiện</label
                    >
                    <div class="relative">
                      <span
                        class="absolute inset-y-0 left-2 flex items-center text-slate-400"
                      >
                        <svg
                          class="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewbox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          ></path>
                        </svg>
                      </span>
                      <input
                              id="member-assignment"
                        class="input-field pl-8 bg-[#f3f6f9] border-none focus:ring-2 rounded-lg"
                        placeholder="Tìm thành viên theo tên hoặc email..."
                        type="text"
                      />
                    </div>
                    <!-- Assigned Members Chips -->
                    <div class="flex flex-wrap gap-3 mt-3">
                      <div
                        class="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full pl-1 pr-4 py-1"
                      >
                        <img
                          alt="Avatar"
                          class="w-8 h-8 rounded-full border border-white"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbrR21aWtxCEVACulrnXmklI9XTpmieN823alc8UYCJPoriJV1pekN3S0JjyPGdj78FlWDvjJJf2f5-vx32FUyeHfzBblitvDYs7JVco5UhO0IbGH0KiysK5bsoNelscu4CdmcSUAwFKRQLhz6bNRAzsn4LMW-PiC3tHfb8FI9se0Oo_KroB-9Wr8geUjUp6qpNJwX2LHE_KMAIet99Rqku0cnq_LvC9FqIwhuemwEtGW6KV0AUBYz"
                        />
                        <span class="text-xs font-medium text-slate-700"
                          >Nguyễn Văn A</span
                        >
                        <button
                          class="text-slate-400 hover:text-slate-600"
                          type="button"
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
                      </div>
                      <div
                        class="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full pl-1 pr-4 py-1"
                      >
                        <img
                          alt="Avatar"
                          class="w-8 h-8 rounded-full border border-white"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFp-2zgaaKzrJjlqwaRMejR5SG_OGswRE3zwTxRXmOLrSbwoSdazaBxoW2TMTWoLcEtBMmoy1tJcCC8N7FdVhc9mBZbbaG53YBPOCxcI8r_od8PtKY4qboo-OtIvOgGqRaFZ6XZXgRCemPcDWkxmxIHOryDCa8uwU4vHiKhBVLQBcFOg1OhWOTrrJs4v4879xOkhux0UjYqRj7GxJ_7J1zfYQybt-EPwO78BFTmZ-iwSgBmdC4pgGQ"
                        />
                        <span class="text-xs font-medium text-slate-700"
                          >Trần Thị B</span
                        >
                        <button
                          class="text-slate-400 hover:text-slate-600"
                          type="button"
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
                      </div>
                    </div>
                  </div>
                  <!-- BEGIN: Action Footer -->
                  <div class="flex justify-end pt-8">
                    <button
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 group"
                      type="button"
                      onclick="getStep(`lastStep`)"
                    >
                      Tiếp tục
                      <svg
                        class="h-5 w-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewbox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <!-- END: Action Footer -->
                </form>
                <!-- END: Task Form -->
            
    </div>
</body>
</html>
