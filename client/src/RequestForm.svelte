<div class="field">
    <label class="label">Item</label>
    <div class="control">
        <div class="select">
            <a href="https://nwdb.info/db/item/{recipe?.itemID}">
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
<div class="field">
    <div class="control">
        <button class="button is-primary {loading ? 'is-loading' : ''}" on:click={submitCraftingRequest}>Submit</button>
    </div>
    {#if success}
        <p class="help is-primary">Successfully requested</p>
    {/if}
</div>

<script lang="ts">
    import api from "./api";
    import {reloadEmbeds} from "./embed"

    reloadEmbeds()

    let names = []

    let itemName = "Select an Item"
    let itemRequiredError = false
    let loading = false
    let success = false

    let recipe: Recipe

    api.get("/itemNames").then(res => {
        names = ["Select an Item", ...res.data.sort()]
    })

    async function getItemChoices(recipe: Recipe) {
        for (let ingredient of recipe.ingredients) {
            consol
            if (ingredient.type === "Category_Only") {
                const res = await api.get("/category", {id: ingredient.ingredientID})
                console.log(recipe)
                ingredient = res.data
                console.log(recipe)
            }
        }
    }

    async function getRecipe() {
        const res = await api.get("/recipeByName", {params: {itemName}})
        recipe = res.data
        loading = true
        await getItemChoices(recipe)
        loading = false
    }

    async function submitCraftingRequest() {
        success = false

        if (!itemName || itemName === "Select an Item") { // Checks for not selected, svelte doesnt like select values that are added after page load
            itemRequiredError = true
            return
        }

        loading = true

        itemRequiredError = false

        success = true
        loading = false
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