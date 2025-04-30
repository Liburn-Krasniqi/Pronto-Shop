import { ApiProperty } from '@nestjs/swagger';

export class SubcategoryResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the subcategory' })
  id: number;

  @ApiProperty({ example: 'Laptops', description: 'Name of the subcategory' })
  name: string;

  @ApiProperty({ example: 'All types of portable computers', description: 'Subcategory Description' })
  description: string;

  @ApiProperty({ example: 1, description: 'ID of the parent category' })
  categoryId: number;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z', description: 'Date when the subcategory was created' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z', description: 'Date when the subcategory was last updated' })
  updatedAt: Date;
}
