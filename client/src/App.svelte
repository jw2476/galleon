<script lang="ts">
    import 'bulma/css/bulma.css'
    import Authenticate from "./Authenticate.svelte";
    import RequestForm from "./RequestForm.svelte";
    import AdminConsole from "./AdminConsole.svelte";
    import CraftingRequests from "./CraftingRequests.svelte";
    import {onMount} from "svelte";
    import api from "./api";
    import {ICraftingRequestBase} from "./types/request";

    let authenticated
    let availableRequests = []
    let assignedRequests = []

    onMount(async () => {
        availableRequests = (await api.get("/availableRequests")).data
        assignedRequests = (await api.get("/assignedRequests")).data
        console.log(availableRequests)
    })

    async function assignToRequest(request: ICraftingRequestBase) {
        await api.post("/assignToRequest", request)
    }

    async function completeRequest(request: ICraftingRequestBase) {

    }
</script>

<main>
    <section class="hero is-primary">
        <div class="hero-body has-text-centered">
            <p class="title">
                Galleon
            </p>
            <p class="subtitle">
                Logistics tool for Pirate Gaming
            </p>
            <br>
            <Authenticate bind:authenticated={authenticated}/>
        </div>
    </section>
    {#if authenticated}
        <br>
        <br>
        <section>
            <div class="container box">
                <RequestForm/>
            </div>
        </section>
        <br>
        <br>
        <section>
            <div class="container">
                <CraftingRequests bind:craftingRequests={assignedRequests} title="Assigned Crafting Requests"
                                  buttonCallback={completeRequest} buttonText="Complete"
                                  errorText="There was an error trying to complete the request, please retry and if the issue persists contact Jw2476"/>
            </div>
        </section>
        <br>
        <br>
        <section>
            <div class="container">
                <CraftingRequests bind:craftingRequests={availableRequests} title="Available Crafting Requests"
                                  buttonCallback={assignToRequest} buttonText="Assign to Recipe"
                                  errorText="Someone has already assigned themselves to this request"/>
            </div>
        </section>
        <br>
        <br>
        <section>
            <div class="container">
                <AdminConsole/>
            </div>
        </section>
    {/if}
</main>

<style lang="sass">
  .title
    font-size: 72px
</style>