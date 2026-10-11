document.addEventListener("DOMContentLoaded", () => {
  const EMAIL_ADDRESS = "bhanupratapjonwar@gmail.com";

  let audioContext = null;
  let isSoundEnabled = localStorage.getItem("bp_sound_pref") !== "muted";
  if (!isSoundEnabled) {
    document.body.classList.add("muted");
  }

  function playUiSound(type = "click") {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContext) {
        audioContext = new AudioCtx();
      }
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      const now = audioContext.currentTime;
      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "modal") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }

  const audioToggleBtn = document.getElementById("audio-toggle-btn");
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", () => {
      isSoundEnabled = !isSoundEnabled;
      document.body.classList.toggle("muted", !isSoundEnabled);
      localStorage.setItem("bp_sound_pref", isSoundEnabled ? "enabled" : "muted");
      showToast(isSoundEnabled ? "Sound effects enabled 🔊" : "Sound effects muted 🔇");
      if (isSoundEnabled) playUiSound("click");
    });
  }

  const themes = ["dark", "light"];
  const savedTheme = localStorage.getItem("bp_theme_pref") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
      const nextTheme = themes[nextIndex];
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("bp_theme_pref", nextTheme);
      playUiSound("click");
      showToast(`Switched theme to ${nextTheme.toUpperCase()}`);
    });
  }

  const typingElement = document.getElementById("typing-role");
  const roles = [
    "Frontend Web Developer",
    "UI/UX & Creative Designer",
    "OASIS INFOBYTE Intern (Task 2)",
    "MCA Scholar @ ITM University",
    "Modern Web Architecture Enthusiast"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function typeEffect() {
    if (!typingElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingDelay = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 420;
    }

    setTimeout(typeEffect, typingDelay);
  }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typingElement) {
    if (prefersReducedMotion) {
      typingElement.textContent = "Aspiring Software Engineer";
    } else {
      typeEffect();
    }
  }

  const progressBar = document.getElementById("scroll-progress");
  const header = document.querySelector(".site-header");
  const backToTopBtn = document.getElementById("back-to-top");
  const scrollRingCircle = document.getElementById("scroll-ring-circle");
  const ringCircumference = 2 * Math.PI * 23;

  if (scrollRingCircle) {
    scrollRingCircle.style.strokeDasharray = `${ringCircumference}`;
  }

  function onScrollHandler() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    if (scrollRingCircle) {
      const offset = ringCircumference - progress * ringCircumference;
      scrollRingCircle.style.strokeDashoffset = `${offset}`;
    }

    if (header) {
      header.classList.toggle("scrolled", scrollTop > 35);
    }

    if (backToTopBtn) {
      backToTopBtn.classList.toggle("visible", scrollTop > 400);
    }
  }

  window.addEventListener("scroll", onScrollHandler, { passive: true });
  onScrollHandler();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      playUiSound("click");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    function toggleMobileMenu(open) {
    if (!mobileDrawer) return;
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains("open");
    mobileDrawer.classList.toggle("open", isOpen);
    mobileDrawer.setAttribute("aria-hidden", (!isOpen).toString());
    if (mobileOverlay) mobileOverlay.classList.toggle("active", isOpen);
    if (mobileToggle) {
      mobileToggle.classList.toggle("active", isOpen);
      mobileToggle.setAttribute("aria-expanded", isOpen.toString());
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) playUiSound("modal");
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => toggleMobileMenu());
  }
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener("click", () => toggleMobileMenu(false));
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", () => toggleMobileMenu(false));
  }
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(false));
  });

  const sections = document.querySelectorAll("section[id]");
  const desktopLinks = document.querySelectorAll(".nav-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          desktopLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${id}`);
          });
          mobileNavLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-30% 0px -40% 0px", threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));

  const portraitCard = document.getElementById("portrait-card");
  if (portraitCard && window.matchMedia("(pointer: fine)").matches) {
    portraitCard.addEventListener("mousemove", (e) => {
      const rect = portraitCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 14;
      const rotateY = (x / rect.width) * 14;
      portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    portraitCard.addEventListener("mouseleave", () => {
      portraitCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  }

  const revealElements = document.querySelectorAll(".r");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          const progressFills = entry.target.querySelectorAll(".skill-progress-fill");
          progressFills.forEach((fill) => {
            const pct = fill.style.getPropertyValue("--pct") || "90%";
            fill.style.width = pct;
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  const skillFilterBtns = document.querySelectorAll(".skill-filter-btn");
  const skillCards = document.querySelectorAll(".skill-category-card");

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      playUiSound("click");
      skillFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      skillCards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === "all" || filter === cat) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });

  const projectFilterBtns = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      playUiSound("click");
      projectFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;
      projectCards.forEach((card) => {
        const cardCat = card.dataset.category;
        if (category === "all" || category === cardCat) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });

  // Experience & Academic Credentials Interactive Accordion
  const expItems = document.querySelectorAll(".exp-item");
  const expToggleAllBtn = document.getElementById("exp-toggle-all-btn");
  const expToggleText = document.getElementById("exp-toggle-text");

  expItems.forEach((item) => {
    const header = item.querySelector(".exp-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isExpanded = item.classList.contains("expanded");
      item.classList.toggle("expanded", !isExpanded);
      header.setAttribute("aria-expanded", (!isExpanded).toString());
      playUiSound("pop");
    });

    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });

    item.addEventListener("mouseenter", () => {
      if (!item.classList.contains("expanded")) {
        playUiSound("hover");
      }
    });
  });

  if (expToggleAllBtn) {
    let allExpanded = false;
    expToggleAllBtn.addEventListener("click", () => {
      allExpanded = !allExpanded;
      expItems.forEach((item) => {
        item.classList.toggle("expanded", allExpanded);
        const header = item.querySelector(".exp-header");
        if (header) {
          header.setAttribute("aria-expanded", allExpanded.toString());
        }
      });
      if (expToggleText) {
        expToggleText.textContent = allExpanded ? "Collapse All" : "Expand All";
      }
      playUiSound("click");
    });
  }

  const toastContainer = document.getElementById("toast-container");
  function showToast(message, icon = "✓") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span style="color: var(--primary-light); font-weight: bold;">${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fadeout");
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  function copyTextToClipboard(text, successMessage) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        playUiSound("success");
        showToast(successMessage);
      }).catch(() => fallbackCopy(text, successMessage));
    } else {
      fallbackCopy(text, successMessage);
    }
  }

  function fallbackCopy(text, successMessage) {
    const input = document.createElement("textarea");
    input.value = text;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.focus();
    input.select();
    try {
      document.execCommand("copy");
      playUiSound("success");
      showToast(successMessage);
    } catch (e) {
      showToast("Unable to copy automatically.", "!");
    }
    document.body.removeChild(input);
  }

  const quickCopyEmailBtn = document.getElementById("quick-copy-email-btn");
  if (quickCopyEmailBtn) {
    quickCopyEmailBtn.addEventListener("click", () => {
      copyTextToClipboard(EMAIL_ADDRESS, `Copied email (${EMAIL_ADDRESS}) to clipboard!`);
    });
  }

  const aboutCopyEmailBtn = document.getElementById("about-copy-email-btn");
  if (aboutCopyEmailBtn) {
    aboutCopyEmailBtn.addEventListener("click", () => {
      copyTextToClipboard(EMAIL_ADDRESS, `Copied direct email (${EMAIL_ADDRESS}) to clipboard!`);
    });
  }

  const copyChannelEmailBtn = document.getElementById("copy-channel-email-btn");
  if (copyChannelEmailBtn) {
    copyChannelEmailBtn.addEventListener("click", () => {
      copyTextToClipboard(EMAIL_ADDRESS, `Copied direct email to clipboard!`);
    });
  }

  const projectModalOverlay = document.getElementById("project-modal-overlay");
  const projectModalTitle = document.getElementById("modal-project-title");
  const projectModalTag = document.getElementById("modal-project-tag");
  const projectModalBody = document.getElementById("modal-project-body");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalActionBtn = document.getElementById("modal-action-btn");

  const projectData = {
    dunemark: {
      title: "Dunemark — Offline-First Expedition & Travel Journal",
      tag: "Oasis Infobyte • Level 1 Task 1",
      github: "https://github.com/bhanujonwar/OIBSIP/tree/main/WebDev-L1-LandingPage",
      demoUrl: "../WebDev-L1-LandingPage/index.html",
      bodyHtml: `
        <p style="font-size: 1.05rem; color: var(--text-main); line-height: 1.75;">
          Dunemark is a high-end luxury editorial landing page engineered for an offline-first travel journal mobile application. Built using clean semantic HTML5, externalized CSS3 design tokens, and modular vanilla JavaScript.
        </p>
        <div class="interactive-demo-box">
          <div class="demo-box-header">
            <span>Verified Task 1 Modules</span>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--primary-light);">100% OFFLINE READY</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; text-align: center;">
            <div style="background: rgba(255,255,255,0.04); padding: 0.85rem; border-radius: var(--radius-sm);">
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-light);">4,320m</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">Kunzum Pass GPS</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); padding: 0.85rem; border-radius: var(--radius-sm);">
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--secondary-light);">4 Days</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">Itinerary Routes</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); padding: 0.85rem; border-radius: var(--radius-sm);">
              <div style="font-size: 1.25rem; font-weight: 800; color: #fbbf24;">4 Colors</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">Leather Swatches</div>
            </div>
          </div>
        </div>
        <h4 style="font-size: 1.05rem; color: var(--primary-light); margin-top: 0.5rem;">Key Engineering Implementations:</h4>
        <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-muted);">
          <li>Simulated iPhone audio memo player with animated bouncing waveforms and timecode tracking.</li>
          <li>Interactive day itinerary switcher updating distance, ascent gain, and elevation metrics.</li>
          <li>Real 3D hardcover book mouse-perspective with live leather swatch picker and dual-page preview.</li>
          <li>Offline synthesized alpine soundscape generator using HTML5 Web Audio API.</li>
        </ul>
        <div style="margin-top: 0.75rem;">
          <a href="../WebDev-L1-LandingPage/index.html" target="_blank" rel="noopener noreferrer" class="btn btn-primary-sm">
            <span>Launch Task 1 Full Page Demo</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      `
    },
    thermocraft: {
      title: "ThermoCraft Pro — Smart Temperature Converter",
      tag: "Oasis Infobyte • Level 1 Task 3",
      github: "https://github.com/bhanujonwar/OIBSIP/tree/main/WebDev-L1-TemperatureConverter",
      demoUrl: "../WebDev-L1-TemperatureConverter/index.html",
      bodyHtml: `
        <p style="font-size: 1.05rem; color: var(--text-main); line-height: 1.75;">
          A precision temperature conversion engine calculating conversions between Celsius (°C), Fahrenheit (°F), and Kelvin (K). Featuring real-time thermal spectrum tracking, formula derivations, and scientific presets.
        </p>
        <div class="interactive-demo-box">
          <div class="demo-box-header">
            <span>Live Interactive Engine (Celsius, Fahrenheit, Kelvin)</span>
            <span style="font-size: 0.8rem; color: var(--primary-light);">Interactive Mini-Tool</span>
          </div>
          <div class="demo-converter-form">
            <div class="demo-inputs-row">
              <div>
                <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Input Temperature:</label>
                <input type="number" id="modal-temp-input" value="100" class="form-input" style="padding: 0.65rem 0.85rem;" />
              </div>
              <div>
                <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Base Scale:</label>
                <select id="modal-temp-from" class="form-select" style="padding: 0.65rem 0.85rem;">
                  <option value="C" selected>Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                </select>
              </div>
            </div>
            <div class="demo-output-card">
              <div id="modal-temp-result" class="demo-output-val">212.00 °F / 373.15 K</div>
              <div id="modal-temp-formula" class="demo-output-formula">Formula: (100°C × 9/5) + 32 = 212°F | 100°C + 273.15 = 373.15K</div>
            </div>
          </div>
        </div>
        <h4 style="font-size: 1.05rem; color: var(--primary-light); margin-top: 0.5rem;">Verified Task 3 Highlights:</h4>
        <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-muted);">
          <li>Simultaneous multi-unit calculations across Celsius, Fahrenheit, and Kelvin scales.</li>
          <li>Absolute zero boundary protection and precision decimal controls.</li>
          <li>Quick stepper chips (+1, −1, +10, −10) and scientific presets (Absolute Zero, Water Freezing, Room Temp, Boiling).</li>
          <li>Step-by-step arithmetic formulas printed dynamically for full transparency.</li>
        </ul>
        <div style="margin-top: 0.75rem;">
          <a href="../WebDev-L1-TemperatureConverter/index.html" target="_blank" rel="noopener noreferrer" class="btn btn-primary-sm">
            <span>Launch Task 3 Full Page Demo</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      `
    }
  };

  function setupModalInteractiveDemos(projectId) {
    if (projectId === "thermocraft") {
      const tempInput = document.getElementById("modal-temp-input");
      const tempFrom = document.getElementById("modal-temp-from");
      const tempResult = document.getElementById("modal-temp-result");
      const tempFormula = document.getElementById("modal-temp-formula");

      function updateConversion() {
        if (!tempInput || !tempFrom || !tempResult || !tempFormula) return;
        const val = parseFloat(tempInput.value);
        if (isNaN(val)) {
          tempResult.textContent = "Invalid Number";
          tempFormula.textContent = "Please input a valid numeric value";
          return;
        }
        const scale = tempFrom.value;
        if (scale === "C") {
          const f = (val * 9) / 5 + 32;
          const k = val + 273.15;
          tempResult.textContent = `${f.toFixed(2)} °F / ${k.toFixed(2)} K`;
          tempFormula.textContent = `(${val}°C × 9/5) + 32 = ${f.toFixed(2)}°F | ${val}°C + 273.15 = ${k.toFixed(2)}K`;
        } else if (scale === "F") {
          const c = ((val - 32) * 5) / 9;
          const k = c + 273.15;
          tempResult.textContent = `${c.toFixed(2)} °C / ${k.toFixed(2)} K`;
          tempFormula.textContent = `(${val}°F - 32) × 5/9 = ${c.toFixed(2)}°C | (${val}°F - 32) × 5/9 + 273.15 = ${k.toFixed(2)}K`;
        } else if (scale === "K") {
          const c = val - 273.15;
          const f = (c * 9) / 5 + 32;
          tempResult.textContent = `${c.toFixed(2)} °C / ${f.toFixed(2)} °F`;
          tempFormula.textContent = `${val}K - 273.15 = ${c.toFixed(2)}°C | (${val}K - 273.15) × 9/5 + 32 = ${f.toFixed(2)}°F`;
        }
      }

      if (tempInput) tempInput.addEventListener("input", updateConversion);
      if (tempFrom) tempFrom.addEventListener("change", updateConversion);
      updateConversion();
    }
  }

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModalOverlay) return;

    projectModalTitle.textContent = data.title;
    projectModalTag.textContent = data.tag;
    projectModalBody.innerHTML = data.bodyHtml;

    const ghLink = document.getElementById("modal-github-link");
    if (ghLink) ghLink.href = data.github;

    projectModalOverlay.classList.add("active");
    projectModalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    playUiSound("modal");

    setupModalInteractiveDemos(projectId);
  }

  function closeProjectModal() {
    if (!projectModalOverlay) return;
    projectModalOverlay.classList.remove("active");
    projectModalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    playUiSound("click");
  }

  document.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const pid = btn.dataset.project;
      openProjectModal(pid);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
  if (modalActionBtn) modalActionBtn.addEventListener("click", closeProjectModal);
  if (projectModalOverlay) {
    projectModalOverlay.addEventListener("click", (e) => {
      if (e.target === projectModalOverlay) closeProjectModal();
    });
  }

  const resumeModalOverlay = document.getElementById("resume-modal-overlay");
  const resumeModalCloseBtn = document.getElementById("resume-modal-close-btn");
  const navResumeBtn = document.getElementById("nav-resume-btn");
  const heroResumeBtn = document.getElementById("hero-resume-btn");
  const aboutResumeBtn = document.getElementById("about-resume-btn");
  const mobileResumeBtn = document.getElementById("mobile-resume-btn");
  const printResumeBtn = document.getElementById("print-resume-btn");
  const copyResumeLinkBtn = document.getElementById("copy-resume-link-btn");

  function openResumeModal() {
    if (!resumeModalOverlay) return;
    resumeModalOverlay.classList.add("active");
    resumeModalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    playUiSound("modal");
  }

  function closeResumeModal() {
    if (!resumeModalOverlay) return;
    resumeModalOverlay.classList.remove("active");
    resumeModalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    playUiSound("click");
  }

  if (navResumeBtn) navResumeBtn.addEventListener("click", openResumeModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener("click", openResumeModal);
  if (aboutResumeBtn) aboutResumeBtn.addEventListener("click", openResumeModal);
  if (mobileResumeBtn) mobileResumeBtn.addEventListener("click", () => {
    toggleMobileMenu(false);
    openResumeModal();
  });
  if (resumeModalCloseBtn) resumeModalCloseBtn.addEventListener("click", closeResumeModal);
  if (resumeModalOverlay) {
    resumeModalOverlay.addEventListener("click", (e) => {
      if (e.target === resumeModalOverlay) closeResumeModal();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener("click", () => {
      playUiSound("click");
      window.print();
    });
  }

  if (copyResumeLinkBtn) {
    copyResumeLinkBtn.addEventListener("click", () => {
      copyTextToClipboard(window.location.href, "Copied portfolio & resume profile link!");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (projectModalOverlay && projectModalOverlay.classList.contains("active")) {
        closeProjectModal();
      }
      if (resumeModalOverlay && resumeModalOverlay.classList.contains("active")) {
        closeResumeModal();
      }
      if (mobileDrawer && mobileDrawer.classList.contains("open")) {
        toggleMobileMenu(false);
      }
    }
  });

  const contactForm = document.getElementById("portfolio-contact-form");
  const formStatus = document.getElementById("form-status-message");
  const nameInput = document.getElementById("form-name");
  const emailInput = document.getElementById("form-email");
  const messageInput = document.getElementById("form-message");
  const subjectInput = document.getElementById("form-subject");
  const messageCharCounter = document.getElementById("message-char-counter");
  const submitBtn = document.getElementById("form-submit-btn");
  let statusTimeoutId = null;

  if (messageInput && messageCharCounter) {
    messageInput.addEventListener("input", () => {
      const len = messageInput.value.length;
      messageCharCounter.textContent = `${len} / 1000`;
      if (len > 900) {
        messageCharCounter.style.color = "#f87171";
      } else {
        messageCharCounter.style.color = "var(--text-faint)";
      }
    });
  }

    function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function renderLocalInbox() {
    const inboxCount = document.getElementById("inbox-count");
    const inboxList = document.getElementById("local-inbox-list");
    if (!inboxCount || !inboxList) return;

    const messages = JSON.parse(localStorage.getItem("bp_messages_log") || "[]");
    inboxCount.textContent = messages.length;

    if (messages.length === 0) {
      inboxList.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-faint);">No messages sent yet from this browser session.</p>`;
      return;
    }

    inboxList.innerHTML = messages.map((m) => `
      <div class="inbox-msg-item">
        <div class="inbox-msg-header">
          <span>${m.name} (${m.subject})</span>
          <span style="font-size: 0.75rem; color: var(--text-faint);">${m.date}</span>
        </div>
        <div class="inbox-msg-text">${m.message}</div>
      </div>
    `).reverse().join("");
  }
  renderLocalInbox();

  const toggleInboxBtn = document.getElementById("toggle-inbox-history-btn");
  const localInboxDrawer = document.getElementById("local-inbox-drawer");
  if (toggleInboxBtn && localInboxDrawer) {
    toggleInboxBtn.addEventListener("click", () => {
      playUiSound("click");
      const isVisible = localInboxDrawer.style.display !== "none";
      localInboxDrawer.style.display = isVisible ? "none" : "block";
    });
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (statusTimeoutId) {
        clearTimeout(statusTimeoutId);
      }
      formStatus.style.display = "block";

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput ? subjectInput.value : "General Inquiry";
      const message = messageInput.value.trim();

      let hasError = false;

      const nameError = document.getElementById("name-error");
      const emailError = document.getElementById("email-error");
      const messageError = document.getElementById("message-error");

      if (nameError) nameError.classList.remove("visible");
      if (emailError) emailError.classList.remove("visible");
      if (messageError) messageError.classList.remove("visible");

      if (!name) {
        if (nameError) {
          nameError.textContent = "Please provide your full name.";
          nameError.classList.add("visible");
        }
        hasError = true;
      }

      if (!email || !validateEmail(email)) {
        if (emailError) {
          emailError.textContent = "Please enter a valid email address (e.g. name@domain.com).";
          emailError.classList.add("visible");
        }
        hasError = true;
      }

      if (!message || message.length < 10) {
        if (messageError) {
          messageError.textContent = "Message must be at least 10 characters long.";
          messageError.classList.add("visible");
        }
        hasError = true;
      }

      if (hasError) {
        formStatus.textContent = "Please correct highlighted fields above before transmitting.";
        formStatus.className = "form-status error";
        return;
      }

            const originalBtnHtml = submitBtn.innerHTML;
      const encodedSubject = encodeURIComponent(`[Oasis Portfolio] ${subject} from ${name}`);
      const encodedBody = encodeURIComponent(`Hello Bhanu,

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

--
Dispatched from Bhanu Pratap Jonwar Portfolio Hub`);
      const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${encodedSubject}&body=${encodedBody}`;

      const newMsg = {
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const messages = JSON.parse(localStorage.getItem("bp_messages_log") || "[]");
      messages.push(newMsg);
      localStorage.setItem("bp_messages_log", JSON.stringify(messages));
      renderLocalInbox();

      try {
        window.location.href = mailtoUrl;
      } catch (err) {}

      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}&su=${encodedSubject}&body=${encodedBody}`;

      formStatus.innerHTML = `
        <strong>Opening your email app...</strong><br />
        Recipient: <code>${EMAIL_ADDRESS}</code> (Bhanu Pratap Jonwar)<br />
        <div style="margin-top: 0.65rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <a href="${mailtoUrl}" class="btn btn-outline-sm" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Launch Default Email App</a>
          <a href="${gmailComposeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-sm" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Send via Gmail Web &rarr;</a>
        </div>
      `;
      formStatus.className = "form-status success";
      formStatus.style.display = "block";

      playUiSound("success");
      showToast("Opening your email client...");

      contactForm.reset();
      if (messageCharCounter) messageCharCounter.textContent = "0 / 1000";
    });
  }
});
