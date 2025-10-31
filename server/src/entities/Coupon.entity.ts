import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './Transaction.entity';
import { User } from './User.entity';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  coupon_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  coupon_name: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.coupons, {
    nullable: true,
  })
  transaction_id: Transaction | null;

  @Column('float')
  discount: number;

  @Column({ default: false })
  isUsed: boolean;
}
