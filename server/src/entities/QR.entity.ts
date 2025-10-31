import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class QR {
  @PrimaryGeneratedColumn()
  qr_id: number;

  @Column()
  qr_img_url: string;
}
