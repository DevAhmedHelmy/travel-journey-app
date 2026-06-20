// AI provider configuration (moved out of ai.service.js).
export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  MOCK: 'mock',
};

export const AI_CONFIG = {
  provider: AI_PROVIDERS.GEMINI,

  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
};
