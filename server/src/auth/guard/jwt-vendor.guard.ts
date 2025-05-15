import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtVendorGuard extends AuthGuard('jwt-vendor') {
    constructor(){
        super();
    }
}
