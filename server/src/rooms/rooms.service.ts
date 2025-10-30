import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/Order.entity';
import { Room } from 'src/entities/Room.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { RoomOrder, RoomQueries } from './rooms.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async roomLayout(queries: RoomQueries) {
    const { date, floor } = queries;
    const _date = new Date(date).toISOString().split('T')[0];

    const query = await this.roomsRepository
      .createQueryBuilder('r')
      .leftJoin(
        (qb) => {
          return qb
            .select('r2.room_id', 'room_id')
            .addSelect(
              'SUM(EXTRACT(EPOCH FROM (o.end_time - o.start_time)) / 3600)',
              'booked_hours',
            )
            .from('room', 'r2')
            .innerJoin('order', 'o', 'r2.room_id = o.room_id')
            .where('o.start_time::date = :_date', { _date })
            .andWhere('r2.room_floor = :floor', { floor })
            .groupBy('r2.room_id');
        },
        'b',
        'r.room_id = b.room_id',
      )
      .select('r.room_id', 'room_id')
      .addSelect('COALESCE(14 - b.booked_hours, 14)', 'remaining_timeslot')
      .where('r.room_floor = :floor', { floor })
      .orderBy('r.room_id', 'ASC');

    const result = await query.getRawMany();
    return result;
  }
  async roomInfo(id: number) {
    const room = await this.roomsRepository.findOne({
      where: {
        room_id: id,
      },
    });

    if (!room) {
      return null;
    }

    return room;
  }

  async remainingSlot(id: number, _date: Date) {
    if (this.roomInfo(id) === null) {
      return null;
    }

    const result = await this.ordersRepository
      .createQueryBuilder('o')
      .select(['o.start_time', 'o.end_time'])
      .where('o.room_id = :roomId', { roomId: id })
      .andWhere('o.start_time::date = :_date', { _date: _date }) // cast to date
      .getMany();

    if (result.length === 0) {
      return { table: Array(14).fill(0) };
    }

    const slots = Array(14).fill(0);

    result.forEach(({ start_time, end_time }) => {
      const startHour = start_time.getUTCHours();
      const endHour = end_time.getUTCHours();

      let startIndex = startHour - 1;
      let endIndex = endHour - 1;

      for (let i = startIndex; i < endIndex; i++) {
        slots[i] = 1;
      }
    });

    return { table: slots };
  }
  async roomOrder(roomOrder: RoomOrder, room_id: number, user_id: number) {
    const { start_time, end_time } = roomOrder;
    const Isoverlapped = await this.ordersRepository.findOne({
      where: [
        {
          room: { room_id },
          start_time: LessThan(end_time),
          end_time: MoreThan(start_time),
        },
      ],
    });

    if (Isoverlapped) {
      return null;
    }

    const result = await this.ordersRepository.insert({
      user: { user_id: user_id },
      room: { room_id: room_id },
      start_time: start_time,
      end_time: end_time,
      price: 5000,
      qr_url: 'something',
    });

    return result;
  }
}
