import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class TokenResponse {
  @Expose()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
