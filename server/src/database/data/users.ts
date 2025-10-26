import { UserRoleType } from 'src/entities/User.entity';

export const users: Array<{
  username: string;
  password: string;
  role: UserRoleType;
  exp_date?: Date;
  point?: number;
}> = [
  { username: 'alice', password: 'password123', role: 'user', point: 10 },
  { username: 'bob', password: 'qwerty456', role: 'member', point: 50 },
  { username: 'charlie', password: 'abc123', role: 'user', point: 20 },
  { username: 'dave', password: 'pass789', role: 'user', point: 5 },
  { username: 'eve', password: 'mypassword', role: 'member', point: 30 },
  { username: 'frank', password: 'letmein', role: 'user', point: 15 },
  { username: 'grace', password: '1234abcd', role: 'member', point: 25 },
  { username: 'heidi', password: 'passpass', role: 'user', point: 0 },
  { username: 'ivan', password: 'secret987', role: 'user', point: 40 },
  { username: 'judy', password: 'hello123', role: 'member', point: 35 },
  { username: 'kim', password: 'sunshine', role: 'user', point: 5 },
  { username: 'leo', password: 'star2025', role: 'user', point: 12 },
  { username: 'mia', password: 'flower456', role: 'member', point: 18 },
  { username: 'nick', password: 'qazwsx', role: 'user', point: 8 },
  { username: 'olivia', password: 'lucky789', role: 'user', point: 22 },
  { username: 'paul', password: 'moonlight', role: 'member', point: 45 },
  { username: 'quinn', password: 'alpha2025', role: 'user', point: 9 },
  { username: 'rachel', password: 'bravo123', role: 'member', point: 20 },
  { username: 'steve', password: 'charlie456', role: 'user', point: 0 },
  { username: 'tina', password: 'delta789', role: 'user', point: 7 },
];
