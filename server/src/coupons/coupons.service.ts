import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/Coupon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
  ) {}

  async coupons(user_id: number) {
    const result = await this.couponsRepository.find({
      where: { user: { user_id: user_id } },
    });

    return result;
  }
}
