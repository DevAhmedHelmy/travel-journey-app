export function validateTrip(data) {
  const errors = {};

  if (!data.destination || data.destination.trim() === '') {
    errors.destination = 'Destination is required.';
  }

  const start = parseDate(data.startDate);
  const end = parseDate(data.endDate);

  if (!data.startDate) {
    errors.startDate = 'Start date is required.';
  } else if (!start) {
    errors.startDate = 'Start date is not a valid date.';
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required.';
  } else if (!end) {
    errors.endDate = 'End date is not a valid date.';
  }

  if (start && end && end <= start) {
    errors.endDate = 'End date must be after the start date.';
  }

  if (!Number.isInteger(data.adults) || data.adults < 1) {
    errors.adults = 'At least one adult is required.';
  }

  if (!Number.isInteger(data.children) || data.children < 0) {
    errors.children = 'Children must be zero or more.';
  }

  if (!data.budget) {
    errors.budget = 'Please choose a budget.';
  } else if (data.budget.startsWith('custom:')) {
    const amount = Number(data.budget.slice('custom:'.length));
    if (!amount || amount <= 0) {
      errors.budget = 'Enter a valid custom budget amount.';
    }
  }

  if (!Array.isArray(data.interests) || data.interests.length === 0) {
    errors.interests = 'Select at least one interest.';
  }

  if (!data.hotelRating) errors.hotelRating = 'Hotel rating is required.';
  if (!data.flightClass) errors.flightClass = 'Flight class is required.';
  if (!data.weatherPreference) errors.weatherPreference = 'Weather preference is required.';
  if (!data.tripPace) errors.tripPace = 'Trip pace is required.';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}