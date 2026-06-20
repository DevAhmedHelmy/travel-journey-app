import { getSavedTrips, removeSavedTrip } from '../store/saved-trips.store.js';
import { setTrip, setPlan } from '../store/trip.store.js';
import { navigateTo } from '../router/router.js';
import { appHeader } from '../components/layout/header.component.js';
import { pageCard } from '../components/ui/card.component.js';
import { escapeHtml as esc } from '../utils/dom.js';
import { formatDate } from '../utils/date.js';
import { snippet } from '../utils/formatters.js';

export function renderSavedView() {
  const page = document.createElement('main');
  page.className = 'results-page py-3 py-md-4';

  const count = getSavedTrips().length;

  page.innerHTML = pageCard(`
          ${appHeader()}

          <div class="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-4">
            <div>
              <h1 class="fw-bold mb-1">My Trips</h1>
              <p class="text-secondary m-0">
                ${count ? `${count} saved trip${count === 1 ? '' : 's'} on this device.` : 'Your saved trips will live here.'}
              </p>
            </div>
            <a href="/search" data-link class="btn btn-primary">➕ Plan a new trip</a>
          </div>

          <div id="savedList"></div>
  `, { maxWidth: 980 });

  const list = page.querySelector('#savedList');
  renderList(list);

  // Open / delete handled via event delegation.
  list.addEventListener('click', (event) => {
    const card = event.target.closest('[data-id]');
    if (!card) return;
    const id = card.dataset.id;

    if (event.target.closest('[data-action="delete"]')) {
      removeSavedTrip(id);
      renderList(list);
      return;
    }

    if (event.target.closest('[data-action="view"]')) {
      openTrip(id);
    }
  });

  return page;
}

function openTrip(id) {
  const record = getSavedTrips().find((t) => t.id === id);
  if (!record) return;
  setTrip(record.trip);
  setPlan(record.plan);
  navigateTo('/results');
}

function renderList(container) {
  const trips = getSavedTrips();

  if (!trips.length) {
    container.innerHTML = `
      <div class="saved-empty text-center rounded-4 py-5 px-3">
        <div class="saved-empty-icon mb-3">🧳</div>
        <h4 class="fw-bold mb-2">No trips yet</h4>
        <p class="text-secondary mb-4 mx-auto" style="max-width: 420px;">
          You haven't saved any trips so far. Plan your next adventure and tap
          <span class="fw-semibold">“Save Trip”</span> to keep it here.
        </p>
        <a href="/search" data-link class="btn btn-primary btn-lg px-4">✨ Start planning a trip</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="row g-3">
      ${trips.map(cardMarkup).join('')}
    </div>
  `;
}

function cardMarkup(record) {
  const trip = record.trip || {};
  const plan = record.plan || {};
  const travelers = (trip.adults || 0) + (trip.children || 0);
  const dateRange = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate, true)}`;

  return `
    <div class="col-md-6">
      <div class="saved-card p-3 h-100 d-flex flex-column" data-id="${esc(record.id)}">
        <div class="saved-card-banner mb-3">🏙️</div>
        <div class="d-flex justify-content-between align-items-start">
          <h5 class="fw-bold mb-1">${esc(trip.destination || 'Trip')}</h5>
          <button class="btn btn-sm btn-link text-danger p-0" type="button"
                  data-action="delete" aria-label="Delete trip">🗑️</button>
        </div>
        <div class="text-secondary small mb-2">
          📅 ${esc(dateRange)} &middot; 👥 ${travelers} traveler${travelers === 1 ? '' : 's'}
        </div>
        <p class="text-secondary small flex-grow-1">${esc(snippet(plan.summary))}</p>
        <div class="d-flex align-items-center justify-content-between mt-2">
          <span class="text-secondary" style="font-size: 0.75rem;">Saved ${esc(formatDate(record.savedAt, true))}</span>
          <button class="btn btn-sm btn-primary" type="button" data-action="view">View trip →</button>
        </div>
      </div>
    </div>
  `;
}
