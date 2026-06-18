import {validateTrip} from '../validators/trip.validator.js';
import { setTrip } from '../store/trip.store.js';
import { navigateTo } from '../router/router.js';
import { appHeader } from '../components/header.js';
const INTERESTS = [
  { value: 'food', label: 'Food', selected: true },
  { value: 'shopping', label: 'Shopping' },
  { value: 'museums', label: 'Museums' },
  { value: 'adventure', label: 'Adventure', selected: true },
  { value: 'nature', label: 'Nature', selected: true },
  { value: 'beach', label: 'Beach' },
  { value: 'history', label: 'History' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'family-friendly', label: 'Family-friendly' },
];

const BUDGETS = [
  { value: 'low', label: 'Low', amount: '$' },
  { value: 'medium', label: 'Medium', amount: '$$', selected: true },
  { value: 'luxury', label: 'Luxury', amount: '$$$' },
];

function interestsMarkup() {
  return INTERESTS.map(
    (item) => `
      <input
        type="checkbox"
        class="btn-check interest-check"
        id="interest-${item.value}"
        value="${item.value}"
        autocomplete="off"
        ${item.selected ? 'checked' : ''}
      />
      <label class="btn interest-pill rounded-pill px-4" for="interest-${item.value}">
        ${item.label}
      </label>
    `
  ).join('');
}

function budgetMarkup() {
  return BUDGETS.map(
    (item) => `
      <div class="col-6 col-md-3">
        <input
          type="radio"
          class="btn-check budget-radio"
          name="budget"
          id="budget-${item.value}"
          value="${item.value}"
          autocomplete="off"
          ${item.selected ? 'checked' : ''}
        />
        <label class="btn budget-card w-100" for="budget-${item.value}">
          <span class="fw-bold">${item.label}</span>
          <span class="amount">${item.amount}</span>
        </label>
      </div>
    `
  ).join('');
}

export function renderSearchView() {
  const page = document.createElement('main');
  page.className = 'search-page py-3 py-md-4';

  page.innerHTML = `
    <div class="container" style="max-width: 680px;">
      <div class="card border-0 shadow-lg rounded-4">
        <div class="card-body p-2 p-md-3">

          ${appHeader()}

          <!-- Steps -->
          <div class="steps mb-5">
            <div class="step active"><span class="step-num">1</span><span>Search</span></div>
            <div class="step"><span class="step-num">2</span><span>Generate</span></div>
            <div class="step"><span class="step-num">3</span><span>Results</span></div>
          </div>

          <!-- Hero -->
          <div class="mb-4">
            <h1 class="fw-bold">Let's plan your perfect trip ✈️</h1>
            <p class="text-secondary fs-5 m-0">Tell us about your trip and preferences</p>
          </div>

          <form class="trip-form" id="tripForm" novalidate>

            <!-- Destination -->
            <div class="mb-4">
              <label for="destination" class="form-label fw-bold">Destination</label>
              <div class="input-group input-group-lg">
                <input type="text" class="form-control" id="destination" name="destination"
                       placeholder="e.g. Paris, France or Europe" />
                <span class="input-group-text">📍</span>
              </div>
              <div class="field-error text-danger small mt-1" data-error="destination"></div>
            </div>

            <!-- Travel dates -->
            <div class="mb-4">
              <label class="form-label fw-bold">Travel Dates</label>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="startDate" class="form-label small text-secondary">Start Date</label>
                  <input type="date" class="form-control form-control-lg" id="startDate" name="startDate" />
                  <div class="field-error text-danger small mt-1" data-error="startDate"></div>
                </div>
                <div class="col-md-6">
                  <label for="endDate" class="form-label small text-secondary">End Date</label>
                  <input type="date" class="form-control form-control-lg" id="endDate" name="endDate" />
                  <div class="field-error text-danger small mt-1" data-error="endDate"></div>
                </div>
              </div>
            </div>

            <!-- Travelers -->
            <div class="mb-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <label class="form-label fw-bold m-0">Travelers</label>
                <span class="fw-bold text-primary">Total: <span id="totalTravelers">3</span> Travelers</span>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded-3 p-3">
                    <div class="small fw-bold text-secondary mb-2">Adults</div>
                    <div class="d-flex align-items-center justify-content-between">
                      <button class="stepper-btn" type="button"
                              data-action="decrease" data-target="adults">−</button>
                      <strong class="fs-5" id="adultsCount">2</strong>
                      <button class="stepper-btn" type="button"
                              data-action="increase" data-target="adults">+</button>
                    </div>
                    <input type="hidden" name="adults" id="adultsInput" value="2" />
                  </div>
                  <div class="field-error text-danger small mt-1" data-error="adults"></div>
                </div>
                <div class="col-md-6">
                  <div class="border rounded-3 p-3">
                    <div class="small fw-bold text-secondary mb-2">Children</div>
                    <div class="d-flex align-items-center justify-content-between">
                      <button class="stepper-btn" type="button"
                              data-action="decrease" data-target="children">−</button>
                      <strong class="fs-5" id="childrenCount">1</strong>
                      <button class="stepper-btn" type="button"
                              data-action="increase" data-target="children">+</button>
                    </div>
                    <input type="hidden" name="children" id="childrenInput" value="1" />
                  </div>
                  <div class="field-error text-danger small mt-1" data-error="children"></div>
                </div>
              </div>
            </div>

            <!-- Budget -->
            <div class="mb-4">
              <label class="form-label fw-bold">Budget</label>
              <div class="row g-3 align-items-stretch">
                ${budgetMarkup()}
                <div class="col-6 col-md-3">
                  <div class="border rounded-3 p-3 h-100 d-flex flex-column justify-content-center">
                    <span class="fw-bold mb-1">Custom</span>
                    <input type="number" class="form-control border-0 p-0" min="0"
                           id="customBudget" name="customBudget" placeholder="Enter amount" />
                  </div>
                </div>
              </div>
              <div class="field-error text-danger small mt-1" data-error="budget"></div>
            </div>

            <!-- Interests -->
            <div class="mb-4">
              <label class="form-label fw-bold">
                Interests <span class="text-secondary fw-normal">(Select all that apply)</span>
              </label>
              <div class="d-flex flex-wrap gap-2">
                ${interestsMarkup()}
              </div>
              <div class="field-error text-danger small mt-1" data-error="interests"></div>
            </div>

            <!-- Preferences -->
            <div class="mb-4">
              <label class="form-label fw-bold">Preferences</label>
              <div class="row g-3">
                <div class="col-6 col-md-3">
                  <label for="hotelRating" class="form-label small text-secondary">Hotel Rating</label>
                  <select id="hotelRating" name="hotelRating" class="form-select">
                    <option value="3">3 Stars &amp; above</option>
                    <option value="4" selected>4 Stars &amp; above</option>
                    <option value="5">5 Stars</option>
                  </select>
                  <div class="field-error text-danger small mt-1" data-error="hotelRating"></div>
                </div>
                <div class="col-6 col-md-3">
                  <label for="flightClass" class="form-label small text-secondary">Flight Class</label>
                  <select id="flightClass" name="flightClass" class="form-select">
                    <option value="economy" selected>Economy</option>
                    <option value="premium-economy">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                  <div class="field-error text-danger small mt-1" data-error="flightClass"></div>
                </div>
                <div class="col-6 col-md-3">
                  <label for="weatherPreference" class="form-label small text-secondary">Weather Preference</label>
                  <select id="weatherPreference" name="weatherPreference" class="form-select">
                    <option value="warm" selected>Warm</option>
                    <option value="cold">Cold</option>
                    <option value="mild">Mild</option>
                    <option value="any">Any Weather</option>
                  </select>
                  <div class="field-error text-danger small mt-1" data-error="weatherPreference"></div>
                </div>
                <div class="col-6 col-md-3">
                  <label for="tripPace" class="form-label small text-secondary">Trip Pace</label>
                  <select id="tripPace" name="tripPace" class="form-select">
                    <option value="relaxed">Relaxed</option>
                    <option value="balanced" selected>Balanced</option>
                    <option value="busy">Busy</option>
                  </select>
                  <div class="field-error text-danger small mt-1" data-error="tripPace"></div>
                </div>
              </div>
            </div>

            <!-- Special notes -->
            <div class="mb-4">
              <label for="specialNotes" class="form-label fw-bold">
                Special Notes <span class="text-secondary fw-normal">(Optional)</span>
              </label>
              <textarea id="specialNotes" name="specialNotes" rows="5" class="form-control"
                        placeholder="Any special requests, celebrations, accessibility needs..."></textarea>
            </div>

            <!-- Submit -->
            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg fw-bold py-3">
                Generate My Trip Plan →
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  `;

  setupSearchInteractions(page);

  return page;
}

function setupSearchInteractions(root) {
  setupTravelers(root);
  setupBudget(root);
  setupSubmit(root);
}

// Travelers: + / − steppers update the count and the running total.
function setupTravelers(root) {
  const limits = {
    adults: { min: 1, max: 20 },
    children: { min: 0, max: 20 },
  };

  function updateTotal() {
    const adults = Number(root.querySelector('#adultsInput').value);
    const children = Number(root.querySelector('#childrenInput').value);
    root.querySelector('#totalTravelers').textContent = adults + children;
  }

  root.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target; // 'adults' | 'children'
      const input = root.querySelector(`#${target}Input`);
      const display = root.querySelector(`#${target}Count`);
      const { min, max } = limits[target];

      let value = Number(input.value);
      value += btn.dataset.action === 'increase' ? 1 : -1;
      value = Math.max(min, Math.min(max, value));

      input.value = value;
      display.textContent = value;
      updateTotal();
    });
  });

  updateTotal();
}

// Budget: the radio cards toggle natively; typing a custom amount clears the cards.
function setupBudget(root) {
  const radios = root.querySelectorAll('.budget-radio');
  const custom = root.querySelector('#customBudget');

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      custom.value = '';
    });
  });

  custom.addEventListener('input', () => {
    if (custom.value !== '') {
      radios.forEach((radio) => (radio.checked = false));
    }
  });
}

// Submit: collect everything (incl. multi-selected interests) and report it.
function setupSubmit(root) {
  const form = root.querySelector('#tripForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const interests = [...root.querySelectorAll('.interest-check:checked')].map((el) => el.value);
    const checkedBudget = root.querySelector('.budget-radio:checked');
    const customBudget = root.querySelector('#customBudget').value;

    const trip = {
      destination: form.destination.value.trim(),
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      adults: Number(form.adults.value),
      children: Number(form.children.value),
      budget: customBudget ? `custom:${customBudget}` : checkedBudget?.value ?? null,
      interests,
      hotelRating: form.hotelRating.value,
      flightClass: form.flightClass.value,
      weatherPreference: form.weatherPreference.value,
      tripPace: form.tripPace.value,
      specialNotes: form.specialNotes.value,
    };

    const { isValid, errors } = validateTrip(trip);
    showErrors(root, errors);

    if (!isValid) return;
    setTrip(trip);
    navigateTo('/generate'); 
  });
}

// Renders each error message under its related field, and clears any field
// that is now valid. Also toggles the red border on the text/date inputs.
function showErrors(root, errors) {
  let firstInvalid = null;

  root.querySelectorAll('[data-error]').forEach((slot) => {
    const name = slot.dataset.error;
    const message = errors[name];

    slot.textContent = message || '';

    const field = root.querySelector(`#${name}`);
    if (field) field.classList.toggle('is-invalid', Boolean(message));

    if (message && !firstInvalid) firstInvalid = slot;
  });

  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
