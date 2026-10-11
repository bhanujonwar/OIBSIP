document.addEventListener('DOMContentLoaded', () => {

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('dunemark-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeBtnText(savedTheme);

  function updateThemeBtnText(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'light') {
      themeToggleBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg><span>Daylight</span>`;
    } else {
      themeToggleBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span>Midnight</span>`;
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('dunemark-theme', next);
      updateThemeBtnText(next);
      playTone(next === 'light' ? 620 : 420, 0.15);
      showToast(next === 'light' ? '☀️ Switched to Alpine Daylight Map Theme' : '🌙 Switched to Volcanic Midnight Theme');
    });
  }

  let currentUnit = localStorage.getItem('dunemark-units') || 'metric';
  const unitToggleBtn = document.getElementById('unit-toggle-btn');

  function applyUnits(unit) {
    const isImp = unit === 'imperial';
    if (unitToggleBtn) {
      unitToggleBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="12" x2="22" y2="12"/><line x1="6" y1="7" x2="6" y2="17"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="18" y1="7" x2="18" y2="17"/></svg><span>${isImp ? 'Imperial' : 'Metric'}</span>`;
    }

    const distEl = document.getElementById('route-stat-dist');
    const altEl = document.getElementById('route-stat-alt');
    const ascentEl = document.getElementById('route-stat-ascent');

    if (distEl && altEl && ascentEl) {
      distEl.textContent = isImp ? '33.7 mi' : '54.2 km';
      altEl.textContent = isImp ? '13,051 ft' : '3,978 m';
      ascentEl.textContent = isImp ? '+6,325 ft' : '+1,928 m';
    }
  }
  applyUnits(currentUnit);

  if (unitToggleBtn) {
    unitToggleBtn.addEventListener('click', () => {
      currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
      localStorage.setItem('dunemark-units', currentUnit);
      applyUnits(currentUnit);
      playTone(550, 0.15);
      showToast(currentUnit === 'imperial' ? '📐 Measurements converted to Imperial (feet / miles)' : '📐 Measurements converted to Metric (meters / km)');
    });
  }

  const modalPolicies = document.getElementById('modal-policies');
  const policyTabBtns = document.querySelectorAll('.policy-tab-btn');
  const policyPanels = document.querySelectorAll('.policy-panel');

  function openPolicyTab(policyName) {
    policyTabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === policyName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    policyPanels.forEach(p => {
      if (p.id === 'policy-' + policyName) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    openModal(modalPolicies);
  }

  policyTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      openPolicyTab(tab);
    });
  });

  document.querySelectorAll('[data-open-policy]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-open-policy') || 'privacy';
      openPolicyTab(target);
    });
  });

  const btnExportSample = document.getElementById('btn-export-sample-trip');
  if (btnExportSample) {
    btnExportSample.addEventListener('click', () => {
      const sampleGeoJSON = {
        type: "FeatureCollection",
        creator: "Dunemark Offline Travel Journal",
        developer: "Bhanu Pratap Jonwar",
        expedition: "Spiti & Zanskar Valley Traverse",
        metadata: {
          offlineStorage: "Local IndexedDB AES-256",
          cellularDataUsed: "0 KB",
          totalWaypoints: 4,
          maxAltitude: "4,551m (Kunzum Pass)"
        },
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [77.1887, 32.2396, 2050] },
            properties: { name: "Manali Base", time: "Day 1 07:00 AM", status: "Expedition Origin", temp: "16C" }
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [77.2466, 32.3716, 3978] },
            properties: { name: "Rohtang Pass", time: "Day 1 14:30 PM", status: "Crest Traversed", temp: "6C" }
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [77.6358, 32.4003, 4551] },
            properties: { name: "Kunzum La", time: "Day 3 06:15 AM", status: "High Pass Audio Logged", temp: "-2C" }
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [77.6167, 32.4833, 4250] },
            properties: { name: "Chandratal Camp", time: "Day 3 14:40 PM", status: "Campsite Lake Bivouac", temp: "3C" }
          }
        ]
      };

      const blob = new Blob([JSON.stringify(sampleGeoJSON, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dunemark-spiti-expedition-sample.geojson';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      playTone(680, 0.25);
      showToast('✓ Sample Offline Route (.geojson) exported to downloads!');
    });
  }

  const checklistBoxes = document.querySelectorAll('.check-item input[type="checkbox"]');
  const checklistProgress = document.getElementById('checklist-progress-text');
  function updateChecklist() {
    if (!checklistBoxes.length) return;
    let checked = 0;
    checklistBoxes.forEach(cb => { if (cb.checked) checked++; });
    if (checklistProgress) {
      checklistProgress.textContent = `${checked} of ${checklistBoxes.length} Ready (${Math.round((checked / checklistBoxes.length) * 100)}%)`;
    }
  }
  checklistBoxes.forEach(cb => cb.addEventListener('change', updateChecklist));
  updateChecklist();

  const privacyBanner = document.getElementById('privacy-banner');
  const btnAckPrivacy = document.getElementById('btn-ack-privacy');
  if (localStorage.getItem('dunemark-privacy-ack') === 'true') {
    if (privacyBanner) privacyBanner.classList.add('hidden');
  }
  if (btnAckPrivacy && privacyBanner) {
    btnAckPrivacy.addEventListener('click', () => {
      privacyBanner.classList.add('hidden');
      localStorage.setItem('dunemark-privacy-ack', 'true');
      showToast('✓ Zero-tracking sovereignty acknowledged.');
    });
  }

  const header = document.getElementById('main-header');
  const progressBar = document.getElementById('progress-bar');
  const burgerBtn = document.getElementById('burger-btn');
  const navLinks = document.querySelectorAll('.nav-links a');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  let isScrolling = false;
  function updateScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (progressBar) {
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }

    isScrolling = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(updateScroll);
      isScrolling = true;
    }
  }, { passive: true });
  updateScroll();

  function toggleMobileMenu(forceState) {
    const isOpened = forceState !== undefined
      ? forceState
      : !header.classList.contains('menu-open');

    header.classList.toggle('menu-open', isOpened);
    if (burgerBtn) {
      burgerBtn.setAttribute('aria-expanded', isOpened);
      burgerBtn.setAttribute('aria-label', isOpened ? 'Close menu' : 'Open menu');
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => toggleMobileMenu());
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMobileMenu(false);
      closeAllModals();
    }
  });

  const trackedSections = document.querySelectorAll('section[id], footer[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  trackedSections.forEach(section => navObserver.observe(section));

  const revealElements = document.querySelectorAll('.reveal-on-scroll, .step-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  }, 50);

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (false) {
    document.body.classList.add('has-custom-cursor');
    const ring = document.getElementById('cursor-ring');

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.55;
      ringY += (mouseY - ringY) * 0.55;
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .faq-question-btn, .feature-card, .phone-voice-memo, .journal-filter-btn, .book-swatch');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => ring && ring.classList.add('big'));
      target.addEventListener('mouseleave', () => ring && ring.classList.remove('big'));
    });

    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.15;
        btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  const tabButtons = document.querySelectorAll('.showcase-tab-btn');
  const tabPanes = document.querySelectorAll('.showcase-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanes.forEach(pane => {
        if (pane.id === `tab-${targetTab}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      questionBtn.setAttribute('aria-expanded', !isOpen);
    });
  });

  const faqSearchInput = document.getElementById('faq-search-input');
  const faqSearchStatus = document.getElementById('faq-search-status');
  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let matchCount = 0;

      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question-btn span')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer-text')?.textContent.toLowerCase() || '';

        if (!query || questionText.includes(query) || answerText.includes(query)) {
          item.style.display = 'block';
          matchCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (faqSearchStatus) {
        if (query) {
          faqSearchStatus.textContent = matchCount === 0
            ? 'No matching questions found.'
            : `Found ${matchCount} matching question${matchCount === 1 ? '' : 's'}.`;
        } else {
          faqSearchStatus.textContent = `Showing all ${faqItems.length} questions.`;
        }
      }
    });
  }

  let toastTimer = null;
  function showToast(message, duration = 3500) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'bhanupratapjonwar@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email address copied to clipboard!');
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = `<span>Copied!</span>`;
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        showToast('Copied: ' + email);
      });
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
        if (field) {
          field.classList.remove('is-invalid');
          field.parentElement.classList.remove('has-error');
        }
      });

      if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (!subjectInput.value.trim()) {
        subjectInput.classList.add('is-invalid');
        subjectInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (messageInput.value.trim().length < 8) {
        messageInput.classList.add('is-invalid');
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        showToast('⚠️ Please review highlighted fields before sending.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>Sending note...</span>`;
      submitBtn.disabled = true;

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const subjectVal = subjectInput.value.trim();
      const messageVal = messageInput.value.trim();

      const mailtoSubject = encodeURIComponent(`[Dunemark Expedition] ${subjectVal} - ${nameVal}`);
      const mailtoBody = encodeURIComponent(
        `Dear Bhanu Pratap Jonwar,\n\nName: ${nameVal}\nEmail: ${emailVal}\nSubject: ${subjectVal}\n\nMessage:\n${messageVal}\n\n--\nTransmitted via Dunemark Travel Journal Web Hub`
      );
      const mailtoUrl = `mailto:bhanupratapjonwar@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        const refCode = 'DUNE-' + Math.floor(1000 + Math.random() * 9000);
        const modalSuccess = document.getElementById('modal-contact-success');
        const refElem = document.getElementById('contact-ref-code');
        if (refElem) refElem.textContent = refCode;
        if (modalSuccess) openModal(modalSuccess);

        showToast('✓ Launching email client addressed to bhanupratapjonwar@gmail.com...');
        window.location.href = mailtoUrl;
      }, 700);
    });
  }

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  let audioCtx = null;
  let voiceTimer = null;
  let voiceSeconds = 48;
  const voiceMemo = document.getElementById('phone-voice-memo');
  const voiceTimeEl = document.getElementById('voice-memo-time');

  function playTone(freq, duration = 0.2) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) { }
  }

  if (voiceMemo) {
    voiceMemo.addEventListener('click', () => {
      const isPlaying = voiceMemo.classList.toggle('playing');
      const icon = voiceMemo.querySelector('.voice-play-icon');

      if (isPlaying) {
        playTone(520, 0.35);
        if (icon) {
          icon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>`;
        }
        showToast('▶ Playing Voice Memo: Kunzum Pass Morning (0:48)');

        let current = 0;
        voiceTimer = setInterval(() => {
          current++;
          if (current > voiceSeconds) {
            current = 0;
            voiceMemo.classList.remove('playing');
            if (icon) {
              icon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
            }
            if (voiceTimeEl) voiceTimeEl.textContent = '0:48';
            clearInterval(voiceTimer);
            return;
          }
          const sec = current < 10 ? '0' + current : current;
          if (voiceTimeEl) voiceTimeEl.textContent = `0:${sec}`;
        }, 1000);
      } else {
        clearInterval(voiceTimer);
        playTone(320, 0.15);
        if (icon) {
          icon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        }
        if (voiceTimeEl) voiceTimeEl.textContent = '0:48';
        showToast('⏸ Voice Memo paused.');
      }
    });
  }

  const phoneBadge = document.getElementById('phone-mode-badge');
  if (phoneBadge) {
    phoneBadge.addEventListener('click', () => {
      const isSynced = phoneBadge.classList.toggle('synced');
      if (isSynced) {
        phoneBadge.textContent = 'Synced · Private Vault';
        showToast('☁ Private Vault Synced: 14.8 MB backed up end-to-end.');
        playTone(660, 0.2);
      } else {
        phoneBadge.textContent = 'Offline Mode';
        showToast('📍 Switched to 100% Offline Mode (Local Storage only).');
        playTone(440, 0.2);
      }
    });
  }

  const telemetryHud = document.getElementById('phone-telemetry-hud');
  const waypoints = document.querySelectorAll('.map-waypoint-btn');
  const waypointData = {
    manali: { name: 'Manali Base', alt: '2,050m', temp: '16°C', status: 'Expedition Origin' },
    kunzum: { name: 'Kunzum Pass', alt: '4,551m', temp: '-2°C', status: 'High Ridge Crest' },
    chandratal: { name: 'Chandratal Camp', alt: '4,250m', temp: '3°C', status: 'Tent Site Reached' }
  };

  waypoints.forEach(wp => {
    wp.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = wp.getAttribute('data-wp');
      const data = waypointData[key];
      if (!data || !telemetryHud) return;

      playTone(580, 0.15);
      telemetryHud.innerHTML = `
        <div>
          <strong>${data.name}</strong> · ${data.alt}
          <div style="color:var(--accent-amber); font-size:0.6rem;">${data.status}</div>
        </div>
        <div style="text-align:right;">
          <span>${data.temp}</span>
          <div style="font-size:0.6rem; color:var(--text-muted);">GPS ±1.8m</div>
        </div>
      `;
      telemetryHud.style.display = 'flex';
      showToast(`📍 Waypoint inspected: ${data.name} (${data.alt})`);
    });
  });

  const journalFilters = document.querySelectorAll('.journal-filter-btn');
  const journalCards = document.querySelectorAll('.journal-mock-card');

  journalFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      journalFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      journalCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
      playTone(480, 0.1);
    });
  });

  const routeDayBtns = document.querySelectorAll('.route-day-btn');
  const routeStatsMap = {
    '1': { dist: '54.2 km', alt: '3,978 m', ascent: '+1,928 m', bat: '3.4%' },
    '2': { dist: '82.6 km', alt: '4,551 m', ascent: '+2,480 m', bat: '4.1%' },
    '3': { dist: '65.1 km', alt: '3,650 m', ascent: '+1,120 m', bat: '2.9%' },
    '4': { dist: '41.8 km', alt: '4,250 m', ascent: '+980 m', bat: '2.1%' }
  };

  routeDayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      routeDayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const day = btn.getAttribute('data-day');
      const stats = routeStatsMap[day];
      if (stats) {
        document.getElementById('route-stat-dist').textContent = stats.dist;
        document.getElementById('route-stat-alt').textContent = stats.alt;
        document.getElementById('route-stat-ascent').textContent = stats.ascent;
        document.getElementById('route-stat-bat').textContent = stats.bat;
      }
      playTone(520, 0.12);
      showToast(`📊 Loaded itinerary coordinates for Day ${day}`);
    });
  });

  const bookPreview = document.getElementById('book-cover-preview');
  const swatches = document.querySelectorAll('.book-swatch');

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const color = swatch.getAttribute('data-color');
      if (bookPreview) {
        bookPreview.className = `book-cover-preview color-${color}`;
      }
      playTone(600, 0.12);
      showToast(`📖 Book cover swatch changed: ${swatch.getAttribute('title')}`);
    });
  });

  if (bookPreview && isFinePointer) {
    const wrap = document.getElementById('book-3d-wrap');
    if (wrap) {
      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        bookPreview.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 24}deg) scale(1.02)`;
      });
      wrap.addEventListener('mouseleave', () => {
        bookPreview.style.transform = '';
      });
    }
  }

  const allModals = document.querySelectorAll('.modal-overlay');
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    allModals.forEach(m => closeModal(m));
  }

  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
  });

  const earlyAccessBtns = document.querySelectorAll('[href="#contact"], .open-early-access');
  const modalEarlyAccess = document.getElementById('modal-early-access');
  const btnGenKey = document.getElementById('btn-generate-vip-key');
  const vipKeyCode = document.getElementById('vip-key-code');
  const btnCopyKey = document.getElementById('btn-copy-vip-key');

  document.querySelectorAll('.open-early-access').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modalEarlyAccess);
    });
  });

  if (btnGenKey) {
    btnGenKey.addEventListener('click', () => {
      const randomKey = 'DUNE-VIP-' + Math.floor(1000 + Math.random() * 9000) + '-EXP';
      if (vipKeyCode) vipKeyCode.textContent = randomKey;
      if (btnCopyKey) btnCopyKey.disabled = false;
      playTone(720, 0.2);
      showToast('✨ Unique VIP Beta Key generated!');
    });
  }

  if (btnCopyKey) {
    btnCopyKey.addEventListener('click', () => {
      const code = vipKeyCode ? vipKeyCode.textContent : '';
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          showToast('✓ VIP Beta Pass copied to clipboard!');
        });
      }
    });
  }

  const btnQuickEntry = document.getElementById('btn-quick-entry');
  const modalJournalEntry = document.getElementById('modal-journal-entry');
  const quickEntryForm = document.getElementById('quick-entry-form');
  const journalListContainer = document.getElementById('journal-list-container');

  if (btnQuickEntry) {
    btnQuickEntry.addEventListener('click', () => {
      openModal(modalJournalEntry);
    });
  }

  if (quickEntryForm && journalListContainer) {
    quickEntryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const loc = document.getElementById('entry-location').value.trim() || 'Himalayan Ridge';
      const alt = document.getElementById('entry-altitude').value.trim() || '3,800m';
      const text = document.getElementById('entry-note').value.trim() || 'A quiet pause along the trail.';

      const card = document.createElement('div');
      card.className = 'journal-mock-card';
      card.setAttribute('data-category', 'pass');
      card.innerHTML = `
        <div class="journal-mock-header">
          <div class="journal-mock-loc">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
            <span>${loc}</span>
          </div>
          <span class="journal-mock-time">Just now · ${alt}</span>
        </div>
        <div class="journal-mock-quote">
          "${text}"
        </div>
        <div class="journal-mock-tags">
          <span class="journal-tag">Altitude: ${alt}</span>
          <span class="journal-tag">User Capture</span>
          <span class="journal-tag">100% Offline</span>
        </div>
      `;

      journalListContainer.prepend(card);
      closeModal(modalJournalEntry);
      quickEntryForm.reset();
      playTone(640, 0.25);
      showToast('✓ Note pinned to local journal feed!');
    });
  }

  const btnPreviewBook = document.getElementById('btn-preview-book');
  const modalBookPreview = document.getElementById('modal-book-preview');
  if (btnPreviewBook) {
    btnPreviewBook.addEventListener('click', () => {
      openModal(modalBookPreview);
    });
  }

  const btnPreorderBook = document.getElementById('btn-preorder-book');
  const modalBookPreorder = document.getElementById('modal-book-preorder');
  const preorderForm = document.getElementById('book-preorder-form');

  if (btnPreorderBook) {
    btnPreorderBook.addEventListener('click', () => {
      openModal(modalBookPreorder);
    });
  }

  if (preorderForm) {
    preorderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal(modalBookPreorder);
      playTone(700, 0.25);
      showToast('🎉 Hardcover Book Reservation registered! Bhanu Pratap will follow up.');
    });
  }

  let ambientNode = null;
  const navAudioBtn = document.getElementById('nav-audio-btn');

  function toggleAmbientSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (ambientNode) {
        ambientNode.stop();
        ambientNode.disconnect();
        ambientNode = null;
        if (navAudioBtn) navAudioBtn.classList.remove('playing');
        showToast('🔇 Mountain trail sound muted.');
      } else {
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.04;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, audioCtx.currentTime);

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        whiteNoise.start();
        ambientNode = whiteNoise;
        if (navAudioBtn) navAudioBtn.classList.add('playing');
        showToast('🎧 Alpine wind ambience active (synthesized offline).');
      }
    } catch (_) { }
  }

  if (navAudioBtn) {
    navAudioBtn.addEventListener('click', toggleAmbientSound);
  }
});