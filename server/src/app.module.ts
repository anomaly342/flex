import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieParser from 'cookie-parser';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './authentication/authentication.middleware';
import { AuthenticationModule } from './authentication/authentication.module';
import { CouponsModule } from './coupons/coupons.module';
import { SeederModule } from './database/seeders/seeder.module';
import { SeederService } from './database/seeders/seeder.service';
import { Coupon } from './entities/Coupon.entity';
import { Order } from './entities/Order.entity';
import { QR } from './entities/QR.entity';
import { Room } from './entities/Room.entity';
import { Transaction } from './entities/Transaction.entity';
import { User } from './entities/User.entity';
import { Zone } from './entities/Zone.entity';
import { OrdersModule } from './orders/orders.module';
import { RoomsModule } from './rooms/rooms.module';
import { TransactionModule } from './transaction/transaction.module';
import { ZonesModule } from './zones/zones.module';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        ENV === 'development' ? '.env.development' : '.env.production',
    }),
    TypeOrmModule.forFeature([Room, Zone, QR, Order, User, Coupon]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Room, Zone, QR, Order, Transaction, Coupon],
      synchronize: process.env.SYNCHONIZE === 'yes' ? true : false,
      dropSchema: ENV === 'development' ? true : false,
      ssl: true,
    }),

    AuthenticationModule,
    SeederModule,
    RoomsModule,
    TransactionModule,
    CouponsModule,
    ZonesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), AuthMiddleware)
      .exclude(
        { path: 'authentication/login', method: RequestMethod.ALL },
        { path: 'authentication/register', method: RequestMethod.ALL },
        { path: 'transaction/stripe', method: RequestMethod.ALL }, // exclude Stripe webhook
      )
      .forRoutes('*');
  }

  async onApplicationBootstrap() {
    if (process.env.POPULATE === 'yes') {
      await this.seederService.populate();
    }
  }
}
