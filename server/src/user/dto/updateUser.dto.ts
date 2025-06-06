import { IsOptional, IsString, IsEmail, MinLength, IsObject, ValidateNested } from 'class-validator';
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

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  confirmPassword?: string;

  @IsOptional()
  addresses?: UserAddressDto;

  @IsOptional()
  updatedAt?: Date;
}
