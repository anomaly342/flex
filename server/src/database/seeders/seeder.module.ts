import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/Coupon.entity';
import { Order } from 'src/entities/Order.entity';
import { QR } from 'src/entities/QR.entity';
import { Room } from 'src/entities/Room.entity';
import { User } from 'src/entities/User.entity';
import { Zone } from 'src/entities/Zone.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Zone, QR, Order, User, Coupon])],
  providers: [SeederService],
  controllers: [],
})
export class SeederModule {}
