@Controller()       
@ApiTags('health')
export class HealthController {
  @Get('health')       
  @ApiOkResponse({ type: HealthResponseDto })
  getHealth(): HealthResponseDto {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}