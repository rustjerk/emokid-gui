<script>
    import { createPopperActions } from "svelte-popperjs";
    import { fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { locale } from "svelte-i18n";
    import Translate from "svelte-material-icons/Translate.svelte";

    import IconButton from "./IconButton.svelte";
    import Popup from "./Popup.svelte";
    import { locales } from "../i18n.js";

    const [popperRef, popperContent] = createPopperActions({
        placement: "top-end",
        modifiers: [{
            name: "offset",
            options: { offset: [0, 16] }
        }]
    });

    const popperOpts = {};
    let visible = false;

    const setLocale = name => {
        locale.set(name);
        visible = false;
    };
</script>

<div class="button" use:popperRef>
    <IconButton on:click={() => visible = !visible}>
        <Translate/>
    </IconButton>
</div>

<Popup {visible} bottom {popperContent} on:close={() => visible = false}>
    <div class="container">
        {#each [...locales] as l}
            <div class="lang" on:click={() => setLocale(l[0])}>{l[1].name}</div>
        {/each}
    </div>
</Popup>

<style>
    .button {
        z-index: 100;
    }

    .container {
        position: relative;
        overflow: hidden;
    }

    .lang {
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 500ms ease;
    }

    .lang:hover {
        background: rgba(255, 255, 255, 0.1);
        transition: background-color 150ms ease;
    }
</style>
