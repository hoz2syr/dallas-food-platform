import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { CreateMenuUseCase } from '../../application/use-cases/create-menu.use-case';
import { ListMenusUseCase, UpdateMenuUseCase, DeleteMenuUseCase } from '../../application/use-cases/menu-crud.use-cases';
import { MenuController } from './menu.controller';
import { MenuErrorFilter } from './menu-error.filter';
import { PostgresMenuRepository } from './repositories/postgres-menu.repository';
import { ApiKeyGuard } from '../../../../../shared/auth/api-key.guard';

@Module({
	controllers: [MenuController],
	providers: [
		// Bind the domain-defined repository abstraction token to the Postgres implementation
		{
			provide: 'MenuRepository',
			useClass: PostgresMenuRepository,
		},
		// Register the concrete Postgres repository for direct injection if needed
		PostgresMenuRepository,
		// Instantiate CreateMenuUseCase with the repository using a factory to avoid framework decorators in the application layer
		{
			provide: CreateMenuUseCase,
			useFactory: (repo: any) => new CreateMenuUseCase(repo),
			inject: ['MenuRepository'],
		},
		{
			provide: ListMenusUseCase,
			useFactory: (repo: any) => new ListMenusUseCase(repo),
			inject: ['MenuRepository'],
		},
		{
			provide: UpdateMenuUseCase,
			useFactory: (repo: any) => new UpdateMenuUseCase(repo),
			inject: ['MenuRepository'],
		},
		{
			provide: DeleteMenuUseCase,
			useFactory: (repo: any) => new DeleteMenuUseCase(repo),
			inject: ['MenuRepository'],
		},
		{
			provide: APP_FILTER,
			useClass: MenuErrorFilter,
		},
		{
			provide: APP_GUARD,
			useClass: ApiKeyGuard,
		},
	],
	exports: [CreateMenuUseCase],
})
export class MenuModule {}
