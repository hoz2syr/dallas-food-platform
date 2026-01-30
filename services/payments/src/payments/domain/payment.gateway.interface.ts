import { PaymentMethod } from './payment.entity';

export interface ProcessPaymentParams {
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface ProcessPaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
}

export interface PaymentGateway {
  processPayment(params: ProcessPaymentParams): Promise<ProcessPaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<ProcessPaymentResult>;
}
