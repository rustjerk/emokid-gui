<script>
    import { quintOut } from "svelte/easing";
    import { fade } from "svelte/transition";

    export let zIndex = 998;
    export let transparent = false;
</script>

<div class:transparent transition:fade={{ duration: 500, easing: quintOut }} style="z-index: {zIndex}"></div>

<style>
    div {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(16px);
    }
</style>
