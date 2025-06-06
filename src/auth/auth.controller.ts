import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

//контроллер — это класс, который обрабатывает входящие запросы и отправляет ответы клиенту, он должен вызвать сервис, который будет обрабатывать запросы
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
  @Get('hello')
  hello() {
    return this.authService.hello();
  }
}
