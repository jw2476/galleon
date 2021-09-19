<div class="box notification is-darkish">
    <p class="title has-text-white has-text-centered">Request an Item</p>
    <div class="box notification is-dark">
        <div class="field">
            <label class="label has-text-white">Search</label>
            <div class="control">
            <input class="input" type="text" placeholder="Search for items..." bind:value={search}>
        </div>
        </div>
        <label class="label has-text-white">Item</label>
        <div class="field">
            <div class="control">
                <div class="select">
                    <a href="{recipe ? 'https://nwdb.info/db/recipe/' + recipe.originalID : ''}">
                        <select bind:value={itemName} on:change={getRecipe}>
                            <option value="">Select an Item...</option>
                            {#each names.filter(name => name.toLowerCase().includes(search.toLowerCase())) as name}
                                <option>{name}</option>
                            {/each}
                        </select>
                    </a>
                </div>
            </div>
        </div>
        {#if recipe}
            <ItemChoice recipe={recipe} bind:selectedValues={selectedValues}/>
        {/if}
        <div class="field">
            <label class="label has-text-white">Quantity</label>
            <div class="control">
                <input class="input" type="text" placeholder="Search for items..." bind:value={quantity}>
            </div>
            {#if notAnIntegerError}
                <p class="help is-danger">Not an integer</p>
            {/if}
        </div>
        <div class="field">
            <div class="control">
                <button class="button is-primary {loading ? 'is-loading' : ''}" on:click={submitCraftingRequest}>Submit
                </button>
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
    </div>
</div>


<script lang="ts">
    import api from "./api";
    import {loadEmbeds} from "./embed"
    import ItemChoice from "./request/ItemChoice.svelte";
    import {isIngredientCategory, isIngredientRecipe, Recipe} from "./types/crafting";
    import {onMount} from "svelte";

    let names = []

    let itemName = "Select an Item"
    let itemRequiredError = false
    let itemChoiceUnselectedError = false
    let loading = false
    let success = false
    let error = false
    let search = ""
    let quantity = "1"
    let notAnIntegerError = false

    let recipe: Recipe
    let selectedValues: Record<string, string> = {}
    let selectedUses: Record<string, number> = {}

    onMount(() => {
        loadEmbeds()
    })

    api.get("/itemNames").then(res => {
        names = ["Select an Item", ...res.data.sort()]
    })

    async function getRecipe() {
        loadEmbeds()
        const res = await api.get("/recipeByName", {params: {itemName}})
        recipe = res.data
        console.log(recipe)
        selectedValues = {}
    }

    async function completeRecipe(recipe: Recipe, selectedValues: Record<string, string>): Promise<Recipe> {
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
            notAnIntegerError = false
            error = false

            if (!itemName || itemName === "Select an Item") { // Checks for not selected, svelte doesnt like select values that are added after page load
                itemRequiredError = true
                return
            }
            if (isNaN(parseInt(quantity))) {
                notAnIntegerError = true
                return
            }

            if (Object.values(selectedValues).includes("")) {
                itemChoiceUnselectedError = true
                return
            }

            loading = true

            const completedRecipe = await completeRecipe(recipe, selectedValues)
            completedRecipe.quantity = parseInt(quantity)
            await api.post("/submitRequest", completedRecipe)

            success = true
            loading = false
            location.reload()
        } catch (e) {
            console.error(e)
            error = true
            loading = false
        }
    }
</script>

<style lang="sass">
  .is-darkish
    background-color: lighten(#363636, 5)
    color: white

  .select, select
    width: 100%
</style>