const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63d7fa5e06402847282b459e',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// eslint-disable-next-line consistent-return
app.use((err, req, res, next) => {
  const isNotFound = err.message.indexOf('not found');
  const isCastError = err.message.indexOf('Cast to ObjectId failed');
  if (err.message && (isNotFound || isCastError)) {
    return next();
  }

  res.status(500).send({ message: 'Ошибка сервера' });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Передан некорректный запрос.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
