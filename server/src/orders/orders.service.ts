import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/Order.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async orders(user_id: number, page: number) {
    const pageSize = 7;
    const result = await this.ordersRepository.find({
      where: { user: { user_id: user_id } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return result;
  }

  async allOrders() {
    return await this.ordersRepository.find({
      select: ['order_id', 'start_time', 'end_time', 'price', 'room', 'zone'],
      relations: ['room', 'zone'],
    });
  }

  async order(id: number, user_id: number) {
    const order = await this.ordersRepository.findOne({
      where: { order_id: id, user: { user_id: user_id } },
    });

    return order;
  }

  async upcoming(user_id: number) {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const result = await this.ordersRepository.find({
      where: {
        user: { user_id },
        start_time: Between(now, sevenDaysLater),
      },
      order: {
        start_time: 'ASC', // optional: order by start_time
      },
    });

    return result;
  }
}
