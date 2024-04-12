import { Service } from "typedi";
import { Repository, UpdateResult, getManager } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/user.entity";
import { PagedResponseData, PagerInfo, ResponseData } from "src/shareds/types/response.type";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { Messages } from "../../../shareds/consts/messages";
import { UserRepository } from "../repositories/user.repository";
import { Container } from 'typeorm-typedi-extensions';

@Service()
export class UserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = Container.get(UserRepository);
    }

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
                StatusCode: 200,
                Succeed: true,
                ErrorList: [],
                Message: '',
                PagerInfo: pagerInfo,
            };

            return responseData;
        } catch (error) {
            return {
                Data: [],
                StatusCode: 500,
                Succeed: false,
                ErrorList: [error as string],
                Message: '',
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
                    StatusCode: 200,
                    Succeed: true,
                    ErrorList: [],
                    Message: Messages.NOT_FOUND,
                };
            } else {
                return {
                    Data: undefined,
                    StatusCode: 200,
                    Succeed: false,
                    ErrorList: [Messages.NOT_FOUND],
                    Message: Messages.NOT_FOUND,
                };
            }
        } catch (error) {
            return {
                Data: undefined,
                StatusCode: 500,
                Succeed: false,
                ErrorList: [error as string],
                Message: Messages.UNKNOWN_ERROR,
            };
        }
    }

    async create(userData: CreateUserDto): Promise<ResponseData<User>> {
        try {
            const newUser = this.userRepository.create(userData);
            const savedUser = await this.userRepository.save(newUser);
            return {
                Data: savedUser,
                StatusCode: 200,
                Succeed: true,
                ErrorList: [],
                Message: Messages.CREATED_SUCCESSFULLY,
            };
        } catch (error) {
            return {
                Data: undefined,
                StatusCode: 500,
                Succeed: false,
                ErrorList: [error as string],
                Message: Messages.UNKNOWN_ERROR,
            };
        }
    }

    async update(id: number, updateUser: UpdateUserDto): Promise<ResponseData<UpdateResult>> {
        try {
            const updateResult = await this.userRepository.update(id, updateUser);
            return {
                Data: updateResult,
                StatusCode: 200,
                Succeed: true,
                ErrorList: [],
                Message: Messages.UPDATED_SUCCESSFULLY,
            };
        } catch (error) {
            return {
                Data: undefined,
                StatusCode: 500,
                Succeed: false,
                ErrorList: [error as string],
                Message: Messages.UNKNOWN_ERROR,
            };
        }
    }
    async softDelete(id: number): Promise<ResponseData<void>> {
        try {
            await this.userRepository.update(id, { deletedAt: new Date() });
            return {
                Data: undefined,
                StatusCode: 200,
                Succeed: true,
                ErrorList: [],
                Message: Messages.SOFT_DELETED_SUCCESSFULLY,
            };
        } catch (error) {
            return {
                Data: undefined,
                StatusCode: 500,
                Succeed: false,
                ErrorList: [error as string],
                Message: Messages.UNKNOWN_ERROR,
            };
        }
    }

    async recover(id: number): Promise<ResponseData<UpdateResult>> {
        try {
            const updateResult = await this.userRepository.update(id, { deletedAt: null });
            return {
                Data: updateResult,
                StatusCode: 200,
                Succeed: true,
                ErrorList: [],
                Message: Messages.RECOVERED_SUCCESSFULLY,
            };
        } catch (error) {
            return {
                Data: undefined,
                StatusCode: 500,
                Succeed: false,
                ErrorList: [error as string],
                Message: Messages.UNKNOWN_ERROR,
            };
        }
    }
}
