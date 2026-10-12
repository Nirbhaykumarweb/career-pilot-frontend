function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getHomepagePlans() {
  const store = window.careerPilotStore;
  if (!store) return [];
  const plans = Array.isArray(store.getPlans()) ? store.getPlans() : [];
  return plans.length ? plans : [
    {
      id: "starter",
      name: "Free",
      price: "₹0",
      billingPeriod: "",
      description: "Everything you need to start",
      buttonText: "Start Free",
      buttonLink: "register.html",
      features: [
        "Company Hub access",
        "200 practice questions / month",
        "2 AI mock interviews / month",
        "Basic performance report"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹499",
      billingPeriod: "/mo",
      description: "For students actively sitting in placement season.",
      buttonText: "Get Pro",
      buttonLink: "register.html",
      features: [
        "Unlimited AI mock interviews",
        "AI answer score & feedback",
        "Dynamic follow-up questions",
        "Weak-topic detection",
        "Full performance analytics"
      ]
    },
    {
      id: "institute",
      name: "Institute",
      price: "Custom",
      billingPeriod: "",
      description: "For colleges and training institutes.",
      buttonText: "Contact Us",
      buttonLink: "#footer",
      features: [
        "Placement cell dashboard",
        "Cohort access & analytics",
        "Custom onboarding",
        "Institute support"
      ]
    }
  ];
}

function renderHomepagePricing() {
  const grid = document.getElementById("pricingGrid");
  if (!grid) return;

  const plans = getHomepagePlans();
  const cards = plans.slice(0, 3).map((plan, index) => {
    const isFeatured = index === 1;
    const name = escapeHtml(plan.name || "Plan");
    const price = escapeHtml(plan.price || "₹0");
    const billing = plan.billingPeriod ? escapeHtml(plan.billingPeriod) : "";
    const description = escapeHtml(plan.description || "");
    const buttonText = escapeHtml(plan.buttonText || "Get Started");
    const buttonLink = escapeHtml(plan.buttonLink || "register.html");
    const features = (Array.isArray(plan.features) ? plan.features : [])
      .map((feature) => `<li>${escapeHtml(feature)}</li>`)
      .join("");
    const priceMarkup = billing && !String(plan.price).toLowerCase().includes("custom")
      ? `<b>${price}<span>${billing}</span></b>`
      : `<b>${price}</b>`;

    return `
      <div class="price card${isFeatured ? " featured" : ""}">
        <span>${name}</span>${priceMarkup}<small>${description}</small>
        <ul>${features}</ul>
        <a class="btn${isFeatured ? "" : " outline"}" href="${buttonLink}">${buttonText}</a>
      </div>
    `;
  }).join("");

  grid.innerHTML = cards;
}

window.addEventListener("storage", function (event) {
  if (event.key === "careerPilotStore") {
    renderHomepagePricing();
  }
});

if (document.getElementById("pricingGrid")) {
  renderHomepagePricing();
}

function toggleTheme() {
  document.body.classList.toggle("app-light");
}
const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.getElementById("primary-navigation");
if (menuToggle && primaryNavigation) {
  const closeNavigation = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNavigation.classList.remove("is-open");
  };
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });
  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });
}
function demoLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return false;
  const email = form.elements.email.value.trim();
  const saved = JSON.parse(localStorage.getItem("careerPilotUser") || "{}");
  const name =
    saved.email === email
      ? saved.name
      : email
          .split("@")[0]
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
  localStorage.setItem(
    "careerPilotUser",
    JSON.stringify({ ...saved, name, email }),
  );
  const returnTo = sessionStorage.getItem("careerPilotReturnTo");
  sessionStorage.removeItem("careerPilotReturnTo");
  location.href = returnTo || "student/dashboard.html";
  return false;
}
function demoRegister(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return false;
  const password = form.elements.password.value;
  const confirm = form.elements.confirmPassword.value;
  if (password !== confirm) {
    form.elements.confirmPassword.setCustomValidity("Passwords do not match.");
    form.reportValidity();
    form.elements.confirmPassword.setCustomValidity("");
    return false;
  }
  const selectedCompanies = [
    ...form.querySelectorAll("[data-company-choice].selected"),
  ].map((button) => button.textContent.trim());
  const user = {
    name: form.elements.fullName.value.trim(),
    email: form.elements.email.value.trim(),
    college: form.elements.college.value.trim(),
    role: form.elements.role.value.trim(),
    companies: selectedCompanies,
  };
  localStorage.setItem("careerPilotUser", JSON.stringify(user));
  location.href = "student/dashboard.html";
  return false;
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-company-choice]");
  if (button) button.classList.toggle("selected");
});
let q = 1,
  seconds = 82;
function nextQuestion() {
  q = Math.min(q + 1, 5);
  const qno = document.getElementById("qno");
  if (qno) qno.textContent = q + "/5";
  const question = document.querySelector(".question h3");
  if (question)
    question.textContent = [
      "To start, could you briefly introduce yourself and walk me through your technical background?",
      "Explain one project you are most proud of.",
      "What is the difference between a process and a thread?",
      "How would you optimize a slow database query?",
      "Do you have any questions for me?",
    ][q - 1];
  const label = document.querySelector(".question small");
  if (label) label.textContent = "◉ QUESTION " + q;
}
function endInterview() {
  const requestedRound = new URLSearchParams(location.search).get("round");
  const round = ["technical", "dsa", "project", "hr"].includes(requestedRound)
    ? requestedRound
    : "technical";
  const company = (
    localStorage.getItem("careerPilotCompany") || "tcs"
  ).toUpperCase();
  const record = {
    id: Date.now().toString(),
    round,
    company,
    score: 82,
    date: new Date().toISOString(),
  };
  localStorage.setItem("careerPilotLastInterview", JSON.stringify(record));
  location.href = "interview-report.html";
}
setInterval(() => {
  if (document.getElementById("timer")) {
    seconds = Math.max(0, seconds - 1);
    let m = String(Math.floor(seconds / 60)).padStart(2, "0"),
      s = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer").textContent = m + ":" + s;
    const sideTimer = document.getElementById("sideTimer");
    if (sideTimer) sideTimer.textContent = m + ":" + s;
  }
}, 1000);
