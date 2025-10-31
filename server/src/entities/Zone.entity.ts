import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Zone {
  @PrimaryGeneratedColumn()
  zone_id: number;

  @Column()
  zone_no: number;
}
