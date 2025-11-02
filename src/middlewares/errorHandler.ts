import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'Ошибка сервера' : message,
    });
  next();
};

export default errorHandler;