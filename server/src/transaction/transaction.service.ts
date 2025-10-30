import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { holidays } from 'src/database/data/holidays';
import { Coupon } from 'src/entities/Coupon.entity';
import { Order } from 'src/entities/Order.entity';
import { Room } from 'src/entities/Room.entity';
import { Transaction } from 'src/entities/Transaction.entity';
import { User } from 'src/entities/User.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import {
  AddCouponQuery,
  AddPointsQuery,
  SummaryQuery,
} from './transaction.dto';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async summary(summaryQuery: SummaryQuery, user_id: number) {
    const { id, type, start_time, end_time } = summaryQuery;
    if (type === 'room') {
      const room = await this.roomsRepository.findOne({
        where: {
          room_id: id,
        },
      });
      if (!room) {
        return null;
      }

      const Isoverlapped = await this.ordersRepository.findOne({
        where: [
          {
            room: { room_id: id },
            start_time: LessThan(end_time),
            end_time: MoreThan(start_time),
          },
        ],
      });

      if (Isoverlapped) {
        return null;
      }

      const roomQuery = await this.roomsRepository.findOne({
        where: {
          room_id: id,
        },
      });

      if (!roomQuery) {
        return null;
      }

      const start = start_time.getHours();
      const end = end_time.getHours();
      const total_hour = end - start;

      let total_price = 1;
      let price_per_unit = 0;
      switch (roomQuery.room_type) {
        case 'small_undecorated':
          price_per_unit = 80;
          break;
        case 'small_decorated':
          price_per_unit = 90;

          break;
        case 'medium_undecorated':
          price_per_unit = 160;

          break;
        case 'medium_decorated':
          price_per_unit = 180;

          break;
        case 'large_undecorated':
          price_per_unit = 300;

          break;
        case 'large_decorated':
          price_per_unit = 330;

          break;
        default:
      }

      total_price = total_hour * price_per_unit;
      const transaction = this.transactionRepository.create();
      const discount_list: string[] = [];
      let total_discount_percentage = 0;

      const isHoliday = holidays.some((e) => {
        console.log(e.toUTCString());
        return (
          e.getDate() === start_time.getDate() &&
          e.getMonth() === start_time.getMonth()
        );
      });

      if (isHoliday) {
        total_discount_percentage += 0.15;
        discount_list.push('Holiday promotion');
      }

      transaction.user = { user_id: user_id };
      transaction.price_before_discount = total_price;
      transaction.price = total_price - total_price * total_discount_percentage;
      transaction.createdAt = new Date();
      transaction.status = 'pending';
      transaction.start_time = start_time;
      transaction.end_time = end_time;
      transaction.price_per_unit = price_per_unit;
      transaction.total_hour = total_hour;
      transaction.total_discount_percentage = total_discount_percentage;
      transaction.discount_list = discount_list;
      transaction.room_id = id;
      const result = await this.transactionRepository.save(transaction);

      return result;
    } else {
      return 1;
    }
  }

  async addCoupon(addCouponQuery: AddCouponQuery, user_id: number) {
    const { transaction_id, coupon_id } = addCouponQuery;

    const transaction = await this.transactionRepository.findOne({
      where: { id: transaction_id },
      relations: ['user', 'coupons'],
    });
    if (!transaction) {
      return null;
    } else if (transaction.user.user_id !== user_id) {
      return null;
    } else if (
      transaction.coupons.some((e) => Number(e.coupon_id) === Number(coupon_id))
    ) {
      return null;
    }

    const coupon = await this.couponsRepository.findOne({
      where: { coupon_id: coupon_id },
      relations: ['user'],
    });

    if (!coupon) {
      return null;
    } else if (coupon.user.user_id !== user_id) {
      return null;
    } else if (coupon.isUsed === true) {
      return null;
    }

    const updateCoupon = await this.couponsRepository.update(
      { coupon_id: coupon_id },
      { transaction_id: { id: transaction_id }, isUsed: true },
    );

    transaction.discount_list.push(coupon.coupon_name);
    transaction.total_discount_percentage += coupon.discount;
    transaction.price =
      transaction.price_before_discount -
      Number(transaction.price_before_discount) *
        transaction.total_discount_percentage -
      transaction.point_reduction;

    const updateTransaction = await this.transactionRepository.save(
      transaction as Transaction,
    );

    delete transaction.user.password;
    delete transaction.user.point;
    delete transaction.user.role;
    delete transaction.user.exp_date;

    return updateTransaction;
  }

  async addPoints(addPointsQuery: AddPointsQuery, user_id: number) {
    const { transaction_id, point_amount } = addPointsQuery;

    const transaction = await this.transactionRepository.findOne({
      where: { id: transaction_id },
      relations: ['user'],
    });
    if (!transaction) {
      return null;
    } else if (transaction.user.user_id !== user_id) {
      return null;
    }

    const user = await this.usersRepository.findOne({
      where: { user_id: user_id },
    });

    if (!user) {
      return null;
    }

    if (point_amount > user.point) {
      return null;
    }

    user.point = user.point - point_amount;

    const updateUser = await this.usersRepository.save(user);

    transaction.discount_list.push(`Used ${point_amount} points`);
    transaction.point_reduction = Number(
      Number(transaction.point_reduction) + point_amount,
    );
    transaction.price =
      transaction.price_before_discount -
      Number(transaction.price_before_discount) *
        transaction.total_discount_percentage -
      transaction.point_reduction;

    const updateTransaction = await this.transactionRepository.save(
      transaction as Transaction,
    );

    delete transaction.user.password;
    delete transaction.user.point;
    delete transaction.user.role;
    delete transaction.user.exp_date;

    return transaction;
  }
}
