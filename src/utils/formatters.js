// Value formatting helpers (labels, ratings, text).

export function titleCase(value) {
  if (!value) return '';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export function budgetLabel(budget) {
  if (!budget) return 'Flexible';
  if (String(budget).startsWith('custom:')) return `$${String(budget).split(':')[1]}`;
  return titleCase(budget);
}

export function stars(rating) {
  const n = Number(rating);
  if (!n) return rating ? titleCase(rating) : '';
  return '⭐'.repeat(n);
}

export function snippet(text, max = 120) {
  if (!text) return 'No summary available.';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
