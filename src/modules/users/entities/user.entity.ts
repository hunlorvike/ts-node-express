import { Column, Entity } from "typeorm";
import { Role } from "src/shareds/enums/role.enum";
import { BaseEntity } from "src/shareds/types/base.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Column({
    unique: true,
    nullable: false,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    }
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
    default: Role.ENDUSER,
    length: 30,
  })
  role: Role;
}
