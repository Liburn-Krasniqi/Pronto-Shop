import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from 'src/user/dto/address.dto';

export class AuthDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
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
