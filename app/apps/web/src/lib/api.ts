// ─────────────────────────────────────────────────────────────
// API Client — typed wrapper around fetch
// ─────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new ApiError(
      res.status,
      json.error?.code ?? 'UNKNOWN',
      json.error?.message ?? 'Request failed'
    )
  }

  return json.data as T
}

// ── AUTH ──────────────────────────────────────────────────────

export const auth = {
  register: (email: string, password: string, name?: string) =>
    request<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ email, password, name }) }
    ),

  login: (email: string, password: string) =>
    request<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  refresh: (refreshToken: string) =>
    request<{ tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/refresh',
      { method: 'POST', body: JSON.stringify({ refreshToken }) }
    ),

  logout: (refreshToken: string) =>
    request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  me: (token: string) => request<{ user: any }>('/auth/me', { token }),
}

// ── SESSIONS ──────────────────────────────────────────────────

export const sessions = {
  create: (
    token: string,
    data: { type?: string; focusQuestion?: string }
  ) =>
    request<{ session: any }>('/sessions', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  list: (token: string) =>
    request<{ sessions: any[] }>('/sessions', { token }),

  get: (token: string, id: string) =>
    request<{ session: any }>(`/sessions/${id}`, { token }),

  // Returns a ReadableStream — handled separately in the hook
  messageUrl: (id: string) => `${API_BASE}/api/sessions/${id}/message`,
}

// ── PROJECTS ──────────────────────────────────────────────────

export const projects = {
  create: (token: string, data: object) =>
    request<{ project: any }>('/projects', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  list: (token: string) =>
    request<{ projects: any[] }>('/projects', { token }),

  get: (token: string, id: string) =>
    request<{ project: any }>(`/projects/${id}`, { token }),

  updateTask: (token: string, projectId: string, taskId: string, data: object) =>
    request<{ task: any }>(`/projects/${projectId}/tasks/${taskId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    }),

  createTask: (token: string, projectId: string, data: object) =>
    request<{ task: any }>(`/projects/${projectId}/tasks`, {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  stats: (token: string, projectId: string) =>
    request<{ stats: any }>(`/projects/${projectId}/stats`, { token }),
}

// ── CHECKINS ──────────────────────────────────────────────────

export const checkins = {
  today: (token: string, projectId: string) =>
    request<{ checkin: any; project: any; nextTask: any }>(
      `/checkins/today/${projectId}`,
      { token }
    ),

  start: (token: string, projectId: string) =>
    request<{ checkin: any; greeting: string }>('/checkins/start', {
      method: 'POST',
      token,
      body: JSON.stringify({ projectId }),
    }),

  complete: (
    token: string,
    checkinId: string,
    data: {
      taskResult: string
      taskResultNote?: string
      moodScore?: number
      userMessage?: string
    }
  ) =>
    request<{ checkin: any; aiResponse: string }>(
      `/checkins/${checkinId}/complete`,
      { method: 'POST', token, body: JSON.stringify(data) }
    ),
}

// ── BILLING ───────────────────────────────────────────────────

export const billing = {
  checkout: (token: string, priceId: string) =>
    request<{ url: string }>('/billing/checkout', {
      method: 'POST',
      token,
      body: JSON.stringify({ priceId }),
    }),

  portal: (token: string) =>
    request<{ url: string }>('/billing/portal', { method: 'POST', token }),
}
