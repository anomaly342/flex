import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export type RoomID = number;

export class layoutQuery {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}

export class EditZoneBody {
  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  zone_id: number;

  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  zone_no: number;
}
