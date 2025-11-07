// Mobile Menu Toggle with Accessibility
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const nav = document.getElementById("nav");

if (mobileMenuToggle && nav) {
  mobileMenuToggle.addEventListener("click", function () {
    const isExpanded = this.getAttribute("aria-expanded") === "true";
    this.classList.toggle("active");
    nav.classList.toggle("active");
    this.setAttribute("aria-expanded", !isExpanded);
    this.setAttribute(
      "aria-label",
      !isExpanded
        ? "Fermer le menu de navigation"
        : "Ouvrir le menu de navigation"
    );
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      nav.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      mobileMenuToggle.setAttribute(
        "aria-label",
        "Ouvrir le menu de navigation"
      );
    }
  });

  // Close mobile menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      nav.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      mobileMenuToggle.setAttribute(
        "aria-label",
        "Ouvrir le menu de navigation"
      );
      mobileMenuToggle.focus();
    }
  });
}

// Dropdown menu with Accessibility
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");

if (dropdownToggle && dropdownMenu) {
  function toggleDropdown(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const isExpanded =
        dropdownToggle.getAttribute("aria-expanded") === "true";
      dropdownMenu.classList.toggle("active");
      dropdownToggle.setAttribute("aria-expanded", !isExpanded);
    }
  }

  dropdownToggle.addEventListener("click", toggleDropdown);

  // Keyboard navigation for dropdown
  dropdownToggle.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown(e);
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !dropdownToggle.contains(e.target) &&
      !dropdownMenu.contains(e.target)
    ) {
      dropdownMenu.classList.remove("active");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Desktop hover: keep open when moving from link to menu, close on mouseout
  const dropdownItem = dropdownToggle.closest('.nav-item.dropdown');
  if (dropdownItem) {
    let closeTimeoutId = null;

    function openDropdown() {
      dropdownItem.classList.add('open');
      dropdownToggle.setAttribute('aria-expanded', 'true');
    }

    function scheduleClose() {
      // small delay to allow diagonal mouse movements without flicker
      closeTimeoutId = window.setTimeout(() => {
        dropdownItem.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }, 120);
    }

    function cancelClose() {
      if (closeTimeoutId) {
        window.clearTimeout(closeTimeoutId);
        closeTimeoutId = null;
      }
    }

    // Only apply on desktop widths
    function bindDesktopHover() {
      if (window.innerWidth > 768) {
        dropdownItem.addEventListener('mouseenter', openDropdown);
        dropdownItem.addEventListener('mouseleave', scheduleClose);
        dropdownMenu.addEventListener('mouseenter', cancelClose);
        dropdownMenu.addEventListener('mouseleave', scheduleClose);
      }
    }

    bindDesktopHover();
    window.addEventListener('resize', () => {
      // Close when switching layouts
      if (window.innerWidth <= 768) {
        dropdownItem.classList.remove('open');
        dropdownMenu.classList.remove('active');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Smooth scrolling for anchor links with offset for sticky header
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#" || !href) return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL without triggering scroll
      history.pushState(null, null, href);

      // Focus the target element for accessibility
      target.setAttribute("tabindex", "-1");
      target.focus();
      target.addEventListener(
        "blur",
        function () {
          target.removeAttribute("tabindex");
        },
        { once: true }
      );
    }
  });
});

// Button navigation handlers (buttons are now links but keeping for backwards compatibility)
document
  .querySelectorAll(
    "button.cta-button, button.cta-button-red, button.service-button"
  )
  .forEach((button) => {
    button.addEventListener("click", function () {
      const href = this.getAttribute("data-href");
      if (href) {
        window.location.href = href;
      }
    });
  });

// Add active class to current page in navigation
function updateActiveNavItem() {
  const currentLocation = window.location.pathname;
  const navItems = document.querySelectorAll(".nav-item a");

  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    item.removeAttribute("aria-current");
    item.parentElement.classList.remove("active");

    // Check if current page matches
    if (
      currentLocation.endsWith(href) ||
      (href === "index.html" && currentLocation.endsWith("/")) ||
      currentLocation.endsWith("/index.html") ||
      (currentLocation.includes(href) && href !== "#")
    ) {
      item.parentElement.classList.add("active");
      item.setAttribute("aria-current", "page");
    }
  });
}

// Update navigation on page load
updateActiveNavItem();

// Keyboard navigation improvements
document.addEventListener("keydown", function (e) {
  // Skip to main content with Alt+M (or Cmd+M on Mac)
  if ((e.altKey || e.metaKey) && e.key === "m") {
    e.preventDefault();
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
    }
  }
});

// Improve form accessibility
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    const requiredFields = contactForm.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.setAttribute("aria-invalid", "true");
        field.classList.add("error");
      } else {
        field.removeAttribute("aria-invalid");
        field.classList.remove("error");
      }
    });

    if (isValid) {
      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "form-success";
      successMessage.setAttribute("role", "alert");
      successMessage.textContent =
        "Merci pour votre message! Nous vous répondrons dans les plus brefs délais.";
      contactForm.insertAdjacentElement("beforebegin", successMessage);

      // Focus the success message
      successMessage.setAttribute("tabindex", "-1");
      successMessage.focus();

      // Reset form
      contactForm.reset();

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    } else {
      // Focus first invalid field
      const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });
}

// Lazy loading images fallback for older browsers
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const SCROLL_THRESHOLD = 40; // trigger after scrolling 40px

  function updateHeaderState() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // initial check + listen
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  // Parallax effect for hero backgrounds (home + other pages)
  const parallaxSections = Array.from(
    document.querySelectorAll('.hero-mining, .page-hero')
  );
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (parallaxSections.length && !prefersReducedMotion) {
    let ticking = false;

    function updateParallax() {
      const y = window.scrollY * 0.3; // smaller factor = slower movement
      parallaxSections.forEach((el) => {
        // Offset from vertical center so images stay focused on center
        el.style.backgroundPosition = `center calc(100% ${y === 0 ? '' : y > 0 ? `- ${y}px` : `+ ${Math.abs(y)}px`})`;
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    // Initial position and listener
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Navigation: set only the matching nav-item to active based on current page
  const navLinks = document.querySelectorAll(".nav-list a");
  const currentPath = window.location.pathname;
  const currentFile = (
    currentPath.split("/").pop() || "index.html"
  ).toLowerCase();

  navLinks.forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    const hrefFile = (href.split("/").pop() || "").split("#")[0].toLowerCase();

    const li = anchor.closest(".nav-item");
    if (!li) return;

    li.classList.remove("active");
    anchor.removeAttribute("aria-current");

    if (
      (hrefFile && hrefFile === currentFile) ||
      (currentFile === "" && (hrefFile === "" || hrefFile === "index.html")) ||
      (currentFile === "index.html" &&
        (hrefFile === "" || hrefFile === "index.html"))
    ) {
      li.classList.add("active");
      anchor.setAttribute("aria-current", "page");
    }
  });

  // Dynamically update copyright year
  const copyrightYearElements = document.querySelectorAll(".copyright-year");
  const currentYear = new Date().getFullYear();
  
  copyrightYearElements.forEach((element) => {
    element.textContent = currentYear.toString();
  });
});
