import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from './repository/user.repository';
import { GetAllUserDto } from './dto/get-all-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.userRepository.createUser(data);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findUserById(id);
  }

  async getAllUsers(dto: GetAllUserDto): Promise<User[]> {
    return this.userRepository.findUser(dto);
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.userRepository.modifiedUser(id, data);
  }

  async deleteUser(id: string): Promise<User> {
    return this.userRepository.deleteUser(id);
  }
}
