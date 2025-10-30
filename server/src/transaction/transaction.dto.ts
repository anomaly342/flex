import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsNotEmpty } from 'class-validator';

export class SummaryQuery {
  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsIn(['room', 'zone'])
  type: 'room' | 'zone';

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end_time: Date;
}

export class AddCouponQuery {
  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  transaction_id: number;

  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  coupon_id: number;
}

export class AddPointsQuery {
  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  transaction_id: number;

  @IsNotEmpty()
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  point_amount: number;
}
