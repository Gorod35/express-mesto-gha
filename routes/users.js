const userRouter = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserInformation, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserInformation);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
