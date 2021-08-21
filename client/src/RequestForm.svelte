<div class="field">
    <label class="label">Item</label>
    <div class="control">
        <div class="select">
            <select bind:value={item}>
                {#each names as name}
                    <option>{name}</option>
                {/each}
            </select>
        </div>
    </div>
    {#if itemRequiredError}
        <p class="help is-danger">Please select an item</p>
    {/if}
</div>
<div class="field">
    <label class="label">Perk</label>
    <div class="control">
        <input class="input" type="text" placeholder="Strength" bind:value={perk}>
    </div>
</div>
<div class="field">
    <label class="label">Total Attempts</label>
    <div class="control">
        <input class="input" type="text" placeholder="1" bind:value={attempts}>
    </div>
    {#if attemptsFormatError}
        <p class="help is-danger">Attempts needs to be a whole number</p>
    {/if}
</div>
<div class="field">
    <label class="label">Notes for the Crafter</label>
    <div class="control">
        <textarea class="textarea" bind:value={notes}></textarea>
    </div>
</div>
<button class="button is-primary" on:click={submitCraftingRequest}>Submit</button>

<script>
    import api from "./api";

    let names = []

    let item
    let itemRequiredError = false
    let perk = "Any"
    let attempts = 1
    let attemptsFormatError = false
    let notes

    api.get("/javelindata_craftingnames.json").then(res => {
        names = ["Select an Item", ...Object.values(res.data).sort()]
    })

    function submitCraftingRequest() {
        if (!item) { // Checks for not selected, svelte doesnt like select values that are added after page load
            itemRequiredError = true
            return
        }
        
        if (isNaN(attempts)) {
            attemptsFormatError = true
            return
        }


        itemRequiredError = false
        attemptsFormatError = false

        api.post("/craft", {
            item,
            perk,
            attempts,
            notes
        })
    }
</script>