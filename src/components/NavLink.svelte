<script>
    import { useLocation, navigate } from "svelte-navigator";

    export let text;
    export let link;

    const location = useLocation();

    let active = false;
    $: active = $location.pathname == link;

    function nav() {
        navigate(link);
    }
</script>

<div class="link" class:active on:click={nav}>
    <div class="icon"><slot></slot></div>
    <div class="text">{text}</div>
</div>

<style>
    .link {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        color: rgb(255 255 255 / 50%);
        cursor: pointer;
        padding: 0 16px;
        transition: color 600ms ease;
    }

    .icon {
        margin-right: 8px;
        font-size: 20px;
        transform: translate(0, 3px);
    }

    .text {
        font-weight: 600;
        font-size: 14px;
    }

    .link:hover, .link.active {
        color: #fff;
        transition: color 150ms ease;
    }
</style>
