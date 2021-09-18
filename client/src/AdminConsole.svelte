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
    </div>
{/if}


<script>
    import api from "./api"

    let skills = ["Armoring", "Arcana", "Cooking", "Engineering", "Furnishing", "Jewelcrafting", "Weaponsmithing"]
    let users = []
    let show = false

    api.get("/users").then(res => {
        if (res.data) {
            users = res.data
            show = true
        }
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