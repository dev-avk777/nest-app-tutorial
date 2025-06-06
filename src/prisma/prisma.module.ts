import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//global означает, что этот модуль будет доспупен всем модулям в приложении
@Global()
// важно экспортировать сервис ,чтобы его можно было юзать в других модулях
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
