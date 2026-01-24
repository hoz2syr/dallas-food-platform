import { Module } from '@nestjs/common';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { OrderController } from './order.controller';
import { APP_FILTER } from '@nestjs/core';
import { OrderErrorFilter } from './order-error.filter';

@Module({
  providers: [
    { provide: 'OrderRepository', useClass: InMemoryOrderRepository },
    {
      provide: PlaceOrderUseCase,
      useFactory: (repo: any) => new PlaceOrderUseCase(repo),
      inject: ['OrderRepository']
    }
    ,
    { provide: APP_FILTER, useClass: OrderErrorFilter }
  ],
  controllers: [OrderController],
  exports: [PlaceOrderUseCase]
})
export class OrderModule {}
