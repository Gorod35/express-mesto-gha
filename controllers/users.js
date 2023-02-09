const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const AlreadyExistsError = require('../errors/already-exists-err');

const { NODE_ENV, JWT_SECRET } = process.env;

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
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Неверно указан _id'));
      }
      return next(err);
    });
};

const getOwner = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new AlreadyExistsError('Такой email уже существует.'));
      }
      return next(err);
    });
};

const updateUserInformation = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Пользователь с указанным _id не найден.'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Пользователь с указанным _id не найден.'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, updateUserInformation, updateUserAvatar, login, getOwner,
};
