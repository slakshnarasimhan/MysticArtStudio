const fadeInElements = document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window && fadeInElements.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeInElements.forEach((el) => observer.observe(el));
}

const heroScroll = document.querySelector(".hero-scroll");
if (heroScroll) {
  heroScroll.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        heroScroll.scrollLeft += event.deltaY;
      }
    },
    { passive: false }
  );
}

const filterGroups = document.querySelectorAll("[data-filter-group]");
if (filterGroups.length) {
  const cards = document.querySelectorAll("[data-art-card]");

  const applyFilters = () => {
    const activeFilters = {};
    filterGroups.forEach((group) => {
      const active = group.querySelector("button[data-active='true']");
      if (active) {
        activeFilters[group.dataset.filterGroup] = active.dataset.value;
      }
    });

    cards.forEach((card) => {
      const match = Object.entries(activeFilters).every(([key, value]) => {
        if (value === "all") return true;
        return card.dataset[key] === value;
      });
      card.style.display = match ? "block" : "none";
    });
  };

  filterGroups.forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-value]");
      if (!button) return;

      group.querySelectorAll("button[data-value]").forEach((btn) => {
        btn.dataset.active = "false";
        btn.classList.remove("bg-[#1E1E1E]", "text-white");
        btn.classList.add("text-[#1E1E1E]");
      });

      button.dataset.active = "true";
      button.classList.add("bg-[#1E1E1E]", "text-white");
      button.classList.remove("text-[#1E1E1E]");
      applyFilters();
    });
  });

  applyFilters();
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.querySelector("[data-lightbox-close]");

if (lightbox && lightboxImage) {
  const openLightbox = (src, alt) => {
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.add("hidden");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => {
      openLightbox(img.dataset.lightbox, img.dataset.lightboxAlt);
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.classList.contains("hidden")) {
      closeLightbox();
    }
  });
}

const mobileToggle = document.querySelector("[data-mobile-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (mobileToggle && mobileMenu) {
  const closeMenu = () => {
    mobileMenu.classList.add("hidden");
    mobileToggle.setAttribute("aria-expanded", "false");
  };

  mobileToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    if (isOpen) {
      closeMenu();
    } else {
      mobileMenu.classList.remove("hidden");
      mobileToggle.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !mobileMenu.classList.contains("hidden") &&
      !mobileMenu.contains(event.target) &&
      !mobileToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}
