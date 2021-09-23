import {Request, Response} from "express";
import {IUser} from "../models/user";
import CraftingRequest, {ICraftingRequest} from "../models/request";
import bot from "../bot";
import {calculateGatheringMaterials} from "../util/calculateGatheringMaterials";
import {MessageEmbed} from "discord.js";

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

    const gatheringMaterials = await calculateGatheringMaterials(craftingRequest.recipe, craftingRequest.recipe.quantity)
    const embed = new MessageEmbed()
        .setTitle(`Gathering Materials for ${craftingRequest.recipe.quantity}x ${craftingRequest.recipe.itemName}`)
        .setColor("#6200EE")
    let description = ""
    for (const material of Object.values(gatheringMaterials)) {
        description += `${material.quantity}x ${material.itemName}\n`
    }
    embed.setDescription(description)

    const discordUser = await bot.users.fetch(user.discordID);
    await (await discordUser.createDM()).send(embed);
}