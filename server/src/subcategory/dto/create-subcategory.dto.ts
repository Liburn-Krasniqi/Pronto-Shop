import { IsNotEmpty, IsString, IsOptional,IsInt } from "class-validator";

export class CreateSubcategoryDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsInt()
    @IsNotEmpty()
    categoryId: number
}