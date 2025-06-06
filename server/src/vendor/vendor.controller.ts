import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiParam,
    ApiBearerAuth,
  } from '@nestjs/swagger';
import {HttpException, HttpStatus, Query, UseGuards} from '@nestjs/common';
import { Body, Controller, Post, Get, Req, Param, Put, Patch, Delete } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { CreateVendorDto, UpdateVendorDto,VendorResponseDto } from "./dto";
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { VendorGuard } from 'src/auth/guard/vendor.guard';

@ApiTags('Vendors')
@ApiBearerAuth()
@Controller('vendor')
export class VendorController{
    constructor(private vendorService: VendorService,private prisma: PrismaService) {}

    @UseGuards(JwtGuard, AdminGuard)
    @Post()
    @ApiOperation({
        summary: 'Create a new Vendor (Admin only)',
        description: 'Create a new vendor in the system'
    })
    @ApiBody({ type: CreateVendorDto })
    @ApiResponse({
        status: 201,
        description: 'Vendor created successfully',
        type: VendorResponseDto
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    create(@Body() dto: CreateVendorDto) {
        return this.vendorService.create(dto);
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Get()
    @ApiOperation({
        summary: 'Retrieve all Vendors (Admin only)',
        description: 'Fetch all vendors of Pronto that have been created'
    })
    @ApiResponse({
        status: 200,
        type: VendorResponseDto,
        description: 'Successfully retrieved vendors'
    })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    findAll(){
        return this.vendorService.findAll()
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Get('count')
    @ApiOperation({ summary: 'Get total number of vendors (Admin only)' })
    @ApiResponse({ 
        status: 200, 
        description: 'Successfully retrieved vendor count',
        schema: {
            type: 'object',
            properties: {
                count: {
                    type: 'number',
                    description: 'Total number of vendors'
                }
            }
        }
    })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async count() {
        try {
            return await this.vendorService.count();
        } catch (error) {
            return { count: 0 };
        }
    }

    @UseGuards(JwtGuard, VendorGuard)
    @Get('me')
    @ApiOperation({ summary: 'Get current vendor profile' })
    @ApiResponse({ status: 200, description: 'Vendor data returned' })
    @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
    async getme(@GetUser() user: { id: number }) {
      const vendorData = await this.prisma.vendor.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          businessName: true,
          phone_number: true,
          createdAt: true,
          updatedAt: true,
          addresses: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              postalCode: true,
              country: true
            }
          }
        }
      });
      return vendorData;
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get Vendor by ID (Admin only)' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({
        status: 200,
        description: 'Vendor found',
        type: VendorResponseDto
    })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    findById(@Param('id') id: string) {
        return this.vendorService.findById(Number(id));
    }

    @UseGuards(JwtGuard, VendorGuard)
    @Patch('me')
    @ApiOperation({ summary: 'Update current vendor profile' })
    @ApiBody({ type: UpdateVendorDto })
    @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    update(@GetUser() user :{id: number}, @Body() dto: UpdateVendorDto){
        return this.vendorService.update(Number(user.id),dto)
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete Vendor by ID (Admin only)' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    remove(@Param('id') id: string) {
        return this.vendorService.delete(Number(id));
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Admin: Update Vendor by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateVendorDto })
    @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    updateVendor(@Param('id') id: string, @Body() dto: UpdateVendorDto) {
        return this.vendorService.update(Number(id), dto);
    }
}