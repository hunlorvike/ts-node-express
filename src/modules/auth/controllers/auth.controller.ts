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
import Container from 'typedi';
import { JwtHelper } from '../../../shareds/utils/jwt.helper';
import { Payload, ResponseData } from '../../../shareds/types/response.type';
import { SignOptions } from 'jsonwebtoken';
import { User } from '../../users/entities/user.entity';

@JsonController('/auth')
export class AuthController {
   private readonly authService: AuthService;

   constructor() {
      this.authService = Container.get(AuthService);
   }

   @Get('/')
   async hello(): Promise<string> {
      return 'hello';
   }

   @Get('/current-user')
   async getUser(@CurrentUser() user?: User): Promise<User | string> {
      return user || 'not found';
   }

   @Get('/authenticated')
   @Authorized()
   async authenticatedRoute(req: Request, res: Response) {
      return 'Authenticated Route';
   }

   @Get('/authorized')
   @Authorized('ADMIN')
   async authorizedRoute(req: Request, res: Response) {
      return 'Authorized Route';
   }

   @Post('/register')
   async register(@Body() userData: RegisterDto): Promise<ResponseData<any>> {
      try {
         const user = await this.authService.register(userData);
         return new ResponseData(user, 200, true, 'User registered successfully');
      } catch (error) {
         if (error instanceof Error) {
            return new ResponseData(null, 400, false, error.message);
         } else {
            return new ResponseData(null, 500, false, 'An unexpected error occurred');
         }
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
            user: user,
         };

         const options: SignOptions = {
            expiresIn: '1d',
         };

         const token = JwtHelper.generateToken(refreshPayload, options);

         return new ResponseData({ token: token }, 200, true, 'Login successful');
      } catch (error) {
         if (error instanceof Error) {
            return new ResponseData(null, 400, false, error.message);
         } else {
            return new ResponseData(null, 500, false, 'An unexpected error occurred');
         }
      }
   }
}
