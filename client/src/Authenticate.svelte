<script>
    import api from "./api";
    import {Button, Progress} from "svelma"

    const AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=873136954290610208&redirect_uri=${encodeURI(window.location.href)}&response_type=code&scope=identify`

    export let authenticated = !!localStorage.getItem("token")
    let code = new URLSearchParams(window.location.search).get("code")
    let authenticating = code && !authenticated
    let invalid_code = false
    let forbidden = false

    if (authenticating) {
        let res = api.post("/auth", {code, redirect_uri: window.location.href.split('?')[0]}).then(res => {
            localStorage.setItem("token", res.data)
            authenticated = true
            location.reload()
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