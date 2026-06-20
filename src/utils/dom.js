// HTML escaping + tiny shared markup helpers.

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

export function emptyMarkup(text) {
  return `<p class="text-secondary fst-italic m-0">${escapeHtml(text)}</p>`;
}
