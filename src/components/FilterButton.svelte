<script>
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";
    import { createPopperActions } from "svelte-popperjs";

    import FilterOff from "svelte-material-icons/FilterOff.svelte";
    import FilterMenu from "svelte-material-icons/FilterMenu.svelte";
    import Filter from "svelte-material-icons/Filter.svelte";

    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import Label from "./Label.svelte";
    import Row from "./Row.svelte";
    import Spacer from "./Spacer.svelte";
    import Popup from "./Popup.svelte";
    import Form from "./Form.svelte";

    import FilterGenre from "./FilterGenre.svelte";
    import FilterRegex from "./FilterRegex.svelte";
    import FilterNumber from "./FilterNumber.svelte";
    import FilterDatetime from "./FilterDatetime.svelte";

    let visible = false;
    let privateFilter = "";

    export let kind = "regex";
    export let state = {};

    let filter;

    const [popperRef, popperContent] = createPopperActions({
        placement: "bottom",
        modifiers: [{
            name: "offset",
            options: { offset: [0, 6] }
        }, {
            name: "arrow",
            options: { padding: 8 }
        }, {
            name: "preventOverflow",
            options: {
                altAxis: true,
                padding: 16
            },
        }]
    });

    const popperOpts = {};

    const dispatch = createEventDispatcher();

    function submit(e) {
        visible = false;
        dispatch("filterChange");
    }

    export function predicate(val) {
        if (!state.filter) return true;
        return state.predicate(val);
    }
</script>

<div class="button" class:visible class:active={state.active} use:popperRef on:click={() => visible = !visible}>
    {#if visible}
        <FilterMenu/>
    {:else if state.active}
        <Filter/>
    {:else}
        <FilterOff/>
    {/if}
</div>

<Popup transparent {visible} {popperContent} on:close={() => visible = false}>
    <div style="padding: 16px">
        <Form on:submit={filter.submit}>
            {#if kind == "regex"}
                <FilterRegex bind:this={filter} bind:state={state} on:submit={submit}/>
            {:else if kind == "genre"}
                <FilterGenre bind:this={filter} bind:state={state} on:submit={submit}/>
            {:else if kind == "number"}
                <FilterNumber bind:this={filter} bind:state={state} on:submit={submit}/>
            {:else if kind == "datetime"}
                <FilterDatetime bind:this={filter} bind:state={state} on:submit={submit}/>
            {/if}
        </Form>
    </div>
</Popup>

<style>
    .button {
        font-size: 16px;
        color: rgb(255 255 255 / 20%);
        cursor: pointer;
        transform: translate(0, 3px);
        transition: color 100ms ease;
    }

    .button.active, .button.visible {
        color: rgb(255 255 255 / 80%);
    }

    .button.visible {
        transform: translate(2px, 4px);
    }
</style>
