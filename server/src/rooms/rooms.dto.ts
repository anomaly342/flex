import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export type RoomID = number;

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
