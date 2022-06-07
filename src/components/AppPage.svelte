<script>
    import Nav from "../components/Nav.svelte";
</script>

<div>
    <main>
        <slot></slot>
    </main>
    <Nav slot="nav"/>
</div>

<style>
    div {
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
    }

    main {
        flex: 1 1 auto;
        overflow: auto;
    }

    ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }
     
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgb(176 90 216 / 50%);
    }
</style>
