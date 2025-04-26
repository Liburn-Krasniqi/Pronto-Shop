import { IsEmail, IsNotEmpty, IsString, MinLength, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAddressDto } from '../../user/dto/userAddress.dto';

export class SignUpDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MinLength(8)
    passwordRepeat: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}