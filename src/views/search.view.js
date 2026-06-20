import { validateTrip } from '../validators/trip.validator.js';
import { setTrip } from '../store/trip.store.js';
import { navigateTo } from '../router/router.js';
import { appHeader } from '../components/layout/header.component.js';
import { pageCard } from '../components/ui/card.component.js';
import { interestsCheckboxGroup } from '../components/form/checkbox-group.component.js';
import { selectField } from '../components/form/select.component.js';
import { textFieldWithAddon, dateField } from '../components/form/input.component.js';

const BUDGETS = [
  { value: 'low', label: 'Low', amount: '$' },
  { value: 'medium', label: 'Medium', amount: '$$', selected: true },
  { value: 'luxury', label: 'Luxury', amount: '$$$' },
];

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

  page.innerHTML = pageCard(`
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
            ${textFieldWithAddon({
              id: 'destination',
              label: 'Destination',
              placeholder: 'e.g. Paris, France or Europe',
              addon: '📍',
            })}

            <!-- Travel dates -->
            <div class="mb-4">
              <label class="form-label fw-bold">Travel Dates</label>
              <div class="row g-3">
                ${dateField({ id: 'startDate', label: 'Start Date' })}
                ${dateField({ id: 'endDate', label: 'End Date' })}
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
                ${interestsCheckboxGroup()}
              </div>
              <div class="field-error text-danger small mt-1" data-error="interests"></div>
            </div>

            <!-- Preferences -->
            <div class="mb-4">
              <label class="form-label fw-bold">Preferences</label>
              <div class="row g-3">
                ${selectField({
                  id: 'hotelRating',
                  label: 'Hotel Rating',
                  options: [
                    { value: '3', label: '3 Stars &amp; above' },
                    { value: '4', label: '4 Stars &amp; above', selected: true },
                    { value: '5', label: '5 Stars' },
                  ],
                })}
                ${selectField({
                  id: 'flightClass',
                  label: 'Flight Class',
                  options: [
                    { value: 'economy', label: 'Economy', selected: true },
                    { value: 'premium-economy', label: 'Premium Economy' },
                    { value: 'business', label: 'Business' },
                    { value: 'first', label: 'First Class' },
                  ],
                })}
                ${selectField({
                  id: 'weatherPreference',
                  label: 'Weather Preference',
                  options: [
                    { value: 'warm', label: 'Warm', selected: true },
                    { value: 'cold', label: 'Cold' },
                    { value: 'mild', label: 'Mild' },
                    { value: 'any', label: 'Any Weather' },
                  ],
                })}
                ${selectField({
                  id: 'tripPace',
                  label: 'Trip Pace',
                  options: [
                    { value: 'relaxed', label: 'Relaxed' },
                    { value: 'balanced', label: 'Balanced', selected: true },
                    { value: 'busy', label: 'Busy' },
                  ],
                })}
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
  `, { maxWidth: 680, bodyClass: 'p-2 p-md-3' });

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
