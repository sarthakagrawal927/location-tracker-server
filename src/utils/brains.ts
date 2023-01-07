import { sendLocationObject } from './socket';
import { receiveLocationTimer, storeLocationInDBTimer } from './constants';

import { LocationObject } from './types';
import { addLocationsToDB } from '../controllers/locations';

const STORAGE_MAP = new Map<string, LocationObject[]>();
const LOCATION_COUNT_MAP = new Map<string, number>();
const STORAGE_RATIO = storeLocationInDBTimer / receiveLocationTimer; // will store 1 out of 10 location objects

export const handleNewLocationObject = (data: LocationObject) => {
    const { phone } = data;
    const locationCount = LOCATION_COUNT_MAP.get(phone) || 0;
    LOCATION_COUNT_MAP.set(phone, locationCount + 1);
    const shouldStore = (locationCount + 1) % STORAGE_RATIO === 0;
    if (shouldStore) {
        const locationArray = STORAGE_MAP.get(phone) || [];
        locationArray.push(data);
        STORAGE_MAP.set(phone, locationArray);
    }
    sendLocationObject(data);
}

export const handleLocations = async () => {
    const locationObjects = Array.from(STORAGE_MAP.values()).flat();
    if (locationObjects.length > 0) {
        clearObjects();
        await addLocationsToDB(locationObjects)
    }
}

const clearObjects = () => {
    STORAGE_MAP.clear();
    LOCATION_COUNT_MAP.clear();
}