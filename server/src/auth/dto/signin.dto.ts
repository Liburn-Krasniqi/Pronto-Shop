import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from 'src/user/dto/address.dto';

export class SignInDto {
    @IsEmail()
    email: string;
  
    @IsString()
    password: string;
  }
  