import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import express from 'express';
import { EditRoomBody, RemainingQueries, RoomQueries } from './rooms.dto';
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

  @Delete(':id')
  @HttpCode(200)
  async deleteRoom(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: express.Request,
  ) {
    const role = request.user.role;
    if (role !== 'admin') {
      throw new UnauthorizedException();
    }
    const result = await this.roomsService.removeRoom(id);

    if (result) {
      return 'deleted';
    } else {
      throw new NotFoundException();
    }
  }
}
