import {
  BadRequestException,
  Logger,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtSecert } from 'src/utils/constant/constants';
import { LoginResponse } from '../entites/login-response.entity';
import { UserData } from '../dto/user-data.dto';
import * as speakeasy from 'speakeasy';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailService: MailService,
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

  async enable2FA(userId: string) {
    const secret = speakeasy.generateSecret();
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: true,
      },
    });

    // Send OTP via email
    const token = speakeasy.totp({
      secret: user.twoFactorSecret,
      encoding: 'base32',
    });
    await this.mailService.sendMail(
      user.email,
      'Your 2FA Code',
      `Your OTP is ${token}`,
    );

    return user;
  }

  async verify2FA(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorEnabled) {
      throw new BadRequestException('2FA is not enabled for this user');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1, // Adjust the window to account for slight time discrepancies
    });

    if (!isValid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    return isValid;
  }

  async login(dto: AuthDto) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.comparePassword(
      password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    if (foundUser.twoFactorEnabled) {
      const token = speakeasy.totp({
        secret: foundUser.twoFactorSecret,
        encoding: 'base32',
      });

      await this.mailService.sendMail(
        foundUser.email,
        'Your 2FA Code',
        `Your OTP is ${token}`,
      );

      return {
        success: true,
        message: '2FA code sent to your email',
        twoFactorRequired: true,
        userId: foundUser.id,
      };
    }

    const tokens = await this.generateToken(
      foundUser.id,
      foundUser.email,
      foundUser.role,
    );

    return new LoginResponse({
      success: true,
      message: 'Login Successful',
      token: tokens,
      data: new UserData({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      }),
    });
  }

  async complete2FA(userId: string, token: string) {
    const isValid = await this.verify2FA(userId, token);

    if (!isValid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const tokens = await this.generateToken(
      foundUser.id,
      foundUser.email,
      foundUser.role,
    );

    return new LoginResponse({
      success: true,
      message: 'Login Successful',
      token: tokens,
      data: new UserData({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      }),
    });
  }

  async logout() {
    // return res.send({ message: 'Logged out succefully' });
  }

  private async generateToken(id: string, email: string, role: Role) {
    const payload = { id, email, role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: jwtSecert,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: jwtSecert,
      expiresIn: '7d',
    });

    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }

  private async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: jwtSecert,
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateToken(user.id, user.email, user.role);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
