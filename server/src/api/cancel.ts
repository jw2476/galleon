import {Request, Response} from "express";
import CraftingRequest, {ICraftingRequest} from "../models/request";
import User, {IUser} from "../models/user";
import bot from "../bot";

export default async (req: Request, res: Response) => {
    const request: ICraftingRequest = req.body.request
    const reason: string | undefined = req.body.reason
    const user: IUser = res.locals.user

    await CraftingRequest.deleteOne({_id: request._id})

    console.log(request.assignedTo?._id)
    console.log(user._id)

    if ((request.assignedTo?._id == user._id || request.assignedTo == user._id) && request.requester._id != user._id) {
        const admins: IUser[] = await User.find({admin: true})
        if (!request.requester.admin) admins.push(request.requester)
        for (const admin of admins) {
            const adminDiscord = await bot.users.fetch(admin.discordID)
            const dm = await adminDiscord.createDM()
            await dm.send(`${user.username} cancelled ${request.requester.username}'s request for ${request.recipe.quantity}x ${request.recipe.itemName} due to ${reason}`)
        }
    } else if (request.requester._id == user._id && request.assignedTo) {
        const assignedTo = await bot.users.fetch(request.assignedTo.discordID)
        const dm = await assignedTo.createDM()
        await dm.send(`${user.username} cancelled their request for ${request.recipe.quantity}x ${request.recipe.itemName} ${request.materialsSubmitted ? 'please return their materials' : ''}`)
    }

    res.sendStatus(200)
}