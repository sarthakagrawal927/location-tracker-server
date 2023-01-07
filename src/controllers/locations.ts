
import { db, multiInsertLocationQuery } from '../utils/db';
import { LocationObject } from '../utils/types';

export const addLocationsToDB = async (locations: LocationObject[]) => {
    await db.none(multiInsertLocationQuery(locations));
}