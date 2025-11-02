import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

// Проверка корректности URL аватара
function isValidAvatarURL(url: string): boolean {
  const regexWithZone = /^https?:\/\/(?:www\.)?[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}(?:\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=0-9]*)?#?$/;
  const regexWithoutZone = /^https?:\/\/(?:www\.)?[A-Za-z0-9-]+$/;

  return regexWithZone.test(url) && !regexWithoutZone.test(url);
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: isValidAvatarURL,
      message: 'Некорректный URL аватара',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Введен неверный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);