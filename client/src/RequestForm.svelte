<div class="field">
    <label class="label">Crafting Skill</label>
    <div class="control">
        <div class="select">
            <select>
                <option>Armouring</option>
                <option>Arcana</option>
                <option>Cooking</option>
                <option>Engineering</option>
                <option>Furnishing</option>
                <option>Jewelcrafting</option>
                <option>Weaponsmithing</option>
            </select>
        </div>
    </div>
</div>
<div class="field">
    <label class="label">Item</label>
    <div class="control">
        <div class="select">
            <select>
                {#each names as name}
                    <option>{name}</option>
                {/each}
            </select>
        </div>
    </div>
</div>
<div class="field">
    <label class="label">Notes for the Crafter</label>
    <div class="control">
        <textarea class="textarea" placeholder="Required Stat Buffs"></textarea>
    </div>
</div>
<button class="button is-primary">Submit</button>

<script>
    import api from "./api";

    let names = []

    api.get("/javelindata_craftingnames.json").then(res => {
        names = Object.values(res.data).sort()
    })
</script>