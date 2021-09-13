import {Request, Response} from "express";
import {IUser} from "../models/user";
import CraftingRequest, {ICraftingRequest} from "../models/request";
import bot from "../bot";

export default async (req: Request, res: Response) => {
    const user: IUser = res.locals.user
    const r = req.body

    const craftingRequest: ICraftingRequest = await CraftingRequest.findOne({_id: r._id}).populate("requester")
    if (craftingRequest.assignedTo) {
        res.sendStatus(409)
        return
    }
    craftingRequest.assignedTo = user
    await craftingRequest.save()
    res.sendStatus(200)

    const requesterDiscord = await bot.users.fetch(craftingRequest.requester.discordID)
    const dmChannel = await requesterDiscord.createDM()
    await dmChannel.send(`${user.username} has assigned themselves to your request for ${craftingRequest.recipe.quantity}x ${craftingRequest.recipe.itemName}!`)
}