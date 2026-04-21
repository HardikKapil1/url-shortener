// src/url/url.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('url')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  shortCode!: string;

  @Column()
  originalUrl!: string;

  @Column({ nullable: true })
  expiresAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}