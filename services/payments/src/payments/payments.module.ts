import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { RefundPaymentUseCase } from './application/refund-payment.usecase';
import { GetPaymentUseCase } from './application/get-payment.usecase';
import { GetPaymentsUseCase } from './application/get-payments.usecase';
import { InMemoryPaymentRepository } from './infrastructure/payment.repository';
import { StripePaymentGateway } from './infrastructure/stripe-payment.gateway';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    ProcessPaymentUseCase,
    RefundPaymentUseCase,
    GetPaymentUseCase,
    GetPaymentsUseCase,
    {
      provide: 'PaymentRepository',
      useClass: InMemoryPaymentRepository,
    },
    {
      provide: 'PaymentGateway',
      useClass: StripePaymentGateway,
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
