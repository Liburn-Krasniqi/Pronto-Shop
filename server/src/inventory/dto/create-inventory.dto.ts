import {
  IsInt,
  Min,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateInventoryDto {
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsDateString()
  @IsOptional()
  restockDate?: string;

  @IsString()
  productId: string;
}
