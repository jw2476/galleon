import {Request, Response} from "express";
import {CompletedRecipe, isCompletedIngredientRecipe, Item} from "../types/crafting";
import {Message, MessageEmbed} from "discord.js";
import {IUser} from "../models/user"
import bot from "../bot";

async function calculateGatheringMaterials(recipe: CompletedRecipe, baseQuantity: number, materials: Record<string, Item> = {}): Promise<Record<string, Item>> {
    for (const ingredient of recipe.ingredients) {
        if (isCompletedIngredientRecipe(ingredient)) {
            await calculateGatheringMaterials(ingredient, baseQuantity * ingredient.quantity, materials)
        } else {
            if (materials[ingredient.itemID]) {
                materials[ingredient.itemID] = {...ingredient, quantity: materials[ingredient.itemID].quantity + (ingredient.quantity *  baseQuantity)}
            } else {
                materials[ingredient.itemID] = {...ingredient, quantity: ingredient.quantity *  baseQuantity}
            }
        }
    }
    return materials
}

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
        if (material.itemName === undefined) console.log(material.itemID)
    }
    embed.setDescription(description)

    const discordUser = await bot.users.fetch(user.discordID)
    const dmChannel = await discordUser.createDM()
    await dmChannel.send(embed)
}