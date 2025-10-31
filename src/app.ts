import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { RequestWithUser } from './types/index';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithUser).user = {
    _id: '685019091bc191cf15fd9de1'
  };

  next();
});

app.use(express.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send({ message: 'Not found' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(+PORT);