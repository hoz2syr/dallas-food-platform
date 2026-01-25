
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HealthController } from './health.controller';
import { OrderModule } from './modules/order/infrastructure/order.module';
import { ApiKeyGuard } from '../../shared/auth/api-key.guard';

@Module({
	imports: [OrderModule],
	controllers: [HealthController],
	providers: [
		{ provide: APP_GUARD, useClass: ApiKeyGuard }
	]
})
export class AppModule {}
