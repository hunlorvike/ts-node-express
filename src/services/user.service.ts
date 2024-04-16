import { IsNull, Repository, getRepository, type UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  PagedResponseData,
  type PagerInfo,
  ResponseData,
} from '../shareds/interfaces/response.type';
import { type CreateUserDto, type UpdateUserDto } from '../dtos/user.dto';
import { HttpException } from '../shareds/configs/http.exception';
import { Service } from 'typedi';
import { plainToClass } from 'class-transformer';

@Service()
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResponseData<User[]>> {
    try {
      const totalRecords = await User.count({
        where: { deletedAt: IsNull() },
      });
      const totalPage = Math.ceil(totalRecords / pageSize);
      const skip = (pageNumber - 1) * pageSize;

      const users = await this.userRepository.find({
        where: { deletedAt: IsNull() },
        take: pageSize,
        skip,
      });

      const pagerInfo: PagerInfo = {
        pageNumber,
        pageSize,
        firstPage: 1,
        lastPage: totalPage,
        totalPage,
        totalRecords,
        nextPage: pageNumber < totalPage ? pageNumber + 1 : null,
        previousPage: pageNumber > 1 ? pageNumber - 1 : null,
        shouldShow: totalRecords > pageSize,
      };

      return new PagedResponseData<User[]>(users, 200, true, '', pagerInfo);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(500, error.message);
      }
      throw new HttpException(500, 'Internal Server Error');
    }
  }

  async findById(id: number): Promise<ResponseData<User | undefined>> {
    try {
      const user = await User.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (user !== null) {
        const statusCode = 200;
        const message = 'Found';
        return new ResponseData<User | undefined>(user, statusCode, true, message);
      } else {
        const statusCode = 404;
        const message = 'Not found';
        return new ResponseData<User | undefined>(undefined, statusCode, false, message);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(500, error.message);
      }
      throw new HttpException(500, 'Internal Server Error');
    }
  }

  async create(userData: CreateUserDto): Promise<ResponseData<User>> {
    try {
      const userPartial = plainToClass(User, userData, {
        excludeExtraneousValues: true,
      });

      const newUser = User.create(userPartial);

      const savedUser = await this.userRepository.save(newUser);

      return new ResponseData<User>(savedUser, 201, true, 'Created successfully');
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(500, error.message);
      }
      throw new HttpException(500, 'Internal Server Error');
    }
  }

  async update(
    id: number,
    updateUser: UpdateUserDto,
  ): Promise<ResponseData<UpdateResult>> {
    try {
      const updateResult = await User.update(id, updateUser);
      return new ResponseData<UpdateResult>(
        updateResult,
        200,
        true,
        'Updated successfully',
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(500, error.message);
      }
      throw new HttpException(500, 'Internal Server Error');
    }
  }

  async softDelete(id: number): Promise<ResponseData<void>> {
    try {
      await User.update(id, { deletedAt: new Date() });
      return new ResponseData<void>(undefined, 200, true, 'Soft deleted successfully');
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(500, error.message);
      }
      throw new HttpException(500, 'Internal Server Error');
    }
  }
}
