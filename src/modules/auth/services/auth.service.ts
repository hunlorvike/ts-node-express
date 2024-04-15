import { getManager } from 'typeorm';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { HttpException } from '../../../shareds/middlewares/error.middleware';
import bcrypt from 'bcryptjs';
import { Payload, ResponseData } from '../../../shareds/types/response.type';
import { SignOptions } from 'jsonwebtoken';
import { JwtHelper } from '../../../shareds/utils/jwt.helper';
import { User } from '../../users/entities/user.entity';
import dataSource from '../../../database/data-source';

export class AuthService {
    private static instance: AuthService;
    private static userRepository = dataSource.getRepository(User);

    private constructor() { }

    static get(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    test(): string {
        return 'hello';
    }

    async register(userData: RegisterDto): Promise<ResponseData<User>> {
        const existingUser = await AuthService.userRepository.findOne({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new HttpException(400, 'Email already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = AuthService.userRepository.create({
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

        const entityManager = getManager();
        const queryRunner = entityManager.queryRunner;
        await queryRunner.startTransaction();

        try {
            const savedUser = await AuthService.userRepository.save(newUser);

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
        const user = await AuthService.userRepository.findOne({
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
