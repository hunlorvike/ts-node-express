import { Service } from "typedi";
import { Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/user.entity";
import { PagedResponseData, PagerInfo, ResponseData } from "src/shareds/types/response.type";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

@Service()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async findAll(pageNumber: number, pageSize: number): Promise<PagedResponseData<User[]>> {
        try {
            const totalRecords = await this.userRepository.count({ where: { deletedAt: null } });

            const totalPage = Math.ceil(totalRecords / pageSize);
            const skip = (pageNumber - 1) * pageSize;

            const users = await this.userRepository.find({
                where: { deletedAt: null },
                take: pageSize,
                skip: skip,
            });

            const pagerInfo: PagerInfo = {
                PageNumber: pageNumber,
                PageSize: pageSize,
                FirstPage: 1,
                LastPage: totalPage,
                TotalPage: totalPage,
                TotalRecords: totalRecords,
                NextPage: pageNumber < totalPage ? pageNumber + 1 : null,
                PreviousPage: pageNumber > 1 ? pageNumber - 1 : null,
                ShouldShow: totalRecords > pageSize,
            };

            const responseData: PagedResponseData<User[]> = {
                Data: users,
                Succeed: true,
                ErrorList: [],
                Message: "Users retrieved successfully",
                PagerInfo: pagerInfo,
            };

            return responseData;
        } catch (error) {
            return {
                Data: [],
                Succeed: false,
                ErrorList: [error as string],
                Message: "Failed to retrieve users",
                PagerInfo: null,
            };
        }
    }
    async findById(id: number): Promise<ResponseData<User | undefined>> {
        try {
            const user = await this.userRepository.findOne({ where: { id, deletedAt: null } });
            if (user) {
                return {
                    Data: user,
                    Succeed: true,
                    ErrorList: [],
                    Message: "User found",
                };
            } else {
                return {
                    Data: undefined,
                    Succeed: false,
                    ErrorList: ["User not found"],
                    Message: "User not found",
                };
            }
        } catch (error) {
            return {
                Data: undefined,
                Succeed: false,
                ErrorList: [error as string],
                Message: "Failed to find user",
            };
        }
    }

    async create(userData: CreateUserDto): Promise<ResponseData<User>> {
        try {
            const newUser = this.userRepository.create(userData);
            const savedUser = await this.userRepository.save(newUser);
            return {
                Data: savedUser,
                Succeed: true,
                ErrorList: [],
                Message: "User created successfully",
            };
        } catch (error) {
            return {
                Data: undefined,
                Succeed: false,
                ErrorList: [error as string],
                Message: "Failed to create user",
            };
        }
    }
    
    async update(id: number, updateUser: UpdateUserDto): Promise<ResponseData<UpdateResult>> {
        try {
            const updateResult = await this.userRepository.update(id, updateUser);
            return {
                Data: updateResult,
                Succeed: true,
                ErrorList: [],
                Message: "User updated successfully",
            };
        } catch (error) {
            return {
                Data: undefined,
                Succeed: false,
                ErrorList: [error as string],
                Message: "Failed to update user",
            };
        }
    }
    async softDelete(id: number): Promise<ResponseData<void>> {
        try {
            await this.userRepository.update(id, { deletedAt: new Date() });
            return {
                Data: undefined,
                Succeed: true,
                ErrorList: [],
                Message: "User soft deleted successfully",
            };
        } catch (error) {
            return {
                Data: undefined,
                Succeed: false,
                ErrorList: [error as string],
                Message: "Failed to soft delete user",
            };
        }
    }

    async recover(id: number): Promise<ResponseData<UpdateResult>> {
        try {
            const updateResult = await this.userRepository.update(id, { deletedAt: null });
            return {
                Data: updateResult,
                Succeed: true,
                ErrorList: [],
                Message: "User recovered successfully",
            };
        } catch (error) {
            return {
                Data: undefined,
                Succeed: false,
                ErrorList: [error as string],
                Message: "Failed to recover user",
            };
        }
    }
}
