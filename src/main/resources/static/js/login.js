let currentTab = "login"; // Đặt mặc định là Đăng Nhập
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");

// Chuyển đổi giữa Tab Đăng Nhập và Đăng Ký
function switchTab(tab) {
  currentTab = tab;
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");
  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");
  const fullNameGroup = document.getElementById("fullNameGroup");
  const fullNameInput = document.getElementById("fullName");
  const strengthMeterGroup = document.getElementById("strengthMeterGroup");
  const termsGroup = document.getElementById("termsGroup");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const rememberGroup = document.getElementById("rememberGroup");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const submitBtn = document.getElementById("submitBtn");
  const footerPrompt = document.getElementById("footerPrompt");

  if (tab === "login") {
    // Tab Style
    tabLoginBtn.className =
      "flex-1 py-2 text-xs font-bold rounded-lg transition-all text-primary-container bg-white shadow-sm";
    tabRegisterBtn.className =
      "flex-1 py-2 text-xs font-medium rounded-lg transition-all text-on-surface-variant hover:text-on-surface";

    // Form Elements
    formTitle.textContent = "Đăng Nhập";
    formSubtitle.textContent =
      "Chào mừng trở lại! Vui lòng nhập thông tin của bạn.";
    fullNameGroup.classList.add("hidden");
    fullNameGroup.classList.remove("flex");
    fullNameInput.required = false;
    strengthMeterGroup.classList.add("hidden");
    termsGroup.classList.add("hidden");
    termsCheckbox.required = false;
    rememberGroup.classList.remove("hidden");
    forgotPasswordLink.classList.remove("hidden");
    submitBtn.textContent = "Đăng nhập";
    footerPrompt.innerHTML =
      'Chưa có tài khoản? <button onclick="switchTab(\'register\')" class="text-primary-container font-bold hover:underline">Đăng ký ngay</button>';
  } else {
    // Tab Style
    tabRegisterBtn.className =
      "flex-1 py-2 text-xs font-bold rounded-lg transition-all text-primary-container bg-white shadow-sm";
    tabLoginBtn.className =
      "flex-1 py-2 text-xs font-medium rounded-lg transition-all text-on-surface-variant hover:text-on-surface";

    // Form Elements
    formTitle.textContent = "Tạo Tài Khoản";
    formSubtitle.textContent =
      "Bắt đầu 14 ngày dùng thử miễn phí ngay hôm nay.";
    fullNameGroup.classList.remove("hidden");
    fullNameGroup.classList.add("flex");
    fullNameInput.required = true;
    strengthMeterGroup.classList.remove("hidden");
    termsGroup.classList.remove("hidden");
    termsCheckbox.required = true;
    rememberGroup.classList.add("hidden");
    forgotPasswordLink.classList.add("hidden");
    submitBtn.textContent = "Đăng ký";
    footerPrompt.innerHTML =
      'Bạn đã có tài khoản? <button onclick="switchTab(\'login\')" class="text-primary-container font-bold hover:underline">Đăng nhập</button>';

    emailInput.value = "";
    passwordInput.value = "";
  }
}

// Toggle Password Visibility
function togglePassword() {
  const icon = document.getElementById("passwordToggleIcon");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.textContent = "visibility_off";
  } else {
    passwordInput.type = "password";
    icon.textContent = "visibility";
  }
}

// Password Strength Meter

const meters = [
  document.getElementById("meter1"),
  document.getElementById("meter2"),
  document.getElementById("meter3"),
  document.getElementById("meter4"),
];
const strengthLabel = document.getElementById("strengthLabel");

passwordInput.addEventListener("input", (e) => {
  if (currentTab !== "register") return;
  const val = e.target.value;
  let strength = 0;

  if (val.length >= 8) strength++;
  if (val.match(/[A-Z]/)) strength++;
  if (val.match(/[0-9]/)) strength++;
  if (val.match(/[^A-Za-z0-9]/)) strength++;

  meters.forEach((m) => {
    m.className = "strength-meter-bar flex-1 bg-surface-variant";
  });

  if (val.length > 0) {
    if (strength <= 1) {
      meters[0].className = "strength-meter-bar flex-1 bg-error";
      strengthLabel.textContent = "Mật khẩu yếu";
      strengthLabel.className = "text-[11px] text-error";
    } else if (strength === 2) {
      meters[0].className = "strength-meter-bar flex-1 bg-warning";
      meters[1].className = "strength-meter-bar flex-1 bg-warning";
      strengthLabel.textContent = "Mật khẩu trung bình";
      strengthLabel.className = "text-[11px] text-warning";
    } else if (strength === 3) {
      meters[0].className = "strength-meter-bar flex-1 bg-primary-container";
      meters[1].className = "strength-meter-bar flex-1 bg-primary-container";
      meters[2].className = "strength-meter-bar flex-1 bg-primary-container";
      strengthLabel.textContent = "Mật khẩu mạnh";
      strengthLabel.className = "text-[11px] text-primary-container";
    } else {
      meters.forEach(
        (m) => (m.className = "strength-meter-bar flex-1 bg-success"),
      );
      strengthLabel.textContent = "Mật khẩu rất mạnh";
      strengthLabel.className = "text-[11px] text-success";
    }
  } else {
    strengthLabel.textContent = "Mật khẩu tối thiểu phải có 8 ký tự";
    strengthLabel.className = "text-[11px] text-on-surface-variant";
  }
});

// Submit Form
document.getElementById("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");

  btn.textContent =
    currentTab === "login" ? "Đang đăng nhập..." : "Đang tạo tài khoản...";
  btn.disabled = true;
  btn.style.opacity = "0.7";
  console.log(emailInput.value +passwordInput.value )
  try {
    if (currentTab === "login") {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        sessionStorage.setItem("access_token", data.accessToken);
        sessionStorage.setItem("refresh_token", data.refreshToken);
        document.cookie =
          "jwt_token=" + data.accessToken + "; path=/; max-age=3600";
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
      else
        alert("có lỗi xảy ra trong quá trình đăng nhập: ");
    } else {
      alert("Đăng ký thành công! Chào mừng bạn đến với WorkFlow.");
    }
    // btn.textContent = originalText;
    // btn.disabled = false;
    btn.style.opacity = "1";
  } catch (error) {
    console.log("có lỗi xảy ra trong quá trình đăng nhập: " + error);
  }
});
