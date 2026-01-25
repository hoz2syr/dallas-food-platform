export function isAuthenticated(): boolean {
  // placeholder: no real auth implemented yet
  return false;
}

export function getApiKey(): string | null {
  return process.env.NEXT_PUBLIC_API_KEY || null;
}
export function isAuthenticated(): boolean {
  // Placeholder: UI auth not implemented yet
  return false;
}

export function getApiKey(): string | null {
  // Frontend-side API key (optional) - typically provided via NEXT_PUBLIC_API_KEY
  return process.env.NEXT_PUBLIC_API_KEY || null;
}
