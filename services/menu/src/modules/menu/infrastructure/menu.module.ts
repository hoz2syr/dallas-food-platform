import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CreateMenuUseCase } from '../../application/use-cases/create-menu.use-case';
import { MenuController } from './menu.controller';
import { MenuErrorFilter } from './menu-error.filter';
import { InMemoryMenuRepository } from './repositories/in-memory-menu.repository';

@Module({
	controllers: [MenuController],
	providers: [
		// Repository binding: domain-defined abstraction token
		{
			provide: 'MenuRepository',
			useClass: InMemoryMenuRepository,
		},
		// Provide the concrete implementation as a provider token so it can be injected if needed
		InMemoryMenuRepository,
		// CreateMenuUseCase must be instantiated with the repository; use a factory to avoid framework decorators in application layer
		{
			provide: CreateMenuUseCase,
			useFactory: (repo: any) => new CreateMenuUseCase(repo),
			inject: ['MenuRepository'],
		},
		{
			provide: APP_FILTER,
			useClass: MenuErrorFilter,
		},
	],
	exports: [CreateMenuUseCase],
})
export class MenuModule {}
