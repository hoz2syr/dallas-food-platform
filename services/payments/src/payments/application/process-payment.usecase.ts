import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Payment, PaymentMethod, Currency } from '../domain/payment.entity';
import { PaymentRepository } from '../domain/payment.repository.interface';
import { PaymentGateway } from '../domain/payment.gateway.interface';

export interface ProcessPaymentCommand {
  orderId: string;
  customerId: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  paymentDetails?: {
    cardToken?: string;
    paypalToken?: string;
    applePayToken?: string;
    googlePayToken?: string;
  };
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<{
    success: boolean;
    payment: Payment;
    message: string;
  }> {
    // Validate payment method
    if (!this.paymentGateway.validatePaymentMethod(command.method)) {
      throw new BadRequestException(`Payment method ${command.method} is not supported`);
    }

    // Check if payment already exists for this order
    const existingPayment = await this.paymentRepository.findByOrderId(command.orderId);
    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this order');
    }

    // Create payment entity
    const payment = Payment.create(
      command.orderId,
      command.customerId,
      command.amount,
      command.currency,
      command.method,
    );

    try {
      // Process payment through gateway
      const gatewayResult = await this.paymentGateway.processPayment(
        payment,
        command.paymentDetails || {},
      );

      if (gatewayResult.success) {
        payment.markAsCompleted(gatewayResult.transactionId, gatewayResult.gatewayResponse);
      } else {
        payment.markAsFailed(gatewayResult.gatewayResponse);
        await this.paymentRepository.save(payment);
        throw new BadRequestException(`Payment failed: ${gatewayResult.error}`);
      }

      // Save payment
      await this.paymentRepository.save(payment);

      return {
        success: true,
        payment,
        message: 'Payment processed successfully',
      };
    } catch (error) {
      payment.markAsFailed(error.message);
      await this.paymentRepository.save(payment);
      throw error;
    }
  }
}
