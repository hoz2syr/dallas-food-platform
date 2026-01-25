import { ApiError, makeApiError, INTERNAL_ERROR_CODE } from './api-error';
import { HttpException, HttpStatus } from '@nestjs/common';

export function mapToApiError(err: unknown): { status: number; body: ApiError } {
  // Nest HttpException passthrough
  if (err instanceof HttpException) {
    const status = err.getStatus();
    const response = err.getResponse();
    if (typeof response === 'string') {
      return { status, body: makeApiError(String(status), response) };
    }
    // If it's already an object, try to normalize
    const message = (response as any).message || JSON.stringify(response);
    const code = (response as any).code || String(status);
    return { status, body: makeApiError(code, message, response) };
  }

  // Domain errors mapping by name to avoid cross-service class imports
  if (err instanceof Error) {
    const name = err.name || 'DomainError';

    // Menu errors
    if (name === 'EmptyMenuItemsError' || name === 'InvalidMenuNameError' || name === 'MenuDomainError') {
      return { status: HttpStatus.BAD_REQUEST, body: makeApiError(name, err.message) };
    }

    // Order errors
    if (name === 'EmptyOrderItemsError') {
      return { status: HttpStatus.BAD_REQUEST, body: makeApiError(name, err.message) };
    }
    if (name === 'InvalidOrderStateError') {
      return { status: HttpStatus.CONFLICT, body: makeApiError(name, err.message) };
    }
    if (name === 'OrderDomainError') {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, body: makeApiError(name, err.message) };
    }
  }

  // Fallback unknown error
  const fallback = makeApiError(INTERNAL_ERROR_CODE, (err as any)?.message || 'An internal error occurred', err);
  return { status: HttpStatus.INTERNAL_SERVER_ERROR, body: fallback };
}
