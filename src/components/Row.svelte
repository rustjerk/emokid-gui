<script>
    export let gap = 0;
</script>

<div style="gap: {gap}px">
    <slot></slot>
</div>
    
<style>
    div {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
</style>
