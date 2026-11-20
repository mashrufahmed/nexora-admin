export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta: Record<string, unknown> | null;
};

export class ApiError extends Error {
  readonly status: number;
  readonly errors: string[];

  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'
).replace(/\/$/, '');
let csrfToken: string | null = null;
const csrfExemptPaths = new Set([
  '/admin/auth/login',
  '/admin/auth/forgot-password',
  '/admin/auth/reset-password',
  '/admin/email/verify',
  '/admin/email/resend',
]);

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_BASE}/admin/auth/csrf`, {
    credentials: 'include',
  });
  const body = (await response.json()) as ApiResponse<{ token: string }>;
  if (!response.ok || !body.data?.token) throw new ApiError('Unable to initialize secure session', response.status);
  csrfToken = body.data.token;
  return csrfToken;
}

export function clearCsrfToken(): void {
  csrfToken = null;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData;
  let response: Response;
  try {
    const method = (init.method ?? 'GET').toUpperCase();
    const csrfHeaders = !['GET', 'HEAD', 'OPTIONS'].includes(method) && !csrfExemptPaths.has(path)
      ? { 'X-CSRF-Token': await getCsrfToken() }
      : {};
    const headers = new Headers(init.headers);
    if (!isFormData) headers.set('Content-Type', 'application/json');
    if (csrfHeaders['X-CSRF-Token']) headers.set('X-CSRF-Token', csrfHeaders['X-CSRF-Token']);
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers,
    });
  } catch {
    throw new ApiError(
      'Unable to reach Nexora API. Check the backend connection.',
      0,
    );
  }
  if (response.status === 401) {
    csrfToken = null;
    if (typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent('nexora:session-expired'));
  }

  const body = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string; errors?: string[] }
    | null;
  if (!response.ok) {
    const message =
      body && 'message' in body && body.message
        ? body.message
        : response.status === 401
          ? 'Your session has expired. Please sign in again.'
          : 'Request failed';
    throw new ApiError(
      message,
      response.status,
      body && 'errors' in body && Array.isArray(body.errors) ? body.errors : [],
    );
  }
  if (body && 'success' in body && body.success === false)
    throw new ApiError(body.message, response.status);
  return body && 'data' in body ? (body.data as T) : (body as T);
}

export function apiJson<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  data?: unknown,
) {
  return apiFetch<T>(path, {
    method,
    body: data === undefined ? undefined : JSON.stringify(data),
  });
}
