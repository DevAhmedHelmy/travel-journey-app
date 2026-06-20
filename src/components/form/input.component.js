// Reusable input field markup for the search form.

// Text input wrapped in an input-group with a trailing icon (e.g. destination).
export function textFieldWithAddon({ id, label, placeholder, addon }) {
  return `
    <div class="mb-4">
      <label for="${id}" class="form-label fw-bold">${label}</label>
      <div class="input-group input-group-lg">
        <input type="text" class="form-control" id="${id}" name="${id}"
               placeholder="${placeholder}" />
        <span class="input-group-text">${addon}</span>
      </div>
      <div class="field-error text-danger small mt-1" data-error="${id}"></div>
    </div>
  `;
}

// A single date column (used for both start and end date).
export function dateField({ id, label }) {
  return `
    <div class="col-md-6">
      <label for="${id}" class="form-label small text-secondary">${label}</label>
      <input type="date" class="form-control form-control-lg" id="${id}" name="${id}" />
      <div class="field-error text-danger small mt-1" data-error="${id}"></div>
    </div>
  `;
}
