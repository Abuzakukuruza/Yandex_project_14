const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: 'Произошла ошибка', err });
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => new NotFoundError(`Карточка с _id:${req.params.id} не найдена в базе данных`))
    .then((card) => {
      const { owner } = card;
      if (req.user._id === owner.toString()) {
        return Card.findByIdAndRemove(req.params.id);
      }
      return Promise.reject(new Forbidden('Нет доступа для удаления карточки'));
    })
    .then(() => res.status(200).send({ message: `Карточка с _id:${req.params.id} успешно удалена из базы данных` }))
    .catch(next);
};

// лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError(`Карточка с _id:${req.params.id} не найдена в базе данных`))
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

// дизлайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError(`Карточка с _id:${req.params.id} не найдена в базе данных`))
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};
