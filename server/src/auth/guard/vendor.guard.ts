import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VendorGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Check if the user is a vendor
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: user.id },
      select: { id: true }
    });

    if (!vendor) {
      throw new UnauthorizedException('Vendor access required');
    }

    return true;
  }
} 