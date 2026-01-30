import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RefundPaymentDto {
  @ApiProperty({ description: 'Payment ID to refund', example: 'payment_12345' })
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Refund amount (optional, defaults to full payment amount)', example: 15.99, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'amount must be a number' })
  @IsPositive()
  amount?: number;

  @ApiProperty({ description: 'Reason for refund (optional)', example: 'Customer requested cancellation', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
