let state = {
  trip: null,
  plan: null,
  loading: false,
  error: null,
};

export function setTrip(trip) {
  state.trip = trip;
}

export function getTrip() {
  return state.trip;
}

export function setPlan(plan) {
  state.plan = plan;
}

export function getPlan() {
  return state.plan;
}

export function setLoading(value) {
  state.loading = value;
}

export function getLoading() {
  return state.loading;
}

export function setError(error) {
  state.error = error;
}

export function getError() {
  return state.error;
}