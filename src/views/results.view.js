import { getTrip, getPlan } from '../store/trip.store.js';
import { saveTrip, isTripSaved } from '../store/saved-trips.store.js';
import { navigateTo } from '../router/router.js';
import { appHeader } from '../components/header.js';

export function renderResultsView() {
  const page = document.createElement('main');
  const trip = getTrip();
  const plan = getPlan();

  // Can't show results without a generated plan -> back to search.
  if (!plan || !trip) {
    navigateTo('/search');
    return page;
  }

  page.className = 'results-page py-3 py-md-4';

  const travelers = (trip.adults || 0) + (trip.children || 0);
  const dateRange = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate, true)}`;
  const days = Array.isArray(plan.dailyPlan) ? plan.dailyPlan : [];

  page.innerHTML = `
    <div class="container" style="max-width: 1080px;">
      <div class="card border-0 shadow-lg rounded-4">
        <div class="card-body p-3 p-md-4">

          ${appHeader()}
          ${stepsMarkup()}

          <!-- Title + actions -->
          <div class="d-flex flex-wrap align-items-start justify-content-between gap-3 mt-2 mb-1">
            <div>
              <h1 class="fw-bold mb-1">Your Trip to ${esc(trip.destination)} 🌍</h1>
              <p class="text-secondary m-0">
                ${esc(dateRange)} &middot; ${travelers} Traveler${travelers === 1 ? '' : 's'} &middot; Budget: ${esc(budgetLabel(trip.budget))}
              </p>
            </div>
            <div class="d-flex gap-2">
              <a href="/saved" data-link class="btn btn-light" title="View saved trips">🧳 My Trips</a>
              <button id="saveTripBtn" class="btn btn-outline-secondary" type="button">♡ Save Trip</button>
              <button class="btn btn-outline-primary" type="button">↗ Share</button>
            </div>
          </div>

          ${heroMarkup(trip, dateRange, plan.weather)}

          <!-- AI summary + map -->
          <div class="row g-3 mb-3">
            <div class="col-lg-8">
              <div class="border rounded-4 p-3 h-100">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="res-ai-icon">✨</span>
                  <h5 class="fw-bold m-0">AI Trip Summary</h5>
                </div>
                <p class="text-secondary m-0">${esc(plan.summary || 'No summary available.')}</p>
              </div>
            </div>
            <div class="col-lg-4">
              <a class="res-map" target="_blank" rel="noopener"
                 href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.destination)}">
                <span class="pin">📍</span>
                <span class="btn btn-primary btn-sm position-absolute bottom-0 start-50 translate-middle-x mb-3">
                  View on Map
                </span>
              </a>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="nav nav-tabs res-tabs flex-nowrap overflow-auto mb-3" role="tablist">
            ${tabButton('itinerary', 'Itinerary', true)}
            ${tabButton('places', 'Top Places')}
            ${tabButton('hotels', 'Hotels')}
            ${tabButton('flights', 'Flights')}
            ${tabButton('budget', 'Budget')}
            ${tabButton('packing', 'Packing List')}
            ${tabButton('warnings', 'Warnings')}
          </ul>

          <div class="row g-4">
            <!-- Main: active tab content -->
            <div class="col-lg-8">
              <div class="tab-content">
                ${tabPane('itinerary', itineraryMarkup(days, trip, plan), true)}
                ${tabPane('places', listCardMarkup('Top Places to Visit', plan.bestPlaces, '📌'))}
                ${tabPane('hotels', prefsMarkup('Hotels', [['Preferred rating', stars(trip.hotelRating)], ['Estimated cost', plan.budget?.breakdown?.hotel]]))}
                ${tabPane('flights', prefsMarkup('Flights', [['Class', titleCase(trip.flightClass)], ['Estimated cost', plan.budget?.breakdown?.flights]]))}
                ${tabPane('budget', budgetTabMarkup(plan.budget, travelers))}
                ${tabPane('packing', listCardMarkup('Packing List', plan.packingList, '🧳'))}
                ${tabPane('warnings', listCardMarkup('Warnings & Tips', plan.warnings, '⚠️'))}
              </div>
            </div>

            <!-- Sidebar: budget + quick info (always visible) -->
            <div class="col-lg-4">
              ${sidebarBudgetMarkup(plan.budget, travelers)}
              ${quickInfoMarkup(plan.quickInfo)}
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  setupDaySwitching(page);
  setupSaveTrip(page, trip, plan);
  return page;
}

// Save the current trip (input + plan) to localStorage, then jump to the
// saved-trips page so the user sees it persisted.
function setupSaveTrip(page, trip, plan) {
  const btn = page.querySelector('#saveTripBtn');
  if (!btn) return;

  if (isTripSaved(trip)) {
    markSaved(btn);
  }

  btn.addEventListener('click', () => {
    saveTrip(trip, plan);
    markSaved(btn);
    navigateTo('/saved');
  });
}

function markSaved(btn) {
  btn.classList.remove('btn-outline-secondary');
  btn.classList.add('btn-success');
  btn.textContent = '✓ Saved';
}

// Clicking a day in the itinerary swaps the visible day panel.
function setupDaySwitching(page) {
  const dayList = page.querySelector('#dayList');
  const panels = page.querySelector('#dayPanels');
  if (!dayList || !panels) return;

  dayList.addEventListener('click', (event) => {
    const dayEl = event.target.closest('.res-day');
    if (!dayEl) return;

    const index = dayEl.dataset.day;
    dayList.querySelectorAll('.res-day').forEach((el) => el.classList.toggle('active', el === dayEl));
    panels.querySelectorAll('.day-panel').forEach((el) => {
      el.classList.toggle('d-none', el.dataset.panel !== index);
    });
  });
}

/* ---------- sections ---------- */

function stepsMarkup() {
  return `
    <div class="steps mb-4">
      <div class="step"><span class="step-num">1</span><span>Search</span></div>
      <div class="step"><span class="step-num">2</span><span>Generate</span></div>
      <div class="step active"><span class="step-num">3</span><span>Results</span></div>
    </div>
  `;
}

function heroMarkup(trip, dateRange, weather) {
  const current = weather?.current;
  const forecast = Array.isArray(weather?.forecast) ? weather.forecast : [];

  const forecastStrip = forecast.length
    ? `
      <div class="res-forecast d-flex gap-2 flex-wrap">
        ${forecast.map((f) => `
          <div class="res-forecast-day text-center">
            <div class="small opacity-75">${esc(f.day)}</div>
            <div class="fs-5">${esc(f.icon || '')}</div>
            <div class="fw-semibold">${esc(f.high ?? '')}</div>
            <div class="small opacity-75">${esc(f.low ?? '')}</div>
          </div>
        `).join('')}
      </div>`
    : '';

  return `
    <div class="res-hero d-flex flex-wrap align-items-center justify-content-between gap-4 p-4 mb-3">
      <span class="hero-city">🏙️</span>
      <div>
        <div class="hero-temp">${esc(current?.temp ?? trip.destination)}</div>
        <div class="mt-2">
          <div class="fw-semibold">${esc(current?.condition || dateRange)}</div>
          <div class="opacity-75 small">${esc(dateRange)} &middot; ${esc(trip.destination)}</div>
        </div>
      </div>
      ${forecastStrip}
    </div>
  `;
}

function itineraryMarkup(days, trip, plan) {
  if (!days.length) {
    return emptyMarkup('No daily plan was generated.');
  }

  const dayList = days
    .map((d, i) => `
      <div class="res-day p-3 mb-2 ${i === 0 ? 'active' : ''}" data-day="${i}">
        <div class="fw-bold res-day-title">Day ${d.day ?? i + 1}</div>
        <div class="text-secondary small">${esc(addDays(trip.startDate, i))}</div>
      </div>
    `)
    .join('');

  const panels = days.map((d, i) => dayPanelMarkup(d, i)).join('');

  return `
    <div class="row g-3">
      <div class="col-md-4 col-lg-3" id="dayList">${dayList}</div>
      <div class="col-md-8 col-lg-9" id="dayPanels">${panels}</div>
    </div>
  `;
}

function dayPanelMarkup(day, index) {
  const items = day.activities || [];
  const activities = items.length
    ? `<div class="res-timeline">${items.map(activityMarkup).join('')}</div>`
    : '';

  const food = (day.food || []).length
    ? `<div class="mt-3">
         <div class="fw-semibold mb-1">🍽️ Food</div>
         <ul class="text-secondary mb-0">${(day.food || []).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
       </div>`
    : '';

  const notes = day.notes
    ? `<div class="gen-tip p-3 mt-3"><span class="fw-semibold">Note:</span> <span class="text-secondary">${esc(day.notes)}</span></div>`
    : '';

  return `
    <div class="day-panel ${index === 0 ? '' : 'd-none'}" data-panel="${index}">
      <h5 class="fw-bold mb-3">Day ${day.day ?? index + 1}${day.title ? ` &middot; ${esc(day.title)}` : ''}</h5>
      ${activities || emptyMarkup('No activities listed.')}
      ${food}
      ${notes}
    </div>
  `;
}

// An activity can be an object {time, title, description} or a plain string.
function activityMarkup(activity) {
  const a = typeof activity === 'string' ? { title: activity } : (activity || {});
  return `
    <div class="res-tl-item">
      <div class="res-tl-time">${esc(a.time || '')}</div>
      <div class="res-tl-track"><span class="res-tl-dot"></span></div>
      <div class="res-tl-body">
        <div class="fw-semibold">${esc(a.title || '')}</div>
        ${a.description ? `<div class="text-secondary small">${esc(a.description)}</div>` : ''}
      </div>
      <div class="res-thumb">🖼️</div>
    </div>
  `;
}

function sidebarBudgetMarkup(budget, travelers) {
  if (!budget) return '';
  const b = budget.breakdown || {};
  const rows = [
    ['Flights', b.flights],
    ['Hotels', b.hotel],
    ['Food', b.food],
    ['Activities', b.activities],
    ['Transport', b.transport],
  ].filter(([, v]) => v != null);

  return `
    <div class="border rounded-4 p-3 mb-3">
      <h5 class="fw-bold mb-3">Estimated Budget</h5>
      <div class="d-flex justify-content-between align-items-end mb-1">
        <span class="text-secondary">Total Budget</span>
        <span class="fs-4 fw-bold text-primary">${esc(budget.estimatedTotal ?? '—')}</span>
      </div>
      <div class="text-secondary small mb-2 text-end">For ${travelers} traveler${travelers === 1 ? '' : 's'}</div>
      ${rows.map(([k, v]) => `<div class="res-budget-row"><span class="text-secondary">${esc(k)}</span><span class="fw-semibold">${esc(v)}</span></div>`).join('')}
      <button class="btn btn-link p-0 mt-2 text-decoration-none fw-semibold"
              type="button" data-bs-toggle="tab" data-bs-target="#pane-budget">View Full Breakdown</button>
    </div>
  `;
}

function quickInfoMarkup(info) {
  if (!info) return '';
  const rows = [
    ['💱', 'Currency', info.currency],
    ['🗣️', 'Language', info.language],
    ['🕐', 'Time Zone', info.timeZone],
    ['🔌', 'Voltage', info.voltage],
  ].filter(([, , v]) => v != null && v !== '');

  if (!rows.length) return '';

  return `
    <div class="border rounded-4 p-3">
      <h5 class="fw-bold mb-3">Quick Info</h5>
      ${rows.map(([icon, label, value]) => `
        <div class="res-info-row">
          <span class="text-secondary"><span class="me-2">${icon}</span>${esc(label)}</span>
          <span class="fw-semibold">${esc(value)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function budgetTabMarkup(budget, travelers) {
  if (!budget) return emptyMarkup('No budget breakdown available.');
  const b = budget.breakdown || {};
  const rows = [
    ['✈️ Flights', b.flights],
    ['🏨 Hotel', b.hotel],
    ['🍽️ Food', b.food],
    ['🚕 Transport', b.transport],
    ['🎟️ Activities', b.activities],
  ].filter(([, v]) => v != null);

  return `
    <div class="border rounded-4 p-3" style="max-width: 520px;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="fw-bold m-0">Estimated Budget</h5>
        <span class="fs-4 fw-bold text-primary">${esc(budget.estimatedTotal ?? '—')}</span>
      </div>
      <div class="text-secondary small mb-2">For ${travelers} traveler${travelers === 1 ? '' : 's'}</div>
      ${rows.map(([k, v]) => `<div class="res-budget-row"><span class="text-secondary">${k}</span><span class="fw-semibold">${esc(v)}</span></div>`).join('')}
    </div>
  `;
}

function prefsMarkup(title, rows) {
  const valid = rows.filter(([, v]) => v != null && v !== '');
  return `
    <div class="border rounded-4 p-3" style="max-width: 520px;">
      <h5 class="fw-bold mb-3">${esc(title)}</h5>
      ${valid.length
        ? valid.map(([k, v]) => `<div class="res-info-row"><span class="text-secondary">${esc(k)}</span><span class="fw-semibold">${esc(v)}</span></div>`).join('')
        : emptyMarkup('No details available.')}
    </div>
  `;
}

function listCardMarkup(title, items, icon) {
  const list = Array.isArray(items) ? items : [];
  return `
    <div class="border rounded-4 p-3">
      <h5 class="fw-bold mb-3">${esc(title)}</h5>
      ${list.length
        ? `<div class="d-flex flex-column gap-2">
             ${list.map((it) => `<div class="d-flex gap-2"><span>${icon}</span><span>${esc(it)}</span></div>`).join('')}
           </div>`
        : emptyMarkup('Nothing here yet.')}
    </div>
  `;
}

function emptyMarkup(text) {
  return `<p class="text-secondary fst-italic m-0">${esc(text)}</p>`;
}

/* ---------- tab helpers ---------- */

function tabButton(id, label, active = false) {
  return `
    <li class="nav-item" role="presentation">
      <button class="nav-link ${active ? 'active' : ''}" id="tab-${id}" data-bs-toggle="tab"
              data-bs-target="#pane-${id}" type="button" role="tab">${label}</button>
    </li>
  `;
}

function tabPane(id, inner, active = false) {
  return `
    <div class="tab-pane fade ${active ? 'show active' : ''}" id="pane-${id}" role="tabpanel">
      ${inner}
    </div>
  `;
}

/* ---------- formatting ---------- */

function formatDate(value, withYear = false) {
  const opts = { month: 'short', day: 'numeric' };
  if (withYear) opts.year = 'numeric';
  return new Date(value).toLocaleDateString('en-US', opts);
}

function addDays(start, offset) {
  const d = new Date(start);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function budgetLabel(budget) {
  if (!budget) return 'Flexible';
  if (String(budget).startsWith('custom:')) return `$${String(budget).split(':')[1]}`;
  return titleCase(budget);
}

function stars(rating) {
  const n = Number(rating);
  if (!n) return rating ? titleCase(rating) : '';
  return '⭐'.repeat(n);
}

function titleCase(value) {
  if (!value) return '';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}
