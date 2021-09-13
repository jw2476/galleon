import {Request, Response} from "express";
import {IUser} from "../models/user";
import CraftingRequest, {ICraftingRequest} from "../models/request";

export default async (req: Request, res: Response) => {
    const user: IUser = res.locals.user

    const requests = await CraftingRequest.find({assignedTo: user._id}).populate("requester")
    res.json(requests)
}