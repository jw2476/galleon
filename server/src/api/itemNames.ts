import {Request, Response} from "express";
import {getCraftingData} from "../types/crafting";

const {recipes} = getCraftingData()

export default async (req: Request, res: Response) => {
    res.json(recipes.filter(recipe => !recipe.itemType.includes("refined") && !recipe.itemType.includes("refining")).map(recipe => recipe.itemName))
}