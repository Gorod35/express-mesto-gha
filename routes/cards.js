const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCardById);
cardsRouter.put('/:cardId/likes', putCardLikesById);
cardsRouter.delete('/:cardId/likes', deleteCardLikesById);

module.exports = cardsRouter;
