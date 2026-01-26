import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../domain/payment.entity';
import { PaymentRepository } from '../domain/payment.repository.interface';

@Injectable()
export class GetPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
