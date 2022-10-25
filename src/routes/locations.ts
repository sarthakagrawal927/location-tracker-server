import express, { Request, Response } from "express";
import { db } from '../utils/db';
import { catcher } from '../utils/helpers';
const router = express.Router();

router.get('/', catcher(async (_req: Request, res: Response) => {
    const users = await db.many('SELECT * from locations')
    res.json({ users })
}));

router.post('/add', catcher(async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const user = await db.one('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.json(user);
}))

module.exports = router;