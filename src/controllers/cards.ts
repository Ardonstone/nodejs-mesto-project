import { Request, Response } from 'express';
import { RequestWithUser } from '../types/index';
import Card from '../models/card';

// Получение всех карточек
export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});

    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Создание карточки
export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: (req as RequestWithUser).user._id });

    res.status(201).send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    }

    res.status(500).send({ message: 'Ошибка сервера' });
  }
};

// Удаление карточки
export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    }

    res.status(200).send({ message: 'Карточка удалена' });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный _id карточки' });
    }

    res.status(500).send({ message: 'Ошибка сервера' });
  }
}

// Поставить лайк на карточку
export const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: (req as RequestWithUser).user._id } },
      { new: true }
    );

    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    }

    res.status(200).send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка или некорректный _id карточки' });
    }

    res.status(500).send({ message: 'Ошибка сервера' });
  }
}

// Убрать лайк с карточки
export const unlikeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: (req as RequestWithUser).user._id } },
      { new: true }
    );

    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    }

    res.status(200).send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка или некорректный _id карточки' });
    }

    res.status(500).send({ message: 'Ошибка сервера' });
  }
};