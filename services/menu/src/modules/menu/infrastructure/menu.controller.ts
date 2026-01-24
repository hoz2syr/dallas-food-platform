import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateMenuUseCase } from '../../application/use-cases/create-menu.use-case';
import { ApiKeyGuard } from '../../../../../shared/auth/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('menus')
export class MenuController {
  constructor(private readonly createMenuUseCase: CreateMenuUseCase) {}

  @Post()
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
