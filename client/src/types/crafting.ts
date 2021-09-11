export type IngredientType = undefined | "Category_Only" | "Item" | "Currency"

export type Ingredient = Recipe | Item | Category

export type Item = {
    itemID: string
    itemName: string
    quantity: number
    gearScoreBuff?: number
    nwdbURL: string
}

export type Category = {
    recipes: Array<Recipe | Item>
    name: string
    id: string
}

export type Recipe = {
    itemID: string
    originalID: string
    itemName: string
    itemType: string
    quantity: number
    ingredients: Ingredient[]
    tradeskill: string
    recipeLevel: number
    cooldownSeconds?: number
    amountPerCooldown?: number
    bindOnPickup: boolean
    minGearScore?: number
    maxGearScore?: number
    gearScoreBuff?: number
    nwdbURL: string
}

export function isIngredientCategory(ingredient: Ingredient): ingredient is Category {
    return !!(ingredient as Category).recipes;
}

export function isIngredientItem(ingredient: Ingredient): ingredient is Item {
    return !!(ingredient as Item).itemName;
}

export function isIngredientRecipe(ingredient: Ingredient): ingredient is Recipe {
    return !!(ingredient as Recipe).originalID;
}