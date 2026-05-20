// v2 - real API
import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
})

export const predict = async (text, model = 'roberta-base') => {
  const { data } = await API.post('/api/predict', { text, model })
  return data
}

export const getHistory = async () => {
  const { data } = await API.get('/api/history')
  return data
}