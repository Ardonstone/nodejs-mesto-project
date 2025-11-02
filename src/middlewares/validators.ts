import { celebrate, Joi, Segments } from 'celebrate';

// Валидация при регистрации
const validateSignUp = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Валидация при входе
const validateSignIn = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Валидация id пользователя
const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

// Валидация при обновлении профиля пользователя
const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

// Валидация при обновлении аватара пользователя
const validateUpdateUserAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
});

// Валидация при создании карточки
const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().uri(),
  }),
});

// Валидация id карточки
const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

export {
  validateSignUp,
  validateSignIn,
  validateUserId,
  validateUpdateUser,
  validateUpdateUserAvatar,
  validateCreateCard,
  validateCardId,
};