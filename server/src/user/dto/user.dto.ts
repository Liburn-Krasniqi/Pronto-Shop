import { IsEmail, IsNotEmpty, IsString, MinLength, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class UserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
}