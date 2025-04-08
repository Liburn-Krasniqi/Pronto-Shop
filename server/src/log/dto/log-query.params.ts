import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { LogActions } from '../actions';

export class LogQueryParams {
  @IsOptional()
  @IsEnum(LogActions)
  action?: LogActions;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601() // Validate date format
  endDate?: string;

  [key: string]: any; // Metadata fields
}
