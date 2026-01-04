import express from 'express';
import cors from 'cors';
import rootRouter from './routes/route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/v2/api', rootRouter);

app.listen(5000, () => {'Backend[LIVE]: Port-5000'});