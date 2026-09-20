// ---------- Mobile nav ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.06}s`;
  io.observe(el);
});

// ---------- Animated counters ----------
const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      counterIO.unobserve(el);
      const target = parseFloat(el.dataset.target);
      const decimals = String(el.dataset.target).includes(".") ? 1 : 0;
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".counter").forEach((el) => counterIO.observe(el));

// ---------- Waitlist forms ----------
function wireWaitlist(formId, emailId, noteId) {
  const form = document.getElementById(formId);
  const email = document.getElementById(emailId);
  const note = document.getElementById(noteId);
  const originalNote = note.textContent;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const value = email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!valid) {
      email.classList.add("error");
      note.textContent = "Please enter a valid email address.";
      note.classList.remove("success");
      return;
    }
    email.classList.remove("error");
    note.textContent = "🎉 You're on the list! Check your inbox for confirmation.";
    note.classList.add("success");
    email.value = "";
    setTimeout(() => {
      note.textContent = originalNote;
      note.classList.remove("success");
    }, 6000);
  });
  email.addEventListener("input", () => email.classList.remove("error"));
}
wireWaitlist("waitlistForm", "waitlistEmail", "formNote");
wireWaitlist("waitlistForm2", "waitlistEmail2", "formNote2");

// ---------- Pricing toggle ----------
const toggleBtns = document.querySelectorAll(".toggle-btn");
const amounts = document.querySelectorAll(".price .amount");
toggleBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    toggleBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const mode = btn.dataset.billing; // monthly | yearly
    amounts.forEach((a) => {
      a.textContent = mode === "yearly" ? a.dataset.yearly : a.dataset.monthly;
    });
  })
);

// ---------- FAQ accordion ----------
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  // wrap answer text for smooth animation
  const inner = document.createElement("div");
  inner.className = "faq-a-inner";
  inner.innerHTML = a.innerHTML;
  a.innerHTML = "";
  a.appendChild(inner);
  q.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add("open");
      a.style.maxHeight = inner.scrollHeight + "px";
    }
  });
});

// ---------- Dark mode ----------
const themeToggle = document.getElementById("themeToggle");
const themeColorMeta = document.getElementById("themeColorMeta");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  if (themeColorMeta) themeColorMeta.setAttribute("content", theme === "dark" ? "#090c16" : "#f6f7fb");
  try { localStorage.setItem("northline-theme", theme); } catch (err) { /* private mode */ }
}
themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});
// sync toggle state with the pre-paint theme chosen in <head>
applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
