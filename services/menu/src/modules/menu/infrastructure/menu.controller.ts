import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateMenuUseCase } from '../../application/use-cases/create-menu.use-case';
import { ApiKeyGuard } from '../../../../../shared/auth/api-key.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@UseGuards(ApiKeyGuard)
@ApiTags('Menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly createMenuUseCase: CreateMenuUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiBody({
    schema: {
      example: { menuId: 'm1', name: 'Lunch', items: [{ id: 'i1', name: 'Burger', price: 5 }] },
    },
  })
  @ApiResponse({ status: 200, description: 'Menu created', schema: { example: { id: 'm1', name: 'Lunch', createdAt: '2026-01-01T00:00:00.000Z' } } })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() body: any) {
    const command = {
      menuId: body.menuId,
      name: body.name,
      items: body.items,
    };

    const menu = this.createMenuUseCase.execute(command);

    return {
      id: menu.id,
      name: menu.name,
      createdAt: menu.createdAt,
    };
  }
}
