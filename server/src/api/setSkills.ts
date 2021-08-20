import {Request, Response} from "express";
import User from "../models/user";

export default async (req: Request, res: Response) => {
    if (!res.locals.user.admin) return
    const users = req.body

    for (const user of users) {
        const dbUser = await User.findOne({_id: user._id})
        dbUser.skills = user.skills
        await dbUser.save()
    }

    res.sendStatus(200)
}