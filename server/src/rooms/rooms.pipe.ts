import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { RoomOrder } from './rooms.dto';

@Injectable()
export class RoomsOrderPipe implements PipeTransform {
  transform(value: RoomOrder, metadata: ArgumentMetadata) {
    value.start_time = new Date(value.start_time);
    value.end_time = new Date(value.end_time);
    const reg = /^\d{4}-\d{2}-\d{2}T\d{2}:00:00.000Z$/;

    if (
      !(
        value.start_time.toISOString().match(reg) &&
        value.end_time.toISOString().match(reg)
      )
    ) {
      throw new BadRequestException('Invalid format');
    }

    if (value.start_time.toDateString() !== value.end_time.toDateString()) {
      throw new BadRequestException('Duration must be within the same day');
    }

    if (value.start_time.getUTCHours() < 1) {
      throw new BadRequestException('Cannot order before 8 AM.');
    }
    if (value.start_time < new Date()) {
      throw new BadRequestException('Cannot order on the day before today.');
    }

    if (value.start_time.getUTCHours() >= value.end_time.getUTCHours()) {
      throw new BadRequestException('Start time cannot be after the end time');
    }

    return value;
  }
}
