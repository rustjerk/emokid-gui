<script>
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";

    import Label from "./Label.svelte";
    import Input from "./Input.svelte";
    import Spacer from "./Spacer.svelte";
    import Row from "./Row.svelte";
    import Button from "./Button.svelte";

    export let state;
    let editState = state.regex || "";

    export function cancel() {
        editState = "";
        submit();
    }

    const dispatch = createEventDispatcher();

    export function submit() {
        if (state.regex == editState) return;

        state.active = editState.length > 0;
        state.regex = editState;
        state.predicate = (val) => {
            if (editState == "") return true;
            return new RegExp(editState).test(val);
        };

        dispatch("submit");
    }
</script>

<Label text={$_("filter")}>
    <Input required={false} bind:value={editState} placeholder={$_("filter.regex.placeholder")}/>
</Label>
<Spacer height=8/>
<Row>
    <Button on:click={cancel} transparent>{$_("clear")}</Button>
    <Button on:click={submit} type="submit">{$_("save")}</Button>
</Row>
