import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import express from 'express';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async orders(
    @Req() request: express.Request,
    @Body('page', ParseIntPipe) page: number,
  ) {
    const user_id = request.user.id;
    const result = await this.ordersService.orders(user_id, page);

    return result;
  }

  @Get('all')
  async allOrders(@Req() request: express.Request) {
    const role = request.user.role;
    if (role !== 'admin') {
      throw new UnauthorizedException();
    }

    const result = await this.ordersService.allOrders();

    return result;
  }
  @Get(':id')
  async order(
    @Req() request: express.Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user_id = request.user.id;
    const result = await this.ordersService.order(id, user_id);

    if (result) {
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }
}
