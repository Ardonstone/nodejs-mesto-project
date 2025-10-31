import { Request, Response } from 'express';
import User from '../models/user';
import { RequestWithUser } from '../types/index';

// Получение всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Получение пользователя по _id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send('Пользователь по указанному _id не найден');
    }

    res.status(200).send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный _id пользователя' });
    }

    res.status(500).send({ message: 'Ошибка сервера' });
  }
}

// Создание нового пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });

    res.status(201).send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }

    res.status(500).send({ message: 'Ошибка сервера' });
  }
};

// Обновление профиля пользователя
export const updateUserProfile = async (req: Request, res: Response) => {
  const { name, about } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }

    res.status(200).send(user);
  } catch (err: unknown) {
    if (err instanceof Error && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }

    res.status(500).send({ message: 'Ошибка сервера' });
  }
};

// Обновление аватара пользователя
export const updateUserAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }

    res.status(200).send(user);
  } catch (err: unknown) {
    if (err instanceof Error && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }

    res.status(500).send({ message: 'Ошибка сервера' });
  }
};