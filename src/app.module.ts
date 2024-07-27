import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  providers: [AppService],
})
export class AppModule {}
