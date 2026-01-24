import { Module } from '@nestjs/common';
import { CreateMenuUseCase } from '../../application/use-cases/create-menu.use-case';

@Module({
	providers: [CreateMenuUseCase],
	exports: [CreateMenuUseCase],
})
export class MenuModule {}
