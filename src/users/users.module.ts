import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserRepository } from './repository/user.repository';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy],
})
export class UserModule {}
