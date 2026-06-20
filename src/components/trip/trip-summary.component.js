import { escapeHtml as esc, emptyMarkup } from '../../utils/dom.js';

// Weather hero banner at the top of the results page.
export function heroMarkup(trip, dateRange, weather) {
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

// AI summary card + map link row.
export function tripSummaryMarkup(plan, trip) {
  return `
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
  `;
}

// Quick info card (currency / language / time zone / voltage).
export function quickInfoMarkup(info) {
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

// Preference rows card (used for the Hotels / Flights tabs).
export function prefsMarkup(title, rows) {
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
