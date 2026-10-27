document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

async function loadProfile() {
  try {
    const response = await fetch("/api/user/profile");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    
    }

    const user = await response.json();

    console.log("Thông tin user:", user);

    // =========================
    // Thông tin cá nhân
    // =========================

    document.getElementById("inputFullName").value = user.fullName ?? "";

    document.getElementById("inputEmail").value = user.email ?? "";

    // =========================
    // Avatar
    // =========================

    if (user.avatar) {
      document.getElementById("profileAvatar").src = user.avatar;
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cá nhân:", error);
  }
}
