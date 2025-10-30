import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export type RoomID = number;
type RoomType =
  | 'small_undecorated'
  | 'small_decorated'
  | 'medium_undecorated'
  | 'medium_decorated'
  | 'large_undecorated'
  | 'large_decorated';

export class RemainingQueries {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}

export class RoomQueries {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  floor: number;
}

export class RoomOrder {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end_time: Date;
}

export class EditRoomBody {
  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  room_id: number;

  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  room_no: number;

  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  room_floor: number;

  @IsNotEmpty()
  @IsString()
  room_type: RoomType;

  @IsNotEmpty()
  @IsString()
  room_detail: string;

  @IsNotEmpty()
  @IsString()
  room_img_url: string;
}
