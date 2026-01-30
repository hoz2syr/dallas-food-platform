import { IsNotEmpty, IsNumber, IsString, IsPositive, IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Order ID', example: 'order_12345' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'User ID', example: 'user_abc' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Customer ID', example: 'customer_67890', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ description: 'Payment amount', example: 29.99 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { message: 'amount must be a number' })
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Payment currency', example: 'USD', enum: ['USD', 'EUR', 'GBP', 'SAR'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['USD', 'EUR', 'GBP', 'SAR'])
  currency: string;

  @ApiProperty({ description: 'Payment method', example: 'card', enum: ['card', 'wallet', 'bank_transfer'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['card', 'wallet', 'bank_transfer'])
  paymentMethod: string;

  @ApiProperty({ description: 'Optional metadata object', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}
