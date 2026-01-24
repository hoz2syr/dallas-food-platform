import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CreateMenuUseCase } from '../../application/use-cases/create-menu.use-case';
import { MenuController } from './menu.controller';
import { MenuErrorFilter } from './menu-error.filter';

@Module({
	controllers: [MenuController],
	providers: [
		CreateMenuUseCase,
		{
			provide: APP_FILTER,
			useClass: MenuErrorFilter,
		},
	],
	exports: [CreateMenuUseCase],
})
export class MenuModule {}
