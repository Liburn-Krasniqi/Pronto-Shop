import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LogActions } from '../actions';

export class CreateLogDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(LogActions, {
    message: `Invalid action. Valid values: ${Object.values(LogActions).join(', ')}`,
  })
  action: LogActions;

  @IsOptional()
  metadata?: {
    productId?: string; // Explicitly declare expected fields
    searchQuery?: string;
    [key: string]: any; // Flexible for other props
  };
}
