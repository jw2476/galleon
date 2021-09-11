import {Request, Response} from "express";
import {Category, getCraftingData, isIngredientCategory, isIngredientRecipe, Recipe} from "../types/crafting";

let recipes = getCraftingData()

async function completeRecipe(recipe: Recipe): Promise<Recipe> {
    if (!recipe || !recipe.ingredients) {
        return recipe
    }
    for (let i = 0; i < recipe.ingredients?.length; i++) {
        const ingredient = recipe.ingredients[i]
        if (isIngredientCategory(ingredient)) {
            for (let j = 0; j < ingredient.recipes?.length; j++) {
                const catIngredient = ingredient.recipes[j]
                if (isIngredientRecipe(catIngredient)) {
                    (recipe.ingredients[i] as Category).recipes[j] = await completeRecipe(recipes.find(recipe => recipe.itemID === catIngredient.itemID))
                }
            }
        } else if (isIngredientRecipe(ingredient)) {
            recipe.ingredients[i] = await completeRecipe(recipes.find(recipe => recipe.itemID === ingredient.itemID))
        }
    }
    return recipe
}

export default async (req: Request, res: Response) => {
    const {itemName} = req.query
    const recipe = await completeRecipe(recipes.find(recipe => recipe.itemName === itemName))
    res.json(recipe)
}