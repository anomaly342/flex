import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room.entity';
import { Zone } from 'src/entities/Zone.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Zone])],
  providers: [SeederService],
  controllers: [],
})
export class SeederModule {}
