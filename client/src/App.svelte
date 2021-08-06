<script>
	import 'bulma/css/bulma.css'
	import { Button, Progress } from "svelma"
	import api from "./api";

	const AUTH_URL = "https://discord.com/api/oauth2/authorize?client_id=873136954290610208&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&response_type=code&scope=identify"

	let authenticated = !!localStorage.getItem("token")

	let code = new URLSearchParams(window.location.search).get("code")
	if (code && !authenticated) {
		api.post("/auth", {code}).then(res => {
			localStorage.setItem("token", res.data)
			window.location.assign(window.location.href)
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
				<a href={AUTH_URL}>
					<Button type="is-dark">Login with Discord</Button>
				</a>
			{/if}
			{#if code}
				<p class="title is-3">Authenticating</p>
				<Progress max="100"/>
			{/if}
		</div>
	</section>
</main>

<style lang="sass">
	.title
		font-size: 72px
</style>