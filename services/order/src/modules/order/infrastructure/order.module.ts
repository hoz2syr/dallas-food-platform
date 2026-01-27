import { Module } from '@nestjs/common';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
// Postgres repository is imported dynamically to avoid initializing DB client when not needed
let PostgresOrderRepository: any;
if (process.env.USE_IN_MEMORY !== 'true') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PostgresOrderRepository = require('./repositories/postgres-order.repository').PostgresOrderRepository;
}
import { OrderController } from './order.controller';
import { OrderStatusGateway } from './order-status.gateway';
import { APP_FILTER } from '@nestjs/core';
import { OrderErrorFilter } from './order-error.filter';

@Module({
  providers: [
    // Select repository implementation via env var to allow running without Postgres in local/dev
    { provide: 'OrderRepository', useClass: process.env.USE_IN_MEMORY === 'true' ? InMemoryOrderRepository : PostgresOrderRepository },
    {
      provide: PlaceOrderUseCase,
      useFactory: (repo: any) => new PlaceOrderUseCase(repo),
      inject: ['OrderRepository']
    },
    { provide: APP_FILTER, useClass: OrderErrorFilter },
    OrderStatusGateway
  ],
  controllers: [OrderController],
  exports: [PlaceOrderUseCase, OrderStatusGateway]
})
export class OrderModule {}
