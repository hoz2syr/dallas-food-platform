import { Payment, PaymentMethod, Currency } from './payment.entity';

export interface PaymentGateway {
  processPayment(
    payment: Payment,
    paymentDetails: {
      cardToken?: string;
      paypalToken?: string;
      applePayToken?: string;
      googlePayToken?: string;
    }
  ): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
    gatewayResponse?: any;
  }>;

  refundPayment(
    payment: Payment,
    amount: number,
    reason?: string
  ): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
    gatewayResponse?: any;
  }>;

  validatePaymentMethod(method: PaymentMethod): boolean;
  getSupportedCurrencies(): Currency[];
}
