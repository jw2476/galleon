<p class="title">Current Requests</p>
{#each requests as req}
    <div class="box content">
        <h2>{req.item}</h2>
        <p>Perk: <b>{req.perk}</b></p>
        <p>Requested Attempts: <b>{req.attempts}</b></p>
        <p>{req.notes ? req.notes : ""}</p>
        <button class="button is-primary {completing ? 'is-loading' : ''}" on:click={() => complete(req)}>Complete</button>
    </div>
{/each}
{#if requests.length === 0}
    <p>No requests right now!</p>
{/if}

<script>
    import api from "./api";
    import {onMount} from "svelte";

    let requests = []
    let completing = false

    onMount(async () => {
        requests = (await api.get("/craftingRequests")).data
    })

    async function complete(request) {
        completing = true
        await api.post("/complete", request)
        completing = false
        const index = requests.indexOf(request);
        if (index > -1) {
            requests.splice(index, 1);
        }
    }
</script>