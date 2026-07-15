let currentStep = 0;
document.getElementById("themDuAn").onclick = openModal;
function openModal() {
  document.getElementById("modal").classList.remove("hidden");
  getStep();
}
function closeModal() {
  currentStep = -1;
  document.getElementById("modal").classList.add("hidden");
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
      item.firstElementChild.classList.toggle(cls, index + 1 === currentStep),
    );
    trangThai.inactiveIcon.forEach((cls) =>
      item.firstElementChild.classList.toggle(cls, index + 1 !== currentStep),
    );
    trangThai.activeText.forEach((cls) =>
      item.lastElementChild.classList.toggle(cls, index + 1 === currentStep),
    );
    trangThai.inactiveText.forEach((cls) =>
      item.lastElementChild.classList.toggle(cls, index + 1 !== currentStep),
    );

    item.firstElementChild.classList.toggle(
      "bg-blue-100",
      index + 1 < currentStep,
    );
    let percent = (currentStep - 1) * 50 + 2;
    document.querySelector(".stepper-line").style.width = `${percent}%`;
  });
}
function getStep(status = "firstStep") {
  currentStep++;
  const steps = ["firstStep", "secondStep", "lastStep"];
  steps.forEach((step) => {
    document.getElementById(step).classList.toggle("hidden", step !== status);
  });
   const content = document.getElementById("content");
  content.scrollTo({
    top: 0,
    behavior: "smooth",
  }); 
  renderSteper(currentStep);
}
