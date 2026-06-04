import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  shortCode!: string;

  @Column()
  originalUrl!: string;

  @Column({ default: 0 })
  clickCount!: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'boolean', default: null })
  isActive!: boolean | null;
}
