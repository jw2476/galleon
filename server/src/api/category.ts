import {Request, Response} from "express";
import {getCraftingData} from "../types/crafting";

const {categories, recipes} = getCraftingData()

export default async (req: Request, res: Response) => {
    const id = req.query.id as string
    let output = []
    for (const itemID of Object.keys(categories[id])) {
        let recipe: any = recipes.find(recipe => recipe.itemID === itemID)
        if (!recipe) {
           recipe = {itemID, itemName: categories[id][itemID]}
        }
        output.push(recipe)
    }
    res.json(output)
}