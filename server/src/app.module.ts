import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieParser from 'cookie-parser';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './authentication/authentication.middleware';
import { AuthenticationModule } from './authentication/authentication.module';
import { SeederModule } from './database/seeders/seeder.module';
import { SeederService } from './database/seeders/seeder.service';
import { Order } from './entities/Order.entity';
import { QR } from './entities/QR.entity';
import { Room } from './entities/Room.entity';
import { User } from './entities/User.entity';
import { Zone } from './entities/Zone.entity';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        ENV === 'development' ? '.env.development' : '.env.production',
    }),
    TypeOrmModule.forFeature([Room, Zone, QR, Order, User]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Room, Zone, QR, Order],
      synchronize: ENV === 'development' ? true : false,
      dropSchema: ENV === 'development' ? true : false,
      ssl: true,
    }),
    AuthenticationModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), AuthMiddleware)
      .exclude('authentication/*path')
      .forRoutes('*');
  }

  async onApplicationBootstrap() {
    await this.seederService.populate();
  }
}
