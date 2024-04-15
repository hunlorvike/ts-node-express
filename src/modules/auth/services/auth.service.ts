import { Repository, getManager, getRepository } from 'typeorm';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { HttpException } from '../../../shareds/middlewares/error.middleware';
import bcrypt from 'bcryptjs';
import { Payload, ResponseData } from '../../../shareds/types/response.type';
import { SignOptions } from 'jsonwebtoken';
import { JwtHelper } from '../../../shareds/utils/jwt.helper';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';

@Service()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async register(userData: RegisterDto): Promise<ResponseData<User>> {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email },
        });
        console.log(userData);

        if (existingUser) {
            throw new HttpException(400, 'Email already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = new User();
        newUser.email = userData.email;
        newUser.password = hashedPassword;
        newUser.username = userData.username;
        newUser.name = userData.name;
        newUser.isVerified = true;

        console.log(newUser);

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

        const entityManager = getManager();
        const queryRunner = entityManager.queryRunner;
        await queryRunner.startTransaction();

        try {
            const savedUser = await this.userRepository.save(newUser);

            await queryRunner.commitTransaction();

            return new ResponseData(savedUser, 200, true, 'User created successfully');
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(500, error.message);
        } finally {
            await queryRunner.release();
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
        const refreshToken = JwtHelper.generateRefreshToken(
            refreshPayload,
            refreshOptions,
        );
        user.refresh_token = refreshToken;
        return user;
    }
}
