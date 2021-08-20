import {Request, Response} from "express";
import CraftingRequest from "../models/request";
import User, {IUser} from "../models/user";
import bot from "../bot";
import {GuildMember, MessageEmbed, TextChannel} from "discord.js";
import * as craftingNames from "../data/javelindata_craftingnames.json"
import * as recipes from "../data/javelindata_crafting.json"

export default async (req: Request, res: Response) => {
    const {
        item,
        primary,
        secondary,
        notes
    } = req.body
    const dbUser: IUser = res.locals.user
    const guild = await bot.guilds.fetch(dbUser.guildID)
    const member: GuildMember = await guild.members.fetch(dbUser.discordID)

    const crafter = await findCrafter(item)
    const crafterDiscord = await guild.members.fetch(crafter.discordID)

    await new CraftingRequest({
        item,
        primary,
        secondary,
        notes,
        madeBy: dbUser._id,
        assignedTo: crafter._id
    }).save()

    let channel: TextChannel
    let channels = guild.channels.cache.filter(channel => channel.name === "crafting-requests" && channel.type === "text")
    if (channels.size === 0) {
        channel = await guild.channels.create("crafting-requests", {type: "text"})
        await channel.send(`This channel has been created by ${bot.user} automatically`)
    } else {
        channel = channels.first() as TextChannel
    }

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(item)
        .setAuthor(member.displayName, member.user.avatarURL())
        .addField("Primary Buff", primary, true)
        .addField("Secondary Buff", secondary, true)
        .addField("Crafted By", `${crafterDiscord}`, true)
        .setDescription(notes ? notes : "") // no undefined
    await channel.send(embed)
}

async function findCrafter(item: String, user: IUser): Promise<IUser> {
    let itemID = Object.keys(craftingNames).find(key => craftingNames[key] === item)
    let recipe = recipes.find(recipe => recipe.RecipeID === itemID)
    let skill = recipe.Tradeskill
    let availableCrafters = await User.find({skills: skill, guildID: user.guildID})
    let crafter = availableCrafters[Math.floor(Math.random() * availableCrafters.length)]
    return crafter
}