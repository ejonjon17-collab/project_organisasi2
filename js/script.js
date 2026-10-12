const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function setTheme(theme, persist = true) {
  const isDark = theme === "dark";

  root.dataset.theme = isDark ? "dark" : "light";

  if (themeToggle) {
    themeToggle.textContent = isDark ? "☀ Mode Terang" : "☾ Mode Gelap";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  if (persist) {
    try {
      localStorage.setItem("harmoni-theme", isDark ? "dark" : "light");
    } catch (error) {
      console.warn("Preferensi tema tidak dapat disimpan di browser ini.", error);
    }
  }
}

if (themeToggle) {
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("harmoni-theme");
  } catch (error) {
    console.warn("Preferensi tema tidak dapat dibaca dari browser ini.", error);
  }

  setTheme(savedTheme === "dark" ? "dark" : "light", false);
  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}

function setMenuOpen(isOpen) {
  if (!menuToggle || !navLinks) {
    return;
  }

  navLinks.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
  menuToggle.textContent = isOpen ? "×" : "☰";
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });
}

document.querySelectorAll(".current-year").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const nameInput = contactForm.elements.namedItem("nama");
  const emailInput = contactForm.elements.namedItem("email");
  const messageInput = contactForm.elements.namedItem("pesan");
  const formStatus = document.getElementById("status-form");
  const fields = [nameInput, emailInput, messageInput];

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      if (formStatus) {
        formStatus.textContent = "";
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = [];

    fields.forEach((field) => {
      const isEmpty = field.value.trim() === "";
      const isInvalidEmail = field === emailInput && !field.validity.valid;
      const isInvalid = isEmpty || isInvalidEmail;

      field.toggleAttribute("aria-invalid", isInvalid);

      if (isInvalid) {
        invalidFields.push(field);
      }
    });

    if (invalidFields.length > 0) {
      if (formStatus) {
        formStatus.textContent = "Periksa kembali nama, alamat email, dan pesan Anda.";
      }
      invalidFields[0].focus();
      return;
    }

    if (formStatus) {
      formStatus.textContent = "Pesan berhasil diperiksa. Formulir demo ini belum mengirim pesan.";
    }
    contactForm.reset();
  });
}