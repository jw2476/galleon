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
<div class="field">
    <div class="control">
        <button class="button is-primary {loading ? 'is-loading' : ''}" on:click={submitCraftingRequest}>Submit</button>
    </div>
    {#if success}
        <p class="help is-primary">Successfully requested</p>
    {/if}
</div>

<script>
    import api from "./api";

    let names = []

    let item = "Select an Item"
    let itemRequiredError = false
    let perk = "Any"
    let attempts = 1
    let attemptsFormatError = false
    let notes
    let loading = false
    let success = false

    api.get("/javelindata_craftingnames.json").then(res => {
        names = ["Select an Item", ...Object.values(res.data).sort()]
    })

    async function submitCraftingRequest() {
        success = false
        loading = true

        if (!item || item === "Select an Item") { // Checks for not selected, svelte doesnt like select values that are added after page load
            itemRequiredError = true
            return
        }

        if (isNaN(attempts)) {
            attemptsFormatError = true
            return
        }


        itemRequiredError = false
        attemptsFormatError = false

        await api.post("/craft", {
            item,
            perk,
            attempts,
            notes
        })

        success = true
        loading = false
    }
</script>