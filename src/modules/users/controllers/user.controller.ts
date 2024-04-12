import {
   JsonController,
   Get,
   Param,
   Post,
   Body,
   Put,
   Delete,
   QueryParam,
} from 'routing-controllers';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { ResponseData } from '../../../shareds/types/response.type';
import { HttpException } from '../../../shareds/middlewares/error.middleware';
import { UpdateResult } from 'typeorm';

@JsonController('/users')
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get('/:id')
   async getById(@Param('id') id: number): Promise<ResponseData<User | undefined>> {
      try {
         const user = await this.userService.findById(id);
         return user;
      } catch (error) {
         if (error instanceof Error) {
            throw new HttpException(500, error.message);
         }
      }
   }

   @Get()
   async getAll(
      @QueryParam('page') page: number,
      @QueryParam('size') size: number,
   ): Promise<ResponseData<User[]>> {
      try {
         const users = await this.userService.findAll(page, size);
         return users;
      } catch (error) {
         if (error instanceof Error) {
            throw new HttpException(500, error.message);
         }
      }
   }

   @Post()
   async create(@Body() createUserDto: CreateUserDto): Promise<ResponseData<User>> {
      try {
         const newUser = await this.userService.create(createUserDto);
         return newUser;
      } catch (error) {
         if (error instanceof Error) {
            throw new HttpException(500, error.message);
         }
      }
   }

   @Put('/:id')
   async update(
      @Param('id') id: number,
      @Body() updateUserDto: UpdateUserDto,
   ): Promise<ResponseData<UpdateResult>> {
      try {
         const updateResult = await this.userService.update(id, updateUserDto);
         return updateResult;
      } catch (error) {
         if (error instanceof Error) {
            throw new HttpException(500, error.message);
         }
      }
   }

   @Delete('/:id')
   async softDelete(@Param('id') id: number): Promise<ResponseData<void>> {
      try {
         const deleteResult = await this.userService.softDelete(id);
         return deleteResult;
      } catch (error) {
         if (error instanceof Error) {
            throw new HttpException(500, error.message);
         }
      }
   }

   @Put('/:id/recover')
   async recover(@Param('id') id: number): Promise<ResponseData<UpdateResult>> {
      try {
         const recoverResult = await this.userService.recover(id);
         return recoverResult;
      } catch (error) {
         if (error instanceof Error) {
            throw new HttpException(500, error.message);
         }
      }
   }
}
