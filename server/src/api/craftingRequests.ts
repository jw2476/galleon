import {Request, Response} from "express";
import CraftingRequest from "../models/request";

export default async (req: Request, res: Response) => {
    let requests = await CraftingRequest.find({assignedTo: res.locals.user._id})
    res.json(requests)
}