import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  CurrentPassword?: string;

  @IsOptional()
  @IsString()
  NewPassword?: string;

  @IsOptional()
  updatedAt?: Date;
}
