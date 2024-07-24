import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Prisma, User } from '@prisma/client';
import { GetAllUserDto } from './dto/get-all-user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllUsers(@Query() getAllUserDto: GetAllUserDto) {
    return this.userService.getAllUsers(getAllUserDto);
  }
}
