
import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../shared/auth/jwt-auth.guard';
import { JwtStrategy } from '../../shared/auth/jwt.strategy';
import { HealthController } from './health.controller';
import { OrderModule } from './modules/order/infrastructure/order.module';

@Module({
	imports: [OrderModule],
	controllers: [HealthController],
	providers: [
		JwtStrategy,
		Reflector,
		{ provide: APP_GUARD, useClass: JwtAuthGuard },
	]
})
export class AppModule {}
