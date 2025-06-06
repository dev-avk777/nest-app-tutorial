import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user;

    // Если передали имя свойства — возвращаем конкретное поле, иначе весь объект
    return data ? user?.[data as keyof typeof user] : user;
  },
);
