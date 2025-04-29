import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiParam,
  } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto, UpdateSubcategoryDto, SubcategoryResponseDto } from './dto';

@ApiTags('Subcategories')
@Controller('subcategory')
export class SubcategoryController{
    constructor(private subcategoryService: SubcategoryService){}

    @Get()
    @ApiOperation({
        summary: 'Retrieve all Subcategories',
        description: 'Fetch all subcategories of Pronto that have been created'
    })
    @ApiResponse({
        status: 200,
        type: SubcategoryResponseDto,
        description: 'Successfully retrieved subcategory'
    })
    findAll(){
        return this.subcategoryService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Subcategory by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({
        status: 200,
        description: 'Subcategory found',
        type: SubcategoryResponseDto
    })
    @ApiResponse({ status: 404, description: 'Subcategory not found' })
    findById(@Param('id') id: number){
        return this.subcategoryService.findById(Number(id));
    }

    @Post('create')
    @ApiOperation({ summary: 'Create a new subcategory' })
    @ApiBody({ type: SubcategoryResponseDto })
    @ApiResponse({
        status: 201,
        description: 'Subcategory created successfully' })
    @ApiResponse({
        status: 400,
        description: 'Invalid subcategory data',
      })
    create(@Body() dto: CreateSubcategoryDto){
        return this.subcategoryService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update Subcategory by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: SubcategoryController })
    @ApiResponse({ status: 200, description: 'Subcategory updated successfully' })
    @ApiResponse({ status: 404, description: 'Subcategory not found' })
    update(@Param('id') id:number, @Body() dto: UpdateSubcategoryDto){
        return this.subcategoryService.update(Number(id), dto);
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Delete Subcategory by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Subcategory deleted successfully' })
    @ApiResponse({ status: 404, description: 'Subcategory not found' })
    delete(@Param('id') id: number){
        return this.subcategoryService.delete(Number(id));
    }

}
