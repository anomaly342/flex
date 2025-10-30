import { Body, ConflictException, Controller, Post, Req } from '@nestjs/common';
import express from 'express';
import { RoomsOrderPipe } from 'src/rooms/rooms.pipe';
import {
  AddCouponQuery,
  AddPointsQuery,
  SummaryQuery,
} from './transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('summary')
  async summary(
    @Body(RoomsOrderPipe) summaryQuery: SummaryQuery,
    @Req() request: express.Request,
  ) {
    const user_id = request.user.id;
    const result = await this.transactionService.summary(summaryQuery, user_id);

    if (result) {
      return result;
    } else {
      throw new ConflictException();
    }
  }

  @Post('addCoupon')
  async addCoupon(
    @Body() addCouponQuery: AddCouponQuery,
    @Req() request: express.Request,
  ) {
    const user_id = request.user.id;
    const result = await this.transactionService.addCoupon(
      addCouponQuery,
      user_id,
    );

    if (result) {
      return result;
    } else {
      throw new ConflictException();
    }
  }

  @Post('addPoints')
  async addPoints(
    @Body() addPointsQuery: AddPointsQuery,
    @Req() request: express.Request,
  ) {
    const user_id = request.user.id;
    const result = await this.transactionService.addPoints(
      addPointsQuery,
      user_id,
    );

    if (result) {
      return result;
    } else {
      throw new ConflictException();
    }
  }
}
