 let deletedFileIds = [];
 let myFiles = [];
const listFile = document.getElementById("list-file");
const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (e) => {
  if (fileInput.files.length > 0) {
    const newFiles = Array.from(fileInput.files);
    newFiles.forEach(file=>{
      if (!myFiles.some((f) => f.name === file.name)) {
             myFiles.push(file);
    }
    })
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
          <button class="shrink-0 text-gray-500 hover:text-red-500" onclick="removeFile(${index})">✕</button>
        </div>`;
  });

  listFile.innerHTML = result;
}
function removeFile(index) {
  if (myFiles === null || myFiles.length <= 0) return;
  else {
   myFiles.splice(index, 1);
    renderFile(myFiles);
  }
}
