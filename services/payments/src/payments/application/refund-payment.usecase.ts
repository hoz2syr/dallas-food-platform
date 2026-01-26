import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Payment } from '../domain/payment.entity';
import { PaymentRepository } from '../domain/payment.repository.interface';
import { PaymentGateway } from '../domain/payment.gateway.interface';

export interface RefundPaymentCommand {
  paymentId: string;
  amount?: number;
  reason: string;
}

@Injectable()
export class RefundPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(command: RefundPaymentCommand): Promise<{
    success: boolean;
    refund: any;
    message: string;
  }> {
    // Find the payment
    const payment = await this.paymentRepository.findById(command.paymentId);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Validate refund conditions
    if (!payment.canBeRefunded()) {
      throw new BadRequestException('Payment cannot be refunded');
    }

    const refundAmount = command.amount || payment.amount;

    if (refundAmount > payment.amount) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    try {
      // Process refund through gateway
      const gatewayResult = await this.paymentGateway.refundPayment(
        payment,
        refundAmount,
        command.reason,
      );

      if (gatewayResult.success) {
        // Update payment status
        if (refundAmount === payment.amount) {
          payment.status = 'refunded';
        } else {
          payment.status = 'partially_refunded';
        }
        payment.updatedAt = new Date();

        await this.paymentRepository.update(payment);

        const refund = {
          id: gatewayResult.refundId || `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentId: command.paymentId,
          amount: refundAmount,
          reason: command.reason,
          status: 'completed',
          createdAt: new Date(),
          gatewayResponse: gatewayResult.gatewayResponse,
        };

        return {
          success: true,
          refund,
          message: 'Payment refunded successfully',
        };
      } else {
        throw new BadRequestException(`Refund failed: ${gatewayResult.error}`);
      }
    } catch (error) {
      throw error;
    }
  }
}
