import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type RoomType = 'small' | 'medium' | 'large';
@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  capacity: number;

  @Column()
  room_no: number;

  @Column()
  room_floor: number;

  @Column({
    type: 'enum',
    enum: ['small', 'medium', 'large'],
  })
  room_type: RoomType;

  @Column({})
  room_detail: false;
}
