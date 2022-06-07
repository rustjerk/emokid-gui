<script>
    import { _ } from "svelte-i18n";
    import Connection from "svelte-material-icons/Connection.svelte";

    import IconButton from "./IconButton.svelte";
    import Input from "../components/Input.svelte";
    import Label from "../components/Label.svelte";
    import Form from "../components/Form.svelte";
    import Row from "../components/Row.svelte";
    import Spacer from "../components/Spacer.svelte";
    import Button from "../components/Button.svelte";
    import Dialog from "../components/Dialog.svelte";

    import { hostname, port } from "../api.js";

    let newHostname;
    let newPort;
    let dialog;

    const open = () => {
        dialog.show();
        newHostname = $hostname;
        newPort = $port;
    };

    function close() {
        dialog.hide();
    }

    function save() {
        dialog.hide();
        $hostname = newHostname;
        $port = parseInt(newPort);
    }
</script>

<IconButton on:click={open}>
    <Connection/>
</IconButton>

<Dialog bind:this={dialog} title={$_("connection")}>
    <Form on:submit={save}>
        <Label text={$_("hostname")}>
            <Input bind:value={newHostname} placeholder={$_("hostname.placeholder")}/>
        </Label>

        <Label text={$_("port")}>
            <Input bind:value={newPort} integer placeholder={$_("port.placeholder")}/>
        </Label>

        <Spacer height=8/>

        <Row>
            <Button on:click={close} transparent>{$_("cancel")}</Button>
            <Button type="submit">{$_("save")}</Button>
        </Row>
    </Form>
</Dialog>
