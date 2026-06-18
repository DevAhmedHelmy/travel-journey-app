import { getTrip, setPlan, setError } from '../store/trip.store.js';
import { navigateTo } from '../router/router.js';
import { generateTravelPlan } from '../services/ai.service.js';
import { appHeader } from '../components/header.js';
 
function buildSteps(trip) {
  return [
    {
      id: 'weather',
      icon: '🌤️',
      tone: 'green',
      title: 'Fetching weather data',
      subtitle: `${trip.destination} • ${formatDateRange(trip.startDate, trip.endDate)}`,
      status: 'completed',
    },
    {
      id: 'flights',
      icon: '✈️',
      tone: 'green',
      title: 'Finding best flights',
      subtitle: 'Searching for available flights',
      status: 'completed',
    },
    {
      id: 'hotels',
      icon: '🏨',
      tone: 'green',
      title: 'Finding top hotels',
      subtitle: 'Finding best hotels for your stay',
      status: 'completed',
    },
    {
      id: 'location',
      icon: '📍',
      tone: 'green',
      title: 'Getting location details',
      subtitle: 'Map, coordinates & local info',
      status: 'completed',
    },
    {
      id: 'ai',
      icon: '🤖',
      tone: 'blue',
      title: 'Asking AI to craft your plan',
      subtitle: 'This may take a few seconds...',
      status: 'in-progress',
    },
  ];
}

function statusMarkup(status) {
  if (status === 'completed') {
    return `
      <span class="text-success fw-semibold small">Completed</span>
      <span class="text-success fs-6">✓</span>
    `;
  }

  if (status === 'in-progress') {
    return `
      <span class="text-primary fw-semibold small">In Progress</span>
      <span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
    `;
  }

  return `<span class="text-secondary small">Pending</span>`;
}

function stepMarkup(step) {
  return `
    <div class="gen-step d-flex align-items-center gap-3 p-3 ${step.status === 'in-progress' ? 'is-progress' : ''}">
      <div class="gen-icon gen-icon-${step.tone}">${step.icon}</div>
      <div class="flex-grow-1">
        <div class="fw-bold">${step.title}</div>
        <div class="text-secondary small">${step.subtitle}</div>
      </div>
      <div class="d-flex align-items-center gap-2">
        ${statusMarkup(step.status)}
      </div>
    </div>
  `;
}

export function renderGenerateView() {
  const page = document.createElement('main');
  const trip = getTrip();

  if (!trip) {
    navigateTo('/search');
    return page;
  }

  page.className = 'generate-page py-3 py-md-4';

  const steps = buildSteps(trip);

  page.innerHTML = `
    <div class="container" style="max-width: 680px;">
      <div class="card border-0 shadow-lg rounded-4">
        <div class="card-body p-3 p-md-4">

          ${appHeader()}

          <!-- Steps -->
          <div class="steps mb-5">
            <div class="step"><span class="step-num">1</span><span>Search</span></div>
            <div class="step active"><span class="step-num">2</span><span>Generate</span></div>
            <div class="step"><span class="step-num">3</span><span>Results</span></div>
          </div>

          <!-- Heading -->
          <div class="mb-4">
            <h1 class="fw-bold">Creating your perfect trip...</h1>
            <p class="text-secondary fs-5 m-0">
              Please wait while we gather information and our AI builds your personalized plan.
            </p>
          </div>

          <!-- Pipeline -->
          <div class="border rounded-4 overflow-hidden mb-4" id="generateSteps">
            ${steps.map(stepMarkup).join('')}
          </div>

          <!-- Illustration -->
          <div class="gen-illustration mb-4">
            <div class="plane">✈️</div>
            <div class="city">🏙️🗼🏙️</div>
          </div>

          <!-- Tip -->
          <div class="gen-tip p-3 text-center">
            <span class="text-primary fw-bold">Tip:</span>
            <span class="text-secondary">
              AI is creating a personalized plan based on your preferences, budget, and real-time data.
            </span>
          </div>

        </div>
      </div>
    </div>
  `;

  generatePlan(trip);
  return page;
}
async function generatePlan(trip) {
  try {
    const plan = await generateTravelPlan(trip, {
      provider: 'mock',
    });
    setPlan(plan);
    navigateTo('/results');
  } catch (error) {
    console.error(error);

    setError(error.message || 'Failed to generate travel plan');

    navigateTo('/results');
  }
}
// "2025-05-20", "2025-05-26" -> "May 20 - May 26"
function formatDateRange(startDate, endDate) {
  const options = { month: 'short', day: 'numeric' };
  const start = new Date(startDate).toLocaleDateString('en-US', options);
  const end = new Date(endDate).toLocaleDateString('en-US', options);
  return `${start} - ${end}`;
}
