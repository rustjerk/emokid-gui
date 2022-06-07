<script>
    import { _ } from "svelte-i18n";
    import { navigate } from "svelte-navigator";

    import * as api from "../api.js";
    import { token } from "../api.js";

    import BigLogo from "../components/BigLogo.svelte";
    import Button from "../components/Button.svelte";
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
    let passwordError = "";

    async function login() {
        usernameError = "";
        passwordError = "";

        try {
            $token = await api.login(username, password);
            navigate("/table");
        } catch (e) {
            if (e == "no such user") 
                usernameError = "sign_in.no_such_user";
            else if (e == "invalid password") 
                passwordError = "sign_in.invalid_password";
            else {
                $alerts = [...$alerts, {
                    title: $_("sign_in.error"),
                    short: $_("sign_in.error.short"),
                    details: e
                }];
            }
        }
    }

    function rickroll() {
        const { shell } = require("electron");
        shell.openExternal("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }
</script>

<main>
    <div class="form">
        <Form on:submit={login}>
            <BigLogo/>

            <Spacer height=8/>

            <Label text={$_("username")} error={$_(usernameError)}>
                <Input bind:value={username} placeholder={$_("username.placeholder")}/>
            </Label>

            <Label text={$_("password")} error={$_(passwordError)}>
                <Input bind:value={password} password placeholder={$_("password.placeholder")}/>
            </Label>

            <Spacer height=8/>

            <a href="#/" on:click={rickroll}>{$_("sign_in.forgot_password")}</a>
            <a href="#/" on:click={() => navigate("/register")}>{$_("sign_in.no_account")}</a>
            
            <Spacer stretch=1/>

            <Row>
                <Button transparent on:click={() => navigate("/register")}>{$_("sign_up")}</Button>
                <Button type="submit">{$_("sign_in")}</Button>
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
