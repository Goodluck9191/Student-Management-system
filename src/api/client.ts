import axios from 'axios'

/**
 * Shared HTTP client for the future Node.js/Express REST API.
 *
 * During the frontend-only phase (Week 2) this client is not used — the
 * application talks to the in-memory mock repository in
 * `services/studentService.ts`. When the backend is ready, the mock
 * repository is swapped for an HTTP implementation that uses this client
 * without changing any UI code.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
