import { formatDateRange } from '../../utils/date.js';

// The multi-step "building your plan" loader shown on the generate page.
// Returns the inner markup for the steps container.
export function generationStepsMarkup(trip) {
  return buildSteps(trip).map(stepMarkup).join('');
}

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
