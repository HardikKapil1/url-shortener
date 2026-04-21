// click.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('clicks')
export class Click {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  urlId!: string;

  @Column({ nullable: true })
  ipAddress!: string;

  @Column({ nullable: true })
  country!: string;

  @CreateDateColumn()
  clickedAt!: Date;
}