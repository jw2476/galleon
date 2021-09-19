import {Request, Response} from "express";
import {IUser} from "../models/user";
import * as jwt from "jsonwebtoken"

const {
    CLIENT_SECRET
} = process.env

export default async (req: Request, res: Response) => {
    const user: IUser = res.locals.user
    res.json(jwt.sign(user.discordID, CLIENT_SECRET))
}