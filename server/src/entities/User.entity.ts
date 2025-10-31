import * as argon2 from 'argon2';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type UserRoleType = 'admin' | 'user' | 'member';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'member'],
    default: 'user',
  })
  role: UserRoleType;

  @Column({ type: 'timestamp with time zone', nullable: true })
  exp_date: Date | null;

  @Column({ type: 'int8', default: 0 })
  point: number;

  @BeforeInsert()
  async generateHashedPassword() {
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2d,
      secret: Buffer.from(process.env.SALT as string),
    });
  }
}
