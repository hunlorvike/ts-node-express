import { type RegisterDto, type LoginDto } from '../dtos/auth.dto';
import { HttpException } from '../shareds/configs/http.exception';
import bcrypt from 'bcryptjs';
import { type Payload, ResponseData } from '../shareds/types/response.type';
import { type SignOptions } from 'jsonwebtoken';
import { JwtHelper } from '../shareds/helpers/jwt.helper';
import { User } from '../entities/user.entity';
import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';

@Service()
export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  test(): string {
    return 'hello';
  }

  async register(userData: RegisterDto): Promise<ResponseData<User>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new HttpException(400, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      username: userData.username,
      name: userData.name,
      isVerified: true,
    });

    const refreshPayload: Payload = {
      email: newUser.email,
      role: newUser.role,
    };
    const refreshOptions: SignOptions = {
      expiresIn: '7d',
    };
    newUser.refresh_token = JwtHelper.generateRefreshToken(
      refreshPayload,
      refreshOptions,
    );

    try {
      const savedUser = await this.userRepository.save(newUser);

      return new ResponseData(savedUser, 200, true, 'User created successfully');
    } catch (error: any) {
      throw new HttpException(500, error.message);
    }
  }

  async login(credentials: LoginDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new HttpException(400, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
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
    user.refresh_token = refreshToken;
    return user;
  }
}
