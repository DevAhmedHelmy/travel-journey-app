import { AI_CONFIG } from '../../config/api.config.js';

// Calls Gemini with a prompt and returns the parsed travel-plan JSON.
export async function generateWithGemini(prompt) {
  const rawResponse = await callGemini(prompt);
  return normalizeGeminiResponse(rawResponse);
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
