import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import express from 'express';
import { sign } from 'jsonwebtoken';
import { UserDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() userDto: UserDto, @Res() response: express.Response) {
    const result = await this.authenticationService.register(userDto);

    if (result) {
      response.cookie(
        'jwt',
        sign(result, process.env.SALT as string, { expiresIn: '7d' }),
        { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, httpOnly: true },
      );
      return response.status(200).send();
    } else {
      throw new ConflictException();
    }
  }

  @Post('login')
  async login(@Body() userDto: UserDto, @Res() response: express.Response) {
    const result = await this.authenticationService.login(userDto);

    if (result) {
      response.cookie(
        'jwt',
        sign(result, process.env.SALT as string, { expiresIn: '7d' }),
        {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        },
      );
      return response.status(200).send();
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get('logout')
  async logout(@Res() response: express.Response) {
    return response.clearCookie('jwt').sendStatus(200);
  }

  @Get('userInfo')
  async userInfo(@Req() request: express.Request) {
    const user_id = request.user.id;
    const result = await this.authenticationService.userInfo(user_id);

    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }
}
