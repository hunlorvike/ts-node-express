import express from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

const userController = new UserController(); 

userRouter.get('/', async (req, res, next) => {
    await userController.findAll(req, res, next);
});

userRouter.get('/:id', async (req, res, next) => {
    await userController.findById(req, res, next);
});

userRouter.post('', async (req, res, next) => {
    await userController.create(req, res, next);
});

userRouter.put('/:id', async (req, res, next) => {
    await userController.update(req, res, next);
});

userRouter.delete('/:id', async (req, res, next) => {
    await userController.softDelete(req, res, next);
});

userRouter.put('/recover/:id', async (req, res, next) => {
    await userController.recover(req, res, next);
});

export default userRouter;
