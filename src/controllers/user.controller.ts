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
import { type User } from '../entities/user.entity';
import { type ResponseData } from '../shareds/types/response.type';
import { type UpdateResult } from 'typeorm';
import { HttpException } from '../shareds/configs/http.exception';
import Container from 'typedi';

@JsonController('/users')
export class UserController {
  private readonly userService = Container.get(UserService);

  @Get('/:id')
  async getById(@Param('id') id: number): Promise<ResponseData<User | undefined>> {
    try {
      const user = await this.userService.findById(id);
      return user;
    } catch (error: any) {
      throw new HttpException(500, error);
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
    } catch (error: any) {
      throw new HttpException(500, error);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseData<User>> {
    try {
      const newUser = await this.userService.create(createUserDto);
      return newUser;
    } catch (error: any) {
      throw new HttpException(500, error);
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
    } catch (error: any) {
      throw new HttpException(500, error);
    }
  }

  @Delete('/:id')
  async softDelete(@Param('id') id: number): Promise<ResponseData<void>> {
    try {
      const deleteResult = await this.userService.softDelete(id);
      return deleteResult;
    } catch (error: any) {
      throw new HttpException(500, error);
    }
  }

  @Put('/:id/recover')
  async recover(@Param('id') id: number): Promise<ResponseData<UpdateResult>> {
    try {
      const recoverResult = await this.userService.recover(id);
      return recoverResult;
    } catch (error: any) {
      throw new HttpException(500, error);
    }
  }
}
