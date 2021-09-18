import {Request, Response} from "express";
import {IUser} from "../models/user";
import CraftingRequest from "../models/request";

export default async (req: Request, res: Response) => {
    const user: IUser = res.locals.user
    const requests = await CraftingRequest.find({requester: user._id}).populate("requester").populate("assignedTo")
    res.json(requests)
}