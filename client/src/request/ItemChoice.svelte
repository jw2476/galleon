{#if recipe?.ingredients}
    {#each recipe.ingredients as ingredient}
        {#if isIngredientCategory(ingredient)}
            <div class="field">
                <label class="label">{recipe.itemName}
                    - {ingredient.name ? ingredient.name : 'Unknown Category'}</label>
                <div class="control">
                    <div class="select {selectedValues[ingredient.id] ? '' : 'is-danger'}">
                        <a href="{selectedValues[ingredient.id] ? (isIngredientRecipe(ingredient.recipes.find(recipe => recipe.itemID === selectedValues[ingredient.id])) ? 'https://nwdb.info/db/recipe/' + selectedValues[ingredient.id] : 'https://nwdb.info/db/item/' + selectedValues[ingredient.id]) : ''}">
                            <select bind:value={selectedValues[ingredient.id]} on:change={loadEmbeds}>
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
                            bind:selectedValues={selectedValues}/>
                </div>
            {/if}
        {:else if isIngredientRecipe(ingredient)}
            <div class="tab">
                <svelte:self recipe={ingredient} bind:selectedValues={selectedValues}/>
            </div>
        {/if}
    {/each}
{/if}


<script lang="ts">
    import {isIngredientCategory, isIngredientRecipe, Recipe} from "../types/crafting";
    import {loadEmbeds} from "../embed"

    export let recipe: Recipe
    export let selectedValues: Record<string, string>
</script>

<style lang="sass">
  .tab
    margin-left: 16px
</style>