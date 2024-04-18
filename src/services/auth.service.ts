import { type RegisterDto, type LoginDto } from '../dtos/auth.dto';
import { HttpException } from '../shareds/configs/http.exception';
import bcrypt from 'bcryptjs';
import { ResponseData, type Payload } from '../shareds/types/response.type';
import { type SignOptions } from 'jsonwebtoken';
import { JwtHelper } from '../shareds/helpers/jwt.helper';
import { User } from '../entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  async register(userData: RegisterDto): Promise<ResponseData<User>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new HttpException(400, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser: Partial<User> = {
      email: userData.email,
      passwordHash: hashedPassword,
      username: userData.username,
      fullName: userData.name,
    };

    const refreshPayload: Payload = {
      email: newUser.email,
      role: newUser.role,
    };
    const refreshOptions: SignOptions = {
      expiresIn: '7d',
    };
    newUser.refreshToken = JwtHelper.generateRefreshToken(refreshPayload, refreshOptions);

    try {
      const savedUser = await this.userRepository.save(newUser as User);
      return new ResponseData(savedUser, 200, true, 'User registered successfully');
    } catch (error: any) {
      throw new HttpException(500, error.message);
    }
  }

  async login(credentials: LoginDto): Promise<ResponseData<{ accessToken: string }>> {
    const user = await this.userRepository.findOne({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new HttpException(400, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException(400, 'Invalid email or password');
    }

    const refreshPayload: Payload = {
      email: user.email,
      role: user.role,
    };

    const refreshOptions: SignOptions = {
      expiresIn: '7d',
    };

    const refreshToken = JwtHelper.generateRefreshToken(refreshPayload, refreshOptions);
    user.refreshToken = refreshToken;

    const accessTokenPayload: Payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessTokenOptions: SignOptions = {
      expiresIn: '1h',
    };

    const accessToken = JwtHelper.generateToken(accessTokenPayload, accessTokenOptions);
    return new ResponseData<{ accessToken: string }>(
      { accessToken },
      200,
      true,
      'Login successful',
    );
  }
}
