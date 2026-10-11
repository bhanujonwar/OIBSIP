/**
 * ThermoCraft Pro — Thermodynamic Suite & Precision Temperature Lab
 * Author: Bhanu Pratap Jonwar (MCA, ITM University)
 * Internship: OASIS INFOBYTE Level 1 Task 3
 * Complete vanilla JavaScript module: 100% connected, fully working,
 * zero frameworks, zero external dependencies.
 */

(function () {
  'use strict';

  // Constants
  const ABSOLUTE_ZERO = {
    celsius: -273.15,
    fahrenheit: -459.67,
    kelvin: 0
  };

  const EPSILON = 1e-7;
  const HISTORY_KEY = 'thermocraft_history_v3';
  const THEME_KEY = 'thermocraft_theme_v3';
  const SOUND_KEY = 'thermocraft_sound_pref';

  // Core DOM Elements
  const form = document.getElementById('tempForm');
  const tempInput = document.getElementById('tempInput');
  const inputWrapper = document.getElementById('inputWrapper');
  const inputUnitTag = document.getElementById('inputUnitTag');
  const precisionSelect = document.getElementById('precisionSelect');
  const errorBox = document.getElementById('errorBox');
  const errorText = document.getElementById('errorText');
  const convertBtn = document.getElementById('convertBtn');
  const swapUnitBtn = document.getElementById('swapUnitBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Result Elements
  const valCelsius = document.getElementById('valCelsius');
  const valFahrenheit = document.getElementById('valFahrenheit');
  const valKelvin = document.getElementById('valKelvin');
  const valRankine = document.getElementById('valRankine');
  const valReaumur = document.getElementById('valReaumur');
  const valTriplePoint = document.getElementById('valTriplePoint');

  const cardCelsius = document.getElementById('cardCelsius');
  const cardFahrenheit = document.getElementById('cardFahrenheit');
  const cardKelvin = document.getElementById('cardKelvin');

  const badgeCelsius = document.getElementById('badgeCelsius');
  const badgeFahrenheit = document.getElementById('badgeFahrenheit');
  const badgeKelvin = document.getElementById('badgeKelvin');

  // Gauge & Breakdown Elements
  const stateIcon = document.getElementById('stateIcon');
  const stateLabel = document.getElementById('stateLabel');
  const stateSub = document.getElementById('stateSub');
  const spectrumNeedle = document.getElementById('spectrumNeedle');
  const breakdownFormula = document.getElementById('breakdownFormula');

  // Stepper & Chips
  const stepUp = document.getElementById('stepUp');
  const stepDown = document.getElementById('stepDown');
  const chipButtons = document.querySelectorAll('.chip-btn');

  // Slider & Presets & History
  const rangeSlider = document.getElementById('rangeSlider');
  const sliderReadout = document.getElementById('sliderReadout');
  const presetCards = document.querySelectorAll('.preset-large-card');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const exportHistoryBtn = document.getElementById('exportHistoryBtn');

  // Matrix Table
  const matrixTableBody = document.getElementById('matrixTableBody');

  // Thermal Lab Elements
  const substanceSelect = document.getElementById('substanceSelect');
  const massInput = document.getElementById('massInput');
  const t1Input = document.getElementById('t1Input');
  const t2Input = document.getElementById('t2Input');
  const calcHeatBtn = document.getElementById('calcHeatBtn');
  const syncConverterHeatBtn = document.getElementById('syncConverterHeatBtn');
  const heatDeltaT = document.getElementById('heatDeltaT');
  const heatJoules = document.getElementById('heatJoules');
  const heatKiloJoules = document.getElementById('heatKiloJoules');
  const heatCalories = document.getElementById('heatCalories');
  const heatKcal = document.getElementById('heatKcal');

  // Theme & Sound & Toast Elements
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const toastMessage = document.getElementById('toastMessage');

  // Unit Selector Buttons & Radio fallback
  const unitTabs = document.querySelectorAll('.unit-tab-btn');
  const unitRadios = document.querySelectorAll('input[name="tempUnit"]');

  // State
  let currentUnit = 'celsius';
  let precision = 2;
  let soundEnabled = true;
  let toastTimer = null;
  let lastCalculatedCelsius = 25;

  /**
   * Synthesize audio feedback via Web Audio API
   * (Zero external sound files needed!)
   */
  let audioCtx = null;
  function playBeep(freq = 600, duration = 0.06, type = 'sine') {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }

  /**
   * Set active unit and sync tabs, radios, and input suffix
   * @param {'celsius' | 'fahrenheit' | 'kelvin'} unit
   */
  function setUnit(unit) {
    currentUnit = unit;

    // Sync tab buttons
    unitTabs.forEach(function (tab) {
      const match = tab.getAttribute('data-unit') === unit;
      tab.classList.toggle('active', match);
      tab.setAttribute('aria-checked', match ? 'true' : 'false');
    });

    // Sync radio inputs
    unitRadios.forEach(function (radio) {
      if (radio.value === unit) {
        radio.checked = true;
      }
    });

    // Update input suffix symbol
    const symbols = {
      celsius: '°C',
      fahrenheit: '°F',
      kelvin: 'K'
    };
    if (inputUnitTag) {
      inputUnitTag.textContent = symbols[unit] || '°C';
    }

    // Clear active error
    hideError();

    // Re-calculate if input has valid number
    if (tempInput && tempInput.value.trim() !== '') {
      const check = validateInput(tempInput.value);
      if (check.valid) {
        calculateAndRender(false);
      }
    }
  }

  /**
   * Cycle unit: Celsius -> Fahrenheit -> Kelvin -> Celsius
   */
  function cycleUnit() {
    const cycle = {
      celsius: 'fahrenheit',
      fahrenheit: 'kelvin',
      kelvin: 'celsius'
    };
    const next = cycle[currentUnit] || 'celsius';
    setUnit(next);
    playBeep(750, 0.08);
    showToast(`Switched input scale to ${next.toUpperCase()}`);
  }

  /**
   * Strict numeric validation:
   * Rejects empty string, letters ('abc'), multiple decimals ('1.2.3'), exponential ('1e3').
   * @param {string} raw
   * @returns {{ valid: boolean, error?: string, value?: number }}
   */
  function validateInput(raw) {
    const trimmed = raw.trim();

    if (trimmed === '') {
      return {
        valid: false,
        error: 'Please enter a temperature value to convert.'
      };
    }

    if (/[eE]/.test(trimmed)) {
      return {
        valid: false,
        error: "Exponential notation (e.g. '1e3') is not permitted. Please enter a standard decimal number."
      };
    }

    if ((trimmed.match(/\./g) || []).length > 1) {
      return {
        valid: false,
        error: 'Input contains multiple decimal points. Please enter a valid number.'
      };
    }

    const strictNumberRegex = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
    if (!strictNumberRegex.test(trimmed)) {
      return {
        valid: false,
        error: `Invalid input '${trimmed}'. Please enter a valid numeric value (e.g. 25, -10.5).`
      };
    }

    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      return {
        valid: false,
        error: 'Please enter a finite numeric temperature.'
      };
    }

    return {
      valid: true,
      value: num
    };
  }

  /**
   * Check whether input is below physical Absolute Zero
   * @param {number} value
   * @param {'celsius' | 'fahrenheit' | 'kelvin'} unit
   * @returns {boolean}
   */
  function isBelowAbsoluteZero(value, unit) {
    const limit = ABSOLUTE_ZERO[unit];
    return value < limit - EPSILON;
  }

  /**
   * Format number to precision and strip trailing zeros consistently
   * 25 -> "25", 77.00 -> "77", 298.15 -> "298.15", 100.50 -> "100.5", -0 -> "0"
   * @param {number} num
   * @param {number} dec
   * @returns {string}
   */
  function formatTemperature(num, dec) {
    if (isNaN(num)) return '--';
    const factor = Math.pow(10, dec);
    const rounded = Math.round((num + Number.EPSILON) * factor) / factor;
    const normalized = Object.is(rounded, -0) || Math.abs(rounded) < 1e-12 ? 0 : rounded;
    return normalized.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: dec,
      useGrouping: false
    });
  }

  /**
   * Convert between Celsius, Fahrenheit, Kelvin, Rankine, and Réaumur
   * C->F = C*9/5+32, F->C = (F-32)*5/9, C<->K = +/-273.15
   * @param {number} val
   * @param {'celsius' | 'fahrenheit' | 'kelvin'} unit
   */
  function computeTemperatures(val, unit) {
    let c = 0;
    let f = 0;
    let k = 0;

    switch (unit) {
      case 'celsius':
        c = val;
        f = (c * 9) / 5 + 32;
        k = c + 273.15;
        break;

      case 'fahrenheit':
        f = val;
        c = ((f - 32) * 5) / 9;
        k = c + 273.15;
        break;

      case 'kelvin':
        k = val;
        c = k - 273.15;
        f = (c * 9) / 5 + 32;
        break;
    }

    const rankine = (c + 273.15) * (9 / 5);
    const reaumur = c * (4 / 5);
    const triplePointOffset = k - 273.16;

    return {
      celsius: c,
      fahrenheit: f,
      kelvin: k,
      rankine: rankine,
      reaumur: reaumur,
      triplePointOffset: triplePointOffset
    };
  }

  /**
   * Show error alert and clear results
   * @param {string} msg
   */
  function showError(msg) {
    if (errorText && errorBox) {
      errorText.textContent = msg;
      errorBox.classList.remove('hidden');
    }
    if (tempInput) {
      tempInput.setAttribute('aria-invalid', 'true');
    }
    if (inputWrapper) {
      inputWrapper.classList.add('is-invalid');
    }
    playBeep(280, 0.15, 'sawtooth');
    clearResults();
  }

  /**
   * Hide error alert
   */
  function hideError() {
    if (errorText && errorBox) {
      errorText.textContent = '';
      errorBox.classList.add('hidden');
    }
    if (tempInput) {
      tempInput.setAttribute('aria-invalid', 'false');
    }
    if (inputWrapper) {
      inputWrapper.classList.remove('is-invalid');
    }
  }

  /**
   * Clear results display to placeholder
   */
  function clearResults() {
    if (valCelsius) valCelsius.textContent = '--';
    if (valFahrenheit) valFahrenheit.textContent = '--';
    if (valKelvin) valKelvin.textContent = '--';
    if (valRankine) valRankine.textContent = '-- °R';
    if (valReaumur) valReaumur.textContent = '-- °Ré';
    if (valTriplePoint) valTriplePoint.textContent = '--';

    [cardCelsius, cardFahrenheit, cardKelvin].forEach(function (card) {
      if (card) card.classList.remove('source-active');
    });

    [badgeCelsius, badgeFahrenheit, badgeKelvin].forEach(function (badge) {
      if (badge) badge.classList.add('hidden');
    });

    if (spectrumNeedle) spectrumNeedle.style.left = '50%';
    if (stateIcon) stateIcon.textContent = '⚠️';
    if (stateLabel) stateLabel.textContent = 'Results Cleared';
    if (stateSub) stateSub.textContent = 'Enter a valid temperature above absolute zero to begin.';
    if (breakdownFormula) {
      breakdownFormula.textContent = 'Results cleared. Enter a valid temperature above absolute zero to view calculation.';
    }
  }

  /**
   * Update thermal spectrum gauge visualizer
   * Range: -273.15 °C to 500 °C
   * @param {number} cVal - Temperature in Celsius
   */
  function updateThermalGauge(cVal) {
    if (!spectrumNeedle || !stateIcon || !stateLabel || !stateSub) return;

    // Spectrum mapped scale from -273.15 °C to 500 °C
    const minC = -273.15;
    const maxC = 500;
    let pct = ((cVal - minC) / (maxC - minC)) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;

    spectrumNeedle.style.left = `${pct}%`;

    let icon = '🌿';
    let label = 'Comfortable Climate';
    let sub = 'Optimal standard room temperature conditions (20–25 °C).';

    if (Math.abs(cVal - (-273.15)) < 0.05) {
      icon = '🌌';
      label = 'Absolute Zero (0 K)';
      sub = 'Thermodynamic zero point. Complete cessation of atomic kinetic motion.';
    } else if (cVal <= -150) {
      icon = '🧪';
      label = 'Cryogenic Deep Freeze';
      sub = 'Liquid nitrogen range (−196 °C). Extreme molecular deceleration.';
    } else if (cVal <= -20) {
      icon = '🧊';
      label = 'Polar Sub-Zero Freeze';
      sub = 'Severe freezing blizzard conditions. Water instantly solidifies.';
    } else if (cVal <= 0) {
      icon = '❄️';
      label = 'Freezing Point of Water';
      sub = 'Phase transition: Liquid water crystallizes into ice (0 °C / 32 °F).';
    } else if (cVal < 18) {
      icon = '🧥';
      label = 'Chilly / Cool Autumn';
      sub = 'Brisk climate. Warm layers or jacket typically required.';
    } else if (cVal <= 26) {
      icon = '🌿';
      label = 'Ideal Room Comfort';
      sub = 'Standard ambient temperature for optimal human habitability (20–24 °C).';
    } else if (cVal <= 38) {
      icon = '🩺';
      label = 'Human Core Body Heat';
      sub = 'Normal biological human core temperature (~37 °C / 98.6 °F).';
    } else if (cVal < 100) {
      icon = '☀️';
      label = 'High Heat / Scalding';
      sub = 'Intense heat. Hot tea or desert afternoon conditions.';
    } else if (cVal === 100) {
      icon = '♨️';
      label = 'Water Boiling Point';
      sub = 'Vaporization threshold: Liquid water transforms into steam at sea level.';
    } else if (cVal < 300) {
      icon = '🔥';
      label = 'Baking & Combustion';
      sub = 'Commercial oven temperatures and paper combustion threshold (451 °F).';
    } else {
      icon = '⚡';
      label = 'Furnace & Molten Metal';
      sub = 'Lead melts at 327 °C. Incandescent thermal radiation realm.';
    }

    stateIcon.textContent = icon;
    stateLabel.textContent = label;
    stateSub.textContent = sub;
  }

  /**
   * Update step-by-step mathematical breakdown
   */
  function updateBreakdown(inputVal, unit, res) {
    if (!breakdownFormula) return;

    const vStr = formatTemperature(inputVal, precision);
    const cStr = formatTemperature(res.celsius, precision);
    const fStr = formatTemperature(res.fahrenheit, precision);
    const kStr = formatTemperature(res.kelvin, precision);

    let html = '';
    if (unit === 'celsius') {
      html = `• To Fahrenheit: <b>(${vStr}°C × 9/5) + 32 = ${fStr} °F</b><br>` +
             `• To Kelvin: <b>${vStr}°C + 273.15 = ${kStr} K</b>`;
    } else if (unit === 'fahrenheit') {
      html = `• To Celsius: <b>(${vStr}°F − 32) × 5/9 = ${cStr} °C</b><br>` +
             `• To Kelvin: <b>(${vStr}°F − 32) × 5/9 + 273.15 = ${kStr} K</b>`;
    } else if (unit === 'kelvin') {
      html = `• To Celsius: <b>${vStr} K − 273.15 = ${cStr} °C</b><br>` +
             `• To Fahrenheit: <b>(${vStr} K − 273.15) × 9/5 + 32 = ${fStr} °F</b>`;
    }

    breakdownFormula.innerHTML = html;
  }

  /**
   * Save conversion into local history
   */
  function saveToHistory(val, unit, res) {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      const symbolMap = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' };
      const item = {
        input: `${formatTemperature(val, precision)} ${symbolMap[unit]}`,
        celsius: `${formatTemperature(res.celsius, precision)} °C`,
        fahrenheit: `${formatTemperature(res.fahrenheit, precision)} °F`,
        kelvin: `${formatTemperature(res.kelvin, precision)} K`,
        unit: unit,
        rawVal: val,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (history.length > 0 && history[0].input === item.input) {
        return;
      }

      history.unshift(item);
      if (history.length > 8) history.pop();
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      renderHistory();
    } catch (e) {
      // LocalStorage error fallback
    }
  }

  /**
   * Render history list with clickable rerun
   */
  function renderHistory() {
    if (!historyList) return;
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (history.length === 0) {
        historyList.innerHTML = '<div class="history-empty-msg">No conversions recorded in this session. Convert any value to log it here!</div>';
        return;
      }

      historyList.innerHTML = '';
      history.forEach(function (item) {
        const row = document.createElement('div');
        row.className = 'history-row';
        row.setAttribute('role', 'button');
        row.setAttribute('tabindex', '0');
        row.title = 'Click to reload this conversion into Studio';
        row.innerHTML = `
          <div class="hist-left">
            <span class="hist-main">${item.input} ➔ ${item.celsius} · ${item.fahrenheit}</span>
            <span class="hist-sub">${item.kelvin} · Recorded at ${item.time}</span>
          </div>
          <span class="hist-action-badge">Reload ↺</span>
        `;
        row.addEventListener('click', function () {
          if (tempInput) tempInput.value = item.rawVal;
          setUnit(item.unit);
          calculateAndRender(false);
          playBeep(650, 0.08);
          showToast(`Reloaded ${item.input} into Studio!`);
          const studio = document.getElementById('converterStudio');
          if (studio) studio.scrollIntoView({ behavior: 'smooth' });
        });
        historyList.appendChild(row);
      });
    } catch (e) {
      // Fallback
    }
  }

  /**
   * Export history to CSV file
   */
  function exportHistoryToCSV() {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (history.length === 0) {
        showToast('No history records to export.');
        return;
      }

      let csv = 'Time,Input,Celsius,Fahrenheit,Kelvin\n';
      history.forEach(function (h) {
        csv += `"${h.time}","${h.input}","${h.celsius}","${h.fahrenheit}","${h.kelvin}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `thermocraft_history_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      playBeep(880, 0.1);
      showToast('Exported conversion history as CSV file!');
    } catch (e) {
      showToast('Unable to export history.');
    }
  }

  /**
   * Populate and update Matrix comparison table
   */
  const MATRIX_DATA = [
    { name: 'Absolute Zero (Universe Minimum)', c: -273.15 },
    { name: 'Liquid Nitrogen Coolant', c: -196 },
    { name: 'Vostok Antarctica Record', c: -89.2 },
    { name: 'Equal Scale Coincidence point', c: -40 },
    { name: 'Freezing Point of Water', c: 0 },
    { name: 'Standard Room Temperature', c: 22 },
    { name: 'Human Core Body Heat', c: 37 },
    { name: 'Death Valley Heat Record', c: 56.7 },
    { name: 'Boiling Point of Water', c: 100 },
    { name: 'Oven Baking Temperature', c: 180 },
    { name: 'Lead Melting Point', c: 327.5 },
    { name: 'Sun Photosphere (Surface)', c: 5500 }
  ];

  function renderMatrixTable(currentC = 25) {
    if (!matrixTableBody) return;
    matrixTableBody.innerHTML = '';

    let closestDiff = Infinity;
    let closestIndex = -1;

    MATRIX_DATA.forEach(function (item, idx) {
      const diff = Math.abs(item.c - currentC);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = idx;
      }
    });

    MATRIX_DATA.forEach(function (item, idx) {
      const f = (item.c * 9) / 5 + 32;
      const k = item.c + 273.15;
      const r = (item.c + 273.15) * (9 / 5);

      const isClosest = idx === closestIndex;
      const tr = document.createElement('tr');
      if (isClosest) tr.className = 'active-matrix-row';

      tr.innerHTML = `
        <td><strong>${item.name}</strong> ${isClosest ? '⭐' : ''}</td>
        <td><code>${formatTemperature(item.c, 2)} °C</code></td>
        <td><code>${formatTemperature(f, 2)} °F</code></td>
        <td><code>${formatTemperature(k, 2)} K</code></td>
        <td><code>${formatTemperature(r, 2)} °R</code></td>
        <td><button type="button" class="table-load-btn" data-c="${item.c}">Load</button></td>
      `;

      const loadBtn = tr.querySelector('.table-load-btn');
      loadBtn.addEventListener('click', function () {
        if (tempInput) tempInput.value = item.c;
        setUnit('celsius');
        calculateAndRender(true);
        playBeep(700, 0.08);
        showToast(`Loaded "${item.name}" into Studio!`);
        const studio = document.getElementById('converterStudio');
        if (studio) studio.scrollIntoView({ behavior: 'smooth' });
      });

      matrixTableBody.appendChild(tr);
    });
  }

  /**
   * Specific Heat Calculator (Q = mcΔT)
   */
  function calculateThermalEnergy() {
    if (!substanceSelect || !massInput || !t1Input || !t2Input) return;

    const c = parseFloat(substanceSelect.value) || 4.184;
    const m = parseFloat(massInput.value) || 1000;
    const t1 = parseFloat(t1Input.value) || 25;
    const t2 = parseFloat(t2Input.value) || 100;

    const deltaT = t2 - t1;
    const joules = m * c * deltaT;
    const kJ = joules / 1000;
    const calories = joules / 4.184;
    const kcal = calories / 1000;

    if (heatDeltaT) heatDeltaT.textContent = `${formatTemperature(deltaT, 2)} °C`;
    if (heatJoules) heatJoules.textContent = `${formatTemperature(joules, 0)} J`;
    if (heatKiloJoules) heatKiloJoules.textContent = `${formatTemperature(kJ, 2)} kJ`;
    if (heatCalories) heatCalories.textContent = `${formatTemperature(calories, 0)} cal`;
    if (heatKcal) heatKcal.textContent = `${formatTemperature(kcal, 2)} kcal`;

    playBeep(520, 0.08);
    showToast(`Calculated: ${formatTemperature(kJ, 2)} kJ thermal energy required!`);
  }

  /**
   * Sync initial temp in Heat Lab with Studio value
   */
  function syncStudioTempToLab() {
    if (t1Input) {
      t1Input.value = formatTemperature(lastCalculatedCelsius, 2);
      calculateThermalEnergy();
      playBeep(600, 0.06);
      showToast(`Pulled ${formatTemperature(lastCalculatedCelsius, 2)} °C from Studio into Heat Lab!`);
    }
  }

  /**
   * Primary Calculation & Rendering Engine
   * @param {boolean} addHistory
   */
  function calculateAndRender(addHistory = true) {
    const raw = tempInput ? tempInput.value : '';
    const validation = validateInput(raw);

    if (!validation.valid) {
      showError(validation.error);
      return false;
    }

    const unit = currentUnit;
    const value = validation.value;

    // Check Absolute Zero
    if (isBelowAbsoluteZero(value, unit)) {
      showError(
        'Absolute zero violation: Temperature cannot drop below -273.15 °C / -459.67 °F / 0 K. Nothing in the universe can be colder than absolute zero.'
      );
      return false;
    }

    hideError();

    // Compute results
    const results = computeTemperatures(value, unit);
    lastCalculatedCelsius = results.celsius;

    // Format results with trailing zero stripping
    const fC = formatTemperature(results.celsius, precision);
    const fF = formatTemperature(results.fahrenheit, precision);
    const fK = formatTemperature(results.kelvin, precision);
    const fR = formatTemperature(results.rankine, precision);
    const fRe = formatTemperature(results.reaumur, precision);
    const fTP = (results.triplePointOffset >= 0 ? '+' : '') + formatTemperature(results.triplePointOffset, precision);

    if (valCelsius) valCelsius.textContent = fC;
    if (valFahrenheit) valFahrenheit.textContent = fF;
    if (valKelvin) valKelvin.textContent = fK;
    if (valRankine) valRankine.textContent = `${fR} °R`;
    if (valReaumur) valReaumur.textContent = `${fRe} °Ré`;
    if (valTriplePoint) valTriplePoint.textContent = `${fTP} ΔK`;

    // Highlight source card
    const cardMap = {
      celsius: { card: cardCelsius, badge: badgeCelsius },
      fahrenheit: { card: cardFahrenheit, badge: badgeFahrenheit },
      kelvin: { card: cardKelvin, badge: badgeKelvin }
    };

    Object.keys(cardMap).forEach(function (k) {
      const item = cardMap[k];
      const isSrc = k === unit;
      if (item.card) {
        item.card.classList.toggle('source-active', isSrc);
      }
      if (item.badge) {
        item.badge.classList.toggle('hidden', !isSrc);
      }
    });

    // Update gauge & breakdown
    updateThermalGauge(results.celsius);
    updateBreakdown(value, unit, results);

    // Sync slider readout
    if (rangeSlider && sliderReadout) {
      if (results.celsius >= -50 && results.celsius <= 150) {
        rangeSlider.value = results.celsius;
        sliderReadout.textContent = `${fC} °C`;
      }
    }

    // Sync matrix row highlight
    renderMatrixTable(results.celsius);

    // Play subtle success click sound
    playBeep(800, 0.05);

    // Save history
    if (addHistory) {
      saveToHistory(value, unit, results);
    }

    return true;
  }

  /**
   * Reset Handler
   */
  function handleReset() {
    if (tempInput) {
      tempInput.value = '';
    }
    if (precisionSelect) {
      precisionSelect.value = '2';
      precision = 2;
    }

    setUnit('celsius');
    hideError();
    clearResults();

    if (stateIcon) stateIcon.textContent = '🌿';
    if (stateLabel) stateLabel.textContent = 'Ready to Convert';
    if (stateSub) stateSub.textContent = 'Enter a temperature above or pick a reference preset.';
    if (breakdownFormula) {
      breakdownFormula.textContent = 'Enter any temperature to inspect step-by-step thermodynamic conversion formulas.';
    }
    if (spectrumNeedle) {
      spectrumNeedle.style.left = '37.5%';
    }
    if (rangeSlider && sliderReadout) {
      rangeSlider.value = 25;
      sliderReadout.textContent = '25 °C';
    }

    renderMatrixTable(25);

    if (tempInput) {
      tempInput.focus();
    }
    playBeep(450, 0.1);
    showToast('Reset converter to clean initial state.');
  }

  /**
   * Toast notification helper
   */
  function showToast(msg) {
    if (!toastMessage) return;
    toastMessage.textContent = msg;
    toastMessage.classList.remove('hidden');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastMessage.classList.add('hidden');
    }, 2200);
  }

  /**
   * Copy Result to Clipboard
   * @param {'celsius' | 'fahrenheit' | 'kelvin'} targetUnit
   * @param {HTMLButtonElement} btn
   */
  function copyResult(targetUnit, btn) {
    let numText = '';
    let symbol = '';

    if (targetUnit === 'celsius') {
      numText = valCelsius ? valCelsius.textContent : '';
      symbol = '°C';
    } else if (targetUnit === 'fahrenheit') {
      numText = valFahrenheit ? valFahrenheit.textContent : '';
      symbol = '°F';
    } else if (targetUnit === 'kelvin') {
      numText = valKelvin ? valKelvin.textContent : '';
      symbol = 'K';
    }

    if (!numText || numText === '--') {
      showToast('No converted value to copy yet.');
      return;
    }

    const copyString = `${numText} ${symbol}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copyString).then(onSuccess).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      const textarea = document.createElement('textarea');
      textarea.value = copyString;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        onSuccess();
      } catch (err) {
        showToast('Unable to copy.');
      }
      document.body.removeChild(textarea);
    }

    function onSuccess() {
      const origText = btn.querySelector('.copy-text');
      const origIcon = btn.querySelector('.copy-icon');
      const prev = origText ? origText.textContent : 'Copy';

      btn.classList.add('copied');
      if (origText) origText.textContent = 'Copied!';
      if (origIcon) origIcon.textContent = '✓';

      playBeep(900, 0.08);
      showToast(`Copied ${copyString} to clipboard!`);

      setTimeout(function () {
        btn.classList.remove('copied');
        if (origText) origText.textContent = prev;
        if (origIcon) origIcon.textContent = '📋';
      }, 2000);
    }
  }

  /**
   * Theme Manager (Dark / Light)
   */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(saved);

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
        playBeep(650, 0.06);
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (themeText) {
      themeText.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
  }

  /**
   * Sound Settings
   */
  function initSound() {
    const saved = localStorage.getItem(SOUND_KEY);
    soundEnabled = saved !== 'false';
    updateSoundUI();

    if (soundToggle) {
      soundToggle.addEventListener('click', function () {
        soundEnabled = !soundEnabled;
        localStorage.setItem(SOUND_KEY, soundEnabled ? 'true' : 'false');
        updateSoundUI();
        if (soundEnabled) playBeep(700, 0.06);
        showToast(`Sound effects ${soundEnabled ? 'enabled 🔊' : 'muted 🔇'}`);
      });
    }
  }

  function updateSoundUI() {
    if (soundIcon) {
      soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
  }

  /**
   * Bind all user interaction events
   */
  function initEvents() {
    // Form submission (Click Convert / Press Enter)
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateAndRender(true);
      });
    }

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', handleReset);
    }

    // Cycle / Swap button
    if (swapUnitBtn) {
      swapUnitBtn.addEventListener('click', cycleUnit);
    }

    // Input Enter key explicit trigger
    if (tempInput) {
      tempInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          calculateAndRender(true);
        }
      });

      // Clear error on user typing
      tempInput.addEventListener('input', function () {
        if (errorBox && !errorBox.classList.contains('hidden')) {
          hideError();
        }
      });
    }

    // Unit tabs click
    unitTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const u = tab.getAttribute('data-unit');
        if (u) {
          setUnit(u);
          playBeep(600, 0.05);
        }
      });
    });

    // Precision select change
    if (precisionSelect) {
      precisionSelect.addEventListener('change', function () {
        precision = parseInt(precisionSelect.value, 10) || 2;
        if (tempInput && tempInput.value.trim() !== '') {
          const check = validateInput(tempInput.value);
          if (check.valid) {
            calculateAndRender(false);
          }
        }
      });
    }

    // Stepper actions (▲ / ▼)
    if (stepUp) {
      stepUp.addEventListener('click', function () {
        const cur = parseFloat(tempInput.value) || 0;
        tempInput.value = (cur + 1).toString();
        calculateAndRender(false);
        playBeep(700, 0.04);
      });
    }

    if (stepDown) {
      stepDown.addEventListener('click', function () {
        const cur = parseFloat(tempInput.value) || 0;
        tempInput.value = (cur - 1).toString();
        calculateAndRender(false);
        playBeep(650, 0.04);
      });
    }

    // Quick chips
    chipButtons.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const delta = parseFloat(chip.getAttribute('data-step')) || 0;
        const cur = parseFloat(tempInput.value) || 0;
        tempInput.value = (cur + delta).toString();
        calculateAndRender(false);
        playBeep(720, 0.04);
      });
    });

    // Copy buttons
    const copyBtns = document.querySelectorAll('.copy-tile-btn');
    copyBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-target');
        copyResult(target, btn);
      });
    });

    // Large Preset Cards (1-Click Load)
    presetCards.forEach(function (preset) {
      preset.addEventListener('click', function () {
        const val = preset.getAttribute('data-val');
        const unit = preset.getAttribute('data-unit') || 'celsius';
        if (tempInput) tempInput.value = val;
        setUnit(unit);
        calculateAndRender(true);
        playBeep(800, 0.08);
        const name = preset.querySelector('.preset-title').textContent;
        showToast(`Loaded benchmark preset: ${name}!`);
        const studio = document.getElementById('converterStudio');
        if (studio) studio.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Interactive slider
    if (rangeSlider) {
      rangeSlider.addEventListener('input', function () {
        const sVal = parseFloat(rangeSlider.value);
        if (sliderReadout) sliderReadout.textContent = `${sVal} °C`;
        if (tempInput) tempInput.value = sVal;
        setUnit('celsius');
        calculateAndRender(false);
      });
    }

    // Clear history
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', function () {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
        playBeep(400, 0.08);
        showToast('Conversion history cleared.');
      });
    }

    // Export history
    if (exportHistoryBtn) {
      exportHistoryBtn.addEventListener('click', exportHistoryToCSV);
    }

    // Specific Heat Lab buttons
    if (calcHeatBtn) {
      calcHeatBtn.addEventListener('click', calculateThermalEnergy);
    }
    if (syncConverterHeatBtn) {
      syncConverterHeatBtn.addEventListener('click', syncStudioTempToLab);
    }
  }

  // Initialize all subsystems
  initTheme();
  initSound();
  setUnit('celsius');
  initEvents();
  renderHistory();
  renderMatrixTable(25);
  calculateThermalEnergy();

  // Load initial active demonstration conversion (25 °C)
  if (tempInput) {
    tempInput.value = '25';
    calculateAndRender(false);
  }

})();
