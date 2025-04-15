import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'USA', description: 'Country where the vendor is located' })
  country: string;

  @ApiProperty({ example: 'New York', description: 'City where the vendor is located' })
  city: string;

  @ApiProperty({ example: '10001', description: 'Postal code of the vendor’s address' })
  zipCode: string;

  @ApiProperty({ example: '123 Main St', description: 'Street address of the vendor' })
  street: string;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z', description: 'Date when the vendor was created' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-08T12:00:00.000Z', description: 'Date when the vendor was last updated' })
  updatedAt: Date;
}
