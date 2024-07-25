import { BadRequestException, Logger, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(private readonly prisma: PrismaService) {
    this.logger.log(
      `PrismaService in AuthRepository: ${prisma ? 'Available' : 'Unavailable'}`,
    );
  }

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

      this.logger.log('Hashing password');
      const hashedPassword = await this.hashPassword(password);

      this.logger.log('Creating user');
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

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }
}
