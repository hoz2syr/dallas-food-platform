import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { OrderModule } from './modules/order/infrastructure/order.module';

@Module({
	imports: [OrderModule],
	controllers: [HealthController]
})
export class AppModule {}
