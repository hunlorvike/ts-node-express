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
import { PagedResponseData, type ResponseData } from '../shareds/types/response.type';
import { type UpdateResult } from 'typeorm';
import Container from 'typedi';

@JsonController('/users')
export class UserController {
  private readonly userService = Container.get(UserService);

  @Get('/:id')
  async getById(@Param('id') id: number): Promise<ResponseData<User | undefined>> {
    return await this.userService.findById(id);
  }

  @Get()
  async getAll(
    @QueryParam('page') page: number = 1,
    @QueryParam('size') size: number = 10,
  ): Promise<PagedResponseData<User[]>> {
    return await this.userService.findAll(page, size);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseData<User>> {
    return await this.userService.create(createUserDto);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseData<UpdateResult>> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  async softDelete(@Param('id') id: number): Promise<ResponseData<UpdateResult>> {
    return await this.userService.softDelete(id);
  }
}
