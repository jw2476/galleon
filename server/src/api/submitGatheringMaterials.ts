import {Request, Response} from "express";
import CraftingRequest, {ICraftingRequest} from "../models/request";
import bot from "../bot";

export default async (req: Request, res: Response) => {
    const user = res.locals.user
    const request: ICraftingRequest = await CraftingRequest.findOne({_id: req.body._id}).populate("assignedTo")
    request.materialsSubmitted = true
    await request.save()

    res.sendStatus(200)
    if (request.assignedTo) {
        const assignedTo = await bot.users.fetch(request.assignedTo.discordID)
        const dmChannel = await assignedTo.createDM()
        await dmChannel.send(`The request for ${request.recipe.itemName} by ${user.username} has had its gathering materials submitted`)
    }
}