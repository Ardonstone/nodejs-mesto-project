import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import errorHandler from './middlewares/errorHandler';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateSignIn, validateSignUp } from './middlewares/validators';
import AppError from './errors/appError';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(requestLogger);

app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError('Not found', 404));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(+PORT);