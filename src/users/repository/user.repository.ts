import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllUserDto } from '../dto/get-all-user.dto';
import { GetUserByIdReponse } from '../entites/get-users-response.entity';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findUserById(id: string): Promise<GetUserByIdReponse | null> {
    try {
      const user = this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User is not found');
      }
      return new GetUserByIdReponse({
        name: (await user).name,
        email: (await user).email,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findUser(dto: GetAllUserDto): Promise<User[]> {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async modifiedUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
