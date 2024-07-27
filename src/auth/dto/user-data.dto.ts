import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserData {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  constructor(partial: Partial<UserData>) {
    Object.assign(this, partial);
  }
}
