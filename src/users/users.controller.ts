import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Prisma, User } from '@prisma/client';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllUsers(@Query() getAllUserDto: GetAllUserDto) {
    return this.userService.getAllUsers(getAllUserDto);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
