import { Service } from 'typedi';
import { Repository, UpdateResult, getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
    PagedResponseData,
    PagerInfo,
    ResponseData,
} from '../../../shareds/types/response.type';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { Messages } from '../../../shareds/consts/messages';
import { HttpException } from '../../../shareds/middlewares/error.middleware';

@Service()
export class UserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    async findAll(
        pageNumber: number,
        pageSize: number,
    ): Promise<PagedResponseData<User[]>> {
        try {
            const totalRecords = await this.userRepository.count({
                where: { deletedAt: null },
            });
            const totalPage = Math.ceil(totalRecords / pageSize);
            const skip = (pageNumber - 1) * pageSize;

            const users = await this.userRepository.find({
                where: { deletedAt: null },
                take: pageSize,
                skip: skip,
            });

            const pagerInfo: PagerInfo = {
                pageNumber: pageNumber,
                pageSize: pageSize,
                firstPage: 1,
                lastPage: totalPage,
                totalPage: totalPage,
                totalRecords: totalRecords,
                nextPage: pageNumber < totalPage ? pageNumber + 1 : null,
                previousPage: pageNumber > 1 ? pageNumber - 1 : null,
                shouldShow: totalRecords > pageSize,
            };

            return new PagedResponseData<User[]>(users, 200, true, '', pagerInfo);
        } catch (error) {
            if (error instanceof Error) {
                throw new HttpException(500, error.message);
            }
        }
    }

    async findById(id: number): Promise<ResponseData<User | undefined>> {
        try {
            const user = await this.userRepository.findOne({
                where: { id, deletedAt: null },
            });
            const statusCode = user ? 200 : 404;
            const message = user ? Messages.FOUND : Messages.NOT_FOUND;
            return new ResponseData<User | undefined>(user, statusCode, !!user, message);
        } catch (error) {
            if (error instanceof Error) {
                throw new HttpException(500, error.message);
            }
        }
    }

    async create(userData: CreateUserDto): Promise<ResponseData<User>> {
        try {
            const newUser = this.userRepository.create(userData);
            const savedUser = await this.userRepository.save(newUser);
            return new ResponseData<User>(
                savedUser,
                201,
                true,
                Messages.CREATED_SUCCESSFULLY,
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new HttpException(500, error.message);
            }
        }
    }

    async update(
        id: number,
        updateUser: UpdateUserDto,
    ): Promise<ResponseData<UpdateResult>> {
        try {
            const updateResult = await this.userRepository.update(id, updateUser);
            return new ResponseData<UpdateResult>(
                updateResult,
                200,
                true,
                Messages.UPDATED_SUCCESSFULLY,
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new HttpException(500, error.message);
            }
        }
    }

    async softDelete(id: number): Promise<ResponseData<void>> {
        try {
            await this.userRepository.update(id, { deletedAt: new Date() });
            return new ResponseData<void>(
                undefined,
                200,
                true,
                Messages.SOFT_DELETED_SUCCESSFULLY,
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new HttpException(500, error.message);
            }
        }
    }

    async recover(id: number): Promise<ResponseData<UpdateResult>> {
        try {
            const updateResult = await this.userRepository.update(id, {
                deletedAt: null,
            });
            return new ResponseData<UpdateResult>(
                updateResult,
                200,
                true,
                Messages.RECOVERED_SUCCESSFULLY,
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new HttpException(500, error.message);
            }
        }
    }
}
