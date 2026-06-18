// Persists generated trips (trip input + AI plan) in localStorage so the user
// can revisit them later from the "Saved Trips" page.

const STORAGE_KEY = 'journeyai:saved-trips';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `trip_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// Two saved trips are "the same" when destination + both dates match.
function sameTrip(a, b) {
  return (
    a.destination === b.destination &&
    a.startDate === b.startDate &&
    a.endDate === b.endDate
  );
}

export function getSavedTrips() {
  // Newest first.
  return readAll().sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
}

export function getSavedTrip(id) {
  return readAll().find((t) => t.id === id) || null;
}

// Returns { id, alreadySaved }. If the same trip is already stored we keep the
// original record instead of creating a duplicate.
export function saveTrip(trip, plan) {
  const trips = readAll();
  const existing = trips.find((t) => sameTrip(t.trip, trip));

  if (existing) {
    return { id: existing.id, alreadySaved: true };
  }

  const record = {
    id: makeId(),
    savedAt: new Date().toISOString(),
    trip,
    plan,
  };

  trips.push(record);
  writeAll(trips);

  return { id: record.id, alreadySaved: false };
}

export function removeSavedTrip(id) {
  writeAll(readAll().filter((t) => t.id !== id));
}

export function isTripSaved(trip) {
  return readAll().some((t) => sameTrip(t.trip, trip));
}
