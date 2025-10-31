import { Controller, Get, Req } from '@nestjs/common';
import express from 'express';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async coupons(@Req() request: express.Request) {
    const user_id = request.user.id;
    const result = await this.couponsService.coupons(user_id);

    return result;
  }
}
