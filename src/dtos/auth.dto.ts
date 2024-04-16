import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  password: string;

  @MaxLength(50, { message: 'Username must be at most 50 characters long' })
  username?: string;

  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name?: string;
}
