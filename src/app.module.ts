import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

//Модуль — это класс, аннотированный декоратором @Module()
@Module({
  imports: [CatsModule],
})
export class AppModule {}
