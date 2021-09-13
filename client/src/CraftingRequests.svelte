<div class="box is-dark has-text-centered">
    <p class="title">{title}</p>
    {#if error}
        <p class="has-text-danger">{errorText}</p>
    {/if}
    {#each craftingRequests as craftingRequest}
        <div class="box">
            <p class="title">{craftingRequest.recipe.itemName}</p>
            <p>Requested By: {craftingRequest.requester.username}</p>
            <br>
            <button class="button is-primary {loading ? 'is-loading' : ''}" on:click={() => callback(craftingRequest)}>{buttonText}</button>
        </div>
    {/each}
</div>

<script lang="ts">
    import {ICraftingRequestBase} from "./types/request"

    export let craftingRequests: ICraftingRequestBase[] = []
    export let title: string
    export let buttonText: string
    export let buttonCallback: (ICraftingRequestBase) => Promise<void>
    export let errorText
    let error: boolean = false
    let loading: boolean = false

    async function callback(request: ICraftingRequestBase) {
        try {
            loading = true
            await buttonCallback(request)
            location.reload()
        } catch {
            error = true
            loading = false
        }
    }
</script>