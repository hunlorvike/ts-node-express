import express from 'express';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

const userController = new UserController(new UserService()); 

userRouter.get('/users', async (req, res, next) => {
    await userController.findAll(req, res, next);
});

userRouter.get('/users/:id', async (req, res, next) => {
    await userController.findById(req, res, next);
});

userRouter.post('/users', async (req, res, next) => {
    await userController.create(req, res, next);
});

userRouter.put('/users/:id', async (req, res, next) => {
    await userController.update(req, res, next);
});

userRouter.delete('/users/:id', async (req, res, next) => {
    await userController.softDelete(req, res, next);
});

userRouter.put('/users/recover/:id', async (req, res, next) => {
    await userController.recover(req, res, next);
});

export default userRouter;
