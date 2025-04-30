import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryResponseDto {
  @ApiProperty({ example: '1', description: 'Unique identifier of the category' })
  id: number;

  @ApiProperty({ example: 'Category 1', description: 'Name of the category' })
  name: string;

  @ApiProperty({ example: 'Lorem ipsum...', description: 'Category Description' })
  description: string;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z', description: 'Date when the vendor was created' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z', description: 'Date when the vendor was last updated' })
  updatedAt: Date;
}
