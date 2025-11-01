import * as common from '@nestjs/common';
import express from 'express';
import { RoomsOrderPipe } from 'src/rooms/rooms.pipe';
import {
  AddCouponQuery,
  AddPointsQuery,
  SummaryQuery,
} from './transaction.dto';
import { TransactionService } from './transaction.service';

@common.Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @common.Post('summary')
  async summary(
    @common.Body(RoomsOrderPipe) summaryQuery: SummaryQuery,
    @common.Req() request: express.Request,
  ) {
    const user_id = request.user.id;
    const result = await this.transactionService.summary(summaryQuery, user_id);

    if (result) {
      return result;
    } else {
      throw new common.ConflictException();
    }
  }

  @common.Post('addCoupon')
  async addCoupon(
    @common.Body() addCouponQuery: AddCouponQuery,
    @common.Req() request: express.Request,
  ) {
    const user_id = request.user.id;
    const result = await this.transactionService.addCoupon(
      addCouponQuery,
      user_id,
    );

    if (result) {
      return result;
    } else {
      throw new common.ConflictException();
    }
  }

  @common.Post('addPoints')
  async addPoints(
    @common.Body() addPointsQuery: AddPointsQuery,
    @common.Req() request: express.Request,
  ) {
    const user_id = request.user.id;
    const result = await this.transactionService.addPoints(
      addPointsQuery,
      user_id,
    );

    if (result) {
      return result;
    } else {
      throw new common.ConflictException();
    }
  }

  @common.Get('payment/:transaction_id')
  async createPayment(
    @common.Param('transaction_id', common.ParseIntPipe) transaction_id: number,
    @common.Req() request: express.Request,
  ) {
    const user_id = request.user.id;
    const result = await this.transactionService.createPayment(
      transaction_id,
      user_id,
    );

    if (result) {
      return result;
    } else {
      throw new common.UnauthorizedException();
    }
  }

  @common.Post('stripe')
  async handleWebhook(
    @common.Req() request: common.RawBodyRequest<Request>,
    @common.Headers('stripe-signature') signature: string,
    @common.Res() response: express.Response,
  ) {
    const result = await this.transactionService.handleWebhook(
      request.rawBody as Buffer<ArrayBufferLike>,
      signature,
    );
    if (result) {
      return response.sendStatus(200);
    } else {
      return response.sendStatus(404);
    }
  }

  @common.Get('subscription')
  async subscription(@common.Req() request: express.Request) {
    const user_id = request.user.id;
    const result = await this.transactionService.subscription(user_id);

    return result;
  }

  @common.Get(':id/orderId')
  async getOrderId(@common.Param('id') id: number) {
    const result = await this.transactionService.getOrderId(id);

    return result;
  }
}
