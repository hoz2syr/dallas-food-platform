import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { makeApiError } from '../errors/api-error';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // use Express getter to reliably obtain header values regardless of casing
    const apiKey = (req.get && (req.get('x-api-key') || req.get('X-API-KEY'))) || req.headers['x-api-key'] || req.headers['X-API-KEY'];

    // Debug logging to help trace API key validation issues (local/dev only)
    try {
      const headersPreview = JSON.stringify(req.headers || {});
      console.debug('[ApiKeyGuard] env.API_KEY=', process.env.API_KEY ? '***set***' : 'unset', ' header_preview=', headersPreview);
    } catch (e) {
      // swallow logging errors
    }

    if (!process.env.API_KEY || !apiKey || apiKey !== process.env.API_KEY) {
      // Log reason for rejection before throwing to aid debugging
      console.warn('[ApiKeyGuard] Rejecting request — envKey=', !!process.env.API_KEY, 'providedKey=', apiKey);
      const body = makeApiError('UNAUTHORIZED', 'Invalid API key');
      throw new HttpException(body, HttpStatus.UNAUTHORIZED);
    }

    // Log successful validation (debug)
    console.debug('[ApiKeyGuard] Accepted request for API key');
    return true;
  }
}
