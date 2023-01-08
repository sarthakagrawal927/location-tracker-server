import express, { Request, Response } from "express";
import { getLocationByDate } from "../controllers/locations";
import { db } from '../utils/db';
import { catcher } from '../utils/helpers';
import { LocationObject } from "../utils/types";
const router = express.Router();

router.get('/', catcher(async (req: Request, res: Response) => {
    const { phone, date } = req.query;
    if (!phone || !date || typeof phone !== "string" || typeof date !== "string") {
        return;
    }
    const locations = await getLocationByDate(phone, date)
    const locationObjectArray: LocationObject[] = locations.map(location => ({
        lat: location.latitude,
        lng: location.longitude,
        timestamp: location.loc_timestamp,
        phone: location.phone
    }));
    res.json({ locations: locationObjectArray })
}));

router.post('/add', catcher(async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const user = await db.one('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.json(user);
}))

module.exports = router;