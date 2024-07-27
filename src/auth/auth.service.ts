import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { AuthDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

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
}
