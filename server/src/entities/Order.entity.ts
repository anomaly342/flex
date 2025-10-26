import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QR } from './QR.entity';
import { Room } from './Room.entity';
import { User } from './User.entity';
import { Zone } from './Zone.entity';
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, { nullable: true })
  @JoinColumn({ name: 'room_id' })
  room: Room | null;

  @ManyToOne(() => Zone, { nullable: true })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone | null;

  @ManyToOne(() => QR)
  @JoinColumn({ name: 'qr_id' })
  qr: QR;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  price: number;
}
