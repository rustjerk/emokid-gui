<script>
    import Input from "./Input.svelte";
    import Label from "./Label.svelte";

    export let label;
    export let placeholder;
    export let required = true;

    export let value;

    export let fromRaw = (id) => id;
    export let intoRaw = (id) => id === null ? "" : "" + id;

    let rawValue = intoRaw(value);
    let error = "";
    
    $: {
        if (rawValue.trim() == "") {
            value = null;
            error = "";
        } else {
            try {
                value = fromRaw(rawValue);
                error = "";
            } catch (e) {
                error = "invalid input";
            }
        }
    }
</script>

<Label text={label} {error}>
    <Input bind:value={rawValue} {placeholder} {required}/>
</Label>
