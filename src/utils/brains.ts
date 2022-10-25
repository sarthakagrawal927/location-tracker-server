import { sendLocationObject } from './socket';
import { LocationObject } from './types';

export const handleNewLocationObject = (data: LocationObject) => {
    // store in db & in memory
    sendLocationObject(data);
}