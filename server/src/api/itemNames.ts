import {Request, Response} from "express";
import {getCraftingData} from "../types/crafting";

const recipes = getCraftingData()
const whitelist = ["weapons", "armor", "tools", "concoctions", "consumables", "bags", "foods", "trinkets", "furniture", "cutgems"]

export default async (req: Request, res: Response) => {
    res.json(recipes.filter(recipe => whitelist.includes(recipe.itemType) && !recipe.bindOnPickup).map(recipe => recipe.itemName))
}