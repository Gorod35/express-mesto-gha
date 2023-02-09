const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const NotAutorizedError = require('../errors/not-authorized-err');
const NotOwnerError = require('../errors/not-owner-err');
const BadRequestError = require('../errors/bad-request-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  return Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (String(card.owner) === ownerId) {
        return card.remove();
      }
      throw new NotOwnerError('Невозможно удалить чужую карточку.');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new NotFoundError('Передан невалидный id.'));
      }
      return next(err);
    });
};

const putCardLikesById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан невалидный id.'));
      }
      return next(err);
    });
};

const deleteCardLikesById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан невалидный id.'));
      }
      return next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
};
