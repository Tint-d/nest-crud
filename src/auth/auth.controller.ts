import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { LoginInterceptor } from './login.interceptor';
import { LogoutInterceptor } from './logout.interceptor';
import { SetCookiesInterceptor } from './setcookies.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LoginInterceptor, SetCookiesInterceptor)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LoginInterceptor, SetCookiesInterceptor)
  @Post('verify-2fa')
  async verify2FA(
    @Body('userId') userId: string,
    @Body('token') token: string,
  ) {
    return await this.authService.complete2FA(userId, token);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LogoutInterceptor)
  @Get('logout')
  async logout() {
    return { success: true, message: 'Logout Successfully' };
  }
  @Post('send')
  async send(@Body('userId') userId: string, @Body('token') token: {}) {
    console.log(token);

    return await this.authService.sendCookies();
  }
}
