import {
  BadRequestException,
  Logger,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtSecert } from 'src/utils/constant/constants';
import { Response } from 'express';
import { LoginResponse } from '../entites/login-response.entity';
import { UserData } from '../dto/user-data.dto';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(data: Prisma.UserCreateInput) {
    try {
      const { name, email, password } = data;

      this.logger.log('Checking if user exists');
      const userExists = await this.prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await this.hashPassword(password);

      await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      return data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser) {
      throw new NotFoundException('User is not found!');
    }

    const successPassword = await this.comparePassword(
      password,
      foundUser.password,
    );

    if (!successPassword) {
      throw new BadRequestException('Wrong Password!');
    }

    const token = await this.generateToken(foundUser.id, foundUser.email);

    return new LoginResponse({
      success: true,
      message: 'Login Successfully',
      token,
      data: new UserData({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      }),
    });
  }

  private async generateToken(id: string, email: string) {
    const payload = { id, email };
    return await this.jwt.signAsync(payload, {
      secret: jwtSecert,
    });
  }

  private async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }
}
