import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

class HealthResponseDto {
  status!: string;
  timestamp!: string;
}

@Controller()
@ApiTags('health')
export class HealthController {
  @Get('health')
  @ApiOkResponse({ type: HealthResponseDto })
  getHealth(): HealthResponseDto {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}