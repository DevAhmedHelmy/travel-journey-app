import { escapeHtml as esc, emptyMarkup } from '../../utils/dom.js';

// Compact budget card shown in the results sidebar.
export function budgetSidebarMarkup(budget, travelers) {
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

// Full budget breakdown shown in the Budget tab.
export function budgetTabMarkup(budget, travelers) {
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
