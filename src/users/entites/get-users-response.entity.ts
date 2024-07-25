import { User } from '@prisma/client';
import { Type } from 'class-transformer';

export class GetAllUserReponse {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class GetUserByIdReponse {
  data: User;
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
