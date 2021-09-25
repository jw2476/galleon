import {Request, Response} from "express";
import {CompletedRecipe, isCompletedIngredientRecipe, Item} from "../types/crafting";
import {Message, MessageEmbed, TextChannel} from "discord.js";
import {IUser} from "../models/user"
import bot from "../bot";
import CraftingRequest from "../models/request";
import {calculateGatheringMaterials} from "../util/calculateGatheringMaterials";



export default async (req: Request, res: Response) => {
    const recipe: CompletedRecipe = req.body
    const user: IUser = res.locals.user

    const gatheringMaterials = await calculateGatheringMaterials(recipe, recipe.quantity)
    const embed = new MessageEmbed()
        .setTitle(`Gathering Materials for ${recipe.quantity}x ${recipe.itemName}`)
        .setColor("#6200EE")
    let description = ""
    for (const material of Object.values(gatheringMaterials)) {
        description += `${material.quantity}x ${material.itemName}\n`
    }
    embed.setDescription(description)

    const discordUser = await bot.users.fetch(user.discordID)
    const dmChannel = await discordUser.createDM()
    await dmChannel.send(embed)

    await new CraftingRequest({
        recipe,
        tradeskill: recipe.tradeskill,
        requester: user
    }).save()

    res.sendStatus(200)

    const guild = await bot.guilds.fetch(user.guildID)
    const channel = guild.channels.cache.find(channel => channel.name === "🔨│crafting-requests") as TextChannel
    if (channel) {
        await channel.send(`${discordUser} has requested ${recipe.quantity}x ${recipe.itemName}`)
    }
}
