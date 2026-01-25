import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { makeApiError } from '../errors/api-error';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'];

    if (!process.env.API_KEY || !apiKey || apiKey !== process.env.API_KEY) {
      const body = makeApiError('UNAUTHORIZED', 'Invalid API key');
      throw new HttpException(body, HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
