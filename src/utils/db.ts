import pgp from 'pg-promise';
import dotenv from 'dotenv';
import { LocationObject } from './types';

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
    connectionString: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    max: 10 // use up to 10 connections
})

const locationTableColumnSet = new pgpInstance.helpers.ColumnSet(['latitude', 'longitude', 'phone', 'loc_timestamp'], { table: 'locations' });

export const multiInsertLocationQuery = (locationArray: LocationObject[]) => {
    const values = locationArray.map(locationObject => ({
        latitude: locationObject.lat,
        longitude: locationObject.lng,
        phone: locationObject.phone,
        loc_timestamp: new Date(locationObject.timestamp)
    }))
    const query = pgpInstance.helpers.insert(values, locationTableColumnSet);
    return query;
}

