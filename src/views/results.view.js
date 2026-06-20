import { getTrip, getPlan } from '../store/trip.store.js';
import { saveTrip, isTripSaved } from '../store/saved-trips.store.js';
import { navigateTo } from '../router/router.js';
import { appHeader } from '../components/layout/header.component.js';
import { pageCard } from '../components/ui/card.component.js';
import { escapeHtml as esc } from '../utils/dom.js';
import { formatDate } from '../utils/date.js';
import { budgetLabel, titleCase, stars } from '../utils/formatters.js';
import { heroMarkup, tripSummaryMarkup, quickInfoMarkup, prefsMarkup } from '../components/trip/trip-summary.component.js';
import { dailyPlanMarkup } from '../components/trip/daily-plan.component.js';
import { budgetSidebarMarkup, budgetTabMarkup } from '../components/trip/budget.component.js';
import { listCardMarkup } from '../components/trip/packing-list.component.js';

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

  page.innerHTML = pageCard(`
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

          ${tripSummaryMarkup(plan, trip)}

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
                ${tabPane('itinerary', dailyPlanMarkup(days, trip), true)}
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
              ${budgetSidebarMarkup(plan.budget, travelers)}
              ${quickInfoMarkup(plan.quickInfo)}
            </div>
          </div>
  `, { maxWidth: 1080 });

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

function stepsMarkup() {
  return `
    <div class="steps mb-4">
      <div class="step"><span class="step-num">1</span><span>Search</span></div>
      <div class="step"><span class="step-num">2</span><span>Generate</span></div>
      <div class="step active"><span class="step-num">3</span><span>Results</span></div>
    </div>
  `;
}

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
