import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { db } from './db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors())

app.get('/', (_req: Request, res: Response) => {
    db.one('SELECT * from users')
        .then((data) => {
            console.log('DATA:', data)
        })
        .catch((error) => {
            console.log('ERROR:', error)
        })
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});