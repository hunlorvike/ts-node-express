import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../shareds/types/enums/type.enum';
import { EntityBase } from '../shareds/types/base.entity';
import { UpdateDateColumn } from 'typeorm/decorator/columns/UpdateDateColumn';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'users' })
export class User extends BaseEntity implements EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', default: () => `'${uuidv4()}'` })
  uuid: string;

  @Column({
    unique: true,
    nullable: false,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string;

  @Column({
    nullable: true,
    unique: true,
  })
  phone: string;

  @Column()
  passwordHash: string;

  @Column({
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  fullName: string;

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
  refreshToken: string;

  @Column({
    default: false,
  })
  isEmailVerified: boolean;

  @Column({
    nullable: true,
    type: 'text',
  })
  emailVerificationToken: string;

  @Column({
    default: false,
  })
  isTwoFactorAuthEnabled: boolean;

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
