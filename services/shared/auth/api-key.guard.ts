import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'];

    if (!process.env.API_KEY || !apiKey || apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException({ error: 'UNAUTHORIZED', message: 'Invalid API key' });
    }

    return true;
  }
}
