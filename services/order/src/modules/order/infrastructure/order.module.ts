import { Module } from '@nestjs/common';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';

@Module({
  providers: [
    { provide: 'OrderRepository', useClass: InMemoryOrderRepository },
    {
      provide: PlaceOrderUseCase,
      useFactory: (repo: any) => new PlaceOrderUseCase(repo),
      inject: ['OrderRepository']
    }
  ],
  exports: [PlaceOrderUseCase]
})
export class OrderModule {}
