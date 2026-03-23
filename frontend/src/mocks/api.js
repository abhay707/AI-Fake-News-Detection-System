// frontend/src/mocks/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const mockPredict = async (text, model = 'roberta-base') => {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model })
  });

  if (!response.ok) {
    throw new Error('Prediction failed on the backend');
  }
  return await response.json();
};

export const mockGetHistory = async () => {
  const response = await fetch(`${API_URL}/history`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return await response.json();
};
