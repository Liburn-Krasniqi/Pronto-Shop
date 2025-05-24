// create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Coffee',
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High quality arabica coffee',
    maxLength: 511,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 12.99,
    type: Number,
    minimum: 0,
    maximum: 99999999.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  price: number;

  @ApiProperty({
    description: 'Discounted price (optional)',
    example: 10.99,
    type: Number,
    required: false,
    minimum: 0,
    maximum: 99999999.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({
    description: 'Array of image URLs',
    example: ['https://example.com/image1.jpg'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  imageURL: string[];

  @ApiProperty({
    description: 'Vendor ID',
    example: 1,
    type: Number,
  })
  @IsInt()
  vendorid: number;

  @ApiProperty({
    description: 'Array of subcategory IDs',
    example: [1, 2],
    type: [Number],
  })
  @IsInt({ each: true })
  subcategory: number[];
}
