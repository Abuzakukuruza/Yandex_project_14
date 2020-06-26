const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => {
      res.send(user.omitPrivate({ data: user }));
      // res.send({ data: user });
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

// обновление профиля пользователя
module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  console.log(req.body);
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он не будет создан
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

// обновление аватара пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(req.body);
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он не будет создан
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
      // const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
