export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  SAR = 'SAR',
}

export class Payment {
  private constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly amount: number,
    public readonly currency: Currency,
    public readonly method: PaymentMethod,
    public status: PaymentStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public gatewayTransactionId?: string,
    public gatewayResponse?: any,
  ) {}

  static create(
    orderId: string,
    customerId: string,
    amount: number,
    currency: Currency,
    method: PaymentMethod,
  ): Payment {
    const id = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    return new Payment(
      id,
      orderId,
      customerId,
      amount,
      currency,
      method,
      PaymentStatus.PENDING,
      now,
      now,
    );
  }

  static fromPersistence(data: any): Payment {
    return new Payment(
      data.id,
      data.orderId,
      data.customerId,
      data.amount,
      data.currency,
      data.method,
      data.status,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.gatewayTransactionId,
      data.gatewayResponse,
    );
  }

  markAsCompleted(gatewayTransactionId?: string, gatewayResponse?: any): void {
    this.status = PaymentStatus.COMPLETED;
    this.updatedAt = new Date();
    this.gatewayTransactionId = gatewayTransactionId;
    this.gatewayResponse = gatewayResponse;
  }

  markAsFailed(gatewayResponse?: any): void {
    this.status = PaymentStatus.FAILED;
    this.updatedAt = new Date();
    this.gatewayResponse = gatewayResponse;
  }

  canBeRefunded(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  isFullyRefunded(): boolean {
    return this.status === PaymentStatus.REFUNDED;
  }

  toPersistence(): any {
    return {
      id: this.id,
      orderId: this.orderId,
      customerId: this.customerId,
      amount: this.amount,
      currency: this.currency,
      method: this.method,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      gatewayTransactionId: this.gatewayTransactionId,
      gatewayResponse: this.gatewayResponse,
    };
  }
}
