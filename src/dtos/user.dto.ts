import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { Role } from '../shareds/enums/role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  password: string;

  @MaxLength(20, { message: 'Username must be at most 20 characters long' })
  username?: string;

  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  name?: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Invalid role' })
  role?: Role;
}

export class UpdateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  password?: string;

  @MaxLength(20, { message: 'Username must be at most 20 characters long' })
  username?: string;

  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  name?: string;

  @IsEnum(Role, { message: 'Invalid role' })
  role?: Role;
}
