import { Payment } from './payment.entity';

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  findAll(options?: {
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
  }>;
  update(payment: Payment): Promise<void>;
  delete(id: string): Promise<void>;
}
