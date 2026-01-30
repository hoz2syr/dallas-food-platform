import { Injectable, BadRequestException } from '@nestjs/common';
import { Payment, PaymentMethod, Currency } from '../domain/payment.entity';
import { PaymentRepository } from '../domain/payment.repository.interface';
import { PaymentGateway } from '../domain/payment.gateway.interface';

export interface ProcessPaymentCommand {
  orderId: string;
  userId: string;
  customerId?: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<Payment> {
    // Check if a payment already exists for this order
    const existingPayment = await this.paymentRepository.findByOrderId(command.orderId);
    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this order');
    }

    // Create payment entity
    const payment = Payment.create({
      orderId: command.orderId,
      userId: command.userId,
      customerId: command.customerId,
      amount: command.amount,
      currency: command.currency,
      status: 'pending',
      paymentMethod: command.paymentMethod,
      metadata: command.metadata,
    });

    try {
      // Save initial payment
      await this.paymentRepository.save(payment);

      // Mark as processing
      payment.markAsProcessing();
      await this.paymentRepository.save(payment);

      // Process payment through gateway
      const result = await this.paymentGateway.processPayment({
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        metadata: payment.metadata,
      });

      // Mark as succeeded
      payment.markAsSucceeded(result.transactionId);
      await this.paymentRepository.save(payment);

      return payment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      payment.markAsFailed(errorMessage);
      await this.paymentRepository.save(payment);
      throw error;
    }
  }
}
