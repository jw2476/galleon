<script>
    import 'bulma/css/bulma.css'
    import {Button, Progress} from "svelma"
    import api from "./api";

    const AUTH_URL = "https://discord.com/api/oauth2/authorize?client_id=873136954290610208&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&response_type=code&scope=identify"

    let authenticated = !!localStorage.getItem("token")
    let code = new URLSearchParams(window.location.search).get("code")
    let authenticating = code && !authenticated
    let invalid_code = false
    let forbidden = false

    if (authenticating) {
        let res = api.post("/auth", {code}).then(res => {
            localStorage.setItem("token", res.data)
        }).catch(error => {
            switch (error.response.status) {
                case(400) : {
                    invalid_code = true;
                    break
                }
                case(403) : {
                    forbidden = true
                }
            }
        }).finally(() => {
            authenticating = false
        })
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
            {#if !authenticated && !code}
                <a href="{AUTH_URL}">
                    <Button type="is-dark">Login with Discord</Button>
                </a>
            {/if}
            {#if authenticating}
                <p class="title is-3">Authenticating</p>
                <Progress max="100"/>
            {/if}
            {#if invalid_code}
                <p class="has-text-danger is-size-3	">An error occurred during authentication please retry</p>
                <br>
                <Button type="is-danger" tag="a" href="{window.location.href.split('?')[0]}">Retry</Button>
            {/if}
            {#if forbidden}
                <p class="is-size-3">Your guild does not appear to use Galleon, to start invite the discord bot!</p>
                <br>
                <Button type="is-dark">Invite</Button>
            {/if}
        </div>
    </section>
</main>

<style lang="sass">
  .title
    font-size: 72px
</style>