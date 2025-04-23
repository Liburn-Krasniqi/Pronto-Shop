import { Body, Controller, Post, Get, Req, Param, Put, Patch, Delete } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiCreatedResponse, 
  ApiOkResponse 
} from "@nestjs/swagger";

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private CategoryService: CategoryService) {}

  @Get('getCategories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({ 
    description: 'List of categories retrieved successfully',
  })
  findAll() {
    return this.CategoryService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ 
    description: 'Category created successfully',
  })
  create(@Body() dto: CreateCategoryDto) {
    return this.CategoryService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({ description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findById(@Param('id') id) {
    return this.CategoryService.findById(String(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(@Param('id') id: String, @Body() dto: UpdateCategoryDto) {
    return this.CategoryService.update(String(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({ description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: String) {
    return this.CategoryService.delete(String(id));
  }
}