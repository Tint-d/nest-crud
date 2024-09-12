import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { PostModule } from './post/post.module';
import { MailService } from './mail/mail.service';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, PostModule],
  providers: [AppService, MailService],
})
export class AppModule {}
