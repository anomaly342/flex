import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/Order.entity';
import { Zone } from 'src/entities/Zone.entity';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Zone, Order])],
  controllers: [ZonesController],
  providers: [ZonesService],
})
export class ZonesModule {}
