import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Url } from '../url/url.entity';
@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Url, { onDelete: 'CASCADE' })
  url!: Url;

  @Column()
  ipAddress!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
