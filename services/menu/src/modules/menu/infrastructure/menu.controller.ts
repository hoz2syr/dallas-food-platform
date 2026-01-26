import { Controller, Post, Get, Put, Delete, Param, Body, HttpException } from '@nestjs/common';
import { CreateMenuUseCase } from '../../application/use-cases/create-menu.use-case';
import { ListMenusUseCase, UpdateMenuUseCase, DeleteMenuUseCase } from '../../application/use-cases/menu-crud.use-cases';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { mapToApiError } from '../../../../../shared/errors/http-exception.mapper';
@ApiTags('Menus')
@Controller('menus')
export class MenuController {
  constructor(
    private readonly createMenuUseCase: CreateMenuUseCase,
    private readonly listMenusUseCase: ListMenusUseCase,
    private readonly updateMenuUseCase: UpdateMenuUseCase,
    private readonly deleteMenuUseCase: DeleteMenuUseCase,
  ) {}


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
  async create(@Body() body: any) {
    const command = {
      menuId: body.menuId,
      name: body.name,
      items: body.items,
    };
    try {
      const menu = await this.createMenuUseCase.execute(command);
      return {
        id: menu.id,
        name: menu.name,
        createdAt: menu.createdAt,
      };
    } catch (err) {
      const mapped = mapToApiError(err);
      throw new HttpException(mapped.body, mapped.status);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all menus' })
  @ApiResponse({ status: 200, description: 'List of menus' })
  async findAll() {
    try {
      const menus = await this.listMenusUseCase.execute();
      return menus;
    } catch (err) {
      const mapped = mapToApiError(err);
      throw new HttpException(mapped.body, mapped.status);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a menu' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ schema: { example: { name: 'Lunch Updated', items: [{ id: 'i1', name: 'Burger', price: 6 }] } } })
  @ApiResponse({ status: 200, description: 'Menu updated' })
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      // Assume items is required for update
      await this.updateMenuUseCase.execute(new (require('../../domain/entities/menu.entity').Menu)({
        id,
        name: body.name,
        items: body.items,
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
      }));
      return { message: 'Menu updated' };
    } catch (err) {
      const mapped = mapToApiError(err);
      throw new HttpException(mapped.body, mapped.status);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Menu deleted' })
  async delete(@Param('id') id: string) {
    try {
      await this.deleteMenuUseCase.execute(id);
      return { message: 'Menu deleted' };
    } catch (err) {
      const mapped = mapToApiError(err);
      throw new HttpException(mapped.body, mapped.status);
    }
  }
}
