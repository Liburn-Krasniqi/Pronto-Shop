import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99) // Max for DECIMAL(10,2): 8 digits before decimal, 2 after
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  @IsOptional()
  discountPrice?: number;

  @IsArray()
  @IsString({ each: true })
  imageURL: string[];

  @IsInt()
  vendorid: number;

  @IsInt({ each: true })
  subcategory: number[];
}
