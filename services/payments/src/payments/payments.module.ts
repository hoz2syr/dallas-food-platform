import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { RefundPaymentUseCase } from './application/refund-payment.usecase';
import { GetPaymentUseCase } from './application/get-payment.usecase';
import { GetPaymentsUseCase } from './application/get-payments.usecase';
import { InMemoryPaymentRepository } from './infrastructure/payment.repository';
import { StripePaymentGateway } from './infrastructure/stripe-payment.gateway';
import { PaypalPaymentGateway } from './infrastructure/paypal-payment.gateway';

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
    StripePaymentGateway,
    PaypalPaymentGateway,
    {
      provide: 'PaymentGateway',
      useFactory: (stripe: StripePaymentGateway, paypal: PaypalPaymentGateway) => {
        // دالة اختيار البوابة حسب نوع الدفع
        return {
          async processPayment(params) {
            if (params.paymentMethod === 'card') {
              return stripe.processPayment(params);
            } else if (params.paymentMethod === 'wallet') {
              return paypal.processPayment(params);
            } else {
              throw new Error('Unsupported payment method');
            }
          },
          async refundPayment(transactionId, amount) {
            if (transactionId.startsWith('stripe_')) {
              return stripe.refundPayment(transactionId, amount);
            } else if (transactionId.startsWith('paypal_')) {
              return paypal.refundPayment(transactionId, amount);
            } else {
              throw new Error('Unknown gateway for refund');
            }
          }
        };
      },
      inject: [StripePaymentGateway, PaypalPaymentGateway],
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
