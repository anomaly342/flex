import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import express from 'express';
import {
  EditRoomBody,
  RemainingQueries,
  RoomOrder,
  RoomQueries,
} from './rooms.dto';
import { RoomsOrderPipe } from './rooms.pipe';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async rooms() {
    const result = await this.roomsService.rooms();
    return result;
  }

  @Put()
  async editRoom(
    @Body() editRoomBody: EditRoomBody,
    @Res() response: express.Response,
    @Req() request: express.Request,
  ) {
    const role = request.user.role;
    if (role !== 'admin') {
      throw new UnauthorizedException();
    }
    const result = await this.roomsService.editRoom(editRoomBody);

    if (result) {
      response.sendStatus(200);
    } else {
      throw new NotFoundException();
    }
  }

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

  @Get(':id/remaining')
  async remainingSlot(
    @Param('id', ParseIntPipe) id: number,
    @Body() date: RemainingQueries,
  ) {
    const _date = date.date;
    const result = await this.roomsService.remainingSlot(id, _date);

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
