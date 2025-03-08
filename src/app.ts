import express from 'express';
import { ErrorHandler } from './middlewares/errorHandler';
import { eventsRouter } from './routes/events';
import cors from 'cors'

const app = express();

app.use(cors())

app.use(express.json())

app.use('/api/v1/events', eventsRouter);

app.use(ErrorHandler);

export {app};