import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/Order.entity';
import { Room } from 'src/entities/Room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Order])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
