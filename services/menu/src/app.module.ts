
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';
import { JwtStrategy } from '../../../shared/auth/jwt.strategy';
import { MenuModule } from './modules/menu/infrastructure/menu.module';

@Module({
  imports: [MenuModule],
  providers: [
    JwtStrategy,
    Reflector,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
