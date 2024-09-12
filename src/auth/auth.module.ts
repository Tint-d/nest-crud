import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecert } from 'src/utils/constant/constants';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtSecert,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, RolesGuard, MailService],
  exports: [AuthService],
})
export class AuthModule {}
