const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const linkCheck = require('../constants/constant');
const {
  getUsers, getUserById, updateUserInformation, updateUserAvatar, getOwner,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getOwner);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInformation);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkCheck),
  }),
}), updateUserAvatar);

module.exports = userRouter;
