import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { UserDto } from './authentication.dto';
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(userDto: UserDto) {
    const isExisted = await this.usersRepository.findOne({
      where: { username: userDto.username },
    });

    if (isExisted) {
      return null;
    }
    const user = this.usersRepository.create();
    user.username = userDto.username;
    user.password = userDto.password;
    await this.usersRepository.save(user);

    return { id: user.user_id, username: user.username };
  }

  async login(userDto: UserDto) {
    const user = await this.usersRepository.findOne({
      where: { username: userDto.username },
    });

    if (!user) {
      return null;
    }

    try {
      if (
        await argon2.verify(user.password, userDto.password, {
          secret: Buffer.from(process.env.SALT as string),
        })
      ) {
        return { id: user.user_id, username: user.username };
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
}
