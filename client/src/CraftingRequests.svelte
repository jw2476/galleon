<div class="box notification is-darkish has-text-centered">
    <p class="title">{title}</p>
    {#if error}
        <p class="has-text-danger">{errorText}</p>
    {/if}
    {#each requests as row}
        <div class="columns">
            {#each row as request}
                <div class="column">
                    <div class="box notification is-dark">
                        <p class="subtitle">{request.recipe.itemName}</p>
                        <p>Requested By: {request.requester.username}</p>
                        <br>
                        <button class="button is-primary is-outlined {loading ? 'is-loading' : ''}"
                                on:click={() => callback(request)}>{buttonText}</button>
                    </div>
                </div>
            {/each}
        </div>
    {/each}
    <br>
</div>

<script lang="ts">
    import {ICraftingRequestBase} from "./types/request"

    export let craftingRequests: ICraftingRequestBase[]
    export let title: string
    export let buttonText: string
    export let buttonCallback: (ICraftingRequestBase) => Promise<void>
    export let errorText
    let error: boolean = false
    let loading: boolean = false
    $: requests = craftingRequests.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 5)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])

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

<style lang="sass">
    .box
      height: 100%

    .is-darkish
      background-color: lighten(#363636, 5)
      color: white
</style>