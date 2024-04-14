import { Column, Entity } from 'typeorm';
import { Role } from '../../../shareds/enums/role.enum';
import { BaseEntity } from '../../../shareds/types/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
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
}
