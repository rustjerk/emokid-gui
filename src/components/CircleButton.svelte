<script>
    import Ripples from "./Ripples.svelte";

    export let color = "#A02494";

    let ripples;
</script>

<div style="background: {color}" on:click on:click={ripples.addRipple}>
    <Ripples bind:this={ripples}/>
    <slot></slot>
</div>

<style>
    div {
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        font-size: 24px;
        color: rgb(255 255 255 / 60%);
        box-shadow: 0 3px 8px rgb(0 0 0 / 50%);
        transition: color 500ms ease, background-color 500ms ease, transform 500ms ease;
        cursor: pointer;
    }

    div:hover {
        background: #ca4bba;
        color: rgb(255 255 255 / 80%);
        transform: translate(0, -3px);
        transition: color 150ms ease, background-color 150ms ease, transform 150ms ease;
    }
</style>
