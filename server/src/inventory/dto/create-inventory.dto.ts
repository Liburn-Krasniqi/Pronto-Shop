import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    description: 'Initial stock quantity',
    example: 100,
    type: Number,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({
    description: 'Planned restock date (optional)',
    example: '2023-06-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  restockDate?: string;

  @ApiProperty({
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  productId: string;
}

export class CreateInventoryForProductDto {
  @ApiProperty({
    description: 'Initial stock quantity',
    example: 100,
    type: Number,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({
    description: 'Planned restock date (optional)',
    example: '2023-06-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  restockDate?: string;
}
