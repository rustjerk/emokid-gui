<script>
    import { _ } from "svelte-i18n";
    import { navigate } from "svelte-navigator";

    import * as api from "../api.js";

    import BigLogo from "../components/BigLogo.svelte";
    import Button from "../components/Button.svelte";
    import Checkbox from "../components/Checkbox.svelte";
    import Form from "../components/Form.svelte";
    import Input from "../components/Input.svelte";
    import Label from "../components/Label.svelte";
    import Row from "../components/Row.svelte";
    import Spacer from "../components/Spacer.svelte";
    import LanguageSelector from "../components/LanguageSelector.svelte";
    import ConnectionDetails from "../components/ConnectionDetails.svelte";
    import { alerts } from "../components/Alert.svelte";

    let username = "";
    let usernameError = "";

    let password = "";

    let passwordConfirmation = "";
    let passwordConfirmationError = "";

    async function register() {
        usernameError = "";
        passwordConfirmationError = "";

        if (password != passwordConfirmation) {
            passwordConfirmationError = "sign_up.passwords_dont_match";
            return;
        }

        try {
            await api.register(username, password)
            let token = await api.login(username, password)
        } catch (e) {
            if (e == "username already taken") 
                usernameError = "sign_up.username_taken";
            else {
                $alerts = [...$alerts, {
                    title: $_("sign_up.error"),
                    short: $_("sign_up.error.short"),
                    details: e
                }];
            }
        }
    }
</script>

<main>
    <div class="form">
        <Form on:submit={register}>
            <BigLogo/>

            <Spacer height=8/>

            <Label text={$_("username")} error={$_(usernameError)}>
                <Input bind:value={username} placeholder={$_("username.placeholder")}/>
            </Label>

            <Label text={$_("password")}>
                <Input bind:value={password} password placeholder={$_("password.placeholder")}/>
            </Label>

            <Label text={$_("password.confirmation")} error={$_(passwordConfirmationError)}>
                <Input bind:value={passwordConfirmation} password placeholder={$_("password.confirmation.placeholder")}/>
            </Label>

            <Spacer height=8/>

            <Checkbox label={$_("eula")}/>

            <Spacer stretch=1/>

            <Row>
                <Button transparent on:click={() => navigate("/")}>{$_("go_back")}</Button>
                <Button type="submit">{$_("sign_up")}</Button>
            </Row>

            <Spacer height=8/>

            <Row>
                <ConnectionDetails/>
                <Spacer/>
                <LanguageSelector/>
            </Row>
        </Form>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: stretch;
        height: 100%;
        background: #16031f;
        background-image: url(/img/scratches.jpg);
    }

    .form {
        background: #330449;
        box-shadow: 0 4px 20px rgb(0 0 0 / 40%);
        padding: 24px 24px 12px 24px;
        margin: 0 auto;
        max-width: 400px;
        min-height: 576px;
        width: 100%;
        border-radius: 6px;
        background-image: url("/img/fire.svg");
        background-repeat: repeat no-repeat;
        background-position: center bottom;
    }
</style>
