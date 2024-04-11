import { EntityRepository, Repository } from "typeorm";
import { Service } from "typedi";
import { User } from "../entities/user.entity";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
}
