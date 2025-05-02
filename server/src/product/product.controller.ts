import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductQueryParams, UpdateProductDto, CreateProductDto } from './dto';
import { CreateInventoryDto } from '../inventory/dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  create(
    @Body() body: { product: CreateProductDto; inventory: CreateInventoryDto },
  ) {
    return this.productService.create(body.product, body.inventory);
  }

  @Get()
  findAll(@Query() query: ProductQueryParams = {}) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
