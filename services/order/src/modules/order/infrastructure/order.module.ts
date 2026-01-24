import { Module } from '@nestjs/common';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { OrderController } from './order.controller';

@Module({
  providers: [
    { provide: 'OrderRepository', useClass: InMemoryOrderRepository },
    {
      provide: PlaceOrderUseCase,
      useFactory: (repo: any) => new PlaceOrderUseCase(repo),
      inject: ['OrderRepository']
    }
  ],
  controllers: [OrderController],
  exports: [PlaceOrderUseCase]
})
export class OrderModule {}
