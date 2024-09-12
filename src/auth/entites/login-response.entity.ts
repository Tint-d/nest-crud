import { Exclude, Expose, Type } from 'class-transformer';
import { UserData } from '../dto/user-data.dto';
import { TokenResponse } from '../dto/token.dto';

@Exclude()
export class LoginResponse {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  @Type(() => TokenResponse)
  token: TokenResponse;

  @Expose()
  @Type(() => UserData)
  data: UserData;

  constructor(partial: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }
}
