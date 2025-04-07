import { Body, Controller, Post, Get, Req, Param, Put, Patch, Delete } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { CreateVendorDto, UpdateVendorDto } from "./dto";

@Controller('vendor')
export class VendorController{
    constructor(private vendorService: VendorService) {}


    @Get()
    findAll(){
        return this.vendorService.findAll()
    }
    
    @Post('signup')
    create(@Body() dto: CreateVendorDto){
        return this.vendorService.signup(dto);
    }

    @Get(':id')
    findById(@Param('id') id){
        return this.vendorService.findById(Number(id))
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateVendorDto){
        return this.vendorService.update(Number(id),dto)
    }

    @Delete(':id')
    remove(@Param('id') id: number ){
        return this.vendorService.delete(Number(id))
    }
}