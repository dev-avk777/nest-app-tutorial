import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  hello() {
    return 'hello from  auth service';
  }

  async login(dto: AuthDto) {
    // 1. Поиск пользователя по email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // 2. Проверка, что пользователь найден
    //{
    // "statusCode": 403,
    // "message": "Credentials incorrect",
    // "error": "Forbidden" // доступ запрещен из-за неверных данных
    // }
    if (!user) {
      this.logger.warn(`Login failed: user not found for email ${dto.email}`);
      throw new ForbiddenException('Credentials incorrect');
    }

    // 3. Проверка пароля (сравнение с хэшем)
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) {
      this.logger.warn(
        `Login failed: wrong password for email ${dto.email} not correct password: ${dto.password}`,
      );
      throw new ForbiddenException('Credentials incorrect');
    }

    const token = await this.signToken(user.id, user.email);

    // 4. Возврат данных пользователя без хэша (или с токеном)

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updateAt: user.updateAt,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    };
  }
  async signup(dto: AuthDto) {
    try {
      //generate new hash
      const hash = await argon.hash(dto.password);
      //save new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          email: true,
          id: true,
          createdAt: true,
          updateAt: true,
          firstName: true,
          lastName: true,
        },
      });

      //return user which save in the db
      return user;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Signup failed', error.stack);
      } else {
        this.logger.error('Signup failed', String(error));
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  /**
   * Генерирует JWT-токен для пользователя.
   * Создаёт полезную нагрузку с идентификатором пользователя (sub) и email,
   * затем асинхронно подписывает её с помощью секретного ключа,
   * устанавливая время жизни токена в 15 минут.
   * Возвращает Promise, который резолвится в строку — готовый JWT-токен.
   */
  signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get<string>('JWT_SECRET'); // получаем секретный ключ из .env
    if (!secret) {
      this.logger.error('JWT_SECRET is not defined in environment variables');
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
  }
}
