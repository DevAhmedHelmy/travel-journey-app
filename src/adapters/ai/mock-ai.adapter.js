// Static sample travel plan used when provider === 'mock'.
export function getMockAiResponse(payload) {
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
