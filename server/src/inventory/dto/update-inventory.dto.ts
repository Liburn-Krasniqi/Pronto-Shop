import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty({
    description: 'Stock quantity',
    example: 100,
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @ApiProperty({
    description: 'Planned restock date (optional)',
    example: '2023-06-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  restockDate?: string;
}
