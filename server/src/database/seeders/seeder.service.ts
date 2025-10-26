import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room.entity';
import { Zone } from 'src/entities/Zone.entity';
import { Repository } from 'typeorm';
import { rooms } from '../data/rooms';
import { zones } from '../data/zones';
@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,
  ) {}
  async populate() {
    this.roomsRepository.save(rooms, { chunk: 100 });
    this.zonesRepository.save(zones, { chunk: 100 });
  }
}
