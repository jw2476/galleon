{#if show}
    <div class="box">
        <table class="table">
            <thead>
            <th>Username</th>
            {#each skills as skill}
                <th>{skill}</th>
            {/each}
            </thead>
            <tbody>
            {#each users as user}
                <tr>
                    <th>{user.username}</th>
                    {#each skills as skill}
                        <td><input type="checkbox" checked="{user.skills.includes(skill)}"
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