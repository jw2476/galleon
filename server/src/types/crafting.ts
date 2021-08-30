import {DATA} from "../paths";
import {readFileSync} from "fs";

export type IngredientType = undefined | "Category_Only" | "Item" | "Currency"

export type Ingredient = {
    ingredientID: string
    ingredientName: string
    type: IngredientType
    quantity: number
}


export type CraftingData = {
    recipes: [{
        itemID: string
        itemName: string
        itemType: string
        outputQuantity: number
        ingredients: Ingredient[]
        tradeskill: string
        recipeLevel: number
        cooldownSeconds?: number
        amountPerCooldown?: number
        bindOnPickup: boolean
        bindOnEquip: boolean
        minGearScore?: number
        maxGearScore?: number
        minGearScoreBuff?: number
        maxGearScoreBuff?: number
    }],
    categories: Record<string, Record<string, string>>
}


export function getCraftingData(): CraftingData {
    return JSON.parse(readFileSync(DATA + "/crafting.json", {encoding: "utf-8"}))
}
