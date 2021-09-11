<div class="field">
    <label class="label">Item</label>
    <div class="control">
        <div class="select">
            <a href="{recipe ? 'https://nwdb.info/db/recipe/' + recipe.originalID : ''}">
                <select bind:value={itemName} on:change={getRecipe}>
                    {#each names as name}
                        <option>{name}</option>
                    {/each}
                </select>
            </a>
        </div>
    </div>
    {#if itemRequiredError}
        <p class="help is-danger">Please select an item</p>
    {/if}
</div>
{#if recipe}
    <ItemChoice recipe={recipe} bind:selectedValues={selectedValues}/>
{/if}
<div class="field">
    <div class="control">
        <button class="button is-primary {loading ? 'is-loading' : ''}" on:click={submitCraftingRequest}>Submit</button>
    </div>
    {#if success}
        <p class="help is-primary">Successfully requested</p>
    {/if}
    {#if itemChoiceUnselectedError}
        <p class="help is-danger">One or more item choices are unselected, please fill them in</p>
    {/if}
    {#if error}
        <p class="help is-danger">An error occured, please try again, if the issue persists contact Jw2476</p>
    {/if}
</div>

<script lang="ts">
    import api from "./api";
    import {loadEmbeds} from "./embed"
    import ItemChoice from "./request/ItemChoice.svelte";
    import {isIngredientCategory, isIngredientRecipe} from "./types/crafting";

    let names = []

    let itemName = "Select an Item"
    let itemRequiredError = false
    let itemChoiceUnselectedError = false
    let loading = false
    let success = false
    let error = false

    let recipe: Recipe
    let selectedValues: Record<string, string> = {}

    api.get("/itemNames").then(res => {
        names = ["Select an Item", ...res.data.sort()]
    })

    async function getRecipe() {
        loadEmbeds()
        const res = await api.get("/recipeByName", {params: {itemName}})
        recipe = res.data
        selectedValues = {}
    }

    async function completeRecipe(recipe: Recipe, selectedValues: Record<string, string>): Recipe {
        for (let i = 0; i < recipe.ingredients.length; i++) {
            const ingredient = recipe.ingredients[i]
            if (isIngredientCategory(ingredient)) {
                const selectedValue = ingredient.recipes.find(recipe => recipe.itemID === selectedValues[ingredient.id])
                if (isIngredientRecipe(selectedValue)) {
                    recipe.ingredients[i] = await completeRecipe(selectedValue, selectedValues)
                } else {
                    recipe.ingredients[i] = selectedValue
                }
            } else if (isIngredientRecipe(ingredient)) {
                recipe.ingredients[i] = await completeRecipe(ingredient, selectedValues)
            }
        }
        return recipe
    }

    async function submitCraftingRequest() {
        try {
            success = false
            itemRequiredError = false
            itemChoiceUnselectedError = false
            error = false

            if (!itemName || itemName === "Select an Item") { // Checks for not selected, svelte doesnt like select values that are added after page load
                itemRequiredError = true
                return
            }
            if (Object.values(selectedValues).includes("") || (Object.keys(selectedValues).length === 0 && selectedValues.constructor === Object)) {
                itemChoiceUnselectedError = true
                return
            }

            loading = true

            const completedRecipe = await completeRecipe(recipe, selectedValues)
            await api.post("/submitRequest", completedRecipe)

            success = true
            loading = false
        } catch (e) {
            console.error(e)
            error = true
            loading = false
        }
    }

    type IngredientType = undefined | "Category_Only" | "Item" | "Currency"

    type Ingredient = {
        ingredientID: string
        ingredientName: string
        type: IngredientType
        quantity: number
    }

    type Recipe = {
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
    }

</script>