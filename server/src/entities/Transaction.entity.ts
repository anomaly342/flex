// transaction.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coupon } from './Coupon.entity';
import { Room } from './Room.entity';
import { User } from './User.entity';
import { Zone } from './Zone.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Partial<User>;

  @Column('float')
  price: number;

  @Column('float')
  price_before_discount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'failed';

  @Column({ nullable: true })
  paymentSessionId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Coupon, (coupon) => coupon.transaction_id)
  coupons: Array<Partial<Coupon>>;

  @Column({ type: 'timestamptz' })
  start_time: Date;

  @Column({ type: 'timestamptz' })
  end_time: Date;

  @Column('int')
  price_per_unit: number;

  @Column('int')
  total_hour: number;

  @Column('jsonb', { nullable: false })
  discount_list: string[];

  @Column('float', { default: 0.0 })
  total_discount_percentage: number;

  @Column('int', { nullable: true })
  point_reduction: number;

  @ManyToOne(() => Room, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Partial<Room> | null;

  @ManyToOne(() => Zone, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: Partial<Zone> | null;
}
