import { IsOptional, IsString, IsEmail, isStrongPassword, IsArray, ValidateNested } from 'class-validator';
import { UserAddressDto } from './userAddress.dto';
import { Type } from 'class-transformer';

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

  // @IsString()
  // currentPassword?: string;

  // @IsOptional()
  // @IsString()
  // newPassword?: string;

  @IsOptional()
  addresses?: UserAddressDto;

  @IsOptional()
  updatedAt?: Date;
}
