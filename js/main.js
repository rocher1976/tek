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

const dropdownItems = document.querySelectorAll(".nav-item.dropdown");

if (dropdownToggle && dropdownMenu) {
  function toggleDropdown(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdownMenu.classList.add("active");
      dropdownToggle.setAttribute("aria-expanded", "true");
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

    function updateDropdownForViewport() {
      if (window.innerWidth <= 768) {
        dropdownItem.classList.remove('open');
        dropdownMenu.classList.add('active');
        dropdownToggle.setAttribute('aria-expanded', 'true');
      } else {
        dropdownMenu.classList.remove('active');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    }

    bindDesktopHover();
    updateDropdownForViewport();
    window.addEventListener('resize', updateDropdownForViewport);
    document.addEventListener('click', (event) => {
      if (
        window.innerWidth > 768 &&
        !dropdownItem.contains(event.target)
      ) {
        dropdownItem.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }
}

// Ensure dropdown menus remain active on mobile navigation regardless of which dropdown is present
function syncMobileDropdownState() {
  const shouldForceOpen = window.innerWidth <= 768;

  dropdownItems.forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle");
    const menu = item.querySelector(".dropdown-menu");
    if (!toggle || !menu) return;

    if (shouldForceOpen) {
      menu.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
    } else if (!item.classList.contains("open")) {
      menu.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

window.addEventListener("resize", syncMobileDropdownState);
syncMobileDropdownState();

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
    const isDesktop = window.innerWidth > 768;
    if (isDesktop && window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("scrolled");
    } else if (!isDesktop) {
      header.classList.remove("scrolled");
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

  const normalizePath = (path) => {
    if (!path) return "/";
    let pathname;
    try {
      pathname = new URL(path, window.location.origin).pathname;
    } catch (e) {
      pathname = path;
    }
    pathname = pathname.replace(/index\.html$/i, "");
    if (!pathname.startsWith("/")) {
      pathname = `/${pathname}`;
    }
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.replace(/\/+$/, "/");
    }
    if (!pathname.endsWith("/")) {
      pathname = `${pathname}/`;
    }
    return pathname;
  };

  const currentPath = normalizePath(window.location.pathname);

  navLinks.forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href) return;

    const targetPath = normalizePath(href);
    const li = anchor.closest(".nav-item");
    if (!li) return;

    li.classList.remove("active");
    anchor.removeAttribute("aria-current");

    if (currentPath === targetPath) {
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
