import { getTrip, setPlan, setError } from '../store/trip.store.js';
import { navigateTo } from '../router/router.js';
import { generateTravelPlan } from '../services/ai.service.js';
import { appHeader } from '../components/layout/header.component.js';
import { pageCard } from '../components/ui/card.component.js';
import { generationStepsMarkup } from '../components/ui/loader.component.js';

export function renderGenerateView() {
  const page = document.createElement('main');
  const trip = getTrip();

  if (!trip) {
    navigateTo('/search');
    return page;
  }

  page.className = 'generate-page py-3 py-md-4';

  page.innerHTML = pageCard(`
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
            ${generationStepsMarkup(trip)}
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
  `, { maxWidth: 680 });

  generatePlan(trip);
  return page;
}

async function generatePlan(trip) {
  try {
    const plan = await generateTravelPlan(trip, {
      provider: 'gemini',
    });
    setPlan(plan);
    navigateTo('/results');
  } catch (error) {
    console.error(error);

    setError(error.message || 'Failed to generate travel plan');

    navigateTo('/results');
  }
}
