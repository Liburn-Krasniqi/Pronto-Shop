import { IsOptional, IsString, IsEmail, isStrongPassword } from 'class-validator';

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
  currentPassword?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;

  @IsOptional()
  updatedAt?: Date;
}
