import { Injectable } from '@nestjs/common';
import { Payment } from '../domain/payment.entity';
import { PaymentRepository } from '../domain/payment.repository.interface';

@Injectable()
export class InMemoryPaymentRepository implements PaymentRepository {
  private payments = new Map<string, Payment>();

  async save(payment: Payment): Promise<void> {
    this.payments.set(payment.id, payment);
  }

  async findById(id: string): Promise<Payment | null> {
    return this.payments.get(id) || null;
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    for (const payment of this.payments.values()) {
      if (payment.orderId === orderId) {
        return payment;
      }
    }
    return null;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    customerId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<{
    payments: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let filteredPayments = Array.from(this.payments.values());

    // Apply filters
    if (options?.customerId) {
      filteredPayments = filteredPayments.filter(p => p.customerId === options.customerId);
    }
    if (options?.status) {
      filteredPayments = filteredPayments.filter(p => p.status === options.status);
    }
    if (options?.dateFrom) {
      filteredPayments = filteredPayments.filter(p => p.createdAt >= options.dateFrom!);
    }
    if (options?.dateTo) {
      filteredPayments = filteredPayments.filter(p => p.createdAt <= options.dateTo!);
    }

    const total = filteredPayments.length;
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      payments: filteredPayments.slice(startIndex, endIndex),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(payment: Payment): Promise<void> {
    this.payments.set(payment.id, payment);
  }

  async delete(id: string): Promise<void> {
    this.payments.delete(id);
  }
}
