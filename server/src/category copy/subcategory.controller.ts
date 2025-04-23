import { Body, Controller, Post, Get, Req, Param, Put, Patch, Delete } from "@nestjs/common";
import { SubcategoryService } from "./subcategory.service";
import { CreateSubcategoryDto, UpdateSubcategoryDto } from "./dto";
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiCreatedResponse, 
  ApiOkResponse 
} from "@nestjs/swagger";

@ApiTags('Subcategory')
@Controller('subcategory')
export class SubcategoryController {
  constructor(private SubcategoryService: SubcategoryService) {}

  @Get('getSubcategories')
  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiOkResponse({ 
    description: 'List of subcategories retrieved successfully',
  })
  findAll() {
    return this.SubcategoryService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new subcategory' })
  @ApiBody({ type: CreateSubcategoryDto })
  @ApiCreatedResponse({ 
    description: 'Subcategory created successfully',
  })
  create(@Body() dto: CreateSubcategoryDto) {
    return this.SubcategoryService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subcategory by ID' })
  @ApiParam({ name: 'id', description: 'Subcategory ID' })
  @ApiOkResponse({ description: 'Subcategory retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  findById(@Param('id') id) {
    return this.SubcategoryService.findById(String(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subcategory' })
  @ApiParam({ name: 'id', description: 'Subcategory ID' })
  @ApiBody({ type: UpdateSubcategoryDto })
  @ApiOkResponse({ description: 'Subcategory updated successfully' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  update(@Param('id') id: String, @Body() dto: UpdateSubcategoryDto) {
    return this.SubcategoryService.update(String(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subcategory' })
  @ApiParam({ name: 'id', description: 'Subcategory ID' })
  @ApiOkResponse({ description: 'Subcategory deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  remove(@Param('id') id: String) {
    return this.SubcategoryService.delete(String(id));
  }
}