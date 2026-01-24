import { Module } from '@nestjs/common';
import { CreateMenuUseCase } from '../../application/use-cases/create-menu.use-case';
import { MenuController } from './menu.controller';

@Module({
	controllers: [MenuController],
	providers: [CreateMenuUseCase],
	exports: [CreateMenuUseCase],
})
export class MenuModule {}
