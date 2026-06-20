// Interests as toggle "pills" (checkbox group) for the search form.
const INTERESTS = [
  { value: 'food', label: 'Food', selected: true },
  { value: 'shopping', label: 'Shopping' },
  { value: 'museums', label: 'Museums' },
  { value: 'adventure', label: 'Adventure', selected: true },
  { value: 'nature', label: 'Nature', selected: true },
  { value: 'beach', label: 'Beach' },
  { value: 'history', label: 'History' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'family-friendly', label: 'Family-friendly' },
];

export function interestsCheckboxGroup() {
  return INTERESTS.map(
    (item) => `
      <input
        type="checkbox"
        class="btn-check interest-check"
        id="interest-${item.value}"
        value="${item.value}"
        autocomplete="off"
        ${item.selected ? 'checked' : ''}
      />
      <label class="btn interest-pill rounded-pill px-4" for="interest-${item.value}">
        ${item.label}
      </label>
    `
  ).join('');
}
