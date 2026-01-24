import { Module } from '@nestjs/common';
import { MenuModule } from './modules/menu/infrastructure/menu.module';

@Module({
  imports: [MenuModule],
})
export class AppModule {}
