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
                        <td class="has-text-white"><input type="checkbox" checked="{user.skills.includes(skill)}"
                                   on:click={() => toggle(skill, user)}></td>
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
        {#each users.filter(user => user.skills.length !== 0) as user}
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

    function toggle(skill, user) {
        if (user.skills.includes(skill)) {
            const index = user.skills.indexOf(skill);
            if (index > -1) {
                user.skills.splice(index, 1);
            }
        } else {
            user.skills.push(skill)
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