import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process a payment' })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    return this.paymentsService.processPayment(processPaymentDto);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund a payment' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async refundPayment(@Body() refundPaymentDto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(refundPaymentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, description: 'Payment details retrieved' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get payments list' })
  @ApiResponse({ status: 200, description: 'Payments list retrieved' })
  async getPayments(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paymentsService.getPayments({ page, limit });
  }
}
