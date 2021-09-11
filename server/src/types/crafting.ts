import {DATA} from "../paths";
import {readFileSync} from "fs";

export type IngredientType = undefined | "Category_Only" | "Item" | "Currency"

export type Ingredient = RecipeRef | Item | Category

export type Item = {
    itemID: string
    itemName: string
    quantity: number
    gearScoreBuff?: number
    nwdbURL: string
}

export type Category = {
    recipes: Array<RecipeRef | Item>
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

export type RecipeRef = {
    itemID: string,
    ref: true
}

export function isIngredientCategory(ingredient: Ingredient): ingredient is Category {
    return !!(ingredient as Category).recipes;
}

export function isIngredientItem(ingredient: Ingredient): ingredient is Item {
    return !!(ingredient as Item).itemName;
}

export function isIngredientRecipe(ingredient: Ingredient): ingredient is RecipeRef {
    return !!(ingredient as RecipeRef).ref;
}


export function getCraftingData(): Recipe[] {
    return JSON.parse(readFileSync(DATA + "/crafting.json", {encoding: "utf-8"}))
}
