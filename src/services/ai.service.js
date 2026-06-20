import { AI_PROVIDERS, AI_CONFIG } from '../config/api.config.js';
import { generateWithGemini } from '../adapters/ai/gemini.adapter.js';
import { getMockAiResponse } from '../adapters/ai/mock-ai.adapter.js';

export async function generateTravelPlan(tripData, options = {}) {
  const provider = options.provider || AI_CONFIG.provider;

  const payload = prepareTripPayload(tripData);
  const prompt = buildTravelPrompt(payload);

  if (provider === AI_PROVIDERS.MOCK) {
    return getMockAiResponse(payload);
  }

  if (provider === AI_PROVIDERS.GEMINI) {
    return generateWithGemini(prompt);
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

function prepareTripPayload(tripData) {
  return {
    destination: tripData.destination,
    dates: {
      from: tripData.startDate,
      to: tripData.endDate,
    },
    travelers: {
      adults: tripData.adults,
      children: tripData.children,
      total: tripData.adults + tripData.children,
    },
    budget: tripData.budget,
    interests: tripData.interests,
    preferences: {
      hotelRating: tripData.hotelRating,
      flightClass: tripData.flightClass,
      weatherPreference: tripData.weatherPreference,
      tripPace: tripData.tripPace,
    },
    specialNotes: tripData.specialNotes || '',
  };
}

function buildTravelPrompt(payload) {
  return `
You are a travel planning assistant.

Create a complete travel plan based on this JSON data:

${JSON.stringify(payload, null, 2)}

Return ONLY valid JSON. No markdown. No explanation.

JSON shape must be:
{
  "summary": "short trip summary",
  "weather": {
    "current": { "temp": "22°C", "condition": "Sunny", "icon": "weather emoji" },
    "forecast": [
      { "day": "TUE", "icon": "weather emoji", "high": "23°", "low": "18°" }
    ]
  },
  "dailyPlan": [
    {
      "day": 1,
      "title": "day title",
      "activities": [
        { "time": "09:00 AM", "title": "place or activity name", "description": "short description" }
      ],
      "food": ["food suggestion"],
      "notes": "short notes"
    }
  ],
  "budget": {
    "estimatedTotal": "estimated total",
    "breakdown": {
      "flights": "flights cost",
      "hotel": "hotel cost",
      "food": "food cost",
      "transport": "transport cost",
      "activities": "activities cost"
    }
  },
  "quickInfo": {
    "currency": "e.g. Euro (€)",
    "language": "e.g. French",
    "timeZone": "e.g. CET (UTC+1)",
    "voltage": "e.g. 230V"
  },
  "packingList": ["item 1", "item 2"],
  "warnings": ["warning 1"],
  "bestPlaces": ["place 1", "place 2"]
}
`;
}
