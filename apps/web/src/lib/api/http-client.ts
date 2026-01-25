export type HttpOptions = RequestInit;

export async function httpFetch(path: string, options: HttpOptions = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
  });

  return res;
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function httpClient(path: string, method: HttpMethod = 'GET', body?: any, opts: RequestInit = {}) {
  const base = getBaseUrl();
  const url = `${base}${path}`;

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
    headers,
  });

  const text = await res.text();
  const contentType = res.headers.get('content-type') || '';
  const parsed = contentType.includes('application/json') && text ? JSON.parse(text) : text;

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}: ${text}`);
    (err as any).status = res.status;
    (err as any).body = parsed;
    throw err;
  }

  return parsed;
}
