// v2 - real API
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8002',
  timeout: 30000,
})

export const predict = async (text, model = 'roberta-base') => {
  const { data } = await API.post('/api/predict', { text, model })
  return data
}

export const getHistory = async () => {
  const { data } = await API.get('/api/history')
  return data
}