// Date formatting helpers shared across views.

export function formatDate(value, withYear = false) {
  if (!value) return '';
  const opts = { month: 'short', day: 'numeric' };
  if (withYear) opts.year = 'numeric';
  return new Date(value).toLocaleDateString('en-US', opts);
}

export function addDays(start, offset) {
  const d = new Date(start);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// "2025-05-20", "2025-05-26" -> "May 20 - May 26"
export function formatDateRange(startDate, endDate) {
  const options = { month: 'short', day: 'numeric' };
  const start = new Date(startDate).toLocaleDateString('en-US', options);
  const end = new Date(endDate).toLocaleDateString('en-US', options);
  return `${start} - ${end}`;
}
