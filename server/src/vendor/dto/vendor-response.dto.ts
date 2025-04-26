import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VendorAddressDto } from './vendorAddress.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class VendorResponseDto {
  @ApiProperty({ example: '1', description: 'Unique identifier of the vendor' })
  id: number;

  @ApiProperty({ example: 'vendor@example.com', description: 'Email address of the vendor' })
  email: string;

  @ApiProperty({ example: 'Tech Solutions Ltd.', description: 'Name of the business' })
  businessName: string;

  @ApiProperty({ example: 'Jane Doe', description: 'Name of the vendor owner/contact' })
  name: string;

  @ApiProperty({ example: '+1-234-567-8901', description: 'Vendor contact phone number' })
  phone_number: string;

  @ApiProperty({ 
    type: VendorAddressDto,
    description: 'Array of vendor addresses',
    example: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    }
  })
  addresses?: VendorAddressDto;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z', description: 'Date when the vendor was created' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z', description: 'Date when the vendor was last updated' })
  updatedAt: Date;
}
