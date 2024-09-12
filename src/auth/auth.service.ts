import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { AuthDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    // private readonly mailService: MailService,
  ) {}

  async register(dto: AuthDto) {
    const { password, passwordConfirmation, ...userData } = dto;

    if (password !== passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    const data: Prisma.UserCreateInput = {
      ...userData,
      password,
    };

    return this.authRepository.register(data);
  }

  async login(dto: AuthDto) {
    return await this.authRepository.login(dto);
  }
  async complete2FA(userId: string, token: string) {
    console.log('token in service', token);

    return await this.authRepository.complete2FA(userId, token);
  }

  async enable2FA(userId: string) {
    return await this.authRepository.enable2FA(userId);
  }

  async refreshToken(refreshToken: string) {
    return await this.authRepository.refreshToken(refreshToken);
  }

  async sendCookies() {
    return true;
  }
}
