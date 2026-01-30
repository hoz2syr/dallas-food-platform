export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'succeeded' 
  | 'failed' 
  | 'refunded'
  | 'partially_refunded';

export type PaymentMethod = 'card' | 'wallet' | 'bank_transfer';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'SAR';

export interface PaymentProps {
  id?: string;
  orderId: string;
  userId: string;
  customerId?: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  refundedAmount?: number;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment {
  id: string;
  orderId: string;
  userId: string;
  customerId?: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  refundedAmount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: PaymentProps) {
    this.id = props.id || this.generateId();
    this.orderId = props.orderId;
    this.userId = props.userId;
    this.customerId = props.customerId;
    this.amount = props.amount;
    this.currency = props.currency;
    this.status = props.status;
    this.paymentMethod = props.paymentMethod;
    this.transactionId = props.transactionId;
    this.refundedAmount = props.refundedAmount || 0;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: PaymentProps): Payment {
    return new Payment(props);
  }

  private generateId(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  markAsProcessing(): void {
    this.status = 'processing';
    this.updatedAt = new Date();
  }

  markAsSucceeded(transactionId: string): void {
    this.status = 'succeeded';
    this.transactionId = transactionId;
    this.updatedAt = new Date();
  }

  markAsFailed(reason?: string): void {
    this.status = 'failed';
    if (reason) {
      this.metadata = { ...this.metadata, failureReason: reason };
    }
    this.updatedAt = new Date();
  }

  markAsRefunded(amount?: number): void {
    const refundAmount = amount || this.amount;
    this.refundedAmount = (this.refundedAmount || 0) + refundAmount;
    
    if (this.refundedAmount >= this.amount) {
      this.status = 'refunded';
    } else {
      this.status = 'partially_refunded';
    }
    this.updatedAt = new Date();
  }

  canBeRefunded(): boolean {
    return this.status === 'succeeded' && this.refundedAmount < this.amount;
  }

  toPersistence(): any {
    return {
      id: this.id,
      orderId: this.orderId,
      userId: this.userId,
      customerId: this.customerId,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      paymentMethod: this.paymentMethod,
      transactionId: this.transactionId,
      refundedAmount: this.refundedAmount,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
