import {Request, Response} from "express";
import {getCraftingData} from "../types/crafting";

let {recipes} = getCraftingData()

export default async (req: Request, res: Response) => {
    const {itemName} = req.query

    res.json(recipes.find(recipe => recipe.itemName === itemName))
}