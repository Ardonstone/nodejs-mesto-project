import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import AppError from '../errors/appError';
import { RequestWithUser } from '../utils/types';
import JWT_KEY from '../utils/config';

// Получение всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

// Получение пользователя по _id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(new AppError('Пользователь по указанному _id не найден', 404));
    }

    return res.status(200).send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new AppError('Передан некорректный _id пользователя', 400));
    }
    return next(err);
  }
};

// Создание нового пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });

    const { password: _, ...userData } = user.toObject();

    return res.status(201).send(userData);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new AppError('Переданы некорректные данные при создании пользователя', 400));
    }

    if (err instanceof Error && 'code' in err && err.code === 11000) {
      return next(new AppError('Пользователь с таким email уже существует', 409));
    }

    return next(err);
  }
};

// Обновление профиля пользователя
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new AppError('Пользователь по указанному _id не найден', 404));
    }

    return res.status(200).send(user);
  } catch (err: unknown) {
    if (err instanceof Error && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return next(new AppError('Переданы некорректные данные при обновлении профиля', 400));
    }
    return next(err);
  }
};

// Обновление аватара пользователя
export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new AppError('Пользователь по указанному _id не найден', 404));
    }

    return res.status(200).send(user);
  } catch (err: unknown) {
    if (err instanceof Error && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return next(new AppError('Переданы некорректные данные при обновлении аватара', 400));
    }
    return next(err);
  }
};

// Получение из запроса и проверка логина и пароля
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || (!await bcrypt.compare(password, user.password))) {
      return next(new AppError('Неправильные почта или пароль', 401));
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_KEY,
      { expiresIn: '7d' },
    );

    return res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 7 * 24 * 3600 * 1000,
      })
      .send({ message: 'Вход выполнен успешно' });
  } catch (err) {
    return next(err);
  }
};

// Получение информации о текущем пользователе
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as RequestWithUser).user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError('Пользователь по указанному _id не найден', 404));
    }

    return res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};