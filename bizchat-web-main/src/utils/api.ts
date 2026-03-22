const API_BASE = import.meta.env.VITE_API_URL || 'https://biz-chat-backend-crg2djbrfzftaed5.canadacentral-01.azurewebsites.net'

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
}

// Attempt to refresh the access token using the stored refresh token.
// Returns true if successful, false otherwise.
async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return false
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken)
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
      return true
    }
    return false
  } catch {
    return false
  }
}

export async function api<T = unknown>(
  path: string,
  { method = 'GET', body, auth = false }: RequestOptions = {},
  _isRetry = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (auth) {
    const token = localStorage.getItem('accessToken')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data: Record<string, unknown>
  try {
    data = await res.json()
  } catch {
    throw new Error('Unable to connect to the server. Please try again later.')
  }

  if (!res.ok) {
    const raw = ((data.message || data.error || '') as string).toLowerCase()

    // If 401 on an authenticated request, try refreshing the token once
    if (res.status === 401 && auth && !_isRetry) {
      const refreshed = await tryRefreshToken()
      if (refreshed) {
        return api<T>(path, { method, body, auth }, true)
      }
      // Refresh failed — clear session and redirect to sign-in
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/signin'
      throw new Error('Session expired. Please sign in again.')
    }

    if (res.status === 401 || raw.includes('invalid') || raw.includes('incorrect') || raw.includes('password') || raw.includes('credentials')) {
      throw new Error('Incorrect email or password. Please try again.')
    } else if (raw.includes('not found') && (raw.includes('user') || raw.includes('account') || raw.includes('email'))) {
      throw new Error('No account found with that email address.')
    } else if (raw.includes('route') || raw.includes('cannot') || res.status === 404) {
      throw new Error('Service unavailable. Please try again later.')
    } else if (res.status === 429) {
      throw new Error('Too many attempts. Please wait a moment and try again.')
    } else if (res.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }

    throw new Error('Something went wrong. Please check your details and try again.')
  }

  return data as T
}

export function getUser() {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem('accessToken')
}

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}
