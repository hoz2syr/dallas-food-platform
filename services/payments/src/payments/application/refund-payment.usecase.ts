import { Injectable, Inject, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { Payment } from '../domain/payment.entity';
import { PaymentRepository } from '../domain/payment.repository.interface';
import { PaymentGateway } from '../domain/payment.gateway.interface';

export interface RefundPaymentCommand {
  paymentId: string;
  amount?: number;
  reason?: string;
}

@Injectable()
export class RefundPaymentUseCase {
  private readonly logger = new Logger(RefundPaymentUseCase.name);

  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    @Inject('PaymentGateway')
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(command: RefundPaymentCommand): Promise<Payment> {
    const payment = await this.paymentRepository.findById(command.paymentId);
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${command.paymentId} not found`);
    }

    if (!payment.canBeRefunded()) {
      throw new BadRequestException(
        `Payment cannot be refunded. Current status: ${payment.status}`
      );
    }

    const refundAmount = command.amount || payment.amount;
    const remainingAmount = payment.amount - payment.refundedAmount;
    
    if (refundAmount > remainingAmount) {
      throw new BadRequestException(
        `Refund amount (${refundAmount}) exceeds remaining amount (${remainingAmount})`
      );
    }

    try {
      if (payment.transactionId) {
        await this.paymentGateway.refundPayment(payment.transactionId, refundAmount);
      }

      payment.markAsRefunded(refundAmount);
      
      if (command.reason) {
        payment.metadata = {
          ...payment.metadata,
          refundReason: command.reason,
        };
      }

      await this.paymentRepository.save(payment);

      this.logger.log(`Payment refunded successfully: ${payment.id}, amount: ${refundAmount}`);
      return payment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      this.logger.error(`Refund failed: ${errorMessage}`, error instanceof Error ? error.stack : '');
      
      throw error;
    }
  }
}
