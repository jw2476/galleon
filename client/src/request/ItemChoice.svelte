{#if recipe?.ingredients}
    {#each recipe.ingredients as ingredient}
        {#if isIngredientCategory(ingredient)}
            <div class="field">
                <label class="label has-text-white">{recipe.itemName}
                    - {ingredient.name ? ingredient.name : 'Unknown Category'}</label>
                <div class="control">
                    <div class="select {selectedValues[ingredient.id] ? '' : 'is-danger'}">
                        <a href="{selectedValues[ingredient.id] ? (isIngredientRecipe(ingredient.recipes.find(recipe => recipe.itemID === selectedValues[ingredient.id])) ? 'https://nwdb.info/db/recipe/' + selectedValues[ingredient.id] : 'https://nwdb.info/db/item/' + selectedValues[ingredient.id]) : ''}">
                            <select bind:value={selectedValues[ingredient.id]} on:change={loadEmbeds} on:load={() => selectedValues[ingredient.id] = ""}>
                                <option value="">Select an Item</option>
                                {#each ingredient.recipes as categoryIngredient}
                                    <option value={categoryIngredient.itemID}>{categoryIngredient.itemName} {categoryIngredient.gearScoreBuff ? `(+${categoryIngredient.gearScoreBuff}GS)` : ''}</option>
                                {/each}
                            </select>
                        </a>
                    </div>
                </div>
                {#if selectedValues[ingredient.id]?.includes("t51")}
                    <p class="help is-danger">This item requires a epic material, only 10 of these can be crafted in a day so your item may take weeks to complete!</p>
                {/if}
            </div>
            {#if true}
                <div class="tab">
                    <svelte:self
                            recipe={ingredient.recipes.find(recipe => recipe.itemID === selectedValues[ingredient.id])}
                            bind:selectedValues={selectedValues} bind:selectedUses={selectedUses}/>
                </div>
            {/if}
        {:else if isIngredientRecipe(ingredient)}
            <div class="tab">
                <svelte:self recipe={ingredient} bind:selectedValues={selectedValues} bind:selectedUses={selectedUses}/>
            </div>
        {/if}
    {/each}
{/if}


<script lang="ts">
    import {isIngredientCategory, isIngredientRecipe, Recipe} from "../types/crafting";
    import {loadEmbeds} from "../embed"
    import {onDestroy, onMount} from "svelte";

    export let recipe: Recipe
    export let selectedValues: Record<string, string>
    export let selectedUses: Record<string, number> = {}

    onMount(() => {
        loadEmbeds()
        if (recipe?.ingredients) {
            for (const ingredient of recipe?.ingredients) {
                if (isIngredientCategory(ingredient)) {
                    if (!selectedUses[ingredient.id]) {
                        selectedUses[ingredient.id] = 0
                        selectedValues[ingredient.id] = ""
                    }
                    selectedUses[ingredient.id] += 1
                    console.log(selectedUses)
                }
            }
        }
    })

    onDestroy(() => {
        if (recipe?.ingredients) {
            for (const ingredient of recipe?.ingredients) {
                if (isIngredientCategory(ingredient)) {
                    selectedUses[ingredient.id] -= 1
                    console.log(selectedUses)
                    if (selectedUses[ingredient.id] === 0 && selectedValues[ingredient.id] === "") {
                        delete selectedValues[ingredient.id]
                    }
                }
            }
        }
    })

</script>

<style lang="sass">
  .tab
    margin-left: 16px
</style>