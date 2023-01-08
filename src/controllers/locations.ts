
import { db, multiInsertLocationQuery } from '../utils/db';
import { LocationObject } from '../utils/types';

export const addLocationsToDB = async (locations: LocationObject[]) => {
    await db.none(multiInsertLocationQuery(locations));
}

export const getLocationByDate = async (phone: string, date: string) => {
    return await db.manyOrNone("SELECT * FROM locations WHERE phone = $1 AND loc_timestamp::DATE = $2", [phone, date])
}
