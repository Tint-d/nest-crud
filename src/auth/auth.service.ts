import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';

export type User = any;

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signIn(username: string, pass: string) {
    // const user = this.userService.getUsers();
  }
}
