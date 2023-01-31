const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Неверно указан id' });
      return next(err);
    });
};

const createUser = (req, res, next) => User.create({
  name: req.body.name,
  about: req.body.about,
  avatar: req.body.avatar,
})
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    return next(err);
  });

const updateUserInformation = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return next(err);
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateUserInformation, updateUserAvatar,
};
