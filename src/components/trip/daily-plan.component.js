import { escapeHtml as esc, emptyMarkup } from '../../utils/dom.js';
import { addDays } from '../../utils/date.js';

// Itinerary: day selector (left) + per-day timeline panels (right).
export function dailyPlanMarkup(days, trip) {
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
