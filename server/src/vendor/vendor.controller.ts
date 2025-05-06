import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiParam,
  } from '@nestjs/swagger';
import {Query} from '@nestjs/common';
import { Body, Controller, Post, Get, Req, Param, Put, Patch, Delete } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { CreateVendorDto, UpdateVendorDto,VendorResponseDto } from "./dto";


@ApiTags('Vendors')
@Controller('vendor')
export class VendorController{
    constructor(private vendorService: VendorService) {}


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
    
    // @Post('signup')
    // @ApiOperation({ summary: 'Sign up a new Vendor' })
    // @ApiBody({ type: VendorResponseDto })
    // @ApiResponse({
    //     status: 201,
    //     description: 'Vendor created successfully' })
    // @ApiResponse({
    //     status: 400,
    //     description: 'Invalid vendor data',
    //   })
    // create(@Body() dto: CreateVendorDto) {
    //     return this.vendorService.signup(dto);
    // }

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


    @Patch(':id')
    @ApiOperation({ summary: 'Update Vendor by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: VendorResponseDto })
    @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    update(@Param('id') id: number, @Body() dto: UpdateVendorDto){
        return this.vendorService.update(Number(id),dto)
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