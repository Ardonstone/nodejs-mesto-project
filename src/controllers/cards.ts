import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequestWithUser } from '../types/index';
import HttpStatus from './httpStatuses';
import Card from '../models/card';

// Получение всех карточек
export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});

    res.status(HttpStatus.Ok).json(cards); // Вместо 200
  } catch (err: unknown) {
    console.error('Error fetching cards:', err);

    if (err instanceof mongoose.Error.CastError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Некорректные данные для поиска карточек' });
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Некорректные данные для поиска' });
    }
    if (err instanceof mongoose.Error) {
      return res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка базы данных при получении карточек' });
    }

    res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка сервера' });
  }
};

// Создание карточки
export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: (req as RequestWithUser).user._id });

    res.status(HttpStatus.Created).json(card); // Вместо 201
  } catch (err: unknown) {
    console.error('Error creating card:', err);

    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Переданы некорректные данные при создании карточки' });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Некорректный owner ID' });
    }
    if (err instanceof mongoose.Error) {
      return res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка базы данных при создании карточки' });
    }

    res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка сервера' });
  }
};

// Удаление карточки
export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      return res.status(HttpStatus.NotFound).json({ message: 'Карточка с указанным _id не найдена' }); // Вместо 404
    }

    res.status(HttpStatus.Ok).json({ message: 'Карточка удалена' });
  } catch (err: unknown) {
    console.error('Error deleting card:', err);

    if (err instanceof mongoose.Error.CastError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Передан некорректный _id карточки' });
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Некорректные данные для удаления' });
    }
    if (err instanceof mongoose.Error) {
      return res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка базы данных при удалении карточки' });
    }

    res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка сервера' });
  }
};

// Поставить лайк на карточку
export const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: (req as RequestWithUser).user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(HttpStatus.NotFound).json({ message: 'Передан несуществующий _id карточки' });
    }

    res.status(HttpStatus.Ok).json(card);
  } catch (err: unknown) {
    console.error('Error liking card:', err);

    if (err instanceof mongoose.Error.CastError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Передан некорректный _id карточки для лайка' });
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Некорректные данные для постановки лайка' });
    }
    if (err instanceof mongoose.Error) {
      return res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка базы данных при постановке лайка' });
    }

    res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка сервера' });
  }
};

// Убрать лайк с карточки
export const unlikeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: (req as RequestWithUser).user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(HttpStatus.NotFound).json({ message: 'Передан несуществующий _id карточки' }); // Вместо 404
    }

    res.status(HttpStatus.Ok).json(card);
  } catch (err: unknown) {
    console.error('Error unliking card:', err);

    if (err instanceof mongoose.Error.CastError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Передан некорректный _id карточки для снятия лайка' });
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatus.BadRequest).json({ message: 'Некорректные данные для снятия лайка' });
    }
    if (err instanceof mongoose.Error) {
      return res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка базы данных при снятии лайка' });
    }

    res.status(HttpStatus.InternalServerError).json({ message: 'Ошибка сервера' });
  }
};
