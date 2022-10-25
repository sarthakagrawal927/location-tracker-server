import pgp from 'pg-promise';
import dotenv from 'dotenv';

const dbOptions: pgp.IInitOptions = {
    connect(client, dc, useCount) {
        const cp = client.connectionParameters;
        console.log('Connected to database:', cp.database);
    },
    disconnect(client, dc) {
        const cp = client.connectionParameters;
        console.log('Disconnecting from database:', cp.database);
    }
}
const pgpInstance = pgp(dbOptions);
dotenv.config();

export const db = pgpInstance({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    max: 30 // use up to 30 connections
})
