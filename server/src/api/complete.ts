import {Request, Response} from "express";
import CraftingRequest, {ICraftingRequest} from "../models/request";
import User from "../models/user";
import bot from "../bot";

export default async (req: Request, res: Response) => {
    const request: ICraftingRequest = req.body
    if (request.assignedTo != res.locals.user._id) {
        res.sendStatus(403)
        return
    }
    await CraftingRequest.deleteOne({_id: request._id})
    res.sendStatus(200)

    const requester = await User.findOne({_id: request.madeBy})
    const guild = await bot.guilds.fetch(requester.guildID)
    const requesterDiscord = await guild.members.fetch(requester.discordID)
    const crafterDiscord = await guild.members.fetch(res.locals.user.discordID)
    const dmChannel = await requesterDiscord.createDM()
    await dmChannel.send(`Your ${request.item} has been made, please contact ${crafterDiscord.displayName} to collect it!`)
}