import { IsNotEmpty, Matches } from 'class-validator';
export class UserDto {
  @IsNotEmpty()
  @Matches(/^[0-9a-zA-Z\-_]{4,14}$/, {
    message:
      'Username must only contain alphabets, numbers, - and _, and be between 4-14',
  })
  username: string;

  @IsNotEmpty()
  @Matches(/^[0-9a-zA-Z\-_\(\)]{4,14}$/, {
    message:
      'Password must only contain alphabets, numbers, -, _ and (), and be between 4-14',
  })
  password: string;
}
