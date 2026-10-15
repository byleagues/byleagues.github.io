/* ByLeagues portfolio — arayüz davranışları */
const revealItems = document.querySelectorAll(".reveal");
const scrollProgressBar = document.querySelector("[data-scroll-progress-bar]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const backToTopButton = document.querySelector("[data-back-to-top]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const t = (key) => (window.i18n ? window.i18n.t(key) : key);

const setupExpertiseSpotlight = () => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.querySelectorAll(".expertise-item").forEach(card => {
    let bounds;
    const updatePosition = event => {
      if (prefersReducedMotion.matches || !bounds) return;
      card.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
    };

    card.addEventListener("pointerenter", event => {
      bounds = card.getBoundingClientRect();
      updatePosition(event);
    });
    card.addEventListener("pointermove", updatePosition);
    card.addEventListener("pointerleave", () => { bounds = null; });
  });
};


const THEME_STORAGE_KEY = "byleagues-theme";

const setupThemeToggle = () => {
  if (!themeToggle) {
    return;
  }

  const root = document.documentElement;
  const applyTheme = theme => {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    themeToggle.setAttribute("aria-pressed", String(theme === "light"));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#fafafc" : "#0b0b10");
  };

  let storedTheme = null;
  try {
    storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    storedTheme = null;
  }
  const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
  applyTheme(storedTheme === "light" || storedTheme === "dark" ? storedTheme : (systemTheme.matches ? "light" : "dark"));
  systemTheme.addEventListener("change", event => {
    try {
      if (window.localStorage.getItem(THEME_STORAGE_KEY)) return;
    } catch (_) {}
    applyTheme(event.matches ? "light" : "dark");
  });

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      /* tema kaydedilemezse sadece kalıcı olmaz */
    }
  });
};

const setupScrollProgress = () => {
  if (!scrollProgressBar) {
    return;
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress / 100))})`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
};

const setupBackToTop = () => {
  if (!backToTopButton) {
    return;
  }

  const toggleVisibility = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    backToTopButton.classList.toggle("is-visible", scrollTop > 480);
  };

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  });
};

/* Navbar: kaydırınca belirginleşir, görünen bölümün bağlantısı aktif olur */
const setupNavbar = () => {
  const topbar = document.querySelector("[data-topbar]");
  const links = [...document.querySelectorAll(".nav-link")];
  const menuToggle = document.querySelector("[data-nav-toggle]");
  const pageContent = document.querySelector("main");
  const footer = document.querySelector(".site-footer");
  if (!topbar) {
    return;
  }

  const closeMenu = (restoreFocus = false) => {
    const wasOpen = topbar.classList.contains("is-menu-open");
    if (!wasOpen) return;
    topbar.classList.remove("is-menu-open");
    document.body.classList.remove("menu-open");
    if (pageContent) pageContent.inert = false;
    if (footer) footer.inert = false;
    if (backToTopButton) backToTopButton.inert = false;
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", t("nav.open"));
    menuToggle?.setAttribute("title", t("nav.open"));
    if (restoreFocus && wasOpen) menuToggle?.focus();
  };

  menuToggle?.addEventListener("click", () => {
    if (topbar.classList.contains("is-menu-open")) {
      closeMenu(true);
      return;
    }
    topbar.classList.add("is-menu-open");
    document.body.classList.add("menu-open");
    if (pageContent) pageContent.inert = true;
    if (footer) footer.inert = true;
    if (backToTopButton) backToTopButton.inert = true;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", t("nav.close"));
    menuToggle.setAttribute("title", t("nav.close"));
    links[0]?.focus();
  });
  links.forEach(link => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("click", event => {
    if (!topbar.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (!topbar.classList.contains("is-menu-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === "Tab") {
      const focusables = [...topbar.querySelectorAll("a, button")].filter(el => el.getClientRects().length && !el.disabled);
      const first = focusables[0];
      const last = focusables.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  document.addEventListener("languagechange", () => {
    const label = t(topbar.classList.contains("is-menu-open") ? "nav.close" : "nav.open");
    menuToggle?.setAttribute("aria-label", label);
    menuToggle?.setAttribute("title", label);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) closeMenu();
  });

  const targets = links
    .map(link => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(item => item.section);

  const update = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 12);

    const marker = window.innerHeight * 0.35;
    let active = null;
    targets.forEach(item => {
      if (item.section.getBoundingClientRect().top <= marker) {
        active = item;
      }
    });
    links.forEach(link => {
      const isActive = active && active.link === link;
      link.classList.toggle("is-active", Boolean(isActive));
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  let updateQueued = false;
  const scheduleUpdate = () => {
    if (updateQueued) return;
    updateQueued = true;
    window.requestAnimationFrame(() => {
      updateQueued = false;
      update();
    });
  };
  update();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
};

/* İletişim formu: web3forms'a gerçekten gönderir, mesajlar seçili dilde gösterilir */
const setupContactForm = () => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) {
    return;
  }

  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector(".form-submit-btn");
  const submitLabel = submitButton.querySelector("span");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let statusKey = null;
  let submitting = false;

  const showStatus = (key, type) => {
    statusKey = key;
    status.textContent = key ? t(key) : "";
    status.dataset.type = key ? type : "";
  };

  const fieldError = (field, key) => {
    field.classList.toggle("is-invalid", Boolean(key));
    field.setAttribute("aria-invalid", key ? "true" : "false");
    const error = field.parentElement.querySelector(".field-error");
    if (error) {
      error.dataset.errorKey = key || "";
      error.textContent = key ? t(key) : "";
    }
  };

  const validate = () => {
    let firstInvalid = null;
    let errorKey = null;
    form.querySelectorAll("input[required], textarea[required]").forEach(field => {
      const value = field.value.trim();
      let key = null;
      if (!value) {
        key = "form.required";
      } else if (field.type === "email" && !emailPattern.test(value)) {
        key = "form.invalidEmail";
      }
      fieldError(field, key);
      if (key && !firstInvalid) {
        firstInvalid = field;
        errorKey = key;
      }
    });
    if (firstInvalid) {
      showStatus(errorKey, "error");
      firstInvalid.focus();
    }
    return !firstInvalid;
  };

  form.querySelectorAll("input, textarea").forEach(field => {
    field.addEventListener("input", () => {
      fieldError(field, null);
      if (status.dataset.type === "error") {
        showStatus(null);
      }
    });
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitting) return;
    if (!validate()) {
      return;
    }

    submitting = true;
    submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    submitLabel.textContent = t("form.sending");
    showStatus(null);

    try {
      const data = new FormData(form);
      data.delete("redirect");
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      });
      const result = await response.json();
      if (response.ok && result.success) {
        form.reset();
        form.querySelectorAll("input[required], textarea[required]").forEach(field => fieldError(field, null));
        showStatus("form.success", "success");
      } else {
        showStatus("form.error", "error");
      }
    } catch (error) {
      showStatus("form.network", "error");
    } finally {
      submitting = false;
      submitButton.disabled = false;
      form.removeAttribute("aria-busy");
      submitLabel.textContent = t("form.submit");
    }
  });

  document.addEventListener("languagechange", () => {
    if (statusKey) {
      status.textContent = t(statusKey);
    }
    form.querySelectorAll(".field-error").forEach(error => {
      if (error.dataset.errorKey) error.textContent = t(error.dataset.errorKey);
    });
    if (submitting) submitLabel.textContent = t("form.sending");
  });
};

/* Discord profil kartı */
const setupDiscordCard = () => {
  const DISCORD_ID = "1206667799213248575";
  const modal = document.querySelector("#discord-card");
  if (!modal) {
    return;
  }

  const nameEl = modal.querySelector("[data-discord-name]");
  const handleEl = modal.querySelector("[data-discord-handle]");
  const avatarEl = modal.querySelector("[data-discord-avatar]");
  const statusEl = modal.querySelector("[data-discord-status]");
  let loaded = false;
  let lastTrigger = null;
  const background = [document.querySelector("[data-topbar]"), document.querySelector("main"), document.querySelector(".site-footer"), backToTopButton].filter(Boolean);
  let previousInert = [];

  const open = trigger => {
    lastTrigger = trigger || null;
    previousInert = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    modal.hidden = false;
    document.body.classList.add("discord-open");
    modal.querySelector(".discord-back")?.focus();
    if (!loaded) {
      loadProfile();
    }
  };

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("discord-open");
    background.forEach((element, index) => { element.inert = previousInert[index]; });
    lastTrigger?.focus();
  };

  /* Lanyard (sunucusuna katıldıysan) canlı isim, avatar ve durumu getirir; olmazsa varsayılanlar kalır. */
  const loadProfile = async () => {
    loaded = true;
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      if (!response.ok) throw new Error("Discord profile unavailable");
      const json = await response.json();
      if (!json.success || !json.data?.discord_user) throw new Error("Discord profile unavailable");
      const { discord_user: user, discord_status: status } = json.data;
      nameEl.textContent = user.global_name || user.username;
      handleEl.textContent = `@${user.username}`;
      if (user.avatar) {
        avatarEl.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}.png?size=256`;
      }
      if (["online", "idle", "dnd", "offline"].includes(status)) {
        statusEl.dataset.state = status;
        statusEl.hidden = false;
      }
    } catch (error) {
      loaded = false;
    }
  };

  document.querySelectorAll("[data-discord-open]").forEach(el => {
    el.addEventListener("click", event => {
      event.preventDefault();
      open(el);
    });
  });
  modal.querySelectorAll("[data-discord-close]").forEach(el => el.addEventListener("click", close));
  document.addEventListener("keydown", event => {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      const focusables = [...modal.querySelectorAll("a[href], button:not([disabled])")];
      const first = focusables[0];
      const last = focusables.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
};

setupThemeToggle();
setupExpertiseSpotlight();
setupScrollProgress();
setupBackToTop();
setupNavbar();
setupContactForm();
setupDiscordCard();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}
