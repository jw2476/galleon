<script lang="ts">
    import 'bulma/css/bulma.css'
    import Authenticate from "./Authenticate.svelte";
    import RequestForm from "./RequestForm.svelte";
    import AdminConsole from "./AdminConsole.svelte";
    import CraftingRequests from "./CraftingRequests.svelte";
    import {onMount} from "svelte";
    import api from "./api";
    import {ICraftingRequestBase} from "./types/request";
    import type {IUser} from "../../server/src/models/user";
    import YourRequests from "./YourRequests.svelte";

    let authenticated
    let availableRequests = []
    let assignedRequests = []
    let yourRequests = []
    let user: IUser

    onMount(async () => {
        availableRequests = (await api.get("/availableRequests")).data
        assignedRequests = (await api.get("/assignedRequests")).data
        yourRequests = (await api.get("/yourRequests")).data
        user = (await api.get("/me")).data
    })

    async function assignToRequest(request: ICraftingRequestBase) {
        await api.post("/assignToRequest", request)
        return true
    }

    async function submitGatheringMaterials(request: ICraftingRequestBase) {
        await api.post("/submitGatheringMaterials", request)
        return false
    }

    async function completeRequest(request: ICraftingRequestBase) {
        await api.post("/complete", request)
        return true
    }

    function yourRequestsDescription(request: ICraftingRequestBase) {
        return `Assigned to: ${request.assignedTo?.username ? request.assignedTo?.username : "No-one"}`
    }

    function assignedRequestsDescription(request: ICraftingRequestBase) {
        return `Requested by: ${request.requester.username}\nMaterials Submitted: ${request.materialsSubmitted ? "Yes" : "No"}`
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
    <div class="has-background-notrlydark">
        {#if authenticated}
            <br>
            <br>
            <section>
                <div class="container">
                    <RequestForm/>
                </div>
            </section>
            <br>
            <br>
            <section>
                <div class="container">
                    <YourRequests bind:craftingRequests={yourRequests} title="Your Crafting Requests" description={yourRequestsDescription}
                                      buttonCallback={submitGatheringMaterials} buttonText="Submit Gathering Materials"
                                      errorText="There was an error trying to complete the request, please retry and if the issue persists contact Jw2476"/>
                </div>
            </section>
            <br>
            <br>
            {#if user?.skills.length > 0}
                <section>
                    <div class="container">
                        <CraftingRequests bind:craftingRequests={assignedRequests} title="Assigned Crafting Requests" description={assignedRequestsDescription}
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
            {/if}
            <section>
                <div class="container">
                    <AdminConsole/>
                </div>
            </section>
        {/if}
    </div>
</main>

<style lang="sass">
  .title
    font-size: 72px
  .has-background-notrlydark
    background-color: lighten(#363636, 10)
    color: white
</style>