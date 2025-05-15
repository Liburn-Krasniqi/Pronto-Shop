import { IsEmail, IsNotEmpty, IsString, MinLength, IsObject, ValidateNested, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAddressDto } from '../../user/dto/userAddress.dto';
import { VendorAddressDto } from '../../vendor/dto/vendorAddress.dto';


export class SignUpDto{

    //Per Users
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
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsIn(['user', 'vendor'])
    type: 'user' | 'vendor';

    //Per Vendors

    @IsOptional()
    @IsString()
    businessName: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    phone_number: string

    @IsOptional()
    @Type(() => VendorAddressDto)
    address?: VendorAddressDto;
}