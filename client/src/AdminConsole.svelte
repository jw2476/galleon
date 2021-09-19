{#if show}
    <div class="box notification is-darkish">
        <table class="table is-dark notification">
            <thead>
            <th class="has-text-white">Username</th>
            {#each skills as skill}
                <th class="has-text-white">{skill}</th>
            {/each}
            </thead>
            <tbody>
            {#each users as user}
                <tr>
                    <th class="has-text-white">{user.username}</th>
                    {#each skills as skill}
                        <td class="has-text-white"><input type="checkbox" checked="{user.skills[skill] !== undefined}"
                                   on:click={() => toggle(skill, user)}></td>
                    {/each}
                </tr>
            {/each}

            </tbody>
        </table>
        <table class="table is-dark notification">
            <thead>
            <th class="has-text-white">Username</th>
            {#each skills as skill}
                <th class="has-text-white">{skill}</th>
            {/each}
            </thead>
            <tbody>
            {#each users.filter(user => Object.keys(user.skills).length !== 0) as user}
                <tr>
                    <th class="has-text-white">{user.username}</th>
                    {#each skills as skill}
                        {#if user.skills[skill] !== undefined}
                            <td class="has-text-white"><input type="text" class="input" placeholder="0" bind:value={user.skills[skill]}></td>
                        {:else}
                            <td>N/A</td>
                        {/if}
                    {/each}
                </tr>
            {/each}

            </tbody>
        </table>
        <button class="button is-primary" on:click={submit}>Submit</button>
        <br>
        <br>
        <p class="subtitle">Available or Assigned Requests per Tradeskill</p>
        {#each skills as skill}
            <p class="has-text-white">{skill}: {requests?.filter(request => request.tradeskill === skill).length}</p>
        {/each}
        <br>
        <p class="subtitle">Assigned Requests per Crafter</p>
        {#each Object.keys(assignedRequests) as username}
            <p>{username}: {assignedRequests[username] ? assignedRequests[username] : "0"}</p>
        {/each}
        <br>
        <p class="subtitle">Completed Requests per Crafter</p>
        {#each users.filter(user => Object.keys(user.skills).length !== 0) as user}
            <p>{user.username}: {user.completed ? user.completed : "0"}</p>
        {/each}
    </div>
{/if}


<script lang="ts">
    import api from "./api"
    import {onMount} from "svelte";
    import {ICraftingRequestBase} from "./types/request"
    import {IUserBase} from "./types/user";

    let skills = ["Armoring", "Arcana", "Cooking", "Engineering", "Furnishing", "Jewelcrafting", "Weaponsmithing"]
    let users: IUserBase[] = []
    let requests: ICraftingRequestBase[]
    let show = false
    let assignedRequests: Record<string, number> = {}

    onMount(async () => {
        requests = (await api.get("requests")).data
        users = (await api.get("/users")).data

        for (const user of users) {
            if (!user.skills) {
                user.skills = {}
            }
        }
        show = true
        for (const request of requests) {
            if (assignedRequests[request.assignedTo?.username] === undefined) {
                assignedRequests[request.assignedTo?.username] = 0
            }
            assignedRequests[request.assignedTo?.username] += 1
        }
        assignedRequests["Unassigned"] = assignedRequests[undefined]
        delete assignedRequests[undefined]
    })

    function toggle(skill: string, user: IUserBase) {
        if (user.skills[skill] !== undefined) {
            delete skills[skill]
        } else {
            user.skills[skill] = 0
        }
    }

    function submit() {
        api.post("/setSkills", users)
    }
</script>

<style lang="sass">
  .is-darkish
      background-color: lighten(#363636, 5)
      color: white

  .table
    width: 100%
</style>