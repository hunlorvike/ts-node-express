import { Request, Response, NextFunction } from 'express';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';
import { QueryDto } from 'src/shareds/types/query.type';
import Container, { Service } from 'typedi';
import { BaseController } from '../../../shareds/types/base.controller';

@Service()
export class UserController extends BaseController {
    private readonly userService: UserService;

    constructor() {
        super();
        this.initializeRoutes();
        this.path = 'users';
        this.userService = Container.get(UserService);
    }

    public initializeRoutes(): void {
        this.router.get('/', this.findAll.bind(this));

        this.router.get('/:id', this.findById.bind(this));

        this.router.post('/', this.create.bind(this));

        this.router.put('/:id', this.update.bind(this));

        this.router.delete('/:id', this.softDelete.bind(this));

        this.router.post('/:id/recover', this.recover.bind(this));
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { pageNumber, pageSize } = req.query as unknown as QueryDto;
            const users = await this.userService.findAll(parseInt(pageNumber), parseInt(pageSize));
            res.status(users.StatusCode).json(users);
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await this.userService.findById(parseInt(id));
            res.status(user.StatusCode).json(user);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: CreateUserDto = req.body;
            const newUser = await this.userService.create(userData);
            res.status(newUser.StatusCode).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateUser: UpdateUserDto = req.body;
            const updatedUser = await this.userService.update(parseInt(id), updateUser);
            res.status(updatedUser.StatusCode).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async softDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await this.userService.softDelete(parseInt(id));
            res.status(result.StatusCode).json(result);
        } catch (error) {
            next(error);
        }
    }

    async recover(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await this.userService.recover(parseInt(id));
            res.status(result.StatusCode).json(result);
        } catch (error) {
            next(error);
        }
    }
}
