import {Request, Response} from "express";
import {IUser} from "../models/user";
import CraftingRequest, {ICraftingRequest} from "../models/request";

export default async (req: Request, res: Response) => {
    const user: IUser = res.locals.user

    let requests: ICraftingRequest[] = []
    for (const tradeskill of Object.keys(user.skills)) {
        const r: ICraftingRequest[] = await CraftingRequest.find({tradeskill}).populate("requester")
        requests = [...requests, ...r]
    }
    res.json(requests.filter(request => !request.assignedTo))
}