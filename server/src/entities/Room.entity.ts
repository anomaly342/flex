import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type RoomType =
  | 'small_undecorated'
  | 'small_decorated'
  | 'medium_undecorated'
  | 'medium_decorated'
  | 'large_undecorated'
  | 'large_decorated';
@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column()
  room_no: number;

  @Column()
  room_floor: number;

  @Column({
    type: 'enum',
    enum: [
      'small_undecorated',
      'small_decorated',
      'medium_undecorated',
      'medium_decorated',
      'large_undecorated',
      'large_decorated',
    ],
  })
  room_type: RoomType;

  @Column()
  room_detail: string;

  @Column()
  room_img_url: string;
}
