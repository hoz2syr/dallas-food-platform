import { Injectable, Inject } from '@nestjs/common';
import { Payment } from '../domain/payment.entity';
import { PaymentRepository } from '../domain/payment.repository.interface';

export interface GetPaymentsFilters {
  page?: number;
  limit?: number;
  customerId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

@Injectable()
export class GetPaymentsUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(filters?: GetPaymentsFilters): Promise<{
    payments: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.paymentRepository.findAll(filters as any);
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    return this.paymentRepository.findByOrderId(orderId);
  }
}
