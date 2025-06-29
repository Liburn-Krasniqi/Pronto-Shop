import { IsNumber, IsOptional, IsString, IsISO8601, IsBoolean, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductQueryParams {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  vendorId?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(v => Number(v));
    }
    if (typeof value === 'string') {
      return [Number(value)];
    }
    return [Number(value)];
  })
  @IsNumber({}, { each: true })
  subcategoryIds?: number[];

  @IsOptional()
  @IsISO8601()
  createdAfter?: string;

  @IsOptional()
  @IsISO8601()
  createdBefore?: string;

  [key: string]: any; // For any additional metadata fields

  //pagination
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number = 10; // Default limit

  //sorting support
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  //review statistics
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeReviews?: boolean;

  //rating filter
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;
}
