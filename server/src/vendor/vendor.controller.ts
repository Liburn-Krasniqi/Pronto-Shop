import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiParam,
  } from '@nestjs/swagger';
import {HttpException, HttpStatus, Query, UseGuards} from '@nestjs/common';
import { Body, Controller, Post, Get, Req, Param, Put, Patch, Delete } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { CreateVendorDto, UpdateVendorDto,VendorResponseDto } from "./dto";
import { JwtGuard, JwtVendorGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from '../prisma/prisma.service';


@ApiTags('Vendors')
@Controller('vendor')
export class VendorController{
    constructor(private vendorService: VendorService,private prisma: PrismaService) {}


    @Get()
    @ApiOperation({
        summary: 'Retrieve all Vendors',
        description: 'Fetch all vendors of Pronto that have been created'
    })
    @ApiResponse({
        status: 200,
        type: VendorResponseDto,
        description: 'Successfully retrieved vendors'
    })
    findAll(){
        return this.vendorService.findAll()
    }

    @UseGuards(JwtVendorGuard)
    @Get('me')
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
    


    @Get(':id')
    @ApiOperation({ summary: 'Get Vendor by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({
        status: 200,
        description: 'Vendor found',
        type: VendorResponseDto
    })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    findById(@Param('id') id: string) {
        return this.vendorService.findById(Number(id));
    }

    @UseGuards(JwtVendorGuard)
    @Patch('me')
    @ApiOperation({ summary: 'Update Vendor by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: VendorResponseDto })
    @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    update(@GetUser() user :{id: number}, @Body() dto: UpdateVendorDto){
        return this.vendorService.update(Number(user.id),dto)
    }
    

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Vendor by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    remove(@Param('id') id: string) {
        return this.vendorService.delete(Number(id));
    }
}