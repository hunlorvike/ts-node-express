import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../shareds/enums/role.enum';
import { EntityBase } from '@/shareds/interfaces/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity implements EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ENDUSER,
  })
  role: Role;

  @Column({
    nullable: true,
    type: 'text',
  })
  refresh_token: string;

  @Column({
    default: false,
  })
  isVerified: boolean;

  @Column({
    nullable: true,
    type: 'text',
  })
  verificationEmailToken: string;

  @Column({
    default: false,
  })
  isTwoFactorEnabled: boolean;

  @Column({
    nullable: true,
    type: 'text',
  })
  twoFactorSecret: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    default: null,
    nullable: true,
  })
  deletedAt: Date;
}
