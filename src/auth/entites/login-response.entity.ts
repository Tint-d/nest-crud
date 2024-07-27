import { Exclude, Expose, Type } from 'class-transformer';
import { UserData } from '../dto/user-data.dto';

@Exclude()
export class LoginResponse {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  token: string;

  @Expose()
  @Type(() => UserData)
  data: UserData;

  constructor(partial: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }
}
