import { Request, Response } from 'express';

export function catcher(fn: Function) {
    return (req: Request, res: Response, next: Function) => fn(req, res, next).catch(next);
}