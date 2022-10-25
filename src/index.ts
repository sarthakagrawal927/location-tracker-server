import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { db } from './utils/db';
import { catcher } from './utils/helpers';
import { Server } from "socket.io"
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors())
app.use(bodyParser.json());


app.get('/users', catcher(async (_req: Request, res: Response) => {
    const users = await db.many('SELECT * from users')
    res.json({ users });
}));

const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

setInterval(() => {
    io.emit('message', 'hello world');
}, 1000)