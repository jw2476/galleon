import {Request, Response} from "express";
import {getCraftingData, isIngredientCategory, isIngredientRecipe, Recipe} from "../types/crafting";
import * as util from "util";

let recipes = getCraftingData()

async function completeRecipe(recipe: Recipe, quantity: number): Promise<Recipe> {
    if (!recipe || !recipe.ingredients) {
        return recipe
    }
    for (let i = 0; i < recipe.ingredients?.length; i++) {
        const ingredient = recipe.ingredients[i]
        if (isIngredientCategory(ingredient)) {
            for (let j = 0; j < ingredient.recipes?.length; j++) {
                const catIngredient = ingredient.recipes[j]
                if (isIngredientRecipe(catIngredient)) {
                    const ingredientRecipe = recipes.find(r => r.itemID === catIngredient.itemID)
                    ingredient.recipes[j] = await completeRecipe(ingredientRecipe, catIngredient.quantity)
                }
            }
        } else if (isIngredientRecipe(ingredient)) {
            const ingredientRecipe = recipes.find(recipe => recipe.itemID === ingredient.itemID)
            recipe.ingredients[i] = await completeRecipe(ingredientRecipe, ingredient.quantity)
        }
    }
    return {...recipe, quantity}
}

export default async (req: Request, res: Response) => {
    const {itemName} = req.query
    const recipe = await completeRecipe(recipes.find(recipe => recipe.itemName === itemName), 1)
    res.json(recipe)
}