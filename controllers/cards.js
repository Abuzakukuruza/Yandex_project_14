const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: 'Произошла ошибка', err });
      }
      next(err);
    });
};


module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error(`Карточка с _id:${req.params.id} не найдена в базе данных`));
      }
      const { owner } = card;
      return owner;
    })
    .then((owner) => {
      if (req.user._id === owner.toString()) {
        return Card.findByIdAndRemove(req.params.id);
      }
      return Promise.reject(new Error('нет доступа для удаления карточки'));
    })
    .then(() => res.status(200).send({ message: `Карточка с _id:${req.params.id} успешно удалена из базы данных` }))
    .catch((err) => res.status(500).send({ message: err.message }));
};


module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};


module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};
