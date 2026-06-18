const AI_PROVIDERS = {
  GEMINI: 'gemini',
  MOCK: 'mock',
};

const AI_CONFIG = {
  provider: AI_PROVIDERS.GEMINI,

  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
};

export async function generateTravelPlan(tripData, options = {}) {
  const provider = options.provider || AI_CONFIG.provider;

  const payload = prepareTripPayload(tripData);
  const prompt = buildTravelPrompt(payload);

  if (provider === AI_PROVIDERS.MOCK) {
    return getMockAiResponse(payload);
  }

  if (provider === AI_PROVIDERS.GEMINI) {
    const rawResponse = await callGemini(prompt);
    return normalizeGeminiResponse(rawResponse);
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

async function callGemini(prompt) {
  const { apiKey, model, baseUrl } = AI_CONFIG.gemini;

  if (!apiKey) {
    throw new Error('Missing Gemini API key. Add VITE_GEMINI_API_KEY in .env');
  }

  const url = `${baseUrl}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    }),
  });
 
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || 'Gemini request failed');
  }

  return response.json();
}

function normalizeGeminiResponse(rawResponse) {
  const text =
    rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Invalid Gemini response');
  }

  try {
    return JSON.parse(cleanJsonText(text));
  } catch {
    throw new Error('Failed to parse AI JSON response');
  }
}

function cleanJsonText(text) {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}

function getMockAiResponse(payload) {
  return Promise.resolve({
    summary: `A ${payload.preferences.tripPace} trip to ${payload.destination}.`,
    weather: {
      current: { temp: '22°C', condition: 'Sunny', icon: '☀️' },
      forecast: [
        { day: 'TUE', icon: '⛅', high: '22°', low: '18°' },
        { day: 'WED', icon: '☀️', high: '23°', low: '17°' },
        { day: 'THU', icon: '🌤️', high: '24°', low: '18°' },
        { day: 'FRI', icon: '☀️', high: '25°', low: '19°' },
        { day: 'SAT', icon: '☀️', high: '22°', low: '16°' },
        { day: 'SUN', icon: '⛅', high: '20°', low: '15°' },
      ],
    },
    dailyPlan: [
      {
        day: 1,
        title: 'Arrival and city discovery',
        activities: [
          { time: '09:00 AM', title: 'Check in at hotel', description: 'Drop your bags and freshen up.' },
          { time: '12:30 PM', title: 'Lunch downtown', description: 'Grab a bite near the city center.' },
          { time: '03:00 PM', title: 'Explore the city center', description: 'Wander the main square and landmarks.' },
          { time: '07:00 PM', title: 'Evening stroll', description: 'Relaxed walk to wind down the first day.' },
        ],
        food: ['Try a local restaurant'],
        notes: 'Keep the first day light.',
      },
    ],
    budget: {
      estimatedTotal: payload.budget,
      breakdown: {
        flights: 'Round-trip flights estimate',
        hotel: 'Based on selected hotel rating',
        food: 'Medium daily food cost',
        transport: 'Local transport estimate',
        activities: 'Depends on selected interests',
      },
    },
    quickInfo: {
      currency: 'Local currency',
      language: 'Local language',
      timeZone: 'Local time zone',
      voltage: '230V',
    },
    packingList: ['Passport', 'Comfortable shoes', 'Phone charger'],
    warnings: ['Check weather before travel'],
    bestPlaces: payload.interests,
  });
}