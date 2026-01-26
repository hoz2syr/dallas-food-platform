import { Injectable } from '@nestjs/common';
import { ProcessPaymentUseCase, ProcessPaymentCommand } from './application/process-payment.usecase';
import { RefundPaymentUseCase, RefundPaymentCommand } from './application/refund-payment.usecase';
import { GetPaymentUseCase } from './application/get-payment.usecase';
import { GetPaymentsUseCase } from './application/get-payments.usecase';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { Currency, PaymentMethod } from './domain/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly getPaymentsUseCase: GetPaymentsUseCase,
  ) {}

  async processPayment(processPaymentDto: ProcessPaymentDto): Promise<any> {
    const command: ProcessPaymentCommand = {
      orderId: processPaymentDto.orderId,
      customerId: processPaymentDto.customerId,
      amount: processPaymentDto.amount,
      currency: processPaymentDto.currency as Currency,
      method: processPaymentDto.method as PaymentMethod,
      paymentDetails: {}, // Add payment details from DTO if needed
    };

    const result = await this.processPaymentUseCase.execute(command);

    return {
      success: result.success,
      payment: result.payment.toPersistence(),
      message: result.message,
    };
  }

  async refundPayment(refundPaymentDto: RefundPaymentDto): Promise<any> {
    const command: RefundPaymentCommand = {
      paymentId: refundPaymentDto.paymentId,
      amount: refundPaymentDto.amount,
      reason: refundPaymentDto.reason,
    };

    const result = await this.refundPaymentUseCase.execute(command);

    return {
      success: result.success,
      refund: result.refund,
      message: result.message,
    };
  }

  async getPayment(id: string): Promise<any> {
    const payment = await this.getPaymentUseCase.execute(id);
    return payment.toPersistence();
  }

  async getPayments({ page, limit }: { page: number; limit: number }): Promise<any> {
    const result = await this.getPaymentsUseCase.execute({ page, limit });
    return {
      ...result,
      payments: result.payments.map(p => p.toPersistence()),
    };
  }
}
