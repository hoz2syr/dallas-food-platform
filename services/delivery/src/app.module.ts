import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiKeyGuard } from '../../shared/auth/api-key.guard';
import { LoggingInterceptor } from '../../shared/logging/logging.interceptor';

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }
  ]
})
export class AppModule {}
