import { IsOptional, IsString } from 'class-validator';

export class GetAllUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
