import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

//Модуль — это класс, аннотированный декоратором @Module()
//@Module — это функция-декоратор, которая применяется к классу и добавляет ему метаданные, необходимые фреймворку для понимания, как устроен этот модуль.
@Module({
  imports: [
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
// модули позволяют разбивать приложение на независимые части(компоненты), которые можно легко подключать и отключать
