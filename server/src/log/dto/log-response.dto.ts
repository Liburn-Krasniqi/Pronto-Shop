import { ApiProperty } from '@nestjs/swagger';
import { LogActions } from '../actions';

export class LogResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'user_123', required: false })
  userId?: string;

  @ApiProperty({ enum: LogActions, example: 'viewed_product' })
  action: string;

  @ApiProperty({
    example: { productId: 'prod_456' },
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z' })
  updatedAt: Date;
}
