import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import express from 'express';
import { RoomOrder, RoomQueries } from './rooms.dto';
import { RoomsOrderPipe } from './rooms.pipe';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('search')
  async roomLayout(@Query() queries: RoomQueries) {
    const result = await this.roomsService.roomLayout(queries);

    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  async roomInfo(@Param('id', ParseIntPipe) id: number) {
    const result = await this.roomsService.roomInfo(id);

    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  @Post(':id')
  async roomOrder(
    @Param('id', ParseIntPipe) room_id: number,
    @Body(RoomsOrderPipe) roomOrder: RoomOrder,
    @Res() response: express.Response,
    @Req() request: express.Request,
  ) {
    const user_id = request.user.id;
    const result = await this.roomsService.roomOrder(
      roomOrder,
      room_id,
      user_id,
    );

    if (result) {
      return response.sendStatus(200);
    } else {
      throw new ConflictException();
    }
  }
}
