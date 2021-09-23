import {CompletedRecipe, isCompletedIngredientRecipe, Item} from "../types/crafting";

export async function calculateGatheringMaterials(recipe: CompletedRecipe, baseQuantity: number, materials: Record<string, Item> = {}): Promise<Record<string, Item>> {
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