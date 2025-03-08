import express from 'express';
import { ErrorHandler } from './middlewares/errorHandler';
import { eventsRouter } from './routes/events';
import { propertiesRouter } from './routes/properties';
import cors from 'cors'

const app = express();

app.use(cors())

app.use(express.json())

app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/properties', propertiesRouter);

app.use(ErrorHandler);

export {app};