const Card = require('../models/card');

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
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card) {
        card.remove();
      } else {
        return res.status(404).send({ message: 'Некорректные данные.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Карточка с указанным _id не найдена.' });
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
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
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
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      return next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
};
