import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/Order.entity';
import { Zone } from 'src/entities/Zone.entity';
import { Between, Repository } from 'typeorm';
import { EditZoneBody } from './zones.dto';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  private readonly MAX_USERS_PER_SLOT = 50;
  private readonly START_HOUR = 1;
  private readonly END_HOUR = 15; // exclusive
  private readonly SLOT_DURATION = 60 * 60 * 1000; // 1 hour in ms

  async zones() {
    return await this.zonesRepository.find();
  }

  async editZone(editZoneBody: EditZoneBody) {
    const result = await this.zonesRepository.update(
      { zone_id: editZoneBody.zone_id },
      { ...editZoneBody },
    );

    if (result.affected === 0) {
      return null;
    } else {
      return true;
    }
  }

  async remainingSlot(id: number, _date: Date) {
    const selectedDate = new Date(_date);
    const slots: number[] = [];

    for (let hour = this.START_HOUR; hour < this.END_HOUR; hour++) {
      const start = new Date(selectedDate);
      start.setHours(hour, 0, 0, 0);

      const end = new Date(selectedDate);
      end.setHours(hour + 1, 0, 0, 0);

      // Count how many orders overlap with this slot
      const count = await this.ordersRepository.count({
        where: {
          zone: { zone_id: id },
          start_time: Between(start, end),
        },
      });

      // 1 = full, 0 = available
      slots.push(count >= this.MAX_USERS_PER_SLOT ? 1 : 0);
    }

    return { table: slots };
  }

  async removeZone(id: number) {
    const result = await this.zonesRepository.delete({ zone_id: id });
    if (result.affected) {
      return true;
    } else {
      return null;
    }
  }
}
