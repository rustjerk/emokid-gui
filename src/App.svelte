<script>
    import { Router, Route, navigate, useLocation } from "svelte-navigator";

    import Login from "./routes/Login.svelte";
    import Register from "./routes/Register.svelte";
    import TableView from "./routes/TableView.svelte";
    import AreaView from "./routes/AreaView.svelte";
    import Commands from "./routes/Commands.svelte";
    import Account from "./routes/Account.svelte";

    import Alert, { alerts } from "./components/Alert.svelte";
</script>

<Router primary={false}>
    <Route path="/"><Login/></Route>
    <Route path="/register"><Register/></Route>
    <Route path="/table"><TableView/></Route>
    <Route path="/area"><AreaView/></Route>
    <Route path="/commands"><Commands/></Route>
    <Route path="/account"><Account/></Route>
</Router>

{#each $alerts as alert, i}
    <Alert title={alert.title} on:close={() => {
        $alerts.splice(i);
        $alerts = $alerts;
    }}>
        <div slot="short">{alert.short}</div>
        <div slot="details">{alert.details}</div>
    </Alert>
{/each}

<div id="modals"></div>
