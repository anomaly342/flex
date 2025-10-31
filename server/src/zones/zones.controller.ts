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
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import express from 'express';
import { RemainingQueries } from 'src/rooms/rooms.dto';
import { EditZoneBody } from './zones.dto';
import { ZonesService } from './zones.service';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  async zones() {
    const result = await this.zonesService.zones();

    return result;
  }

  @Get(':id')
  async zone(@Param('id', ParseIntPipe) id: number) {
    const result = await this.zonesService.zone(id);
    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  @Put()
  async editZone(
    @Body() editZoneBody: EditZoneBody,
    @Res() response: express.Response,
    @Req() request: express.Request,
  ) {
    const role = request.user.role;
    if (role !== 'admin') {
      throw new UnauthorizedException();
    }
    const result = await this.zonesService.editZone(editZoneBody);

    if (result) {
      response.sendStatus(200);
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
    const result = await this.zonesService.remainingSlot(id, _date);

    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteZone(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: express.Request,
  ) {
    const role = request.user.role;
    if (role !== 'admin') {
      throw new UnauthorizedException();
    }
    const result = await this.zonesService.removeZone(id);

    if (result) {
      return 'deleted';
    } else {
      throw new NotFoundException();
    }
  }
}
