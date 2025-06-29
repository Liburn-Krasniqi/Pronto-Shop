import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 