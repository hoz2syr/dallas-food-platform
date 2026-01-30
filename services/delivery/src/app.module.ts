
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../shared/auth/jwt-auth.guard';
import { JwtStrategy } from '../../shared/auth/jwt.strategy';

@Module({
  imports: [],
  controllers: [],
  providers: [
    JwtStrategy,
    Reflector,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ]
})
export class AppModule {}
