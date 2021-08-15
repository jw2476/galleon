<script>
    import 'bulma/css/bulma.css'
    import Authenticate from "./Authenticate.svelte";
    import RequestForm from "./RequestForm.svelte";
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
            <Authenticate/>
        </div>
    </section>
    <br>
    <br>
    <section>
        <div class="container box">
            <RequestForm/>
        </div>
    </section>
</main>

<style lang="sass">
  .title
    font-size: 72px
</style>