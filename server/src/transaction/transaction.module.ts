import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/Coupon.entity';
import { Order } from 'src/entities/Order.entity';
import { Room } from 'src/entities/Room.entity';
import { Transaction } from 'src/entities/Transaction.entity';
import { User } from 'src/entities/User.entity';
import { Zone } from 'src/entities/Zone.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Order, Transaction, Coupon, User, Zone]),
  ],
  providers: [TransactionService, S3Client],
  controllers: [TransactionController],
})
export class TransactionModule {}
