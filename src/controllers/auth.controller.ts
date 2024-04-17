import {
  JsonController,
  Post,
  Body,
  BadRequestError,
  Get,
  Authorized,
  CurrentUser,
} from 'routing-controllers';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { JwtHelper } from '../shareds/helpers/jwt.helper';
import { type Payload, ResponseData } from '../shareds/types/response.type';
import { type SignOptions } from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { HttpException } from '../shareds/configs/http.exception';
import Container from 'typedi';

@JsonController('/auth')
export class AuthController {
  private readonly authService = Container.get(AuthService);

  @Get('/')
  async hello(): Promise<string> {
    return this.authService.test();
  }

  @Get('/current-user')
  async getUser(@CurrentUser() user?: User): Promise<User | string> {
    return user || 'not found';
  }

  @Get('/authenticated')
  @Authorized()
  async authenticatedRoute() {
    return 'Authenticated Route';
  }

  @Get('/authorized')
  @Authorized('ADMIN')
  async authorizedRoute() {
    return 'Authorized Route';
  }

  @Post('/register')
  async register(@Body() userData: RegisterDto): Promise<ResponseData<any>> {
    try {
      const user = await this.authService.register(userData);
      return new ResponseData(user, 200, true, 'User registered successfully');
    } catch (error: any) {
      throw new HttpException(500, error);
    }
  }

  @Post('/login')
  async login(@Body() credentials: LoginDto): Promise<ResponseData<any>> {
    try {
      const user = await this.authService.login(credentials);

      if (!user) {
        throw new BadRequestError('Invalid email or password');
      }
      const refreshPayload: Payload = {
        user,
      };

      const options: SignOptions = {
        expiresIn: '1d',
      };

      const token = JwtHelper.generateToken(refreshPayload, options);

      return new ResponseData({ token }, 200, true, 'Login successful');
    } catch (error: any) {
      throw new HttpException(500, error);
    }
  }
}
