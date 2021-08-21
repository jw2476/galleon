import {Request, Response} from "express";
import CraftingRequest, {ICraftingRequest} from "../models/request";

export default async (req: Request, res: Response) => {
    const request: ICraftingRequest = req.body
    if (request.assignedTo != res.locals.user._id) {
        res.sendStatus(403)
        return
    }
    await CraftingRequest.deleteOne({_id: request._id})
    res.sendStatus(200)
}