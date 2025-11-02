import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../utils/types';
import AppError from '../errors/appError';
import Card from '../models/card';

// Получение всех карточек
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});

    return res.status(200).send(cards);
  } catch (err) {
    return next(err);
  }
};

// Создание карточки
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: (req as RequestWithUser).user._id });

    return res.status(201).send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new AppError('Переданы некорректные данные при создании карточки', 400));
    }
    return next(err);
  }
};

// Удаление карточки
export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return next(new AppError('Карточка с указанным _id не найдена', 404));
    }

    if (card.owner.toString() !== (req as RequestWithUser).user._id) {
      return next(new AppError('Нет прав для удаления этой карточки', 403));
    }

    await card.remove();

    return res.status(200).send({ message: 'Карточка удалена' });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new AppError('Передан некорректный _id карточки', 400));
    }
    return next(err);
  }
};

// Поставить лайк на карточку
export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: (req as RequestWithUser).user._id } },
      { new: true },
    );

    if (!card) {
      return next(new AppError('Карточка с указанным _id не найдена', 404));
    }

    return res.status(200).send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new AppError('Переданы некорректные данные для постановки лайка или некорректный _id карточки', 400));
    }
    return next(err);
  }
};

// Убрать лайк с карточки
export const unlikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: (req as RequestWithUser).user._id } },
      { new: true },
    );

    if (!card) {
      return next(new AppError('Передан несуществующий _id карточки', 404));
    }

    return res.status(200).send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new AppError('Переданы некорректные данные для постановки лайка или некорректный _id карточки', 400));
    }
    return next(err);
  }
};