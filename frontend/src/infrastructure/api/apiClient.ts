/**
 * API Client - Centralized HTTP client for backend communication.
 * Automatically handles the switch between local and production URLs.
 */

// Use the VITE_API_URL from environment variables, or fallback to local for dev
// We append '/api' because your backend routes usually start with that prefix
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const SOCKET_BASE = API_BASE.replace(/\/api\/?$/, '');

function normalizeUrls(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    if (data.startsWith('http://localhost:5001/')) {
      return data.replace('http://localhost:5001', SOCKET_BASE);
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(normalizeUrls);
  }
  if (typeof data === 'object') {
    const copy: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        copy[key] = normalizeUrls(data[key]);
      }
    }
    return copy;
  }
  return data;
}

function getToken(): string | null {
  const stored = localStorage.getItem('auth_session');
  if (!stored) return null;
  try {
    const session = JSON.parse(stored);
    return session.token || null;
  } catch {
    return null;
  }
}

function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      errorMessage = body.error || body.message || errorMessage;
    } catch {
      // non-JSON error body
    }
    throw new Error(errorMessage);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();
  return normalizeUrls(json) as T;
}

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'GET',
      headers: buildHeaders(),
    });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    return handleResponse<T>(res);
  },

  /**
   * Upload a file via multipart form data (e.g. CV upload).
   * Does NOT set Content-Type header — the browser will set it with the boundary.
   */
  async upload<T>(path: string, formData: FormData): Promise<T> {
    const headers = new Headers();
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Do NOT set Content-Type for FormData; browser handles it
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse<T>(res);
  },
};