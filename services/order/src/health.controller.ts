import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../../../../shared/auth/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'ok', service: 'order' };
  }
}
