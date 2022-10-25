import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { Server } from 'http';
import { initializeSocket } from './utils/socket';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors())
app.use(bodyParser.json());

app.use('/users', require('./routes/users'));
app.use('locations', require('./routes/locations'));

const server: Server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

initializeSocket(server);

