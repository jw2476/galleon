import {Request, Response} from "express";
import User from "../models/user";

export default async (req: Request, res: Response) => {
    if (!res.locals.user?.admin) return

    const users = await User.find({guildID: res.locals.user.guildID})
    res.json(users)
}