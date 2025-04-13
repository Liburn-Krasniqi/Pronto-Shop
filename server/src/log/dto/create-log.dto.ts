import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LogActions } from '../actions';

export class CreateLogDto {
  @ApiProperty({
    required: false,
    example: 'user_123',
    description: 'ID of the user who performed the action',
  })
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({
    enum: LogActions,
    example: 'viewed_product',
    description: 'Type of action being logged',
  })
  @IsNotEmpty()
  @IsEnum(LogActions, {
    message: `Invalid action. Valid values: ${Object.values(LogActions).join(', ')}`,
  })
  action: LogActions;

  @ApiProperty({
    required: false,
    example: { productId: 'prod_456', searchQuery: 'smartphone' },
    description: 'Additional context about the action',
  })
  @IsOptional()
  metadata?: {
    productId?: string;
    searchQuery?: string;
    [key: string]: any;
  };
}
