import {Request, Response} from "express";
import CraftingRequest, {ICraftingRequest} from "../models/request";
import bot from "../bot";

export default async (req: Request, res: Response) => {
    const request: ICraftingRequest = await CraftingRequest.findOne({_id: req.body._id}).populate("requester")
    await request.delete()
    res.sendStatus(200)
    const requester = await bot.users.fetch(request.requester.discordID)
    const dmChannel = await requester.createDM()
    await dmChannel.send(`Your request for ${request.recipe.itemName} has been completed, contact ${res.locals.user.username} to pick it up!`)
}