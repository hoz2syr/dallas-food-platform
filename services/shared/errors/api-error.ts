export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function makeApiError(code: string, message: string, details?: unknown): ApiError {
  return { code, message, details };
}

export const INTERNAL_ERROR_CODE = 'INTERNAL_ERROR';
