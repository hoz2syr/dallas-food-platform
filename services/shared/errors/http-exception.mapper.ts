import { ApiError, makeApiError, INTERNAL_ERROR_CODE } from './api-error';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MenuDomainError } from '../../menu/src/modules/menu/domain/errors/menu-domain.error';
import { OrderDomainError } from '../../order/src/modules/order/domain/errors/order-domain.error';

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

  // Domain errors mapping
  if (err instanceof MenuDomainError) {
    // reuse previous status choices: Invalid -> 400, Empty -> 400
    const name = err.name || 'MenuDomainError';
    const status = HttpStatus.BAD_REQUEST;
    return { status, body: makeApiError(name, err.message) };
  }

  if (err instanceof OrderDomainError) {
    const name = err.name || 'OrderDomainError';
    // preserve existing mapping for order errors
    if (name === 'EmptyOrderItemsError') {
      return { status: HttpStatus.BAD_REQUEST, body: makeApiError(name, err.message) };
    }
    if (name === 'InvalidOrderStateError') {
      return { status: HttpStatus.CONFLICT, body: makeApiError(name, err.message) };
    }
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, body: makeApiError(name, err.message) };
  }

  // Fallback unknown error
  const fallback = makeApiError(INTERNAL_ERROR_CODE, (err as any)?.message || 'An internal error occurred', err);
  return { status: HttpStatus.INTERNAL_SERVER_ERROR, body: fallback };
}
