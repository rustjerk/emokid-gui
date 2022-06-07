<form on:submit|preventDefault>
    <slot></slot>
</form>

<style>
    form {
        display: flex;
        flex-flow: column nowrap;
        gap: 8px;
        height: 100%;
        box-sizing: border-box;
    }
</style>
