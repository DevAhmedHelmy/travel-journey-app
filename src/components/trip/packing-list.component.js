import { escapeHtml as esc, emptyMarkup } from '../../utils/dom.js';

// Generic "icon + item" list card (used for Top Places, Packing List, Warnings).
export function listCardMarkup(title, items, icon) {
  const list = Array.isArray(items) ? items : [];
  return `
    <div class="border rounded-4 p-3">
      <h5 class="fw-bold mb-3">${esc(title)}</h5>
      ${list.length
        ? `<div class="d-flex flex-column gap-2">
             ${list.map((it) => `<div class="d-flex gap-2"><span>${icon}</span><span>${esc(it)}</span></div>`).join('')}
           </div>`
        : emptyMarkup('Nothing here yet.')}
    </div>
  `;
}
