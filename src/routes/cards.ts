import { Router } from 'express';
import {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
} from '../controllers/cards';
import { validateCreateCard, validateCardId } from '../middlewares/validators';

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', validateCreateCard, createCard);
cardsRouter.delete('/cards/:cardId', validateCardId, deleteCard);
cardsRouter.put('/cards/:cardId/likes', validateCardId, likeCard);
cardsRouter.delete('/cards/:cardId/likes', validateCardId, unlikeCard);

export default cardsRouter;