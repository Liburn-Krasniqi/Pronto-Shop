import { IsEmail, IsNotEmpty, IsString, MinLength, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAddressDto } from './userAddress.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserAddressDto)
  addresses?: UserAddressDto;
} 