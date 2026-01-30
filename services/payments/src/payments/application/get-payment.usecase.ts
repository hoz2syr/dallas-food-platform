import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../domain/payment.repository.interface';
import { Payment } from '../domain/payment.entity';

@Injectable()
export class GetPaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    return payment;
  }
}
