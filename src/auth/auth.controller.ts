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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LoginInterceptor)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LogoutInterceptor)
  @Get('logout')
  async logout() {
    return { success: true, message: 'Logout Successfully' };
  }
}
