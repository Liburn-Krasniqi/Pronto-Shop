import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInventoryDto } from '../../inventory/dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateInventoryDto)
  inventory?: Partial<CreateInventoryDto>;
}
