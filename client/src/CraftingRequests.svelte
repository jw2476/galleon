<div class="box notification is-darkish has-text-centered">
    <p class="title">{title}</p>
    {#if error}
        <p class="has-text-danger">{errorText}</p>
    {/if}
    {#each requests as row, i}
        <div class="columns">
            {#each row as request, j}
                <div class="column">
                    <div class="box notification is-dark">
                        <p class="subtitle">{request.recipe.itemName}</p>
                        {#each description(request).split("\n") as line}
                            <p>{line}</p>
                        {/each}
                        <br>
                        <p class="buttons is-centered">
                            {#if buttonText}
                                <button class="button is-primary is-outlined {loading ? 'is-loading' : ''}"
                                        on:click={() => callback(request)}>{buttonText}</button>
                            {/if}
                            {#if cancelable}
                                <button class="button is-danger is-outlined" on:click={() => cancel(request)}>Cancel</button>
                            {/if}
                        </p>
                        {#if reasonRequired && cancelling[request._id]}
                            <input type="text" class="input is-danger" bind:value={reason} placeholder="Reason for Cancellation">
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/each}
    <br>
</div>

<script lang="ts">
    import {ICraftingRequestBase} from "./types/request"
    import api from "./api";

    export let craftingRequests: ICraftingRequestBase[]
    export let description: (ICraftingRequest) => string = (request: ICraftingRequestBase) => {
        return `Requested By: ${request.requester.username}`
    }
    export let title: string
    export let buttonText: string
    export let buttonCallback: (ICraftingRequestBase) => Promise<boolean>
    export let errorText
    export let cancelable: boolean = false
    export let reasonRequired: boolean = false

    let error: boolean = false
    let loading: boolean = false
    let cancelling: Record<string, boolean> = {}
    let reason: string = ""

    $: requests = craftingRequests.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 4)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])

    async function callback(request: ICraftingRequestBase) {
        try {
            loading = true
            if (await buttonCallback(request)) {
                location.reload()
            }
            loading = false
        } catch {
            error = true
            loading = false
        }
    }

    async function cancel(request: ICraftingRequestBase) {
        if (reasonRequired && !reason) {
            cancelling[request._id] = true
            return
        }
        await api.post("/cancel", {
            request,
            reason
        })
        location.reload()
    }
</script>

<style lang="sass">
  .box
    height: 100%

  .is-darkish
    background-color: lighten(#363636, 5)
    color: white
</style>