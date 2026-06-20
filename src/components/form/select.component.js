// A labelled <select> column used by the search form's preferences row.
// Produces the same markup that was previously inlined per field.
export function selectField({ id, label, options }) {
  return `
    <div class="col-6 col-md-3">
      <label for="${id}" class="form-label small text-secondary">${label}</label>
      <select id="${id}" name="${id}" class="form-select">
        ${options
          .map((o) => `<option value="${o.value}"${o.selected ? ' selected' : ''}>${o.label}</option>`)
          .join('')}
      </select>
      <div class="field-error text-danger small mt-1" data-error="${id}"></div>
    </div>
  `;
}
