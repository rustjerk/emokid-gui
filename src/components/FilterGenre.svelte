<script>
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";

    import Label from "./Label.svelte";
    import Checkbox from "./Checkbox.svelte";
    import Spacer from "./Spacer.svelte";
    import Row from "./Row.svelte";
    import Button from "./Button.svelte";

    import genres from "../genres.js";

    export let state;

    let selected = {};
    let allSelected = true;

    function reset() {
        selected.null = true;

        for (let genre of genres) {
            selected[genre] = true;
        }

        allSelected = true;
    }

    reset();

    Object.assign(selected, state.selected);
    allSelected = Object.values(selected).every(v => v);

    function onAllInput(e) {
        for (let genre of Object.keys(selected)) {
            selected[genre] = e.target.checked;
        }
    }

    function onGenreInput(e, genre) {
        selected[genre] = e.target.checked;

        allSelected = true;
        for (let genre of Object.keys(selected)) {
            if (!selected[genre]) {
                allSelected = false;
                break;
            }
        }
    }

    function cancel() {
        reset();
        submit();
    }

    const dispatch = createEventDispatcher();

    function submit() {
        state.selected = selected;
        state.allSelected = allSelected;
        state.predicate = (val) => {
            return selected[val || null];
        };
        dispatch("submit");
    }
</script>

<Checkbox on:input={onAllInput} bind:checked={allSelected} label={$_("genres")}/>

<div class="genres">
    {#each Object.keys(selected) as genre}
        <Checkbox on:input={(e) => onGenreInput(e, genre)} bind:checked={selected[genre]} label={$_("genre." + genre)}/>
    {/each}
</div>

<Row>
    <Button on:click={cancel} transparent>{$_("clear")}</Button>
    <Button on:click={submit} type="submit">{$_("save")}</Button>
</Row>

<style>
    .genres {
        display: flex;
        flex-flow: column nowrap;
        gap: 8px;
        margin-top: 8px;
    }
</style>
