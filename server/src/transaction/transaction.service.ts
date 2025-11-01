import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import QRCode from 'qrcode';
import { holidays } from 'src/database/data/holidays';
import { Coupon } from 'src/entities/Coupon.entity';
import { Order } from 'src/entities/Order.entity';
import { Room } from 'src/entities/Room.entity';
import { Transaction } from 'src/entities/Transaction.entity';
import { User } from 'src/entities/User.entity';
import { Zone } from 'src/entities/Zone.entity';
import { default as Stripe, default as stripe } from 'stripe';
import { LessThan, MoreThan, Repository } from 'typeorm';
import {
  AddCouponQuery,
  AddPointsQuery,
  SummaryQuery,
} from './transaction.dto';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,

    private s3Client: S3Client,
  ) {
    this.s3Client = new S3Client({
      region: 'auto', // R2 uses 'auto'
      endpoint: process.env.R2_URL,
      credentials: {
        accessKeyId: process.env.R2_ACCESS as string,
        secretAccessKey: process.env.R2_SECRET as string,
      },
    });
  }

  async uploadFile(fileName: string, data: Buffer, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: data,
      ContentType: contentType,
      ACL: 'public-read', // optional: make it public
    });

    await this.s3Client.send(command);

    // Public URL format for R2:
    return `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`;
  }

  async summary(summaryQuery: SummaryQuery, user_id: number) {
    const { id, type, start_time, end_time } = summaryQuery;
    if (type === 'room') {
      const room = await this.roomsRepository.findOne({
        where: {
          room_id: id,
        },
      });
      if (!room) {
        return null;
      }

      const Isoverlapped = await this.ordersRepository.findOne({
        where: [
          {
            room: { room_id: id },
            start_time: LessThan(end_time),
            end_time: MoreThan(start_time),
          },
        ],
      });

      if (Isoverlapped) {
        return null;
      }

      const roomQuery = await this.roomsRepository.findOne({
        where: {
          room_id: id,
        },
      });

      if (!roomQuery) {
        return null;
      }

      const start = start_time.getHours();
      const end = end_time.getHours();
      const total_hour = end - start;

      let total_price = 1;
      let price_per_unit = 0;
      switch (roomQuery.room_type) {
        case 'small_undecorated':
          price_per_unit = 80;
          break;
        case 'small_decorated':
          price_per_unit = 90;

          break;
        case 'medium_undecorated':
          price_per_unit = 160;

          break;
        case 'medium_decorated':
          price_per_unit = 180;

          break;
        case 'large_undecorated':
          price_per_unit = 300;

          break;
        case 'large_decorated':
          price_per_unit = 330;

          break;
        default:
      }

      total_price = total_hour * price_per_unit;
      const transaction = this.transactionRepository.create();
      const discount_list: string[] = [];
      let total_discount_percentage = 0;

      const isHoliday = holidays.some((e) => {
        return (
          e.getDate() === start_time.getDate() &&
          e.getMonth() === start_time.getMonth()
        );
      });

      if (isHoliday) {
        total_discount_percentage += 0.15;
        discount_list.push('Holiday promotion');
      }

      transaction.user = { user_id: user_id };
      transaction.price_before_discount = total_price;
      transaction.price = total_price - total_price * total_discount_percentage;
      transaction.createdAt = new Date();
      transaction.status = 'pending';
      transaction.start_time = start_time;
      transaction.end_time = end_time;
      transaction.price_per_unit = price_per_unit;
      transaction.total_hour = total_hour;
      transaction.total_discount_percentage = total_discount_percentage;
      transaction.discount_list = discount_list;
      transaction.room = { room_id: id };
      const result = await this.transactionRepository.save(transaction);

      return result;
    } else {
      const zone = await this.zonesRepository.findOne({
        where: {
          zone_id: id,
        },
      });

      if (!zone) {
        return null;
      }

      const overlappingCount = await this.ordersRepository.count({
        where: {
          zone: { zone_id: id },
          start_time: LessThan(end_time),
          end_time: MoreThan(start_time),
        },
      });

      if (overlappingCount >= 50) {
        return null;
      }

      const start = start_time.getHours();
      const end = end_time.getHours();
      const total_hour = end - start;
      const price_per_unit = 40;
      const total_price = total_hour * price_per_unit;
      const transaction = this.transactionRepository.create();
      const discount_list: string[] = [];
      let total_discount_percentage = 0;

      const isHoliday = holidays.some((e) => {
        return (
          e.getDate() === start_time.getDate() &&
          e.getMonth() === start_time.getMonth()
        );
      });

      if (isHoliday) {
        total_discount_percentage += 0.15;
        discount_list.push('Holiday promotion');
      }

      transaction.user = { user_id: user_id };
      transaction.price_before_discount = total_price;
      transaction.price = total_price - total_price * total_discount_percentage;
      transaction.createdAt = new Date();
      transaction.status = 'pending';
      transaction.start_time = start_time;
      transaction.end_time = end_time;
      transaction.price_per_unit = price_per_unit;
      transaction.total_hour = total_hour;
      transaction.total_discount_percentage = total_discount_percentage;
      transaction.discount_list = discount_list;
      transaction.zone = { zone_id: id };
      const result = await this.transactionRepository.save(transaction);

      return result;
    }
  }

  async addCoupon(addCouponQuery: AddCouponQuery, user_id: number) {
    const { transaction_id, coupon_id } = addCouponQuery;

    const transaction = await this.transactionRepository.findOne({
      where: { id: transaction_id },
      relations: ['user', 'coupons'],
    });
    if (!transaction) {
      return null;
    } else if (transaction.user.user_id !== user_id) {
      return null;
    } else if (
      transaction.coupons.some((e) => Number(e.coupon_id) === Number(coupon_id))
    ) {
      return null;
    } else if (transaction.status === 'paid') {
      return null;
    }

    const coupon = await this.couponsRepository.findOne({
      where: { coupon_id: coupon_id },
      relations: ['user'],
    });

    if (!coupon) {
      return null;
    } else if (coupon.user.user_id !== user_id) {
      return null;
    } else if (coupon.isUsed === true) {
      return null;
    }

    const updateCoupon = await this.couponsRepository.update(
      { coupon_id: coupon_id },
      { transaction_id: { id: transaction_id }, isUsed: true },
    );

    transaction.discount_list.push(coupon.coupon_name);
    transaction.total_discount_percentage += coupon.discount;
    transaction.price =
      transaction.price_before_discount -
      Number(transaction.price_before_discount) *
        transaction.total_discount_percentage -
      transaction.point_reduction;

    const updateTransaction = await this.transactionRepository.save(
      transaction as Transaction,
    );

    delete transaction.user.password;
    delete transaction.user.point;
    delete transaction.user.role;
    delete transaction.user.exp_date;

    return updateTransaction;
  }

  async addPoints(addPointsQuery: AddPointsQuery, user_id: number) {
    const { transaction_id, point_amount } = addPointsQuery;

    const transaction = await this.transactionRepository.findOne({
      where: { id: transaction_id },
      relations: ['user'],
    });
    if (!transaction) {
      return null;
    } else if (transaction.user.user_id !== user_id) {
      return null;
    } else if (transaction.status === 'paid') {
      return null;
    }

    const user = await this.usersRepository.findOne({
      where: { user_id: user_id },
    });

    if (!user) {
      return null;
    }

    if (point_amount > user.point) {
      return null;
    }

    user.point = user.point - point_amount;

    const updateUser = await this.usersRepository.save(user);
    transaction.discount_list.push(`Used ${point_amount} points`);
    transaction.point_reduction = Number(
      Number(transaction.point_reduction) + point_amount,
    );
    transaction.price =
      transaction.price_before_discount -
      Number(transaction.price_before_discount) *
        transaction.total_discount_percentage -
      transaction.point_reduction;

    const updateTransaction = await this.transactionRepository.save(
      transaction as Transaction,
    );

    delete transaction.user.password;
    delete transaction.user.point;
    delete transaction.user.role;
    delete transaction.user.exp_date;

    return transaction;
  }

  async createPayment(transaction_id: number, user_id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transaction_id },
      relations: ['user'],
    });
    if (!transaction) {
      return null;
    } else if (transaction.user.user_id !== user_id) {
      return null;
    } else if (transaction.status === 'paid') {
      return null;
    }

    const stripe = new Stripe(process.env.STRIPE_KEY as string, {
      apiVersion: '2025-10-29.clover',
    });

    // Create a payment link
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['promptpay'],
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: { name: 'Room Booking' },
            unit_amount: Math.round(transaction.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: { transaction_id: transaction_id.toString() },
      success_url: `${process.env.FRONTEND_URL}/success?transaction_id=${transaction_id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    return session.url;
  }
  async getOrderId(transaction_id: number) {
    return await this.transactionRepository.findOne({
      where: { id: transaction_id },
      select: ['order_id', 'price', 'createdAt'],
    });
  }

  async subscription(user_id: number) {
    const stripe = new Stripe(process.env.STRIPE_KEY as string, {
      apiVersion: '2025-10-29.clover',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['promptpay'],
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: { name: 'Membership' },
            unit_amount: 30000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: { user_id: user_id },
      success_url: `${process.env.FRONTEND_URL}/profile`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    return session.url;
  }

  async handleWebhook(body: Buffer<ArrayBufferLike>, signature: string) {
    const endpointSecret = process.env.SECRET_ENDPOINT_KEY as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      return null;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const transaction_id = session.metadata?.transaction_id;

        if (transaction_id === undefined) {
          const user_id = session.metadata?.user_id;
          const user = await this.usersRepository.findOne({
            where: { user_id: user_id as any },
          });

          if (!user) {
            return null;
          }
          user.exp_date = new Date(
            new Date().setDate(new Date().getDate() + 31),
          );

          const updateUser = await this.usersRepository.save(user);
          return true;
        }

        const transaction = (await this.transactionRepository.findOne({
          where: {
            id: transaction_id as any,
          },
          relations: ['user', 'room', 'zone'],
        })) as Transaction;

        transaction.status = 'paid';
        await this.transactionRepository.save(transaction);

        const buffer = await QRCode.toBuffer(JSON.stringify(transaction));

        const fileName = `qr-${Date.now()}.png`;
        const url = await this.uploadFile(fileName, buffer, 'image/png');

        const start_time = transaction.start_time;
        const end_time = transaction.end_time;
        const user_id = transaction.user.user_id;
        const price = transaction.price;

        const points = Math.floor(price / 100);

        const user = await this.usersRepository.findOne({
          where: { user_id: user_id },
        });

        if (user && user.exp_date !== null) {
          if (user.exp_date > new Date()) {
            user.point = Number(Number(user.point) + points);
          } else {
            user.exp_date = null;
          }
          await this.usersRepository.save(user);
        }

        if (transaction.room) {
          const Isoverlapped = await this.ordersRepository.findOne({
            where: [
              {
                room: { room_id: transaction.room.room_id },
                start_time: LessThan(end_time),
                end_time: MoreThan(start_time),
              },
            ],
          });

          if (Isoverlapped) {
            return null;
          }

          const result = await this.ordersRepository.insert({
            user: { user_id: user_id },
            room: { room_id: transaction.room.room_id },
            start_time: start_time,
            end_time: end_time,
            price: price,
            qr_url: url,
          });
          const insertedId = result.identifiers[0].order_id;

          const updateTransaction = await this.transactionRepository.update(
            { id: transaction_id as any },
            { order_id: insertedId },
          );
          return result;
        } else {
          const result = await this.ordersRepository.insert({
            user: { user_id: user_id },
            zone: { zone_id: transaction.zone?.zone_id },
            start_time: start_time,
            end_time: end_time,
            price: price,
            qr_url: url,
          });
          const insertedId = result.identifiers[0].order_id;

          const updateTransaction = await this.transactionRepository.update(
            { id: transaction_id as any },
            { order_id: insertedId },
          );
          return result;
        }
    }
  }
}
