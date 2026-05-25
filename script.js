const root = document.documentElement;
const header = document.querySelector(".site-header");
const progress = document.querySelector(".progress");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const themeToggle = document.querySelector(".theme-toggle");
const copyButtons = [...document.querySelectorAll(".copy-wechat")];
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".desktop-nav a")];

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

function updateChrome() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  if (progress) {
    progress.style.width = `${ratio}%`;
  }

  if (header) {
    header.dataset.elevated = "true";
  }
}

function updateActiveNav() {
  if (!sections.length) return;

  let current = sections[0].id;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 130) {
      current = section.id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", () => {
  updateChrome();
  updateActiveNav();
});

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileNav?.dataset.open === "true";
  if (!mobileNav) return;

  mobileNav.dataset.open = isOpen ? "false" : "true";
  menuToggle.setAttribute("aria-label", isOpen ? "打开导航" : "关闭导航");
});

mobileNav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    mobileNav.dataset.open = "false";
    menuToggle?.setAttribute("aria-label", "打开导航");
  }
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "" : "dark";
  if (nextTheme) {
    root.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  } else {
    delete root.dataset.theme;
    localStorage.removeItem("theme");
  }
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const original = button.textContent;

    try {
      await navigator.clipboard.writeText(value);
      button.textContent = "微信：已复制";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1600);
    } catch {
      button.textContent = value;
    }
  });
});

updateChrome();
updateActiveNav();
