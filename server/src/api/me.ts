import {Request, Response} from "express";

export default async (req: Request, res: Response) => {
    res.json(res.locals.user)
}