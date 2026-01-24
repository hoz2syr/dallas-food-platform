import { Module } from '@nestjs/common';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';

@Module({
  providers: [PlaceOrderUseCase],
  exports: [PlaceOrderUseCase]
})
export class OrderModule {}
