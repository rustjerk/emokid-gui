<script>
    import { _ } from "svelte-i18n";
    import { navigate } from "svelte-navigator";

    import AppPage from "../components/AppPage.svelte";
    import Button from "../components/Button.svelte";
    import Spacer from "../components/Spacer.svelte";
    import Row from "../components/Row.svelte";
    import Spoiler from "../components/Spoiler.svelte";
    import { username } from "../api.js";
</script>

<AppPage>
    <div class="container">
        <main>
            <div>{$_("account.welcome", {values: {username: $username}})}</div>

            <!--<Spacer height=12/>

            <Spoiler label={$_("account.change_password")}>
                Here you can change your password.
            </Spoiler>

            <Spacer height=12/>

            <Spoiler label={$_("account.delete_account")}>
                Here you can delete your account.
            </Spoiler>-->

            <Spacer height=24/>

            <Row>
                <Spacer/>
                <Button on:click={() => navigate("/")}>{$_("sign_out")}</Button>
            </Row>
        </main>
    </div>
</AppPage>

<style>
    .container {
        height: 100%;
        background-image: url("/img/emo.svg");
        background-repeat: repeat repeat;
        background-position: center center;
        background-size: 20em;
        padding: 24px;
    }

    main {
        background: #280438;
        border: 2px solid #520A75;
        box-shadow: 0 4px 20px rgb(0 0 0 / 40%);
        padding: 24px;
        margin: 0 auto;
        max-width: 400px;
        width: 100%;
        border-radius: 6px;
    }
</style>
