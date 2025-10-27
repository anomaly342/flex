import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/Order.entity';
import { QR } from 'src/entities/QR.entity';
import { Room } from 'src/entities/Room.entity';
import { User } from 'src/entities/User.entity';
import { Zone } from 'src/entities/Zone.entity';
import { Repository } from 'typeorm';
import { orders } from '../data/orders';
import { qrs } from '../data/qrs';
import { rooms } from '../data/rooms';
import { users } from '../data/users';
import { zones } from '../data/zones';
@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,

    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(QR)
    private qrsRepository: Repository<QR>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async populate() {
    await this.roomsRepository.save(rooms, { chunk: 100 });
    await this.zonesRepository.save(zones, { chunk: 100 });

    users.map(async (e) => {
      const user = this.usersRepository.create(e);
      await this.usersRepository.save(user);
    });

    await this.qrsRepository.save(qrs, { chunk: 100 });
    await this.ordersRepository.save(orders, { chunk: 100 });
  }
}
