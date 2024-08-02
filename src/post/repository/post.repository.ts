import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class PostRepository {
  private logger = new Logger(PostRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async;
}
