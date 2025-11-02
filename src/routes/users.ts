import { Router } from 'express';
import {
  getUsers, getUserById, updateUserProfile, updateUserAvatar,
  getCurrentUser,
} from '../controllers/users';
import { validateUserId, validateUpdateUser, validateUpdateUserAvatar } from '../middlewares/validators';

const usersRouter = Router();

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.get('/users/:userId', validateUserId, getUserById);
usersRouter.patch('/users/me', validateUpdateUser, updateUserProfile);
usersRouter.patch('/users/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

export default usersRouter;