import { Injectable } from '@nestjs/common';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { RefundPaymentUseCase } from './application/refund-payment.usecase';
import { GetPaymentUseCase } from './application/get-payment.usecase';
import { GetPaymentsUseCase } from './application/get-payments.usecase';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly getPaymentsUseCase: GetPaymentsUseCase,
  ) {}

  async processPayment(dto: ProcessPaymentDto) {
    const payment = await this.processPaymentUseCase.execute({
      orderId: dto.orderId,
      userId: dto.userId,
      customerId: dto.customerId,
      amount: dto.amount,
      currency: dto.currency as any, // Cast to Currency type
      paymentMethod: dto.paymentMethod as any, // Cast to PaymentMethod type
      metadata: dto.metadata,
    });

    return payment.toPersistence();
  }

  async refundPayment(dto: RefundPaymentDto) {
    const payment = await this.refundPaymentUseCase.execute({
      paymentId: dto.paymentId,
      amount: dto.amount,
      reason: dto.reason,
    });

    return payment.toPersistence();
  }

  async getPayment(id: string) {
    const payment = await this.getPaymentUseCase.execute(id);
    return payment.toPersistence();
  }

  async getPayments(query: { page?: number; limit?: number }) {
    const result = await this.getPaymentsUseCase.execute(query);
    
    return {
      payments: result.payments.map(p => p.toPersistence()),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
