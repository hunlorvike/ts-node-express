import {
  JsonController,
  Post,
  Body,
  Get,
  Authorized,
  CurrentUser,
} from 'routing-controllers';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { ResponseData } from '../shareds/types/response.type';
import { User } from '../entities/user.entity';
import Container from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { Role } from 'shareds/types/enums/type.enum';

@OpenAPI({ security: [{ Bearer: [] }] })
@JsonController('/auth')
export class AuthController {
  private readonly authService = Container.get(AuthService);

  @Get('/current-user')
  async getUser(
    @CurrentUser({ required: false }) user?: User,
  ): Promise<User | undefined> {
    return user;
  }

  @Get('/authenticated')
  @Authorized()
  async authenticatedRoute() {
    return 'Authenticated Route';
  }

  @Get('/authorized-enduser')
  @Authorized([Role.ENDUSER])
  async authorizedUserRoute() {
    return 'Authorized User Route';
  }

  @Get('/authorized')
  @Authorized([Role.ADMIN, Role.ENDUSER])
  async authorizedRoute() {
    return 'Authorized Route';
  }

  @Post('/register')
  @OpenAPI({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user',
    responses: {
      '200': {
        description: 'User registered successfully',
      },
    },
  })
  async register(@Body() userData: RegisterDto): Promise<ResponseData<User>> {
    return this.authService.register(userData);
  }

  @Post('/login')
  @OpenAPI({
    summary: 'Login user',
    description: 'Endpoint to login user',
    responses: {
      '200': {
        description: 'Login successful',
      },
    },
  })
  async login(
    @Body() credentials: LoginDto,
  ): Promise<ResponseData<{ accessToken: string }>> {
    return this.authService.login(credentials);
  }
}
