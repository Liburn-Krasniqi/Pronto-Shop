import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiParam,
  } from '@nestjs/swagger';
import { Body, Controller, Post, Get, Req, Param, Put, Patch, Delete } from "@nestjs/common";
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from './dto';

@ApiTags('Categories')
@Controller('category')
export class CategoryController{
    constructor(private categoryService: CategoryService){}

    @Get()
    @ApiOperation({
        summary: 'Retrieve all Categories',
        description: 'Fetch all categories of Pronto that have been created'
    })
    @ApiResponse({
            status: 200,
            type: CategoryResponseDto,
            description: 'Successfully retrieved category'
        })
    findAll(){
        return this.categoryService.findAll()
    }

    @Get(':id')
        @ApiOperation({ summary: 'Get Category by ID' })
        @ApiParam({ name: 'id', type: Number })
        @ApiResponse({
            status: 200,
            description: 'Category found',
            type: CategoryResponseDto
        })
        @ApiResponse({ status: 404, description: 'Vendor not found' })
        findById(@Param('id') id: number) {
            return this.categoryService.findById(Number(id));
        }

    @Post('create')
    @ApiOperation({ summary: 'Sign up a new Vendor' })
        @ApiBody({ type: CategoryResponseDto })
        @ApiResponse({
            status: 201,
            description: 'Category created successfully' })
        @ApiResponse({
            status: 400,
            description: 'Invalid category data',
          })
    create(@Body() dto: CreateCategoryDto){
        return this.categoryService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update Category by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: CategoryController })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    update(@Param('id') id:number, @Body() dto: UpdateCategoryDto){
        return this.categoryService.update(Number(id),dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Category by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    delete(@Param('id') id: number){
        return this.categoryService.delete(Number(id));
    }
}