import { Router } from "express";
import { getCards, createCard, deleteCard, likeCard, unlikeCard } from "../controllers/cards";

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', unlikeCard);

export default cardsRouter;