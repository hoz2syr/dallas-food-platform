import { IsNotEmpty, IsNumber, IsString, IsPositive, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({
    description: 'Order ID',
    example: 'order_12345',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Customer ID',
    example: 'customer_67890',
  })
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 29.99,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Payment currency',
    example: 'USD',
    enum: ['USD', 'EUR', 'GBP'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['USD', 'EUR', 'GBP'])
  currency: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'credit_card',
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['credit_card', 'debit_card', 'paypal', 'apple_pay'])
  method: string;
}
