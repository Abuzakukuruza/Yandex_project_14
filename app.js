const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');


const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

// роуты регистрации и логина
app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

// роуты доступа к информации о пользователях и карточках
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// ошибка при неправильном адресе в строке
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

// централизованный обработчик ошибок

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 400, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 400
        ? err.message : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
